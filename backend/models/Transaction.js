const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Transaction = sequelize.define('Transaction', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  plot_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  buyer_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  seller_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  seller_associate_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: 'Associate who helped seller'
  },
  buyer_associate_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: 'Associate who helped buyer'
  },
  amount: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('pending', 'completed', 'cancelled'),
    defaultValue: 'pending'
  },
  payment_status: {
    type: DataTypes.ENUM('unpaid', 'paid', 'refunded'),
    defaultValue: 'unpaid'
  },
  paid_amount: {
    type: DataTypes.DECIMAL(15, 2),
    defaultValue: 0,
    comment: 'Running total of cash received against this deal'
  },
  deal_date: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  is_self_sale: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    comment: 'True if the associate creating the transaction is themselves the buyer/seller associate'
  }
}, {
  tableName: 'transactions'
});

module.exports = Transaction;
