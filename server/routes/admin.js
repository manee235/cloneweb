const express = require('express');
const db = require('../database/init');
const { verifyToken } = require('../middleware/auth');
const { auditMiddleware, logAction } = require('../middleware/auditLog');

const router = express.Router();

// All admin routes require authentication
router.use(verifyToken);
router.use(auditMiddleware);

// Get all visitor data
router.get('/visitor-data', (req, res) => {
  try {
    req.log('VIEW_VISITOR_DATA', 'visitor_data');

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;

    db.get('SELECT COUNT(*) as total FROM visitor_data', (err, countResult) => {
      if (err) {
        console.error('Error counting visitor data:', err);
        return res.status(500).json({ error: 'Failed to fetch visitor data' });
      }

      const total = countResult.total;

      db.all(`
        SELECT * FROM visitor_data 
        ORDER BY timestamp DESC 
        LIMIT ? OFFSET ?
      `, [limit, offset], (err, data) => {
        if (err) {
          console.error('Error fetching visitor data:', err);
          return res.status(500).json({ error: 'Failed to fetch visitor data' });
        }

        res.json({
          success: true,
          data: data || [],
          pagination: {
            page,
            limit,
            total,
            pages: Math.ceil(total / limit)
          }
        });
      });
    });
  } catch (error) {
    console.error('Error fetching visitor data:', error);
    res.status(500).json({ error: 'Failed to fetch visitor data' });
  }
});

// Get visitor detail
router.get('/visitor/:sessionId', (req, res) => {
  try {
    const { sessionId } = req.params;
    req.log('VIEW_VISITOR_DETAIL', 'visitor_data', { sessionId });

    db.get('SELECT * FROM visitor_data WHERE session_id = ?', [sessionId], (err, visitor) => {
      if (err) {
        console.error('Error fetching visitor detail:', err);
        return res.status(500).json({ error: 'Failed to fetch visitor detail' });
      }

      if (!visitor) {
        return res.status(404).json({ error: 'Visitor not found' });
      }

      db.all('SELECT * FROM consent_tracking WHERE visitor_session_id = ?', [sessionId], (err, consent) => {
        if (err) {
          console.error('Error fetching consent records:', err);
          return res.status(500).json({ error: 'Failed to fetch consent records' });
        }

        res.json({
          success: true,
          visitor,
          consent: consent || []
        });
      });
    });
  } catch (error) {
    console.error('Error fetching visitor detail:', error);
    res.status(500).json({ error: 'Failed to fetch visitor detail' });
  }
});

// Get analytics
router.get('/analytics', (req, res) => {
  try {
    req.log('VIEW_ANALYTICS', 'analytics');

    db.get('SELECT COUNT(*) as count FROM visitor_data', (err, totalVisitors) => {
      if (err) {
        console.error('Error fetching analytics:', err);
        return res.status(500).json({ error: 'Failed to fetch analytics' });
      }

      db.get('SELECT COUNT(*) as count FROM visitor_data WHERE privacy_accepted = 1', (err, privacyAccepted) => {
        if (err) {
          console.error('Error fetching analytics:', err);
          return res.status(500).json({ error: 'Failed to fetch analytics' });
        }

        db.get('SELECT COUNT(*) as count FROM visitor_data WHERE location_granted = 1', (err, locationGranted) => {
          if (err) {
            console.error('Error fetching analytics:', err);
            return res.status(500).json({ error: 'Failed to fetch analytics' });
          }

          db.all('SELECT device_type, COUNT(*) as count FROM visitor_data GROUP BY device_type', (err, deviceBreakdown) => {
            if (err) {
              console.error('Error fetching device breakdown:', err);
              return res.status(500).json({ error: 'Failed to fetch analytics' });
            }

            db.all('SELECT browser, COUNT(*) as count FROM visitor_data GROUP BY browser', (err, browserBreakdown) => {
              if (err) {
                console.error('Error fetching browser breakdown:', err);
                return res.status(500).json({ error: 'Failed to fetch analytics' });
              }

              res.json({
                success: true,
                totalVisitors: totalVisitors.count,
                privacyAccepted: privacyAccepted.count,
                locationGranted: locationGranted.count,
                deviceBreakdown: deviceBreakdown || [],
                browserBreakdown: browserBreakdown || []
              });
            });
          });
        });
      });
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    res.status(500).json({ error: 'Failed to fetch analytics' });
  }
});

// Get audit logs
router.get('/audit-logs', (req, res) => {
  try {
    req.log('VIEW_AUDIT_LOGS', 'audit_logs');

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const offset = (page - 1) * limit;

    db.get('SELECT COUNT(*) as total FROM audit_logs', (err, countResult) => {
      if (err) {
        console.error('Error counting audit logs:', err);
        return res.status(500).json({ error: 'Failed to fetch audit logs' });
      }

      const total = countResult.total;

      db.all(`
        SELECT al.*, a.username FROM audit_logs al
        LEFT JOIN admins a ON al.admin_id = a.id
        ORDER BY al.timestamp DESC 
        LIMIT ? OFFSET ?
      `, [limit, offset], (err, logs) => {
        if (err) {
          console.error('Error fetching audit logs:', err);
          return res.status(500).json({ error: 'Failed to fetch audit logs' });
        }

        res.json({
          success: true,
          logs: logs || [],
          pagination: {
            page,
            limit,
            total,
            pages: Math.ceil(total / limit)
          }
        });
      });
    });
  } catch (error) {
    console.error('Error fetching audit logs:', error);
    res.status(500).json({ error: 'Failed to fetch audit logs' });
  }
});

// Export visitor data
router.post('/export', (req, res) => {
  try {
    req.log('EXPORT_DATA', 'visitor_data');

    db.all('SELECT * FROM visitor_data ORDER BY timestamp DESC', (err, data) => {
      if (err) {
        console.error('Error exporting data:', err);
        return res.status(500).json({ error: 'Failed to export data' });
      }

      res.json({
        success: true,
        data: data || [],
        exportedAt: new Date().toISOString()
      });
    });
  } catch (error) {
    console.error('Error exporting data:', error);
    res.status(500).json({ error: 'Failed to export data' });
  }
});

// Delete visitor data (with consent from admin)
router.delete('/visitor/:sessionId', (req, res) => {
  try {
    const { sessionId } = req.params;
    req.log('DELETE_VISITOR_DATA', 'visitor_data', { sessionId });

    db.run('DELETE FROM visitor_data WHERE session_id = ?', [sessionId], (err) => {
      if (err) {
        console.error('Error deleting visitor data:', err);
        return res.status(500).json({ error: 'Failed to delete visitor data' });
      }

      db.run('DELETE FROM consent_tracking WHERE visitor_session_id = ?', [sessionId], (err) => {
        if (err) {
          console.error('Error deleting consent records:', err);
          return res.status(500).json({ error: 'Failed to delete consent records' });
        }

        res.json({ success: true, message: 'Visitor data deleted' });
      });
    });
  } catch (error) {
    console.error('Error deleting visitor data:', error);
    res.status(500).json({ error: 'Failed to delete visitor data' });
  }
});

module.exports = router;
