const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const PayoutStatement = sequelize.define('PayoutStatement', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  associate_id: { type: DataTypes.INTEGER, allowNull: false },
  created_by: { type: DataTypes.INTEGER, allowNull: true }, // accounts user id

  payment_date: { type: DataTypes.DATEONLY, allowNull: false },

  // Business figures
  self_business: { type: DataTypes.DECIMAL(15, 2), defaultValue: 0 },
  team_business: { type: DataTypes.DECIMAL(15, 2), defaultValue: 0 },
  total_business: { type: DataTypes.DECIMAL(15, 2), defaultValue: 0 },

  // Slab info (auto-filled based on total_business)
  slab_id: { type: DataTypes.INTEGER, allowNull: true },
  slab_percent: { type: DataTypes.FLOAT, defaultValue: 0 },
  reward_amount: { type: DataTypes.DECIMAL(15, 2), defaultValue: 0 },

  // Calculation
  self_deposit: { type: DataTypes.DECIMAL(15, 2), defaultValue: 0 },   // self_business * slab_percent / 100
  team_deposit: { type: DataTypes.DECIMAL(15, 2), defaultValue: 0 },   // team_business * slab_percent / 100
  total_amount: { type: DataTypes.DECIMAL(15, 2), defaultValue: 0 },   // self_deposit + team_deposit
  tds_percent: { type: DataTypes.FLOAT, defaultValue: 5 },             // default 5%
  tds_amount: { type: DataTypes.DECIMAL(15, 2), defaultValue: 0 },     // total_amount * tds_percent / 100
  processing_percent: { type: DataTypes.FLOAT, defaultValue: 2 },       // default 2%
  processing_amount: { type: DataTypes.DECIMAL(15, 2), defaultValue: 0 }, // total_amount * processing_percent / 100
  net_payable: { type: DataTypes.DECIMAL(15, 2), defaultValue: 0 },    // total_amount - tds - processing

  notes: { type: DataTypes.TEXT, allowNull: true },
  status: { type: DataTypes.ENUM('draft', 'published'), defaultValue: 'published' }
}, {
  tableName: 'payout_statements',
  timestamps: true
});

module.exports = PayoutStatement;
