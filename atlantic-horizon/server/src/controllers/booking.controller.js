import bookingService from '../services/booking.service.js';
import catchAsync from '../utils/catchAsync.js';
import { sendSuccess } from '../utils/responseHandler.js';
import { getStripe } from '../config/stripe.js';
import { getSetting } from '../utils/configHelper.js';
import { recordLog } from '../utils/logger.js';

const bookingController = {
  createBooking: catchAsync(async (req, res) => {
    let booking;
    if (req.body.check_in && req.body.check_out) {
      booking = await bookingService.adminCreate(req.body);
      await recordLog(req.user, 'ADMIN_BOOKING_CREATE', booking.booking_id, `Manual reservation created for ${booking.guest_name}`);
    } else {
      booking = await bookingService.createBooking(req.body);
    }
    sendSuccess(res, booking, "Reservation record established.", 201);
  }),

  updateStatus: catchAsync(async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    const updated = await bookingService.transitionStatus(id, status);
    await recordLog(req.user, 'BOOKING_STATUS_CHANGE', updated.booking_id, `Status set to ${status}`);
    sendSuccess(res, updated, `Status transitioned to ${status}`);
  }),

  updatePaymentStatus: catchAsync(async (req, res) => {
    const { id } = req.params;
    const updated = await bookingService.updatePaymentStatus(id, req.body.payment_status || req.body.status);
    await recordLog(req.user, 'PAYMENT_STATUS_UPDATE', updated.booking_id, `Payment status updated manually.`);
    sendSuccess(res, updated, "Payment status updated successfully.");
  }),

  getAllBookings: catchAsync(async (req, res) => {
    const bookings = await bookingService.getAllOrdered();
    sendSuccess(res, bookings);
  }),

  updateBooking: catchAsync(async (req, res) => {
    const updated = await bookingService.update(req.params.id, req.body);
    await recordLog(req.user, 'BOOKING_UPDATE', updated.booking_id, `Reservation details modified by staff.`);
    sendSuccess(res, updated, "Reservation updated.");
  }),

  deleteBooking: catchAsync(async (req, res) => {
    const booking = await bookingService._resolveBooking(req.params.id);
    const bId = booking?.booking_id;
    await bookingService.delete(req.params.id);
    await recordLog(req.user, 'BOOKING_PURGE', bId, `Reservation record deleted.`);
    sendSuccess(res, null, "Reservation record purged.");
  }),

  confirmBooking: catchAsync(async (req, res) => {
    const { id } = req.params;
    const { assigned_room } = req.body;
    const booking = await bookingService.confirmBooking(id, assigned_room || 'auto');
    await recordLog(req.user, 'BOOKING_CONFIRMED', booking.booking_id, `Room ${booking.assigned_room} assigned and confirmed.`);
    sendSuccess(res, booking, "Sanctuary assignment confirmed.");
  }),

  checkIn: catchAsync(async (req, res) => {
    const { id } = req.params;
    const { swaped_room } = req.body;
    const booking = await bookingService.checkInBooking(id, swaped_room);
    await recordLog(req.user, 'BOOKING_CHECKIN', booking.booking_id, `Guest reached the sanctuary.`);
    sendSuccess(res, booking, "Guest has entered.");
  }),

  extendStay: catchAsync(async (req, res) => {
    const { id } = req.params;
    const { hours } = req.body;
    const booking = await bookingService.extendStay(id, hours);
    await recordLog(req.user, 'BOOKING_EXTENSION', booking.booking_id, `Stay extended by ${hours} hours.`);
    sendSuccess(res, booking, "Stay extended.");
  }),

  completeCheckout: catchAsync(async (req, res) => {
    const { id } = req.params;
    const booking = await bookingService.finalCheckout(id);
    await recordLog(req.user, 'BOOKING_CHECKOUT', booking.booking_id, `Final departure processed.`);
    sendSuccess(res, booking, "Stay finalized.");
  }),

  refund: catchAsync(async (req, res) => {
    const { id } = req.params;
    const booking = await bookingService.refundBooking(id);
    await recordLog(req.user, 'BOOKING_REFUND', booking.booking_id, `Financial reversal initiated.`);
    sendSuccess(res, booking, "Financial reversal initiated.");
  }),

  createSession: catchAsync(async (req, res) => {
    const { roomName, amount, guestEmail, nights } = req.body;
    const stripe = await getStripe();
    const baseUrl = process.env.CLIENT_URL || 'https://theatlantichorizon.ie';
    const taxRate = parseFloat(await getSetting('tax_rate', '0'));
    const serviceCharge = parseFloat(await getSetting('service_charge', '0'));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      customer_email: guestEmail,
      line_items: [{
        price_data: {
          currency: 'eur',
          product_data: {
            name: `The Atlantic Horizon - ${roomName}`,
            description: `Accommodation for ${nights || 1} nights`,
          },
          unit_amount: Math.round(((parseFloat(amount) || 0) * (1 + taxRate) + serviceCharge) * 100),
        },
        quantity: 1,
      }],
      mode: 'payment',
      success_url: `${process.env.SERVER_URL || 'http://localhost:5001'}/booking-success?status=success`,
      cancel_url: `${baseUrl}/calendar?status=cancel`,
    });

    sendSuccess(res, { url: session.url });
  }),

  createPaymentIntent: catchAsync(async (req, res) => {
    const { amount, guestEmail } = req.body;
    const stripe = await getStripe();
    const taxRate = parseFloat(await getSetting('tax_rate', '0'));
    const serviceCharge = parseFloat(await getSetting('service_charge', '0'));
    const finalAmount = Math.round(((parseFloat(amount) || 0) * (1 + taxRate) + serviceCharge) * 100);

    const paymentIntent = await stripe.paymentIntents.create({
      amount: finalAmount,
      currency: 'eur',
      receipt_email: guestEmail
    });

    sendSuccess(res, { clientSecret: paymentIntent.client_secret });
  }),

  checkAvailability: catchAsync(async (req, res) => {
    const { checkIn, checkOut, roomCategory } = req.body;
    const result = await bookingService.checkRoomAvailability(checkIn, checkOut, roomCategory);
    sendSuccess(res, result);
  }),

  resendPaymentLink: catchAsync(async (req, res) => {
    const { roomName, amount, guestEmail, nights } = req.body;
    const stripe = await getStripe();
    const taxRate = parseFloat(await getSetting('tax_rate', '0'));
    const serviceCharge = parseFloat(await getSetting('service_charge', '0'));
    const baseUrl = process.env.CLIENT_URL || 'https://theatlantichorizon.ie';

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      customer_email: guestEmail,
      line_items: [{
        price_data: {
          currency: 'eur',
          product_data: {
            name: `The Atlantic Horizon — ${roomName}`,
            description: `Sanctuary Payment Link | ${nights || 1} night(s)`,
          },
          unit_amount: Math.round(((parseFloat(amount) || 0) * (1+taxRate) + serviceCharge) * 100),
        },
        quantity: 1,
      }],
      mode: 'payment',
      success_url: `${process.env.SERVER_URL || 'http://localhost:5001'}/booking-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/calendar`,
    });

    sendSuccess(res, { url: session.url });
  }),

  selfCheckIn: catchAsync(async (req, res) => {
    const { bookingId, email } = req.body;
    const booking = await bookingService.selfCheckIn(bookingId, email);
    sendSuccess(res, { booking }, `Welcome to The Atlantic Horizon, ${booking.guest_name}!`);
  }),
  manageLookup: catchAsync(async (req, res) => {
    const { bookingId, email } = req.body;
    const booking = await bookingService.lookupBooking(bookingId, email);
    sendSuccess(res, { booking }, "Reservation details retrieved.");
  }),
  manageUpdatePhone: catchAsync(async (req, res) => {
    const { bookingId, email, newPhone } = req.body;
    const booking = await bookingService.updateGuestPhone(bookingId, email, newPhone);
    sendSuccess(res, { booking }, "Contact information captured.");
  }),
  getDashboardStats: catchAsync(async (req, res) => {
    const stats = await bookingService.getDashboardStats();
    sendSuccess(res, stats, "Dashboard metrics calculated.");
  })
};

export default bookingController;
