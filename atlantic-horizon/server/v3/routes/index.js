import express from 'express';
import bookingController from '../controllers/bookingController.js';
import orderController from '../controllers/orderController.js';
import iotKeyController from '../controllers/iotKeyController.js';
import giftCardController from '../controllers/giftCardController.js';
import physicalRoomController from '../controllers/physicalRoomController.js';
import authController from '../controllers/authController.js';
import crmController from '../controllers/crmController.js';
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
router.put('/bookings/:id/reception-checkin', protect, bookingController.receptionCheckIn); // Manual Reception Check-in
router.delete('/bookings/:id', protect, restrictTo('admin'), bookingController.deleteBooking); // Purge

router.post('/bookings/check-availability', bookingController.checkAvailability);
router.post('/create-checkout-session', bookingController.createSession);
router.post('/create-payment-intent', bookingController.createPaymentIntent);
router.post('/resend-payment-link', bookingController.resendPaymentLink);

/**
 * 🍽️ F&B Room Service Routes
 */
router.post('/room-service/order', orderController.placeOrder);
router.get('/room-service/all-orders', orderController.getAllOrders);
router.put('/room-service/order/:id', orderController.updateStatus);
router.post('/room-service/checkout', orderController.createFbCheckout);

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
 * 🏨 Physical Room & IoT Inventory Routes
 */
router.get('/physical-rooms', protect, physicalRoomController.getAll);
router.post('/physical-rooms', protect, restrictTo('admin', 'manager'), physicalRoomController.create);
router.put('/physical-rooms/:id', protect, restrictTo('admin', 'manager'), physicalRoomController.update);
router.delete('/physical-rooms/:id', protect, restrictTo('admin'), physicalRoomController.delete);

/**
 * 👥 CRM & Guest Management Routes
 */
router.get('/crm/clients', protect, crmController.getAllClients);
router.get('/crm/clients/:id', protect, crmController.getClientById);
router.post('/crm/clients', protect, restrictTo('admin', 'manager'), crmController.createClient);
router.put('/crm/clients/:id', protect, restrictTo('admin', 'manager'), crmController.updateClient);
router.delete('/crm/clients/:id', protect, restrictTo('admin'), crmController.deleteClient);

/**
 * 📱 IoT Key Routes
 */
router.get('/room-card/my-key', iotKeyController.getMyKey);
router.post('/room-card/regenerate', iotKeyController.regenerateKey);

export default router;
