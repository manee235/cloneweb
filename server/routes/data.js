const express = require('express');
const crypto = require('crypto');
const db = require('../database/init');

const router = express.Router();

// Helper function to get IP from request
function getClientIp(req) {
  return req.headers['x-forwarded-for']?.split(',')[0].trim() || 
         req.connection.remoteAddress || 
         req.socket.remoteAddress || 
         req.connection.socket?.remoteAddress;
}

// Collect visitor data
router.post('/collect', (req, res) => {
  try {
    const {
      sessionId,
      deviceType,
      browser,
      userAgent,
      latitude,
      longitude,
      locationAccuracy,
      locationGranted,
      privacyAccepted,
      ipAddress: clientIp,
      screenResolution,
      screenColorDepth,
      timezone,
      language,
      cookiesEnabled,
      doNotTrack,
      hardwareConcurrency,
      deviceMemory
    } = req.body;

    const ipAddress = clientIp || getClientIp(req);
    const newSessionId = sessionId || crypto.randomUUID();

    const sql = `
      INSERT INTO visitor_data 
      (session_id, ip_address, device_type, browser, user_agent, latitude, longitude, 
       location_accuracy, location_granted, screen_resolution, screen_color_depth, 
       timezone, language, hardware_concurrency, device_memory, cookies_enabled, 
       do_not_track, privacy_accepted)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.run(sql, [
      newSessionId,
      ipAddress,
      deviceType,
      browser,
      userAgent,
      latitude || null,
      longitude || null,
      locationAccuracy || null,
      locationGranted ? 1 : 0,
      screenResolution || null,
      screenColorDepth || null,
      timezone || null,
      language || null,
      hardwareConcurrency || null,
      deviceMemory || null,
      cookiesEnabled ? 1 : 0,
      doNotTrack || null,
      privacyAccepted ? 1 : 0
    ], function(err) {
      if (err) {
        console.error('Error inserting visitor data:', err);
        return res.status(500).json({ error: 'Failed to collect data' });
      }

      // Log consent
      if (privacyAccepted) {
        db.run(
          `INSERT INTO consent_tracking (visitor_session_id, consent_type, status) VALUES (?, ?, ?)`,
          [newSessionId, 'privacy', 1]
        );
      }

      if (locationGranted) {
        db.run(
          `INSERT INTO consent_tracking (visitor_session_id, consent_type, status) VALUES (?, ?, ?)`,
          [newSessionId, 'location', 1]
        );
      }

      res.json({ 
        success: true, 
        sessionId: newSessionId,
        message: 'Data collected successfully' 
      });
    });
  } catch (error) {
    console.error('Error collecting data:', error);
    res.status(500).json({ error: 'Failed to collect data' });
  }
});

// Get IP information (mock - in production use MaxMind or similar)
router.get('/ip-info', (req, res) => {
  try {
    const ipAddress = getClientIp(req);
    
    // Mock IP geolocation - in production use a real service
    res.json({
      ip: ipAddress,
      country: 'Country',
      region: 'Region',
      city: 'City',
      timezone: 'UTC'
    });
  } catch (error) {
    console.error('Error getting IP info:', error);
    res.status(500).json({ error: 'Failed to get IP information' });
  }
});

module.exports = router;
