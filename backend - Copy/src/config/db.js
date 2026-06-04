import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;


const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false 
  }
});

// Tes koneksi
pool.connect((err, client, release) => {
  if (err) {
    return console.error('❌ Gagal terhubung ke database PostgreSQL:', err.message);
  }
  console.log('⚡ Sukses terhubung ke database PostgreSQL!');
  release();
});

export default pool;