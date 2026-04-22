import express from 'express';
import billingController from './billing.controller.js';
import { protect, restrictTo } from '../../shared/middleware/auth.js';

const router = express.Router();

router.post('/gift-cards/checkout', billingController.startPurchase);
router.post('/gift-cards/verify-purchase', billingController.verifyPurchase);
router.post('/gift-cards/validate', billingController.validate);
router.post('/gift-cards/instant-purchase', billingController.instantPurchase);
router.get('/gift-cards/all', protect, restrictTo('admin', 'manager'), billingController.getAllGiftCards);
router.get('/gift-cards/:code/history', protect, restrictTo('admin', 'manager'), billingController.getGiftCardHistory);

// Manual folio adjustments
router.post('/manual-charge', protect, restrictTo('admin', 'manager'), billingController.addManualCharge);

export default router;
