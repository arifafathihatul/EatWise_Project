import { predictFood } from '../services/aiServices.js'; 
import { FoodLogModel, DailyTrackerModel } from '../models/index.js';

export const scanFoodDummy = async (req, res) => {
  try {
    const userId = req.user.id; 
    const imageFile = req.file;  

    if (!imageFile) {
      return res.status(400).json({ success: false, message: "Foto makanan wajib diunggah!" });
    }

    // 1. Panggil AI Service
    const aiResult = await predictFood(imageFile);
    
    console.log("=== HASIL RESPONS ASLI DARI AI SERVICE ===", JSON.stringify(aiResult, null, 2));

    // 2. Ambil data dengan fallback 
    const foodName = aiResult.predicted_name || aiResult.nama_makanan || aiResult.food_name || "Makanan Tidak Dikenali";
    const healthWarning = aiResult.health_warning || aiResult.risiko || "Aman dikonsumsi dalam batas wajar";
    const confidence = aiResult.confidence ?? 0;

    const calories = Number(aiResult.nutrition?.calories || aiResult.kalori || 0);
    const protein = Number(aiResult.nutrition?.protein || aiResult.protein || 0);
    const fat = Number(aiResult.nutrition?.fat || aiResult.lemak || 0);
    const carbs = Number(aiResult.nutrition?.carbohydrate || aiResult.carbs || aiResult.karbohidrat || 0);

    const now = new Date(); 
    const todayDate = new Intl.DateTimeFormat('fr-CA', {
      timeZone: 'Asia/Jakarta',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }).format(now);

    const newMeal = await FoodLogModel.create({
      userId: userId,
      foodName: foodName, 
      calories: calories, 
      protein: protein,
      fat: fat,
      carbs: carbs, 
      healthWarning: healthWarning, 
      loggedAt: now 
    });

    // Sinkronisasi dengan DailyTrackerModel
    let trackerToday = await DailyTrackerModel.findByDate(userId, todayDate);

    if (!trackerToday) {
      trackerToday = await DailyTrackerModel.create({
        userId: userId,
        date: todayDate,
        totalCalories: calories,
        totalProtein: protein,
        totalCarbs: carbs,
        totalFat: fat
      });
    } else {
      trackerToday = await DailyTrackerModel.updateNutrients(trackerToday.id, {
        totalCalories: calories,
        totalProtein: protein,
        totalCarbs: carbs,
        totalFat: fat
      });
    }

    const displayConfidence = typeof confidence === 'number' 
      ? (confidence <= 1 ? `${(confidence * 100).toFixed(0)}%` : `${confidence}%`)
      : String(confidence);

    return res.status(201).json({
      success: true,
      message: 'Foto berhasil di-scan dan dimasukkan ke DailyTracker',
      confidence: displayConfidence, 
      data: {
        newMeal: newMeal,             
        dailySummary: trackerToday  
      }
    });

  } catch (error) {
    console.error("Error di scanFoodDummy:", error);
    return res.status(500).json({ 
      success: false, 
      message: "Gagal memproses scan foto",
      error: error.message 
    });
  }
};