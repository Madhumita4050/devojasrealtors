const { BookingForm, User } = require('../models');

// @desc Create a new booking form (Associate)
// @route POST /api/booking-forms
const createBookingForm = async (req, res, next) => {
  try {
    const formData = req.body;
    formData.associate_id = req.user.id;
    formData.status = 'pending';

    const form = await BookingForm.create(formData);
    res.status(201).json({ success: true, message: 'Booking form submitted and is pending approval', data: form });
  } catch (error) {
    next(error);
  }
};

// @desc Get all booking forms (Admin/Accounts can see all, Associate sees their own)
// @route GET /api/booking-forms
const getBookingForms = async (req, res, next) => {
  try {
    const where = {};
    if (req.user.role === 'associate') {
      where.associate_id = req.user.id;
    }

    const forms = await BookingForm.findAll({
      where,
      include: [
        { model: User, as: 'associate', attributes: ['id', 'name', 'phone', 'login_id'] },
        { model: User, as: 'approver', attributes: ['id', 'name', 'role'] }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.json({ success: true, data: forms });
  } catch (error) {
    next(error);
  }
};

// @desc Get a single booking form
// @route GET /api/booking-forms/:id
const getBookingForm = async (req, res, next) => {
  try {
    const form = await BookingForm.findByPk(req.params.id, {
      include: [
        { model: User, as: 'associate', attributes: ['id', 'name', 'phone', 'login_id'] },
        { model: User, as: 'approver', attributes: ['id', 'name', 'role'] }
      ]
    });

    if (!form) return res.status(404).json({ success: false, message: 'Booking form not found' });

    // Associate can only view their own
    if (req.user.role === 'associate' && form.associate_id !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    res.json({ success: true, data: form });
  } catch (error) {
    next(error);
  }
};

// @desc Update booking form (Admin/Accounts can edit all, Associate can edit if pending)
// @route PUT /api/booking-forms/:id
const updateBookingForm = async (req, res, next) => {
  try {
    const form = await BookingForm.findByPk(req.params.id);
    if (!form) return res.status(404).json({ success: false, message: 'Booking form not found' });

    if (req.user.role === 'associate') {
      if (form.associate_id !== req.user.id) {
        return res.status(403).json({ success: false, message: 'Not authorized' });
      }
      if (form.status !== 'pending') {
        return res.status(400).json({ success: false, message: 'Cannot edit processed form' });
      }
    }

    await form.update(req.body);
    res.json({ success: true, message: 'Booking form updated', data: form });
  } catch (error) {
    next(error);
  }
};

// @desc Delete booking form
// @route DELETE /api/booking-forms/:id
const deleteBookingForm = async (req, res, next) => {
  try {
    const form = await BookingForm.findByPk(req.params.id);
    if (!form) return res.status(404).json({ success: false, message: 'Booking form not found' });

    if (req.user.role === 'associate') {
      if (form.associate_id !== req.user.id) {
        return res.status(403).json({ success: false, message: 'Not authorized' });
      }
      if (form.status !== 'pending') {
        return res.status(400).json({ success: false, message: 'Cannot delete processed form' });
      }
    }

    await form.destroy();
    res.json({ success: true, message: 'Booking form deleted' });
  } catch (error) {
    next(error);
  }
};

// @desc Approve/Reject booking form (Admin/Accounts only)
// @route PUT /api/booking-forms/:id/status
const updateBookingFormStatus = async (req, res, next) => {
  try {
    const { status, rejection_reason } = req.body;
    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }

    const form = await BookingForm.findByPk(req.params.id);
    if (!form) return res.status(404).json({ success: false, message: 'Booking form not found' });

    await form.update({
      status,
      rejection_reason: status === 'rejected' ? rejection_reason : null,
      approved_by: req.user.id,
      approved_at: new Date()
    });

    res.json({ success: true, message: `Booking form ${status}`, data: form });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createBookingForm,
  getBookingForms,
  getBookingForm,
  updateBookingForm,
  deleteBookingForm,
  updateBookingFormStatus
};
