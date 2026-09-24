/**
 * Seed Super Admin — Run once: node seedAdmin.js
 * Creates a Super Admin account if none exists.
 *
 * Super Admin Credentials:
 *   Email:    admin@devojasrealtors.in
 *   Password: Admin@123
 *   Login ID: DEV-0001 (auto-generated)
 */

require('dotenv').config();
const bcrypt = require('bcryptjs');
const { sequelize, connectDB } = require('./config/db');
const { User, Wallet } = require('./models');
const generateReferralCode = require('./utils/generateReferralCode');

const ADMIN_EMAIL    = 'admin@devojasrealtors.in';
const ADMIN_PASSWORD = 'Admin@123';
const ADMIN_PHONE    = '9999999999';
const ADMIN_NAME     = 'Super Admin';

const generateLoginId = (userId) => `DEV-${String(userId).padStart(4, '0')}`;

(async () => {
  try {
    await connectDB();
    await sequelize.sync({ alter: true });

    // Check if any admin already exists
    const existing = await User.findOne({ where: { role: 'admin' } });
    if (existing) {
      console.log('✅ Admin already exists:');
      console.log(`   Login ID : ${existing.login_id}`);
      console.log(`   Email    : ${existing.email}`);
      console.log(`   Phone    : ${existing.phone}`);
      console.log('   (Password unchanged — use whatever was set earlier)');
      process.exit(0);
    }

    const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 10);
    const referral_code = generateReferralCode(ADMIN_NAME);

    const admin = await User.create({
      name: ADMIN_NAME,
      email: ADMIN_EMAIL,
      phone: ADMIN_PHONE,
      password: hashedPassword,
      role: 'admin',
      referral_code,
      kyc_status: 'approved',
      status: 'active'
    });

    const login_id = generateLoginId(admin.id);
    await admin.update({ login_id });
    await Wallet.create({ user_id: admin.id, balance: 0 });

    console.log('');
    console.log('🎉 Super Admin created successfully!');
    console.log('─────────────────────────────────────');
    console.log(`   Login ID : ${login_id}`);
    console.log(`   Email    : ${ADMIN_EMAIL}`);
    console.log(`   Phone    : ${ADMIN_PHONE}`);
    console.log(`   Password : ${ADMIN_PASSWORD}`);
    console.log('─────────────────────────────────────');
    console.log('');

    process.exit(0);
  } catch (err) {
    console.error('❌ Error seeding admin:', err.message);
    process.exit(1);
  }
})();
