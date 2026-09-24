const express = require('express');
const router = express.Router();
const { getFullTree } = require('../controllers/networkController');
const { protect, authorize } = require('../middleware/auth');

router.get('/full-tree', protect, authorize('admin'), getFullTree);
router.get('/full', protect, authorize('admin'), getFullTree);

module.exports = router;
