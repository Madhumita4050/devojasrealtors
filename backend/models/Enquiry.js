const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

// Public website enquiries (callback requests) — from anonymous visitors,
// no login required. Admin can view & follow up from Admin Panel.
const Enquiry = sequelize.define('Enquiry', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: false
  },
  preferred_location: {
    type: DataTypes.STRING,
    allowNull: true
  },
  budget: {
    type: DataTypes.STRING,
    allowNull: true
  },
  plot_size: {
    type: DataTypes.STRING,
    allowNull: true
  },
  enquiry_type: {
    type: DataTypes.STRING,
    allowNull: true
  },
  source: {
    type: DataTypes.STRING,
    defaultValue: 'Website Frontend'
  },
  status: {
    type: DataTypes.ENUM('new', 'contacted', 'closed'),
    defaultValue: 'new'
  }
}, {
  tableName: 'enquiries'
});

module.exports = Enquiry;
