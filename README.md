# Pick-Up Games — Organizer

A simple web app for organizing pick-up sports games. No login required.

- **Organizers** create a game (sport, date, venue, fee, max players) and get two links: one to share with players, one to manage the game and verify payments.
- **Players** open the shareable link, enter their name and GCash reference number, and submit.
- **Organizers** see all players and can toggle each payment between **Pending** and **Verified**.

## Tech stack

- **Next.js 14** (App Router) — frontend + API routes
- **Prisma** — ORM
- **PostgreSQL** — database (required for local and Vercel)

## Setup (local)

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create a PostgreSQL database (e.g. [Neon](https://neon.tech) free tier, or [Vercel Postgres](https://vercel.com/storage/postgres)). Copy `.env.example` to `.env` and set `DATABASE_URL` to your Postgres connection string.

3. Run migrations:
   ```bash
   npx prisma migrate deploy
   ```

4. Run the app:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000).

## Deploy to Vercel

1. Push your code to GitHub (you already have a repo).

2. In [Vercel](https://vercel.com), **Add New Project** → Import your GitHub repo.

3. Add a database:
   - In the project, go to **Storage** → **Create Database** → **Postgres** (Vercel Postgres).
   - Connect it to the project; Vercel will add `POSTGRES_URL` (or `DATABASE_URL`) to Environment Variables.

4. Ensure `DATABASE_URL` is set for the build (Prisma needs it):
   - If Vercel added `POSTGRES_URL` when you connected Postgres, add **Environment Variable** `DATABASE_URL` with the **same value** as `POSTGRES_URL` (the full connection string from the Storage tab).
   - Otherwise set `DATABASE_URL` to your Postgres connection string (include `?sslmode=require`).

5. **Deploy**: Trigger a deploy (or redeploy). Vercel will run `prisma generate`, `prisma migrate deploy`, and `next build`. After deploy, open your app URL and test (create a game, share link, join, manage).

**If the build fails with "Environment variable not found: DATABASE_URL"** → Go to the project in Vercel → **Settings** → **Environment Variables** → add `DATABASE_URL` with your Postgres connection string (copy from **Storage** → your Postgres DB → **Connect** tab), then **Redeploy**.

## Testing with others

**Option 1: Same WiFi (quick)**  
On your machine run:
```bash
npm run dev:lan
```
Then find your computer’s IP (e.g. System Settings → Network, or `ipconfig getifaddr en0` on Mac). Testers on the same WiFi open `http://YOUR_IP:3000` (e.g. `http://192.168.1.5:3000`). Share the **player link** from that base URL so joins work (e.g. `http://192.168.1.5:3000/game/abc123`).

**Option 2: Public URL (no deploy)**  
Use a tunnel so anyone can reach your local app:
- **[ngrok](https://ngrok.com)** — `ngrok http 3000` then share the HTTPS URL.
- **[Cloudflare Tunnel](https://developers.cloudflare.com/cloudflare-one/connections/connect-apps)** — free, no signup required for quick tunnels.

Testers use the tunnel URL as the site; player and manage links will use that URL.

**Option 3: Deploy (best for real testing)**  
See **Deploy to Vercel** above. Everyone uses the deployed URL; no tunnel or same network needed.

## Scripts

- `npm run dev` — start dev server (localhost only)
- `npm run dev:lan` — dev server reachable on your LAN (same WiFi)
- `npm run build` — build for production
- `npm run start` — start production server
- `npm run db:migrate` — run Prisma migrations
- `npm run db:studio` — open Prisma Studio to inspect the database

## Flow

1. **Create game** — Home page → fill form → Create game. You get a **player link** (share this) and a **manage link** (keep private).
2. **Join game** — Players open the player link, enter name + GCash reference, submit.
3. **Manage game** — Open the manage link to see all players and toggle payment status (Pending ↔ Verified).
