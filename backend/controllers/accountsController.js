/**
 * ACCOUNTS CONTROLLER
 * Ye poora controller sirf FINANCE se related hai —
 * payment verification, payouts, invoices, reports, wallets.
 * Property/user management yaha nahi hota (wo Admin Panel me hai).
 */
const { Op } = require('sequelize');
const {
  sequelize, Transaction, Plot, User, Commission, Wallet, WalletTransaction, Notification, Complaint
} = require('../models');

// @desc  Accounts dashboard — financial overview
// @route GET /api/accounts/dashboard-stats
const getDashboardStats = async (req, res, next) => {
  try {
    const totalRevenue = await Transaction.sum('amount', { where: { status: 'completed' } }) || 0;
    const totalCommissionPaid = await Commission.sum('amount') || 0;
    const netProfit = totalRevenue - totalCommissionPaid;

    const unpaidTransactions = await Transaction.count({ where: { payment_status: { [Op.in]: ['unpaid'] } } });
    const pendingPayouts = await WalletTransaction.count({ where: { type: 'withdrawal_request', status: 'pending' } });
    const pendingPayoutAmount = await WalletTransaction.sum('amount', { where: { type: 'withdrawal_request', status: 'pending' } }) || 0;

    const totalWalletBalance = await Wallet.sum('balance') || 0;

    // Monthly revenue trend (last 6 months)
    const revenueTrend = await Transaction.findAll({
      attributes: [
        [sequelize.fn('DATE_FORMAT', sequelize.col('deal_date'), '%Y-%m'), 'month'],
        [sequelize.fn('SUM', sequelize.col('amount')), 'total']
      ],
      where: { status: 'completed' },
      group: ['month'],
      order: [[sequelize.literal('month'), 'ASC']],
      limit: 6,
      raw: true
    });

    res.json({
      success: true,
      data: {
        totalRevenue, totalCommissionPaid, netProfit,
        unpaidTransactions, pendingPayouts, pendingPayoutAmount,
        totalWalletBalance, revenueTrend
      }
    });
  } catch (error) { next(error); }
};

// @desc  Get transactions needing payment verification
// @route GET /api/accounts/payments
const getPaymentVerifications = async (req, res, next) => {
  try {
    const { payment_status } = req.query;
    const where = {};
    if (payment_status) where.payment_status = payment_status;

    const transactions = await Transaction.findAll({
      where,
      include: [
        { model: Plot, as: 'plot' },
        { model: User, as: 'buyer', attributes: ['id', 'name', 'email'] },
        { model: User, as: 'seller', attributes: ['id', 'name', 'email'] }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.json({ success: true, count: transactions.length, data: transactions });
  } catch (error) { next(error); }
};

// @desc  Mark a transaction's payment as verified/paid
// @route PUT /api/accounts/payments/:id
const updatePaymentStatus = async (req, res, next) => {
  try {
    const { payment_status } = req.body; // paid / refunded / unpaid
    const transaction = await Transaction.findByPk(req.params.id);
    if (!transaction) return res.status(404).json({ success: false, message: 'Transaction not found' });

    transaction.payment_status = payment_status;
    await transaction.save();

    await Notification.create({
      user_id: null,
      title: 'Payment Status Updated',
      message: `Transaction #${transaction.id} payment marked as ${payment_status} by Accounts.`,
      type: 'deal'
    });

    res.json({ success: true, data: transaction });
  } catch (error) { next(error); }
};

// @desc  Get all pending payout/withdrawal requests
// @route GET /api/accounts/payouts
const getPayoutRequests = async (req, res, next) => {
  try {
    const { status } = req.query;
    const where = { type: 'withdrawal_request' };
    if (status) where.status = status;
    else where.status = 'pending';

    const requests = await WalletTransaction.findAll({
      where,
      include: [{ model: User, as: 'user', attributes: ['id', 'name', 'email', 'phone', 'role'] }],
      order: [['createdAt', 'DESC']]
    });

    res.json({ success: true, data: requests });
  } catch (error) { next(error); }
};

// @desc  Approve or reject a payout request
// @route PUT /api/accounts/payouts/:id
const processPayout = async (req, res, next) => {
  try {
    const { action } = req.body; // 'approve' or 'reject'
    const request = await WalletTransaction.findByPk(req.params.id);
    if (!request) return res.status(404).json({ success: false, message: 'Request not found' });

    if (action === 'approve') {
      const wallet = await Wallet.findOne({ where: { user_id: request.user_id } });
      if (!wallet || parseFloat(wallet.balance) < parseFloat(request.amount)) {
        return res.status(400).json({ success: false, message: 'Insufficient wallet balance' });
      }
      wallet.balance = parseFloat(wallet.balance) - parseFloat(request.amount);
      await wallet.save();

      request.status = 'completed';
      request.type = 'withdrawal_approved';
      await request.save();

      // Real bank transfer would be triggered here via paymentService.processPayout()

      await Notification.create({
        user_id: request.user_id,
        title: 'Withdrawal Approved',
        message: `Your withdrawal of ₹${request.amount} has been approved and processed by Accounts.`,
        type: 'payout'
      });
    } else {
      request.status = 'rejected';
      request.type = 'withdrawal_rejected';
      await request.save();

      await Notification.create({
        user_id: request.user_id,
        title: 'Withdrawal Rejected',
        message: `Your withdrawal request of ₹${request.amount} was rejected by Accounts.`,
        type: 'payout'
      });
    }

    res.json({ success: true, data: request });
  } catch (error) { next(error); }
};

// @desc  Get a single transaction's full invoice data
// @route GET /api/accounts/invoices/:transactionId
const getInvoiceData = async (req, res, next) => {
  try {
    const transaction = await Transaction.findByPk(req.params.transactionId, {
      include: [
        { model: Plot, as: 'plot' },
        { model: User, as: 'buyer', attributes: ['id', 'name', 'email', 'phone'] },
        { model: User, as: 'seller', attributes: ['id', 'name', 'email', 'phone'] },
        { model: Commission, as: 'commissions', include: [{ model: User, as: 'earner', attributes: ['id', 'name'] }] }
      ]
    });
    if (!transaction) return res.status(404).json({ success: false, message: 'Transaction not found' });

    res.json({ success: true, data: transaction });
  } catch (error) { next(error); }
};

// @desc  List all completed transactions (for invoice list view)
// @route GET /api/accounts/invoices
const getInvoiceList = async (req, res, next) => {
  try {
    const transactions = await Transaction.findAll({
      where: { status: 'completed' },
      include: [
        { model: Plot, as: 'plot' },
        { model: User, as: 'buyer', attributes: ['id', 'name'] },
        { model: User, as: 'seller', attributes: ['id', 'name'] }
      ],
      order: [['createdAt', 'DESC']]
    });
    res.json({ success: true, data: transactions });
  } catch (error) { next(error); }
};

// @desc  Financial reports — revenue trend, top associates, commission breakdown
// @route GET /api/accounts/reports
const getFinancialReports = async (req, res, next) => {
  try {
    const revenueTrend = await Transaction.findAll({
      attributes: [
        [sequelize.fn('DATE_FORMAT', sequelize.col('deal_date'), '%Y-%m'), 'month'],
        [sequelize.fn('SUM', sequelize.col('amount')), 'revenue']
      ],
      where: { status: 'completed' },
      group: ['month'],
      order: [[sequelize.literal('month'), 'ASC']],
      raw: true
    });

    const commissionTrend = await Commission.findAll({
      attributes: [
        [sequelize.fn('DATE_FORMAT', sequelize.col('Commission.created_at'), '%Y-%m'), 'month'],
        [sequelize.fn('SUM', sequelize.col('amount')), 'commission']
      ],
      group: ['month'],
      order: [[sequelize.literal('month'), 'ASC']],
      raw: true
    });

    const topEarners = await Commission.findAll({
      attributes: ['user_id', [sequelize.fn('SUM', sequelize.col('amount')), 'total']],
      group: ['user_id'],
      order: [[sequelize.literal('total'), 'DESC']],
      limit: 5,
      include: [{ model: User, as: 'earner', attributes: ['name'] }]
    });

    res.json({ success: true, data: { revenueTrend, commissionTrend, topEarners } });
  } catch (error) { next(error); }
};

// @desc  Get all wallets (audit overview)
// @route GET /api/accounts/wallets
const getAllWallets = async (req, res, next) => {
  try {
    const wallets = await Wallet.findAll({
      include: [{ model: User, as: 'user', attributes: ['id', 'name', 'email', 'role'] }],
      order: [['balance', 'DESC']]
    });
    res.json({ success: true, count: wallets.length, data: wallets });
  } catch (error) { next(error); }
};

// @desc  Export all transactions as raw data (frontend converts to CSV)
// @route GET /api/accounts/export/transactions
const exportTransactions = async (req, res, next) => {
  try {
    const transactions = await Transaction.findAll({
      include: [
        { model: Plot, as: 'plot', attributes: ['title', 'location'] },
        { model: User, as: 'buyer', attributes: ['name'] },
        { model: User, as: 'seller', attributes: ['name'] }
      ],
      order: [['createdAt', 'DESC']]
    });
    res.json({ success: true, data: transactions });
  } catch (error) { next(error); }
};

// @desc  Raise a complaint (accounts team internal query to admin)
// @route POST /api/accounts/complaints
const createComplaint = async (req, res, next) => {
  try {
    const { subject, message } = req.body;
    const complaint = await Complaint.create({ user_id: req.user.id, subject, message });
    res.status(201).json({ success: true, data: complaint });
  } catch (error) { next(error); }
};

// @desc  Get MY complaints
// @route GET /api/accounts/complaints
const getMyComplaints = async (req, res, next) => {
  try {
    const complaints = await Complaint.findAll({
      where: { user_id: req.user.id },
      order: [['createdAt', 'DESC']]
    });
    res.json({ success: true, data: complaints });
  } catch (error) { next(error); }
};

// @desc  Get MY notifications
// @route GET /api/accounts/notifications
const getMyNotifications = async (req, res, next) => {
  try {
    const notifications = await Notification.findAll({
      where: { user_id: null }, // Accounts sees global/admin-level notifications too
      order: [['createdAt', 'DESC']],
      limit: 50
    });
    const unreadCount = await Notification.count({ where: { user_id: null, is_read: false } });
    res.json({ success: true, data: notifications, unreadCount });
  } catch (error) { next(error); }
};

module.exports = {
  getDashboardStats, getPaymentVerifications, updatePaymentStatus,
  getPayoutRequests, processPayout, getInvoiceData, getInvoiceList,
  getFinancialReports, getAllWallets, exportTransactions,
  createComplaint, getMyComplaints, getMyNotifications
};
