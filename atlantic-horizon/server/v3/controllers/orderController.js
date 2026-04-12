import orderEngine from '../services/orderEngine.js';
import { getStripe } from '../config/stripe.js';
import { getSetting } from '../utils/configHelper.js';

class OrderController {
  /**
   * 🍽️ Place Order (API Wrapper)
   */
  async placeOrder(req, res) {
    try {
      const order = await orderEngine.placeOrder(req.body);
      res.status(201).json(order);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  /**
   * 🚚 Update Status
   */
  async updateStatus(req, res) {
    const { id } = req.params;
    const { status } = req.body;
    try {
      const order = await orderEngine.updateStatus(id, status);
      res.status(200).json(order);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * 💳 Consolidated Checkout Session (OrderType: 'fb')
   */
  async createFbCheckout(req, res) {
    const { orderId } = req.body;
    try {
      const stripe = await getStripe();
      const baseUrl = await getSetting('base_url', 'http://localhost:5173');
      
      const order = await orderEngine.getOrderWithDetails(orderId); // Need to add this helper
      if (!order) return res.status(404).json({ error: "Order not found" });

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: order.items.map(item => ({
          price_data: {
            currency: 'eur',
            product_data: { name: `F&B Order - ${item.name}` },
            unit_amount: Math.round(item.price * 100),
          },
          quantity: item.quantity,
        })),
        mode: 'payment',
        metadata: { orderId: order._id.toString(), type: 'fb_order' },
        success_url: `${baseUrl}/room-service/order-success?order_id=${order._id}`,
        cancel_url: `${baseUrl}/room-service?status=cancel`,
      });

      res.status(200).json({ url: session.url });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * 📋 List all Gastronomy Orders
   */
  async getAllOrders(req, res) {
    try {
      const orders = await orderEngine.getAllOrders();
      res.status(200).json(orders);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

export default new OrderController();
