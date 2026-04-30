import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import connectDB from './config/db.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
import { AppError } from './utils/responseHandler.js';

// Route Imports
import authRoutes from './routes/auth.routes.js';
import bookingRoutes from './routes/booking.routes.js';
import roomRoutes from './routes/room.routes.js';
import logRoutes from './routes/logs.routes.js';
import billingRoutes from './routes/billing.routes.js';
import settingsRoutes from './routes/settings.routes.js';
import cookieRoutes from './routes/cookies.routes.js';

dotenv.config();
const app = express();

// View Engine Configuration (MVC)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public'))); // For any CSS/Images shared with views

// View Controller Import
import viewController from './controllers/view.controller.js';

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

// Traditional View Routes (Server-Side Rendering)
app.get('/booking-success', viewController.getBookingSuccess);
app.get('/gift-card-success', viewController.getGiftCardSuccess);
app.get('/system-status', viewController.getSystemStatus);

// Strategic API Mounting
app.use('/api/auth', authRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/logs', logRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/billing', billingRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/cookies', cookieRoutes);

// Catch-all mountings for backward compatibility or direct root access
app.use('/api', authRoutes);      
app.use('/api', roomRoutes);      
app.use('/api', bookingRoutes);   
app.use('/api', logRoutes);       
app.use('/api', billingRoutes);
app.use('/api', cookieRoutes);



// Handle Undefined Routes (Professional 404 View)
app.use((req, res, next) => {
  if (req.accepts('html')) {
    return res.status(404).render('error-404', { 
      title: 'Page Not Found | Atlantic Horizon',
      url: req.originalUrl 
    });
  }
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
