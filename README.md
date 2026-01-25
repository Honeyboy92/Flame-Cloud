# 🔥 Flame Cloud

Professional Minecraft Hosting Platform by Honey_boy1

## ✨ Features

- 🎮 **Premium Minecraft Server Hosting Plans** - Tiered plans with RAM, CPU, and Storage variants.
- 🌍 **Multi-Location Support** - Global server locations with availability control.
- 👤 **User Profile System** - Customizable profiles with avatars and activity tracking.
- 🎫 **Support Tickets** - Integrated ticketing system for orders and technical help.
- 💬 **Live Chat** - Real-time "Flame Cloud Team" chat with modern list-style UI.
- ⚙️ **Power Admin Panel** - Full CRUD for plans, users, partners, and locations.
- 📸 **Image Upload** - Direct image upload for YT Partners logos (Base64).
- 🌙 **Next-Gen UI** - High-premium dark theme with smooth gradients and animations.

## 🛠️ Tech Stack

- **Frontend:** React.js (Hooks, Context API)
- **Backend:** Node.js + Express (with local API shim)
- **Database:** Supabase (PostgreSQL) / local SQLite proxy
- **Auth:** JWT (Local) / Supabase Auth

## 🚀 Deployment Guide

### 1. Database Setup (Supabase)

1. Create a new project at [supabase.com](https://supabase.com).
2. Go to the **SQL Editor** in your Supabase dashboard.
3. Copy the contents of [`supabase_setup.sql`](./supabase_setup.sql) and run it.
4. Go to **Project Settings → API** to get your `SUPABASE_URL` and `SUPABASE_ANON_KEY`.

### 2. Frontend Deployment (Vercel)

1. Push your code to GitHub.
2. Link your repo to [Vercel](https://vercel.com).
3. In Vercel, connect your domain: **flamecloud.site**.
4. Set the following environment variables in Vercel:
   - `REACT_APP_SUPABASE_URL`: Your Supabase URL
   - `REACT_APP_SUPABASE_ANON_KEY`: Your Supabase Anon Key
5. Deployment will be automatic!

> [!IMPORTANT]
> In your Supabase Dashboard (Authentication → URL Configuration), ensure the **Site URL** is set to `https://flamecloud.site` (with the `https://`).

### 3. Backend Deployment (Optional)

If you wish to use the advanced Node.js features (like the API shim), deploy the `server/` folder to **Railway** or **Render**:
1. Set `DATABASE_URL` (if using Postgres).
2. Set `JWT_SECRET`, `ADMIN_EMAIL`, and `ADMIN_PASSWORD`.

## 🛠️ Environment Variables

| Variable | Description |
|----------|-------------|
| `REACT_APP_SUPABASE_URL` | Your Supabase Project URL |
| `REACT_APP_SUPABASE_ANON_KEY` | Your Supabase Public API Key |
| `JWT_SECRET` | Secret key for local JWT auth |
| `ADMIN_EMAIL` | Default admin email |
| `ADMIN_PASSWORD` | Default admin password |

## 👥 Authors & Team

Created by **Honey_boy1**

- **Founder:** Rameez_xD
- **Owner:** TGKFLEX
- **Management:** !Pie LEGEND
