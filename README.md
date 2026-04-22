<<<<<<< HEAD
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
=======
# MovieFinderForYOU
>>>>>>> 54200736c0430971ac5f8a79dff6ddc10ae97286
