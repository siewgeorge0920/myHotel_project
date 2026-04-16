import Menu from '../models/Menu.js';
import Order from '../models/Order.js';
import Log from '../models/Log.js';
import Setting from '../models/Setting.js';
import { AppError } from '../utils/responseHandler.js';

class OrderController {
  /**
   * 🍽️ Fetch all available menu items
   */
  async getMenu(req, res) {
    try {
      const items = await Menu.find({ isAvailable: true });
      res.status(200).json({ success: true, data: items });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  /**
   * ➕ Add new menu item
   */
  async createMenuItem(req, res) {
    try {
      const item = new Menu(req.body);
      await item.save();
      res.status(201).json({ success: true, data: item });
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
  }

  /**
   * ✏️ Update menu item
   */
  async updateMenuItem(req, res) {
    try {
      const item = await Menu.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!item) throw new AppError("Menu item not found", 404);
      res.status(200).json({ success: true, data: item });
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
  }

  /**
   * 🗑️ Delete menu item
   */
  async deleteMenuItem(req, res) {
    try {
      const item = await Menu.findByIdAndDelete(req.params.id);
      if (!item) throw new AppError("Menu item not found", 404);
      res.status(200).json({ success: true, message: "Menu item deleted successfully" });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  /**
   * 📦 Place a new room service order
   */
  async placeOrder(req, res) {
    const { bookingId, roomName, items, paymentMethod, notes } = req.body;
    
    try {
      // Logic for service hours checking (migrated from V2)
      const serviceHoursSetting = await Setting.findOne({ key: 'fb_service_hours' });
      const serviceHours = serviceHoursSetting?.value || '07:00-23:00';

      if (serviceHours && serviceHours.includes('-')) {
        const [startStr, endStr] = serviceHours.split('-');
        const now = new Date();
        const currentHours = now.getHours();
        const currentMins = now.getMinutes();
        const currentTime = currentHours + (currentMins/60);
        
        const [startH, startM] = startStr.split(':').map(Number);
        const startTime = startH + (startM/60);
        
        const [endH, endM] = endStr.split(':').map(Number);
        let endTime = endH + (endM/60);
        if (endTime < startTime) endTime += 24; 
        
        let checkTime = currentTime;
        if (endTime > 24 && checkTime < startTime) checkTime += 24;
        
        if (checkTime < startTime || checkTime > endTime) {
          throw new AppError(`Room service is closed. Operating hours: ${serviceHours}`, 400);
        }
      }

      let total = 0;
      const orderItems = [];
      
      for (const item of items) {
        const menuItem = await Menu.findById(item.menuId);
        if (menuItem) {
          total += menuItem.price * item.quantity;
          orderItems.push({
            menuId: menuItem._id,
            name: menuItem.name,
            price: menuItem.price,
            quantity: item.quantity
          });
        }
      }

      const order = new Order({
        bookingId,
        roomName,
        items: orderItems,
        total_amount: total,
        paymentMethod,
        notes,
        paymentStatus: paymentMethod === 'Stripe' ? 'Pending' : 'Paid'
      });

      await order.save();

      await Log.create({
        action: 'ORDER_PLACED',
        performedBy: req.user?.name || 'Guest',
        details: `Order #${order._id} for Room ${roomName}. Total: €${total}`,
        targetId: order._id.toString()
      });

      res.status(201).json({ 
        success: true,
        message: 'Order received', 
        data: {
            orderId: order._id,
            total: total
        }
      });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  /**
   * 🛒 Fetch ALL orders (for Dashboard)
   */
  async getAllOrders(req, res) {
    try {
      const orders = await Order.find().sort({ createdAt: -1 });
      res.status(200).json(orders);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * 📈 Update order status (Staff only)
   */
  async updateStatus(req, res) {
    try {
      const { status } = req.body;
      const order = await Order.findByIdAndUpdate(req.params.id, { order_status: status }, { new: true });
      if (!order) throw new AppError("Order not found", 404);

      await Log.create({
        action: 'ORDER_STATUS_UPDATE',
        performedBy: req.user?.name || 'Staff',
        details: `Order #${order._id} status changed to: ${status}`,
        targetId: order._id.toString()
      });

      res.status(200).json(order);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

export default new OrderController();
