import express from 'express';
import bookingController from '../controllers/bookingController.js';
import orderController from '../controllers/orderController.js';
import iotKeyController from '../controllers/iotKeyController.js';
import giftCardController from '../controllers/giftCardController.js';
import physicalRoomController from '../controllers/physicalRoomController.js';
import authController from '../controllers/authController.js';

const router = express.Router();

/**
 * 🔐 Authentication & Staff IAM Routes
 */
router.post('/auth/login', authController.login);
router.post('/auth/seed-admin', authController.seed);

// Full Staff CRUD
router.get('/staff', authController.getAllStaff);
router.post('/staff', authController.createStaff);
router.put('/staff/:id', authController.updateStaff);
router.delete('/staff/:id', authController.deleteStaff);

/**
 * 🏨 Booking & Availability Routes
 */
router.get('/bookings', bookingController.getAllBookings);
router.post('/bookings/create', bookingController.createBooking);
router.put('/bookings/:id', bookingController.updateBooking); // Full Update
router.put('/bookings/:id/status', bookingController.updateStatus); // Quick Status Transition
router.delete('/bookings/:id', bookingController.deleteBooking); // Purge

router.post('/bookings/check-availability', bookingController.checkAvailability);
router.post('/create-checkout-session', bookingController.createSession);
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

/**
 * 🏨 Physical Room & IoT Inventory Routes
 */
router.get('/physical-rooms', physicalRoomController.getAll);
router.post('/physical-rooms', physicalRoomController.create);
router.put('/physical-rooms/:id', physicalRoomController.update);
router.delete('/physical-rooms/:id', physicalRoomController.delete);

/**
 * 📱 IoT Key Routes
 */
router.get('/room-card/my-key', iotKeyController.getMyKey);
router.post('/room-card/regenerate', iotKeyController.regenerateKey);

export default router;
