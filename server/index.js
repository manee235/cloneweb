require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

// Import database initialization
require('./database/init');

// Import routes
const authRoutes = require('./routes/auth');
const dataRoutes = require('./routes/data');
const adminRoutes = require('./routes/admin');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    // In development, allow localhost, 127.0.0.1, and local private network subnets (192.168.x.x, 10.x.x.x, 172.16-31.x.x)
    const isAllowed = origin === process.env.REACT_APP_URL ||
                      origin.startsWith('http://localhost:') ||
                      origin.startsWith('http://127.0.0.1:') ||
                      /^http:\/\/192\.168\.\d+\.\d+(:\d+)?$/.test(origin) ||
                      /^http:\/\/10\.\d+\.\d+\.\d+(:\d+)?$/.test(origin) ||
                      /^http:\/\/172\.(1[6-9]|2\d|3[01])\.\d+\.\d+(:\d+)?$/.test(origin);
                      
    if (isAllowed) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request IP middleware
app.use((req, res, next) => {
  req.ip = req.headers['x-forwarded-for']?.split(',')[0].trim() || 
           req.socket.remoteAddress || 
           req.connection.remoteAddress;
  next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/data', dataRoutes);
app.use('/api/admin', adminRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
app.listen(PORT, () => {
  console.log(`
    ╔════════════════════════════════════════╗
    ║   Festive Campaign Server Running      ║
    ║   URL: http://localhost:${PORT}            ║
    ║   Environment: ${process.env.NODE_ENV || 'development'}        ║
    ╚════════════════════════════════════════╝
  `);
});
