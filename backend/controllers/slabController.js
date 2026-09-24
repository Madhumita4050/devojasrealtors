const { Slab } = require('../models');

// @desc  Get all slabs (ordered)
// @route GET /api/slabs
const getSlabs = async (req, res, next) => {
  try {
    const slabs = await Slab.findAll({ order: [['slab_number', 'ASC']] });
    res.json({ success: true, data: slabs });
  } catch (error) { next(error); }
};

// @desc  Create a slab
// @route POST /api/slabs
const createSlab = async (req, res, next) => {
  try {
    const slab = await Slab.create(req.body);
    res.status(201).json({ success: true, data: slab });
  } catch (error) { next(error); }
};

// @desc  Update a slab (min/max/percentage/reward — all admin editable, nothing hardcoded)
// @route PUT /api/slabs/:id
const updateSlab = async (req, res, next) => {
  try {
    const slab = await Slab.findByPk(req.params.id);
    if (!slab) return res.status(404).json({ success: false, message: 'Slab not found' });
    await slab.update(req.body);
    res.json({ success: true, data: slab });
  } catch (error) { next(error); }
};

// @desc  Delete a slab
// @route DELETE /api/slabs/:id
const deleteSlab = async (req, res, next) => {
  try {
    const slab = await Slab.findByPk(req.params.id);
    if (!slab) return res.status(404).json({ success: false, message: 'Slab not found' });
    await slab.destroy();
    res.json({ success: true, message: 'Slab deleted' });
  } catch (error) { next(error); }
};

module.exports = { getSlabs, createSlab, updateSlab, deleteSlab };
