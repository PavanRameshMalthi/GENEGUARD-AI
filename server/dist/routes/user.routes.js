import { Router } from 'express';
import { getProfile, updateProfile, updateSettings, updatePassword, exportUserDataJSON, exportUserDataCSV, deleteAccount, purgeSelectiveData } from '../controllers/user.controller.js';
import { protect } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { updateProfileValidator, updatePasswordValidator, updateSettingsValidator } from '../validators/user.validator.js';
const router = Router();
router.route('/profile')
    .get(protect, getProfile)
    .put(protect, updateProfileValidator, validate, updateProfile);
router.put('/settings', protect, updateSettingsValidator, validate, updateSettings);
router.put('/password', protect, updatePasswordValidator, validate, updatePassword);
// Data Export
router.get('/export-data', protect, exportUserDataJSON);
router.get('/export-csv', protect, exportUserDataCSV);
// Account & Data Deletion
router.post('/delete-account', protect, deleteAccount);
router.post('/purge-data', protect, purgeSelectiveData);
export default router;
