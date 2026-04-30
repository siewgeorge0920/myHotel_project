import express from 'express';
import cookieController from '../controllers/cookies.controller.js';
import { protect } from '../middleware/auth.js';
import { restrictTo } from '../middleware/role.js';

const router = express.Router();

router.post('/consent', cookieController.saveConsent);
router.get('/consents', protect, restrictTo('admin', 'manager'), cookieController.getAllConsents);

export default router;
