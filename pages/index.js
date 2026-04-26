import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import {
  Award01Icon,
  Compass01Icon,
  Diamond02Icon,
  FireIcon,
  GameController03Icon,
  LaughingIcon,
  MagicWand01Icon,
  PlayIcon,
  Rocket01Icon,
  SkullIcon,
  SparklesIcon,
  Sword01Icon,
  Ticket01Icon,
  Tv01Icon,
} from "@hugeicons/core-free-icons";
import HeroSlider from "../components/HeroSlider";
import TopCarousel from "../components/TopCarousel";
import SectionRow from "../components/SectionRow";
import GenreRow from "../components/GenreRow";
import BentoGrid from "../components/BentoGrid";
import AdBanner from "../components/AdBanner";
import AdSlot from "../components/AdSlot";
import SEOMeta from "../components/SEOMeta";
import { SkeletonRow } from "../components/SkeletonCard";
import { selectUser } from "../store/slices/authSlice";
import { selectWatchlist } from "../store/slices/watchlistSlice";
import { REGION_OPTIONS } from "../lib/preferenceOptions";
import {
  fetchTrending,
  fetchVideos,
  fetchTrendingMovies,
  fetchTrendingTV,
  fetchTopRatedMovies,
  fetchTopRatedTV,
  fetchByGenre,
} from "../lib/tmdb";
import axios from "axios";
import { readStoredPreferences } from "../lib/userPreferences";
import AppIcon from "../components/AppIcon";

function TitleWithIcon({ icon: Icon, title, subtitle }) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-red-400">
        <AppIcon icon={Icon} size={20} />
      </div>
      <div>
        <div className="text-xl font-bold text-white md:text-2xl">{title}</div>
        {subtitle ? <p className="mt-1 text-sm text-neutral-500">{subtitle}</p> : null}
      </div>
    </div>
  );
}

export default function Home({
  heroSlides = [],
  trendingItems = [],
  trendingMovies = [],
  trendingTV = [],
  goatedMovies = [],
  goatedSeries = [],
  goatedAnime = [],
  action = [],
  comedy = [],
  thriller = [],
  horror = [],
  romance = [],
  anime = [],
  scifi = [],
  documentary = [],
  fantasy = [],
  openTrailer,
  openAuth,
}) {
  const user = useSelector(selectUser);
  const wishlist = useSelector(selectWatchlist);
  const [recs, setRecs] = useState(null);
  const [recLoad, setRecLoad] = useState(false);
  const [nowPlaying, setNowPlaying] = useState([]);
  const [nowPlayingLoad, setNowPlayingLoad] = useState(false);
  const regionLabel = user?.preferredRegions?.length
    ? REGION_OPTIONS.find((region) => region.code === user.preferredRegions[0])?.label || user.preferredRegions[0]
    : null;

  useEffect(() => {
    const storedPreferences = readStoredPreferences();
    const shouldFetchGuestRecs =
      !user &&
      ((storedPreferences.genres?.length || 0) > 0 ||
        (storedPreferences.languages?.length || 0) > 0 ||
        (storedPreferences.regions?.length || 0) > 0);

    if (!user && !shouldFetchGuestRecs) {
      setRecs(null);
      return;
    }

    const params = user
      ? {}
      : {
        genres: storedPreferences.genres.join(","),
        languages: storedPreferences.languages.join(","),
        regions: storedPreferences.regions.join(","),
        regionGroup: storedPreferences.regionGroup || "",
        allowLocationRecommendations: String(Boolean(storedPreferences.allowLocationRecommendations)),
      };

    setRecLoad(true);
    axios
      .get("/api/recommendations", { params })
      .then(({ data }) => setRecs(data))
      .catch(() => { })
      .finally(() => setRecLoad(false));
  }, [user]);

  useEffect(() => {
    const region = user?.preferredRegions?.[0] || readStoredPreferences().regions?.[0] || "US";
    setNowPlayingLoad(true);
    axios
      .get("/api/movies/now-playing", { params: { region } })
      .then(({ data }) => {
        setNowPlaying((data.results || []).slice(0, 10).map((item) => compactMedia(item, { media_type: "movie" })));
      })
      .catch(() => setNowPlaying([]))
      .finally(() => setNowPlayingLoad(false));
  }, [user?.preferredRegions?.[0]]);

  const nowPlayingIds = new Set(nowPlaying.map((m) => m.id));

  const rowProps = {
    wishlist,
    addToWishlist: () => { },
    openAuth,
    onPlayTrailer: openTrailer,
    nowPlayingIds,
  };

  return (
    <>
      <SEOMeta
        title="Discover Movies, Series, Anime, and Streaming Providers"
        description="Discover trending movies, top series, anime picks, trailers, and where-to-watch provider links with personalized recommendations."
        url="/"
        keywords={["movie discovery", "series recommendations", "anime picks", "watch trailers", "where to watch"]}
      />

      <main className="min-h-screen bg-black text-white">
        <HeroSlider slides={heroSlides} onPlayTrailer={openTrailer} openAuth={openAuth} />

        <div className="mx-auto max-w-7xl px-4 pt-10 md:px-8">
          <AdSlot slot="1000000000" className="mb-10" label="Featured sponsor" />

          <TopCarousel
            items={trendingItems}
            title={<TitleWithIcon icon={FireIcon} title="Trending Now" subtitle="What people are watching right now" />}
            {...rowProps}
          />

          <BentoGrid
            items={trendingMovies.slice(0, 5)}
            title={<TitleWithIcon icon={PlayIcon} title="Top Movies This Week" subtitle="High momentum picks across the platform" />}
          />

          <TopCarousel
            items={trendingTV}
            title={<TitleWithIcon icon={Tv01Icon} title="Top Series This Week" subtitle="The most talked-about shows right now" />}
            {...rowProps}
          />

          {nowPlayingLoad ? (
            <SkeletonRow count={7} />
          ) : nowPlaying.length > 0 ? (
            <SectionRow
              title={<TitleWithIcon icon={Ticket01Icon} title="In Theaters" subtitle={`Now playing in ${regionLabel || "your region"}`} />}
              items={nowPlaying}
              {...rowProps}
            />
          ) : null}

          <AdBanner slot="horizontal" />

          {user || recs ? (
            <section className="mb-14">
              <motion.div
                className="mb-6"
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <TitleWithIcon
                  icon={Compass01Icon}
                  title="Recommended for You"
                  subtitle={`Based on your taste, watch history${regionLabel ? `, and ${regionLabel} preferences` : ""}`}
                />
              </motion.div>

              {recLoad ? (
                <>
                  <SkeletonRow count={7} />
                  <SkeletonRow count={7} />
                </>
              ) : recs ? (
                <>
                  {recs.movies.length > 0 ? (
                    <SectionRow title="Movies You'll Love" items={recs.movies} {...rowProps} />
                  ) : null}

                  {recs.tv.length > 0 ? (
                    <SectionRow title="Series You'll Love" items={recs.tv} {...rowProps} />
                  ) : null}

                  {recs.becauseYouWatched?.map((byw) =>
                    byw.items.length > 0 ? (
                      <SectionRow
                        key={byw.because}
                        title={`Because You Watched "${byw.because}"`}
                        items={byw.items}
                        {...rowProps}
                      />
                    ) : null
                  )}

                  {recs.hiddenGems?.length > 0 ? (
                    <SectionRow
                      title="Hidden Gems"
                      subtitle="High-rated titles you might have missed"
                      items={recs.hiddenGems}
                      {...rowProps}
                    />
                  ) : null}
                </>
              ) : null}
            </section>
          ) : (
            <motion.div
              className="my-10 flex items-center justify-between rounded-2xl border border-white/8 p-6 glass"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              <div>
                <p className="text-lg font-bold text-white">Get a smarter recommendation feed</p>
                <p className="mt-1 text-sm text-neutral-500">
                  Set genres, languages, region, and location preference once. We keep it ready even if you later sign in with Google or GitHub.
                </p>
              </div>
              <button
                onClick={openAuth}
                className="flex-shrink-0 rounded-xl bg-accent px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-accent-dark hover:shadow-glow-red"
              >
                Sign In Free
              </button>
            </motion.div>
          )}

          <div className="my-8">
            <TitleWithIcon
              icon={Award01Icon}
              title="The GOATs"
              subtitle="Greatest of all time across movies, series, and anime"
            />
          </div>

          <SectionRow title="Goated Movies" subtitle="Greatest films ever made" items={goatedMovies} {...rowProps} />
          <SectionRow title="Goated Series" subtitle="Legendary television" items={goatedSeries} {...rowProps} />
          <SectionRow title="Goated Anime" subtitle="Essential anime classics" items={goatedAnime} {...rowProps} />

          <AdBanner slot="horizontal" />

          <div className="my-10 border-t border-white/5" />

          <GenreRow title={<TitleWithIcon icon={Sword01Icon} title="Action" />} items={action} genreId={28} {...rowProps} />
          <GenreRow title={<TitleWithIcon icon={LaughingIcon} title="Comedy" />} items={comedy} genreId={35} {...rowProps} />
          <GenreRow title={<TitleWithIcon icon={SparklesIcon} title="Thriller" />} items={thriller} genreId={53} {...rowProps} />
          <GenreRow title={<TitleWithIcon icon={SkullIcon} title="Horror" />} items={horror} genreId={27} {...rowProps} />
          <GenreRow title={<TitleWithIcon icon={PlayIcon} title="Romance" />} items={romance} genreId={10749} {...rowProps} />
          <GenreRow title={<TitleWithIcon icon={GameController03Icon} title="Anime" />} items={anime} genreId={16} {...rowProps} />
          <GenreRow title={<TitleWithIcon icon={Rocket01Icon} title="Sci-Fi" />} items={scifi} genreId={878} {...rowProps} />
          <GenreRow title={<TitleWithIcon icon={Diamond02Icon} title="Documentary" />} items={documentary} genreId={99} {...rowProps} />
          <GenreRow title={<TitleWithIcon icon={MagicWand01Icon} title="Fantasy" />} items={fantasy} genreId={14} {...rowProps} />

          <footer className="my-16 text-center">
            <div className="inline-flex items-center gap-3 rounded-xl border border-white/8 px-5 py-3 glass">
              <img
                src="https://www.themoviedb.org/assets/2/v4/logos/v2/blue_short-8e7b30f73a4020692ccca9c88bafe5dcb6f8a62a4c6bc55cd9ba82bb2cd95f6c.svg"
                alt="TMDB"
                className="h-4 opacity-60"
              />
              <p className="text-xs text-neutral-600">
                This product uses the TMDB API but is not endorsed or certified by TMDB.
                All content belongs to its respective rights holders.
              </p>
            </div>
          </footer>
        </div>
      </main>
    </>
  );
}

function compactMedia(item, overrides = {}) {
  if (!item) return null;

  return {
    id: item.id,
    title: item.title || null,
    name: item.name || null,
    media_type: item.media_type || (item.title ? "movie" : "tv"),
    poster_path: item.poster_path || null,
    backdrop_path: item.backdrop_path || null,
    overview: item.overview || "",
    vote_average: item.vote_average || 0,
    release_date: item.release_date || null,
    first_air_date: item.first_air_date || null,
    genre_ids: item.genre_ids || [],
    popularity: item.popularity || 0,
    origin_country: item.origin_country || [],
    original_language: item.original_language || null,
    trailerKey: item.trailerKey || null,
    ...overrides,
  };
}

function sortByRating(items) {
  return [...items].sort((a, b) => b.vote_average - a.vote_average);
}

export async function getServerSideProps() {
  try {
    const [
      trendingRaw,
      trendingMoviesRaw,
      trendingTVRaw,
      goatedMoviesRaw,
      goatedSeriesRaw,
      goatedAnimeRaw,
      actionRaw,
      comedyRaw,
      thrillerRaw,
      horrorRaw,
      romanceRaw,
      animeRaw,
      scifiRaw,
      documentaryRaw,
      fantasyRaw,
    ] = await Promise.all([
      fetchTrending(),
      fetchTrendingMovies(),
      fetchTrendingTV(),
      fetchTopRatedMovies(2),
      fetchTopRatedTV(2),
      fetchByGenre(16, 1, "tv"),
      fetchByGenre(28),
      fetchByGenre(35),
      fetchByGenre(53),
      fetchByGenre(27),
      fetchByGenre(10749),
      fetchByGenre(16),
      fetchByGenre(878),
      fetchByGenre(99),
      fetchByGenre(14),
    ]);

    const trendingSorted = [...trendingRaw].sort((a, b) => b.popularity - a.popularity);
    const heroBase = trendingSorted.slice(0, 5);

    const heroSlides = await Promise.all(
      heroBase.map(async (item) => {
        const mediaType = item.media_type || (item.title ? "movie" : "tv");
        const videos = await fetchVideos(item.id, mediaType);
        return compactMedia(item, { trailerKey: videos[0]?.key || null });
      })
    );

    return {
      props: {
        heroSlides,
        trendingItems: trendingSorted.slice(0, 12).map((item) => compactMedia(item)),
        trendingMovies: trendingMoviesRaw.slice(0, 10).map((item) => compactMedia(item, { media_type: "movie" })),
        trendingTV: trendingTVRaw.slice(0, 10).map((item) => compactMedia(item, { media_type: "tv" })),
        goatedMovies: sortByRating(goatedMoviesRaw).slice(0, 10).map((item) => compactMedia(item, { media_type: "movie" })),
        goatedSeries: sortByRating(goatedSeriesRaw).slice(0, 10).map((item) => compactMedia(item, { media_type: "tv" })),
        goatedAnime: sortByRating(goatedAnimeRaw).slice(0, 10).map((item) => compactMedia(item, { media_type: "tv" })),
        action: actionRaw.slice(0, 10).map((item) => compactMedia(item, { media_type: "movie" })),
        comedy: comedyRaw.slice(0, 10).map((item) => compactMedia(item, { media_type: "movie" })),
        thriller: thrillerRaw.slice(0, 10).map((item) => compactMedia(item, { media_type: "movie" })),
        horror: horrorRaw.slice(0, 10).map((item) => compactMedia(item, { media_type: "movie" })),
        romance: romanceRaw.slice(0, 10).map((item) => compactMedia(item, { media_type: "movie" })),
        anime: animeRaw.slice(0, 10).map((item) => compactMedia(item, { media_type: "movie" })),
        scifi: scifiRaw.slice(0, 10).map((item) => compactMedia(item, { media_type: "movie" })),
        documentary: documentaryRaw.slice(0, 10).map((item) => compactMedia(item, { media_type: "movie" })),
        fantasy: fantasyRaw.slice(0, 10).map((item) => compactMedia(item, { media_type: "movie" })),
      },
    };
  } catch (error) {
    console.error("HOME_ERROR:", error.message);
    return { props: {} };
  }
}
