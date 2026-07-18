# InstantSounds - Project Plan

**Project Name:** InstantSounds  
**Subdomain:** instant.blazenxt.in  
**Tagline:** "The largest instant sound buttons website"

**Original Site:** https://www.myinstants.com/en/index/us/  
**Goal:** Create a fully functional clone of Myinstants.com — the largest instant sound buttons / meme soundboard website.

---

## 1. Project Overview & Important Details

### Core Concept
A simple, fast, browser-based soundboard where users can:
- Play thousands of short meme sounds instantly with one click.
- Discover trending, popular, and categorized sounds.
- Upload their own sounds.
- Favorite, share, and copy links to sounds.
- Search for sounds easily.

### Target Audience
- Gamers, streamers, TikTok/YouTube creators, meme enthusiasts.
- Users in India (IN index) and global (US, DE, etc. versions).

### Key Features (Priority)
1. **Instant Sound Playback** — Clickable big buttons that play audio immediately.
2. **Sound Grid** — Responsive masonry/grid layout (similar to the original).
3. **Actions per Sound**:
   - ❤️ Heart icon → Add to favorites.
   - 🔗 Link icon → Copy shareable link.
   - 📤 Share icon → Social sharing (Twitter, WhatsApp, etc.).
4. **Search Bar** — Real-time search.
5. **Categories / Country Index** — US, IN, DE, Trending, Popular, etc.
6. **User Authentication** — Login/Signup (required for upload + favorites).
7. **Upload Sound** — Upload MP3/WAV, add name, tags.
8. **Favorites Dashboard** — Personal list of saved sounds.
9. **Sound Detail Page** — Individual page for each sound with metadata.
10. **Responsive Design** — Works perfectly on mobile, tablet, desktop.

### Tech Stack
- **Frontend:** Next.js 15 (App Router) + TypeScript + Tailwind CSS
- **Backend:** Next.js API Routes
- **Database & Auth:** Supabase (PostgreSQL + Auth + Storage)
- **Audio Storage:** Supabase Storage
- **Deployment:** Vercel
- **Icons:** lucide-react

---

## 2. Current Status (Updated)

**Project Location:** `/home/user/instant-blazenxt`

**Phase 0 Completed** ✅ — Next.js project initialized.

**Next:** Starting **Phase 1: Static Foundation & Core UI**

---

## 3. Folder Structure

```
instant-blazenxt/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   ├── globals.css
│   └── ...
├── components/
├── lib/
├── public/
└── ...
```

---

## Next Steps

I'll now begin building the homepage with:
- Navbar (with branding for `instant.blazenxt.in`)
- Hero section
- Sound grid with playable buttons
- Fake data with popular meme sounds

Ready to proceed?