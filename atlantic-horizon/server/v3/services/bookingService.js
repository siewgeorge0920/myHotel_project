import Booking from '../models/Booking.js';
import PhysicalRoom from '../models/PhysicalRoom.js';
import Client from '../models/Client.js';
import Log from '../models/Log.js';
import inventoryService from './inventoryService.js';
import crmService from './crmService.js';

class BookingService {
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
      status: data.status || 'Confirmed'
    });

    await booking.save();
    
    guest.total_spend += parseFloat(data.price);
    await guest.save();

    return booking;
  }

  async forceReceptionCheckIn(bookingId) {
    const booking = await Booking.findOne({ booking_id: bookingId });
    if (!booking) throw new Error("Booking record not found");

    const readyRoom = await PhysicalRoom.findOne({
      room_type_category: booking.room_type,
      current_status: 'Ready'
    });

    if (!readyRoom) {
      throw new Error(`No 'Ready' rooms in ${booking.room_type}. Notify Housekeeping!`);
    }

    readyRoom.current_status = 'Occupied';
    readyRoom.active_booking = booking._id;
    await readyRoom.save();

    booking.status = 'CheckedIn';
    booking.assigned_room = readyRoom.room_name;
    booking.check_in_time = new Date();
    await booking.save();

    await Log.create({
      action: `RECEPTION CHECK-IN: Guest ${booking.guest_name} assigned to ${readyRoom.room_name}`,
      performedBy: 'Reception Staff',
      targetId: bookingId
    });

    return booking;
  }

  async getAllOrdered() {
    return await Booking.find().sort({ createdAt: -1 });
  }

  async transitionStatus(id, status) {
    const booking = await Booking.findById(id);
    if (!booking) throw new Error("Booking not found");
    booking.status = status;
    await booking.save();
    return booking;
  }

  async updatePaymentStatus(id, status) {
    const booking = await Booking.findById(id);
    if (!booking) throw new Error("Booking not found");
    booking.payment_status = status;
    if (status === 'Paid') booking.status = 'Confirmed';
    await booking.save();
    return booking;
  }

  async update(id, data) {
    const existing = await Booking.findById(id);
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
    const booking = await Booking.findByIdAndDelete(id);
    if (!booking) throw new Error("Booking not found");
    return booking;
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