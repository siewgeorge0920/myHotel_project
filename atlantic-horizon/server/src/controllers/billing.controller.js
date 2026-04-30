import giftCardService from '../services/giftCard.service.js';
import billingService from '../services/billing.service.js';
import catchAsync from '../utils/catchAsync.js';
import { sendSuccess } from '../utils/responseHandler.js';

const billingController = {
  startPurchase: catchAsync(async (req, res) => {
    const session = await giftCardService.createSession(req.body);
    sendSuccess(res, { url: session.url });
  }),

  verifyPurchase: catchAsync(async (req, res) => {
    const { sessionId } = req.body;
    const result = await giftCardService.verifyAndActivate(sessionId);
    sendSuccess(res, result);
  }),

  validate: catchAsync(async (req, res) => {
    const { code } = req.body;
    const card = await giftCardService.validate(code);
    sendSuccess(res, card);
  }),

  instantPurchase: catchAsync(async (req, res) => {
    const result = await giftCardService.instantActivate(req.body);
    sendSuccess(res, result, "Gift card activated instantly.");
  }),

  getAllGiftCards: catchAsync(async (req, res) => {
    const cards = await giftCardService.getAll();
    sendSuccess(res, cards);
  }),

  getGiftCardHistory: catchAsync(async (req, res) => {
    const { code } = req.params;
    const history = await giftCardService.getHistory(code);
    sendSuccess(res, history);
  }),

  addManualCharge: catchAsync(async (req, res) => {
    const { bookingId, description, amount } = req.body;
    const updated = await billingService.addManualCharge(bookingId, description, amount, req.user?.name);
    sendSuccess(res, updated, "Manual charge added to folio.");
  })
};

export default billingController;
