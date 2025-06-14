// middlewares/authorizeRole.js

export function authorizeRole(requiredRole) {
  return (req, res, next) => {
    // user role should be attached by the verifyToken middleware
    const userRole = req.user?.role;

    if (!userRole) {
      return res.status(403).json({ message: 'User role not found' });
    }

    if (userRole !== requiredRole) {
      return res.status(403).json({ message: 'Access denied: insufficient permissions' });
    }

    next();
  };
}
