import express from 'express';
import authController from './auth.controller.js';
import { protect, restrictTo } from '../../shared/middleware/auth.js';

const router = express.Router();

router.post('/login', authController.login);
router.post('/seed-admin', authController.seed);

// Full Staff CRUD (Admin Only)
router.get('/staff', protect, restrictTo('admin'), authController.getAllStaff);
router.post('/staff', protect, restrictTo('admin'), authController.createStaff);
router.put('/staff/:id', protect, restrictTo('admin'), authController.updateStaff);
router.delete('/staff/:id', protect, restrictTo('admin'), authController.deleteStaff);

export default router;
