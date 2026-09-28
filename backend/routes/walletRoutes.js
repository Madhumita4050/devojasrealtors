const express = require('express');
const router = express.Router();
const {
  getWallets, getWalletTransactions, getWithdrawalRequests, processWithdrawal, addFunds
} = require('../controllers/walletController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect, authorize('admin'));

router.get('/', getWallets);
router.get('/withdrawals', getWithdrawalRequests);
router.put('/withdrawals/:id', processWithdrawal);
router.get('/:userId/transactions', getWalletTransactions);
router.post('/:userId/add-funds', addFunds);

module.exports = router;
