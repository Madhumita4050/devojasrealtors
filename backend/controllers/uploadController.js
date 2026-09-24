// @desc  Upload a single file (e.g. company logo) and return its public URL
// @route POST /api/upload
const uploadFile = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }
    const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    res.status(201).json({ success: true, url: fileUrl, filename: req.file.filename });
  } catch (error) {
    next(error);
  }
};

module.exports = { uploadFile };
