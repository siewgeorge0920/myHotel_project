import express from 'express';
import authRoutes from './modules/auth/auth.routes.js';
import bookingRoutes from './modules/booking/booking.routes.js';
import roomRoutes from './modules/room/room.routes.js';
import logRoutes from './modules/logs/logs.routes.js';
import billingRoutes from './modules/billing/billing.routes.js';
import settingsRoutes from './modules/settings/settings.routes.js';
import cookieRoutes from './modules/cookies/cookies.routes.js';

const router = express.Router();

//  Modular Mounting (Priority: Specific -> Generic)
router.use('/auth', authRoutes);
router.use('/rooms', roomRoutes);
router.use('/logs', logRoutes);
router.use('/bookings', bookingRoutes);
router.use('/billing', billingRoutes);
router.use('/settings', settingsRoutes);
router.use('/cookies', cookieRoutes);

//  Catch-all mountings for backward compatibility or direct root access
router.use('/', authRoutes);      // Matches /staff, /login, /verify
router.use('/', roomRoutes);      // Matches /physical-rooms, /rooms
router.use('/', bookingRoutes);   // Matches /dashboard/stats, /bookings
router.use('/', logRoutes);       // Matches /logs
router.use('/', billingRoutes);
router.use('/', cookieRoutes);

export default router;
