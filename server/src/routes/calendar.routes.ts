import { Router } from 'express';
import { 
  getEvents, 
  createEvent, 
  updateEvent, 
  deleteEvent, 
  getRecommendedScreenings, 
  exportICalendar 
} from '../controllers/calendar.controller.js';
import { protect } from '../middleware/auth.js';

const router = Router();

router.use(protect);

router.get('/events', getEvents);
router.post('/events', createEvent);
router.put('/events/:id', updateEvent);
router.delete('/events/:id', deleteEvent);
router.get('/recommended', getRecommendedScreenings);
router.get('/export-ics', exportICalendar);

export default router;
