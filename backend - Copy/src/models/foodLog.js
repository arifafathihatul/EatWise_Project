import pool from '../config/db.js';

const FoodLogModel = {
  // 1. Mencari semua riwayat makanan milik user tertentu
  async findByUserId(userId) {
    const query = `
      SELECT * FROM "FoodLogs" 
      WHERE "userId" = $1 
      ORDER BY "loggedAt" DESC;
    `;
    const { rows } = await pool.query(query, [userId]);
    return rows;
  },

  // 2. Membuat catatan makanan baru 
  async create({ userId, foodName, calories, protein, carbs, fat, healthWarning, loggedAt }) {
    const query = `
      INSERT INTO "FoodLogs" ("userId", "foodName", "calories", "protein", "carbs", "fat", "healthWarning", "loggedAt")
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *;
    `;
    
    const values = [userId, foodName, calories, protein, carbs, fat, healthWarning, loggedAt];
    const { rows } = await pool.query(query, values);
    return rows[0];
  }
};

export default FoodLogModel;