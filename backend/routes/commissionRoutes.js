const express = require('express');
const router = express.Router();
const {
  getCommissions, getCommissionSettings, updateCommissionSettings
} = require('../controllers/commissionController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect, authorize('admin'));

router.get('/', getCommissions);
router.get('/settings', getCommissionSettings);
router.put('/settings', updateCommissionSettings);

module.exports = router;
