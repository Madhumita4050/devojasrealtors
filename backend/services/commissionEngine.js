/**
 * COMMISSION ENGINE
 * --------------------------------------------------------------
 * Core logic for the advanced slab + referral-chain commission system.
 * Nothing here is hardcoded — slab %/rewards come from the `slabs`
 * table (admin editable), and upline %s come from each user's own
 * `referral_commission_percent` (set by whoever recruited them).
 *
 * Called once per "closing associate" (the person who personally
 * facilitated a sale) from transactionController.createTransaction.
 * --------------------------------------------------------------
 */
const { User, Slab, Commission, RewardLog, Wallet, WalletTransaction, Notification } = require('../models');

// Find which slab a given business-volume amount falls into
const findSlabForAmount = async (amount) => {
  return Slab.findOne({
    where: {
      min_amount: { [require('sequelize').Op.lte]: amount },
      max_amount: { [require('sequelize').Op.gt]: amount }
    },
    order: [['slab_number', 'ASC']]
  });
};

/**
 * Processes commission for ONE closing associate on ONE transaction.
 * - Updates their total_business_volume + current_slab_id
 * - Credits their own slab-based commission
 * - Grants a one-time milestone reward IF they crossed into a new slab
 * - Walks up the referred_by chain, crediting each ancestor using
 *   THEIR OWN referral_commission_percent (the % the person below them
 *   agreed to give them) — continues until the chain ends
 *
 * @param {number} closingAssociateId - associate who personally closed the deal
 * @param {number} dealAmount
 * @param {number} transactionId
 * @param {string} sideLabel - 'seller_side' | 'buyer_side' (just for labeling role_level)
 * @param {object} dbTransaction - sequelize transaction for atomicity
 */
const processCommissionForAssociate = async (closingAssociateId, dealAmount, transactionId, sideLabel, isSelfSale, dbTransaction) => {
  const closingUser = await User.findByPk(closingAssociateId, { transaction: dbTransaction });
  if (!closingUser) return [];

  const results = [];
  const parsedDealAmount = parseFloat(dealAmount);

  // ---------- 1. Update total business volume & check for auto-upgrade ----------
  closingUser.total_business_volume = parseFloat(closingUser.total_business_volume) + parsedDealAmount;
  
  if (isSelfSale) {
    closingUser.self_business_volume = parseFloat(closingUser.self_business_volume) + parsedDealAmount;
  }

  const currentSlab = await findSlabForAmount(closingUser.total_business_volume);
  closingUser.current_slab_id = currentSlab ? currentSlab.id : null;

  // Auto-upgrade commission percent if system managed and new slab provides higher %
  if (currentSlab && closingUser.commission_set_by === 'system') {
    if (currentSlab.percentage > closingUser.commission_percent) {
      closingUser.commission_percent = currentSlab.percentage;
    }
  }

  await closingUser.save({ transaction: dbTransaction });

  // ---------- 2. Credit closing associate's commission ----------
  const closingPercent = parseFloat(closingUser.commission_percent) || 0;
  if (closingPercent > 0) {
    const ownCommissionAmount = (parsedDealAmount * closingPercent) / 100;
    const commission = await Commission.create({
      transaction_id: transactionId,
      user_id: closingUser.id,
      role_level: sideLabel === 'seller_side' ? 'seller_associate' : 'buyer_associate',
      percent: closingPercent,
      amount: ownCommissionAmount,
      status: 'credited'
    }, { transaction: dbTransaction });
    results.push(commission);

    await creditWallet(closingUser.id, ownCommissionAmount, `Commission (${closingPercent}%) - Transaction #${transactionId}`, dbTransaction);
  }

  // ---------- 3. Reward logic (Self-Sell Only) ----------
  if (isSelfSale && currentSlab && currentSlab.self_target_amount > 0 && currentSlab.reward_amount > 0) {
    // Check if they crossed the self_target_amount for this slab
    const selfVolume = parseFloat(closingUser.self_business_volume);
    
    // We only want to give the reward once per slab. 
    // Check if we already gave a reward for this specific slab to this user.
    const existingReward = await RewardLog.findOne({
      where: { user_id: closingUser.id, slab_id: currentSlab.id },
      transaction: dbTransaction
    });

    if (!existingReward && selfVolume >= parseFloat(currentSlab.self_target_amount)) {
      await RewardLog.create({
        user_id: closingUser.id,
        slab_id: currentSlab.id,
        transaction_id: transactionId,
        reward_amount: currentSlab.reward_amount
      }, { transaction: dbTransaction });

      // Add reward as a wallet transaction
      await creditWallet(closingUser.id, currentSlab.reward_amount, `Milestone reward - reached Slab ${currentSlab.slab_number} Self Target`, dbTransaction);

      await Notification.create({
        user_id: closingUser.id,
        title: 'Milestone Reward Unlocked! 🎉',
        message: `You reached Slab ${currentSlab.slab_number} self target and earned a reward of ₹${currentSlab.reward_amount}.`,
        type: 'payout'
      }, { transaction: dbTransaction });
    }
  }

  // ---------- 4. Walk up the referral chain (Differential Margin) ----------
  let currentUser = closingUser;
  let currentPercentToBeat = closingPercent;
  let level = 1;

  while (currentUser.referred_by) {
    const upline = await User.findByPk(currentUser.referred_by, { transaction: dbTransaction });
    if (!upline) break;

    const uplinePercent = parseFloat(upline.commission_percent) || 0;
    
    // Upline earns the difference between their % and the downline's %
    if (uplinePercent > currentPercentToBeat) {
      const marginPercent = uplinePercent - currentPercentToBeat;
      const uplineAmount = (parsedDealAmount * marginPercent) / 100;
      
      const commission = await Commission.create({
        transaction_id: transactionId,
        user_id: upline.id,
        role_level: sideLabel === 'seller_side' ? 'seller_referrer' : 'buyer_referrer',
        percent: marginPercent,
        amount: uplineAmount,
        status: 'credited'
      }, { transaction: dbTransaction });
      results.push(commission);

      await creditWallet(upline.id, uplineAmount, `Override margin (${marginPercent}%) from ${closingUser.name}'s deal - Transaction #${transactionId}`, dbTransaction);
      
      // The new percent to beat for the next upline is this upline's percent
      currentPercentToBeat = uplinePercent;
    }

    currentUser = upline;
    level += 1;
    if (level > 50) break; // safety guard
  }

  return results;
};

// Helper: credit a user's wallet + log the wallet transaction
const creditWallet = async (userId, amount, description, dbTransaction) => {
  let wallet = await Wallet.findOne({ where: { user_id: userId }, transaction: dbTransaction });
  if (!wallet) wallet = await Wallet.create({ user_id: userId, balance: 0 }, { transaction: dbTransaction });

  wallet.balance = parseFloat(wallet.balance) + parseFloat(amount);
  await wallet.save({ transaction: dbTransaction });

  await WalletTransaction.create({
    user_id: userId,
    type: 'credit',
    amount,
    description,
    status: 'completed'
  }, { transaction: dbTransaction });
};

module.exports = { processCommissionForAssociate, findSlabForAmount };
