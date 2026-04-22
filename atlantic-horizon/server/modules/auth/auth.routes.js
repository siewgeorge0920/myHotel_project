import express from 'express';
import authController from './auth.controller.js';
import { protect, restrictTo } from '../../shared/middleware/auth.js';

const router = express.Router();

router.post('/login', authController.login);
router.post('/seed', authController.seed);
router.get('/verify', protect, authController.verify);
router.get('/', protect, restrictTo('admin', 'manager'), authController.getAllStaff);
router.post('/', protect, restrictTo('admin'), authController.createStaff);
router.put('/:id', protect, restrictTo('admin', 'manager'), authController.updateStaff);
router.delete('/:id', protect, restrictTo('admin'), authController.deleteStaff);

export default router;
