import Staff from '../../modules/auth/Staff.model.js';
import { isSessionExpired } from '../utils/24HrsLogout.js';

/**
 *  Authentication Middleware
 */
export const protect = async (req, res, next) => {
  try {
    const token = req.cookies.sessionToken || req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ error: "Access denied. Please sign in." });
    }

    const parts = token.split('-');
    if (parts[0] !== 'session') {
      return res.status(401).json({ error: "Invalid session credentials." });
    }

    const userId = parts[1];
    const timestamp = parseInt(parts[2]);
    
    // 🛡️ Guard against invalid ID formats or missing timestamps
    if (!userId || userId.length !== 24 || !timestamp) {
      console.warn(`[Auth Warning] Malformed session token: "${token}"`);
      return res.status(401).json({ error: "Invalid session structure." });
    }

    // ⏳ 24-Hour Strict Expiration Check (Server-Side)
    if (isSessionExpired(timestamp)) {
      console.log(`[Auth Alert] Session expired for UID: ${userId}`);
      return res.status(401).json({ error: "Session expired. Please sign in again." });
    }

    const user = await Staff.findById(userId).select('-password');

    if (!user || user.status !== 'Active') {
      return res.status(403).json({ error: "Session revoked or account suspended." });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("[Auth Middleware Error]:", error);
    res.status(500).json({ error: "Authentication failed." });
  }
};

/**
 *  Role Authorization Middleware
 */
export const restrictTo = (...roles) => {
  return (req, res, next) => {
    const userRole = req.user.role?.toLowerCase();
    const authorizedRoles = roles.map(r => r.toLowerCase());

    if (!authorizedRoles.includes(userRole)) {
      return res.status(403).json({ error: `Permission Denied: Your rank (${req.user.role}) is insufficient.` });
    }
    next();
  };
};
