import express from 'express';
import roomInventoryController from './roomInventory.controller.js';
import { protect, restrictTo } from '../../shared/middleware/auth.js';

const router = express.Router();

// Physical Inventory
router.get('/physical-rooms', protect, roomInventoryController.getAll);
router.post('/physical-rooms', protect, restrictTo('admin', 'manager'), roomInventoryController.create);
router.put('/physical-rooms/:id', protect, restrictTo('admin', 'manager', 'staff'), roomInventoryController.update);
router.put('/physical-rooms/assign', protect, restrictTo('admin', 'manager'), roomInventoryController.assign);
router.delete('/physical-rooms/:id', protect, restrictTo('admin'), roomInventoryController.delete);

export default router;
