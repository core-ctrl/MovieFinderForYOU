# MovieFinder — Architecture Overview

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT BROWSER                          │
│                                                                  │
│  ┌──────────────┐   ┌──────────────┐   ┌──────────────────────┐│
│  │  Next.js UI  │   │ Redux Store  │   │   Lenis + Framer     ││
│  │  (Pages +    │◄──┤  auth slice  │   │   Motion (Smooth     ││
│  │  Components) │   │  watchlist   │   │   scroll + anims)    ││
│  └──────┬───────┘   │  ui slice    │   └──────────────────────┘│
│         │           └──────────────┘                            │
└─────────┼───────────────────────────────────────────────────────┘
          │ HTTP / cookie
          ▼
┌─────────────────────────────────────────────────────────────────┐
│                      NEXT.JS API ROUTES                         │
│                                                                  │
│  /api/auth/*        /api/user/*       /api/admin/*              │
│  /api/media/*       /api/search       /api/trending             │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │                    MIDDLEWARE LAYER                       │   │
│  │  requireAuth.js  │  validate.js (Zod)  │  rateLimit.js   │   │
│  └──────────────────────────────────────────────────────────┘   │
│                           │                                      │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │                   SERVICE LAYER                           │   │
│  │  authService.js  │  watchlistService.js                  │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────┬──────────────────────────────┬───────────────────────┘
          │                              │
          ▼                              ▼
┌─────────────────────┐      ┌─────────────────────────────────┐
│   MONGODB ATLAS     │      │         TMDB API                │
│                     │      │                                  │
│  Users collection   │      │  ┌──────────────────────────┐   │
│  - wishlist         │      │  │   In-Memory Cache (LRU)   │   │
│  - watchHistory     │      │  │   trending: 5min TTL      │   │
│  - preferredGenres  │      │  │   details:  30min TTL     │   │
│  - resetToken       │      │  │   default:  15min TTL     │   │
│                     │      │  │   max 500 entries         │   │
└─────────────────────┘      │  └──────────────────────────┘   │
                             └─────────────────────────────────┘

## Auth Flow

  User ──POST /api/auth/login──► rateLimit ──► Zod validate
                                      │
                              authService.loginUser()
                                      │
                              bcrypt.compare()
                                      │
                              signToken() → JWT
                                      │
                         Set-Cookie: token (httpOnly)
                                      │
                         ◄── { user } JSON response
                                      │
                         Redux: loginUser.fulfilled
                         Redux: fetchWatchlist()


## Request Flow (authenticated)

  Component dispatch(action)
       │
  Redux thunk → axios.get/post
       │
  API Route → requireAuth(req) → verifyToken(cookie)
       │
  Service layer → connectDB() → Mongoose query
       │
  Response → Redux state update → Component re-render


## Admin Security Flow

  /admin page load
       │
  GET /api/auth/me → check isAdmin: true
       │
  ─── NOT ADMIN ──► Show AdminLogin form
       │
  POST /api/auth/login → service → bcrypt
       │
  JWT issued → check isAdmin again
       │
  ─── IS ADMIN ──► Full admin panel


## Infrastructure

  Local Dev:
    npm run dev ──► Next.js webpack dev server (port 3000)
    MongoDB: Atlas (cloud) or local docker

  Docker:
    docker-compose up ──► App + MongoDB + Nginx
    Nginx: reverse proxy → app:3000

  Kubernetes:
    2 replicas minimum
    HPA: auto-scale 2-10 pods at 70% CPU
    Ingress: Nginx controller + cert-manager (auto SSL)
    Secrets: kubectl secrets (never in code)

  Vercel (recommended for production):
    vercel deploy ──► auto-deploys on git push
    Env vars set in Vercel dashboard
    Edge network: global CDN
```

## File Structure

```
movie-finder/
├── pages/                    # Next.js pages + API routes
│   ├── _app.js               # Redux Provider + global layout
│   ├── index.js              # Homepage
│   ├── movies/[id].jsx       # Movie detail (SEO + JSON-LD)
│   ├── series/[id].jsx       # Series detail
│   ├── search.js             # Search results
│   ├── admin/index.js        # Admin portal (isAdmin guard)
│   ├── privacy.js            # Legal pages
│   └── api/                  # Backend API
│       ├── auth/             # login, register, logout, me, reset
│       ├── user/             # list, history, preferences
│       └── admin/            # stats, users, cache
├── store/                    # Redux Toolkit
│   ├── index.js              # configureStore
│   └── slices/
│       ├── authSlice.js      # User auth state
│       ├── watchlistSlice.js # Saved titles state
│       └── uiSlice.js        # Modals, trailer state
├── components/               # React components
│   ├── Navbar.jsx            # Animated with Framer Motion
│   ├── MovieCard.jsx         # Redux-connected, LazyImage
│   ├── BentoGrid.jsx         # Editorial layout
│   ├── SectionRow.jsx        # Staggered scroll row
│   ├── HeroSlider.jsx        # Cinematic hero
│   ├── LazyImage.jsx         # Intersection Observer lazy load
│   ├── SkeletonCard.jsx      # Shimmer placeholders
│   └── AuthWidget.jsx        # Redux auth modal
├── controllers/              # Request handling logic
├── services/                 # Business logic (authService, watchlistService)
├── middleware/               # validate.js (Zod), requireAuth.js, rateLimit.js
├── lib/                      # Utilities (mongodb, auth JWT, tmdb, cache, mailer)
├── models/                   # Mongoose schemas (User)
├── hooks/                    # useLenis.js
├── styles/                   # globals.css (design tokens)
├── k8s/                      # Kubernetes manifests
├── Dockerfile                # Multi-stage production build
└── docker-compose.yml        # Local full-stack environment
