import express from 'express';
import logsController from './logs.controller.js';
import { protect, restrictTo } from '../../shared/middleware/auth.js';

const router = express.Router();

// Only the 'Boss' (Admin) can view audit logs
router.get('/logins', protect, restrictTo('admin'), logsController.getLoginLogs);
router.get('/actions', protect, restrictTo('admin'), logsController.getSystemLogs);

export default router;
