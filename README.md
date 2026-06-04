# 🥗 EatWise
### Sistem Analisis Kandungan Nutrisi dan Prediksi Risiko Kesehatan Berdasarkan Pola Konsumsi Makanan

> **Coding Camp 2026 powered by DBS Foundation** — Tim CC26-PSU301  
> Tema: **Healthy Lives & Well-being**

---

## 📌 Deskripsi Proyek

**EatWise** adalah sistem cerdas berbasis AI yang dirancang untuk membantu pengguna—khususnya mahasiswa dan anak kos—dalam menganalisis kandungan nutrisi makanan dan mendapatkan rekomendasi konsumsi secara bijak.

Masalah utama yang diangkat adalah kebiasaan mahasiswa/anak kos yang memilih makanan berdasarkan harga dan kepraktisan tanpa mempertimbangkan nilai gizi, yang berpotensi menimbulkan risiko kesehatan akibat pola makan tidak seimbang.

### 🔍 Alur Kerja Sistem

```
Input Data Personal
(BB, TB, Usia, Aktivitas)
        ↓
Kalkulasi Target Nutrisi Harian
(Berbasis BMR - Basal Metabolic Rate)
        ↓
Pemindaian Makanan via Kamera
        ↓
Image Classification (Deep Learning)
→ Identifikasi jenis makanan
→ Estimasi kandungan nutrisi
        ↓
Analisis Pola Konsumsi Pengguna
        ↓
Generate Insight & Rekomendasi
→ Peringatan konsumsi berlebih
→ Prediksi risiko kesehatan jangka panjang
```

---

## 👥 Anggota Tim

| ID | Nama | Role |
|----|------|------|
| CFCC220D6X2843 | Handayani Deswita | Full-Stack Web Developer |
| CFCC220D6X2822 | Arifa Fathihatul Dina | Full-Stack Web Developer |
| CDCC220D6X1019 | Nayza Azura Putri | Data Scientist |
| CDCC220D6X1615 | Nuramenia | Data Scientist |
| CACC208D6Y0014 | Muh. Alif Yusuf Bakri | AI Engineer |

---

## 🔗 Tautan Penting

| Sumber | Link |
|--------|------|
| 🌐 Live Demo | [eatwisequ.netlify.app](https://eatwisequ.netlify.app/) |
| 📁 GitHub Repository | [EatWise_Project](https://github.com/arifafathihatul/EatWise_Project.git) |
| 📊 Dataset | [EatWise Dataset (Google Sheets)](https://docs.google.com/spreadsheets/d/1Mdmm3MKGPGgDsdkhJTsKU0Za-L7Msd4BWoE57JDnWFM/edit?usp=sharing) |

---

## 🏗️ Arsitektur Sistem

Proyek ini menggunakan pendekatan **Microservices** (disarankan oleh advisor), yaitu memisahkan tiga layanan utama:

```
┌─────────────────┐        ┌─────────────────┐        ┌─────────────────┐
│   FRONT-END     │◄──────►│    BACK-END     │◄──────►│   AI SERVICE    │
│   (React.js)    │  HTTP  │  (Node/Express) │  HTTP  │ (FastAPI/Flask) │
│   Vite / WP     │        │   RESTful API   │        │  TensorFlow     │
└─────────────────┘        └────────┬────────┘        └─────────────────┘
                                    │
                               ┌────▼────┐
                               │Database │
                               └─────────┘
```

> **Catatan:** Gambar yang diunggah pengguna diproses secara *in-memory* menggunakan **Multer** dan langsung dihapus setelah pemindaian selesai—tanpa disimpan permanen di server—untuk menghemat kapasitas penyimpanan.

---

## 🛠️ Tech Stack

### 🎨 Front-End & Back-End (Learning Path: Full-Stack Web Developer)
- **Front-End:** React.js, JavaScript, HTML/CSS
- **Build Tool:** Vite (atau Webpack)
- **Styling:** Tailwind CSS / Bootstrap
- **HTTP Client:** Axios
- **Back-End:** Node.js + Express.js
- **API:** RESTful API
- **File Upload:** Multer (in-memory processing)
- **Deployment:** Netlify / Vercel / GitHub Pages

### 🤖 AI / Model (Learning Path: Artificial Intelligence)
- **Framework:** TensorFlow (Functional API / Model Subclassing)
- **Task:** Image Classification (identifikasi jenis makanan)
- **Custom Components:** Custom Layer / Custom Loss Function / Custom Callback
- **Model Export:** Format `.keras` atau `SavedModel`
- **API Serving:** FastAPI atau Flask
- **Monitoring:** TensorBoard
- **Generative AI:** Digunakan sebagai fitur tambahan (sekunder)

### 📊 Data & Dashboard (Learning Path: Data Science)
- **Language:** Python
- **Libraries:** Pandas, NumPy, Matplotlib/Seaborn, Scikit-learn
- **Dashboard:** Streamlit
- **Deployment Dashboard:** Streamlit Cloud

---

## 🚀 Langkah-Langkah Menjalankan Program

### Prasyarat Umum
Pastikan sudah terinstal:
- **Node.js** v18+ dan npm
- **Python** 3.9+
- **Git**

---

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

#### Target Performa Model
| Metrik | Target |
|--------|--------|
| Akurasi | ≥ 85% |
| MAE | ≤ 0.02 |

---

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

## 📁 Struktur Direktori

```
EatWise_Project/
├── frontend/                  # React.js (Vite)
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── App.jsx
│   ├── public/
│   ├── package.json
│   └── vite.config.js
│
├── backend/                   # Node.js + Express
│   ├── routes/
│   ├── controllers/
│   ├── middleware/
│   ├── package.json
│   └── server.js
│
├── ai-service/                # Python FastAPI + TensorFlow
│   ├── models/                # Saved model (.keras)
│   ├── logs/                  # TensorBoard logs
│   ├── train.py
│   ├── inference.py
│   ├── main.py                # FastAPI entry point
│   └── requirements.txt
│
├── data-science/              # Notebook & Dashboard
│   ├── notebooks/
│   ├── data/
│   ├── dashboard.py           # Streamlit dashboard
│   └── requirements.txt
│
└── README.md
```

---

## 📊 Analisis SWOT

| | Positif | Negatif |
|---|---------|---------|
| **Internal** | ✅ Tim menguasai Python, TensorFlow, React, Node.js, Express | ❌ Dataset makanan terbatas; pengalaman deployment cloud masih terbatas |
| **Eksternal** | 🌟 Dataset publik dari Kaggle; framework & cloud modern tersedia | ⚠️ Model rentan terhadap foto gelap/sudut tidak lazim; risiko bug integrasi API |

---

## 📝 Catatan Penting dari Advisor

- **Arsy Opraza Akma:** Gunakan arsitektur **Microservices** (AI service terpisah via FastAPI/Flask). Terapkan HTTP status code standar untuk error handling.
- **Cynthia Caroline:** Prioritaskan **fungsionalitas 60%** sebelum estetika. Pastikan UI responsif dan desain background minimalis agar fokus pengguna tidak terpecah.

---

## ✅ Status Proyek

**100% Selesai** — Seluruh fitur utama telah diimplementasikan sesuai rencana awal, mulai dari identifikasi nutrisi hingga integrasi dashboard.

---

*Coding Camp 2026 powered by DBS Foundation — CC26-PSU301*
