import Booking from '../models/Booking.js';
import Log from '../models/Log.js';

class FolioService {
  /**
   *  Add Manual Charge (The "Concierge Add-on" logic)
   */
  async addManualCharge(bookingId, description, amount, performedBy) {
    const booking = await Booking.findOne({ booking_id: bookingId });
    if (!booking) throw new Error("Resident record not found.");

    // Update Total directly without creating an Order record
    booking.total_amount += parseFloat(amount);
    await booking.save();

    // 3. Audit for CRM history
    await Log.create({
      action: `Manual Add-on: ${description} (€${amount})`,
      performedBy: performedBy || 'Concierge',
      targetId: bookingId
    });

    return booking;
  }
}

export default new FolioService();