import express from 'express';
import multer from 'multer';
import { verifyToken } from '../middlewares/authMiddleware.js';
import { scanFoodDummy } from '../controllers/scanController.js';

const router = express.Router();

// Konfigurasi Multer khusus untuk proses Scan Foto Makanan
const storage = multer.memoryStorage();
const upload = multer({ 
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 } 
});

// Endpoint Scan Makanan 
router.post('/scan', verifyToken, upload.single('image'), scanFoodDummy);

export default router;