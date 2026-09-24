const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Commission = sequelize.define('Commission', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  transaction_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: 'Associate who earns this commission'
  },
  role_level: {
    type: DataTypes.ENUM('seller_associate', 'seller_referrer', 'buyer_associate', 'buyer_referrer'),
    allowNull: false
  },
  percent: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  amount: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('pending', 'credited', 'paid'),
    defaultValue: 'pending'
  }
}, {
  tableName: 'commissions'
});

module.exports = Commission;
