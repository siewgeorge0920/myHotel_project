import Order from '../models/Order.js';
import Menu from '../models/Menu.js';
import Booking from '../models/Booking.js';
import { getSetting } from '../utils/configHelper.js';

class OrderEngine {
  /**
   * 🍽️ Process and validate a new F&B order
   */
  async placeOrder(orderData) {
    const { items, payment_method, booking_id, room_id } = orderData;

    // 1. Calculate and validate pricing snapshot
    let total = 0;
    const itemsWithPrice = [];
    
    for (const item of items) {
      const menuItem = await Menu.findById(item.menu_id);
      if (!menuItem || !menuItem.is_available) {
        throw new Error(`Item ${item.menu_id} is no longer available.`);
      }

      const itemTotal = menuItem.price * item.quantity;
      total += itemTotal;
      
      itemsWithPrice.push({
        menu_id: menuItem._id,
        name: menuItem.name,
        price: menuItem.price,
        quantity: item.quantity
      });
    }

    // 2. Handle Folio Eligibility
    let paymentStatus = 'Pending';
    if (payment_method === 'ChargeToRoom') {
      const booking = await Booking.findOne({ booking_id: booking_id });
      if (!booking || booking.status !== 'CheckedIn') {
        throw new Error('Folio charging (ChargeToRoom) is only available for active inhabitants (CheckedIn).');
      }
      paymentStatus = 'AddedToFolio';
    }

    // 3. Persist Order
    const order = new Order({
      booking_id: orderData.bookingObjectId, // ReferenceId
      room_id: orderData.roomObjectId,
      items: itemsWithPrice,
      total_amount: total,
      payment_method,
      payment_status: paymentStatus
    });

    await order.save();

    // 4. Link to Booking Folio if applicable
    if (paymentStatus === 'AddedToFolio') {
      await Booking.findOneAndUpdate(
        { booking_id: booking_id },
        { $push: { folio_charges: order._id } }
      );
    }

    return order;
  }

  /**
   * 🚚 Update Order Workflow
   */
  async updateStatus(orderId, newStatus) {
    const order = await Order.findByIdAndUpdate(
      orderId, 
      { order_status: newStatus }, 
      { new: true }
    );
    if (!order) throw new Error('Order not found.');
    return order;
  }

  /**
   * 📋 Fetch all orders (Admin/Operational view)
   */
  async getAllOrders() {
    return await Order.find().sort({ createdAt: -1 });
  }

  /**
   * 🧠 Detail Fetcher for Stripe/Logic
   */
  async getOrderWithDetails(orderId) {
    return await Order.findById(orderId);
  }
}

export default new OrderEngine();
