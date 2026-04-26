

# 🎬 MOVIEFINDER

### A cinematic full-stack movie & series discovery platform

[![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=nextdotjs)](https://nextjs.org)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green?logo=mongodb)](https://mongodb.com)
[![Docker](https://img.shields.io/badge/Docker-ready-blue?logo=docker)](https://docker.com)
[![TMDB](https://img.shields.io/badge/Data-TMDB-01b4e4?logo=themoviedb)](https://themoviedb.org)

</div>

---

## ✨ Features

| Feature | Details |
|---------|---------|
| 🎥 Cinematic Hero | Ken Burns effect, parallax, dominant colour extraction |
| 🔥 Trending Rows | Real-time trending movies & series from TMDB |
| 🐐 GOAT Section | All-time greatest movies, series & anime |
| 🎯 Personalised | Recommendations based on your favourite genres |
| 🎬 Trailers | YouTube autoplay via global trailer modal |
| ❤️ Watchlist | Save titles — synced to MongoDB when logged in |
| 🔍 Search | Instant search across movies & series |
| 🔒 Auth | JWT email/password, rate limited, secure cookies |
| 📧 Email | Welcome & password reset emails via Gmail SMTP |
| ⚙️ Admin | Hidden admin panel at `/admin` |
| 🐳 Docker | Production-ready Dockerfile + docker-compose |
| 🗺️ SEO | Sitemap, robots.txt, JSON-LD schema, Open Graph |
| 📜 Legal | Privacy, Terms, DMCA, Cookie consent |

---

## 🚀 Quick Start

### Local Development
```bash
# 1. Install dependencies
npm install

# 2. Configure environment
cp .env.local .env.local.example
# Edit .env.local with your keys

# 3. Run dev server
npm run dev
```

### Docker (Production)
```bash
# 1. Create .env file with all variables
# 2. Build and start
docker-compose up -d

# View logs
docker-compose logs -f app
```

---

## ⚙️ Environment Variables

```env
TMDB_API_KEY=                    # themoviedb.org/settings/api
NEXT_PUBLIC_TMDB_IMAGE=https://image.tmdb.org/t/p
MONGODB_URI=                     # MongoDB Atlas connection string
JWT_SECRET=                      # Min 32 chars random string
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=moviefinderforyou@gmail.com
EMAIL_PASS=                      # Gmail App Password
EMAIL_FROM="Movie Finder <moviefinderforyou@gmail.com>"
NEXT_PUBLIC_APP_URL=https://moviefinderforyou.com
```

---

## 🏗️ Architecture

```
movie-finder/
├── components/          # UI components
│   ├── Navbar.jsx       # Animated navbar with Framer Motion
│   ├── MovieCard.jsx    # Poster card with hover preview
│   ├── BentoGrid.jsx    # Magic bento editorial layout
│   ├── SectionRow.jsx   # Netflix-style horizontal scroll row
│   ├── TopCarousel.jsx  # Ranked top picks carousel
│   ├── HeroSlider.jsx   # Cinematic hero with YouTube embed
│   ├── TrailerModal.jsx # Global trailer player
│   ├── AuthWidget.jsx   # Login/signup/forgot password modal
│   ├── CookieBanner.jsx # GDPR cookie consent
│   ├── SEOMeta.jsx      # SEO + JSON-LD schema
│   └── SkeletonCard.jsx # Loading skeleton
├── pages/               # Next.js pages
│   ├── index.js         # Homepage
│   ├── movies/[id].jsx  # Movie detail
│   ├── series/[id].jsx  # Series detail
│   ├── search.js        # Search results
│   ├── my-list/         # Saved titles
│   ├── profile/         # User profile + genre preferences
│   ├── admin/           # Hidden admin panel
│   ├── privacy.js       # Privacy Policy
│   ├── terms.js         # Terms of Service
│   ├── dmca.js          # DMCA Policy
│   ├── about.js         # About + TMDB attribution
│   └── api/             # Backend API routes
├── lib/
│   ├── mongodb.js       # Mongoose connection
│   ├── auth.js          # JWT utilities
│   ├── tmdb.js          # TMDB API client
│   ├── mailer.js        # Nodemailer email sender
│   └── rateLimit.js     # Auth rate limiter
├── models/
│   └── User.js          # User schema (wishlist, prefs, history)
├── hooks/
│   └── useLenis.js      # Smooth scroll
├── Dockerfile           # Multi-stage production build
├── docker-compose.yml   # App + MongoDB + Nginx
└── nginx.conf           # Reverse proxy config
```

---

## 🐳 Docker Commands

```bash
# Build image
docker build -t moviefinder .

# Start all services
docker-compose up -d

# Stop all
docker-compose down

# View app logs
docker-compose logs -f app

# Restart app only
docker-compose restart app
```

---

## ⚙️ Admin Panel

Access at `/admin` — not linked from any public page.

To grant admin access, set `isAdmin: true` on a user document in MongoDB Atlas.

Features:
- User management (view, delete, promote)
- Stats overview
- Recent signups

---

## 📜 Legal

This product uses the TMDB API but is not endorsed or certified by TMDB.
All movie data, images and metadata © their respective rights holders.
This app is a discovery tool only — no content is hosted or distributed.

---

<div align="center">
Built with ❤️ · Data by <a href="https://www.themoviedb.org">TMDB</a>
</div>

# 🎬 Movie Finder — Full-Stack Next.js App

A cinematic dark-themed movie & series discovery app.

## Tech Stack
- **Next.js 14** (Pages Router)
- **Tailwind CSS** — Dark Netflix-style UI
- **MongoDB + Mongoose** — Database
- **JWT Auth** — Email/password (HTTP-only cookie)
- **TMDB API** — Movie & series data

## Setup

### 1. Install dependencies
```bash
npm install
```

### 2. Configure environment variables
Edit `.env.local`:
```env
TMDB_API_KEY=your_tmdb_key_here
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/moviefinder
JWT_SECRET=your_long_random_secret_here_min_32_chars
NEXT_PUBLIC_TMDB_IMAGE=https://image.tmdb.org/t/p
```

### 3. Run development server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Features
- 🎬 Home with Hero slider + Netflix-style genre rows
- 🔍 Global search (movies + series)
- 🎥 Trailer autoplay via YouTube embed
- ❤️ Wishlist (saved to MongoDB for logged-in users, localStorage for guests)
- 👤 User profile with genre preferences
- 🔒 JWT authentication (email/password)
- ⚙️ Hidden admin panel at `/admin`

## Admin Panel
Access at `/admin`. To grant admin access, set `isAdmin: true` on a user in MongoDB.

## API Routes
| Route | Method | Description |
|-------|--------|-------------|
| `/api/auth/register` | POST | Create account |
| `/api/auth/login` | POST | Sign in |
| `/api/auth/logout` | POST | Sign out |
| `/api/auth/me` | GET | Get current user |
| `/api/user/list` | GET/POST/DELETE | Wishlist |
| `/api/user/preferences` | GET/POST | Genre preferences |
| `/api/media/[type]/[id]` | GET | Movie/TV details |
| `/api/search` | GET | Search TMDB |
| `/api/admin/stats` | GET | Admin stats (admin only) |

made with ❤️