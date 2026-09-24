const bcrypt = require('bcryptjs');
const { User, Wallet } = require('../models');
const generateToken = require('../utils/generateToken');
const generateReferralCode = require('../utils/generateReferralCode');
const { Op } = require('sequelize');

// Helper: generate login_id like DEV-0001
const generateLoginId = (userId) => `DEV-${String(userId).padStart(4, '0')}`;

// @desc Register new user (admin creates admin, or public client signup)
// @route POST /api/auth/register
const register = async (req, res, next) => {
  try {
    const { name, email, phone, password, role, referred_by, pan_number, aadhar_number, referral_commission_percent, address } = req.body;

    const existingPhone = await User.findOne({ where: { phone } });
    if (existingPhone) {
      return res.status(400).json({ success: false, message: 'Phone number already registered' });
    }
    if (email) {
      const existingEmail = await User.findOne({ where: { email } });
      if (existingEmail) {
        return res.status(400).json({ success: false, message: 'Email already registered' });
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const referral_code = generateReferralCode(name);

    const user = await User.create({
      name,
      email: email || null,
      phone,
      address: address || null,
      password: hashedPassword,
      plain_password: password,
      role: role || 'client',
      referred_by: referred_by || null,
      referral_commission_percent: referral_commission_percent || null,
      pan_number: pan_number || null,
      aadhar_number: aadhar_number || null,
      referral_code,
      kyc_status: 'not_submitted'
    });

    // Auto-generate login_id after creation
    const login_id = generateLoginId(user.id);
    await user.update({ login_id });

    // Auto create wallet for the user
    await Wallet.create({ user_id: user.id, balance: 0 });

    const token = generateToken(user.id);

    res.status(201).json({
      success: true,
      token,
      user: { id: user.id, login_id: user.login_id, name: user.name, email: user.email, role: user.role, referral_code: user.referral_code }
    });
  } catch (error) {
    next(error);
  }
};

// @desc  Public "Sign Up as Associate"
//        Associate fills Name/Phone/Email/PAN/Aadhar/Address/Password,
//        optionally provides sponsor's referral code.
//        Account is set to kyc_status='pending' — admin must approve before login.
// @route POST /api/auth/register-associate
const registerAssociate = async (req, res, next) => {
  try {
    const { name, email, phone, pan_number, aadhar_number, address, password, confirm_password, sponsor_code } = req.body;

    // --- Validation ---
    if (!name || !phone) {
      return res.status(400).json({ success: false, message: 'Name and phone number are required' });
    }
    if (!pan_number || !aadhar_number) {
      return res.status(400).json({ success: false, message: 'PAN number and Aadhar number are mandatory for Associates' });
    }
    if (!password || password.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters' });
    }
    if (password !== confirm_password) {
      return res.status(400).json({ success: false, message: 'Password and Confirm Password do not match' });
    }

    // --- Duplicate checks ---
    const existingPhone = await User.findOne({ where: { phone } });
    if (existingPhone) {
      return res.status(400).json({ success: false, message: 'Phone number already registered' });
    }
    if (email) {
      const existingEmail = await User.findOne({ where: { email } });
      if (existingEmail) {
        return res.status(400).json({ success: false, message: 'Email already registered' });
      }
    }
    const existingPan = await User.findOne({ where: { pan_number } });
    if (existingPan) {
      return res.status(400).json({ success: false, message: 'This PAN number is already registered' });
    }
    const existingAadhar = await User.findOne({ where: { aadhar_number } });
    if (existingAadhar) {
      return res.status(400).json({ success: false, message: 'This Aadhar number is already registered' });
    }

    // --- Sponsor lookup (optional) ---
    let referred_by = null;
    let sponsorUser = null;
    if (sponsor_code && sponsor_code.trim()) {
      // Support both referral_code and login_id as sponsor code
      sponsorUser = await User.findOne({
        where: {
          [Op.or]: [
            { referral_code: sponsor_code.trim() },
            { login_id: sponsor_code.trim() }
          ],
          role: 'associate'
        }
      });
      if (!sponsorUser) {
        return res.status(400).json({ success: false, message: 'Sponsor code not found. Please check and try again.' });
      }
      referred_by = sponsorUser.id;
    }

    // --- Create associate (pending approval) ---
    const hashedPassword = await bcrypt.hash(password, 10);
    const referral_code = generateReferralCode(name);

    const user = await User.create({
      name,
      email: email || null,
      phone,
      address: address || null,
      password: hashedPassword,
      plain_password: password,
      role: 'associate',
      referred_by,
      referral_commission_percent: 5, // default 5%
      pan_number,
      aadhar_number,
      referral_code,
      kyc_status: 'pending',  // ← admin must approve before login is allowed
      status: 'active'
    });

    // Auto-generate login_id after creation (DEV-XXXX)
    const login_id = generateLoginId(user.id);
    await user.update({ login_id });

    await Wallet.create({ user_id: user.id, balance: 0 });

    const token = generateToken(user.id);

    res.status(201).json({
      success: true,
      message: 'Registration successful!',
      token,
      user: {
        id: user.id,
        login_id: user.login_id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        referral_code: user.referral_code,
        kyc_status: user.kyc_status
      },
      data: {
        login_id: login_id,
        name: user.name,
        referral_code: user.referral_code,
        sponsor: sponsorUser ? { name: sponsorUser.name, login_id: sponsorUser.login_id } : null
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc Login user (via email OR phone OR login_id)
// @route POST /api/auth/login
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body; // "email" field accepts email, phone, or login_id

    const user = await User.findOne({
      where: {
        [Op.or]: [
          { email },
          { phone: email },
          { login_id: email }
        ]
      }
    });

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials. Please check your ID/email/phone and password.' });
    }

    if (user.status === 'blocked') {
      return res.status(403).json({ success: false, message: 'Your account has been blocked. Please contact admin.' });
    }

    // Associates must be approved before they can login
    if (user.role === 'associate' && user.status === 'pending_approval') {
      return res.status(403).json({ success: false, message: 'Aapki request admin approval ke wait mein hai.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials. Please check your password.' });
    }

    // Track last login
    user.last_login_at = new Date();
    await user.save();

    const token = generateToken(user.id);

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        login_id: user.login_id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        referral_code: user.referral_code,
        last_login_at: user.last_login_at,
        kyc_status: user.kyc_status,
        profile_image: user.profile_image
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc Get logged in user profile
// @route GET /api/auth/me
const getMe = async (req, res, next) => {
  res.json({ success: true, user: req.user });
};

// @desc  Update logged in user profile
// @route PUT /api/auth/profile
const updateProfile = async (req, res, next) => {
  try {
    const { name, phone, email, profile_image } = req.body;
    const user = await User.findByPk(req.user.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    await user.update({
      name: name !== undefined ? name : user.name,
      phone: phone !== undefined ? phone : user.phone,
      email: email !== undefined ? email : user.email,
      profile_image: profile_image !== undefined ? profile_image : user.profile_image,
    });
    const { password, ...userData } = user.toJSON();
    res.json({ success: true, message: 'Profile updated successfully', data: userData });
  } catch (error) { next(error); }
};

// @desc  Change logged in user password
// @route PUT /api/auth/change-password
const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findByPk(req.user.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) return res.status(400).json({ success: false, message: 'Current password is incorrect' });

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.json({ success: true, message: 'Password changed successfully' });
  } catch (error) { next(error); }
};

// @desc Public Client Registration
// @route POST /api/auth/register-client
const registerClient = async (req, res, next) => {
  try {
    const { name, email, phone, password, confirm_password, address } = req.body;

    if (!name || !phone || !password) {
      return res.status(400).json({ success: false, message: 'Name, phone and password are required' });
    }
    if (password !== confirm_password) {
      return res.status(400).json({ success: false, message: 'Password and Confirm Password do not match' });
    }
    if (password.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters' });
    }

    const existingPhone = await User.findOne({ where: { phone } });
    if (existingPhone) {
      return res.status(400).json({ success: false, message: 'Phone number already registered' });
    }
    if (email) {
      const existingEmail = await User.findOne({ where: { email } });
      if (existingEmail) {
        return res.status(400).json({ success: false, message: 'Email already registered' });
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const referral_code = generateReferralCode(name);

    const user = await User.create({
      name,
      email: email || null,
      phone,
      address: address || null,
      password: hashedPassword,
      plain_password: password,
      role: 'client',
      referral_code,
      kyc_status: 'not_submitted',
      status: 'pending_approval'
    });

    const login_id = generateLoginId(user.id);
    await user.update({ login_id });
    await Wallet.create({ user_id: user.id, balance: 0 });

    res.status(201).json({
      success: true,
      message: 'Registration successful! Admin will review and approve your account.',
      data: {
        login_id: user.login_id,
        name: user.name,
        referral_code: user.referral_code
      }
    });
  } catch (error) { next(error); }
};

module.exports = { register, registerAssociate, registerClient, login, getMe, updateProfile, changePassword };
