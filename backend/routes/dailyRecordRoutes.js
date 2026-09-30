const express = require('express');
const router = express.Router();
const { getDailyRecords, createDailyRecord, updateDailyRecord, deleteDailyRecord } = require('../controllers/dailyRecordController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);

// Accounts and Admin can access
router.route('/')
  .get(authorize('admin', 'accounts'), getDailyRecords)
  .post(authorize('admin', 'accounts'), createDailyRecord);

router.route('/:id')
  .put(authorize('admin', 'accounts'), updateDailyRecord)
  .delete(authorize('admin'), deleteDailyRecord);

module.exports = router;
