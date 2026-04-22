import RoomType from './Room.model.js';
import catchAsync from '../../shared/utils/catchAsync.js';
import { sendSuccess } from '../../shared/utils/responseHandler.js';

class RoomTypeController {
  getAllRoomTypes = catchAsync(async (req, res) => {
    const roomTypes = await RoomType.find();
    sendSuccess(res, roomTypes, "Luxury Packages retrieved.");
  });

  getRoomType = catchAsync(async (req, res) => {
    const roomType = await RoomType.findById(req.params.id);
    sendSuccess(res, roomType, "Luxury Package details retrieved.");
  });

  createRoomType = catchAsync(async (req, res) => {
    const roomType = await RoomType.create(req.body);
    sendSuccess(res, roomType, "New Luxury Package deployed.", 201);
  });

  updateRoomType = catchAsync(async (req, res) => {
    const roomType = await RoomType.findByIdAndUpdate(req.params.id, req.body, { new: true });
    sendSuccess(res, roomType, "Luxury Package updated.");
  });

  deleteRoomType = catchAsync(async (req, res) => {
    await RoomType.findByIdAndDelete(req.params.id);
    sendSuccess(res, null, "Luxury Package decommissioned.");
  });
}

export default new RoomTypeController();
