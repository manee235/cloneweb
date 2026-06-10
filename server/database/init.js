const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'app.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to SQLite database');
    initializeDatabase();
  }
});

// Enable foreign keys
db.run('PRAGMA foreign_keys = ON');

// Create tables
function initializeDatabase() {
  // Users/Admin table
  db.run(`
    CREATE TABLE IF NOT EXISTS admins (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      passwordHash TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      last_login DATETIME
    )
  `, (err) => {
    if (err) console.error('Error creating admins table:', err);
    else console.log('Admins table ready');
  });

  // Visitor data table
  db.run(`
    CREATE TABLE IF NOT EXISTS visitor_data (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      session_id TEXT UNIQUE NOT NULL,
      ip_address TEXT,
      device_type TEXT,
      browser TEXT,
      user_agent TEXT,
      latitude REAL,
      longitude REAL,
      location_accuracy REAL,
      location_granted INTEGER DEFAULT 0,
      screen_resolution TEXT,
      screen_color_depth INTEGER,
      timezone TEXT,
      language TEXT,
      hardware_concurrency INTEGER,
      device_memory INTEGER,
      cookies_enabled INTEGER DEFAULT 0,
      do_not_track TEXT,
      privacy_accepted INTEGER DEFAULT 0,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `, (err) => {
    if (err) console.error('Error creating visitor_data table:', err);
    else console.log('Visitor data table ready');
  });

  // Audit logs table
  db.run(`
    CREATE TABLE IF NOT EXISTS audit_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      admin_id INTEGER,
      action TEXT NOT NULL,
      resource TEXT,
      details TEXT,
      ip_address TEXT,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (admin_id) REFERENCES admins(id)
    )
  `, (err) => {
    if (err) console.error('Error creating audit_logs table:', err);
    else console.log('Audit logs table ready');
  });

  // Consent tracking table
  db.run(`
    CREATE TABLE IF NOT EXISTS consent_tracking (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      visitor_session_id TEXT NOT NULL,
      consent_type TEXT NOT NULL,
      status INTEGER DEFAULT 0,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (visitor_session_id) REFERENCES visitor_data(session_id)
    )
  `, (err) => {
    if (err) console.error('Error creating consent_tracking table:', err);
    else console.log('Consent tracking table ready');
  });
}

module.exports = db;
