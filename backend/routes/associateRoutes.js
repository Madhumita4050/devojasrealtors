const express = require('express');
const router = express.Router();
const {
  getDashboardStats, getMyTeam, getMyCommissions, getMyWallet, requestWithdrawal,
  browsePlots, updateProfile, changePassword, submitKyc,
  getMyNotifications, markNotificationRead, createComplaint, getMyComplaints,
  createTeamMember, getMyNetwork, getMyPlots, getMyRewards, recordPaymentForDeal, setTeamMemberCommission
} = require('../controllers/associateController');
const { protect, authorize } = require('../middleware/auth');

// Every route here is protected AND restricted to role = 'associate'
router.use(protect, authorize('associate'));

router.get('/dashboard-stats', getDashboardStats);
router.get('/my-team', getMyTeam);
router.post('/team', createTeamMember);
router.put('/team/:id/commission', setTeamMemberCommission);
router.get('/network', getMyNetwork);
router.get('/commissions', getMyCommissions);
router.get('/my-plots', getMyPlots);
router.get('/my-rewards', getMyRewards);

router.get('/wallet', getMyWallet);
router.post('/withdraw', requestWithdrawal);
router.post('/transactions/:id/payments', recordPaymentForDeal);

router.get('/plots', browsePlots);

router.put('/profile', updateProfile);
router.put('/change-password', changePassword);
router.post('/kyc', submitKyc);

router.get('/notifications', getMyNotifications);
router.put('/notifications/:id/read', markNotificationRead);

router.post('/complaints', createComplaint);
router.get('/complaints', getMyComplaints);

module.exports = router;
