import Log from '../models/Log.js';

/**
 * 📝 Administrative Logging Utility
 * Only records actions performed by Admin or Manager ranks.
 * 
 * @param {Object} user - The user object from req.user
 * @param {String} action - The action identifier (e.g., 'BOOKING_CONFIRMED')
 * @param {String} targetId - ID of the record being modified
 * @param {String} details - Human-readable explanation of the change
 */
export const recordLog = async (user, action, targetId, details = '') => {
  if (!user || !['admin', 'manager'].includes(user.role)) {
    return; // Fast escape for standard staff/guests/system
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
    console.error(`[V3 Audit Error] Logic failure recording ${action}:`, err.message);
  }
};
