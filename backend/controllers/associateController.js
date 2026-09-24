/**
 * ASSOCIATE CONTROLLER
 * Associate apna network build karta hai, deals me madad karta hai,
 * aur commission kamata hai. Har function me ownership check hai —
 * associate sirf apna hi data dekh/manage kar sakta hai.
 */
const bcrypt = require('bcryptjs');
const { Op } = require('sequelize');
const {
  User, Plot, Transaction, Commission, Wallet, WalletTransaction, Notification, Complaint, RewardLog, Payment, Slab
} = require('../models');
const generateReferralCode = require('../utils/generateReferralCode');
const { fetchTree, buildTree } = require('./networkController');

// @desc  Associate's own dashboard stats
// @route GET /api/associate/dashboard-stats
const getDashboardStats = async (req, res, next) => {
  try {
    const userId = req.user.id;

    // Direct team count
    const myTeamCount = await User.count({ where: { referred_by: userId } });

    // Fetch all team members recursively for team business calc
    const { fetchTree } = require('./networkController');
    const allDescendants = await fetchTree(userId);
    const descendantIds = allDescendants.map(u => u.id).filter(id => id !== userId);

    // Self business: deals I personally closed
    const selfTransactions = await Transaction.findAll({
      where: {
        [Op.or]: [{ seller_associate_id: userId }, { buyer_associate_id: userId }],
        status: 'completed'
      }
    });
    const selfBusiness = selfTransactions.reduce((sum, t) => sum + parseFloat(t.amount || 0), 0);

    // Team business: deals by anyone below me in network
    let teamBusiness = 0;
    if (descendantIds.length > 0) {
      const teamTransactions = await Transaction.findAll({
        where: {
          [Op.or]: [
            { seller_associate_id: { [Op.in]: descendantIds } },
            { buyer_associate_id: { [Op.in]: descendantIds } }
          ],
          status: 'completed'
        }
      });
      teamBusiness = teamTransactions.reduce((sum, t) => sum + parseFloat(t.amount || 0), 0);
    }

    const dealsAsSellerAssoc = await Transaction.count({ where: { seller_associate_id: userId } });
    const dealsAsBuyerAssoc = await Transaction.count({ where: { buyer_associate_id: userId } });

    const totalCommissionEarned = await Commission.sum('amount', { where: { user_id: userId } }) || 0;
    const pendingCommission = await Commission.sum('amount', { where: { user_id: userId, status: 'pending' } }) || 0;

    let wallet = await Wallet.findOne({ where: { user_id: userId } });
    if (!wallet) wallet = await Wallet.create({ user_id: userId, balance: 0 });

    const unreadNotifications = await Notification.count({ where: { user_id: userId, is_read: false } });

    // Get sponsor (referred_by) info
    let sponsoredBy = null;
    if (req.user.referred_by) {
      const sponsor = await User.findByPk(req.user.referred_by, {
        attributes: ['id', 'name', 'login_id', 'phone']
      });
      if (sponsor) {
        sponsoredBy = { id: sponsor.id, name: sponsor.name, login_id: sponsor.login_id, phone: sponsor.phone };
      }
    }

    res.json({
      success: true,
      data: {
        myTeamCount,
        totalTeamCount: descendantIds.length,
        totalDeals: dealsAsSellerAssoc + dealsAsBuyerAssoc,
        selfBusiness,
        teamBusiness,
        totalBusiness: selfBusiness + teamBusiness,
        totalCommissionEarned,
        pendingCommission,
        walletBalance: wallet.balance,
        unreadNotifications,
        referralCode: req.user.referral_code,
        sponsoredBy,
        profile: {
          id: req.user.id,
          login_id: req.user.login_id,
          name: req.user.name,
          phone: req.user.phone,
          email: req.user.email,
          address: req.user.address,
          pan_number: req.user.pan_number,
          aadhar_number: req.user.aadhar_number,
          referral_commission_percent: req.user.referral_commission_percent,
          kyc_status: req.user.kyc_status,
          last_login_at: req.user.last_login_at,
          member_since: req.user.createdAt
        }
      }
    });
  } catch (error) { next(error); }
};

// @desc  Get MY team (associates/clients I directly referred)
// @route GET /api/associate/my-team
const getMyTeam = async (req, res, next) => {
  try {
    const team = await User.findAll({
      where: { referred_by: req.user.id },
      attributes: { exclude: ['password'] },
      order: [['createdAt', 'DESC']]
    });
    res.json({ success: true, count: team.length, data: team });
  } catch (error) { next(error); }
};

// @desc  Get MY commission history
// @route GET /api/associate/commissions
const getMyCommissions = async (req, res, next) => {
  try {
    const commissions = await Commission.findAll({
      where: { user_id: req.user.id },
      include: [{ model: Transaction, as: 'transaction', include: [{ model: Plot, as: 'plot' }] }],
      order: [['createdAt', 'DESC']]
    });
    res.json({ success: true, count: commissions.length, data: commissions });
  } catch (error) { next(error); }
};

// @desc  Get MY wallet + transaction history
// @route GET /api/associate/wallet
const getMyWallet = async (req, res, next) => {
  try {
    let wallet = await Wallet.findOne({ where: { user_id: req.user.id } });
    if (!wallet) wallet = await Wallet.create({ user_id: req.user.id, balance: 0 });

    const transactions = await WalletTransaction.findAll({
      where: { user_id: req.user.id },
      order: [['createdAt', 'DESC']]
    });

    res.json({ success: true, data: { balance: wallet.balance, transactions } });
  } catch (error) { next(error); }
};

// @desc  Request a withdrawal
// @route POST /api/associate/withdraw
const requestWithdrawal = async (req, res, next) => {
  try {
    const { amount } = req.body;
    const wallet = await Wallet.findOne({ where: { user_id: req.user.id } });

    if (!wallet || parseFloat(wallet.balance) < parseFloat(amount)) {
      return res.status(400).json({ success: false, message: 'Insufficient wallet balance for this withdrawal' });
    }

    const request = await WalletTransaction.create({
      user_id: req.user.id,
      type: 'withdrawal_request',
      amount,
      description: 'Withdrawal requested by associate',
      status: 'pending'
    });

    await Notification.create({
      user_id: null,
      title: 'New Withdrawal Request',
      message: `${req.user.name} requested a withdrawal of ₹${amount}.`,
      type: 'payout'
    });

    res.status(201).json({ success: true, data: request });
  } catch (error) { next(error); }
};

// @desc  Browse plots available to promote (same marketplace as client, read-only)
// @route GET /api/associate/plots
const browsePlots = async (req, res, next) => {
  try {
    const { search, city } = req.query;
    const where = { status: 'available' };
    if (city) where.city = city;
    if (search) {
      where[Op.or] = [
        { title: { [Op.like]: `%${search}%` } },
        { location: { [Op.like]: `%${search}%` } }
      ];
    }

    const plots = await Plot.findAll({
      where,
      include: [{ model: User, as: 'owner', attributes: ['id', 'name'] }],
      order: [['is_featured', 'DESC'], ['createdAt', 'DESC']]
    });

    res.json({ success: true, count: plots.length, data: plots });
  } catch (error) { next(error); }
};

// @desc  Update MY profile
// @route PUT /api/associate/profile
const updateProfile = async (req, res, next) => {
  try {
    const { name, phone } = req.body;
    const user = await User.findByPk(req.user.id);
    await user.update({ name: name ?? user.name, phone: phone ?? user.phone });

    const { password, ...userData } = user.toJSON();
    res.json({ success: true, data: userData });
  } catch (error) { next(error); }
};

// @desc  Change MY password
// @route PUT /api/associate/change-password
const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findByPk(req.user.id);

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) return res.status(400).json({ success: false, message: 'Current password is incorrect' });

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.json({ success: true, message: 'Password updated successfully' });
  } catch (error) { next(error); }
};

// @desc  Submit KYC document
// @route POST /api/associate/kyc
const submitKyc = async (req, res, next) => {
  try {
    const { document_url } = req.body;
    const user = await User.findByPk(req.user.id);
    await user.update({ kyc_document_url: document_url, kyc_status: 'pending' });

    await Notification.create({
      user_id: null,
      title: 'New KYC Submission',
      message: `${user.name} (Associate) submitted KYC documents for review.`,
      type: 'kyc'
    });

    res.json({ success: true, message: 'KYC submitted for review', data: user });
  } catch (error) { next(error); }
};

// @desc  Get MY notifications
// @route GET /api/associate/notifications
const getMyNotifications = async (req, res, next) => {
  try {
    const notifications = await Notification.findAll({
      where: { user_id: req.user.id },
      order: [['createdAt', 'DESC']],
      limit: 50
    });
    const unreadCount = await Notification.count({ where: { user_id: req.user.id, is_read: false } });
    res.json({ success: true, data: notifications, unreadCount });
  } catch (error) { next(error); }
};

// @desc  Mark notification as read
// @route PUT /api/associate/notifications/:id/read
const markNotificationRead = async (req, res, next) => {
  try {
    const notification = await Notification.findOne({ where: { id: req.params.id, user_id: req.user.id } });
    if (!notification) return res.status(404).json({ success: false, message: 'Notification not found' });
    notification.is_read = true;
    await notification.save();
    res.json({ success: true, data: notification });
  } catch (error) { next(error); }
};

// @desc  Raise a complaint
// @route POST /api/associate/complaints
const createComplaint = async (req, res, next) => {
  try {
    const { subject, message } = req.body;
    const complaint = await Complaint.create({ user_id: req.user.id, subject, message });
    res.status(201).json({ success: true, data: complaint });
  } catch (error) { next(error); }
};

// @desc  Get MY complaints
// @route GET /api/associate/complaints
const getMyComplaints = async (req, res, next) => {
  try {
    const complaints = await Complaint.findAll({
      where: { user_id: req.user.id },
      order: [['createdAt', 'DESC']]
    });
    res.json({ success: true, data: complaints });
  } catch (error) { next(error); }
};

module.exports = {
  getDashboardStats, getMyTeam, getMyCommissions, getMyWallet, requestWithdrawal,
  browsePlots, updateProfile, changePassword, submitKyc,
  getMyNotifications, markNotificationRead, createComplaint, getMyComplaints,
  createTeamMember, getMyNetwork, getMyPlots, getMyRewards, recordPaymentForDeal,
  setTeamMemberCommission
};

// @desc  Associate adds their OWN downline member (self-service recruitment).
//        Associate decides the % themselves — but it cannot exceed their
//        own referral_commission_percent (the % they give to THEIR upline).
// @route POST /api/associate/team
async function createTeamMember(req, res, next) {
  try {
    const { name, phone, pan_number, aadhar_number, password, referral_commission_percent, email } = req.body;

    if (!pan_number || !aadhar_number) {
      return res.status(400).json({ success: false, message: 'PAN and Aadhar number are mandatory' });
    }

    const requestedPercent = parseFloat(referral_commission_percent);
    const myOwnPercent = req.user.referral_commission_percent ? parseFloat(req.user.referral_commission_percent) : 100;

    if (!requestedPercent || requestedPercent <= 0) {
      return res.status(400).json({ success: false, message: 'Please set a valid commission percentage for this team member' });
    }
    if (requestedPercent > myOwnPercent) {
      return res.status(400).json({
        success: false,
        message: `You cannot give more than your own commission percentage (${myOwnPercent}%)`
      });
    }

    const existingPhone = await User.findOne({ where: { phone } });
    if (existingPhone) return res.status(400).json({ success: false, message: 'Phone number already registered' });

    const hashedPassword = await bcrypt.hash(password || '123456', 10);
    const referral_code = generateReferralCode(name);

    const newMember = await User.create({
      name, phone, email: email || null,
      password: hashedPassword,
      role: 'associate',
      referred_by: req.user.id,
      referral_commission_percent: requestedPercent,
      pan_number, aadhar_number,
      referral_code
    });

    await Wallet.create({ user_id: newMember.id, balance: 0 });

    await Notification.create({
      user_id: null,
      title: 'New Team Member Added',
      message: `${req.user.name} added ${name} to their team at ${requestedPercent}%.`,
      type: 'general'
    });

    const { password: _, ...memberData } = newMember.toJSON();
    res.status(201).json({ success: true, data: memberData });
  } catch (error) { next(error); }
}

// @desc  Get MY network (flat list of everyone below me)
// @route GET /api/associate/network
async function getMyNetwork(req, res, next) {
  try {
    const flatList = await fetchTree(req.user.id);
    const network = flatList.filter(u => u.id !== req.user.id);
    res.json({ success: true, data: network, totalCount: network.length });
  } catch (error) { next(error); }
}

// @desc  Override commission percent for a direct downline team member
// @route PUT /api/associate/team/:id/commission
async function setTeamMemberCommission(req, res, next) {
  try {
    const downlineId = req.params.id;
    const { commission_percent } = req.body;
    
    const newPercent = parseFloat(commission_percent);
    if (isNaN(newPercent) || newPercent <= 0) {
      return res.status(400).json({ success: false, message: 'Valid commission percentage is required' });
    }

    const downlineUser = await User.findOne({ where: { id: downlineId, referred_by: req.user.id } });
    if (!downlineUser) {
      return res.status(404).json({ success: false, message: 'Team member not found or not in your direct downline' });
    }

    const myPercent = parseFloat(req.user.commission_percent) || 0;
    if (newPercent > myPercent) {
      return res.status(400).json({ 
        success: false, 
        message: `Downline commission cannot exceed your own commission (${myPercent}%)` 
      });
    }

    await downlineUser.update({ 
      commission_percent: newPercent,
      commission_set_by: 'upline' 
    });

    res.json({ success: true, message: 'Commission updated successfully', data: downlineUser });
  } catch (error) { next(error); }
}

// @desc  Plots involved in MY deals (as seller or buyer associate)
// @route GET /api/associate/my-plots
async function getMyPlots(req, res, next) {
  try {
    const transactions = await Transaction.findAll({
      where: { [Op.or]: [{ seller_associate_id: req.user.id }, { buyer_associate_id: req.user.id }] },
      include: [{ model: Plot, as: 'plot' }],
      order: [['createdAt', 'DESC']]
    });
    const plots = transactions.map((t) => ({ ...t.plot?.toJSON(), deal_amount: t.amount, transaction_id: t.id, deal_status: t.status }));
    res.json({ success: true, data: plots });
  } catch (error) { next(error); }
}

// @desc  My milestone rewards (only earned when I PERSONALLY sold, not from downline)
// @route GET /api/associate/my-rewards
async function getMyRewards(req, res, next) {
  try {
    const rewards = await RewardLog.findAll({
      where: { user_id: req.user.id },
      include: [{ model: Slab, as: 'slab' }],
      order: [['createdAt', 'DESC']]
    });
    const totalRewards = rewards.reduce((sum, r) => sum + parseFloat(r.reward_amount), 0);
    res.json({ success: true, data: rewards, totalRewards });
  } catch (error) { next(error); }
}

// @desc  Record a cash payment for a deal I'm associated with
// @route POST /api/associate/transactions/:id/payments
async function recordPaymentForDeal(req, res, next) {
  try {
    const { amount, note } = req.body;
    const transaction = await Transaction.findByPk(req.params.id);
    if (!transaction) return res.status(404).json({ success: false, message: 'Transaction not found' });

    const isInvolved = transaction.seller_associate_id === req.user.id || transaction.buyer_associate_id === req.user.id;
    if (!isInvolved) return res.status(403).json({ success: false, message: 'You are not associated with this deal' });

    await Payment.create({ transaction_id: transaction.id, amount, recorded_by: req.user.id, note: note || null });

    const newPaidAmount = parseFloat(transaction.paid_amount) + parseFloat(amount);
    transaction.paid_amount = newPaidAmount;
    transaction.payment_status = newPaidAmount >= parseFloat(transaction.amount) ? 'paid' : 'unpaid';
    await transaction.save();

    res.status(201).json({ success: true, data: transaction });
  } catch (error) { next(error); }
}
