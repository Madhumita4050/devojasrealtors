const express = require('express');
const router = express.Router();
const {
  getPlots, getPlot, createPlot, updatePlot, deletePlot,
  updatePlotApproval, toggleFeatured
} = require('../controllers/plotController');
const { protect, authorize } = require('../middleware/auth');
const { Plot } = require('../models');
const { Op } = require('sequelize');

// ── PUBLIC route (no auth required) — for the public website plot inventory ──
router.get('/public', async (req, res, next) => {
  try {
    const { status, location } = req.query;
    const where = { status: { [Op.in]: ['available', 'sold'] } };
    if (status && status !== 'all') where.status = status;
    if (location) where.location = { [Op.like]: `%${location}%` };

    const plots = await Plot.findAll({
      where,
      attributes: ['id', 'title', 'location', 'city', 'block', 'plot_number', 'size_sqft', 'price', 'dimensions', 'road_width', 'facing', 'is_corner', 'status', 'image_url', 'description'],
      order: [['status', 'ASC'], ['title', 'ASC']]
    });
    res.json({ success: true, count: plots.length, data: plots });
  } catch (err) { next(err); }
});

router.use(protect, authorize('admin'));

router.get('/', getPlots);
router.post('/', createPlot);
router.get('/:id', getPlot);
router.put('/:id', updatePlot);
router.delete('/:id', deletePlot);
router.put('/:id/approval', updatePlotApproval);
router.put('/:id/feature', toggleFeatured);

module.exports = router;
