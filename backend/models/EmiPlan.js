const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

// One EMI plan per transaction — splits remaining amount into monthly installments
const EmiPlan = sequelize.define('EmiPlan', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  transaction_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true
  },
  total_amount: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false
  },
  down_payment: {
    type: DataTypes.DECIMAL(15, 2),
    defaultValue: 0
  },
  num_months: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  monthly_amount: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false
  },
  start_date: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  created_by: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  tableName: 'emi_plans'
});

module.exports = EmiPlan;
