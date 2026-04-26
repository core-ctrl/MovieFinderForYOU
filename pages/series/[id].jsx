// pages/series/[id].jsx
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { PlayIcon, PlusSignIcon, UserIcon } from "@hugeicons/core-free-icons";
import SEOMeta from "../../components/SEOMeta";
import WatchNowButtons from "../../components/WatchNowButtons";
import { buildMovieSchema } from "../../lib/seo";
import { readStoredPreferences } from "../../lib/userPreferences";
import AppIcon from "../../components/AppIcon";

export default function SeriesDetailPage({ addToWishlist, wishlist = [], openTrailer }) {
  const router = useRouter();
  const { id } = router.query;

  const [show, setShow] = useState(null);
  const [loading, setLoading] = useState(true);
  const [regionCode, setRegionCode] = useState("IN");
  const [trailerKey, setTrailerKey] = useState(null);
  const [trailerLoading, setTrailerLoading] = useState(false);

  useEffect(() => {
    if (!id) return undefined;
    const stored = readStoredPreferences();
    const nextRegion = stored.regions?.[0] || "IN";
    setRegionCode(nextRegion);
    fetch(`/api/media/tv/${id}?region=${nextRegion}`)
      .then((r) => r.json())
      .then((data) => {
        setShow(data);
        const key =
          data.videos?.results?.find((v) => v.type === "Trailer" && v.site === "YouTube")?.key ||
          data.videos?.results?.[0]?.key ||
          null;
        setTrailerKey(key);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading)
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );

  if (!show || show.error)
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center gap-4">
        <p className="text-2xl">Series not found</p>
        <Link href="/" className="text-red-500 hover:underline">← Go Home</Link>
      </div>
    );

  const handlePlayTrailer = async () => {
    if (trailerKey) {
      openTrailer(trailerKey, show.name, show.id, "tv");
      return;
    }
    setTrailerLoading(true);
    try {
      const res = await fetch(`/api/trailer?id=${show.id}&media_type=tv`);
      const data = await res.json();
      const key = data.trailer?.key || null;
      if (key) {
        setTrailerKey(key);
        openTrailer(key, show.name, show.id, "tv");
      } else {
        alert("❌ Trailer not available.");
      }
    } catch {
      alert("❌ Failed to load trailer.");
    } finally {
      setTrailerLoading(false);
    }
  };

  const isInList = wishlist.some((m) => m.id === show.id);
  const creator = show.created_by?.[0];

  return (
    <div className="min-h-screen bg-black text-white">
      <SEOMeta
        title={`${show.name} (${show.first_air_date?.slice(0, 4)}) — Series Guide and Trailer`}
        description={show.overview?.slice(0, 160)}
        image={show.backdrop_path ? `https://image.tmdb.org/t/p/w1280${show.backdrop_path}` : undefined}
        url={`/series/${show.id}`}
        type="video.tv_show"
        jsonLd={buildMovieSchema(show, `/series/${show.id}`, "TVSeries")}
        keywords={[show.name, "series trailer", "where to watch", ...(show.genres?.map((genre) => genre.name) || [])]}
      />

      {/* Backdrop */}
      <div className="relative w-full h-[55vh] md:h-[75vh]">
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent z-10" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent z-10" />
        <img
          src={`https://image.tmdb.org/t/p/original${show.backdrop_path}`}
          alt={show.name}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="max-w-6xl mx-auto px-4 md:px-6 -mt-40 md:-mt-56 relative z-20">
        <div className="flex flex-col md:flex-row gap-8">
          <img
            src={`https://image.tmdb.org/t/p/w500${show.poster_path}`}
            alt={show.name}
            className="w-36 md:w-64 rounded-2xl shadow-2xl border border-white/10 flex-shrink-0"
          />

          <div className="md:pt-16">
            <h1 className="text-3xl md:text-5xl font-bold mb-3">{show.name}</h1>

            <div className="flex flex-wrap items-center gap-3 text-sm text-neutral-300 mb-4">
              <span>⭐ {show.vote_average?.toFixed(1)}</span>
              {show.first_air_date && <span>{show.first_air_date.slice(0, 4)}</span>}
              {show.number_of_seasons > 0 && (
                <span>{show.number_of_seasons} Season{show.number_of_seasons !== 1 ? "s" : ""}</span>
              )}
              <span
                className={`px-2 py-0.5 rounded-full text-xs font-medium ${show.status === "Returning Series"
                  ? "bg-green-600/20 text-green-400"
                  : "bg-neutral-600/30 text-neutral-300"
                  }`}
              >
                {show.status}
              </span>
            </div>

            <div className="flex flex-wrap gap-2 mb-5">
              {show.genres?.map((g) => (
                <span key={g.id} className="px-3 py-1 bg-white/10 rounded-full text-xs">
                  {g.name}
                </span>
              ))}
            </div>

            <p className="text-neutral-300 max-w-2xl leading-relaxed mb-8 text-sm md:text-base">
              {show.overview}
            </p>

            {creator && (
              <p className="text-sm text-neutral-400 mb-6">
                <span className="text-white font-medium">Creator:</span> {creator.name}
              </p>
            )}

            <div className="flex flex-wrap gap-3">
              <button
                onClick={handlePlayTrailer}
                disabled={trailerLoading}
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl font-medium flex items-center gap-2 transition disabled:opacity-60"
              >
                <AppIcon icon={PlayIcon} size={17} className="fill-current" />
                {trailerLoading ? "Loading…" : "Play Trailer"}
              </button>
              <button
                onClick={() => addToWishlist({ ...show, media_type: "tv", title: show.name })}
                className={`px-6 py-3 rounded-xl font-medium transition ${isInList
                  ? "bg-green-600/20 text-green-400 border border-green-600/40"
                  : "bg-white/10 hover:bg-white/20 text-white"
                  }`}
              >
                {isInList ? "In My List" : <span className="inline-flex items-center gap-2"><AppIcon icon={PlusSignIcon} size={16} />My List</span>}
              </button>
            </div>
            <WatchNowButtons providers={show.providers} title={show.name} region={show.region || regionCode} />
          </div>
        </div>

        {/* Cast */}
        {show.credits?.cast?.length > 0 && (
          <section className="mt-16">
            <h2 className="text-2xl font-bold mb-6">Cast</h2>
            <div className="flex gap-4 overflow-x-auto no-scrollbar pb-4">
              {show.credits.cast.slice(0, 12).map((actor) => (
                <div key={actor.id} className="flex-none w-24 md:w-28">
                  <div className="w-full h-32 md:h-36 rounded-xl overflow-hidden bg-white/5 mb-2">
                    {actor.profile_path ? (
                      <img
                        src={`https://image.tmdb.org/t/p/w185${actor.profile_path}`}
                        alt={actor.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-neutral-500">
                        <AppIcon icon={UserIcon} size={26} />
                      </div>
                    )}
                  </div>
                  <p className="text-xs font-medium truncate">{actor.name}</p>
                  <p className="text-xs text-neutral-500 truncate">{actor.character}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Similar */}
        {show.similar?.results?.length > 0 && (
          <section className="mt-12 mb-20">
            <h2 className="text-2xl font-bold mb-6">You May Also Like</h2>
            <div className="flex gap-4 overflow-x-auto no-scrollbar pb-4">
              {show.similar.results.slice(0, 10).map((s) => (
                <Link key={s.id} href={`/series/${s.id}`} className="flex-none w-28 md:w-36 group">
                  <div className="rounded-xl overflow-hidden border border-white/10 mb-2 h-40 md:h-52">
                    <img
                      src={s.poster_path ? `https://image.tmdb.org/t/p/w300${s.poster_path}` : "/fallback.jpg"}
                      alt={s.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    />
                  </div>
                  <p className="text-xs font-medium truncate group-hover:text-red-400 transition">{s.name}</p>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
