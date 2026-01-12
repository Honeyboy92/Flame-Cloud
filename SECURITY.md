# Security Notice

## Before Deploying

⚠️ **IMPORTANT: Change these before going live!**

1. **JWT_SECRET** - Use a strong random string (32+ characters)
2. **ADMIN_EMAIL** - Use your own email
3. **ADMIN_PASSWORD** - Use a strong password (12+ characters, mix of letters, numbers, symbols)

## Environment Variables

Never commit `.env` file to GitHub. It's already in `.gitignore`.

Set these on your hosting platform (Railway/Render):

```
NODE_ENV=production
JWT_SECRET=<your-strong-secret>
ADMIN_EMAIL=<your-email>
ADMIN_PASSWORD=<your-strong-password>
```

## Generate Strong JWT Secret

Use this command to generate a secure secret:

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

## Database

The SQLite database (`server/*.db`) is also ignored from git. Each deployment will start fresh.

## Reporting Security Issues

If you find a security vulnerability, please report it privately.
