# 📖 Data Dictionary — EatWise Final Dataset

**File:** `eatwise_final_dataset.csv`  
**Jumlah Baris:** 2.522 makanan  
**Jumlah Kolom:** 15  
**Missing Values:** Tidak ada (0 pada semua kolom)

---

## 📋 Daftar Kolom

| No | Nama Kolom | Tipe Data | Deskripsi |
|----|------------|-----------|-----------|
| 1 | `id` | int64 | ID unik setiap makanan (1 – 2931) |
| 2 | `calories` | float64 | Kandungan kalori per 100g (kkal), rentang 0 – 940 |
| 3 | `proteins` | float64 | Kandungan protein per 100g (gram), rentang 0 – 83 |
| 4 | `fat` | float64 | Kandungan lemak per 100g (gram), rentang 0 – 100 |
| 5 | `carbohydrate` | float64 | Kandungan karbohidrat per 100g (gram), rentang 0 – 124.8 |
| 6 | `name` | str | Nama makanan dalam Bahasa Indonesia |
| 7 | `image` | str | URL gambar makanan (sumber: web publik) |
| 8 | `Cluster` | int64 | Label klaster hasil K-Means (0, 1, atau 2) |
| 9 | `label_nutrisi` | str | Nama kategori klaster dalam bahasa natural |
| 10 | `penjelasan_realistis` | str | Narasi otomatis kondisi nutrisi makanan |
| 11 | `status_makanan` | str | Status konsumsi makanan: `Aman`, `Perhatian`, atau `Waspada` |
| 12 | `disease_risk_analysis` | str | Analisis risiko penyakit berdasarkan profil nutrisi makanan |
| 13 | `status` | str | Tingkat intensitas risiko: `Ringan`, `Sedang`, atau `Berat` |
| 14 | `level_risiko` | str | Level risiko kesehatan: `Aman`, `Perhatian`, atau `Waspada` |
| 15 | `health_score` | int64 | Skor kesehatan makanan (0 – 100, semakin tinggi semakin sehat) |

---

## 🔍 Detail Kolom Kategorikal

### `Cluster`
Hasil segmentasi K-Means berdasarkan kandungan kalori, lemak, dan karbohidrat.

| Nilai | Representasi |
|-------|-------------|
| `0` | Kelompok dominan — makanan dengan profil nutrisi lebih terkontrol |
| `1` | Kelompok lemak dan kalori sedang-tinggi |
| `2` | Kelompok nutrisi terkontrol / rendah kalori |

### `label_nutrisi`
Label deskriptif dari hasil klaster. Nilai yang muncul dalam dataset:

| Nilai | Keterangan |
|-------|------------|
| `Nutrisi Terkontrol` | Kalori, lemak, dan karbo dalam batas wajar |
| `Kalori Tinggi` | Kandungan kalori dominan, makronutrien lain masih wajar |
| `Lemak Tinggi` | Kandungan lemak dominan, kalori moderat |
| `Karbo Tinggi` | Karbohidrat dominan |
| `Kalori Tinggi & Lemak Tinggi` | Kalori dan lemak sama-sama tinggi |
| `Kalori Tinggi & Karbo Tinggi` | Kalori dan karbohidrat sama-sama tinggi |
| `Lemak Tinggi & Karbo Tinggi` | Lemak dan karbohidrat sama-sama tinggi |
| `Kalori Tinggi & Lemak Tinggi & Karbo Tinggi` | Semua makronutrien tinggi |

### `status_makanan`
Rekomendasi konsumsi berdasarkan profil nutrisi makanan.

| Nilai | Keterangan |
|-------|------------|
| `Aman` | Aman dikonsumsi dalam porsi normal |
| `Perhatian` | Perlu diperhatikan frekuensi dan porsinya |
| `Waspada` | Sebaiknya dibatasi konsumsinya |

### `disease_risk_analysis`
Analisis risiko penyakit jangka panjang berdasarkan profil nutrisi makanan. Nilai merupakan kombinasi dari beberapa kondisi penyakit yang dipisahkan koma.

**Kondisi penyakit yang dapat muncul:**

| Nilai | Keterangan |
|-------|------------|
| `Relatif Aman / Nutrisi Seimbang` | Profil nutrisi tidak memicu risiko penyakit spesifik |
| `Risiko Malnutrisi` | Kandungan nutrisi terlalu rendah, berisiko kekurangan gizi |
| `Hipertensi & Penyakit Jantung` | Kandungan lemak/kalori tinggi yang berkaitan dengan tekanan darah dan jantung |
| `Dislipidemia (Kolesterol)` | Kandungan lemak berpotensi meningkatkan kadar kolesterol |
| `Diabetes Mellitus` | Kandungan karbohidrat tinggi yang berisiko terhadap gula darah |
| `Obesitas` | Kandungan kalori tinggi berpotensi memicu kelebihan berat badan |
| `Perlemakan Hati (Fatty Liver)` | Kombinasi lemak dan kalori tinggi berisiko terhadap kesehatan hati |

> Nilai pada kolom ini dapat berupa kombinasi, misalnya: `"Hipertensi & Penyakit Jantung, Dislipidemia (Kolesterol), Obesitas"`.

### `status`
Tingkat intensitas risiko, merupakan turunan dari profil kalori dan lemak.

| Nilai | Keterangan |
|-------|------------|
| `Ringan` | Risiko rendah, nutrisi masih terkontrol |
| `Sedang` | Risiko menengah, satu atau dua nutrisi melebihi batas wajar |
| `Berat` | Risiko tinggi, kalori dan/atau lemak sangat tinggi |

### `level_risiko`
Level risiko kesehatan jangka panjang jika dikonsumsi berlebihan.

| Nilai | Keterangan |
|-------|------------|
| `Aman` | Tidak berisiko jika dalam batas porsi normal |
| `Perhatian` | Perlu pemantauan asupan |
| `Waspada` | Berisiko melebihi kebutuhan harian jika tidak dikontrol |

---

## 📊 Ringkasan Statistik Kolom Numerik

| Kolom | Min | Rata-rata | Median (Q2) | Q1 | Q3 | Maks |
|-------|-----|-----------|-------------|----|----|------|
| `calories` | 0 | 246.95 kkal | 210 kkal | 131.25 | 331.53 | 940 kkal |
| `proteins` | 0 | 13.08 g | 10.00 g | 3.80 | 18.80 | 83 g |
| `fat` | 0 | 10.84 g | 8.00 g | 2.80 | 15.00 | 100 g |
| `carbohydrate` | 0 | 27.28 g | 22.00 g | 8.30 | 38.00 | 124.8 g |
| `health_score` | 0 | 63.57 | 68 | 52 | 81 | 100 |

---

## 🛠️ Kolom Hasil Feature Engineering

Kolom-kolom berikut **tidak ada di dataset mentah (`nutrition.csv`)** dan dihasilkan melalui proses feature engineering di notebook:

| Kolom | Proses |
|-------|--------|
| `Cluster` | K-Means Clustering berdasarkan `calories`, `fat`, `carbohydrate` |
| `label_nutrisi` | Pemetaan nilai cluster ke label deskriptif (8 kategori) |
| `penjelasan_realistis` | Teks naratif otomatis berdasarkan kombinasi `label_nutrisi` |
| `status_makanan` | Rule-based dari nilai `health_score` |
| `disease_risk_analysis` | Rule-based dari kombinasi kandungan kalori, lemak, dan karbohidrat |
| `status` | Rule-based dari kandungan kalori dan lemak |
| `level_risiko` | Turunan dari `status_makanan` |
| `health_score` | Scoring berbasis invers kalori dan lemak, dinormalisasi 0–100 |
