import pg from 'pg';
import dotenv from 'dotenv';

// Memastikan variabel di file .env bisa terbaca
dotenv.config();

const { Pool } = pg;

// Membuat koneksi database menggunakan Pool
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 5432, 
});

// Tes koneksi saat aplikasi pertama kali berjalan
pool.connect((err, client, release) => {
  if (err) {
    return console.error('❌ Gagal terhubung ke database PostgreSQL:', err.stack);
  }
  console.log('⚡ Sukses terhubung ke database PostgreSQL menggunakan Pool!');
  release();
});

export default pool;