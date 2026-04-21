import Room from '../models/Room.js';
import Log from '../models/Log.js';
import { AppError } from '../utils/responseHandler.js';

class RoomController {
  /**
   *  Fetch all luxury room types/packages
   */
  async getAll(req, res) {
    try {
      const rooms = await Room.find();
      res.status(200).json(rooms);
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to fetch luxury packages", error: error.message });
    }
  }

  /**
   *  Create new luxury room type
   */
  async create(req, res) {
    const { department, name, pricePerNight, maxGuests } = req.body;
    
    if (!department || !name) {
      throw new AppError("Department and Name are required constants.", 400);
    }
    if (!pricePerNight || pricePerNight <= 0) {
      throw new AppError("Price must be a valid positive value.", 400);
    }

    try {
      const room = new Room(req.body);
      await room.save();

      await Log.create({
        action: `ROOM_TYPE_CREATE`,
        performedBy: req.user?.name || 'Admin',
        details: `Created Room Type/Package: ${name}`,
        targetId: room._id.toString()
      });

      res.status(201).json({
        success: true,
        message: "Luxury Package deployed successfully.",
        data: room
      });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Failed to create property package', error: error.message });
    }
  }

  /**
   *  Update existing luxury room type
   */
  async update(req, res) {
    try {
      const room = await Room.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!room) throw new AppError('Luxury package not found.', 404);

      await Log.create({
        action: `ROOM_TYPE_UPDATE`,
        performedBy: req.user?.name || 'Admin',
        details: `Updated Room Type: ${room.name}`,
        targetId: room._id.toString()
      });

      res.status(200).json({ success: true, message: 'Package updated.', data: room });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Update failed', error: error.message });
    }
  }

  /**
   *  Delete luxury room type
   */
  async delete(req, res) {
    try {
      const room = await Room.findById(req.params.id);
      if (!room) throw new AppError('Package not found.', 404);

      const roomName = room.name;
      await Room.findByIdAndDelete(req.params.id);

      await Log.create({
        action: `ROOM_TYPE_DELETE`,
        performedBy: req.user?.name || 'Admin',
        details: `Deleted Room Type: ${roomName}`,
        targetId: req.params.id
      });

      res.status(200).json({ success: true, message: 'Luxury Package removed from system.' });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Deletion failed', error: error.message });
    }
  }
}

export default new RoomController();
