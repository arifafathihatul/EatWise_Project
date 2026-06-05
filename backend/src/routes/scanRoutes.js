import express from 'express';
import multer from 'multer';
import { verifyToken } from '../middlewares/authMiddleware.js';
import { scanFoodDummy, saveFood } from '../controllers/scanController.js'; 

const router = express.Router();


const storage = multer.memoryStorage();
const upload = multer({ 
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 } 
});


router.post('/scan', verifyToken, upload.single('image'), scanFoodDummy);

router.post('/save', verifyToken, saveFood);

export default router;