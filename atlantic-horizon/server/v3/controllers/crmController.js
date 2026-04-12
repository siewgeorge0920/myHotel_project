import Client from '../models/Client.js';
import Booking from '../models/Booking.js';

class CrmController {
  /**
   * 📋 Get all clients
   */
  async getAllClients(req, res) {
    try {
      const clients = await Client.find().sort({ createdAt: -1 });
      res.status(200).json(clients);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * 🔍 Get a specific client by ID (with their bookings)
   */
  async getClientById(req, res) {
    try {
      const client = await Client.findById(req.params.id);
      if (!client) return res.status(404).json({ error: "Client not found." });

      // Fetch related bookings using email or client_id if tied that way.
      // Assuming bookings are tied by guestEmail in Booking model
      const bookings = await Booking.find({ guestEmail: client.email }).sort({ checkInDate: -1 });

      res.status(200).json({ client, bookings });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * ➕ Create a new client (manual entry)
   */
  async createClient(req, res) {
    try {
      const { name, email, phone, address, loyalty_tier, preferences } = req.body;
      
      const existing = await Client.findOne({ email });
      if (existing) {
        return res.status(400).json({ error: "A client with this email already exists." });
      }

      const client = new Client({
        client_id: `CUST-${Math.floor(Math.random() * 90000 + 10000)}`,
        name,
        email,
        phone,
        address,
        loyalty_tier: loyalty_tier || 'Silver',
        preferences
      });

      await client.save();
      res.status(201).json(client);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * ✏️ Update a client profile
   */
  async updateClient(req, res) {
    try {
      const { id } = req.params;
      const updateData = { ...req.body };
      
      // Prevent manual override of client_id
      delete updateData.client_id;

      const client = await Client.findByIdAndUpdate(id, updateData, { new: true });
      if (!client) return res.status(404).json({ error: "Client not found." });

      res.status(200).json(client);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * 🗑️ Delete a client (Admin only usually)
   */
  async deleteClient(req, res) {
    try {
      const { id } = req.params;
      const client = await Client.findByIdAndDelete(id);
      
      if (!client) return res.status(404).json({ error: "Client not found." });
      
      res.status(200).json({ message: "Client profile successfully purged." });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

export default new CrmController();
