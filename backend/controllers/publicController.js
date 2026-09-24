/**
 * PUBLIC CONTROLLER — No login required.
 * Ye endpoints external/marketing website ke liye hain (jo aapki team
 * bana rahi hai). Jab bhi Admin Panel se koi plot "sold" ya "available"
 * mark hota hai, ye API turant wahi latest data deta hai — same database,
 * do jagah dikhta hai (Admin Panel + external website).
 */
const { Plot, User, Enquiry } = require('../models');

// @desc  Public list of all plots (available + sold + booked/under_negotiation), safe fields only
// @route GET /api/public/plots
const getPublicPlots = async (req, res, next) => {
  try {
    const { status, city, search } = req.query;
    const where = {};
    if (status) where.status = status;
    else where.status = { [require('sequelize').Op.in]: ['available', 'sold', 'under_negotiation'] };
    if (city) where.city = city;
    if (search) {
      where[require('sequelize').Op.or] = [
        { title: { [require('sequelize').Op.like]: `%${search}%` } },
        { location: { [require('sequelize').Op.like]: `%${search}%` } }
      ];
    }

    const plots = await Plot.findAll({
      where,
      attributes: [
        'id', 'title', 'description', 'location', 'city', 'size_sqft', 'price', 'image_url',
        'status', 'is_featured', 'createdAt',
        'block', 'plot_number', 'dimensions', 'road_width', 'facing', 'is_corner'
      ],
      order: [['is_featured', 'DESC'], ['createdAt', 'DESC']]
    });

    res.json({ success: true, count: plots.length, data: plots });
  } catch (error) { next(error); }
};

// @desc  Public single plot detail (no sensitive owner info)
// @route GET /api/public/plots/:id
const getPublicPlotDetail = async (req, res, next) => {
  try {
    const plot = await Plot.findByPk(req.params.id, {
      attributes: [
        'id', 'title', 'description', 'location', 'city', 'size_sqft', 'price', 'image_url',
        'status', 'is_featured', 'createdAt',
        'block', 'plot_number', 'dimensions', 'road_width', 'facing', 'is_corner'
      ]
    });
    if (!plot || !['available', 'sold', 'under_negotiation'].includes(plot.status)) {
      return res.status(404).json({ success: false, message: 'Plot not found' });
    }
    res.json({ success: true, data: plot });
  } catch (error) { next(error); }
};

// @desc  Public enquiry/callback-request submission (from the marketing website, no login)
// @route POST /api/public/enquiries
const submitPublicEnquiry = async (req, res, next) => {
  try {
    const { name, phone, preferredLocation, budget, plotSize, enquiryType, source } = req.body;
    if (!name || !phone) {
      return res.status(400).json({ success: false, message: 'Name and phone are required' });
    }

    const enquiry = await Enquiry.create({
      name, phone,
      preferred_location: preferredLocation || null,
      budget: budget || null,
      plot_size: plotSize || null,
      enquiry_type: enquiryType || null,
      source: source || 'Website Frontend'
    });

    res.status(201).json({ success: true, data: enquiry });
  } catch (error) { next(error); }
};

module.exports = { getPublicPlots, getPublicPlotDetail, submitPublicEnquiry };
