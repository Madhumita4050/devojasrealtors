const express = require('express');
const router = express.Router();
const {
  getDashboardStats, getPaymentVerifications, updatePaymentStatus,
  getPayoutRequests, processPayout, getInvoiceData, getInvoiceList,
  getFinancialReports, getAllWallets, exportTransactions,
  createComplaint, getMyComplaints, getMyNotifications
} = require('../controllers/accountsController');
const { protect, authorize } = require('../middleware/auth');

// Every route here is protected AND restricted to role = 'accounts'
router.use(protect, authorize('accounts'));

router.get('/dashboard-stats', getDashboardStats);

router.get('/payments', getPaymentVerifications);
router.put('/payments/:id', updatePaymentStatus);

router.get('/payouts', getPayoutRequests);
router.put('/payouts/:id', processPayout);

router.get('/invoices', getInvoiceList);
router.get('/invoices/:transactionId', getInvoiceData);

router.get('/reports', getFinancialReports);
router.get('/wallets', getAllWallets);
router.get('/export/transactions', exportTransactions);

router.post('/complaints', createComplaint);
router.get('/complaints', getMyComplaints);

router.get('/notifications', getMyNotifications);

module.exports = router;
