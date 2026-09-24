const { Commission, CommissionSetting, User, Transaction } = require('../models');

// @desc Get all commissions (with filters)
// @route GET /api/commissions
const getCommissions = async (req, res, next) => {
  try {
    const { user_id, status } = req.query;
    const where = {};
    if (user_id) where.user_id = user_id;
    if (status) where.status = status;

    const commissions = await Commission.findAll({
      where,
      include: [
        { model: User, as: 'earner', attributes: ['id', 'name', 'email'] },
        { model: Transaction, as: 'transaction' }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.json({ success: true, count: commissions.length, data: commissions });
  } catch (error) {
    next(error);
  }
};

// @desc Get current commission settings
// @route GET /api/commissions/settings
const getCommissionSettings = async (req, res, next) => {
  try {
    let settings = await CommissionSetting.findOne();
    if (!settings) settings = await CommissionSetting.create({});
    res.json({ success: true, data: settings });
  } catch (error) {
    next(error);
  }
};

// @desc Update commission settings (Admin only)
// @route PUT /api/commissions/settings
const updateCommissionSettings = async (req, res, next) => {
  try {
    let settings = await CommissionSetting.findOne();
    if (!settings) settings = await CommissionSetting.create({});

    await settings.update(req.body);
    res.json({ success: true, data: settings });
  } catch (error) {
    next(error);
  }
};

module.exports = { getCommissions, getCommissionSettings, updateCommissionSettings };
