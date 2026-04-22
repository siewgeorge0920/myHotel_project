import Staff from '../../modules/auth/Staff.model.js';

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
    
    // 🛡️ Guard against invalid ID formats
    if (!userId || userId.length !== 24) {
      console.warn(`[Auth Warning] Malformed ID in token: "${userId}"`);
      return res.status(401).json({ error: "Invalid session structure." });
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
