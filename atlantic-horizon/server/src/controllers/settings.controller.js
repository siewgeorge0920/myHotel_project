import catchAsync from '../utils/catchAsync.js';
import { sendSuccess } from '../utils/responseHandler.js';
import { getSetting, upsertSetting } from '../utils/configHelper.js';
import { recordLog } from '../utils/logger.js';

class SettingsController {
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

  updateEmailSettings = catchAsync(async (req, res) => {
    const updates = req.body;
    for (const [key, value] of Object.entries(updates)) {
      await upsertSetting(key, value, `System configuration for ${key}`);
    }
    await recordLog(req.user, 'SETTINGS_UPDATE', 'System', `Global email or template configurations updated.`);
    sendSuccess(res, null, "Settings synchronized.");
  });
}

export default new SettingsController();
