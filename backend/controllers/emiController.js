/**
 * EMI CONTROLLER
 * Admin/Accounts creates an EMI plan for a transaction — remaining amount
 * is split into equal monthly installments, auto-generated. Nothing here
 * is hardcoded; all numbers come from what's entered when the plan is made.
 */
const { EmiPlan, EmiInstallment, Transaction, User } = require('../models');

// @desc  Create EMI plan for a transaction + auto-generate installment rows
// @route POST /api/transactions/:id/emi
const createEmiPlan = async (req, res, next) => {
  try {
    const { down_payment, num_months, start_date } = req.body;
    const transaction = await Transaction.findByPk(req.params.id);
    if (!transaction) return res.status(404).json({ success: false, message: 'Transaction not found' });

    const existing = await EmiPlan.findOne({ where: { transaction_id: transaction.id } });
    if (existing) return res.status(400).json({ success: false, message: 'EMI plan already exists for this transaction' });

    const totalAmount = parseFloat(transaction.amount);
    const downPayment = parseFloat(down_payment) || 0;
    const remaining = totalAmount - downPayment;
    const months = parseInt(num_months);
    const monthlyAmount = Math.round((remaining / months) * 100) / 100;

    const plan = await EmiPlan.create({
      transaction_id: transaction.id,
      total_amount: totalAmount,
      down_payment: downPayment,
      num_months: months,
      monthly_amount: monthlyAmount,
      start_date,
      created_by: req.user.id
    });

    // Auto-generate installment rows
    const installments = [];
    const baseDate = new Date(start_date);
    for (let i = 1; i <= months; i++) {
      const dueDate = new Date(baseDate);
      dueDate.setMonth(dueDate.getMonth() + i);
      installments.push({
        emi_plan_id: plan.id,
        month_number: i,
        due_date: dueDate.toISOString().split('T')[0],
        amount: i === months ? remaining - monthlyAmount * (months - 1) : monthlyAmount, // last month absorbs rounding difference
        status: 'pending'
      });
    }
    await EmiInstallment.bulkCreate(installments);

    // If a down payment was taken, record it against the transaction's paid_amount immediately
    if (downPayment > 0) {
      transaction.paid_amount = parseFloat(transaction.paid_amount) + downPayment;
      transaction.payment_status = transaction.paid_amount >= totalAmount ? 'paid' : 'unpaid';
      await transaction.save();
    }

    const fullPlan = await EmiPlan.findByPk(plan.id, { include: [{ model: EmiInstallment, as: 'installments' }] });
    res.status(201).json({ success: true, data: fullPlan });
  } catch (error) { next(error); }
};

// @desc  Get EMI plan + installments for a transaction
// @route GET /api/transactions/:id/emi
const getEmiPlan = async (req, res, next) => {
  try {
    const plan = await EmiPlan.findOne({
      where: { transaction_id: req.params.id },
      include: [{ model: EmiInstallment, as: 'installments', order: [['month_number', 'ASC']] }],
      order: [[{ model: EmiInstallment, as: 'installments' }, 'month_number', 'ASC']]
    });
    if (!plan) return res.json({ success: true, data: null });
    res.json({ success: true, data: plan });
  } catch (error) { next(error); }
};

// @desc  Mark a specific installment as paid (updates transaction paid_amount too)
// @route PUT /api/emi/installments/:id/pay
const markInstallmentPaid = async (req, res, next) => {
  try {
    const installment = await EmiInstallment.findByPk(req.params.id, {
      include: [{ model: EmiPlan, as: 'emiPlan' }]
    });
    if (!installment) return res.status(404).json({ success: false, message: 'Installment not found' });
    if (installment.status === 'paid') return res.status(400).json({ success: false, message: 'Already marked as paid' });

    installment.status = 'paid';
    installment.paid_on = new Date();
    installment.recorded_by = req.user.id;
    await installment.save();

    const transaction = await Transaction.findByPk(installment.emiPlan.transaction_id);
    transaction.paid_amount = parseFloat(transaction.paid_amount) + parseFloat(installment.amount);
    transaction.payment_status = transaction.paid_amount >= parseFloat(transaction.amount) ? 'paid' : 'unpaid';
    await transaction.save();

    res.json({ success: true, data: installment });
  } catch (error) { next(error); }
};

module.exports = { createEmiPlan, getEmiPlan, markInstallmentPaid };
