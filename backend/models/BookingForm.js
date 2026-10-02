const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const BookingForm = sequelize.define('BookingForm', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  associate_id: { type: DataTypes.INTEGER, allowNull: true },
  
  // Plot Price Details
  project_name: { type: DataTypes.STRING },
  plot_size: { type: DataTypes.STRING },
  sector_no: { type: DataTypes.STRING },
  plot_no: { type: DataTypes.STRING },
  rate_per_sqft: { type: DataTypes.DECIMAL(10, 2) },
  basic_plot_price: { type: DataTypes.DECIMAL(10, 2) },
  corner_percent: { type: DataTypes.DECIMAL(5, 2) },
  park_facing_percent: { type: DataTypes.DECIMAL(5, 2) },
  plot_length: { type: DataTypes.DECIMAL(10, 2) },
  plot_width: { type: DataTypes.DECIMAL(10, 2) },
  check_no: { type: DataTypes.STRING },
  upi_id: { type: DataTypes.STRING },
  bank_name: { type: DataTypes.STRING },
  month: { type: DataTypes.STRING },
  referred_id: { type: DataTypes.STRING },

  // Payment Plan Option
  payment_plan_type: { type: DataTypes.ENUM('full', 'emi'), defaultValue: 'full' },
  total_plot_price: { type: DataTypes.DECIMAL(10, 2) },
  payment_mode: { type: DataTypes.STRING }, // e.g. Cash, Cheque, NEFT, etc.
  
  // EMI specifics
  emi_duration_months: { type: DataTypes.INTEGER, allowNull: true },
  down_payment_amt: { type: DataTypes.DECIMAL(10, 2), allowNull: true },

  // Applicant Details
  applicant_name: { type: DataTypes.STRING },
  applicant_phone: { type: DataTypes.STRING },
  applicant_date: { type: DataTypes.DATEONLY },
  applicant_place: { type: DataTypes.STRING },

  // Status
  status: { type: DataTypes.ENUM('pending', 'approved', 'rejected'), defaultValue: 'pending' },
  rejection_reason: { type: DataTypes.TEXT, allowNull: true },
  
  // Office Use
  approved_by: { type: DataTypes.INTEGER, allowNull: true },
  approved_at: { type: DataTypes.DATE, allowNull: true }
}, {
  tableName: 'booking_forms',
  timestamps: true
});

module.exports = BookingForm;
