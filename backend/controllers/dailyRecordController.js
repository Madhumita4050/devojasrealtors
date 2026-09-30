const { DailyRecord, User } = require('../models');

exports.getDailyRecords = async (req, res) => {
  try {
    const records = await DailyRecord.findAll({
      include: [
        { model: User, as: 'creator', attributes: ['id', 'name', 'role'] }
      ],
      order: [['record_date', 'DESC'], ['createdAt', 'DESC']]
    });
    res.json({ success: true, data: records });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createDailyRecord = async (req, res) => {
  try {
    const { title, description, type, amount, record_date } = req.body;
    const record = await DailyRecord.create({
      title,
      description,
      type,
      amount,
      record_date,
      created_by: req.user.id
    });
    res.status(201).json({ success: true, data: record });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateDailyRecord = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, type, amount, record_date } = req.body;
    
    const record = await DailyRecord.findByPk(id);
    if (!record) return res.status(404).json({ success: false, message: 'Record not found' });
    
    // Allow admin or the creator to edit
    if (req.user.role !== 'admin' && record.created_by !== req.user.id) {
       return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    await record.update({
      title,
      description,
      type,
      amount,
      record_date,
      updated_by: req.user.id
    });
    
    res.json({ success: true, data: record });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteDailyRecord = async (req, res) => {
  try {
    const { id } = req.params;
    const record = await DailyRecord.findByPk(id);
    if (!record) return res.status(404).json({ success: false, message: 'Record not found' });
    
    // Optionally only admin can delete
    if (req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    await record.destroy();
    res.json({ success: true, message: 'Record deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
