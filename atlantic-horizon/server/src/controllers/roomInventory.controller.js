import RoomInventory from '../models/roomInventory.model.js';
import { recordLog } from '../utils/logger.js';
import catchAsync from '../utils/catchAsync.js';
import { sendSuccess } from '../utils/responseHandler.js';

class RoomInventoryController {
  getAll = catchAsync(async (req, res) => {
    const rooms = await RoomInventory.find().sort({ room_name: 1 });
    sendSuccess(res, rooms, "Inventory retrieved.");
  });

  create = catchAsync(async (req, res) => {
    const room = new RoomInventory(req.body);
    await room.save();
    await recordLog(req.user, 'ROOM_CREATE', room.room_name, `Physical unit established in inventory.`);
    sendSuccess(res, room, "Physical unit deployed.", 201);
  });

  update = catchAsync(async (req, res) => {
    const room = await RoomInventory.findByIdAndUpdate(req.params.id, req.body, { new: true });
    await recordLog(req.user, 'ROOM_UPDATE', room.room_name, `Physical unit parameters modified manually.`);
    sendSuccess(res, room, "Unit configuration updated.");
  });

  delete = catchAsync(async (req, res) => {
    const room = await RoomInventory.findById(req.params.id);
    const rName = room?.room_name;
    await RoomInventory.findByIdAndDelete(req.params.id);
    await recordLog(req.user, 'ROOM_DELETE', rName, `Physical unit decommissioned.`);
    sendSuccess(res, null, "Unit decommissioned.");
  });

  assign = catchAsync(async (req, res) => {
    const { roomType, unitNames } = req.body;
    if (!roomType) throw new Error("Room Type is required.");
    
    await RoomInventory.updateMany({ room_type_category: roomType }, { room_type_category: null });
    if (unitNames && unitNames.length > 0) {
      await RoomInventory.updateMany({ room_name: { $in: unitNames } }, { room_type_category: roomType });
    }
    await recordLog(req.user, 'ROOM_ASSIGN', roomType, `Bulk assigned ${unitNames?.length || 0} units.`);
    sendSuccess(res, null, "Assignments synchronized.");
  });
}

export default new RoomInventoryController();
