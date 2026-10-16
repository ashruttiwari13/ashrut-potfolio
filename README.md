# 👾 Ashrut Tiwari — Full-Stack Portfolio Web Application

A production-ready full-stack portfolio built for **Ashrut Tiwari** (Game Developer, 3D Artist, Character Designer & Cinematographer). Designed with a playful retro pastel desktop aesthetic featuring floating orbs, draggable/layerable windows, an interactive canvas pixel runner game, database-backed project gallery, contact system with spam protection, and a protected administrator dashboard.

---

## 🌟 Features

- **Retro Pastel Desktop OS**:
  - Pastel cream, peach, mint, pink, and lavender visual design system.
  - Interactive draggable, layerable, and minimizable windows with retro drop shadows.
  - Floating ambient animated orbs and subtle pixel grid.
  - Desktop icon dock with keyboard navigation & responsive touch drawer for mobile.
  - Taskbar with live clock, status pill, window reset, and minimize all controls.

- **Interactive Canvas Pixel Runner Game**:
  - Re-engineered 60fps HTML5 canvas mini-game with clean animation frame loop lifecycle (zero loop accumulation).
  - Web Audio API synthesizer for jump, coin collection, gold stars, shield activation, and game-over sounds.
  - Progressive difficulty scaling, local high-score persistence via `localStorage`, and multiple speed settings (Slow, Medium, Fast).
  - On-screen touch buttons for mobile and arrow / WASD / Spacebar keyboard controls.

- **Dynamic Projects Gallery**:
  - Interactive search bar filtering across titles, taglines, descriptions, and technologies.
  - Category filters: Games, 3D Art, Character Design, Cinematography.
  - Quick-inspect modal dialog + standalone dedicated project detail pages (`/projects/[slug]`).
  - Real links to interactive demos, GitHub source code, and video showcases.

- **Curriculum Vitae / Resume Panel**:
  - Clean printable resume sheet styled for browser print (`window.print()`).
  - Genuine PDF download serving `/resume-ashrut-tiwari.pdf`.
  - Detailed experience timeline and core competencies breakdown.

- **Full-Stack Contact & Commission Delivery**:
  - Zod server-side validation with required field checks and length limits.
  - In-memory rate limiting and spam protection.
  - Dual integration: logs inquiries securely to Supabase PostgreSQL and dispatches email notifications via Resend API.
  - Graceful fallback for local development when API keys are pending.

- **Protected Administrator Dashboard (`/admin`)**:
  - Secure session-gated admin portal.
  - Full CRUD for projects (create, edit, reorder, toggle featured, publish/draft, delete).
  - Skills manager to add and remove tools and proficiencies.
  - Profile & Bio editor (update headline, bio, contact email, social handles, resume path).
  - Inquiries inbox to review client leads, toggle read status, and manage incoming commissions.
  - System infrastructure health check tab.

- **PostgreSQL Database & Security**:
  - Supabase PostgreSQL schema with versioned SQL migrations (`supabase/migrations/`).
  - Strict Row Level Security (RLS) policies: Public can read published projects and skills; inquiries are private to authenticated admins only.

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| **Framework** | Next.js 15 (App Router, Server Components, Server Actions) |
| **Language** | TypeScript (Strict mode enabled) |
| **Styling** | Tailwind CSS + Custom retro desktop design tokens |
| **Icons** | Lucide React |
| **Validation** | Zod (Client & Server-side schema validation) |
| **Database** | Supabase (PostgreSQL with Row Level Security) |
| **Email Delivery** | Resend API |
| **Effects** | Canvas Confetti, Web Audio API Oscillator |
| **Deployment** | Vercel (Frontend & Serverless Functions), Supabase (Database) |

---

## 🚀 Quick Start (Local Development)

### 1. Prerequisites
- **Node.js**: v18.18+ or v20+ (tested on Node v24)
- **Package Manager**: npm

### 2. Installation
Dependencies are already configured. If setting up on a new machine:
```bash
npm install
```

### 3. Environment Configuration
Copy the template environment file:
```bash
cp .env.example .env.local
```
Inside `.env.local`:
```env
NEXT_PUBLIC_SITE_URL=http://localhost:3000
ADMIN_SECRET_KEY=ashrut-admin-local-2026
```
*(Leave Supabase and Resend keys blank initially to run in seamless local fallback mode, or add your keys from your Supabase / Resend dashboard).*

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Access Administrator Dashboard
Navigate to [http://localhost:3000/admin](http://localhost:3000/admin) or click the **Admin** shield icon on the desktop dock.
- Default local passcode: `ashrut-admin-local-2026` (configured in `.env.local`).

---

## 🗄️ Database Setup (Supabase)

When you are ready to link a live remote Supabase PostgreSQL database:

1. Create a free project at [supabase.com](https://supabase.com).
2. Go to the **SQL Editor** in your Supabase dashboard.
3. Open the file `supabase/migrations/20261017000000_init_portfolio_schema.sql` in this repository.
4. Copy its entire content, paste it into the Supabase SQL Editor, and click **RUN**.
5. Go to **Project Settings -> API** in Supabase:
   - Copy **Project URL** into `NEXT_PUBLIC_SUPABASE_URL`
   - Copy **anon / public key** into `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - Copy **service_role key** into `SUPABASE_SERVICE_ROLE_KEY`
6. Restart your Next.js server (`npm run dev`). Your portfolio will now seamlessly synchronize with your live cloud database!

---

## 📧 Email Notifications Setup (Resend)

To receive real-time emails when clients submit inquiries:
1. Create a free account at [resend.com](https://resend.com).
2. Generate an API Key under **API Keys**.
3. In `.env.local`, set:
   ```env
   RESEND_API_KEY=re_your_api_key_here
   CONTACT_FROM_EMAIL=onboarding@resend.dev
   CONTACT_TO_EMAIL=ashrut.tiwari.work@gmail.com
   ```
4. In production, verify your custom domain in Resend (e.g. `inquiries@ashrut.dev`) for white-label delivery.

---

## 🧪 Testing & Verification

- **Type Checking**:
  ```bash
  npm run typecheck
  ```
- **Production Build**:
  ```bash
  npm run build
  ```
- **Production Preview**:
  ```bash
  npm run start
  ```

---

## 📦 Public Deployment (Vercel)

1. Push this repository to your GitHub account:
   ```bash
   git add .
   git commit -m "Complete full-stack portfolio release"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/ashrut-portfolio.git
   git push -u origin main
   ```
2. Log in to [vercel.com](https://vercel.com) and click **Add New Project**.
3. Import the `ashrut-portfolio` repository.
4. Add the environment variables from your `.env.local` into Vercel's Environment Variables settings.
5. Click **Deploy**. Vercel will build and assign you a global production URL (e.g., `https://ashrut-portfolio.vercel.app`).
