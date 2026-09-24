const express = require('express');
const router = express.Router();
const { getSettings, updateSettings } = require('../controllers/settingsController');
const { protect, authorize } = require('../middleware/auth');

// Any logged-in role can READ settings (needed to render receipts with logo)
router.get('/', protect, getSettings);
// Only Admin can UPDATE
router.put('/', protect, authorize('admin'), updateSettings);

module.exports = router;
