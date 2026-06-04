import pool from '../config/db.js';

const UserModel = {
    // 1. Membuat User Baru (Register)
    async create({ username, email, password, dateOfBirth, gender, weight, height }) {
        const query = `
          INSERT INTO "Users" (username, email, password, "dateOfBirth", gender, weight, height, "createdAt", "updatedAt") 
          VALUES ($1, $2, $3, $4, $5, $6, $7, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
          RETURNING *;
        `;
        const values = [username, email, password, dateOfBirth, gender, weight, height];
        const { rows } = await pool.query(query, values);
        return rows[0];
    },

    // 2. Mencari User berdasarkan Email 
    async findByEmail(email) {
        const query = `SELECT * FROM "Users" WHERE email = $1;`;
        const { rows } = await pool.query(query, [email]);
        return rows[0];
    },

    // 3. Mencari User berdasarkan ID 
    async findById(id) {
        const query = `
          SELECT id, username, email, "dateOfBirth", gender, weight, height, "profilePictureUrl" 
          FROM "Users" 
          WHERE id = $1;
        `;
        const { rows } = await pool.query(query, [id]);
        return rows[0];
    },

    // 4. Update Foto Profil (Menyimpan URL dari Cloudinary ke Database)
    async updateProfilePicture(id, profilePictureUrl, profilePicturePublicId) {
        const query = `
          UPDATE "Users"
          SET "profilePictureUrl" = $1, "profilePicturePublicId" = $2, "updatedAt" = CURRENT_TIMESTAMP
          WHERE id = $3
          RETURNING id, "profilePictureUrl", "profilePicturePublicId";
        `;
        const { rows } = await pool.query(query, [profilePictureUrl, profilePicturePublicId, id]);
        return rows[0];
    }
};

export default UserModel;