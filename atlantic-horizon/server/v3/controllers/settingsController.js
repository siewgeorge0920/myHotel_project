import catchAsync from '../utils/catchAsync.js';
import { sendSuccess } from '../utils/responseHandler.js';
import { getSetting, upsertSetting } from '../utils/configHelper.js';
import { recordLog } from '../utils/logger.js';

class SettingsController {
  /**
   * 📧 Get All Email Related Settings including Templates
   */
  getEmailSettings = catchAsync(async (req, res) => {
    const keys = [
      'email_user', 'email_pass', 'email_host', 'email_port',
      'email_template_booking', 'email_template_checkin', 'email_template_giftcard'
    ];

    const settings = {};
    for (const key of keys) {
      settings[key] = await getSetting(key);
    }

    sendSuccess(res, settings, "Email configurations retrieved.");
  });

  /**
   * 💾 Update Email Config & Templates
   */
  updateEmailSettings = catchAsync(async (req, res) => {
    const updates = req.body;
    
    // We expect a flat object of key-value pairs
    for (const [key, value] of Object.entries(updates)) {
      await upsertSetting(key, value, `System configuration for ${key}`);
    }

    await recordLog(req.user, 'SETTINGS_UPDATE', 'System', `Global email or template configurations were synchronized.`);

    sendSuccess(res, null, "Settings synchronized to Sanctuary Core.");
  });
}

export default new SettingsController();
