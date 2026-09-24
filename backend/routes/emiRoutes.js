const express = require('express');
const router = express.Router();
const { createEmiPlan, getEmiPlan, markInstallmentPaid } = require('../controllers/emiController');
const { protect, authorize } = require('../middleware/auth');

// Admin + Accounts both can manage EMI plans/payments
router.post('/transactions/:id/emi', protect, authorize('admin', 'accounts'), createEmiPlan);
router.get('/transactions/:id/emi', protect, authorize('admin', 'accounts'), getEmiPlan);
router.put('/installments/:id/pay', protect, authorize('admin', 'accounts'), markInstallmentPaid);

module.exports = router;
