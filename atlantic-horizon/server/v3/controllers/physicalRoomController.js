import PhysicalRoom from '../models/PhysicalRoom.js';

class PhysicalRoomController {
  /**
   * 📡 Fetch all units (Inventory View)
   */
  async getAll(req, res) {
    try {
      const rooms = await PhysicalRoom.find().sort({ room_name: 1 });
      res.status(200).json(rooms);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * ➕ Add new Physical Device/Room
   */
  async create(req, res) {
    try {
      const room = new PhysicalRoom(req.body);
      await room.save();
      res.status(201).json(room);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  /**
   * ✏️ Update status or Device ID
   */
  async update(req, res) {
    try {
      const room = await PhysicalRoom.findByIdAndUpdate(req.params.id, req.body, { new: true });
      res.status(200).json(room);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * 🗑️ Delete Physical Unit
   */
  async delete(req, res) {
    try {
      await PhysicalRoom.findByIdAndDelete(req.params.id);
      res.status(200).json({ message: "Unit decommissioned successfully." });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

export default new PhysicalRoomController();
