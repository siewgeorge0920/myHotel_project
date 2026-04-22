import Log from '../models/Log.model.js';

export const recordLog = async (user, action, targetId, details = '') => {
  // 🟢 Allow login logs for ALL users; other actions restricted to management
  const isAuthAction = action === 'STAFF_LOGIN';
  if (!user || (!isAuthAction && !['admin', 'manager'].includes(user.role))) {
    return;
  }

  try {
    await Log.create({
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
