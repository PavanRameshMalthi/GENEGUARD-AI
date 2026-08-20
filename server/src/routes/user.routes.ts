import { Router } from 'express';
import { getProfile, updateProfile, updateSettings, updatePassword } from '../controllers/user.controller.js';
import { protect } from '../middleware/auth.js';

const router = Router();

router.route('/profile')
  .get(protect, getProfile)
  .put(protect, updateProfile);

router.put('/settings', protect, updateSettings);
router.put('/password', protect, updatePassword);

export default router;