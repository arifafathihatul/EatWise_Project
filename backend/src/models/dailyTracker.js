import pool from '../config/db.js';

const DailyTrackerModel = {
  // 1. Mengambil tracker user berdasarkan tanggal tertentu (Format tanggal: YYYY-MM-DD)
  async findByDate(userId, date) {
    const query = `
      SELECT * FROM "DailyTrackers" 
      WHERE "userId" = $1 AND "date" = $2;
    `;
    const { rows } = await pool.query(query, [userId, date]);
    return rows[0];
  },

  // 2. Membuat tracker baru jika hari itu belum ada record-nya 
  async create({ userId, date, totalCalories, totalProtein, totalCarbs, totalFat }) {
    const query = `
      INSERT INTO "DailyTrackers" ("userId", date, "totalCalories", "totalProtein", "totalCarbs", "totalFat")
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *;
    `;
    const values = [userId, date, totalCalories, totalProtein, totalCarbs, totalFat];
    const { rows } = await pool.query(query, values);
    return rows[0];
  },

  // 3. Update akumulasi nutrisi 
  async updateNutrients(id, { totalCalories, totalProtein, totalCarbs, totalFat }) {
    const query = `
      UPDATE "DailyTrackers"
      SET 
        "totalCalories" = "totalCalories" + $1, 
        "totalProtein" = "totalProtein" + $2, 
        "totalCarbs" = "totalCarbs" + $3, 
        "totalFat" = "totalFat" + $4, 
        "updatedAt" = CURRENT_TIMESTAMP
      WHERE id = $5
      RETURNING *;
    `;
    const values = [totalCalories, totalProtein, totalCarbs, totalFat, id];
    const { rows } = await pool.query(query, values);
    return rows[0];
  }
};

export default DailyTrackerModel;