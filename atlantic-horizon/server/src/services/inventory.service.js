import RoomInventory from '../models/roomInventory.model.js';
import Booking from '../models/booking.model.js';
import { AppError } from '../utils/responseHandler.js';

class InventoryService {
  async checkRoomAvailability(checkIn, checkOut, roomCategory) {
    const start = new Date(checkIn);
    const end = new Date(checkOut);

    const overlapCount = await Booking.find({
      room_type: roomCategory,
      status: { $nin: ['Cancelled', 'CheckedOut'] },
      $or: [{ check_in: { $lt: end }, check_out: { $gt: start } }]
    }).countDocuments();

    const totalRooms = await RoomInventory.countDocuments({
      room_type_category: roomCategory
    });

    if (totalRooms === 0) throw new AppError(`Room category '${roomCategory}' not found.`, 404);

    return {
      isAvailable: overlapCount < totalRooms,
      remaining: totalRooms - overlapCount
    };
  }

  async ensureAvailability(checkIn, checkOut, roomCategory) {
    const status = await this.checkRoomAvailability(checkIn, checkOut, roomCategory);
    if (!status.isAvailable) {
      throw new AppError(`Inventory mismatch: ${roomCategory} is full.`, 400);
    }
    return status;
  }
}

export default new InventoryService();
