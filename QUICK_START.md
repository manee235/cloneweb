# Black Friday Campaign - Quick Start Guide

## 🚀 Quickest Setup (2 Steps)

### Windows
```bash
# Step 1: Run the setup script
setup.bat

# Step 2: Open two command prompts and run:
# Terminal 1:
cd server && npm start

# Terminal 2:
npm start
```

### Mac/Linux
```bash
# Step 1: Run the setup script
chmod +x setup.sh && ./setup.sh

# Step 2: Open two terminals and run:
# Terminal 1:
cd server && npm start

# Terminal 2:
npm start
```

## ✅ Complete Setup

### 1. Install Dependencies

**Frontend:**
```bash
npm install
```

**Backend:**
```bash
cd server
npm install
cd ..
```

### 2. Start Services

Open two separate terminals:

**Terminal 1 - Backend Server:**
```bash
cd server
npm start
```

**Terminal 2 - Frontend Application:**
```bash
npm start
```

## 🌐 Access Points

- **Landing Page**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **Admin Dashboard**: Click 🔐 Admin button on landing page

## 👨‍💼 Admin Dashboard Access

1. Visit http://localhost:3000
2. Click the 🔐 Admin button (bottom right)
3. Create a new account:
   - Username: `admin` (or any username)
   - Password: Must contain:
     - 12+ characters
     - Uppercase letters (A-Z)
     - Lowercase letters (a-z)
     - Numbers (0-9)
     - Special characters (!@#$%^&*)
   - Example: `SecurePass123!` or `Admin@Campaign2024`
4. Login and manage campaign data

## 📊 Admin Dashboard Features

- **📈 Overview**: View analytics and statistics
- **👥 Visitor Data**: Browse all collected visitor information
- **📝 Audit Logs**: See all admin actions and access history
- **📥 Export Data**: Download data as JSON
- **🗑️ Delete Records**: Remove visitor data (GDPR compliant)
- **🔍 Search**: Filter visitors by session ID or IP

## 🔐 Features

### Landing Page
- Modern responsive design with countdown timer
- Festive Black Friday theme
- Product highlights and featured deals
- Clear call-to-action buttons
- Mobile-optimized

### Privacy & Consent
- Privacy notice with full transparency
- Explicit user consent required
- Location permission with opt-out
- GDPR-compliant data handling

### Data Collection
- Device type & browser info
- IP address tracking
- GPS location (with permission)
- Session timestamps
- Unique visitor IDs

### Admin Security
- JWT authentication
- Strong password requirements
- Complete audit logging
- Access control
- Data encryption

## 🛠️ Troubleshooting

### Port Already in Use
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Mac/Linux
lsof -i :5000
kill -9 <PID>
```

### Clear Database
```bash
# Delete database to reset
rm server/app.db
```

### Clear Browser Cache
Open DevTools (F12) → Application → localStorage → Clear All

### Verify Backend is Running
```bash
curl http://localhost:5000/api/health
```

## 📁 Project Structure

```
├── server/              # Node.js Express backend
│   ├── index.js         # Server entry point
│   ├── package.json     # Backend dependencies
│   ├── database/        # SQLite setup
│   ├── middleware/      # Auth & logging
│   └── routes/          # API endpoints
│
├── src/                 # React frontend
│   ├── pages/           # Page components
│   ├── components/      # Reusable components
│   ├── services/        # API integration
│   ├── utils/           # Helper functions
│   ├── App.js           # Main component
│   └── index.js         # Entry point
│
└── SETUP_GUIDE.md       # Full documentation
```

## 🔑 Important Notes

### Development vs Production
- Change `JWT_SECRET` in production
- Use HTTPS in production
- Update CORS origins
- Enable rate limiting
- Regular security updates

### Database
- Uses SQLite (better-sqlite3)
- File: `server/app.db`
- Automatically created on first run
- Contains: admins, visitor_data, consent_tracking, audit_logs

### API Base URL
- Frontend: `http://localhost:3000`
- Backend: `http://localhost:5000`
- API: `http://localhost:5000/api`

## 📞 Support

For issues or detailed setup instructions, see `SETUP_GUIDE.md`

---

**Happy Campaigning! 🎉**
