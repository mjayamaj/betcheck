# BetCheck 🛡️

> **Tagline**: *Know what betting is really costing you.*

BetCheck is a personal accountability and financial-awareness web application built for people who want to reduce or stop sports betting. It does **not** help people bet — it helps them see how much betting is really costing them and equips them with tools to regain control of their finances and habits.

---

## 💎 Design Philosophy & Core Principles

- **Finance + Wellness + Personal Development**: Built with the care of a wellness tracker and the rigor of personal finance software.
- **Strict Non-Sportsbook Language**: Never mimics a bookmaker. Zero odds, zero match predictions, zero affiliate bonuses.
- **Clean Dark Aesthetic**: Deep slate and obsidian backgrounds with calming emerald tones for recovery milestones and focused amber alerts for boundaries.
- **Psychological Grounding**: Highlights cognitive traps like **Loss Chasing** and translates cold numbers into tangible life goals (Rent, Work Laptops, Tuition, Emergency Funds).

---

## 🚀 Key Features

1. **High-Impact Landing Page**: Explains the product, tagline, and features an interactive opportunity cost preview.
2. **Comprehensive Financial Dashboard**:
   - Total Deposited, Total Withdrawn, Total Staked, Total Won, Net Loss.
   - Betting days count.
   - Average weekly & monthly loss.
   - Cumulative net loss curve and platform breakdown charts.
3. **Bet/Loss Logger (CRUD)**:
   - Record stake, outcome (Win, Loss, Cashout), payout, platform, bet type, and optional emotional trigger (*Boredom, Entertainment, Pressure, Trying to make quick money, Trying to recover losses, Friends influenced me, Habit*).
4. **Chasing-Losses Detector**:
   - Pattern recognition that flags escalating stakes after losses:
   - *"⚠️ You may be chasing your losses — your last 3 sessions grew larger after losses."*
   - Purely informational with empathetic cognitive guidance.
5. **Bet-Free Streak & Savings Counter**:
   - Live counter of days clean: *"🔥 14 DAYS BET-FREE — you've kept ₦35,000 away from betting this month."*
   - Milestone celebration with gentle, non-casino particle effects.
6. **Personal Spending Limits**:
   - Daily, weekly, and monthly self-imposed guardrails.
   - When reached: *"⚠️ You've reached your personal limit for this period. Consider taking a break."*
   - Strictly non-bypassable.
7. **What-If Opportunity Cost Calculator**:
   - Evaluates any lost sum against real-world life assets (Apartment rent, M3 MacBooks, Emergency savings, Business capital, Tuition).
   - Shows 5-year compounding returns at 12% annual growth.
8. **Weekly Reality Check**:
   - Auto-generated weekly accountability report with 12-month projected losses and reflection journaling.
9. **Zero-Friction Dual Storage (Local Guest + Supabase Cloud)**:
   - Works immediately 100% offline via localStorage.
   - Ready for live Supabase Auth & PostgreSQL with Row Level Security (RLS).
10. **Installable Progressive Web App (PWA)**:
    - Web App Manifest (`manifest.webmanifest`), offline service worker, and icons for Android / iOS "Add to Home Screen".

---

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite
- **Styling**: Tailwind CSS, PostCSS, Autoprefixer
- **Database & Auth**: Supabase (`@supabase/supabase-js`) with PostgreSQL & Row-Level Security
- **Icons**: Lucide React
- **Celebrations & Motion**: Canvas Confetti, Framer Motion
- **PWA**: `vite-plugin-pwa`

---

## ⚡ Getting Started Locally

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 3. Production Build
```bash
npm run build
```

---

## 🗄️ Supabase Setup (Optional Cloud Sync)

1. Create a project at [supabase.com](https://supabase.com).
2. Open the **SQL Editor** in Supabase and execute the script in `supabase/schema.sql`.
3. Copy your project URL and anon public key into a `.env` file:
   ```env
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key-here
   ```
4. BetCheck will automatically switch from Local Guest mode to cloud authenticated mode with full RLS data privacy!

---

## 📱 PWA & Android Installation

1. Open BetCheck in Google Chrome or mobile browser.
2. Tap the browser menu (or the install prompt) and select **"Add to Home Screen"**.
3. BetCheck will install as a standalone native-feeling application with its custom protective shield icon.

---

## 🚢 Deployment to Vercel

1. Push this repository to GitHub.
2. Import the repo in [Vercel](https://vercel.com).
3. Framework Preset: **Vite**.
4. (Optional) Add your `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` under Environment Variables.
5. Click **Deploy**.
