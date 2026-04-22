import express from 'express';
import roomInventoryController from './roomInventory.controller.js';
import roomTypeController from './roomType.controller.js';
import { protect, restrictTo } from '../../shared/middleware/auth.js';

const router = express.Router();

// Master Room Types (Luxury Packages)
router.get('/rooms', roomTypeController.getAllRoomTypes);
router.get('/rooms/:id', roomTypeController.getRoomType);
router.post('/rooms', protect, restrictTo('admin', 'manager'), roomTypeController.createRoomType);
router.put('/rooms/:id', protect, restrictTo('admin', 'manager'), roomTypeController.updateRoomType);
router.delete('/rooms/:id', protect, restrictTo('admin'), roomTypeController.deleteRoomType);

// Physical Inventory
router.get('/physical-rooms', protect, roomInventoryController.getAll);
router.post('/physical-rooms', protect, restrictTo('admin', 'manager'), roomInventoryController.create);
router.put('/physical-rooms/:id', protect, restrictTo('admin', 'manager', 'staff'), roomInventoryController.update);
router.put('/physical-rooms/assign', protect, restrictTo('admin', 'manager'), roomInventoryController.assign);
router.delete('/physical-rooms/:id', protect, restrictTo('admin'), roomInventoryController.delete);

export default router;
