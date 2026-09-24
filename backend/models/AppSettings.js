const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

// Single-row settings table — company name & logo used on receipts/PDFs.
// Admin-editable, no hardcoding anywhere in the frontend.
const AppSettings = sequelize.define('AppSettings', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  company_name: {
    type: DataTypes.STRING,
    defaultValue: 'DEVOJAS REALTORS'
  },
  tagline: {
    type: DataTypes.STRING,
    defaultValue: 'Your Trusted Real Estate Partner'
  },
  company_logo_url: {
    type: DataTypes.STRING,
    allowNull: true
  },
  company_phone: {
    type: DataTypes.STRING,
    allowNull: true
  },
  company_email: {
    type: DataTypes.STRING,
    allowNull: true
  },
  company_address: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  company_gst: {
    type: DataTypes.STRING,
    allowNull: true
  },
  company_rera: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  tableName: 'app_settings'
});

module.exports = AppSettings;
