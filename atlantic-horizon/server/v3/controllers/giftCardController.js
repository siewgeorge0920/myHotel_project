import giftCardService from '../services/giftCardService.js';
import { sendSuccess } from '../utils/responseHandler.js';

class GiftCardController {
  /**
   * 💳 Start Purchase (Stripe Session)
   */
  async startPurchase(req, res) {
    try {
      const session = await giftCardService.createSession(req.body);
      sendSuccess(res, { url: session.url }, "Voucher session initialized.");
    } catch (error) {
      console.error("V3 GC Purchase Error:", error.message);
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * 🛡️ Verify Purchase (Called from Success Page)
   */
  async verifyPurchase(req, res) {
    const { sessionId } = req.body;
    if (!sessionId) return res.status(400).json({ error: "Session ID required." });

    try {
      const result = await giftCardService.verifyAndActivate(sessionId);
      sendSuccess(res, result, "Voucher identity activated and confirmed.");
    } catch (error) {
      console.error("V3 GC Verification Error:", error.message);
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * 🎫 Validate Code for usage
   */
  async validate(req, res) {
    const { code } = req.body;
    try {
      const card = await giftCardService.validate(code);
      res.status(200).json({ 
        valid: true, 
        balance: card.balance,
        message: `Voucher matched! Balance: €${card.balance}` 
      });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  /**
   * ⚡ Instant/Manual Purchase (Bypass Stripe)
   */
  async instantPurchase(req, res) {
    try {
      const result = await giftCardService.instantActivate(req.body);
      sendSuccess(res, result, "Voucher issued successfully (Direct).");
    } catch (error) {
      console.error("V3 GC Instant Purchase Error:", error.message);
      res.status(500).json({ error: error.message });
    }
  }
}

export default new GiftCardController();
