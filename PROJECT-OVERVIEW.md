# 🔥 FLAME CLOUD - COMPLETE PROJECT OVERVIEW

## PROJECT SUMMARY
Flame Cloud is a **Professional Minecraft Server Hosting Platform** built with React.js (frontend) and Node.js/Express (backend), using SQLite for local development. It features user authentication, hosting plans management, admin panel, support chat, and ticket system.

---

## 📋 WHAT'S IN THE WEBSITE

### 🎨 FRONTEND (React.js)

#### 10 Pages
1. **Dashboard** - Hero section with stats, quick actions, feature highlights
2. **Login** - User authentication with email/password
3. **Signup** - User registration
4. **Paid Plans** - 9 UAE hosting plans (Bronze to Black Ruby) with purchase flow
5. **Features** - 11 feature cards showcasing hosting capabilities
6. **About** - Company story, team hierarchy (Founder, Owner, Management)
7. **YT Partners** - YouTube partners showcase
8. **Chat** - Real-time chat system (users ↔ admin)
9. **Admin Panel** - Manage locations and hosting plans
10. **Tickets** - Support ticket system

#### Components
- **Layout** - Navigation bar with logo, menu, user profile, floating buttons
- **AuthContext** - Global authentication state management

#### Styling
- Fire-themed dark UI with red/orange/yellow gradients
- Animated fire background
- Glass-morphism effects
- Responsive design
- Smooth animations

---

### ⚙️ BACKEND (Express.js)

#### 8 API Route Groups

**Authentication** (`/api/auth`)
- Signup, Login, Get Profile, Update Email/Password/Username/Avatar

**Plans** (`/api/plans`)
- Get paid/free plans, Get locations, Claim free plan, Get YT partners

**Admin** (`/api/admin`)
- Manage users, plans, tickets, locations, YT partners, about content, settings

**Chat** (`/api/chat`)
- Get messages, Send message, Get users, Get unread count

**Tickets** (`/api/tickets`)
- Get user tickets, Create ticket

**About** (`/api/about`)
- Get/Update about content

**Locations** (`/api/locations`)
- Get location settings

**YT Partners** (`/api/yt-partners`)
- Get partners and enabled status

---

### 🗄️ DATABASE (SQLite)

#### 8 Tables

**users** - User accounts with authentication
- id, username, email, password (hashed), avatar, isAdmin, createdAt

**paid_plans** - 9 hosting plans
- Bronze (2GB), Silver (4GB), Gold (8GB), Platinum (10GB), Emerald (12GB), Amethyst (14GB), Diamond (16GB), Ruby (32GB), Black Ruby (34GB)

**free_plans** - Free hosting options

**tickets** - Support tickets
- Subject, message, screenshot, status, admin response

**chat_messages** - Real-time chat
- Sender, receiver, message, read status

**location_settings** - Server locations
- UAE (enabled), France (disabled), Singapore (disabled)

**yt_partners** - YouTube partners showcase

**site_settings** - Global settings

**about_content** - About page content with team info

---

## 🔐 AUTHENTICATION SYSTEM

1. **Registration** → Password hashed with bcryptjs → Stored in DB
2. **Login** → Credentials verified → JWT token generated (7-day expiry)
3. **Token Storage** → localStorage (user object + token)
4. **Protected Routes** → JWT verification middleware
5. **Admin Check** → isAdmin flag verification
6. **Session Persistence** → Auto-restore from localStorage

---

## ✨ KEY FEATURES

### User Features
✅ Register and login with JWT authentication
✅ View 9 premium hosting plans with specs
✅ Browse features and about page
✅ YouTube partners showcase
✅ Real-time chat with admin
✅ Create and track support tickets
✅ Update profile (username, email, password, avatar)
✅ Responsive dark-themed UI

### Admin Features
✅ Admin login with special credentials
✅ Manage hosting plans (Create, Read, Update, Delete)
✅ Manage free plans
✅ Toggle location availability
✅ View all users and delete users
✅ Manage support tickets and respond
✅ Manage YouTube partners
✅ Update about content and team info
✅ Manage site settings

### Technical Features
✅ JWT-based authentication (7-day expiry)
✅ Password hashing with bcryptjs
✅ CORS enabled
✅ SQLite database with auto-initialization
✅ Responsive design (mobile, tablet, desktop)
✅ Fire-themed dark UI with animations
✅ Real-time chat system
✅ Support ticket tracking
✅ Admin panel with full control

---

## 📁 PROJECT STRUCTURE

```
flame-cloud/
├── server/
│   ├── index.js                    # Express server (port 5000)
│   ├── database.js                 # SQLite setup & initialization
│   ├── middleware/auth.js          # JWT & admin middleware
│   └── routes/
│       ├── auth.js                 # Authentication
│       ├── plans.js                # Hosting plans
│       ├── admin.js                # Admin management
│       ├── chat.js                 # Chat system
│       ├── tickets.js              # Support tickets
│       ├── about.js                # About content
│       ├── locations.js            # Location settings
│       └── yt-partners.js          # YouTube partners
├── client/
│   ├── src/
│   │   ├── App.js                  # Main app with routing
│   │   ├── index.js                # React entry point
│   │   ├── styles.css              # Fire-themed styles (4600+ lines)
│   │   ├── context/AuthContext.js  # Auth state management
│   │   ├── components/Layout.js    # Main navigation layout
│   │   └── pages/
│   │       ├── Dashboard.js        # Home page
│   │       ├── Login.js            # Login
│   │       ├── Signup.js           # Registration
│   │       ├── PaidPlans.js        # Hosting plans
│   │       ├── Features.js         # Features showcase
│   │       ├── About.js            # About page
│   │       ├── YTPartners.js       # YouTube partners
│   │       ├── Chat.js             # Chat system
│   │       ├── AdminPanel.js       # Admin dashboard
│   │       └── Tickets.js          # Support tickets
│   ├── public/
│   │   ├── index.html              # HTML entry
│   │   ├── logo.png                # Flame Cloud logo
│   │   └── [flag & icon images]
│   └── package.json
├── package.json                    # Root dependencies
└── .env.example                    # Environment template
```

---

## 🚀 HOW TO RUN

### Prerequisites
- Node.js >= 18.0.0
- npm

### Installation
```bash
npm install
cd client && npm install
cd ..
```

### Start Backend (Terminal 1)
```bash
npm run server
```
✅ Runs on http://localhost:5000

### Start Frontend (Terminal 2)
```bash
cd client
npm start
```
✅ Runs on http://localhost:3000

### Access Website
Open: **http://localhost:3000** 🔥

---

## 🔑 DEFAULT CREDENTIALS

**Admin Account:**
- Email: `flamecloud@gmail.com`
- Password: `GSFY!25V$`

**Create New Account:**
- Go to Signup page and register

---

## 🛠️ TECH STACK

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, React Router 6 |
| Backend | Node.js, Express.js |
| Database | SQLite (local), PostgreSQL (production) |
| Authentication | JWT, bcryptjs |
| Styling | CSS3 with animations |
| Deployment | Railway, Render, Heroku, VPS |

---

## 📊 HOSTING PLANS (9 Total - UAE Only)

| Plan | RAM | CPU | Storage | Price |
|------|-----|-----|---------|-------|
| Bronze | 2GB | 100% | 10GB SSD | 200 PKR |
| Silver | 4GB | 150% | 20GB SSD | 400 PKR |
| Gold | 8GB | 250% | 30GB SSD | 600 PKR |
| Platinum | 10GB | 300% | 40GB SSD | 800 PKR |
| Emerald | 12GB | 350% | 50GB SSD | 1200 PKR |
| Amethyst | 14GB | 400% | 60GB SSD | 3600 PKR |
| Diamond | 16GB | 500% | 80GB SSD | 1600 PKR |
| Ruby | 32GB | 1000% | 100GB SSD | 3200 PKR |
| Black Ruby | 34GB | 2000% | 200GB SSD | 3400 PKR |

---

## 🎨 DESIGN THEME

**Color Palette:**
- 🔴 Fire Red: #FF2E00
- 🟠 Fire Orange: #FF6A00
- 🟡 Fire Yellow: #FFD000
- ⚫ Dark Black: #050505

**UI Style:**
- Dark background with fire gradients
- Glass-morphism cards with glow borders
- Smooth hover animations
- Fire particle effects
- Responsive design

---

## 📱 RESPONSIVE DESIGN

✅ Mobile (320px+)
✅ Tablet (768px+)
✅ Desktop (1024px+)
✅ Large screens (1400px+)

---

## 🔒 SECURITY FEATURES

✅ Passwords hashed with bcryptjs
✅ JWT token authentication (7-day expiry)
✅ CORS configured for localhost
✅ Input validation on all endpoints
✅ Admin middleware for protected routes
✅ No sensitive data in frontend

---

## 📈 CURRENT STATE

✅ **Fully Functional** - All features working locally
✅ **No External Dependencies** - No Supabase/Vercel
✅ **Local Database** - SQLite with auto-initialization
✅ **Admin Account** - Auto-created on first run
✅ **9 Hosting Plans** - Pre-loaded with UAE location
✅ **Responsive Design** - Works on all devices
✅ **Production Ready** - Can be deployed

---

## 🚢 DEPLOYMENT OPTIONS

1. **Railway** - Recommended (easiest)
2. **Render** - Good alternative
3. **Heroku** - Classic option
4. **VPS** - Full control (DigitalOcean, Linode, etc.)

All require setting environment variables for production.

---

## 📝 ENVIRONMENT VARIABLES

```
NODE_ENV=production              # Environment mode
PORT=5000                        # Server port
JWT_SECRET=your-secret-key       # JWT signing key (MUST CHANGE)
ADMIN_EMAIL=admin@example.com    # Admin login email (MUST CHANGE)
ADMIN_PASSWORD=strong-password   # Admin login password (MUST CHANGE)
```

---

## 🎯 SUMMARY

Flame Cloud is a **complete, production-ready Minecraft hosting platform** with:

✅ Modern React frontend with fire-themed dark UI
✅ Express.js backend with RESTful API
✅ SQLite database with auto-initialization
✅ JWT authentication system
✅ Admin panel for full control
✅ Support chat and ticket system
✅ 9 hosting plans with location management
✅ Responsive design for all devices
✅ Zero external dependencies (local setup)
✅ Ready for deployment

**The website is fully functional and ready to use!** 🔥

---

## 📞 SUPPORT

For issues or questions:
- Check the QUICK-START.md for quick setup
- Review code comments in files
- Check browser console for errors
- Verify both servers are running (port 5000 & 3000)

---

*Project Status: ✅ COMPLETE AND READY TO USE*
