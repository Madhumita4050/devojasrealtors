const express = require('express');
const router = express.Router();
const { getComplaints, updateComplaintStatus, deleteComplaint } = require('../controllers/complaintController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect, authorize('admin'));

router.get('/', getComplaints);
router.put('/:id', updateComplaintStatus);
router.delete('/:id', deleteComplaint);

module.exports = router;
