<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=E8C84A&height=180&section=header&text=MOVIEFINDER&fontSize=55&fontColor=0a0a0f&fontAlignY=38&desc=Cinematic%20Full-Stack%20Movie%20%26%20Series%20Discovery&descAlignY=60&descColor=0a0a0f&descSize=15&animation=fadeIn" width="100%"/>

<br/>

<img src="https://readme-typing-svg.demolab.com?font=Fira+Code&size=14&duration=2500&pause=800&color=E8C84A&center=true&vCenter=true&multiline=false&width=620&lines=Next.js+14+%7C+React+%7C+Node.js+%7C+MongoDB+Atlas;JWT+Auth+%7C+TMDB+API+%7C+Docker+%7C+Nginx;Watchlist+%7C+Trailers+%7C+Personalised+Recommendations;Ken+Burns+Hero+%7C+Bento+Grid+%7C+Framer+Motion" alt="Typing SVG" />

<br/><br/>

<!-- STACK BADGES — all use shields.io, 100% reliable on GitHub -->
<img src="https://img.shields.io/badge/Next.js-14-000000?style=for-the-badge&logo=nextdotjs&logoColor=white" alt="Next.js"/>
<img src="https://img.shields.io/badge/React-18-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React"/>
<img src="https://img.shields.io/badge/Node.js-Runtime-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js"/>
<img src="https://img.shields.io/badge/MongoDB-Atlas-00ED64?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB"/>

<br/>

<img src="https://img.shields.io/badge/Docker-Ready-2496ED?style=for-the-badge&logo=docker&logoColor=white" alt="Docker"/>
<img src="https://img.shields.io/badge/TMDB-API-01b4e4?style=for-the-badge&logo=themoviedb&logoColor=white" alt="TMDB"/>
<img src="https://img.shields.io/badge/JWT-Auth-FB015B?style=for-the-badge&logo=jsonwebtokens&logoColor=white" alt="JWT"/>
<img src="https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind"/>
<img src="https://img.shields.io/badge/Framer-Motion-black?style=for-the-badge&logo=framer&logoColor=white" alt="Framer Motion"/>

<br/><br/>

<img src="https://img.shields.io/github/stars/core-ctrl/MovieFinderForYOU?style=for-the-badge&color=E8C84A&labelColor=0a0a0f" alt="Stars"/>
<img src="https://img.shields.io/github/forks/core-ctrl/MovieFinderForYOU?style=for-the-badge&color=E8C84A&labelColor=0a0a0f" alt="Forks"/>
<img src="https://img.shields.io/github/last-commit/core-ctrl/MovieFinderForYOU?style=for-the-badge&color=E8C84A&labelColor=0a0a0f" alt="Last Commit"/>
<img src="https://img.shields.io/github/license/core-ctrl/MovieFinderForYOU?style=for-the-badge&color=E8C84A&labelColor=0a0a0f" alt="License"/>

</div>

---

## 🧠 What is This?

> **MovieFinder** is a **Next.js 14** full-stack app — meaning React handles the UI, and Next.js API routes run as serverless **Node.js** functions on the backend. One codebase, frontend + backend together.

```
Browser (React + Tailwind)
       ↕
Next.js 14  ←→  Node.js Runtime  ←→  MongoDB Atlas
       ↕
   TMDB API
```

---

## ✨ Features

| | Feature | Details |
|:---:|:---|:---|
| 🎥 | **Cinematic Hero** | Ken Burns effect, parallax, dominant colour extraction |
| 🔥 | **Trending Rows** | Real-time trending movies & series from TMDB |
| 🐐 | **GOAT Section** | All-time greatest movies, series & anime |
| 🎯 | **Personalised** | Recommendations based on your favourite genres |
| 🎬 | **Trailers** | YouTube autoplay via global trailer modal |
| ❤️ | **Watchlist** | Synced to MongoDB when logged in, localStorage for guests |
| 🔍 | **Search** | Instant search across movies & series |
| 🔒 | **Auth** | JWT email/password, rate limited, HTTP-only cookies |
| 📧 | **Email** | Welcome & password reset via Gmail SMTP |
| ⚙️ | **Admin** | Hidden panel at `/admin` — user management & stats |
| 🐳 | **Docker** | Multi-stage Dockerfile + docker-compose + Nginx |
| 🗺️ | **SEO** | Sitemap, robots.txt, JSON-LD schema, Open Graph |
| 🔥 | **Firebase** | Analytics via Firebase (env-safe config) |
| 📜 | **Legal** | Privacy, Terms, DMCA, Cookie consent |

---

## 🚀 Quick Start

<details>
<summary><b>🖥️ Local Development</b></summary>
<br/>

```bash
git clone https://github.com/core-ctrl/MovieFinderForYOU.git
cd MovieFinderForYOU
npm install
cp .env.example .env.local
# fill in your keys in .env.local
npm run dev
```

Open → [http://localhost:3000](http://localhost:3000)

</details>

<details>
<summary><b>🐳 Docker — Production</b></summary>
<br/>

```bash
docker-compose up -d
docker-compose logs -f app
docker-compose restart app
docker-compose down
```

</details>

<details>
<summary><b>⚙️ Environment Variables</b></summary>
<br/>

Create `.env.local` — **never commit this file.**

```env
# TMDB
TMDB_API_KEY=
NEXT_PUBLIC_TMDB_IMAGE=https://image.tmdb.org/t/p

# MongoDB
MONGODB_URI=

# Auth
JWT_SECRET=

# Email
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=
EMAIL_PASS=
EMAIL_FROM=

# App
NEXT_PUBLIC_APP_URL=

# Firebase
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=
```

</details>

---

## 🏗️ Architecture

```
MovieFinderForYOU/
│
├── components/
│   ├── Navbar.jsx            # Framer Motion animated navbar
│   ├── MovieCard.jsx         # Poster card with hover preview
│   ├── BentoGrid.jsx         # Editorial bento layout
│   ├── SectionRow.jsx        # Netflix-style scroll row
│   ├── TopCarousel.jsx       # Ranked top picks
│   ├── HeroSlider.jsx        # Cinematic hero + YouTube embed
│   ├── TrailerModal.jsx      # Global trailer player
│   ├── AuthWidget.jsx        # Login / signup / forgot password
│   ├── CookieBanner.jsx      # GDPR cookie consent
│   ├── SEOMeta.jsx           # SEO + JSON-LD
│   └── SkeletonCard.jsx      # Loading skeleton
│
├── pages/                    # Next.js Pages Router
│   ├── index.js              # Homepage
│   ├── movies/[id].jsx       # Movie detail (dynamic route)
│   ├── series/[id].jsx       # Series detail (dynamic route)
│   ├── search.js             # Search results
│   ├── my-list/              # Saved watchlist
│   ├── profile/              # User profile + genre prefs
│   ├── admin/                # Hidden admin panel
│   └── api/                  # Node.js serverless API routes
│       ├── auth/             # register, login, logout, me
│       ├── user/             # list, preferences
│       ├── media/            # movie & TV detail proxy
│       ├── search/           # TMDB search
│       └── admin/            # admin-only stats
│
├── lib/
│   ├── mongodb.js            # Mongoose connection
│   ├── auth.js               # JWT sign / verify
│   ├── tmdb.js               # TMDB API client
│   ├── firebase.js           # Firebase (env-safe)
│   ├── mailer.js             # Nodemailer
│   └── rateLimit.js          # Auth rate limiter
│
├── models/
│   └── User.js               # Mongoose schema
│
├── hooks/
│   └── useLenis.js           # Smooth scroll
│
├── Dockerfile                # Multi-stage build
├── docker-compose.yml        # App + MongoDB + Nginx
├── nginx.conf                # Reverse proxy
└── .env.example              # Safe template — no real secrets
```

---

## 🔌 API Routes

> All routes live under `pages/api/` and run as **Node.js serverless functions** via Next.js.

| Route | Method | Description |
|:------|:------:|:------------|
| `/api/auth/register` | `POST` | Create account |
| `/api/auth/login` | `POST` | Sign in, sets HTTP-only cookie |
| `/api/auth/logout` | `POST` | Clear session cookie |
| `/api/auth/me` | `GET` | Get current user |
| `/api/user/list` | `GET` `POST` `DELETE` | Watchlist CRUD |
| `/api/user/preferences` | `GET` `POST` | Genre preferences |
| `/api/media/[type]/[id]` | `GET` | Movie / TV detail via TMDB |
| `/api/search` | `GET` | Search TMDB |
| `/api/admin/stats` | `GET` | Admin only — user stats |

---

## 🛠️ Full Tech Stack

<div align="center">

| Layer | Technology |
|:------|:-----------|
| **Framework** | Next.js 14 (Pages Router) |
| **Frontend** | React 18 + Tailwind CSS + Framer Motion |
| **Backend** | Node.js via Next.js API Routes |
| **Database** | MongoDB Atlas + Mongoose |
| **Auth** | JWT — HTTP-only cookies, bcrypt, rate limiting |
| **Media Data** | TMDB API |
| **Email** | Nodemailer + Gmail SMTP |
| **Analytics** | Firebase Analytics |
| **Infra** | Docker + Nginx + docker-compose |
| **SEO** | JSON-LD, Open Graph, sitemap.xml, robots.txt |

</div>

---

## ⚙️ Admin Panel

Access at `/admin` — not linked anywhere public.

To promote a user: set `isAdmin: true` on their document in MongoDB Atlas.

- 👥 View / delete / promote users
- 📊 Stats overview
- 🆕 Recent signups

---

## 📜 Legal

> This product uses the TMDB API but is **not** endorsed or certified by TMDB.
> All movie data, images and metadata © their respective rights holders.
> This is a **discovery tool only** — no content is hosted or streamed.

---

<div align="center">

<img src="https://readme-typing-svg.demolab.com?font=Fira+Code&size=12&duration=3000&pause=1000&color=E8C84A&center=true&vCenter=true&width=440&lines=Drop+a+%E2%AD%90+if+you+like+the+project!;Built+with+%E2%9D%A4%EF%B8%8F+%7C+Data+by+TMDB+API" alt="footer typing"/>

<br/><br/>

**Built with ❤️ · Data by [TMDB](https://www.themoviedb.org)**

<br/>

<img src="https://capsule-render.vercel.app/api?type=waving&color=E8C84A&height=100&section=footer" width="100%"/>

</div>