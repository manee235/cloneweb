const db = require('../database/init');

const logAction = (adminId, action, resource = null, details = null, ipAddress = null) => {
  try {
    db.run(`
      INSERT INTO audit_logs (admin_id, action, resource, details, ip_address)
      VALUES (?, ?, ?, ?, ?)
    `, [adminId, action, resource, details ? JSON.stringify(details) : null, ipAddress], (err) => {
      if (err) {
        console.error('Error logging action:', err);
      }
    });
  } catch (error) {
    console.error('Error logging action:', error);
  }
};

const auditMiddleware = (req, res, next) => {
  // Attach logging function to request
  req.log = (action, resource = null, details = null) => {
    logAction(
      req.admin?.id || null,
      action,
      resource,
      details,
      req.ip
    );
  };
  next();
};

module.exports = { logAction, auditMiddleware };
