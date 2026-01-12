# 🔥 Flame Cloud

Professional Minecraft Hosting Platform by Honey_boy1

## Features

- 🎮 Premium Minecraft Server Hosting Plans
- 👤 User Authentication System
- 🎫 Ticket/Order System with Payment Screenshots
- 💬 Live Chat Support
- ⚙️ Admin Panel with Full Control
- 🌙 Modern Dark Theme UI

## Tech Stack

- **Frontend:** React.js
- **Backend:** Node.js + Express
- **Database:** SQLite (sql.js)
- **Auth:** JWT

## Local Development

```bash
# Install dependencies
npm run install-all

# Run development (both frontend & backend)
npm run dev

# Or run separately:
npm run server  # Backend on port 5000
npm run client  # Frontend on port 3000
```

## Production Deployment

### Option 1: Railway (Recommended)

1. Push code to GitHub
2. Go to [railway.app](https://railway.app)
3. Create new project → Deploy from GitHub
4. Add environment variables:
   - `NODE_ENV=production`
   - `JWT_SECRET=your-secret-key`
   - `ADMIN_EMAIL=your-admin-email`
   - `ADMIN_PASSWORD=your-admin-password`
5. Deploy!

### Option 2: Render

1. Push code to GitHub
2. Go to [render.com](https://render.com)
3. Create new Web Service → Connect GitHub repo
4. Build Command: `npm install && cd client && npm install && npm run build`
5. Start Command: `npm start`
6. Add environment variables
7. Deploy!

### Option 3: VPS (DigitalOcean, Linode, etc.)

```bash
# Clone repo
git clone <your-repo-url>
cd flame-cloud

# Install dependencies
npm run install-all

# Build frontend
npm run build

# Set environment variables
export NODE_ENV=production
export JWT_SECRET=your-secret-key
export ADMIN_EMAIL=your-admin-email
export ADMIN_PASSWORD=your-admin-password

# Run with PM2
npm install -g pm2
pm2 start server/index.js --name flame-cloud
```

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NODE_ENV` | Environment mode (`production` for live) | Yes |
| `PORT` | Server port | No (default: 5000) |
| `JWT_SECRET` | JWT signing key (use strong random string) | Yes |
| `ADMIN_EMAIL` | Admin login email | Yes |
| `ADMIN_PASSWORD` | Admin login password | Yes |

## Admin Access

⚠️ **Set your own admin credentials using environment variables before deploying!**

Default development credentials (change in production):
- Email: Set via `ADMIN_EMAIL` env variable
- Password: Set via `ADMIN_PASSWORD` env variable

## Author

Created by **Honey_boy1**

### Team
- **Owners:** Rameez_xD
- **Managers:** TGK, Newest_YT
