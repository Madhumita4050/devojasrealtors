/**
 * SEED SCRIPT — DEVOJAS REALTORS
 * Creates admin, dummy associates (tree structure), clients, commission settings.
 * Run: npm run seed
 */
const bcrypt = require('bcryptjs');
require('dotenv').config();
const { sequelize } = require('./config/db');
const { User, Wallet, CommissionSetting, Slab, AppSettings, Plot, Transaction, Commission } = require('./models');

const genLoginId = (id) => `DEV-${String(id).padStart(4, '0')}`;
const genRefCode = (name) => name.replace(/\s+/g, '').toUpperCase().slice(0, 6) + Math.floor(100 + Math.random() * 900);

const seed = async () => {
  try {
    await sequelize.sync({ alter: true });
    console.log('✅ Database synced');

    // ─── 1. ADMIN ───────────────────────────────────────────────────────────
    let admin = await User.findOne({ where: { role: 'admin' } });
    if (!admin) {
      const pw = await bcrypt.hash('Admin@123', 10);
      admin = await User.create({
        name: 'Rajesh Kumar (Admin)',
        email: 'admin@devojas.com',
        phone: '9999000001',
        password: pw,
        role: 'admin',
        status: 'active',
        kyc_status: 'approved',
        referral_code: 'ADMINDEV',
        address: 'Devojas Realtors Office, Lanka, Varanasi - 221005',
        login_id: 'DEV-0000'
      });
      await Wallet.create({ user_id: admin.id, balance: 0 });
      console.log('✅ Admin created → admin@devojas.com / Admin@123');
    } else {
      console.log('ℹ️  Admin already exists');
    }

    // ─── 2. ASSOCIATES (Tree structure for demo) ────────────────────────────
    // Structure:
    //   Amit Sharma (Level 1 — no sponsor)
    //   ├── Priya Singh (sponsored by Amit)
    //   │   ├── Rahul Gupta (sponsored by Priya)
    //   │   └── Sunita Devi (sponsored by Priya)
    //   └── Vikram Yadav (sponsored by Amit)
    //       └── Neeta Mishra (sponsored by Vikram)

    const associateSeedData = [
      {
        key: 'amit',
        name: 'Amit Sharma',
        email: 'amit.sharma@gmail.com',
        phone: '9876543210',
        pan: 'ABCPS1234A',
        aadhar: '123456789012',
        address: 'B-12, Sigra Colony, Varanasi - 221010',
        password: 'Amit@1234',
        commission: 5,
        sponsorKey: null,
      },
      {
        key: 'priya',
        name: 'Priya Singh',
        email: 'priya.singh@gmail.com',
        phone: '9876543211',
        pan: 'BCDES2345B',
        aadhar: '234567890123',
        address: 'C-45, Orderly Bazar, Varanasi - 221002',
        password: 'Priya@1234',
        commission: 4,
        sponsorKey: 'amit',
      },
      {
        key: 'rahul',
        name: 'Rahul Gupta',
        email: 'rahul.gupta@gmail.com',
        phone: '9876543212',
        pan: 'CDEFG3456C',
        aadhar: '345678901234',
        address: 'A-7, Assi Ghat Road, Varanasi - 221005',
        password: 'Rahul@1234',
        commission: 3,
        sponsorKey: 'priya',
      },
      {
        key: 'sunita',
        name: 'Sunita Devi',
        email: 'sunita.devi@gmail.com',
        phone: '9876543213',
        pan: 'DEFGH4567D',
        aadhar: '456789012345',
        address: 'D-22, Bhelupur, Varanasi - 221010',
        password: 'Sunita@1234',
        commission: 3,
        sponsorKey: 'priya',
      },
      {
        key: 'vikram',
        name: 'Vikram Yadav',
        email: 'vikram.yadav@gmail.com',
        phone: '9876543214',
        pan: 'EFGHI5678E',
        aadhar: '567890123456',
        address: 'F-33, Nadesar, Varanasi - 221002',
        password: 'Vikram@1234',
        commission: 4,
        sponsorKey: 'amit',
      },
      {
        key: 'neeta',
        name: 'Neeta Mishra',
        email: 'neeta.mishra@gmail.com',
        phone: '9876543215',
        pan: 'FGHIJ6789F',
        aadhar: '678901234567',
        address: 'G-15, Kashi Vidyapeeth Road, Varanasi - 221002',
        password: 'Neeta@1234',
        commission: 3,
        sponsorKey: 'vikram',
      }
    ];

    const createdAssociates = {}; // key → User instance

    for (const a of associateSeedData) {
      const existing = await User.findOne({ where: { phone: a.phone } });
      if (existing) {
        createdAssociates[a.key] = existing;
        console.log(`ℹ️  Associate ${a.name} already exists`);
        continue;
      }

      const referred_by = a.sponsorKey ? createdAssociates[a.sponsorKey]?.id : null;
      const pw = await bcrypt.hash(a.password, 10);
      const referral_code = genRefCode(a.name);

      const user = await User.create({
        name: a.name,
        email: a.email,
        phone: a.phone,
        pan_number: a.pan,
        aadhar_number: a.aadhar,
        address: a.address,
        password: pw,
        role: 'associate',
        referred_by,
        referral_commission_percent: a.commission,
        referral_code,
        kyc_status: 'approved',
        status: 'active',
        last_login_at: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000)
      });

      const login_id = genLoginId(user.id);
      await user.update({ login_id });
      await Wallet.create({ user_id: user.id, balance: Math.floor(Math.random() * 50000) });

      createdAssociates[a.key] = user;
      console.log(`✅ Associate created → ${a.name} | ${login_id} | Phone: ${a.phone} | Pass: ${a.password}`);
    }

    // ─── 3. CLIENTS ──────────────────────────────────────────────────────────
    const clientSeedData = [
      { name: 'Deepak Agarwal', email: 'deepak.ag@gmail.com', phone: '9800000001', address: 'H-55, Mahmoorganj, Varanasi' },
      { name: 'Kavita Verma', email: 'kavita.v@gmail.com', phone: '9800000002', address: 'J-19, Shivpur, Varanasi' },
      { name: 'Suresh Tiwari', email: null, phone: '9800000003', address: 'K-8, Rohania, Varanasi' }
    ];

    for (const c of clientSeedData) {
      const existing = await User.findOne({ where: { phone: c.phone } });
      if (!existing) {
        const pw = await bcrypt.hash('Client@123', 10);
        const cl = await User.create({
          name: c.name, email: c.email, phone: c.phone,
          address: c.address,
          password: pw, role: 'client', kyc_status: 'not_submitted', status: 'active',
          referral_code: genRefCode(c.name)
        });
        const login_id = genLoginId(cl.id);
        await cl.update({ login_id });
        await Wallet.create({ user_id: cl.id, balance: 0 });
        console.log(`✅ Client created → ${c.name} | Pass: Client@123`);
      } else {
        console.log(`ℹ️  Client ${c.name} already exists`);
      }
    }

    // ─── 4. COMMISSION SETTINGS ───────────────────────────────────────────────
    const existingSettings = await CommissionSetting.findOne();
    if (!existingSettings) {
      await CommissionSetting.create({
        seller_associate_percent: 3.0,
        seller_referrer_percent: 1.0,
        buyer_associate_percent: 1.5,
        buyer_referrer_percent: 0.5
      });
      console.log('✅ Commission settings seeded');
    } else {
      console.log('ℹ️  Commission settings already exist');
    }

    // ─── 5. SLABS ────────────────────────────────────────────────────────────
    const existingSlabs = await Slab.count();
    if (existingSlabs === 0) {
      await Slab.bulkCreate([
        { slab_number: 1, min_amount: 0, max_amount: 1000000, percentage: 5, self_target_amount: 500000, reward_amount: 10000 },
        { slab_number: 2, min_amount: 1000000, max_amount: 2500000, percentage: 7, self_target_amount: 750000, reward_amount: 25000 },
        { slab_number: 3, min_amount: 2500000, max_amount: 7500000, percentage: 9, self_target_amount: 1500000, reward_amount: 50000 },
        { slab_number: 4, min_amount: 7500000, max_amount: 15000000, percentage: 10, self_target_amount: 2500000, reward_amount: 150000 },
        { slab_number: 5, min_amount: 15000000, max_amount: 30000000, percentage: 11, self_target_amount: 3500000, reward_amount: 300000 },
        { slab_number: 6, min_amount: 30000000, max_amount: 60000000, percentage: 12, self_target_amount: 5000000, reward_amount: 450000 },
        { slab_number: 7, min_amount: 60000000, max_amount: 100000000, percentage: 13, self_target_amount: 7500000, reward_amount: 800000 },
        { slab_number: 8, min_amount: 100000000, max_amount: 150000000, percentage: 14, self_target_amount: 10000000, reward_amount: 1000000 },
        { slab_number: 9, min_amount: 150000000, max_amount: 250000000, percentage: 15, self_target_amount: 12500000, reward_amount: 1500000 },
        { slab_number: 10, min_amount: 250000000, max_amount: 500000000, percentage: 16, self_target_amount: 15000000, reward_amount: 2000000 },
        { slab_number: 11, min_amount: 500000000, max_amount: 750000000, percentage: 17, self_target_amount: 17500000, reward_amount: 3000000 },
        { slab_number: 12, min_amount: 750000000, max_amount: 1000000000, percentage: 18, self_target_amount: 20000000, reward_amount: 5000000 }
      ]);
      console.log('✅ 12 slabs seeded');
    } else {
      console.log('ℹ️  Slabs already exist');
    }

    // ─── 6. APP SETTINGS ──────────────────────────────────────────────────────
    const existingApp = await AppSettings.findOne();
    if (!existingApp) {
      await AppSettings.create({ company_name: 'DEVOJAS REALTORS', company_logo_url: null });
      console.log('✅ App settings seeded');
    } else {
      console.log('ℹ️  App settings already exist');
    }

    // ─── 7. DEMO PLOTS ────────────────────────────────────────────────────────
    const existingPlots = await Plot.count();
    if (existingPlots === 0) {
      await Plot.bulkCreate([
        { title: 'Bhandaha Kalan Plot A-101', location: 'Bhandaha Kalan, Kaithi', city: 'Varanasi', area_sqft: 1000, price: 1500000, status: 'available', is_featured: true, description: 'Prime location plot near Kaithi temple with all amenities.' },
        { title: 'Bhandaha Kalan Plot B-202', location: 'Bhandaha Kalan, Kaithi', city: 'Varanasi', area_sqft: 1600, price: 2400000, status: 'available', is_featured: true, description: 'Corner plot with wide road access. Ready for construction.' },
        { title: 'Kashi Valley Plot C-303', location: 'Ghazipur Road, Varanasi', city: 'Varanasi', area_sqft: 2000, price: 3200000, status: 'available', is_featured: false, description: 'Highway facing plot with excellent connectivity.' },
        { title: 'Green Park Plot D-401', location: 'Sigra, Varanasi', city: 'Varanasi', area_sqft: 1200, price: 1800000, status: 'sold', is_featured: false, description: 'Residential plot in Sigra — now sold.' },
      ]);
      console.log('✅ 4 demo plots seeded');
    } else {
      console.log('ℹ️  Plots already exist');
    }

    console.log('\n🎉 Seed complete! Login credentials:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('ADMIN      → admin@devojas.com / Admin@123');
    console.log('ASSOCIATE  → amit.sharma@gmail.com / Amit@1234');
    console.log('ASSOCIATE  → priya.singh@gmail.com / Priya@1234');
    console.log('ASSOCIATE  → rahul.gupta@gmail.com / Rahul@1234');
    console.log('CLIENT     → deepak.ag@gmail.com / Client@123');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed failed:', error.message);
    process.exit(1);
  }
};

seed();
