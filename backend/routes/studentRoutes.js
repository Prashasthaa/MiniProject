import express from 'express';
import {
  createActivity,
  getTodayActivities,
  getAllActivities,
  startSession,
  endSession,
  getActiveSession,
  getSessions,
  getExercises
} from '../controllers/studentController.js';
import { protect, authorizeRole } from '../middleware/auth.js';

const router = express.Router();

// All routes are protected and only for students
router.use(protect);
router.use(authorizeRole('student'));

router.post('/activity', createActivity);
router.get('/activity/today', getTodayActivities);
router.get('/activity', getAllActivities);

router.post('/session/start', startSession);
router.post('/session/end', endSession);
router.get('/session/active', getActiveSession);
router.get('/sessions', getSessions);

router.get('/exercises', getExercises);

export default router;

