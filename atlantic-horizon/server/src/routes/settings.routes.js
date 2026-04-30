import express from 'express';
import settingsController from '../controllers/settings.controller.js';
import { protect } from '../middleware/auth.js';
import { restrictTo } from '../middleware/role.js';

const router = express.Router();

router.get('/email', protect, restrictTo('admin', 'manager'), settingsController.getEmailSettings);
router.post('/email', protect, restrictTo('admin', 'manager'), settingsController.updateEmailSettings);

export default router;
