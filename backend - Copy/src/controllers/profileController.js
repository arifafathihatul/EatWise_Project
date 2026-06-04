import UserModel from '../models/user.js'; 
import pool from '../config/db.js';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET 
});

export const getProfile = async (req, res) => {
  try {
    const userId = req.user.id; 
    
    // Ambil data via UserModel
    const user = await UserModel.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User tidak ditemukan" });
    }

    res.status(200).json({
      success: true,
      data: user 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const { rows } = await pool.query('SELECT * FROM "Users" WHERE id = $1', [userId]);
    const user = rows[0];

    if (!user) {
      return res.status(404).json({ success: false, message: 'Profile tidak ditemukan.' });
    }

    const { username, email, dateOfBirth, gender, weight, height } = req.body;
    
    let finalProfilePictureUrl = user.profilePictureUrl;
    let finalProfilePicturePublicId = user.profilePicturePublicId;

    // Handling Foto Profil (Cloudinary)
    if (req.file) {
      // Hapus foto lama di Cloudinary 
      if (user.profilePicturePublicId) {
        await cloudinary.uploader.destroy(user.profilePicturePublicId, { invalidate: true });
        console.log(`=== FOTO LAMA DENGAN ID ${user.profilePicturePublicId} BERHASIL DIUPDATE ===`);
      }

      // Upload file baru ke Cloudinary
      const fileBase64 = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
      const uploadResult = await cloudinary.uploader.upload(fileBase64, {
        folder: 'eatwise_profiles',
        transformation: [
          { width: 300, height: 300, crop: 'fill', quality: 'auto' }
        ]
      });

      finalProfilePictureUrl = uploadResult.secure_url;
      finalProfilePicturePublicId = uploadResult.public_id;
    }

    const updatedUsername = username ?? user.username;
    const updatedEmail = email ?? user.email;
    const updatedDateOfBirth = dateOfBirth ?? user.dateOfBirth;
    const updatedGender = gender ?? user.gender;
    const updatedWeight = weight ?? user.weight;
    const updatedHeight = height ?? user.height;

    // Jalankan Query UPDATE manual ke PostgreSQL
    const updateQuery = `
      UPDATE "Users"
      SET 
        username = $1, 
        email = $2, 
        "dateOfBirth" = $3, 
        gender = $4, 
        weight = $5, 
        height = $6, 
        "profilePictureUrl" = $7, 
        "profilePicturePublicId" = $8,
        "updatedAt" = CURRENT_TIMESTAMP
      WHERE id = $9
      RETURNING *;
    `;
    
    const updateValues = [
      updatedUsername, updatedEmail, updatedDateOfBirth, updatedGender,
      updatedWeight, updatedHeight, finalProfilePictureUrl, finalProfilePicturePublicId, userId
    ];

    const { rows: updatedRows } = await pool.query(updateQuery, updateValues);
    const updatedUser = updatedRows[0];

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        id: updatedUser.id,
        username: updatedUser.username,
        email: updatedUser.email,
        dateOfBirth: updatedUser.dateOfBirth,
        gender: updatedUser.gender,
        weight: updatedUser.weight,
        height: updatedUser.height,
        imageUrl: updatedUser.profilePictureUrl
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


export const deleteProfilePicture = async (req, res) => {
  try {
    const userId = req.user.id;

    // 1. Cari data user untuk mendapatkan publicId Cloudinary
    const { rows } = await pool.query('SELECT * FROM "Users" WHERE id = $1', [userId]);
    const user = rows[0];

    if (!user) {
      return res.status(404).json({ success: false, message: 'User tidak ditemukan.' });
    }

    // 2. Cek apakah user punya foto profil atau tidak
    if (!user.profilePicturePublicId) {
      return res.status(400).json({ success: false, message: 'User belum memiliki foto profil atau foto sudah dihapus.' });
    }

    // 3. Hapus asset foto dari Cloudinary
    await cloudinary.uploader.destroy(user.profilePicturePublicId, { invalidate: true });
    console.log(`=== FOTO PROFIL DENGAN ID ${user.profilePicturePublicId} BERHASIL DIHAPUS DARI CLOUDINARY ===`);

    // 4. Update data di database, set kolom url & publicId menjadi NULL
    const deletePhotoQuery = `
      UPDATE "Users"
      SET 
        "profilePictureUrl" = NULL, 
        "profilePicturePublicId" = NULL,
        "updatedAt" = CURRENT_TIMESTAMP
      WHERE id = $1
      RETURNING *;
    `;
    
    const { rows: updatedRows } = await pool.query(deletePhotoQuery, [userId]);
    const updatedUser = updatedRows[0];

    res.status(200).json({
      success: true,
      message: 'Profile picture deleted successfully',
      data: {
        id: updatedUser.id,
        username: updatedUser.username,
        email: updatedUser.email,
        imageUrl: updatedUser.profilePictureUrl 
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};