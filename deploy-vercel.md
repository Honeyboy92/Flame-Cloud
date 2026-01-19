# Vercel Deployment Instructions

## Quick Deploy to Vercel (Backup Solution)

1. Go to https://vercel.com
2. Sign in with GitHub
3. Import project: https://github.com/Honeyboy92/Flame-Cloud
4. Configure:
   - Framework: Create React App
   - Build Command: `cd client && npm run build`
   - Output Directory: `client/build`
   - Install Command: `cd client && npm install`

5. Deploy!

## Environment Variables (if needed)
- No environment variables needed for frontend-only deployment
- Supabase credentials are hardcoded in client

## Domain Setup
- Add custom domain: flamecloud.site
- Configure DNS records as provided by Vercel