import express from 'express';
import authController from '../controllers/auth.controller.js';
import { protect } from '../middleware/auth.js';
import { restrictTo } from '../middleware/role.js';

const router = express.Router();

router.post('/login', authController.login);
router.post('/seed', authController.seed);
router.get('/verify', protect, authController.verify);

// Staff Management Routes (Explicit)
router.get('/staff', protect, restrictTo('admin', 'manager'), authController.getAllStaff);
router.post('/staff', protect, restrictTo('admin'), authController.createStaff);
router.put('/staff/:id', protect, restrictTo('admin', 'manager'), authController.updateStaff);
router.delete('/staff/:id', protect, restrictTo('admin'), authController.deleteStaff);

export default router;
