import express from 'express';
import settingsController from './settings.controller.js';
import { protect, restrictTo } from '../../shared/middleware/auth.js';

const router = express.Router();

router.get('/email', protect, restrictTo('admin', 'manager'), settingsController.getEmailSettings);
router.post('/email', protect, restrictTo('admin', 'manager'), settingsController.updateEmailSettings);

export default router;
