# Production Deployment Guide — Ashrut Tiwari Portfolio

This guide walks you step-by-step through publishing your full-stack portfolio online using **GitHub**, **Vercel**, and **Supabase**.

---

## Architecture Overview

```
                      +-----------------------------+
                      |   Vercel Edge Network       |
                      |   Next.js 15 App Router     |
                      |   (SSR, Server Actions, UI) |
                      +--------------+--------------+
                                     |
              +----------------------+----------------------+
              |                                             |
              v                                             v
+---------------------------+                 +---------------------------+
|    Supabase Cloud         |                 |    Resend Email API       |
|    - PostgreSQL           |                 |    - Transactional Inbound|
|    - Row Level Security   |                 |    - Client Notification  |
|    - Storage Buckets      |                 +---------------------------+
+---------------------------+
```

---

## Step 1: Create Your Supabase Project (Database)

1. Navigate to [supabase.com](https://supabase.com) and sign in (or create a free account).
2. Click **New Project**:
   - **Name**: `ashrut-portfolio`
   - **Database Password**: Choose a strong password and save it safely.
   - **Region**: Select a region close to your target audience (e.g., South Asia / Singapore or East US).
3. Once the database is provisioned (takes ~1-2 minutes):
   - Go to the **SQL Editor** tab in the left sidebar.
   - Click **New query**.
   - Copy the entire SQL content from [`supabase/migrations/20261017000000_init_portfolio_schema.sql`](file:///c:/Users/Lenovo/OneDrive/Desktop/WEBSITE_AI/supabase/migrations/20261017000000_init_portfolio_schema.sql).
   - Paste it into the query box and click **Run**.
   - You should see "Success. No rows returned" — this created your `projects`, `skills`, `profile_settings`, `achievements`, and `contact_inquiries` tables, alongside the Row Level Security (RLS) policies.

4. Retrieve your API Keys:
   - In Supabase, go to **Project Settings** (gear icon) -> **API**.
   - Note down:
     - **Project URL**
     - **anon / public key**
     - **service_role key** (keep this secret!)

---

## Step 2: Push to GitHub

1. Open your terminal or use GitHub Desktop.
2. Initialize and commit if not already done:
   ```bash
   git add .
   git commit -m "Production release for Ashrut Tiwari portfolio"
   ```
3. Go to [github.com](https://github.com) and click **New Repository**:
   - Repository name: `ashrut-portfolio`
   - Set it to **Private** or **Public**.
   - Do NOT check "Initialize with README" (we already have one).
4. Link your local repo and push:
   ```bash
   git remote add origin https://github.com/YOUR_GITHUB_USERNAME/ashrut-portfolio.git
   git branch -M main
   git push -u origin main
   ```

---

## Step 3: Deploy to Vercel

1. Go to [vercel.com](https://vercel.com) and log in with your GitHub account.
2. Click **Add New...** -> **Project**.
3. Locate `ashrut-portfolio` from your GitHub repository list and click **Import**.
4. In the **Configure Project** screen:
   - Framework Preset: `Next.js`
   - Root Directory: `./`
5. Expand the **Environment Variables** section and add the following keys:

| Name | Value | Purpose |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | `https://your-project.vercel.app` | Canonical site URL |
| `NEXT_PUBLIC_SUPABASE_URL` | `https://xxxxxxxx.supabase.co` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJhbG...` | Supabase public key |
| `SUPABASE_SERVICE_ROLE_KEY` | `eyJhbG...` | Supabase admin key (private) |
| `ADMIN_SECRET_KEY` | Choose a strong custom secret | Protects `/admin` access |
| `RESEND_API_KEY` | `re_...` (optional) | Enables direct email delivery |
| `CONTACT_FROM_EMAIL` | `onboarding@resend.dev` (or verified domain) | Sending address |
| `CONTACT_TO_EMAIL` | `ashrut.tiwari.work@gmail.com` | Where client inquiries go |

6. Click **Deploy**. Vercel will install dependencies, build the Next.js bundle, and launch your site live across global edge servers!

---

## Step 4: Configure Custom Domain (Optional)

1. In Vercel, navigate to **Project Settings** -> **Domains**.
2. Enter your custom domain (e.g., `ashrut.dev` or `ashruttiwari.com`).
3. Follow the DNS instructions (add the CNAME or A record in your domain registrar such as Namecheap, GoDaddy, or Cloudflare).
4. Vercel automatically generates an SSL/TLS HTTPS certificate for you.

---

## Step 5: Verification Checklist

- [ ] Visit the live production URL.
- [ ] Confirm floating orbs, icons, and windows appear with the pastel retro aesthetic.
- [ ] Test the Pixel Runner mini-game (verify sound toggle, jump, and speed levels).
- [ ] Test project search and category filters.
- [ ] Test the CV download button and printable view.
- [ ] Submit a test inquiry via the contact form and verify receipt.
- [ ] Log in to `/admin` using your `ADMIN_SECRET_KEY` and verify CRUD functionality.
