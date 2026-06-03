import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

export async function predictFood(image) {
  if (!image || !image.buffer) {
    throw new Error("File gambar tidak ditemukan atau rusak!");
  }

  const aiEndpoint = process.env.AI_SERVER_URL;
  
  if (!aiEndpoint) {
    console.warn("⚠️ AI_SERVER_URL tidak diset.");
    return {
      predicted_name: "AI Offline",
      confidence: 0,
      nutrition: { calories: 0, protein: 0, fat: 0, carbohydrate: 0 },
      health_warning: "Server AI belum dikonfigurasi."
    };
  }

  try {
    const formData = new FormData();
    const imageBlob = new Blob([image.buffer], { type: image.mimetype });
    formData.append('file', imageBlob, image.originalname);

    const customHeaders = aiEndpoint.includes('ngrok')
      ? { 'ngrok-skip-browser-warning': 'true' }
      : {};

    const response = await axios.post(aiEndpoint, formData, { 
      headers: customHeaders,
      timeout: 10000 
    });
    
    return response.data;
  } catch (error) {
    console.error("❌ Gagal menembak Server AI:", error.message);
    return {
      predicted_name: "Gagal mendeteksi",
      confidence: 0,
      nutrition: { calories: 0, protein: 0, fat: 0, carbohydrate: 0 },
      health_warning: "Server AI sedang tidak tersedia."
    };
  }
}