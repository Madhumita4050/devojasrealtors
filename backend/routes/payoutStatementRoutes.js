const express = require('express');
const router = express.Router();
const {
  slabLookup,
  createPayoutStatement,
  getPayoutStatements,
  getPayoutStatement,
  updatePayoutStatement,
  deletePayoutStatement,
  getAssociatesList
} = require('../controllers/payoutStatementController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);

// Slab lookup (accounts + admin use it)
router.get('/slab-lookup', authorize('admin', 'accounts'), slabLookup);

// Associates list for dropdown
router.get('/associates', authorize('admin', 'accounts'), getAssociatesList);

// CRUD
router.route('/')
  .get(getPayoutStatements) // all roles (associate sees own, accounts/admin sees all)
  .post(authorize('admin', 'accounts'), createPayoutStatement);

router.route('/:id')
  .get(getPayoutStatement)
  .put(authorize('admin', 'accounts'), updatePayoutStatement)
  .delete(authorize('admin', 'accounts'), deletePayoutStatement);

module.exports = router;
