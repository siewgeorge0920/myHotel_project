import express from 'express';
import roomInventoryController from '../controllers/roomInventory.controller.js';
import { protect } from '../middleware/auth.js';
import { restrictTo } from '../middleware/role.js';

const router = express.Router();

// Physical Inventory
router.get('/physical-rooms', protect, roomInventoryController.getAll);
router.post('/physical-rooms', protect, restrictTo('admin', 'manager'), roomInventoryController.create);
router.put('/physical-rooms/:id', protect, restrictTo('admin', 'manager', 'staff'), roomInventoryController.update);
router.put('/physical-rooms/assign', protect, restrictTo('admin', 'manager'), roomInventoryController.assign);
router.delete('/physical-rooms/:id', protect, restrictTo('admin'), roomInventoryController.delete);

export default router;
