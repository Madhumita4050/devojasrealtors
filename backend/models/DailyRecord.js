const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const DailyRecord = sequelize.define('DailyRecord', {
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT
  },
  type: {
    type: DataTypes.ENUM('income', 'expense', 'other'),
    defaultValue: 'income'
  },
  amount: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false
  },
  record_date: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  // NEW FIELDS
  category: {
    type: DataTypes.STRING,
    defaultValue: 'General'
  },
  party_name: {
    type: DataTypes.STRING
  },
  party_phone: {
    type: DataTypes.STRING
  },
  payment_mode: {
    type: DataTypes.ENUM('Cash', 'UPI', 'Bank Transfer (NEFT/RTGS)', 'Cheque'),
    defaultValue: 'Cash'
  },
  reference_no: {
    type: DataTypes.STRING
  },
  created_by: {
    type: DataTypes.INTEGER
  },
  updated_by: {
    type: DataTypes.INTEGER
  }
}, {
  timestamps: true
});

module.exports = DailyRecord;
