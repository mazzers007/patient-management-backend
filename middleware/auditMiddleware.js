// auditMiddleware.js
const Audit = require('../models/auditorModel');

const logAction = async (req, action, details) => {
  try {
    const auditLog = new Audit({
      action,
      user: req.user.userId,
      username: req.user.username,
      details
    });
    await auditLog.save();
  } catch (error) {
    console.error('Error logging audit action:', error);
  }
};

module.exports = { logAction };
