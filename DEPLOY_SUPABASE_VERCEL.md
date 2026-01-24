Overview

This guide shows how to prepare and deploy Flame Cloud frontend to Vercel and the backend to run with a Supabase Postgres database (or host backend on Vercel serverless). It also explains how to push the repo to GitHub.

1) Create Supabase project
- Go to https://app.supabase.com and create a new project.
- Note the `DATABASE_URL` (connection string) from the project settings (or get it from the Supabase dashboard under Settings → Database).
- Open the SQL editor in Supabase and run `supabase/init.sql` (copy-paste the file contents or upload) to create the schema and seed default data.

2) Configure the backend to use Supabase Postgres
- In your project, ensure `server/database-postgres.js` is used by setting `DATABASE_URL` in environment.
- Set environment variables (locally or in hosting):
  - `DATABASE_URL` → your Supabase Postgres connection string
  - `JWT_SECRET` → a secure random string for JWT signing
  - (optional) `ADMIN_EMAIL`, `ADMIN_PASSWORD` to override the default created admin on server init

3) Running backend locally with Supabase DB
- Install dependencies and start server:

```bash
npm install
# from repo root
npm run server
```

- The server will connect to the Supabase Postgres DB (via `DATABASE_URL`) and execute any initialization in `server/database-postgres.js` (this will create default admin if none exists).

4) Deploy backend
Option A — Host Node backend on Vercel (recommended if you want a single provider):
- Push repo to GitHub.
- In Vercel, import the GitHub repo, set `DATABASE_URL`, `JWT_SECRET` and other env vars in the Vercel project settings.
- Ensure `package.json` `start`/`server` scripts are correct (this repo has `server` -> `node server/index.js`).
- Vercel will build and you can use serverless functions or a Node server depending on plan.

Option B — Keep DB in Supabase and host backend separately:
- Host your Node server on Railway, Render, Heroku or a VPS. Point `DATABASE_URL` to the Supabase connection string.

Option C — Supabase Edge Functions:
- If you prefer serverless functions close to Supabase, you can port API endpoints to Supabase Edge Functions (TypeScript). This requires rewriting Express routes to the Supabase functions model.

5) Deploy frontend to Vercel
- In the `client` directory this is a CRA app. Create a new GitHub repo and push the full project (root includes `client/` and `server/`).
- In Vercel, import the repo and set the Root Directory to `/client` for the frontend project.
- Set environment variable `REACT_APP_API_URL` if you want to call a specific API host; otherwise client/package.json uses proxy during dev. For production set the API base as `https://your-backend.example.com/api`.

6) Post-deploy checks
- Visit the frontend URL and ensure Sign Up / Login work (the backend must be reachable). If you used Supabase Auth separately you may want to adapt the app to use Supabase Auth instead of the built-in users table.

7) Pushing to GitHub
- Create a GitHub repo and push the project from your machine:

```bash
git init
git add .
git commit -m "Initial Flame Cloud export"
# Create repo on GitHub then
git remote add origin git@github.com:YOURNAME/REPO.git
git push -u origin main
```

Notes and Recommendations
- Authentication: this repo currently manages its own `users` table and password hashing. For production you can either keep this or migrate to Supabase Auth (recommended for security and convenience). If migrating to Supabase Auth, remove password fields from `users` and store only a link to the Supabase `auth.users` record.
- Avatars: currently saved as base64 text in the `avatar` field. Consider storing avatars in Supabase Storage and storing URLs in the DB for better performance.
- Real-time chat: Supabase offers Realtime (based on Postgres replication) which can replace polling. You can listen to `chat_messages` changes via Supabase Realtime for a live chat experience.

If you want I can:
- Add a `supabase/init.sql` file (already created) and double-check it for your Supabase project.
- Add `README` steps to automate DB migration and show how to set env vars in Vercel.
- Prepare a GitHub-friendly commit message and push instructions or create a GitHub Actions workflow for auto-deploy.

Which of the above next steps do you want me to implement now? (I can add README updates, create a small script to generate the admin bcrypt hash and insert into Supabase, or add a `.vercelignore`/`vercel.json`.)