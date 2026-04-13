import Booking from '../models/Booking.js';
import PhysicalRoom from '../models/PhysicalRoom.js';
import Client from '../models/Client.js';
import Log from '../models/Log.js';
import inventoryService from './inventoryService.js';
import crmService from './crmService.js';

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
    let guest = await Client.findOne({ email });
    if (!guest) {
      guest = new Client({
        client_id: `CUST-${Math.floor(10000 + Math.random() * 90000)}`,
        name: data.guest_name || `${data.guestFirstName} ${data.guestLastName}`,
        email: email,
        phone: data.guest_phone || data.guestPhone
      });
      await guest.save();
    }

    

    const bookingId = `ATL-${Math.floor(100000 + Math.random() * 900000)}`;
    const nights = this.calculateNights(data.check_in || data.checkIn, data.check_out || data.checkOut);
    
    const booking = new Booking({
      booking_id: bookingId,
      client_id: guest.client_id,
      guest_name: guest.name,
      guest_email: guest.email,
      room_type: data.room_type || data.roomName,
      check_in: new Date(data.check_in || data.checkIn),
      check_out: new Date(data.check_out || data.checkOut),
      total_amount: data.total_amount || data.price,
      payment_status: data.paymentStatus || 'Paid',
      status: data.status || 'Confirmed',
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
          performedBy: guest.name,
          targetId: card.code,
          timestamp: new Date()
        });
      }
    }

    await booking.save();
    
    guest.total_spend += parseFloat(data.price);
    await guest.save();

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
      status: data.status || 'Confirmed'
    });
    await booking.save();
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