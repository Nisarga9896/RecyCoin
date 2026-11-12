import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { connectDB } from './db.js';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();

const configuredOrigins = (process.env.CLIENT_ORIGIN || '')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);
const allowedOrigins = new Set([
  'http://localhost:5173',
  'https://recy-coin.vercel.app',
  ...configuredOrigins,
]);
const allowAllOrigins = configuredOrigins.includes('*');

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowAllOrigins || allowedOrigins.has(origin)) {
        return callback(null, true);
      }
      return callback(new Error(`Origin not allowed by CORS: ${origin}`));
    },
  })
);
app.use(express.json({ limit: '10mb' }));

app.get('/api/health', (req, res) => res.json({ status: 'ok', service: 'recycoin-api' }));

// Routes
import authRoutes from './routes/auth.js';
import itemRoutes from './routes/items.js';
import orderRoutes from './routes/orders.js';
import gameRoutes from './routes/game.js';
import sellerRoutes from './routes/seller.js';

app.use('/api/auth', authRoutes);
app.use('/api/items', itemRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/game', gameRoutes);
app.use('/api/seller', sellerRoutes);

app.use((err, req, res, next) => {
  console.error('❌ Error:', err.message);
  res.status(err.status || 500).json({ error: err.message || 'Server error' });
});

const PORT = process.env.PORT || 5000;

async function start() {
  try {
    await connectDB();
    app.listen(PORT, () => console.log(`🚀 RecyCoin API running on http://localhost:${PORT}`));
  } catch (err) {
    console.error('Failed to start server:', err.message);
    process.exit(1);
  }
}

start();