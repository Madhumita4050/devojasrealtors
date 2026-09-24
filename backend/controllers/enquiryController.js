const { Enquiry } = require('../models');

// @desc  Get all website enquiries (Admin only)
// @route GET /api/enquiries
const getEnquiries = async (req, res, next) => {
  try {
    const { status } = req.query;
    const where = {};
    if (status) where.status = status;

    const enquiries = await Enquiry.findAll({ where, order: [['createdAt', 'DESC']] });
    res.json({ success: true, count: enquiries.length, data: enquiries });
  } catch (error) { next(error); }
};

// @desc  Update enquiry status (new/contacted/closed)
// @route PUT /api/enquiries/:id
const updateEnquiryStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const enquiry = await Enquiry.findByPk(req.params.id);
    if (!enquiry) return res.status(404).json({ success: false, message: 'Enquiry not found' });
    enquiry.status = status;
    await enquiry.save();
    res.json({ success: true, data: enquiry });
  } catch (error) { next(error); }
};

module.exports = { getEnquiries, updateEnquiryStatus };
