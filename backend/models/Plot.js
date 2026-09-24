const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Plot = sequelize.define('Plot', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT
  },
  location: {
    type: DataTypes.STRING,
    allowNull: false
  },
  city: {
    type: DataTypes.STRING
  },
  size_sqft: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  price: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false
  },
  owner_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: 'Client who owns/listed this plot'
  },
  image_url: {
    type: DataTypes.STRING
  },
  status: {
    type: DataTypes.ENUM('pending', 'approved', 'rejected', 'available', 'sold', 'under_negotiation'),
    defaultValue: 'pending'
  },
  is_featured: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  // ---------- Website frontend fields (optional — for rich plot display) ----------
  block: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: 'e.g. "Block A" — used by the public website inventory display'
  },
  plot_number: {
    type: DataTypes.STRING,
    allowNull: true
  },
  dimensions: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: 'e.g. "40x60 ft"'
  },
  road_width: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: 'e.g. "30 ft"'
  },
  facing: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: 'e.g. "East", "North"'
  },
  is_corner: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  tableName: 'plots'
});

module.exports = Plot;
