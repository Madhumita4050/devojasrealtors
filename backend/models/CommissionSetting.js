const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

// Global commission percentage configuration (editable by admin)
const CommissionSetting = sequelize.define('CommissionSetting', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  seller_associate_percent: {
    type: DataTypes.FLOAT,
    defaultValue: 3.0
  },
  seller_referrer_percent: {
    type: DataTypes.FLOAT,
    defaultValue: 1.0
  },
  buyer_associate_percent: {
    type: DataTypes.FLOAT,
    defaultValue: 1.5
  },
  buyer_referrer_percent: {
    type: DataTypes.FLOAT,
    defaultValue: 0.5
  }
}, {
  tableName: 'commission_settings'
});

module.exports = CommissionSetting;
