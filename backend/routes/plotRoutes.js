const express = require('express');
const router = express.Router();
const {
  getPlots, getPlot, createPlot, updatePlot, deletePlot,
  updatePlotApproval, toggleFeatured
} = require('../controllers/plotController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect, authorize('admin'));

router.get('/', getPlots);
router.post('/', createPlot);
router.get('/:id', getPlot);
router.put('/:id', updatePlot);
router.delete('/:id', deletePlot);
router.put('/:id/approval', updatePlotApproval);
router.put('/:id/feature', toggleFeatured);

module.exports = router;
