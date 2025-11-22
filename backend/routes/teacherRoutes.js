import express from 'express';
import {
  getStudents,
  getStudentActivities,
  getStudentSessions,
  addScore,
  getAlerts,
  resolveAlert,
  addRemark,
  getStudentRecords
} from '../controllers/teacherController.js';
import { protect, authorizeRole } from '../middleware/auth.js';

const router = express.Router();

// All routes are protected and only for teachers
router.use(protect);
router.use(authorizeRole('teacher'));

router.get('/students', getStudents);
router.get('/students/:id/activities', getStudentActivities);
router.get('/students/:id/sessions', getStudentSessions);
router.get('/students/:id/records', getStudentRecords);

router.post('/score', addScore);
router.post('/remark', addRemark);

router.get('/alerts', getAlerts);
router.put('/alerts/:id/resolve', resolveAlert);

export default router;

