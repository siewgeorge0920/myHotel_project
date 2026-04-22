import Log from '../../shared/models/Log.model.js';
import { sendSuccess } from '../../shared/utils/responseHandler.js';
import catchAsync from '../../shared/utils/catchAsync.js';

class LogsController {
  /**
   * 📜 Fetch all system logs (Restricted to Boss/Admin)
   */
  getLoginLogs = catchAsync(async (req, res) => {
    // We specifically want login events, sorted by newest first
    const logs = await Log.find({ action: 'STAFF_LOGIN' })
      .sort({ timestamp: -1 })
      .limit(200); // Optimization: don't fetch everything at once
      
    sendSuccess(res, logs, "Audit logs retrieved.");
  });

  /**
   * 📜 Fetch general system logs
   */
  getSystemLogs = catchAsync(async (req, res) => {
    const logs = await Log.find()
      .sort({ timestamp: -1 })
      .limit(100);
      
    sendSuccess(res, logs, "System audit retrieved.");
  });
}

export default new LogsController();
