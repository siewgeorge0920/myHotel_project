import crypto from 'crypto';
import KeyCard from '../models/KeyCard.js';
import Booking from '../models/Booking.js';
import PhysicalRoom from '../models/PhysicalRoom.js';

class IotKeyService {
  /**
   * 🔑 Generate a time-bound digital key for a confirmed booking
   */
  async generateKey(bookingObjectId, physicalRoomObjectId) {
    const booking = await Booking.findById(bookingObjectId);
    const room = await PhysicalRoom.findById(physicalRoomObjectId);
    
    if (!booking || !room) throw new Error('Invalid booking or room reference for key generation.');

    // Generate unique, cryptographically secure token
    const token = crypto.randomBytes(32).toString('hex');

    const keyCard = new KeyCard({
      booking_id: booking._id,
      room_id: room._id,
      access_token: token,
      start_time: booking.check_in,
      end_time: booking.check_out,
      is_active: true
    });

    await keyCard.save();
    return keyCard;
  }

  /**
   * 📱 Retrieve active key for guest consumption
   */
  async getActiveKeyForBooking(bookingId) {
    // Note: bookingId here can be the readable 'BKG-XXXXXX' string
    const booking = await Booking.findOne({ booking_id: bookingId });
    if (!booking) throw new Error('Booking record not found.');

    const key = await KeyCard.findOne({
      booking_id: booking._id,
      is_active: true,
      end_time: { $gt: new Date() } // Ensure not expired
    }).populate('room_id');

    if (!key) throw new Error('No active digital key found for this reservation.');

    return {
      token: key.access_token,
      roomName: key.room_id.room_name,
      lockId: key.room_id.lock_device_id,
      expiresAt: key.end_time
    };
  }
}

export default new IotKeyService();
