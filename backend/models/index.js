const { sequelize } = require('../config/db');
const User = require('./User');
const Plot = require('./Plot');
const Transaction = require('./Transaction');
const Commission = require('./Commission');
const CommissionSetting = require('./CommissionSetting');
const Wallet = require('./Wallet');
const WalletTransaction = require('./WalletTransaction');
const Notification = require('./Notification');
const Complaint = require('./Complaint');
const Banner = require('./Banner');
const Slab = require('./Slab');
const RewardLog = require('./RewardLog');
const Payment = require('./Payment');
const EmiPlan = require('./EmiPlan');
const EmiInstallment = require('./EmiInstallment');
const AppSettings = require('./AppSettings');
const Enquiry = require('./Enquiry');

// ---------- Associations ----------

// User <-> Plot (owner)
User.hasMany(Plot, { foreignKey: 'owner_id', as: 'plots' });
Plot.belongsTo(User, { foreignKey: 'owner_id', as: 'owner' });

// User self-reference (referred_by)
User.belongsTo(User, { foreignKey: 'referred_by', as: 'referrer' });
User.hasMany(User, { foreignKey: 'referred_by', as: 'referrals' });

// Transaction relations
Transaction.belongsTo(Plot, { foreignKey: 'plot_id', as: 'plot' });
Transaction.belongsTo(User, { foreignKey: 'buyer_id', as: 'buyer' });
Transaction.belongsTo(User, { foreignKey: 'seller_id', as: 'seller' });
Transaction.belongsTo(User, { foreignKey: 'seller_associate_id', as: 'sellerAssociate' });
Transaction.belongsTo(User, { foreignKey: 'buyer_associate_id', as: 'buyerAssociate' });
User.hasMany(Transaction, { foreignKey: 'buyer_id', as: 'purchases' });
User.hasMany(Transaction, { foreignKey: 'seller_id', as: 'sales' });

// Commission relations
Commission.belongsTo(Transaction, { foreignKey: 'transaction_id', as: 'transaction' });
Commission.belongsTo(User, { foreignKey: 'user_id', as: 'earner' });
Transaction.hasMany(Commission, { foreignKey: 'transaction_id', as: 'commissions' });

// Wallet relations
Wallet.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
User.hasOne(Wallet, { foreignKey: 'user_id', as: 'wallet' });

WalletTransaction.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
User.hasMany(WalletTransaction, { foreignKey: 'user_id', as: 'walletTransactions' });

// Notification relations
Notification.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

// Complaint relations
Complaint.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

// Slab relations
User.belongsTo(Slab, { foreignKey: 'current_slab_id', as: 'currentSlab' });

// RewardLog relations
RewardLog.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
RewardLog.belongsTo(Slab, { foreignKey: 'slab_id', as: 'slab' });
RewardLog.belongsTo(Transaction, { foreignKey: 'transaction_id', as: 'transaction' });
User.hasMany(RewardLog, { foreignKey: 'user_id', as: 'rewards' });

// Payment relations
Payment.belongsTo(Transaction, { foreignKey: 'transaction_id', as: 'transaction' });
Payment.belongsTo(User, { foreignKey: 'recorded_by', as: 'recordedByUser' });
Transaction.hasMany(Payment, { foreignKey: 'transaction_id', as: 'payments' });

// EMI relations
EmiPlan.belongsTo(Transaction, { foreignKey: 'transaction_id', as: 'transaction' });
Transaction.hasOne(EmiPlan, { foreignKey: 'transaction_id', as: 'emiPlan' });

EmiInstallment.belongsTo(EmiPlan, { foreignKey: 'emi_plan_id', as: 'emiPlan' });
EmiPlan.hasMany(EmiInstallment, { foreignKey: 'emi_plan_id', as: 'installments' });

module.exports = {
  sequelize,
  User,
  Plot,
  Transaction,
  Commission,
  CommissionSetting,
  Wallet,
  WalletTransaction,
  Notification,
  Complaint,
  Banner,
  Slab,
  RewardLog,
  Payment,
  EmiPlan,
  EmiInstallment,
  AppSettings,
  Enquiry
};
