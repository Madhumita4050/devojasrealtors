const { sequelize, User, Plot, Transaction, Commission, Wallet, Complaint } = require('../models');
const { Op } = require('sequelize');

// @desc Get dashboard overview stats (ALL LIVE FROM DB, NO HARDCODE)
// @route GET /api/dashboard/stats
const getStats = async (req, res, next) => {
  try {
    const totalPlots = await Plot.count();
    const availablePlots = await Plot.count({ where: { status: 'available' } });
    const soldPlots = await Plot.count({ where: { status: 'sold' } });
    const pendingPlots = await Plot.count({ where: { status: 'pending' } });

    const totalClients = await User.count({ where: { role: 'client' } });
    const totalAssociates = await User.count({ where: { role: 'associate' } });
    const pendingKyc = await User.count({ where: { kyc_status: 'pending' } });

    const totalTransactions = await Transaction.count();
    const completedTransactions = await Transaction.count({ where: { status: 'completed' } });

    const totalRevenue = await Transaction.sum('amount', { where: { status: 'completed' } }) || 0;
    const totalCommissionPaid = await Commission.sum('amount') || 0;
    const netProfit = totalRevenue - totalCommissionPaid;

    const pendingComplaints = await Complaint.count({ where: { status: 'open' } });

    // Monthly sales trend (last 6 months)
    const salesTrend = await Transaction.findAll({
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
        totalPlots, availablePlots, soldPlots, pendingPlots,
        totalClients, totalAssociates, pendingKyc,
        totalTransactions, completedTransactions,
        totalRevenue, totalCommissionPaid, netProfit,
        pendingComplaints,
        salesTrend
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getStats };
