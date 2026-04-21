import Staff from '../models/Staff.js';

/**
 *  Authentication Middleware
 */
export const protect = async (req, res, next) => {
  try {
    const token = req.cookies.sessionToken || req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ error: "Access denied. Please sign in to the Manor." });
    }

    // Since we use a simple string token 'v3-session-{id}-{timestamp}'
    const parts = token.split('-');
    if (parts[0] !== 'v3' || parts[1] !== 'session') {
      return res.status(401).json({ error: "Invalid session credentials." });
    }

    const userId = parts[2];
    const user = await Staff.findById(userId).select('-password');

    if (!user || user.status !== 'Active') {
      return res.status(403).json({ error: "Session revoked or account suspended." });
    }

    // Attach user to request
    req.user = user;
    next();
  } catch (error) {
    res.status(500).json({ error: "Sanctuary security breach: authentication failed." });
  }
};

/**
 *  Role Authorization Middleware
 */
export const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: `Permission Denied: Your rank (${req.user.role}) is insufficient for this archive.` });
    }
    next();
  };
};
