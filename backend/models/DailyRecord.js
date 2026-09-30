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
