import express from 'express';
import cookieController from './cookies.controller.js';
import { protect, restrictTo } from '../../shared/middleware/auth.js';

const router = express.Router();

router.post('/consent', cookieController.saveConsent);
router.get('/consents', protect, restrictTo('admin', 'manager'), cookieController.getAllConsents);

export default router;
