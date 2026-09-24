const express = require('express');
const router = express.Router();
const {
  getUsers, getUser, createUser, updateUser, deleteUser,
  updateKycStatus, toggleUserStatus, getReferralTree, 
  approveAssociate, rejectAssociate, impersonateUser
} = require('../controllers/userController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect, authorize('admin'));

router.get('/', getUsers);
router.post('/', createUser);
router.get('/:id', getUser);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);
router.put('/:id/kyc', updateKycStatus);
router.put('/:id/status', toggleUserStatus);
router.get('/:id/referral-tree', getReferralTree);
router.post('/:id/approve', approveAssociate);
router.post('/:id/reject', rejectAssociate);
router.post('/:id/impersonate', impersonateUser);

module.exports = router;
