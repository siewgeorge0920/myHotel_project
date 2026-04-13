import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import v3Router from './routes/index.js';
import { AppError } from './utils/responseHandler.js';

dotenv.config();
const app = express();

// Core Initialization
connectDB();

const allowedOrigins = [
  'http://localhost:5173',
  'https://my-hotel-project-siewgeorge0920.vercel.app',
  'https://www.theatlantichorizion.com',
  'https://theatlantichorizion.com'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
app.use(cookieParser());
app.use(express.json());

// Strategic API Mounting
app.use('/api/v3', v3Router);

// Handle Undefined Routes (Anti-Ghosting)
app.use((req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this manor's server!`, 404));
});

/**
 * Visionary Global Error Handler
 * Replaces the basic one in the old system
 */
app.use((err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  
  // Logic: In production, we don't show "scary" stack traces to guests
  res.status(err.statusCode).json({
    success: false,
    message: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

export default app;