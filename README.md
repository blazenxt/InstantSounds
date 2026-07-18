# InstantSounds

**Live Demo:** [instant.blazenxt.in](https://instant.blazenxt.in)  
**GitHub:** https://github.com/blazenxt/InstantSounds

> Powered by **auto-scraper** — automatically fetches new sounds from Myinstants every 6 hours.

A beautiful, fully functional clone of **Myinstants.com** — the largest instant sound buttons website.

Built with Next.js 16 + TypeScript + Tailwind.

---

## Features

- ✅ **Instant sound playback** (30+ meme sounds)
- ✅ **Country filters** (All / US / India)
- ✅ **Trending section**
- ✅ **Search + Sort** (Most Popular / Newest)
- ✅ **Upload modal** (add your own sounds)
- ✅ **Favorites modal**
- ✅ **Sound detail pages** (`/instant/[slug]`)
- ✅ **Share / Copy link** functionality
- ✅ **Fully responsive** (mobile friendly)
- ✅ **Production ready** for Vercel

---

## Tech Stack

- **Next.js 16** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **Lucide Icons**
- **Sonner** (toast notifications)

---

## Run Locally

```bash
git clone https://github.com/blazenxt/InstantSounds.git
cd InstantSounds
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Deploy to Vercel (Recommended)

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click **New Project**
4. Import `blazenxt/InstantSounds`
5. Vercel will automatically detect Next.js
6. Click **Deploy**

Your site will be live instantly.

**Custom Domain:** Connect `instant.blazenxt.in`

---

## Deploy to Railway (Alternative)

Railway is great for running background tasks (like the scraper).

### Steps:

1. Go to [railway.app](https://railway.app) and sign in with GitHub
2. Click **New Project** → **Deploy from GitHub repo**
3. Select `blazenxt/InstantSounds`
4. Railway will auto-detect Next.js
5. Click **Deploy**

### Optional: Add Environment Variables (if using Supabase later)

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

Your project will be live at a Railway domain (e.g. `instantsounds-production.up.railway.app`).

**Pro Tip**: Railway is excellent if you want to run the scraper in the background.

---

## Project Structure

```
app/
├── instant/[slug]/page.tsx   # Sound detail page
├── layout.tsx
├── page.tsx                  # Homepage
├── globals.css
vercel.json
```

---

## Status

- ✅ Fully working demo
- ✅ Production build successful
- ✅ Ready for Vercel deployment

---

**Built by BlazeNXT** • Clone of Myinstants.com