import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

export async function predictFood(image) {
  // 1. Validasi awal
  if (!image || !image.buffer) {
    throw new Error("File gambar tidak ditemukan atau rusak!");
  }

  try {
    // 2. Siapkan wadah FormData untuk mengirim file biner (Buffer RAM) ke Server AI
    const formData = new FormData();
    
    // Ubah buffer dari Multer menjadi objek Blob agar bisa dibaca oleh Axios FormData
    const imageBlob = new Blob([image.buffer], { type: image.mimetype });
    
    formData.append('file', imageBlob, image.originalname);

    // Ambil URL langsung dari .env
    const aiEndpoint = process.env.AI_SERVER_URL; 

    const customHeaders = aiEndpoint && aiEndpoint.includes('ngrok')
      ? { 'ngrok-skip-browser-warning': 'true' }
      : {};

    console.log(`=== MENEMBAK SERVER AI: ${aiEndpoint} ===`);

    // 3. penembakan data menggunakan AXIOS
    const response = await axios.post(aiEndpoint, formData, {
      headers: customHeaders
    });

    // 4. Ambil hasil prediksi 
    const aiResult = response.data;
    console.log("=== HASIL RESPONS DARI SERVER AI ===");
    console.log(JSON.stringify(aiResult, null, 2));
    console.log("====================================");

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
    // Handling eror 
    if (error.response) {
      console.error("Server AI Merespons Eror:", error.response.status, error.response.data);
      throw new Error(`AI Server Error: ${error.response.status} - ${JSON.stringify(error.response.data)}`);
    } else if (error.request) {
      console.error("Tidak ada balasan dari Server AI. Pastikan Ngrok AI aktif!");
      throw new Error("Koneksi ke Server AI putus, Timeout, atau diblokir Ngrok!");
    } else {
      console.error("Gagal terhubung ke Server AI:", error.message);
      throw new Error(`Koneksi AI Gagal: ${error.message}`);
    }
  }
}