import { Router } from 'express';
import { 
  getFamilyMembers, 
  addFamilyMember, 
  updateFamilyMember, 
  deleteFamilyMember, 
  getHereditaryRiskAnalysis 
} from '../controllers/family.controller.js';
import { protect } from '../middleware/auth.js';

const router = Router();

router.use(protect);

router.get('/', getFamilyMembers);
router.post('/member', addFamilyMember);
router.put('/member/:id', updateFamilyMember);
router.delete('/member/:id', deleteFamilyMember);
router.get('/risk-analysis', getHereditaryRiskAnalysis);

export default router;
