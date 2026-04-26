<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=E8C84A&height=200&section=header&text=MOVIEFINDER&fontSize=60&fontColor=0a0a0f&fontAlignY=38&desc=A%20Cinematic%20Full-Stack%20Movie%20%26%20Series%20Discovery%20Platform&descAlignY=58&descColor=0a0a0f&descSize=16&animation=fadeIn" width="100%"/>

<br/>

<img src="https://readme-typing-svg.demolab.com?font=Fira+Code&size=14&duration=2500&pause=800&color=E8C84A&center=true&vCenter=true&width=600&lines=🎬+Next.js+14+%7C+MongoDB+%7C+TMDB+API;🔒+JWT+Auth+%7C+Rate+Limited+%7C+Secure+Cookies;🐳+Docker+Ready+%7C+Nginx+%7C+Production+Build;❤️+Watchlist+%7C+Trailers+%7C+Personalised+Recs" alt="Typing SVG"/>

<br/><br/>

[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-00ED64?style=for-the-badge&logo=mongodb&logoColor=white)](https://mongodb.com)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://docker.com)
[![TMDB](https://img.shields.io/badge/Data-TMDB-01b4e4?style=for-the-badge&logo=themoviedb&logoColor=white)](https://themoviedb.org)
[![JWT](https://img.shields.io/badge/Auth-JWT-FB015B?style=for-the-badge&logo=jsonwebtokens&logoColor=white)](https://jwt.io)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com)

<br/>

![Repo Views](https://komarev.com/ghpvc/?username=moviefinder&color=e8c84a&style=for-the-badge&label=REPO+VIEWS)

</div>

<img src="https://user-images.githubusercontent.com/73097560/115834477-dbab4500-a447-11eb-908a-139a6edaec5c.gif" width="100%"/>

## ✨ Features

<div align="center">

| &nbsp; | Feature | Details |
|:------:|:--------|:--------|
| 🎥 | **Cinematic Hero** | Ken Burns effect, parallax, dominant colour extraction |
| 🔥 | **Trending Rows** | Real-time trending movies & series from TMDB |
| 🐐 | **GOAT Section** | All-time greatest movies, series & anime |
| 🎯 | **Personalised** | Recommendations based on your favourite genres |
| 🎬 | **Trailers** | YouTube autoplay via global trailer modal |
| ❤️ | **Watchlist** | Save titles — synced to MongoDB when logged in |
| 🔍 | **Search** | Instant search across movies & series |
| 🔒 | **Auth** | JWT email/password, rate limited, secure cookies |
| 📧 | **Email** | Welcome & password reset via Gmail SMTP |
| ⚙️ | **Admin** | Hidden admin panel at `/admin` |
| 🐳 | **Docker** | Production-ready Dockerfile + docker-compose |
| 🗺️ | **SEO** | Sitemap, robots.txt, JSON-LD schema, Open Graph |
| 📜 | **Legal** | Privacy, Terms, DMCA, Cookie consent |

</div>

<img src="https://user-images.githubusercontent.com/73097560/115834477-dbab4500-a447-11eb-908a-139a6edaec5c.gif" width="100%"/>

## 🚀 Quick Start

<details>
<summary><b>🖥️ &nbsp;Local Development</b></summary>
<br/>

```bash
# 1. Clone the repo
git clone https://github.com/YOUR_USERNAME/moviefinder.git
cd moviefinder

# 2. Install dependencies
npm install

# 3. Configure environment
cp .env.local.example .env.local
# Fill in your keys (see Environment Variables below)

# 4. Start dev server
npm run dev
# → http://localhost:3000
```

</details>

<details>
<summary><b>🐳 &nbsp;Docker — Production</b></summary>
<br/>

```bash
# Build and start all services
docker-compose up -d

# View live logs
docker-compose logs -f app

# Restart app container only
docker-compose restart app

# Tear down
docker-compose down
```

</details>

<details>
<summary><b>⚙️ &nbsp;Environment Variables</b></summary>
<br/>

```env
TMDB_API_KEY=                    # themoviedb.org/settings/api
NEXT_PUBLIC_TMDB_IMAGE=https://image.tmdb.org/t/p
MONGODB_URI=                     # MongoDB Atlas connection string
JWT_SECRET=                      # Min 32 chars random string
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=moviefinderforyou@gmail.com
EMAIL_PASS=                      # Gmail App Password
EMAIL_FROM="Movie Finder <yourmail>"
NEXT_PUBLIC_APP_URL=             # e.g. https://moviefinder.com
```

</details>

<img src="https://user-images.githubusercontent.com/73097560/115834477-dbab4500-a447-11eb-908a-139a6edaec5c.gif" width="100%"/>

## 🏗️ Architecture

```
🎬 movie-finder/
│
├── 🧩 components/
│   ├── Navbar.jsx          # Animated navbar — Framer Motion
│   ├── MovieCard.jsx       # Poster card with hover preview
│   ├── BentoGrid.jsx       # Editorial bento layout
│   ├── SectionRow.jsx      # Netflix-style horizontal scroll row
│   ├── TopCarousel.jsx     # Ranked top picks carousel
│   ├── HeroSlider.jsx      # Cinematic hero + YouTube embed
│   ├── TrailerModal.jsx    # Global trailer player
│   ├── AuthWidget.jsx      # Login / signup / forgot password
│   ├── CookieBanner.jsx    # GDPR cookie consent
│   ├── SEOMeta.jsx         # SEO + JSON-LD schema
│   └── SkeletonCard.jsx    # Loading skeleton
│
├── 📄 pages/
│   ├── index.js            # Homepage
│   ├── movies/[id].jsx     # Movie detail
│   ├── series/[id].jsx     # Series detail
│   ├── search.js           # Search results
│   ├── my-list/            # Saved titles
│   ├── profile/            # User profile + genre preferences
│   ├── admin/              # Hidden admin panel
│   ├── privacy.js          # Privacy Policy
│   ├── terms.js            # Terms of Service
│   ├── dmca.js             # DMCA Policy
│   ├── about.js            # About + TMDB attribution
│   └── api/                # Backend API routes
│
├── 📦 lib/
│   ├── mongodb.js          # Mongoose connection
│   ├── auth.js             # JWT utilities
│   ├── tmdb.js             # TMDB API client
│   ├── mailer.js           # Nodemailer email sender
│   └── rateLimit.js        # Auth rate limiter
│
├── 🗄️  models/
│   └── User.js             # User schema — watchlist, prefs, history
│
├── 🪝 hooks/
│   └── useLenis.js         # Smooth scroll
│
├── 🐳 Dockerfile           # Multi-stage production build
├── 🐳 docker-compose.yml   # App + MongoDB + Nginx
└── 🌐 nginx.conf           # Reverse proxy config
```

<img src="https://user-images.githubusercontent.com/73097560/115834477-dbab4500-a447-11eb-908a-139a6edaec5c.gif" width="100%"/>

## 🔌 API Routes

<div align="center">

| Route | Method | Description |
|:------|:------:|:------------|
| `/api/auth/register` | `POST` | Create account |
| `/api/auth/login` | `POST` | Sign in |
| `/api/auth/logout` | `POST` | Sign out |
| `/api/auth/me` | `GET` | Get current user |
| `/api/user/list` | `GET` `POST` `DELETE` | Watchlist management |
| `/api/user/preferences` | `GET` `POST` | Genre preferences |
| `/api/media/[type]/[id]` | `GET` | Movie / TV details |
| `/api/search` | `GET` | Search TMDB |
| `/api/admin/stats` | `GET` | Admin stats *(admin only)* |

</div>

<img src="https://user-images.githubusercontent.com/73097560/115834477-dbab4500-a447-11eb-908a-139a6edaec5c.gif" width="100%"/>

## 🛠️ Tech Stack

<div align="center">

![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
![Mongoose](https://img.shields.io/badge/Mongoose-880000?style=for-the-badge&logo=mongoose&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2CA5E0?style=for-the-badge&logo=docker&logoColor=white)
![Nginx](https://img.shields.io/badge/Nginx-009639?style=for-the-badge&logo=nginx&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)
![Nodemailer](https://img.shields.io/badge/Nodemailer-0F9DCE?style=for-the-badge&logo=minutemailer&logoColor=white)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-black?style=for-the-badge&logo=framer&logoColor=white)

</div>

<img src="https://user-images.githubusercontent.com/73097560/115834477-dbab4500-a447-11eb-908a-139a6edaec5c.gif" width="100%"/>

## ⚙️ Admin Panel

> Access at `/admin` — not linked from any public page.
> To grant admin: set `isAdmin: true` on a user document in MongoDB Atlas.

- 👥 User management — view, delete, promote
- 📊 Stats overview
- 🆕 Recent signups feed

<img src="https://user-images.githubusercontent.com/73097560/115834477-dbab4500-a447-11eb-908a-139a6edaec5c.gif" width="100%"/>

## 📜 Legal

> This product uses the TMDB API but is **not** endorsed or certified by TMDB.
> All movie data, images and metadata © their respective rights holders.
> This app is a **discovery tool only** — no content is hosted or distributed.

<img src="https://user-images.githubusercontent.com/73097560/115834477-dbab4500-a447-11eb-908a-139a6edaec5c.gif" width="100%"/>

<div align="center">

<img src="https://readme-typing-svg.demolab.com?font=Fira+Code&size=13&duration=3000&pause=1000&color=E8C84A&center=true&vCenter=true&width=440&lines=Thanks+for+checking+out+MovieFinder!;Drop+a+⭐+if+you+like+the+project;Built+with+❤️+%7C+Data+by+TMDB" alt="Footer typing"/>

<br/><br/>

**Built with ❤️ · Data by [TMDB](https://www.themoviedb.org)**

<br/>

<img src="https://capsule-render.vercel.app/api?type=waving&color=E8C84A&height=100&section=footer" width="100%"/>

</div>