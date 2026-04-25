// pages/index.js
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Head from "next/head";
import { motion } from "framer-motion";
import HeroSlider from "../components/HeroSlider";
import TopCarousel from "../components/TopCarousel";
import SectionRow from "../components/SectionRow";
import GenreRow from "../components/GenreRow";
import BentoGrid from "../components/BentoGrid";
import AdBanner from "../components/AdBanner";
import { SkeletonRow } from "../components/SkeletonCard";
import { selectUser } from "../store/slices/authSlice";
import { selectWatchlist } from "../store/slices/watchlistSlice";
import {
  fetchTrending, fetchVideos, fetchTrendingMovies, fetchTrendingTV,
  fetchTopRatedMovies, fetchTopRatedTV, fetchByGenre, fetchRecommendedByGenres,
} from "../lib/tmdb";
import axios from "axios";

export default function Home({
  heroSlides = [], trending15 = [],
  trendingMovies = [], trendingTV = [],
  goatedMovies = [], goatedSeries = [], goatedAnime = [],
  action = [], comedy = [], thriller = [],
  horror = [], romance = [], anime = [],
  scifi = [], bollywood = [], tollywood = [],
  openTrailer, openAuth,
}) {
  const user = useSelector(selectUser);
  const wishlist = useSelector(selectWatchlist);
  const [recs, setRecs] = useState(null);
  const [recLoad, setRecLoad] = useState(false);

  // Fetch personalised recommendations client-side (user-specific)
  useEffect(() => {
    if (!user) { setRecs(null); return; }
    setRecLoad(true);
    axios.get("/api/recommendations")
      .then(({ data }) => setRecs(data))
      .catch(() => { })
      .finally(() => setRecLoad(false));
  }, [user]);

  const rowProps = {
    wishlist,
    addToWishlist: () => { }, // Handled by MovieCard via Redux directly
    openAuth,
    onPlayTrailer: openTrailer,
  };

  return (
    <>
      <Head>
        <title>Movie Finder — Discover Movies, Series & Anime</title>
        <meta name="description" content="Discover trending movies, top series and anime. Watch trailers, save favourites, get personalised recommendations." />
      </Head>

      <main className="bg-black text-white min-h-screen">
        {/* HERO */}
        <HeroSlider slides={heroSlides} onPlayTrailer={openTrailer} openAuth={openAuth} />

        <div className="max-w-7xl mx-auto px-4 md:px-8 pt-10">

          {/* 1. TRENDING */}
          <TopCarousel items={trending15} title="🔥 Trending Now" {...rowProps} />

          {/* 2. TOP THIS WEEK */}
          <BentoGrid items={trendingMovies.slice(0, 5)} title="🎬 Top Movies This Week" />
          <TopCarousel items={trendingTV} title="📺 Top Series This Week" {...rowProps} />

          {/* AD SLOT 1 */}
          <AdBanner slot="horizontal" />

          {/* 3. PERSONALISED */}
          {user && (
            <section className="mb-14">
              <motion.div className="mb-6" initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                <h2 className="text-2xl font-bold">🎯 Recommended for You</h2>
                <p className="text-neutral-500 text-sm mt-1">Based on your taste and watch history</p>
              </motion.div>

              {recLoad ? (
                <><SkeletonRow count={7} /><SkeletonRow count={7} /></>
              ) : recs ? (
                <>
                  {recs.movies.length > 0 && <SectionRow title="Movies You'll Love" items={recs.movies} {...rowProps} />}
                  {recs.tv.length > 0 && <SectionRow title="Series You'll Love" items={recs.tv} {...rowProps} />}

                  {/* Because You Watched */}
                  {recs.becauseYouWatched?.map((byw) => (
                    byw.items.length > 0 && (
                      <SectionRow
                        key={byw.because}
                        title={`Because You Watched "${byw.because}"`}
                        items={byw.items}
                        {...rowProps}
                      />
                    )
                  ))}

                  {/* Hidden Gems */}
                  {recs.hiddenGems?.length > 0 && (
                    <SectionRow
                      title="💎 Hidden Gems"
                      subtitle="High-rated titles you might have missed"
                      items={recs.hiddenGems}
                      {...rowProps}
                    />
                  )}
                </>
              ) : null}
            </section>
          )}

          {/* Sign-in prompt for guests */}
          {!user && (
            <motion.div className="my-10 glass border border-white/8 rounded-2xl p-6 flex items-center justify-between"
              initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
              <div>
                <p className="font-bold text-white text-lg">Get personalised recommendations</p>
                <p className="text-neutral-500 text-sm mt-1">Sign in and pick your favourite genres for a curated experience</p>
              </div>
              <button onClick={openAuth}
                className="flex-shrink-0 bg-accent hover:bg-accent-dark text-white px-6 py-3 rounded-xl font-semibold transition-all hover:shadow-glow-red text-sm">
                Sign In Free
              </button>
            </motion.div>
          )}

          {/* 4. GOATED */}
          <div className="my-8 flex items-center gap-4">
            <span className="text-5xl">🐐</span>
            <div>
              <h2 className="text-2xl md:text-3xl font-bold">The GOATs</h2>
              <p className="text-neutral-500 text-sm">Greatest of all time — movies, series & anime</p>
            </div>
          </div>

          <SectionRow title="🏆 Goated Movies" subtitle="Greatest films ever made" items={goatedMovies}  {...rowProps} />
          <SectionRow title="👑 Goated Series" subtitle="Legendary television" items={goatedSeries}  {...rowProps} />
          <SectionRow title="⚡ Goated Anime" subtitle="Greatest anime of all time" items={goatedAnime}   {...rowProps} />

          {/* AD SLOT 2 */}
          <AdBanner slot="horizontal" />

          {/* 5. GENRE ROWS */}
          <div className="border-t border-white/5 my-10" />
          <GenreRow title="💥 Action" items={action} genreId={28}    {...rowProps} />
          <GenreRow title="😂 Comedy" items={comedy} genreId={35}    {...rowProps} />
          <GenreRow title="😱 Thriller" items={thriller} genreId={53}    {...rowProps} />
          <GenreRow title="👻 Horror" items={horror} genreId={27}    {...rowProps} />
          <GenreRow title="❤️ Romance" items={romance} genreId={10749} {...rowProps} />
          <GenreRow title="🎌 Anime" items={anime} genreId={16}    {...rowProps} />
          <GenreRow title="🚀 Sci-Fi" items={scifi} genreId={878}   {...rowProps} />
          <GenreRow title="🎭 Bollywood" items={bollywood} genreId={104}   {...rowProps} />
          <GenreRow title="🌟 Tollywood" items={tollywood} genreId={122}   {...rowProps} />

          {/* TMDB Legal Attribution */}
          <footer className="my-16 text-center">
            <div className="inline-flex items-center gap-3 glass border border-white/8 rounded-xl px-5 py-3">
              <img src="https://www.themoviedb.org/assets/2/v4/logos/v2/blue_short-8e7b30f73a4020692ccca9c88bafe5dcb6f8a62a4c6bc55cd9ba82bb2cd95f6c.svg" alt="TMDB" className="h-4 opacity-60" />
              <p className="text-xs text-neutral-600">
                This product uses the TMDB API but is not endorsed or certified by TMDB.
                All content © their respective rights holders. Discovery tool only.
              </p>
            </div>
          </footer>
        </div>
      </main>
    </>
  );
}

export async function getServerSideProps({ req }) {
  try {
    const { getUserFromRequest } = await import("../lib/auth");
    const { connectDB } = await import("../lib/mongodb");
    const User = (await import("../models/User")).default;

    let preferredGenres = [];
    const decoded = getUserFromRequest(req);
    if (decoded) {
      await connectDB();
      const user = await User.findById(decoded.id).select("preferredGenres");
      preferredGenres = user?.preferredGenres || [];
    }

    const [trending, trendingMovies, trendingTV, goatedMoviesRaw, goatedSeriesRaw, goatedAnimeRaw,
      action, comedy, thriller, horror, romance, anime, scifi, bollywood, tollywood] =
      await Promise.all([
        fetchTrending(),
        fetchTrendingMovies().then((r) => r.slice(0, 15)),
        fetchTrendingTV().then((r) => r.slice(0, 15)),
        fetchTopRatedMovies(2).then((r) => r.slice(0, 20)),
        fetchTopRatedTV(2).then((r) => r.slice(0, 20)),
        fetchByGenre(16, 1, "tv").then((r) => r.slice(0, 20)),
        fetchByGenre(28), fetchByGenre(35), fetchByGenre(53), fetchByGenre(27),
        fetchByGenre(10749), fetchByGenre(16), fetchByGenre(878),
        fetchByGenre(104), fetchByGenre(122),
      ]);

    trending.sort((a, b) => b.popularity - a.popularity);

    const heroSlides = await Promise.all(
      trending.slice(0, 5).map(async (item) => {
        const media = item.media_type || (item.title ? "movie" : "tv");
        const videos = await fetchVideos(item.id, media);
        return { ...item, trailerKey: videos[0]?.key || null };
      })
    );

    const sort = (arr) => [...arr].sort((a, b) => b.vote_average - a.vote_average);

    return {
      props: {
        heroSlides,
        trending15: trending.slice(0, 15),
        trendingMovies,
        trendingTV,
        goatedMovies: sort(goatedMoviesRaw),
        goatedSeries: sort(goatedSeriesRaw),
        goatedAnime: sort(goatedAnimeRaw),
        action, comedy, thriller, horror, romance, anime, scifi, bollywood, tollywood,
      },
    };
  } catch (err) {
    console.error("HOME_ERROR:", err.message);
    return { props: {} };
  }
}