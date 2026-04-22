import Booking from '../booking/Booking.model.js';
import UserLog from '../../shared/models/UserLog.model.js';

class BillingService {
  /**
   *  Add Manual Charge
   */
  async addManualCharge(bookingId, description, amount, performedBy) {
    const booking = await Booking.findOne({ booking_id: bookingId });
    if (!booking) throw new Error("Resident record not found.");

    booking.total_amount += parseFloat(amount);
    await booking.save();

    await UserLog.create({
      action: `Manual Add-on`,
      details: `${description} (€${amount})`,
      performed_by: performedBy || 'Concierge',
      target_id: bookingId,
      user_type: 'Staff'
    });

    return booking;
  }
}

export default new BillingService();
