const { AppSettings } = require('../models');

// @desc  Get company settings (name + logo + contact) — used on receipts/PDFs
// @route GET /api/settings
const getSettings = async (req, res, next) => {
  try {
    let settings = await AppSettings.findOne();
    if (!settings) settings = await AppSettings.create({});
    res.json({ success: true, data: settings });
  } catch (error) { next(error); }
};

// @desc  Update company settings (Admin only)
// @route PUT /api/settings
const updateSettings = async (req, res, next) => {
  try {
    let settings = await AppSettings.findOne();
    if (!settings) settings = await AppSettings.create({});

    const {
      company_name,
      tagline,
      company_logo_url,
      company_phone,
      company_email,
      company_address,
      company_gst,
      company_rera
    } = req.body;

    await settings.update({
      company_name: company_name !== undefined ? company_name : settings.company_name,
      tagline: tagline !== undefined ? tagline : settings.tagline,
      company_logo_url: company_logo_url !== undefined ? company_logo_url : settings.company_logo_url,
      company_phone: company_phone !== undefined ? company_phone : settings.company_phone,
      company_email: company_email !== undefined ? company_email : settings.company_email,
      company_address: company_address !== undefined ? company_address : settings.company_address,
      company_gst: company_gst !== undefined ? company_gst : settings.company_gst,
      company_rera: company_rera !== undefined ? company_rera : settings.company_rera,
    });

    res.json({ success: true, message: 'Settings updated successfully', data: settings });
  } catch (error) { next(error); }
};

module.exports = { getSettings, updateSettings };
