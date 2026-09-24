const express = require('express');
const router = express.Router();
const {
  getTransactions, getTransaction, createTransaction, updateTransaction, deleteTransaction,
  recordPayment, getReceipt, getTransactionPdf
} = require('../controllers/transactionController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect, authorize('admin'));

router.get('/', getTransactions);
router.post('/', createTransaction);
router.get('/:id', getTransaction);
router.put('/:id', updateTransaction);
router.delete('/:id', deleteTransaction);
router.post('/:id/payments', recordPayment);
router.get('/:id/receipt', getReceipt);
router.get('/:id/pdf', getTransactionPdf);

module.exports = router;
