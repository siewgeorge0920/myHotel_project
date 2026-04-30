import CookieConsent from '../models/CookieConsent.model.js';
import { sendSuccess } from '../utils/responseHandler.js';

class CookieController {
  async saveConsent(req, res) {
    try {
      const { preference } = req.body;
      if (!['accepted', 'declined'].includes(preference)) {
        return res.status(400).json({ error: "Invalid preference." });
      }

      const consentRecord = await CookieConsent.create({
        preference,
        userAgent: req.headers['user-agent'],
        ip: req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress
      });

      sendSuccess(res, consentRecord, "Cookie preference recorded.");
    } catch (error) {
      res.status(500).json({ error: "Internal server error." });
    }
  }

  async getAllConsents(req, res) {
    try {
      const records = await CookieConsent.find().sort({ timestamp: -1 });
      sendSuccess(res, records, "Cookie consent records retrieved.");
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

export default new CookieController();
