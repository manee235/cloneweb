# Black Friday Campaign - Full Stack React Application

This is a comprehensive promotional landing page with:
- Modern responsive design with festive Black Friday theme
- Privacy-first data collection with explicit user consent
- Location tracking with permission requests
- Secure admin dashboard with authentication
- Complete audit logging and data analytics

## Project Structure

```
├── public/                          # Static files
├── server/                          # Node.js/Express backend
│   ├── index.js                     # Main server file
│   ├── package.json                 # Backend dependencies
│   ├── .env                         # Environment variables
│   ├── database/
│   │   └── init.js                  # Database initialization
│   ├── middleware/
│   │   ├── auth.js                  # JWT authentication
│   │   └── auditLog.js              # Audit logging
│   └── routes/
│       ├── auth.js                  # Login/Register routes
│       ├── data.js                  # Data collection routes
│       └── admin.js                 # Admin dashboard routes
├── src/
│   ├── pages/
│   │   ├── LandingPage.js           # Main promotional landing page
│   │   ├── AdminLogin.js            # Admin authentication
│   │   └── AdminDashboard.js        # Admin dashboard
│   ├── components/
│   │   ├── CountdownTimer.js        # Countdown timer component
│   │   ├── PrivacyNotice.js         # Privacy notice modal
│   │   └── LocationConsent.js       # Location permission modal
│   ├── services/
│   │   └── api.js                   # API calls and services
│   ├── utils/
│   │   └── helpers.js               # Utility functions
│   ├── App.js                       # Main app component
│   ├── App.css                      # App styles
│   └── index.js                     # React entry point
└── README.md                        # This file
```

## Features

### Landing Page
- 🎨 Modern, responsive design optimized for all devices
- ⏰ Real-time countdown timer showing offer expiration
- 🛍️ Product highlights and featured deals
- 📱 Mobile-first approach
- 🎯 Clear call-to-action buttons

### Privacy & Consent
- 📋 Comprehensive privacy notice before data collection
- 🔒 Explicit user consent for all data collection
- 📍 Location permission request with opt-out option
- 🔐 Privacy-compliant data handling

### Data Collection
- 📊 Device type and browser information
- 🌐 IP address tracking
- 📍 GPS location (only with permission)
- ⏱️ Visit timestamp and session tracking
- 🔑 Unique session IDs

### Admin Dashboard
- 🔐 Secure login with strong password requirements
- 📈 Analytics overview and statistics
- 👥 Visitor data browser with pagination
- 📝 Complete audit logs
- 💾 Data export functionality
- 🗑️ GDPR-compliant data deletion
- 🔍 Search and filtering capabilities

### Security Features
- ✅ JWT-based authentication
- 🔒 Password strength validation (12+ chars, mixed case, numbers, special chars)
- 📋 Comprehensive audit logging
- 🛡️ CORS protection
- 🔐 Encrypted data storage
- 📊 Access control and permissions

## Installation & Setup

### Prerequisites
- Node.js (v14+)
- npm or yarn

### Backend Setup

1. Navigate to the server directory:
```bash
cd server
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file (already included):
```
PORT=5000
NODE_ENV=development
REACT_APP_URL=http://localhost:3000
JWT_SECRET=your-super-secret-key-change-in-production-2024
```

4. Start the backend server:
```bash
npm start
```

For development with auto-reload:
```bash
npm run dev
```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. In the root directory, install dependencies:
```bash
npm install
```

2. Create a `.env` file (already included):
```
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_ENV=development
```

3. Start the React development server:
```bash
npm start
```

The frontend will run on `http://localhost:3000`

## Usage

### Landing Page
1. Visit `http://localhost:3000`
2. You'll see the privacy notice - read and accept to continue
3. You'll be asked for location permission (optional)
4. Data will be collected and stored securely
5. Click "SHOP NOW" to redirect to AliExpress

### Admin Dashboard

1. **Access Admin**: Click the 🔐 Admin button (bottom-right of landing page)
2. **Create Account**: Click "Create New Account" to register
   - Username: any username
   - Password: Must contain 12+ characters, uppercase, lowercase, numbers, and special characters
   - Example: `Admin@Password123!`
3. **Login**: Use your credentials to access the dashboard
4. **View Analytics**: Overview tab shows visitor statistics
5. **Browse Visitors**: View all collected visitor data with filtering
6. **Audit Logs**: See all admin actions and data access
7. **Export Data**: Download all collected data as JSON
8. **Delete Visitors**: Remove specific visitor records

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new admin
- `POST /api/auth/login` - Admin login

### Data Collection
- `POST /api/data/collect` - Collect visitor data
- `GET /api/data/ip-info` - Get IP information

### Admin (Protected Routes)
- `GET /api/admin/visitor-data` - Get all visitor data (paginated)
- `GET /api/admin/visitor/:sessionId` - Get visitor detail
- `GET /api/admin/analytics` - Get analytics overview
- `GET /api/admin/audit-logs` - Get audit logs (paginated)
- `POST /api/admin/export` - Export all data
- `DELETE /api/admin/visitor/:sessionId` - Delete visitor data

## Privacy & GDPR Compliance

This application follows privacy best practices:
- ✅ Explicit user consent required before data collection
- ✅ Clear privacy notices explaining data usage
- ✅ Option to opt-out of location tracking
- ✅ User data deletion functionality
- ✅ Complete audit logs for transparency
- ✅ No third-party data sharing
- ✅ Secure data encryption and storage
- ✅ Timestamp tracking for compliance

## Password Requirements

For admin accounts, passwords must include:
- Minimum 12 characters
- At least one uppercase letter (A-Z)
- At least one lowercase letter (a-z)
- At least one number (0-9)
- At least one special character (!@#$%^&*)

Example strong passwords:
- `SecurePass123!`
- `MyPassword@2024`
- `Admin#Pass123`

## Database

The application uses SQLite (better-sqlite3) for data storage.

### Tables:
1. **admins** - Admin user accounts and passwords
2. **visitor_data** - Collected visitor information
3. **consent_tracking** - User consent records
4. **audit_logs** - All admin actions and access

Data is stored in `server/app.db`

## Development

### Running Both Servers Simultaneously

You can use npm-run-all or simply open two terminals:

**Terminal 1 (Backend):**
```bash
cd server
npm run dev
```

**Terminal 2 (Frontend):**
```bash
npm start
```

### Making Changes
- Frontend changes auto-reload (React hot reload)
- Backend changes require manual restart with nodemon

## Security Considerations

**Production Checklist:**
- [ ] Change JWT_SECRET to a strong, random value
- [ ] Use HTTPS instead of HTTP
- [ ] Set proper CORS origins
- [ ] Use environment-specific configurations
- [ ] Enable database encryption
- [ ] Implement rate limiting
- [ ] Set up proper logging and monitoring
- [ ] Regular security audits
- [ ] Update dependencies regularly

## Troubleshooting

### Port Already in Use
```bash
# Find and kill process on port 5000 (backend)
lsof -i :5000
kill -9 <PID>

# Find and kill process on port 3000 (frontend)
lsof -i :3000
kill -9 <PID>
```

### CORS Errors
- Ensure backend is running on `http://localhost:5000`
- Check `.env` files in both frontend and backend
- Verify API_URL in frontend matches backend URL

### Database Errors
- Delete `server/app.db` to reset database
- Server will recreate tables on next start

### Authentication Errors
- Clear localStorage: Open DevTools → Application → localStorage → Clear all
- Re-login to create new session

## License

This project is provided as-is for promotional campaigns.

## Support

For issues or questions, please contact the development team.

---

**Created**: 2024
**Last Updated**: June 10, 2024
