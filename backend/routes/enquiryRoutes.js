const express = require('express');
const router = express.Router();
const { getEnquiries, updateEnquiryStatus } = require('../controllers/enquiryController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect, authorize('admin'));

router.get('/', getEnquiries);
router.put('/:id', updateEnquiryStatus);

module.exports = router;
