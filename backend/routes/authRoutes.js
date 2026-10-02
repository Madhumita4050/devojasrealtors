const express = require('express');
const router = express.Router();
const { register, registerAssociate, login, getMe, updateProfile, changePassword } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

router.post('/register', register);
router.post('/register-associate', registerAssociate);
// NOTE: Client and Accounts registration removed from public routes.
// Admin creates these users from Admin Panel → POST /api/users
router.post('/login', login);
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);
router.put('/change-password', protect, changePassword);

module.exports = router;
