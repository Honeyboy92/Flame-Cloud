# 🔥 Flame Cloud - Quick Start Guide

## 30 Second Setup

### 1. Install Dependencies
```bash
npm install && cd client && npm install && cd ..
```

### 2. Terminal 1 - Start Backend
```bash
npm run server
```
✅ Backend running on `http://localhost:5000`

### 3. Terminal 2 - Start Frontend
```bash
cd client && npm start
```
✅ Frontend running on `http://localhost:3000`

---

## 🔐 Login Credentials

**Admin Account:**
- Email: `flamecloud@gmail.com`
- Password: `GSFY!25V$`

**Create New Account:**
- Go to Signup page and create a user account

---

## 📍 What You Can Do

### As a Regular User
- ✅ View hosting plans
- ✅ Browse features
- ✅ Read about page
- ✅ Chat with support
- ✅ Create support tickets
- ✅ Manage profile

### As Admin
- ✅ Login with admin credentials
- ✅ Access admin panel
- ✅ Manage server locations
- ✅ Edit hosting plans
- ✅ View support tickets
- ✅ Manage support messages

---

## 🗄️ Database

- **Type**: SQLite (local)
- **File**: `server/daimond.db`
- **Auto-created** on first run
- **9 UAE hosting plans** pre-loaded
- **Admin account** auto-created

---

## 🎨 Website Features

- 🔥 Fire theme with animations
- 📱 Fully responsive design
- 🎮 9 hosting plans (Bronze to Amethyst)
- 💬 Support chat system
- 🎫 Support tickets
- 👥 YouTube partners showcase
- ⚙️ Admin panel
- 🔐 User authentication

---

## 🚨 Troubleshooting

### Port Already in Use
```bash
# Change port in server/index.js or kill process
# Backend: PORT=5001 npm run server
# Frontend: PORT=3001 npm start
```

### Database Issues
```bash
# Delete old database and restart
rm server/daimond.db
npm run server
```

### Dependencies Missing
```bash
# Reinstall everything
rm -rf node_modules client/node_modules
npm install && cd client && npm install && cd ..
```

---

## 📚 File Structure

```
server/
  ├── index.js              # Main server
  ├── database.js           # SQLite setup
  └── routes/               # API endpoints

client/
  ├── src/
  │   ├── pages/            # All pages
  │   ├── components/       # Layout
  │   ├── context/          # Auth
  │   └── styles.css        # Styling
  └── package.json
```

---

## 🔗 Important URLs

- Frontend: `http://localhost:3000`
- Backend: `http://localhost:5000`
- API: `http://localhost:5000/api`

---

## ✅ Everything Ready!

Your Flame Cloud website is now running locally with:
- ✅ No Supabase
- ✅ No Vercel
- ✅ No external dependencies
- ✅ Pure local SQLite database
- ✅ Full functionality

**Enjoy! 🔥**
