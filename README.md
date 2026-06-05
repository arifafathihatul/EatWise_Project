# 🥗 EatWise
### Sistem Analisis Kandungan Nutrisi dan Prediksi Risiko Kesehatan Berdasarkan Pola Konsumsi Makanan

> **Coding Camp 2026 powered by DBS Foundation** — Tim CC26-PSU301  
> Tema: **Healthy Lives & Well-being**

---

## 📌 Deskripsi Singkat Proyek

**EatWise** adalah sistem cerdas berbasis AI yang dirancang untuk membantu pengguna—khususnya mahasiswa dan anak kos—dalam menganalisis kandungan nutrisi makanan dan mendapatkan rekomendasi konsumsi secara bijak.

Masalah utama yang diangkat adalah kebiasaan mahasiswa/anak kos yang memilih makanan berdasarkan harga dan kepraktisan tanpa mempertimbangkan nilai gizi, yang berpotensi menimbulkan risiko kesehatan akibat pola makan tidak seimbang.

Alur kerja EatWise dimulai dari pengguna memasukkan data personal (berat badan, tinggi badan, usia, dan tingkat aktivitas) untuk menentukan target nutrisi harian berbasis BMR. Saat pemindaian makanan menggunakan kamera, sistem melakukan image classification untuk mengidentifikasi jenis makanan dan mengestimasi kandungan nutrisinya. Selanjutnya sistem menganalisis pola konsumsi pengguna dan menghasilkan insight berupa peringatan konsumsi berlebih serta potensi risiko kesehatan jangka panjang.

---

## ⚙️ Petunjuk Setup *Environment*

### Prasyarat Umum
Pastikan sudah terinstal:
- **Node.js** v18+ dan npm
- **Python** 3.9+
- **Git**

### 🎨 Learning Path 1 — Front-End & Back-End (Full-Stack)

```bash
# Clone repository
git clone https://github.com/arifafathihatul/EatWise_Project.git
cd EatWise_Project

# Setup Back-End
cd backend
npm install
cp .env.example .env
# Isi konfigurasi: PORT, DATABASE_URL, AI_SERVICE_URL, dll.

# Setup Front-End (buka terminal baru)
cd frontend
npm install
cp .env.example .env
# Isi VITE_API_BASE_URL=http://localhost:5000
```

### 🤖 Learning Path 2 — Artificial Intelligence (AI Engineer)

```bash
# Masuk ke folder AI service
cd ai-service

# Buat virtual environment
python -m venv venv

# Aktivasi (Windows)
venv\Scripts\activate

# Aktivasi (Linux/macOS)
source venv/bin/activate

# Install dependensi
pip install -r requirements.txt
```

### 📊 Learning Path 3 — Data Science

```bash
# Masuk ke folder data science
cd data-science

# Buat virtual environment
python -m venv venv

# Aktivasi (Windows)
venv\Scripts\activate

# Install dependensi
pip install -r requirements.txt
```

---

## 🔗 Tautan Model ML

> Tautan berikut digunakan untuk mengunduh (*download*) dan memuat (*load*) model Machine Learning yang digunakan dalam proyek EatWise.

| Aset | Keterangan | Tautan |
|------|-----------|--------|
| 📦 Dataset Training | Dataset nutrisi & makanan | [EatWise Dataset](https://docs.google.com/spreadsheets/d/1Mdmm3MKGPGgDsdkhJTsKU0Za-L7Msd4BWoE57JDnWFM/edit?usp=sharing) |
| 🤖 Model (.keras) | Saved model siap produksi | [Download Model] -> (https://drive.google.com/file/d/1MWLlMNcTXMpDT-TCTWm1Xrzz5RL9lVL0/view?usp=drivesdk)  |
| 📁 Repository Lengkap | Source code + model | [EatWise_Project GitHub](https://github.com/arifafathihatul/EatWise_Project.git) |

**Cara memuat model:**
```python
import tensorflow as tf

# Load model dari file .keras
model = tf.keras.models.load_model("ai-service/models/eatwise_model.keras")

# Verifikasi model berhasil dimuat
model.summary()
```
---

## 🚀 Langkah-Langkah Menjalankan Program

### 🎨 Learning Path 1 — Front-End & Back-End (Full-Stack)

#### Clone Repository
```bash
git clone https://github.com/arifafathihatul/EatWise_Project.git
cd EatWise_Project
```

#### Menjalankan Back-End (Node.js + Express)
```bash
# Masuk ke folder backend
cd backend

# Install dependensi
npm install

# Buat file environment
cp .env.example .env
# Isi konfigurasi: PORT, DATABASE_URL, AI_SERVICE_URL, dll.

# Jalankan server (development)
npm run dev

# Server berjalan di: http://localhost:5000
```

#### Menjalankan Front-End (React.js + Vite)
```bash
# Masuk ke folder frontend (buka terminal baru)
cd frontend

# Install dependensi
npm install

# Buat file environment
cp .env.example .env
# Isi VITE_API_BASE_URL=http://localhost:5000

# Jalankan development server
npm run dev

# Aplikasi berjalan di: http://localhost:5173
```

#### Build untuk Production
```bash
cd frontend
npm run build
# Output tersedia di folder dist/
```

---

### 🤖 Learning Path 2 — Artificial Intelligence (AI Engineer)

#### Setup Environment Python
```bash
# Masuk ke folder AI service
cd ai-service

# Buat virtual environment
python -m venv venv

# Aktivasi (Windows)
venv\Scripts\activate

# Aktivasi (Linux/macOS)
source venv/bin/activate

# Install dependensi
pip install -r requirements.txt
```

#### Melatih Model
```bash
# Pastikan dataset sudah tersedia di folder data/
python train.py

# Model akan tersimpan di folder models/ dalam format .keras
```

#### Menjalankan Inference (Uji Model)
```bash
python inference.py --image path/to/food_image.jpg
```

#### Menjalankan AI Service (FastAPI)
```bash
# Jalankan API server
uvicorn main:app --reload --host 0.0.0.0 --port 8000

# AI service berjalan di: http://localhost:8000
# Dokumentasi API: http://localhost:8000/docs
```

#### Memantau Training dengan TensorBoard
```bash
tensorboard --logdir=logs/
# Buka: http://localhost:6006
```

### 📊 Learning Path 3 — Data Science

#### Setup Environment Python
```bash
# Masuk ke folder data science
cd data-science

# Buat virtual environment
python -m venv venv
source venv/bin/activate  # atau venv\Scripts\activate di Windows

# Install dependensi
pip install -r requirements.txt
```

#### Menjalankan Notebook (EDA & Analisis)
```bash
# Jalankan Jupyter Notebook
jupyter notebook

# Buka notebook secara berurutan:
# 1. 01_data_gathering.ipynb   → Pengumpulan & scraping data
# 2. 02_data_assessing.ipynb   → Evaluasi kualitas data
# 3. 03_data_cleaning.ipynb    → Pembersihan data
# 4. 04_eda.ipynb              → Exploratory Data Analysis
# 5. 05_explanatory.ipynb      → Visualisasi & jawaban business question
```

#### Menjalankan Dashboard Streamlit (Lokal)
```bash
streamlit run dashboard.py

# Dashboard berjalan di: http://localhost:8501
```

#### Deploy Dashboard ke Streamlit Cloud
1. Push kode ke GitHub
2. Login ke [streamlit.io/cloud](https://streamlit.io/cloud)
3. Klik **New App** → pilih repository
4. Atur path file: `data-science/dashboard.py`
5. Klik **Deploy**

---

*Coding Camp 2026 powered by DBS Foundation — CC26-PSU301*
