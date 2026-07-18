# InstantSounds

**Live Demo:** [instant.blazenxt.in](https://instant.blazenxt.in)  
**GitHub:** https://github.com/blazenxt/InstantSounds

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