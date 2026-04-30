import UserLog from '../models/userLog.model.js';

export const recordLog = async (user, action, targetId, details = '') => {
  //  Allow system actions; other actions restricted to management
  const isAuthAction = action === 'STAFF_LOGIN';
  if (!user && !isAuthAction) {
    return;
  }

  try {
    await UserLog.create({
      action,
      details,
      performed_by: user.name,
      target_id: targetId,
      user_type: 'Staff',
      timestamp: new Date()
    });
  } catch (err) {
    console.error(`[Audit Error] Logic failure recording ${action}:`, err.message);
  }
};
