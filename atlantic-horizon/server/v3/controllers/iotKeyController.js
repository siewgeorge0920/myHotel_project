import iotKeyService from '../services/iotKeyService.js';

class IotKeyController {
  /**
   * 📱 Fetch Active Key (Guest Endpoint)
   */
  async getMyKey(req, res) {
    const { bookingId } = req.query; // Usually extracted from JWT in production.
    if (!bookingId) return res.status(400).json({ error: "Booking ID required." });

    try {
      const keyData = await iotKeyService.getActiveKeyForBooking(bookingId);
      res.status(200).json(keyData);
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  }

  /**
   * 🛠️ Manually trigger key regeneration (Staff/Admin)
   */
  async regenerateKey(req, res) {
    const { bookingObjectId, roomObjectId } = req.body;
    try {
      const keyCard = await iotKeyService.generateKey(bookingObjectId, roomObjectId);
      res.status(201).json({ message: "New IoT Key generated.", key: keyCard });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

export default new IotKeyController();
