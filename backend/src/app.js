import express from 'express';
import cors from 'cors';
import path from 'path';
import rootRouter from './routes/indexRoutes.js';
import { fileURLToPath } from 'url';
import { errorHandler } from './middlewares/errorMiddleware.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.get('/', (req, res) => {
  res.status(200).json({ success: true, message: 'EatWise API is running murni dengan Raw SQL 🚀' });
});

// Jalur routing utama
app.use('/', rootRouter);

app.use(errorHandler);

export default app;