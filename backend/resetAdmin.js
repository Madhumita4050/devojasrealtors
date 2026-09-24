/**
 * RESET ADMIN — Run: node resetAdmin.js
 * Forcefully updates (or creates) the Super Admin account with fresh credentials.
 *
 *   Email    : admin@devojasrealtors.in
 *   Password : Devojas@2024
 *   Login ID : DEV-0001
 */

require('dotenv').config();
const bcrypt = require('bcryptjs');
const { sequelize, connectDB } = require('./config/db');
const { User, Wallet } = require('./models');

const ADMIN_EMAIL    = 'admin@devojasrealtors.in';
const ADMIN_PASSWORD = 'Devojas@2024';
const ADMIN_PHONE    = '9999999999';
const ADMIN_NAME     = 'Super Admin';

(async () => {
  try {
    await connectDB();
    // No sync needed — just update the admin record directly

    const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 10);

    let admin = await User.findOne({ where: { role: 'admin' } });

    if (admin) {
      // Update existing admin
      await admin.update({
        email: ADMIN_EMAIL,
        password: hashedPassword,
        phone: ADMIN_PHONE,
        name: ADMIN_NAME,
        status: 'active',
        kyc_status: 'approved',
        login_id: `DEV-${String(admin.id).padStart(4, '0')}`,
      });
      console.log('');
      console.log('✅ Admin password RESET successfully!');
    } else {
      // Create fresh admin
      const referral_code = 'ADMINDEV';
      admin = await User.create({
        name: ADMIN_NAME,
        email: ADMIN_EMAIL,
        phone: ADMIN_PHONE,
        password: hashedPassword,
        role: 'admin',
        referral_code,
        kyc_status: 'approved',
        status: 'active',
      });
      const login_id = `DEV-${String(admin.id).padStart(4, '0')}`;
      await admin.update({ login_id });
      await Wallet.create({ user_id: admin.id, balance: 0 });
      console.log('');
      console.log('🎉 Fresh Admin created successfully!');
    }

    console.log('─────────────────────────────────────────');
    console.log(`   Login ID : DEV-${String(admin.id).padStart(4, '0')}`);
    console.log(`   Email    : ${ADMIN_EMAIL}`);
    console.log(`   Phone    : ${ADMIN_PHONE}`);
    console.log(`   Password : ${ADMIN_PASSWORD}`);
    console.log('─────────────────────────────────────────');
    console.log('');

    process.exit(0);
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
})();
