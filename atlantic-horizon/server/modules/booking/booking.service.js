import Booking from './Booking.model.js';
import RoomInventory from '../room/RoomInventory.model.js';
import UserLog from '../../shared/models/UserLog.model.js';
import inventoryService from '../room/inventory.service.js';
import emailService from '../../shared/services/emailService.js';


// The booking collect data from the frontend and save it to the database
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
      guest_phone: data.guest_phone || data.guestPhone || null,
      room_type: data.room_type || data.roomName,
      check_in: new Date(data.check_in || data.checkIn),
      check_out: new Date(data.check_out || data.checkOut),
      total_amount: data.total_amount || data.price,
      payment_status: 'Unpaid',
      status: 'Pending',
      nights: nights,
      gift_card_used: data.giftCardCode || null
    });

    if (data.giftCardCode) {
      const GiftCard = (await import('../billing/GiftCard.model.js')).default;
      const card = await GiftCard.findOne({ code: data.giftCardCode.toUpperCase(), status: 'Active' });

      if (card) {
        const totalWithAddons = data.total_amount || data.price;
        const deduction = Math.min(card.balance, totalWithAddons);
        card.balance -= deduction;
        if (card.balance <= 0) card.status = 'Used';
        await card.save();

        await UserLog.create({
          action: 'GIFT_CARD_REDEEM',
          details: `Redeemed €${deduction} from ${card.code} for booking ${bookingId}`,
          performed_by: data.guest_name || `${data.guestFirstName} ${data.guestLastName}`,
          target_id: card.code,
          timestamp: new Date()
        });
      }
    }

    await booking.save();
    return booking;
  }

  async forceReceptionCheckIn(idOrBookingId) {
    const booking = await this._resolveBooking(idOrBookingId);
    if (!booking) throw new Error("Booking record not found");

    const readyRoom = await RoomInventory.findOne({
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

    try {
      await emailService.sendCheckInEmail(booking.guest_email, booking);
    } catch (e) {
      console.error("[Email Notification Failed]", e.message);
    }

    await UserLog.create({
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
      const readyRoom = await RoomInventory.findOne({
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

    const room = await RoomInventory.findOne({ room_name: finalRoomName });
    if (!room) throw new Error("Room not found in sanctuary records.");

    if (swapedRoomName && booking.assigned_room && swapedRoomName !== booking.assigned_room) {
      await RoomInventory.findOneAndUpdate({ room_name: booking.assigned_room }, { current_status: 'Ready', active_booking: null });
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
    const extraCharge = h * 50;

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
      await RoomInventory.findOneAndUpdate(
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

    if (booking.stripe_session_id) {
      const { getStripe } = await import('../../config/stripe.js');
      const stripe = await getStripe();
      const session = await stripe.checkout.sessions.retrieve(booking.stripe_session_id);
      if (session && session.payment_intent) {
        await stripe.refunds.create({
          payment_intent: session.payment_intent
        });
      }
    }

    booking.status = 'Cancelled';
    booking.payment_status = 'Unpaid';
    await booking.save();
    return booking;
  }

  async updatePaymentStatus(id, status) {
    const booking = await this._resolveBooking(id);
    if (!booking) throw new Error("Booking not found");
    const oldPaymentStatus = booking.payment_status;
    booking.payment_status = status;

    if (status === 'Paid' && oldPaymentStatus !== 'Paid') {
      try {
        await emailService.sendBookingEmail(booking.guest_email, booking);
      } catch (e) {
        console.error("[Email Notification Failed]", e.message);
      }
    }

    await booking.save();
    return booking;
  }

  async update(id, data) {
    const existing = await this._resolveBooking(id);
    if (!existing) throw new Error("Booking not found");
    if (existing.status === 'CheckedOut') throw new Error("This stay is finalized.");

    const updateData = { ...data };
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
      guest_phone: data.guestPhone || data.guest_phone || null,
      room_type: data.room_type,
      check_in: new Date(data.check_in),
      check_out: new Date(data.check_out),
      total_amount: data.total_amount,
      status: 'Pending'
    });
    await booking.save();
    return booking;
  }

  async selfCheckIn(bookingId, email) {
    const query = bookingId.length > 20
      ? { _id: bookingId, guest_email: email }
      : { booking_id: bookingId, guest_email: email };

    const booking = await Booking.findOne(query);
    if (!booking) throw new Error("Reservation not found.");
    if (booking.status === 'CheckedIn') throw new Error("Already checked in.");
    if (booking.status === 'CheckedOut' || booking.status === 'Cancelled') throw new Error("Stay finished or cancelled.");

    if (booking.assigned_room) {
      const room = await RoomInventory.findOne({ room_name: booking.assigned_room });
      if (room) {
        room.current_status = 'Occupied';
        room.active_booking = booking._id;
        await room.save();
      }
    }

    booking.status = 'CheckedIn';
    booking.check_in_time = new Date();
    await booking.save();

    try {
      await emailService.sendCheckInEmail(booking.guest_email, booking);
    } catch (e) {
      console.error("[Email Notification Failed]", e.message);
    }

    await UserLog.create({
      action: 'SELF_CHECK_IN',
      performed_by: 'GUEST',
      target_id: booking.booking_id,
      timestamp: new Date()
    });

    return booking;
  }

  async lookupBooking(bookingId, email) {
    const query = bookingId.length > 20
      ? { _id: bookingId, guest_email: email }
      : { booking_id: bookingId, guest_email: email };

    const booking = await Booking.findOne(query);
    if (!booking) throw new Error("Reservation not found.");
    return booking;
  }

  async updateGuestPhone(bookingId, email, newPhone) {
    const query = bookingId.length > 20
      ? { _id: bookingId, guest_email: email }
      : { booking_id: bookingId, guest_email: email };

    const booking = await Booking.findOneAndUpdate(query, { guest_phone: newPhone }, { new: true });
    if (!booking) throw new Error("Reservation not found.");
    return booking;
  }

  async getDashboardStats() {
    const [upcoming, expectedArrivals, pendingDepartures] = await Promise.all([
      Booking.countDocuments({ status: 'Pending' }),
      Booking.countDocuments({ status: 'Confirmed' }),
      Booking.countDocuments({ status: 'CheckedIn' })
    ]);
    return { upcoming, expectedArrivals, pendingDepartures, _debug_ts: new Date().toISOString() };
  }
}

export default new BookingService();
