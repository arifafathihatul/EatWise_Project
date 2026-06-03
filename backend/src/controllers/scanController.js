import { predictFood } from '../services/aiServices.js'; 
import { FoodLogModel, DailyTrackerModel } from '../models/index.js';

export const scanFoodDummy = async (req, res) => {
  try {
    const userId = req.user.id; 
    const imageFile = req.file;  

    if (!imageFile) {
      return res.status(400).json({ success: false, message: "Foto makanan wajib diunggah!" });
    }

    const aiResult = await predictFood(imageFile);
    
    // Pastikan semua nilai adalah angka valid (fallback ke 0 jika null/undefined)
    const foodName = aiResult?.predicted_name || "Makanan Tidak Dikenali";
    const healthWarning = aiResult?.health_warning || "Aman dikonsumsi";
    const confidence = aiResult?.confidence ?? 0;

    const calories = Number(aiResult?.nutrition?.calories || aiResult?.kalori || 0) || 0;
    const protein = Number(aiResult?.nutrition?.protein || aiResult?.protein || 0) || 0;
    const fat = Number(aiResult?.nutrition?.fat || aiResult?.lemak || 0) || 0;
    const carbs = Number(aiResult?.nutrition?.carbohydrate || aiResult?.carbs || aiResult?.karbohidrat || 0) || 0;

    const now = new Date(); 
    const todayDate = new Intl.DateTimeFormat('fr-CA', {
      timeZone: 'Asia/Jakarta',
      year: 'numeric', month: '2-digit', day: '2-digit'
    }).format(now);

    const newMeal = await FoodLogModel.create({
      userId: userId,
      foodName: foodName, 
      calories, protein, fat, carbs, 
      healthWarning: healthWarning, 
      loggedAt: now 
    });

    let trackerToday = await DailyTrackerModel.findByDate(userId, todayDate);

    if (!trackerToday) {
      trackerToday = await DailyTrackerModel.create({
        userId, date: todayDate,
        totalCalories: calories,
        totalProtein: protein,
        totalCarbs: carbs,
        totalFat: fat
      });
    } else {
      // Pastikan tracker lama punya nilai default 0 sebelum ditambah
      trackerToday = await DailyTrackerModel.updateNutrients(trackerToday.id, {
        totalCalories: (Number(trackerToday.totalCalories) || 0) + calories,
        totalProtein: (Number(trackerToday.totalProtein) || 0) + protein,
        totalCarbs: (Number(trackerToday.totalCarbs) || 0) + carbs,
        totalFat: (Number(trackerToday.totalFat) || 0) + fat
      });
    }

    return res.status(201).json({
      success: true,
      message: 'Foto berhasil diproses',
      data: { newMeal, dailySummary: trackerToday }
    });

  } catch (error) {
    console.error("Error di scanFoodDummy:", error);
    return res.status(500).json({ 
      success: false, 
      message: "Gagal memproses scan",
      error: error.message 
    });
  }
};