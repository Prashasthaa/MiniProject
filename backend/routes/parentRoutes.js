import express from 'express';
import {
  getChildStatus,
  getRemarks,
  getAlerts,
  getPerformance
} from '../controllers/parentController.js';
import { protect, authorizeRole } from '../middleware/auth.js';

const router = express.Router();

// All routes are protected and only for parents
router.use(protect);
router.use(authorizeRole('parent'));

router.get('/status', getChildStatus);
router.get('/remarks', getRemarks);
router.get('/alerts', getAlerts);
router.get('/performance', getPerformance);

export default router;

