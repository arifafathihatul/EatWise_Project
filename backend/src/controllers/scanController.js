import { predictFood } from '../services/aiServices.js'; 
import { FoodLogModel, DailyTrackerModel } from '../models/index.js';


export const scanFoodDummy = async (req, res) => {
  try {
    const imageFile = req.file;  
    if (!imageFile) {
      return res.status(400).json({ success: false, message: "Foto makanan wajib diunggah!" });
    }

    const aiResult = await predictFood(imageFile);
    
    return res.status(200).json({
      success: true,
      message: 'Foto berhasil diproses',
      data: aiResult 
    });

  } catch (error) {
    console.error("Error di scanFoodDummy:", error);
    return res.status(500).json({ success: false, message: "Gagal memproses scan" });
  }
};

export const saveFood = async (req, res) => {
  try {
    const userId = req.user.id;
    const { foodName, calories, protein, fat, carbs, healthWarning } = req.body;

    const now = new Date(); 
    const todayDate = new Intl.DateTimeFormat('fr-CA', {
      timeZone: 'Asia/Jakarta',
      year: 'numeric', month: '2-digit', day: '2-digit'
    }).format(now);

    const newMeal = await FoodLogModel.create({
      userId, foodName, calories, protein, fat, carbs, healthWarning, loggedAt: now 
    });

    let trackerToday = await DailyTrackerModel.findByDate(userId, todayDate);

    if (!trackerToday) {
      trackerToday = await DailyTrackerModel.create({
        userId, date: todayDate, totalCalories: calories, totalProtein: protein, totalCarbs: carbs, totalFat: fat
      });
    } else {
      trackerToday = await DailyTrackerModel.updateNutrients(trackerToday.id, {
        totalCalories: (Number(trackerToday.totalCalories) || 0) + Number(calories),
        totalProtein: (Number(trackerToday.totalProtein) || 0) + Number(protein),
        totalCarbs: (Number(trackerToday.totalCarbs) || 0) + Number(carbs),
        totalFat: (Number(trackerToday.totalFat) || 0) + Number(fat)
      });
    }

    return res.status(201).json({ success: true, message: 'Data berhasil disimpan', data: { newMeal, dailySummary: trackerToday } });

  } catch (error) {
    console.error("Error di saveFood:", error);
    return res.status(500).json({ success: false, message: "Gagal menyimpan data" });
  }
};