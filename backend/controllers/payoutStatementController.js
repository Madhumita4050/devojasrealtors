const { PayoutStatement, User, Slab } = require('../models');
const { Op } = require('sequelize');

// Helper: Find slab for a given total business amount
const findSlab = async (totalBusiness) => {
  const amount = parseFloat(totalBusiness) || 0;
  const slab = await Slab.findOne({
    where: {
      min_amount: { [Op.lte]: amount },
      max_amount: { [Op.gte]: amount }
    },
    order: [['min_amount', 'ASC']]
  });
  return slab;
};

// Helper: Calculate all amounts
const calculate = (data) => {
  const selfBusiness = parseFloat(data.self_business) || 0;
  const teamBusiness = parseFloat(data.team_business) || 0;
  const totalBusiness = selfBusiness + teamBusiness;
  const slabPercent = parseFloat(data.slab_percent) || 0;
  const tdsPercent = parseFloat(data.tds_percent) ?? 5;
  const processingPercent = parseFloat(data.processing_percent) ?? 2;

  const selfDeposit = parseFloat((selfBusiness * slabPercent / 100).toFixed(2));
  const teamDeposit = parseFloat((teamBusiness * slabPercent / 100).toFixed(2));
  const totalAmount = parseFloat((selfDeposit + teamDeposit).toFixed(2));
  const tdsAmount = parseFloat((totalAmount * tdsPercent / 100).toFixed(2));
  const processingAmount = parseFloat((totalAmount * processingPercent / 100).toFixed(2));
  const netPayable = parseFloat((totalAmount - tdsAmount - processingAmount).toFixed(2));

  return { totalBusiness, selfDeposit, teamDeposit, totalAmount, tdsAmount, processingAmount, netPayable };
};

// @desc Get slab suggestion based on business amount
// @route GET /api/payout-statements/slab-lookup?amount=xxx
const slabLookup = async (req, res, next) => {
  try {
    const amount = parseFloat(req.query.amount) || 0;
    const slab = await findSlab(amount);
    res.json({ success: true, data: slab });
  } catch (error) { next(error); }
};

// @desc Create payout statement (Accounts)
// @route POST /api/payout-statements
const createPayoutStatement = async (req, res, next) => {
  try {
    const { associate_id, payment_date, self_business, team_business, slab_percent, tds_percent, processing_percent, notes } = req.body;

    // Auto-find slab
    const totalBusiness = (parseFloat(self_business) || 0) + (parseFloat(team_business) || 0);
    const slab = await findSlab(totalBusiness);

    const effectiveSlabPercent = slab_percent !== undefined ? parseFloat(slab_percent) : (slab?.percentage || 0);
    const effectiveTds = tds_percent !== undefined ? parseFloat(tds_percent) : 5;
    const effectiveProcessing = processing_percent !== undefined ? parseFloat(processing_percent) : 2;

    const calc = calculate({ self_business, team_business, slab_percent: effectiveSlabPercent, tds_percent: effectiveTds, processing_percent: effectiveProcessing });

    const statement = await PayoutStatement.create({
      associate_id,
      created_by: req.user.id,
      payment_date,
      self_business: parseFloat(self_business) || 0,
      team_business: parseFloat(team_business) || 0,
      total_business: calc.totalBusiness,
      slab_id: slab?.id || null,
      slab_percent: effectiveSlabPercent,
      reward_amount: slab?.reward_amount || 0,
      tds_percent: effectiveTds,
      processing_percent: effectiveProcessing,
      notes,
      ...calc
    });

    const full = await PayoutStatement.findByPk(statement.id, {
      include: [
        { model: User, as: 'associate', attributes: ['id', 'name', 'phone', 'login_id'] },
        { model: Slab, as: 'slab' }
      ]
    });

    res.status(201).json({ success: true, data: full });
  } catch (error) { next(error); }
};

// @desc Get all payout statements (Admin/Accounts = all, Associate = their own)
// @route GET /api/payout-statements
const getPayoutStatements = async (req, res, next) => {
  try {
    const where = {};
    if (req.user.role === 'associate') where.associate_id = req.user.id;
    if (req.query.associate_id) where.associate_id = req.query.associate_id;

    const statements = await PayoutStatement.findAll({
      where,
      include: [
        { model: User, as: 'associate', attributes: ['id', 'name', 'phone', 'login_id'] },
        { model: User, as: 'creator', attributes: ['id', 'name', 'role'] },
        { model: Slab, as: 'slab' }
      ],
      order: [['payment_date', 'DESC'], ['createdAt', 'DESC']]
    });

    res.json({ success: true, data: statements });
  } catch (error) { next(error); }
};

// @desc Get single payout statement
// @route GET /api/payout-statements/:id
const getPayoutStatement = async (req, res, next) => {
  try {
    const stmt = await PayoutStatement.findByPk(req.params.id, {
      include: [
        { model: User, as: 'associate', attributes: ['id', 'name', 'phone', 'login_id'] },
        { model: User, as: 'creator', attributes: ['id', 'name', 'role'] },
        { model: Slab, as: 'slab' }
      ]
    });
    if (!stmt) return res.status(404).json({ success: false, message: 'Statement not found' });
    if (req.user.role === 'associate' && stmt.associate_id !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }
    res.json({ success: true, data: stmt });
  } catch (error) { next(error); }
};

// @desc Update payout statement (Accounts)
// @route PUT /api/payout-statements/:id
const updatePayoutStatement = async (req, res, next) => {
  try {
    const stmt = await PayoutStatement.findByPk(req.params.id);
    if (!stmt) return res.status(404).json({ success: false, message: 'Statement not found' });

    const merged = { ...stmt.toJSON(), ...req.body };
    const totalBusiness = (parseFloat(merged.self_business) || 0) + (parseFloat(merged.team_business) || 0);
    const slab = req.body.slab_percent !== undefined ? null : await findSlab(totalBusiness);
    const effectiveSlabPercent = req.body.slab_percent !== undefined ? parseFloat(req.body.slab_percent) : (slab?.percentage || stmt.slab_percent);
    const calc = calculate({ ...merged, slab_percent: effectiveSlabPercent });

    await stmt.update({
      ...req.body,
      total_business: calc.totalBusiness,
      slab_percent: effectiveSlabPercent,
      ...calc
    });

    res.json({ success: true, data: stmt });
  } catch (error) { next(error); }
};

// @desc Delete payout statement
// @route DELETE /api/payout-statements/:id
const deletePayoutStatement = async (req, res, next) => {
  try {
    const stmt = await PayoutStatement.findByPk(req.params.id);
    if (!stmt) return res.status(404).json({ success: false, message: 'Statement not found' });
    await stmt.destroy();
    res.json({ success: true, message: 'Statement deleted' });
  } catch (error) { next(error); }
};

// @desc Get all associates list (for Accounts dropdown)
// @route GET /api/payout-statements/associates
const getAssociatesList = async (req, res, next) => {
  try {
    const associates = await User.findAll({
      where: { role: 'associate', status: 'active' },
      attributes: ['id', 'name', 'login_id', 'phone', 'referral_commission_percent'],
      order: [['name', 'ASC']]
    });
    res.json({ success: true, data: associates });
  } catch (error) { next(error); }
};

module.exports = {
  slabLookup,
  createPayoutStatement,
  getPayoutStatements,
  getPayoutStatement,
  updatePayoutStatement,
  deletePayoutStatement,
  getAssociatesList
};
