import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import mainRouter from './api.js';
import { AppError } from './shared/utils/responseHandler.js';

dotenv.config();
const app = express();

// Core Initialization
connectDB();

const allowedOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'https://my-hotel-project-siewgeorge0920.vercel.app',
  'https://theatlantichorizon.ie',
  'https://www.theatlantichorizon.ie',
  'https://theatlantichorizion.com',
  'https://www.theatlantichorizion.com'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.warn(` CORS Blocked: Origin "${origin}" is not in the whitelist.`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
app.use(cookieParser());
app.use(express.json());

// Strategic API Mounting
app.use('/api', mainRouter); // Removed /v3 as user wants to "remove v3"

// Handle Undefined Routes
app.use((req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this manor's server!`, 404));
});

// Global Error Handler
app.use((err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  
  res.status(err.statusCode).json({
    success: false,
    message: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

export default app;
