import LoginLog from '../models/loginLog.model.js';
import UserLog from '../models/userLog.model.js';
import { sendSuccess } from '../utils/responseHandler.js';
import catchAsync from '../utils/catchAsync.js';

class LogsController {
  /**
   * Fetch entrance session logs (Login logs with location & timeleft)
   */
  getLoginLogs = catchAsync(async (req, res) => {
    const logs = await LoginLog.find()
      .sort({ login_at: -1 })
      .limit(200);
      
    sendSuccess(res, logs, "Entrance session logs retrieved.");
  });

  /**
   *  Fetch activity audit logs (Who did what)
   */
  getSystemLogs = catchAsync(async (req, res) => {
    const logs = await UserLog.find()
      .sort({ timestamp: -1 })
      .limit(100);
      
    sendSuccess(res, logs, "Activity audit logs retrieved.");
  });
}

export default new LogsController();
