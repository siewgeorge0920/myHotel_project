import Booking from '../models/Booking.js';
import PhysicalRoom from '../models/PhysicalRoom.js';

import Log from '../models/Log.js';
import inventoryService from './inventoryService.js';
import emailService from './emailService.js';


class BookingService {

calculateNights(checkIn, checkOut) {
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays || 1;
  }

  async _resolveBooking(idOrBookingId) {
    if (!idOrBookingId) return null;
    // Standard MongoDB ObjectId is 24 hex chars. 
    // Public booking_ids are like "ATL-XXXXXX" (10 chars).
    if (idOrBookingId.toString().length > 20) {
      return await Booking.findById(idOrBookingId);
    }
    return await Booking.findOne({ booking_id: idOrBookingId });
  }


  async createBooking(data) {
    const email = data.guest_email || data.guestEmail;


    

    const bookingId = `ATL-${Math.floor(100000 + Math.random() * 900000)}`;
    const nights = this.calculateNights(data.check_in || data.checkIn, data.check_out || data.checkOut);
    
    const booking = new Booking({
      booking_id: bookingId,
      guest_name: data.guest_name || `${data.guestFirstName} ${data.guestLastName}`,
      guest_email: email,
      room_type: data.room_type || data.roomName,
      check_in: new Date(data.check_in || data.checkIn),
      check_out: new Date(data.check_out || data.checkOut),
      total_amount: data.total_amount || data.price,
      payment_status: data.paymentStatus || 'Paid',
      status: data.status || 'Pending',
      nights: nights,
      gift_card_used: data.giftCardCode || null
    });

    // Handle Gift Card Redemption
    if (data.giftCardCode) {
      const GiftCard = (await import('../models/GiftCard.js')).default;
      const card = await GiftCard.findOne({ code: data.giftCardCode.toUpperCase(), status: 'Active' });
      
      if (card) {
        const originalPrice = data.total_amount || data.price;
        const totalWithAddons = originalPrice; // The price passed in should already be the total
        
        // We calculate how much to deduct
        // If card has 200 and price is 500, deduct 200.
        // If card has 500 and price is 200, deduct 200.
        const deduction = Math.min(card.balance, totalWithAddons);
        
        card.balance -= deduction;
        if (card.balance <= 0) card.status = 'Used';
        await card.save();

        await Log.create({
          action: 'GIFT_CARD_REDEEM',
          details: `Redeemed €${deduction} from ${card.code} for booking ${bookingId}`,
          performedBy: data.guest_name || `${data.guestFirstName} ${data.guestLastName}`,
          targetId: card.code,
          timestamp: new Date()
        });
      }
    }

    await booking.save();
    
    // 📧 Standard Notification
    try {
      await emailService.sendBookingEmail(booking.guest_email, booking);
    } catch (e) {
      console.error("[Email Notification Failed]", e.message);
    }

    return booking;
  }

  async forceReceptionCheckIn(idOrBookingId) {
    const booking = await this._resolveBooking(idOrBookingId);
    if (!booking) throw new Error("Booking record not found");

    const readyRoom = await PhysicalRoom.findOne({
      room_type_category: booking.room_type,
      current_status: 'Ready'
    });

    if (readyRoom) {
      readyRoom.current_status = 'Occupied';
      readyRoom.active_booking = booking._id;
      await readyRoom.save();
      booking.assigned_room = readyRoom.room_name;
    }

    booking.status = 'CheckedIn';
    booking.check_in_time = new Date();
    await booking.save();

    // 📧 Welcome Notification
    try {
      await emailService.sendCheckInEmail(booking.guest_email, booking);
    } catch (e) {
      console.error("[Email Notification Failed]", e.message);
    }

    await Log.create({
      action: `RECEPTION CHECK-IN`,
      details: `Guest ${booking.guest_name} ${readyRoom ? `assigned to ${readyRoom.room_name}` : '(No room available/assigned)'}`,
      performed_by: 'Reception Staff',
      target_id: booking.booking_id || idOrBookingId,
      user_type: 'Staff'
    });

    return booking;
  }

  async getAllOrdered() {
    return await Booking.find().sort({ createdAt: -1 });
  }

  async transitionStatus(id, status) {
    const booking = await this._resolveBooking(id);
    if (!booking) throw new Error("Booking not found");
    booking.status = status;
    await booking.save();
    return booking;
  }

  async confirmBooking(id, roomName) {
    const booking = await this._resolveBooking(id);
    if (!booking) throw new Error("Booking record not found");

    if (roomName === 'auto') {
      const readyRoom = await PhysicalRoom.findOne({
        room_type_category: booking.room_type,
        current_status: 'Ready'
      });
      if (!readyRoom) throw new Error("No rooms currently available for this category.");
      booking.assigned_room = readyRoom.room_name;
    } else {
      booking.assigned_room = roomName;
    }

    booking.status = 'Confirmed';
    await booking.save();
    return booking;
  }

  async checkInBooking(id, swapedRoomName = null) {
    const booking = await this._resolveBooking(id);
    if (!booking) throw new Error("Booking not found");

    const finalRoomName = swapedRoomName || booking.assigned_room;
    if (!finalRoomName) throw new Error("No room assigned to this booking.");

    const room = await PhysicalRoom.findOne({ room_name: finalRoomName });
    if (!room) throw new Error("Room not found in sanctuary records.");
    
    // If we're swapping, free up the old one if it was occupied
    if (swapedRoomName && booking.assigned_room && swapedRoomName !== booking.assigned_room) {
        await PhysicalRoom.findOneAndUpdate({ room_name: booking.assigned_room }, { current_status: 'Ready', active_booking: null });
    }

    room.current_status = 'Occupied';
    room.active_booking = booking._id;
    await room.save();

    booking.assigned_room = finalRoomName;
    booking.status = 'CheckedIn';
    booking.check_in_time = new Date();
    await booking.save();

    try {
      await emailService.sendCheckInEmail(booking.guest_email, booking);
    } catch (e) {
      console.error("[Email Notification Failed]", e.message);
    }

    return booking;
  }

  async extendStay(id, hours) {
    const booking = await this._resolveBooking(id);
    if (!booking) throw new Error("Booking not found");

    const h = parseInt(hours) || 0;
    const extraCharge = h * 50; // €50 per hour as requested
    
    // Update check-out date
    const currentOut = new Date(booking.check_out);
    currentOut.setHours(currentOut.getHours() + h);
    
    booking.check_out = currentOut;
    booking.extension_hours += h;
    booking.additional_charges += extraCharge;
    
    await booking.save();
    return booking;
  }

  async finalCheckout(id) {
    const booking = await this._resolveBooking(id);
    if (!booking) throw new Error("Booking not found");

    if (booking.assigned_room) {
      await PhysicalRoom.findOneAndUpdate(
        { room_name: booking.assigned_room },
        { current_status: 'Cleaning', active_booking: null }
      );
    }

    booking.status = 'CheckedOut';
    await booking.save();
    return booking;
  }

  async refundBooking(id) {
    const booking = await this._resolveBooking(id);
    if (!booking) throw new Error("Booking not found");

    // Stripe Refund Logic
    if (booking.stripe_session_id) {
      const { getStripe } = await import('../config/stripe.js');
      const stripe = await getStripe();
      
      // Retrieve session to get payment intent
      const session = await stripe.checkout.sessions.retrieve(booking.stripe_session_id);
      if (session && session.payment_intent) {
        await stripe.refunds.create({
          payment_intent: session.payment_intent
        });
      }
    }

    booking.status = 'Cancelled';
    booking.payment_status = 'Unpaid'; // Or 'Refunded'
    await booking.save();
    return booking;
  }

  async updatePaymentStatus(id, status) {
    const booking = await this._resolveBooking(id);
    if (!booking) throw new Error("Booking not found");
    booking.payment_status = status;
    if (status === 'Paid') booking.status = 'Confirmed';
    await booking.save();
    return booking;
  }

  async update(id, data) {
    const existing = await this._resolveBooking(id);
    if (!existing) throw new Error("Booking not found");
    if (existing.status === 'CheckedOut') throw new Error("This stay is finalized and cannot be modified.");

    const updateData = { ...data };
    
    // Safety mapping for updates
    if (data.guestEmail) updateData.guest_email = data.guestEmail;
    if (data.checkIn) updateData.check_in = data.checkIn;
    if (data.checkOut) updateData.check_out = data.checkOut;
    if (data.price) updateData.total_amount = data.price;
    if (data.roomName) updateData.room_type = data.roomName;

    const booking = await Booking.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
    if (!booking) throw new Error("Booking not found");
    return booking;
  }

  async delete(id) {
    const booking = await this._resolveBooking(id);
    if (!booking) throw new Error("Booking not found");
    return await Booking.findByIdAndDelete(booking._id);
  }

  async adminCreate(data) {
    const bookingId = `ATL-${Math.floor(100000 + Math.random() * 900000)}`;
    const booking = new Booking({
      booking_id: data.booking_id || bookingId,
      guest_name: data.guest_name,
      guest_email: data.guestEmail || data.guest_email || 'guest@example.com',
      room_type: data.room_type,
      check_in: new Date(data.check_in),
      check_out: new Date(data.check_out),
      total_amount: data.total_amount,
      status: data.status || 'Pending'
    });
    await booking.save();

    // 📧 Administrative Notification
    try {
      await emailService.sendBookingEmail(booking.guest_email, booking);
    } catch (e) {
      console.error("[Email Notification Failed]", e.message);
    }

    return booking;
  }
  async selfCheckIn(bookingId, email) {
    // Logic: Support both internal MongoDB ID and the public ATL-XXXXXX code
    const query = bookingId.length > 20 
      ? { _id: bookingId, guest_email: email }
      : { booking_id: bookingId, guest_email: email };

    const booking = await Booking.findOne(query);

    if (!booking) {
      throw new Error("We couldn't find a reservation with those details. Please check your Booking ID and Email.");
    }

    if (booking.status === 'CheckedIn') {
      throw new Error("You are already checked in! Welcome to the Manor.");
    }

    if (booking.status === 'CheckedOut' || booking.status === 'Cancelled') {
      throw new Error(`This reservation is currently ${booking.status.toLowerCase()}. Please see reception for help.`);
    }

    // Optional: Only allow check-in on the actual day
    // const today = new Date().toISOString().split('T')[0];
    // if (new Date(booking.check_in).toISOString().split('T')[0] !== today) {
    //   throw new Error("Self Check-in is only available on your day of arrival.");
    // }

    booking.status = 'CheckedIn';
    await booking.save();

    // 📧 Self Check-in Welcome
    try {
      await emailService.sendCheckInEmail(booking.guest_email, booking);
    } catch (e) {
      console.error("[Email Notification Failed]", e.message);
    }

    // Log the event
    await Log.create({
      action: 'SELF_CHECK_IN',
      performedBy: 'GUEST',
      targetId: booking.booking_id,
      timestamp: new Date()
    });

    return booking;
  }
}

export default new BookingService();