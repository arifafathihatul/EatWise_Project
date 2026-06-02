
export const errorHandler = (err, req, res, next) => {
  console.error("❌ INTERNAL SERVER ERROR LOG:", err.stack);

  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({ success: false, message: 'Token tidak sah!' });
  }
  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({ success: false, message: 'Token sudah kedaluwarsa!' });
  }
  
  res.status(err.status || 500).json({
    success: false,
    message: 'Terjadi kesalahan pada server internal!',
    error: err.message
  });
};