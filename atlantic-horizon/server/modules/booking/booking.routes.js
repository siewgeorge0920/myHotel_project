import express from 'express';
import bookingController from './booking.controller.js';
import { protect, restrictTo } from '../../shared/middleware/auth.js';

const router = express.Router();

// Public Routes (Guest Portal)
router.post('/check-availability', bookingController.checkAvailability);
router.post('/self-check-in', bookingController.selfCheckIn);
router.post('/manage-lookup', bookingController.manageLookup);
router.post('/manage-update-phone', bookingController.manageUpdatePhone);

// Protected Routes (Staff/Admin)
router.use(protect);

// Dashboard & General
router.get('/dashboard/stats', restrictTo('admin', 'manager', 'staff'), bookingController.getDashboardStats);
router.get('/', restrictTo('admin', 'manager', 'staff'), bookingController.getAllBookings);
router.post('/admin-create', restrictTo('admin', 'manager', 'staff'), bookingController.createBooking);

// Stripe & Payments
router.post('/create-checkout-session', bookingController.createSession);
router.post('/create-payment-intent', bookingController.createPaymentIntent);
router.post('/resend-payment-link', restrictTo('admin', 'manager'), bookingController.resendPaymentLink);

// Targeted Operations
router.route('/:id')
  .get(restrictTo('admin', 'manager', 'staff'), bookingController.updateBooking) // getOne is basically update form fetch
  .put(restrictTo('admin', 'manager', 'staff'), bookingController.updateBooking)
  .delete(restrictTo('admin'), bookingController.deleteBooking);

router.put('/:id/confirm', restrictTo('admin', 'manager', 'staff'), bookingController.confirmBooking);
router.put('/:id/checkin', restrictTo('admin', 'manager', 'staff'), bookingController.checkIn);
router.put('/:id/extend', restrictTo('admin', 'manager', 'staff'), bookingController.extendStay);
router.put('/:id/complete-checkout', restrictTo('admin', 'manager', 'staff'), bookingController.completeCheckout);
router.post('/:id/refund', restrictTo('admin'), bookingController.refund);

export default router;
