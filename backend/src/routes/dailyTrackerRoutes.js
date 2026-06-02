import express from 'express';
import { verifyToken } from '../middlewares/authMiddleware.js';
import { getDailyTracker, getDashboardSummary } from '../controllers/dailyTrackerController.js';

const router = express.Router();

router.get('/tracker', verifyToken, getDailyTracker);
router.get('/tracker/dashboard', verifyToken, getDashboardSummary);

export default router;