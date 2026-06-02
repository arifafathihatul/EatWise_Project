import { FoodLogModel, DailyTrackerModel } from '../models/index.js';
import pool from '../config/db.js'; 

export const getDailyTracker = async (req, res) => {
  try {
    const userId = req.user.id;
    const { date } = req.query; 
    
    const userTimezone = req.headers['x-user-timezone'] || 'Asia/Jakarta';
    const targetDateStr = date || new Date().toLocaleDateString('en-CA', { timeZone: userTimezone });

    const query = `
      SELECT * FROM "FoodLogs" 
      WHERE "userId" = $1 
        AND ("loggedAt" AT TIME ZONE $2)::date = $3::date
      ORDER BY "loggedAt" DESC;
    `;
    const { rows: meals } = await pool.query(query, [userId, userTimezone, targetDateStr]);

    res.status(200).json({
      success: true,
      targetDate: targetDateStr,
      data: meals
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getDashboardSummary = async (req, res) => {
  try {
    const userId = req.user.id;
    const { date } = req.query;
    
    const userTimezone = req.headers['x-user-timezone'] || 'Asia/Jakarta';
    const targetDate = date || new Date().toLocaleDateString('en-CA', { timeZone: userTimezone });

    const trackerToday = await DailyTrackerModel.findByDate(userId, targetDate);

    const latestMealQuery = `
      SELECT * FROM "FoodLogs" 
      WHERE "userId" = $1 
      ORDER BY "loggedAt" DESC 
      LIMIT 1;
    `;
    const { rows: latestMealRows } = await pool.query(latestMealQuery, [userId]);
    const latestMeal = latestMealRows[0] || null;

    res.status(200).json({
      success: true,
      targetDate: targetDate,
      data: {
        summary: trackerToday || {
          totalCalories: 0,
          totalProtein: 0,
          totalCarbs: 0,
          totalFat: 0,
          statusWarning: null
        },
        latestMeal: latestMeal
      }
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: "Gagal mengambil data dashboard",
      error: error.message 
    });
  }
};