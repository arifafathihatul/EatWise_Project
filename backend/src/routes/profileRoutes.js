import express from 'express';
import multer from 'multer';
import { verifyToken } from '../middlewares/authMiddleware.js';
import { getProfile, updateProfile, deleteProfilePicture } from '../controllers/profileController.js'; 

const router = express.Router();

// Konfigurasi Multer untuk Foto Profil
const storage = multer.memoryStorage();
const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 } 
});

// Jalur Endpoint Profil 
router.get('/', verifyToken, getProfile);
router.put('/', verifyToken, upload.single('image'), updateProfile);
router.delete('/picture', verifyToken, deleteProfilePicture); 

export default router;