import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

export async function predictFood(image) {
  // 1. Validasi awal
  if (!image || !image.buffer) {
    throw new Error("File gambar tidak ditemukan atau rusak!");
  }

  // 2. CEK: Apakah URL AI sudah diset? Jika tidak, kembalikan data dummy/null
  const aiEndpoint = process.env.AI_SERVER_URL;
  if (!aiEndpoint) {
    console.warn("⚠️ AI_SERVER_URL tidak ditemukan. Fitur AI dimatikan sementara.");
    return null; 
  }

  try {
    const formData = new FormData();
    const imageBlob = new Blob([image.buffer], { type: image.mimetype });
    formData.append('file', imageBlob, image.originalname);

    const customHeaders = aiEndpoint.includes('ngrok')
      ? { 'ngrok-skip-browser-warning': 'true' }
      : {};

    console.log(`=== MENEMBAK SERVER AI: ${aiEndpoint} ===`);

    const response = await axios.post(aiEndpoint, formData, {
      headers: customHeaders,
      timeout: 10000 
    });

    const aiResult = response.data;
    return {
      predicted_name: aiResult.predicted_name || "Makanan Terdeteksi",
      confidence: aiResult.confidence !== undefined ? Number(aiResult.confidence) : 0.0,
      nutrition: {
        calories: aiResult.nutrition?.calories || 0,
        protein: aiResult.nutrition?.protein || 0,
        fat: aiResult.nutrition?.fat || 0,
        carbohydrate: aiResult.nutrition?.carbohydrate || 0
      },
      health_warning: aiResult.health_warning || null
    };

  } catch (error) {
    console.error("❌ Gagal menembak Server AI:", error.message);
    
    return {
      predicted_name: "Gagal mendeteksi (AI Offline)",
      confidence: 0,
      nutrition: { calories: 0, protein: 0, fat: 0, carbohydrate: 0 },
      health_warning: "Server AI sedang tidak tersedia."
    };
  }
}