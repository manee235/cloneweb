const express = require('express');
const bcrypt = require('bcryptjs');
const db = require('../database/init');
const { generateToken } = require('../middleware/auth');
const { logAction } = require('../middleware/auditLog');

const router = express.Router();

// Register (Only for initial setup - should be disabled in production)
router.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password required' });
    }

    // Password strength validation
    if (password.length < 12) {
      return res.status(400).json({ 
        error: 'Password must be at least 12 characters long with uppercase, lowercase, numbers, and special characters' 
      });
    }

    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (!hasUpperCase || !hasLowerCase || !hasNumbers || !hasSpecialChar) {
      return res.status(400).json({ 
        error: 'Password must contain uppercase, lowercase, numbers, and special characters' 
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    db.run('INSERT INTO admins (username, passwordHash) VALUES (?, ?)', [username, hashedPassword], function(err) {
      if (err) {
        if (err.message.includes('UNIQUE constraint failed')) {
          return res.status(400).json({ error: 'Username already exists' });
        }
        console.error('Registration error:', err);
        return res.status(500).json({ error: 'Registration failed' });
      }

      logAction(this.lastID, 'ADMIN_REGISTERED', 'admins', { username });
      res.json({ message: 'Admin registered successfully' });
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password required' });
    }

    db.get('SELECT * FROM admins WHERE username = ?', [username], async (err, admin) => {
      if (err) {
        console.error('Login error:', err);
        return res.status(500).json({ error: 'Login failed' });
      }

      if (!admin) {
        logAction(null, 'LOGIN_FAILED', 'admins', { username, reason: 'User not found' }, req.ip);
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const isPasswordValid = await bcrypt.compare(password, admin.passwordHash);

      if (!isPasswordValid) {
        logAction(null, 'LOGIN_FAILED', 'admins', { username, reason: 'Invalid password' }, req.ip);
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      // Update last login
      db.run('UPDATE admins SET last_login = CURRENT_TIMESTAMP WHERE id = ?', [admin.id]);

      const token = generateToken(admin.id, admin.username);
      logAction(admin.id, 'LOGIN_SUCCESS', 'admins', { username }, req.ip);

      res.json({ token, admin: { id: admin.id, username: admin.username } });
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

module.exports = router;
