// authorizeMiddleware.js
const authorizeUser = (requiredRoles) => {
    return async (req, res, next) => {
      try {
        const user = req.user; // Assuming `req.user` contains the decoded user information from the authentication middleware
        if (!user || !requiredRoles.includes(user.role)) {
          return res.status(403).json({ message: 'Access denied. Unauthorized user.' });
        }
        next();
      } catch (error) {
        res.status(500).json({ message: 'Internal server error.' });
      }
    };
  };
  
  module.exports = authorizeUser;
  