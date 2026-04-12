import Booking from '../models/Booking.js';
import Order from '../models/Order.js';
import Log from '../models/Log.js';

class FolioService {
  /**
   * 💰 Add Manual Charge (The "Concierge Add-on" logic)
   */
  async addManualCharge(bookingId, description, amount, performedBy) {
    const booking = await Booking.findOne({ booking_id: bookingId });
    if (!booking) throw new Error("Resident record not found.");

    // 1. Create a "Pseudo-Order" for the manual service
    const manualOrder = new Order({
      booking_id: booking._id,
      items: [{ name: description, price: amount, quantity: 1 }],
      total_amount: amount,
      payment_status: 'AddedToFolio',
      order_status: 'Completed'
    });
    await manualOrder.save();

    // 2. Link to Booking and update Total
    booking.folio_charges = booking.folio_charges || [];
    booking.folio_charges.push(manualOrder._id);
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