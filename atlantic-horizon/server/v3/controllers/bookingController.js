import bookingService from '../services/bookingService.js';
import { getStripe } from '../config/stripe.js';
import { getSetting } from '../utils/configHelper.js';

class BookingController {
  /**
   * 🏗️ Create Booking (Frontend Entry Point)
   */
  async createBooking(req, res) {
    try {
      const booking = await bookingService.createBooking(req.body);
      res.status(201).json({ 
        success: true, 
        bookingId: booking.booking_id,
        message: "Reservation record established."
      });
    } catch (error) {
      console.error("V3 Create Booking Error:", error.message);
      res.status(400).json({ error: error.message });
    }
  }

  /**
   * 💳 Standardize Stripe Checkout Session creation
   */
  async createSession(req, res) {
    const { roomName, amount, guestEmail, nights } = req.body;
    
    try {
      const stripe = await getStripe();
      const baseUrl = await getSetting('base_url', 'http://localhost:5173');
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
            unit_amount: Math.round((amount + (amount * taxRate) + serviceCharge) * 100),
          },
          quantity: 1,
        }],
        mode: 'payment',
        success_url: `${baseUrl}/calendar?status=success`,
        cancel_url: `${baseUrl}/calendar?status=cancel`,
      });

      res.status(200).json({ url: session.url });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * 📋 Fetch all bookings (Admin/Staff only)
   */
  async getAllBookings(req, res) {
    try {
      const bookings = await bookingService.getAllOrdered();
      res.status(200).json(bookings);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * ✏️ Update Status (State Machine Enforcement)
   */
  async updateStatus(req, res) {
    const { id } = req.params;
    const { status } = req.body;
    try {
      const booking = await bookingService.transitionStatus(id, status);
      res.status(200).json(booking);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  /**
   * 🧠 Check Availability (Guest API)
   */
  async checkAvailability(req, res) {
    const { checkIn, checkOut, roomCategory } = req.body;
    try {
      const result = await bookingService.checkAvailability(checkIn, checkOut, roomCategory);
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * 💳 Resend Payment Link (Staff Utility)
   */
  async resendPaymentLink(req, res) {
    try {
      const session = await bookingService.generatePaymentLink(req.body);
      res.status(200).json({ url: session.url });
    } catch (error) {
      console.error("V3 Resend Link Error:", error.message);
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * 🗑️ Delete Booking record
   */
  async deleteBooking(req, res) {
    try {
      await bookingService.delete(req.params.id);
      res.status(200).json({ message: "Record purged." });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * ✏️ Update Booking (Administrative Override)
   */
  async updateBooking(req, res) {
    try {
      const booking = await bookingService.update(req.params.id, req.body);
      res.status(200).json(booking);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}

export default new BookingController();
