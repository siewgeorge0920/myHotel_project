import bookingService from '../services/bookingService.js';
import catchAsync from '../utils/catchAsync.js';
import { sendSuccess } from '../utils/responseHandler.js';
import { getStripe } from '../config/stripe.js';
import { getSetting } from '../utils/configHelper.js';

const bookingController = {
  createBooking: catchAsync(async (req, res) => {
    let booking;
    if (req.body.check_in && req.body.check_out) {
      booking = await bookingService.adminCreate(req.body);
    } else {
      booking = await bookingService.createBooking(req.body);
    }
    sendSuccess(res, booking, "Reservation record established.", 201);
  }),

  updateStatus: catchAsync(async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    const updated = await bookingService.transitionStatus(id, status);
    sendSuccess(res, updated, `Status transitioned to ${status}`);
  }),

  updatePaymentStatus: catchAsync(async (req, res) => {
    const { id } = req.params;
    const updated = await bookingService.updatePaymentStatus(id, req.body.payment_status || req.body.status);
    sendSuccess(res, updated, "Payment status updated successfully.");
  }),

  getAllBookings: catchAsync(async (req, res) => {
    const bookings = await bookingService.getAllOrdered();
    sendSuccess(res, bookings);
  }),

  updateBooking: catchAsync(async (req, res) => {
    const updated = await bookingService.update(req.params.id, req.body);
    sendSuccess(res, updated, "Reservation updated by custodian.");
  }),

  deleteBooking: catchAsync(async (req, res) => {
    await bookingService.delete(req.params.id);
    sendSuccess(res, null, "Reservation record purged.");
  }),

  confirmBooking: catchAsync(async (req, res) => {
    const { id } = req.params;
    const { assigned_room } = req.body;
    const booking = await bookingService.confirmBooking(id, assigned_room || 'auto');
    sendSuccess(res, booking, "Sanctuary assignment confirmed.");
  }),

  checkIn: catchAsync(async (req, res) => {
    const { id } = req.params;
    const { swaped_room } = req.body;
    const booking = await bookingService.checkInBooking(id, swaped_room);
    sendSuccess(res, booking, "Guest has entered the sanctuary.");
  }),

  extendStay: catchAsync(async (req, res) => {
    const { id } = req.params;
    const { hours } = req.body;
    const booking = await bookingService.extendStay(id, hours);
    sendSuccess(res, booking, "Sanctuary stay has been extended.");
  }),

  completeCheckout: catchAsync(async (req, res) => {
    const { id } = req.params;
    const booking = await bookingService.finalCheckout(id);
    sendSuccess(res, booking, "Stay finalized. Farewell.");
  }),

  refund: catchAsync(async (req, res) => {
    const { id } = req.params;
    const booking = await bookingService.refundBooking(id);
    sendSuccess(res, booking, "Financial reversal initiated. Transaction cancelled.");
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
      success_url: `${baseUrl}/booking-success?status=success`,
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
            name: `The Atlantic Horizon Manor — ${roomName}`,
            description: `Sanctuary Payment Link | ${nights || 1} night(s)`,
          },
          unit_amount: Math.round(((parseFloat(amount) || 0) * (1+taxRate) + serviceCharge) * 100),
        },
        quantity: 1,
      }],
      mode: 'payment',
      success_url: `${baseUrl}/booking-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/calendar`,
    });

    sendSuccess(res, { url: session.url });
  }),

  selfCheckIn: catchAsync(async (req, res) => {
    const { bookingId, email } = req.body;
    const booking = await bookingService.selfCheckIn(bookingId, email);
    sendSuccess(res, { booking }, `Welcome to The Atlantic Horizon, ${booking.guest_name}! Your stay has officially begun.`);
  })
};

export default bookingController;