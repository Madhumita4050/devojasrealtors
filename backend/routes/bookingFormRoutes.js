const express = require('express');
const router = express.Router();
const { 
  createBookingForm,
  getBookingForms,
  getBookingForm,
  updateBookingForm,
  deleteBookingForm,
  updateBookingFormStatus
} = require('../controllers/bookingFormController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);

router.route('/')
  .post(createBookingForm)
  .get(getBookingForms);

router.route('/:id')
  .get(getBookingForm)
  .put(updateBookingForm)
  .delete(deleteBookingForm);

router.put('/:id/status', authorize('admin', 'accounts'), updateBookingFormStatus);

module.exports = router;
