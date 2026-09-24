-- ============================================================
-- REAL ESTATE ADMIN PANEL - DATABASE SCHEMA (MySQL)
-- ============================================================
-- NOTE: Aapko ye file manually run karne ki zaroorat NAHI hai.
-- Backend start hote hi (server.js -> sequelize.sync) ye saari
-- tables AUTOMATICALLY ban jaati hain.
-- Ye file sirf REFERENCE ke liye di gayi hai taaki aap schema
-- samajh sako ya kisi aur tool (phpMyAdmin etc.) me manually
-- dekh/import kar sako.
-- ============================================================

CREATE DATABASE IF NOT EXISTS realestate_admin;
USE realestate_admin;

CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  phone VARCHAR(20) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('admin','client','associate','accounts') DEFAULT 'client',
  referred_by INT NULL,
  kyc_status ENUM('pending','approved','rejected','not_submitted') DEFAULT 'not_submitted',
  kyc_document_url VARCHAR(255),
  status ENUM('active','blocked') DEFAULT 'active',
  referral_code VARCHAR(50) UNIQUE,
  created_at DATETIME,
  updated_at DATETIME,
  FOREIGN KEY (referred_by) REFERENCES users(id)
);

CREATE TABLE plots (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  location VARCHAR(255) NOT NULL,
  city VARCHAR(100),
  size_sqft FLOAT NOT NULL,
  price DECIMAL(15,2) NOT NULL,
  owner_id INT NOT NULL,
  image_url VARCHAR(255),
  status ENUM('pending','approved','rejected','available','sold','under_negotiation') DEFAULT 'pending',
  is_featured BOOLEAN DEFAULT FALSE,
  created_at DATETIME,
  updated_at DATETIME,
  FOREIGN KEY (owner_id) REFERENCES users(id)
);

CREATE TABLE transactions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  plot_id INT NOT NULL,
  buyer_id INT NOT NULL,
  seller_id INT NOT NULL,
  seller_associate_id INT NULL,
  buyer_associate_id INT NULL,
  amount DECIMAL(15,2) NOT NULL,
  status ENUM('pending','completed','cancelled') DEFAULT 'pending',
  payment_status ENUM('unpaid','paid','refunded') DEFAULT 'unpaid',
  deal_date DATETIME,
  created_at DATETIME,
  updated_at DATETIME,
  FOREIGN KEY (plot_id) REFERENCES plots(id),
  FOREIGN KEY (buyer_id) REFERENCES users(id),
  FOREIGN KEY (seller_id) REFERENCES users(id)
);

CREATE TABLE commission_settings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  seller_associate_percent FLOAT DEFAULT 3.0,
  seller_referrer_percent FLOAT DEFAULT 1.0,
  buyer_associate_percent FLOAT DEFAULT 1.5,
  buyer_referrer_percent FLOAT DEFAULT 0.5,
  created_at DATETIME,
  updated_at DATETIME
);

CREATE TABLE commissions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  transaction_id INT NOT NULL,
  user_id INT NOT NULL,
  role_level ENUM('seller_associate','seller_referrer','buyer_associate','buyer_referrer') NOT NULL,
  percent FLOAT NOT NULL,
  amount DECIMAL(15,2) NOT NULL,
  status ENUM('pending','credited','paid') DEFAULT 'pending',
  created_at DATETIME,
  updated_at DATETIME,
  FOREIGN KEY (transaction_id) REFERENCES transactions(id),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE wallets (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL UNIQUE,
  balance DECIMAL(15,2) DEFAULT 0,
  created_at DATETIME,
  updated_at DATETIME,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE wallet_transactions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  type ENUM('credit','debit','withdrawal_request','withdrawal_approved','withdrawal_rejected') NOT NULL,
  amount DECIMAL(15,2) NOT NULL,
  description VARCHAR(255),
  status ENUM('pending','completed','rejected') DEFAULT 'completed',
  created_at DATETIME,
  updated_at DATETIME,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE notifications (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NULL,
  title VARCHAR(255) NOT NULL,
  message VARCHAR(500) NOT NULL,
  type ENUM('kyc','deal','payout','plot','general') DEFAULT 'general',
  is_read BOOLEAN DEFAULT FALSE,
  created_at DATETIME,
  updated_at DATETIME,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE complaints (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  subject VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  status ENUM('open','in_progress','resolved') DEFAULT 'open',
  created_at DATETIME,
  updated_at DATETIME,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE banners (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  image_url VARCHAR(255) NOT NULL,
  link_url VARCHAR(255),
  is_active BOOLEAN DEFAULT TRUE,
  created_at DATETIME,
  updated_at DATETIME
);
