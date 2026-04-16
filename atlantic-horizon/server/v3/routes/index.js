import express from 'express';
import bookingController from '../controllers/bookingController.js';
import giftCardController from '../controllers/giftCardController.js';
import physicalRoomController from '../controllers/physicalRoomController.js';
import authController from '../controllers/authController.js';
import settingsController from '../controllers/settingsController.js';
import cookieController from '../controllers/cookieController.js';
import { protect, restrictTo } from '../middleware/auth.js';

const router = express.Router();

/**
 * 🔐 Authentication & Staff IAM Routes
 */
router.post('/auth/login', authController.login);
router.post('/auth/seed-admin', authController.seed);

// Full Staff CRUD (Admin Only)
router.get('/staff', protect, restrictTo('admin'), authController.getAllStaff);
router.post('/staff', protect, restrictTo('admin'), authController.createStaff);
router.put('/staff/:id', protect, restrictTo('admin'), authController.updateStaff);
router.delete('/staff/:id', protect, restrictTo('admin'), authController.deleteStaff);

/**
 * 🏨 Booking & Availability Routes
 */
router.get('/bookings', protect, bookingController.getAllBookings);
router.post('/bookings/create', bookingController.createBooking); // Public Booking
router.post('/bookings/self-check-in', bookingController.selfCheckIn);
router.post('/bookings/admin-create', protect, restrictTo('admin', 'manager'), bookingController.createBooking); // Dashboard Booking
router.put('/bookings/:id', protect, restrictTo('admin', 'manager'), bookingController.updateBooking); // Full Update
router.put('/bookings/:id/status', protect, bookingController.updateStatus); // Restricted Status Transition
router.put('/bookings/:id/payment-status', bookingController.updatePaymentStatus); // Public Payment Update
router.put('/bookings/:id/confirm', protect, bookingController.confirmBooking);
router.put('/bookings/:id/checkin', protect, bookingController.checkIn);
router.put('/bookings/:id/extend', protect, bookingController.extendStay);
router.put('/bookings/:id/complete-checkout', protect, bookingController.completeCheckout);
router.post('/bookings/:id/refund', protect, bookingController.refund);
router.get('/dashboard/stats', protect, bookingController.getDashboardStats);
router.delete('/bookings/:id', protect, restrictTo('admin'), bookingController.deleteBooking); // Purge

router.post('/bookings/check-availability', bookingController.checkAvailability);
router.post('/create-checkout-session', bookingController.createSession);
router.post('/create-payment-intent', bookingController.createPaymentIntent);
router.post('/resend-payment-link', bookingController.resendPaymentLink);

/**
 * 🎫 Gift Card Routes
 */
router.post('/gift-cards/checkout', giftCardController.startPurchase);
router.post('/gift-cards/verify-purchase', giftCardController.verifyPurchase);
router.post('/gift-cards/validate', giftCardController.validate);
router.post('/gift-cards/instant-purchase', giftCardController.instantPurchase);
router.get('/gift-cards/all', protect, restrictTo('admin', 'manager'), giftCardController.getAllGiftCards);
router.get('/gift-cards/:code/history', protect, restrictTo('admin', 'manager'), giftCardController.getGiftCardHistory);

/**
 * 🏨 Physical Room & Inventory Routes
 */
router.get('/physical-rooms', protect, physicalRoomController.getAll);
router.post('/physical-rooms', protect, restrictTo('admin', 'manager'), physicalRoomController.create);
router.put('/physical-rooms/:id', protect, restrictTo('admin', 'manager', 'staff'), physicalRoomController.update);
router.delete('/physical-rooms/:id', protect, restrictTo('admin'), physicalRoomController.delete);

/**
 * ⚙️ Infrastructure & Settings Routes
 */
router.get('/settings/email', protect, restrictTo('admin', 'manager'), settingsController.getEmailSettings);
router.post('/settings/email', protect, restrictTo('admin', 'manager'), settingsController.updateEmailSettings);

/**
 * 🍪 Cookie Consent Routes
 */
router.post('/cookie-consent', cookieController.saveConsent);
router.get('/cookie-consents', protect, restrictTo('admin', 'manager'), cookieController.getAllConsents);

export default router;
