import RoomInventory from '../models/RoomInventory.js';
import { recordLog } from '../utils/logger.js';

class RoomInventoryController {
  /**
   *  Fetch all units (Inventory View)
   */
  async getAll(req, res) {
    try {
      const rooms = await RoomInventory.find().sort({ room_name: 1 });
      res.status(200).json(rooms);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  /**
   *  Add new Physical Device/Room
   */
  async create(req, res) {
    try {
      const room = new RoomInventory(req.body);
      await room.save();
      await recordLog(req.user, 'ROOM_CREATE', room.room_name, `Physical unit established in inventory.`);
      res.status(201).json(room);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  /**
   *  Update status or Device ID
   */
  async update(req, res) {
    try {
      const room = await RoomInventory.findByIdAndUpdate(req.params.id, req.body, { new: true });
      await recordLog(req.user, 'ROOM_UPDATE', room.room_name, `Physical unit parameters modified manually.`);
      res.status(200).json(room);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  /**
   *  Delete Physical Unit
   */
  async delete(req, res) {
    try {
      const room = await RoomInventory.findById(req.params.id);
      const rName = room?.room_name;
      await RoomInventory.findByIdAndDelete(req.params.id);
      await recordLog(req.user, 'ROOM_DELETE', rName, `Physical unit decommissioned and removed.`);
      res.status(200).json({ message: "Unit decommissioned successfully." });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
  /**
   *  Assign physical units to a Room Type (Bulk)
   */
  async assign(req, res) {
    const { roomType, unitNames } = req.body;
    if (!roomType) return res.status(400).json({ success: false, message: "Room Type is required for assignment." });

    try {
      // 1. Unassign all rooms currently linked to this roomType
      await RoomInventory.updateMany({ roomType: roomType }, { roomType: null });

      // 2. Assign selected rooms to this roomType
      if (unitNames && unitNames.length > 0) {
        await RoomInventory.updateMany({ roomName: { $in: unitNames } }, { roomType: roomType });
      }

      await recordLog(req.user, 'ROOM_ASSIGN', roomType, `Bulk assigned ${unitNames?.length || 0} units to package.`);
      res.status(200).json({ success: true, message: `Successfully updated assignment for ${roomType}` });
    } catch (err) {
      res.status(500).json({ success: false, message: "Assignment failed", error: err.message });
    }
  }
}

export default new RoomInventoryController();
