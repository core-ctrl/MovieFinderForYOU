// pages/index.js
import Head from "next/head";
import HeroSlider from "../components/HeroSlider";
import TopCarousel from "../components/TopCarousel";
import SectionRow from "../components/SectionRow";
import GenreRow from "../components/GenreRow";
import {
  fetchTrending, fetchVideos, fetchTrendingMovies, fetchTrendingTV,
  fetchTopRatedMovies, fetchTopRatedTV, fetchByGenre, fetchRecommendedByGenres,
} from "../lib/tmdb";

export default function Home({
  heroSlides = [], trending15 = [],
  trendingMovies = [], trendingTV = [],
  goatedMovies = [], goatedSeries = [], goatedAnime = [],
  action = [], comedy = [], thriller = [], horror = [],
  romance = [], anime = [], scifi = [], bollywood = [], tollywood = [],
  // personalised — passed from getServerSideProps via cookie read OR empty
  recommendedMovies = [], recommendedSeries = [],
  addToWishlist, wishlist = [], openAuth, openTrailer, user,
}) {
  const playTrailer = (key, title, id, type) => openTrailer(key, title, id, type);
  const rowProps = { wishlist, addToWishlist, openAuth, onPlayTrailer: playTrailer };

  return (
    <>
      <Head>
        <title>Movie & Series Finder</title>
        <meta name="description" content="Discover top movies and series" />
      </Head>

      <main className="bg-black text-white min-h-screen">
        <HeroSlider slides={heroSlides} onPlayTrailer={playTrailer} wishlist={wishlist} addToWishlist={addToWishlist} openAuth={openAuth} />

        <div className="max-w-6xl mx-auto px-4 md:px-6 pt-10">

          {/* 1 — TRENDING */}
          <TopCarousel items={trending15} title="🔥 Trending Now" {...rowProps} />

          {/* 2 — TOP THIS WEEK (trending, not all-time) */}
          <TopCarousel items={trendingMovies} title="🎬 Top Movies This Week" {...rowProps} />
<<<<<<< HEAD
          <TopCarousel items={trendingTV}    title="📺 Top Series This Week" {...rowProps} />
=======
          <TopCarousel items={trendingTV} title="📺 Top Series This Week" {...rowProps} />
>>>>>>> 3b3f76b6b2f75cfb78a3ee46561373052120bd14

          {/* 3 — PERSONALISED (only if logged in) */}
          {user && recommendedMovies.length > 0 && (
            <SectionRow title="🎯 Recommended Movies for You" subtitle="Based on your favourite genres" items={recommendedMovies} {...rowProps} />
          )}
          {user && recommendedSeries.length > 0 && (
            <SectionRow title="🎯 Recommended Series for You" subtitle="Based on your favourite genres" items={recommendedSeries} {...rowProps} />
          )}
          {!user && (
            <div className="my-8 px-6 py-5 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-between">
              <div>
                <p className="font-semibold text-white">Get personalised recommendations</p>
                <p className="text-sm text-neutral-400">Sign in and pick your favourite genres</p>
              </div>
              <button onClick={openAuth} className="bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition">
                Sign In
              </button>
            </div>
          )}

          {/* 4 — GOATED */}
          <div className="my-6 flex items-center gap-3">
            <span className="text-4xl">🐐</span>
            <div>
              <h2 className="text-2xl md:text-3xl font-bold">The GOATs</h2>
              <p className="text-sm text-neutral-400">All-time greatest — movies, series & anime</p>
            </div>
          </div>
<<<<<<< HEAD
          <SectionRow title="🏆 Goated Movies"  subtitle="Greatest films ever made"  items={goatedMovies}  {...rowProps} />
          <SectionRow title="👑 Goated Series"  subtitle="Legendary television"       items={goatedSeries}  {...rowProps} />
          <SectionRow title="⚡ Goated Anime"   subtitle="Greatest anime of all time" items={goatedAnime}   {...rowProps} />
=======
          <SectionRow title="🏆 Goated Movies" subtitle="Greatest films ever made" items={goatedMovies}  {...rowProps} />
          <SectionRow title="👑 Goated Series" subtitle="Legendary television" items={goatedSeries}  {...rowProps} />
          <SectionRow title="⚡ Goated Anime" subtitle="Greatest anime of all time" items={goatedAnime}   {...rowProps} />
>>>>>>> 3b3f76b6b2f75cfb78a3ee46561373052120bd14

          <div className="border-t border-white/5 my-10" />

          {/* 5 — GENRE ROWS */}
<<<<<<< HEAD
          <GenreRow title="💥 Action"    items={action}    genreId={28}    {...rowProps} />
          <GenreRow title="😂 Comedy"    items={comedy}    genreId={35}    {...rowProps} />
          <GenreRow title="😱 Thriller"  items={thriller}  genreId={53}    {...rowProps} />
          <GenreRow title="👻 Horror"    items={horror}    genreId={27}    {...rowProps} />
          <GenreRow title="❤️ Romance"   items={romance}   genreId={10749} {...rowProps} />
          <GenreRow title="🎌 Anime"     items={anime}     genreId={16}    {...rowProps} />
          <GenreRow title="🚀 Sci-Fi"    items={scifi}     genreId={878}   {...rowProps} />
=======
          <GenreRow title="💥 Action" items={action} genreId={28}    {...rowProps} />
          <GenreRow title="😂 Comedy" items={comedy} genreId={35}    {...rowProps} />
          <GenreRow title="😱 Thriller" items={thriller} genreId={53}    {...rowProps} />
          <GenreRow title="👻 Horror" items={horror} genreId={27}    {...rowProps} />
          <GenreRow title="❤️ Romance" items={romance} genreId={10749} {...rowProps} />
          <GenreRow title="🎌 Anime" items={anime} genreId={16}    {...rowProps} />
          <GenreRow title="🚀 Sci-Fi" items={scifi} genreId={878}   {...rowProps} />
>>>>>>> 3b3f76b6b2f75cfb78a3ee46561373052120bd14
          <GenreRow title="🎭 Bollywood" items={bollywood} genreId={104}   {...rowProps} />
          <GenreRow title="🌟 Tollywood" items={tollywood} genreId={122}   {...rowProps} />

          {/* TMDB Attribution — required by TMDB ToS */}
          <footer className="my-16 text-center">
            <div className="inline-flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl px-5 py-3">
              <img src="https://www.themoviedb.org/assets/2/v4/logos/v2/blue_short-8e7b30f73a4020692ccca9c88bafe5dcb6f8a62a4c6bc55cd9ba82bb2cd95f6c.svg" alt="TMDB" className="h-4 opacity-70" />
              <p className="text-xs text-neutral-500">
                This product uses the TMDB API but is not endorsed or certified by TMDB.
                All movie data, images and metadata © their respective rights holders.
                This app is for discovery only — no content is hosted or distributed.
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
    // Check if user is logged in to personalise results
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
        fetchTrendingMovies().then(r => r.slice(0, 15)),
        fetchTrendingTV().then(r => r.slice(0, 15)),
        fetchTopRatedMovies(2).then(r => r.slice(0, 20)),
        fetchTopRatedTV(2).then(r => r.slice(0, 20)),
        fetchByGenre(16, 1, "tv").then(r => r.slice(0, 20)),
        fetchByGenre(28), fetchByGenre(35), fetchByGenre(53), fetchByGenre(27),
        fetchByGenre(10749), fetchByGenre(16), fetchByGenre(878),
        fetchByGenre(104), fetchByGenre(122),
      ]);

    trending.sort((a, b) => b.popularity - a.popularity);
    const trending15 = trending.slice(0, 15);

    const heroSlides = await Promise.all(
      trending.slice(0, 5).map(async (item) => {
        const media = item.media_type || (item.title ? "movie" : "tv");
        const videos = await fetchVideos(item.id, media);
        return { ...item, trailerKey: videos[0]?.key || null };
      })
    );

    const sort = (arr) => [...arr].sort((a, b) => b.vote_average - a.vote_average);

    // Personalised
    let recommendedMovies = [], recommendedSeries = [];
    if (preferredGenres.length) {
      [recommendedMovies, recommendedSeries] = await Promise.all([
        fetchRecommendedByGenres(preferredGenres, "movie").then(r => r.slice(0, 20)),
        fetchRecommendedByGenres(preferredGenres, "tv").then(r => r.slice(0, 20)),
      ]);
    }

    return {
      props: {
        heroSlides, trending15, trendingMovies, trendingTV,
        goatedMovies: sort(goatedMoviesRaw),
        goatedSeries: sort(goatedSeriesRaw),
<<<<<<< HEAD
        goatedAnime:  sort(goatedAnimeRaw),
=======
        goatedAnime: sort(goatedAnimeRaw),
>>>>>>> 3b3f76b6b2f75cfb78a3ee46561373052120bd14
        action, comedy, thriller, horror, romance, anime, scifi, bollywood, tollywood,
        recommendedMovies, recommendedSeries,
      },
    };
  } catch (err) {
    console.error("HOME_PAGE_ERROR:", err.message);
    return { props: {} };
  }
<<<<<<< HEAD
}
=======
}
>>>>>>> 3b3f76b6b2f75cfb78a3ee46561373052120bd14
