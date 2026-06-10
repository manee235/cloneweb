# 🛠️ Developer Commands Cheatsheet

## 🚀 Initial Setup

```bash
# Windows - Automatic setup
setup.bat

# Mac/Linux - Automatic setup
chmod +x setup.sh && ./setup.sh

# Manual install - Frontend
npm install

# Manual install - Backend
cd server && npm install && cd ..
```

## 🏃 Running the Application

### Start Everything (Two Terminals)

**Terminal 1 - Backend Server**
```bash
cd server
npm start                  # Production mode
npm run dev              # Development with auto-reload
```

**Terminal 2 - Frontend App**
```bash
npm start                # Development server with hot reload
npm run build            # Production build
```

### Development URLs
- Frontend: http://localhost:3000
- Backend: http://localhost:5000
- Backend API: http://localhost:5000/api

## 🧪 Testing & Debugging

### Check if servers are running
```bash
# Frontend
curl http://localhost:3000

# Backend Health Check
curl http://localhost:5000/api/health
```

### View Browser Console
```bash
# Open Developer Tools
F12                      # Windows/Linux
Cmd + Option + I         # Mac
```

### View Network Requests
F12 → Network Tab → Watch requests

### Check Database
```bash
# Database is at:
server/app.db            # SQLite file

# To reset database (delete it):
rm server/app.db         # Mac/Linux
del server\app.db        # Windows
# Server recreates tables on next start
```

## 🧹 Cleanup & Reset

### Clear Frontend Cache
```bash
# Delete node_modules
rm -rf node_modules      # Mac/Linux
rmdir /s node_modules    # Windows

# Reinstall
npm install
```

### Clear Backend Cache
```bash
cd server
rm -rf node_modules      # Mac/Linux
rmdir /s node_modules    # Windows
npm install
cd ..
```

### Clear Browser Storage
```bash
# Open DevTools (F12)
# Application Tab → Storage → Clear site data
# Or: localStorage.clear() in console
```

### Reset Everything
```bash
# Windows
setup.bat

# Mac/Linux
./setup.sh

# Or manually:
rm -rf node_modules server/node_modules
npm install
cd server && npm install && cd ..
```

## 🐛 Debugging

### Backend Errors
```bash
# Check if port is in use
netstat -ano | findstr :5000      # Windows
lsof -i :5000                     # Mac/Linux

# Kill process on port 5000
taskkill /PID <PID> /F            # Windows
kill -9 <PID>                     # Mac/Linux
```

### Frontend Errors
```bash
# Open console (F12) and look for errors
# Check React DevTools extension
# Look for warnings in terminal
```

### Database Errors
```bash
# Check database exists
ls -la server/app.db              # Mac/Linux
dir server\app.db                 # Windows

# Verify database integrity (Terminal 1 - backend running):
curl http://localhost:5000/api/health
```

### API Issues
```bash
# Test backend API directly
curl http://localhost:5000/api/health

# Test data collection
curl -X POST http://localhost:5000/api/data/collect \
  -H "Content-Type: application/json" \
  -d '{"sessionId":"test","deviceType":"Desktop"}'

# Test with sample request:
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "username": "admin",
  "password": "SecurePass123!"
}
```

## 📝 Common Tasks

### Add New Admin User (via API)
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "newadmin",
    "password": "SecurePass123!"
  }'
```

### Export All Data
```bash
# Via Dashboard: Click Export button
# Or via API: GET /api/admin/export (requires token)
```

### Delete Visitor Record
```bash
# Via Dashboard: View visitor, click Delete
# Or via API: DELETE /api/admin/visitor/:sessionId
```

### View Audit Logs
```bash
# Via Dashboard: Click "Audit Logs" tab
# Check: All admin actions, IPs, timestamps
```

## 🔍 File Locations

### Important Files
```
Frontend Config:
  .env                    # Frontend environment
  src/App.js             # Main component
  src/pages/LandingPage.js

Backend Config:
  server/.env            # Backend environment
  server/index.js        # Server entry
  server/database/init.js

Database:
  server/app.db          # SQLite database

Documentation:
  QUICK_START.md         # Quick start
  SETUP_GUIDE.md         # Full setup
  FINAL_README.md        # Complete overview
```

## 📊 Environment Variables

### Frontend (.env)
```
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_ENV=development
```

### Backend (server/.env)
```
PORT=5000
NODE_ENV=development
REACT_APP_URL=http://localhost:3000
JWT_SECRET=your-secret-key
```

## 🔐 Admin Credentials

### Create Test Admin
Username: `testadmin`
Password: `TestPass123!` (meets requirements)

### Password Requirements
- ✅ 12+ characters
- ✅ Uppercase letter (A-Z)
- ✅ Lowercase letter (a-z)
- ✅ Number (0-9)
- ✅ Special character (!@#$%^&*)

## 🌐 API Endpoints Reference

### Auth
```
POST /api/auth/register
POST /api/auth/login
```

### Data
```
POST /api/data/collect
GET /api/data/ip-info
```

### Admin (Protected - need JWT token)
```
GET /api/admin/visitor-data
GET /api/admin/visitor/:sessionId
GET /api/admin/analytics
GET /api/admin/audit-logs
POST /api/admin/export
DELETE /api/admin/visitor/:sessionId
```

## 📱 Testing on Different Devices

### Mobile Testing (Browser Dev Tools)
```
F12 → Device Toolbar → Select Device
- iPhone 12
- Pixel 5
- iPad
- Custom dimensions
```

### Test Geolocation
```javascript
// In console:
navigator.geolocation.getCurrentPosition(
  (pos) => console.log(pos.coords),
  (err) => console.log(err)
)
```

### Test Responsive Design
Resize browser window or use device toolbar

## 🎯 Performance Tips

### Speed up startup
```bash
# Use npm ci instead of npm install (faster)
npm ci

# Or in backend
cd server && npm ci && cd ..
```

### Monitor performance
```bash
# Frontend Performance (DevTools):
F12 → Lighthouse tab

# Backend monitoring:
Add console.time/console.timeEnd
```

## 🔧 Useful VS Code Extensions

```
Recommended:
- ES7+ React/Redux/React-Native snippets
- Prettier - Code formatter
- SQLite3 Editor
- Thunder Client (or REST Client)
- npm Intellisense
```

## 💾 Backup & Version Control

### Create backup
```bash
# Backup database
cp server/app.db server/app.db.backup

# Or zip the whole project
zip -r campaign-backup.zip .
```

### Git workflow
```bash
git add .
git commit -m "Feature: Add new feature"
git push origin main
```

## 🆘 Emergency Fixes

### If nothing works
```bash
# Complete reset
rm -rf node_modules server/node_modules    # Mac/Linux
rmdir /s node_modules server\node_modules  # Windows
rm -rf server/app.db                       # Delete DB
npm install                                # Reinstall
cd server && npm install && cd ..          # Backend
npm start                                  # Restart
```

### Kill all Node processes
```bash
# Mac/Linux
killall node

# Windows
taskkill /F /IM node.exe

# Check if killed
ps aux | grep node              # Mac/Linux
tasklist | findstr node.exe     # Windows
```

## 📞 Getting Help

### Check logs
```bash
# Frontend: Open browser console (F12)
# Backend: Check terminal output

# Save logs to file:
npm start > frontend.log 2>&1    # Mac/Linux
```

### Common error messages
```
EADDRINUSE      - Port already in use (find & kill process)
ENOENT          - File not found (check paths)
401 Unauthorized - Missing/invalid JWT token
CORS error      - Check API URLs in .env
```

---

**Last Updated**: 2024-06-10  
**Version**: 1.0.0
