const { Wallet, WalletTransaction, User, Notification } = require('../models');

// @desc Get all wallets
// @route GET /api/wallets
const getWallets = async (req, res, next) => {
  try {
    const wallets = await Wallet.findAll({
      include: [{ model: User, as: 'user', attributes: ['id', 'name', 'email', 'role'] }],
      order: [['balance', 'DESC']]
    });
    res.json({ success: true, count: wallets.length, data: wallets });
  } catch (error) {
    next(error);
  }
};

// @desc Get wallet transactions of a specific user
// @route GET /api/wallets/:userId/transactions
const getWalletTransactions = async (req, res, next) => {
  try {
    const transactions = await WalletTransaction.findAll({
      where: { user_id: req.params.userId },
      order: [['createdAt', 'DESC']]
    });
    res.json({ success: true, data: transactions });
  } catch (error) {
    next(error);
  }
};

// @desc Get all pending withdrawal requests
// @route GET /api/wallets/withdrawals
const getWithdrawalRequests = async (req, res, next) => {
  try {
    const requests = await WalletTransaction.findAll({
      where: { type: 'withdrawal_request', status: 'pending' },
      include: [{ model: User, as: 'user', attributes: ['id', 'name', 'email', 'phone'] }],
      order: [['createdAt', 'DESC']]
    });
    res.json({ success: true, data: requests });
  } catch (error) {
    next(error);
  }
};

// @desc Approve or reject a withdrawal request
// @route PUT /api/wallets/withdrawals/:id
const processWithdrawal = async (req, res, next) => {
  try {
    const { action } = req.body; // 'approve' or 'reject'
    const request = await WalletTransaction.findByPk(req.params.id);
    if (!request) return res.status(404).json({ success: false, message: 'Request not found' });

    if (action === 'approve') {
      const wallet = await Wallet.findOne({ where: { user_id: request.user_id } });
      if (parseFloat(wallet.balance) < parseFloat(request.amount)) {
        return res.status(400).json({ success: false, message: 'Insufficient wallet balance' });
      }
      wallet.balance = parseFloat(wallet.balance) - parseFloat(request.amount);
      await wallet.save();

      request.status = 'completed';
      request.type = 'withdrawal_approved';
      await request.save();

      // NOTE: Actual bank transfer would be called here via paymentService.processPayout()

      await Notification.create({
        user_id: request.user_id,
        title: 'Withdrawal Approved',
        message: `Your withdrawal of ₹${request.amount} has been approved and processed.`,
        type: 'payout'
      });
    } else {
      request.status = 'rejected';
      request.type = 'withdrawal_rejected';
      await request.save();

      await Notification.create({
        user_id: request.user_id,
        title: 'Withdrawal Rejected',
        message: `Your withdrawal request of ₹${request.amount} was rejected.`,
        type: 'payout'
      });
    }

    res.json({ success: true, data: request });
  } catch (error) {
    next(error);
  }
};

module.exports = { getWallets, getWalletTransactions, getWithdrawalRequests, processWithdrawal };
