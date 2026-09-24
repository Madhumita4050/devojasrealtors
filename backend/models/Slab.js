const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

// Business-volume based commission slabs — fully admin-editable, no hardcoding.
// Ye wahi table hai jo client ne diya tha (Sl no, Slab range, %, Reward)
const Slab = sequelize.define('Slab', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  slab_number: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true
  },
  min_amount: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false
  },
  max_amount: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false
  },
  percentage: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  reward_amount: {
    type: DataTypes.DECIMAL(15, 2),
    defaultValue: 0
  },
  self_target_amount: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: true
  }
}, {
  tableName: 'slabs'
});

module.exports = Slab;
