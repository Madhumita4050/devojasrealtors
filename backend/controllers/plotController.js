const { Op } = require('sequelize');
const { Plot, User, Notification } = require('../models');

// @desc Get all plots
// @route GET /api/plots
const getPlots = async (req, res, next) => {
  try {
    const { status, search, city } = req.query;
    const where = {};
    if (status) where.status = status;
    if (city) where.city = city;
    if (search) {
      where[Op.or] = [
        { title: { [Op.like]: `%${search}%` } },
        { location: { [Op.like]: `%${search}%` } }
      ];
    }

    const plots = await Plot.findAll({
      where,
      include: [{ model: User, as: 'owner', attributes: ['id', 'name', 'email', 'phone'] }],
      order: [['createdAt', 'DESC']]
    });

    res.json({ success: true, count: plots.length, data: plots });
  } catch (error) {
    next(error);
  }
};

// @desc Get single plot
// @route GET /api/plots/:id
const getPlot = async (req, res, next) => {
  try {
    const plot = await Plot.findByPk(req.params.id, {
      include: [{ model: User, as: 'owner', attributes: ['id', 'name', 'email', 'phone'] }]
    });
    if (!plot) return res.status(404).json({ success: false, message: 'Plot not found' });
    res.json({ success: true, data: plot });
  } catch (error) {
    next(error);
  }
};

// @desc Create plot
// @route POST /api/plots
const createPlot = async (req, res, next) => {
  try {
    const plot = await Plot.create(req.body);

    await Notification.create({
      user_id: null,
      title: 'New Plot Submitted',
      message: `Plot "${plot.title}" has been submitted and needs approval.`,
      type: 'plot'
    });

    res.status(201).json({ success: true, data: plot });
  } catch (error) {
    next(error);
  }
};

// @desc Update plot
// @route PUT /api/plots/:id
const updatePlot = async (req, res, next) => {
  try {
    const plot = await Plot.findByPk(req.params.id);
    if (!plot) return res.status(404).json({ success: false, message: 'Plot not found' });

    await plot.update(req.body);
    res.json({ success: true, data: plot });
  } catch (error) {
    next(error);
  }
};

// @desc Delete plot
// @route DELETE /api/plots/:id
const deletePlot = async (req, res, next) => {
  try {
    const plot = await Plot.findByPk(req.params.id);
    if (!plot) return res.status(404).json({ success: false, message: 'Plot not found' });
    await plot.destroy();
    res.json({ success: true, message: 'Plot deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// @desc Approve/Reject plot
// @route PUT /api/plots/:id/approval
const updatePlotApproval = async (req, res, next) => {
  try {
    const { status } = req.body; // approved -> available, rejected
    const plot = await Plot.findByPk(req.params.id);
    if (!plot) return res.status(404).json({ success: false, message: 'Plot not found' });

    plot.status = status === 'approved' ? 'available' : 'rejected';
    await plot.save();

    res.json({ success: true, data: plot });
  } catch (error) {
    next(error);
  }
};

// @desc Toggle featured
// @route PUT /api/plots/:id/feature
const toggleFeatured = async (req, res, next) => {
  try {
    const plot = await Plot.findByPk(req.params.id);
    if (!plot) return res.status(404).json({ success: false, message: 'Plot not found' });

    plot.is_featured = !plot.is_featured;
    await plot.save();

    res.json({ success: true, data: plot });
  } catch (error) {
    next(error);
  }
};

module.exports = { getPlots, getPlot, createPlot, updatePlot, deletePlot, updatePlotApproval, toggleFeatured };
