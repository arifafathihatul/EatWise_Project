import express from 'express';
import authRoutes from './authRoutes.js';
import dailyTrackerRoutes from './dailyTrackerRoutes.js';
import profileRoutes from './profileRoutes.js';
import scanRoutes from './scanRoutes.js';

const router = express.Router();

// 1. Grouping Jalur /auth (Untuk registrasi dan login)
router.use('/auth', authRoutes);       

// 2. Grouping Jalur /api 
router.use('/api', dailyTrackerRoutes);    
router.use('/api', scanRoutes);        
router.use('/api/profile', profileRoutes); 

export default router;