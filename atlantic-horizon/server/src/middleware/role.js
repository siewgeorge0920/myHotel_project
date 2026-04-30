/**
 *  Role Authorization Middleware
 *  Restricts access to specific user roles.
 */
export const restrictTo = (...roles) => {
  return (req, res, next) => {
    const userRole = req.user.role?.toLowerCase();
    const authorizedRoles = roles.map(r => r.toLowerCase());

    if (!authorizedRoles.includes(userRole)) {
      return res.status(403).json({ 
        error: `Permission Denied: Your rank (${req.user.role}) is insufficient for this action.` 
      });
    }
    next();
  };
};
