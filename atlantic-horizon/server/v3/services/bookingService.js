import Booking from '../models/Booking.js';
import PhysicalRoom from '../models/PhysicalRoom.js';
import Client from '../models/Client.js';
import Staff from '../models/Staff.js';
import Log from '../models/Log.js';
import giftCardService from './giftCardService.js';
import { getStripe } from '../config/stripe.js';
import configHelper from '../utils/configHelper.js';

class BookingService {
  /**
   * 🧠 Logic for real-time inventory calculation
   */
  async checkAvailability(checkIn, checkOut, roomCategory) {
    const start = new Date(checkIn);
    const end = new Date(checkOut);

    // 1. Get overlapping bookings
    const overlap = await Booking.find({
      room_type: roomCategory,
      status: { $nin: ['Cancelled', 'CheckedOut'] },
      $or: [
        { check_in: { $lt: end }, check_out: { $gt: start } }
      ]
    }).countDocuments();

    // 2. Get total physical rooms for this category
    const totalRooms = await PhysicalRoom.countDocuments({
      room_type_category: roomCategory
    });

    return {
      isAvailable: overlap < totalRooms,
      remainingRatio: totalRooms > 0 ? (totalRooms - overlap) / totalRooms : 0,
      overlapCount: overlap,
      maxCapacity: totalRooms
    };
  }

  /**
   * 🏗️ Create Booking (Multi-Step Logic)
   */
  async createBooking(data) {
    const { 
      checkIn, 
      checkOut, 
      roomName, 
      guestEmail, 
      guestFirstName, 
      guestLastName, 
      price, 
      paymentStatus,
      giftCardCode 
    } = data;

    // 1. Validation
    if (!checkIn || !checkOut || !roomName || !guestEmail) {
      throw new Error("Missing required booking details (V3 Validation).");
    }

    const start = new Date(checkIn);
    const end = new Date(checkOut);

    // 2. Strict Inventory Protection
    const availability = await this.checkAvailability(start, end, roomName);
    if (!availability.isAvailable) {
      throw new Error(`The ${roomName} is fully booked for these dates. Inventory mismatch.`);
    }

    // 3. Gift Card Redemption
    let finalAmount = parseFloat(price);
    if (giftCardCode) {
      try {
        const card = await giftCardService.validate(giftCardCode);
        const deduction = Math.min(card.balance, finalAmount);
        card.balance -= deduction;
        if (card.balance <= 0) card.status = 'Used';
        await card.save();
        
        finalAmount -= deduction;
        
        await Log.create({
          action: `Redeemed Gift Card ${giftCardCode} for booking. Deduction: €${deduction}`,
          performedBy: 'System (Client Flow)',
          targetId: giftCardCode
        });
      } catch (err) {
        console.warn(`[V3 Booking] Gift Card ${giftCardCode} ignored: ${err.message}`);
      }
    }

    // 4. Client Auto-Resolution (CRM)
    let client = await Client.findOne({ email: guestEmail });
    if (!client) {
      client = new Client({
        client_id: 'CUST-' + Math.floor(Math.random() * 90000 + 10000),
        name: `${guestFirstName} ${guestLastName}`.trim(),
        email: guestEmail,
        phone: data.guestPhone,
        address: data.guestAddress
      });
      await client.save();
    }

    // 5. Automated Staff Assignment
    const availableStaff = await Staff.find({ status: 'Active', role: { $in: ['staff', 'admin'] } });
    const assignedStaffName = availableStaff.length > 0 
      ? availableStaff[Math.floor(Math.random() * availableStaff.length)].name 
      : 'System Administrator';

    // 6. Persistence
    const booking = new Booking({
      booking_id: `BKG-${Math.floor(Math.random() * 900000 + 100000)}`,
      guest_name: `${guestFirstName} ${guestLastName}`.trim(),
      guest_email: guestEmail,
      guest_phone: data.guestPhone,
      guest_address: data.guestAddress,
      client_id: client.client_id,
      room_type: roomName,
      check_in: start,
      check_out: end,
      total_amount: finalAmount,
      payment_status: paymentStatus === 'Paid' || finalAmount <= 0 ? 'Paid' : 'Unpaid',
      status: 'Pending',
      notes: `Managed by: ${assignedStaffName}. Gift Card: ${giftCardCode || 'None'}`
    });

    await booking.save();

    // 7. Success Audit
    await Log.create({
      action: `New Booking Created: ${booking.booking_id} (${roomName})`,
      performedBy: 'System (Guest Checkout)',
      targetId: booking.booking_id
    });

    return booking;
  }

  /**
   * 🛡️ Strict State Machine Transitions
   */
  async transitionStatus(bookingId, newStatus) {
    const booking = await Booking.findOne({ booking_id: bookingId });
    if (!booking) throw new Error('Booking not found');

    const validTransitions = {
      'Pending': ['Confirmed', 'Cancelled'],
      'Confirmed': ['CheckedIn', 'Cancelled'],
      'CheckedIn': ['CheckedOut'],
      'CheckedOut': [],
      'Cancelled': []
    };

    if (!validTransitions[booking.status].includes(newStatus)) {
      throw new Error(`Invalid status transition: ${booking.status} -> ${newStatus}`);
    }

    booking.status = newStatus;
    await booking.save();
    return booking;
  }

  /**
   * 📋 Admin Utility: Fetch sorted bookings
   */
  async getAllOrdered() {
    return await Booking.find().sort({ createdAt: -1 });
  }

  /**
   * 💳 Generate Payment Link for existing booking
   */
  async generatePaymentLink(data) {
    const { bookingId, roomName, amount, guestEmail, nights } = data;
    
    const taxRate = parseFloat(await configHelper.getSetting('tax_rate', '0'));
    const serviceCharge = parseFloat(await configHelper.getSetting('service_charge', '0'));
    const baseUrl = await configHelper.getSetting('base_url', 'http://localhost:5173');

    const stripe = await getStripe();
    return await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      ...(guestEmail ? { customer_email: guestEmail } : {}),
      line_items: [{
        price_data: {
          currency: 'eur',
          product_data: {
            name: `The Atlantic Horizon Manor — ${roomName}`,
            description: `Booking: ${bookingId} | ${nights || 1} night(s)`,
          },
          unit_amount: Math.round((parseFloat(amount) + (parseFloat(amount) * taxRate) + serviceCharge) * 100),
        },
        quantity: 1,
      }],
      mode: 'payment',
      success_url: `${baseUrl}/self-check-in?booking_id=${bookingId}&status=success`,
      cancel_url: `${baseUrl}/calendar?status=cancel`,
    });
  }

  /**
   * 🗑️ Purge record
   */
  async delete(id) {
    return await Booking.findByIdAndDelete(id);
  }

  /**
   * ✏️ Generic Update
   */
  async update(id, data) {
    return await Booking.findByIdAndUpdate(id, data, { new: true });
  }
}

export default new BookingService();
