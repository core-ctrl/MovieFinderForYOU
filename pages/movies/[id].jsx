import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import SEOMeta from "../../components/SEOMeta";
import WatchNowButtons from "../../components/WatchNowButtons";
import { SkeletonHero } from "../../components/SkeletonCard";

export default function MovieDetailPage({ addToWishlist, wishlist = [], openTrailer }) {
  const router = useRouter();
  const { id } = router.query;

  // ✅ ALL hooks at top — before any return
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [regionCode, setRegionCode] = useState("IN");
  const [trailerKey, setTrailerKey] = useState(null);
  const [trailerLoading, setTrailerLoading] = useState(false);

  useEffect(() => {
    if (!id) return;

    let region = "IN";
    try {
      const { readStoredPreferences } = require("../../lib/userPreferences");
      const stored = readStoredPreferences();
      region = stored.regions?.[0] || "IN";
    } catch (e) { }

    setRegionCode(region);

    fetch(`/api/media/movie/${id}?region=${region}`)
      .then((r) => r.json())
      .then((data) => {
        setMovie(data);
        const key =
          data.videos?.results?.find((v) => v.type === "Trailer" && v.site === "YouTube")?.key ||
          data.videos?.results?.[0]?.key ||
          null;
        setTrailerKey(key);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  // ✅ early returns AFTER all hooks
  if (loading) return (
    <div className="min-h-screen bg-black pt-20">
      <SkeletonHero />
    </div>
  );

  if (!movie || movie.error) return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-black text-white">
      <p className="text-2xl">Movie not found</p>
      <Link href="/" className="text-red-500 hover:underline">Go Home</Link>
    </div>
  );

  const handlePlayTrailer = async () => {
    if (trailerKey) { openTrailer(trailerKey, movie.title, movie.id, "movie"); return; }
    setTrailerLoading(true);
    try {
      const res = await fetch(`/api/trailer?id=${movie.id}&media_type=movie`);
      const data = await res.json();
      const key = data.trailer?.key || null;
      if (key) { setTrailerKey(key); openTrailer(key, movie.title, movie.id, "movie"); }
      else alert("❌ Trailer not available.");
    } catch { alert("❌ Failed to load trailer."); }
    finally { setTrailerLoading(false); }
  };

  const isInList = wishlist.some((item) => item.id === movie.id);
  const director = movie.credits?.crew?.find((p) => p.job === "Director");
  const ogImage = movie.backdrop_path ? `https://image.tmdb.org/t/p/w1280${movie.backdrop_path}` : undefined;
  const regionalRelease = movie.releaseDates?.find((e) => e.iso_3166_1 === regionCode);
  const inTheaters = Boolean(regionalRelease && movie.release_date && !movie.providers?.flatrate?.length);

  return (
    <div className="min-h-screen bg-black text-white">
      <SEOMeta
        title={`${movie.title} (${movie.release_date?.slice(0, 4)}) — Watch Trailer & Where to Stream`}
        description={movie.overview?.slice(0, 160)}
        image={ogImage}
        url={`/movies/${movie.id}`}
        type="video.movie"
        keywords={[movie.title, "movie trailer", "where to watch", ...(movie.genres?.map((g) => g.name) || [])]}
      />

      {/* Backdrop */}
      <div className="relative h-[55vh] w-full md:h-[75vh]">
        <div className="absolute inset-0 z-10 bg-gradient-to-t from-black via-black/30 to-transparent" />
        <div className="absolute inset-0 z-10 bg-gradient-to-r from-black/60 to-transparent" />
        <img src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`} alt={movie.title} className="h-full w-full object-cover" />
      </div>

      <div className="relative z-20 mx-auto -mt-40 max-w-6xl px-4 md:-mt-56 md:px-6">
        <div className="flex flex-col gap-8 md:flex-row">
          <img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={movie.title}
            className="w-36 flex-shrink-0 rounded-2xl border border-white/10 shadow-2xl md:w-64" />

          <div className="md:pt-16">
            <h1 className="mb-3 text-3xl font-bold md:text-5xl">{movie.title}</h1>
            <div className="mb-4 flex flex-wrap items-center gap-3 text-sm text-neutral-300">
              <span>⭐ {movie.vote_average?.toFixed(1)}</span>
              {movie.release_date && <span>{movie.release_date.slice(0, 4)}</span>}
              {movie.runtime > 0 && <span>{movie.runtime}m</span>}
              <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${movie.status === "Released" ? "bg-green-600/20 text-green-400" : "bg-yellow-600/20 text-yellow-400"}`}>
                {movie.status === "Released" ? "Available" : movie.status}
              </span>
            </div>
            <div className="mb-5 flex flex-wrap gap-2">
              {movie.genres?.map((g) => (
                <span key={g.id} className="rounded-full bg-white/10 px-3 py-1 text-xs">{g.name}</span>
              ))}
            </div>
            <p className="mb-6 max-w-2xl text-sm leading-relaxed text-neutral-300 md:text-base">{movie.overview}</p>
            {director && (
              <p className="mb-6 text-sm text-neutral-400">
                <span className="font-medium text-white">Director:</span> {director.name}
              </p>
            )}
            <div className="flex flex-wrap gap-3">
              <button onClick={handlePlayTrailer} disabled={trailerLoading}
                className="flex items-center gap-2 rounded-xl bg-red-600 px-6 py-3 font-medium text-white transition hover:bg-red-700 disabled:opacity-60">
                {trailerLoading ? "Loading…" : "▶ Play Trailer"}
              </button>
              <button onClick={() => addToWishlist({ ...movie, media_type: "movie" })}
                className={`rounded-xl px-6 py-3 font-medium transition ${isInList ? "border border-green-600/40 bg-green-600/20 text-green-400" : "bg-white/10 text-white hover:bg-white/20"}`}>
                {isInList ? "✓ In My List" : "+ My List"}
              </button>
            </div>
            <WatchNowButtons
              providers={movie.providers}
              title={movie.title}
              region={movie.region || regionCode}
              releaseDate={regionalRelease?.release_dates?.[0]?.release_date || movie.release_date}
              theatrical={inTheaters}
            />
          </div>
        </div>

        {/* Cast */}
        {movie.credits?.cast?.length > 0 && (
          <section className="mt-16">
            <h2 className="mb-6 text-2xl font-bold">Cast</h2>
            <div className="no-scrollbar flex gap-4 overflow-x-auto pb-4">
              {movie.credits.cast.slice(0, 12).map((actor) => (
                <div key={actor.id} className="w-24 flex-none md:w-28">
                  <div className="mb-2 h-32 w-full overflow-hidden rounded-xl bg-white/5 md:h-36">
                    {actor.profile_path ? (
                      <img src={`https://image.tmdb.org/t/p/w185${actor.profile_path}`} alt={actor.name} className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-3xl">👤</div>
                    )}
                  </div>
                  <p className="truncate text-xs font-medium">{actor.name}</p>
                  <p className="truncate text-xs text-neutral-500">{actor.character}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Similar */}
        {movie.similar?.results?.length > 0 && (
          <section className="mb-20 mt-12">
            <h2 className="mb-6 text-2xl font-bold">You May Also Like</h2>
            <div className="no-scrollbar flex gap-4 overflow-x-auto pb-4">
              {movie.similar.results.slice(0, 10).map((m) => (
                <Link key={m.id} href={`/movies/${m.id}`} className="group w-28 flex-none md:w-36">
                  <div className="mb-2 h-40 overflow-hidden rounded-xl border border-white/10 md:h-52">
                    <img src={m.poster_path ? `https://image.tmdb.org/t/p/w300${m.poster_path}` : "/fallback.jpg"}
                      alt={m.title} className="h-full w-full object-cover transition duration-300 group-hover:scale-105" />
                  </div>
                  <p className="truncate text-xs font-medium transition group-hover:text-red-400">{m.title}</p>
                </Link>
              ))}
            </div>
          </section>
        )}

        <div className="pb-12 text-center">
          <a href={`https://www.themoviedb.org/movie/${movie.id}`} target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-xs text-neutral-500 transition hover:text-neutral-300">
            <img src="https://www.themoviedb.org/assets/2/v4/logos/v2/blue_short-8e7b30f73a4020692ccca9c88bafe5dcb6f8a62a4c6bc55cd9ba82bb2cd95f6c.svg"
              alt="TMDB" className="h-3 opacity-50" />
            Data from TMDB
          </a>
        </div>
      </div>
    </div>
  );
}