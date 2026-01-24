# Flame Cloud - Local Setup Complete ✅

## Current Status
The website has been fully restored to work with **local SQLite database** and **local API** (no Supabase/Vercel).

## How to Run

### 1. Install Dependencies
```bash
npm install
cd client && npm install
cd ..
```

### 2. Start Backend (Port 5000)
```bash
npm run server
```

### 3. Start Frontend (Port 3000) - In a new terminal
```bash
cd client
npm start
```

## Admin Credentials
- **Email**: `flamecloud@gmail.com`
- **Password**: `GSFY!25V$`

## Database
- **Type**: SQLite (local)
- **File**: `server/daimond.db` (auto-created on first run)
- **Plans**: 9 UAE hosting plans (Bronze to Amethyst)
- **Locations**: UAE enabled, France/Singapore disabled

## Features Working
✅ User Authentication (Login/Signup)
✅ Dashboard with hero section
✅ Paid Plans display
✅ YT Partners page
✅ About page
✅ Features page
✅ Chat system (local)
✅ Admin Panel (for admin users)
✅ Responsive design with fire theme

## Key Files Modified
- `client/src/context/AuthContext.js` - Removed Supabase, using local API
- `client/src/components/Layout.js` - Simplified, removed Supabase chat
- `server/database.js` - SQLite setup with all tables
- `server/routes/auth.js` - Local authentication

## API Endpoints
- `POST /api/auth/signup` - Create account
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user
- `GET /api/plans` - Get hosting plans
- `GET /api/about` - Get about content
- `GET /api/admin/locations` - Get location settings
- `GET /api/chat` - Get chat messages

## Notes
- Database is auto-initialized on first server start
- Admin account is created automatically
- All data is stored locally in SQLite
- No external services required
