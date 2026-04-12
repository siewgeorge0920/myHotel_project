import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import v3Router from './routes/index.js';

dotenv.config();

const app = express();

// 🚀 Initialize Core
connectDB();

// 🛠️ Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 🛰️ Mount V3 API
// Mounted at /api to maintain compatibility with existing frontend axios calls
app.use('/api', v3Router);
app.use('/api/v3', v3Router); // Alias for versioned requests

// Fallback for versioning awareness
app.get('/api/status', (req, res) => {
  res.json({ 
    version: '3.0.0-stable',
    architecture: 'Controller-Service-Model',
    status: 'Operational'
  });
});

/**
 * 🛰️ Global Error Handler (V3 Standard)
 */
app.use((err, req, res, next) => {
  console.error('[V3 System Error]', err.stack);
  res.status(500).json({ 
    error: 'Internal Server Error',
    message: err.message 
  });
});

export default app;
