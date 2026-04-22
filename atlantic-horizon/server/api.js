import express from 'express';
import authRoutes from './modules/auth/auth.routes.js';
import bookingRoutes from './modules/booking/booking.routes.js';
import roomRoutes from './modules/room/room.routes.js';
import billingRoutes from './modules/billing/billing.routes.js';
import settingsRoutes from './modules/settings/settings.routes.js';
import cookieRoutes from './modules/cookies/cookies.routes.js';

const router = express.Router();

// 🚦 Modular Mounting (Priority: Specific -> Generic)
router.use('/auth', authRoutes);
router.use('/rooms', roomRoutes);
router.use('/bookings', bookingRoutes);
router.use('/billing', billingRoutes);
router.use('/settings', settingsRoutes);
router.use('/cookies', cookieRoutes);

// 🌐 Catch-all mountings for backward compatibility or direct root access
router.use('/', roomRoutes);      // Matches /physical-rooms first
router.use('/', authRoutes);      // Matches /staff, /login
router.use('/', bookingRoutes);   // Matches /dashboard/stats and finally /:id
router.use('/', billingRoutes);
router.use('/', cookieRoutes);

export default router;
