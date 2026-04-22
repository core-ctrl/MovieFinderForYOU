/ pages/movies / [id].jsx
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import SEOMeta, { movieSchema } from "../../components/SEOMeta";
import { SkeletonHero } from "../../components/SkeletonCard";

export default function MovieDetailPage({ addToWishlist, wishlist = [], openTrailer }) {
  const router = useRouter();
  const { id } = router.query;
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/media/movie/${id}`)
      .then(r => r.json()).then(setMovie).catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="bg-black min-h-screen pt-20"><SkeletonHero /></div>;

  if (!movie || movie.error)
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center gap-4">
        <p className="text-2xl">Movie not found</p>
        <Link href="/" className="text-red-500 hover:underline">← Go Home</Link>
      </div>
    );

  const trailer = movie.videos?.results?.find(v => v.type === "Trailer" && v.site === "YouTube") || movie.videos?.results?.[0];
  const isInList = wishlist.some(m => m.id === movie.id);
  const director = movie.credits?.crew?.find(c => c.job === "Director");
  const ogImage = movie.backdrop_path ? `https://image.tmdb.org/t/p/w1280${movie.backdrop_path}` : undefined;

  return (
    <div className="min-h-screen bg-black text-white">
      <SEOMeta
        title={`${movie.title} (${movie.release_date?.slice(0, 4)}) — Watch Trailer & Where to Stream`}
        description={movie.overview?.slice(0, 160)}
        image={ogImage}
        url={`https://www.moviefinderforyou.com/movies/${movie.id}`}
        type="video.movie"
        jsonLd={movieSchema(movie)}
      />

      {/* Backdrop */}
      <div className="relative w-full h-[55vh] md:h-[75vh]">
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent z-10" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent z-10" />
        <img src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`} alt={movie.title} className="w-full h-full object-cover" />
      </div>

      <div className="max-w-6xl mx-auto px-4 md:px-6 -mt-40 md:-mt-56 relative z-20">
        <div className="flex flex-col md:flex-row gap-8">
          <img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={movie.title}
            className="w-36 md:w-64 rounded-2xl shadow-2xl border border-white/10 flex-shrink-0" />

          <div className="md:pt-16">
            <h1 className="text-3xl md:text-5xl font-bold mb-3">{movie.title}</h1>
            <div className="flex flex-wrap items-center gap-3 text-sm text-neutral-300 mb-4">
              <span>⭐ {movie.vote_average?.toFixed(1)}</span>
              {movie.release_date && <span>{movie.release_date.slice(0, 4)}</span>}
              {movie.runtime > 0 && <span>{movie.runtime}m</span>}
              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${movie.status === "Released" ? "bg-green-600/20 text-green-400" : "bg-yellow-600/20 text-yellow-400"}`}>
                {movie.status === "Released" ? "Available" : movie.status}
              </span>
            </div>
            <div className="flex flex-wrap gap-2 mb-5">
              {movie.genres?.map(g => <span key={g.id} className="px-3 py-1 bg-white/10 rounded-full text-xs">{g.name}</span>)}
            </div>
            <p className="text-neutral-300 max-w-2xl leading-relaxed mb-6 text-sm md:text-base">{movie.overview}</p>
            {director && <p className="text-sm text-neutral-400 mb-6"><span className="text-white font-medium">Director:</span> {director.name}</p>}
            <div className="flex flex-wrap gap-3">
              <button onClick={() => openTrailer(trailer?.key, movie.title, movie.id, "movie")}
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl font-medium flex items-center gap-2 transition">
                ▶ Play Trailer
              </button>
              <button onClick={() => addToWishlist({ ...movie, media_type: "movie" })}
                className={`px-6 py-3 rounded-xl font-medium transition ${isInList ? "bg-green-600/20 text-green-400 border border-green-600/40" : "bg-white/10 hover:bg-white/20 text-white"}`}>
                {isInList ? "✓ In My List" : "+ My List"}
              </button>
            </div>
          </div>
        </div>

        {/* Cast */}
        {movie.credits?.cast?.length > 0 && (
          <section className="mt-16">
            <h2 className="text-2xl font-bold mb-6">Cast</h2>
            <div className="flex gap-4 overflow-x-auto no-scrollbar pb-4">
              {movie.credits.cast.slice(0, 12).map(actor => (
                <div key={actor.id} className="flex-none w-24 md:w-28">
                  <div className="w-full h-32 md:h-36 rounded-xl overflow-hidden bg-white/5 mb-2">
                    {actor.profile_path
                      ? <img src={`https://image.tmdb.org/t/p/w185${actor.profile_path}`} alt={actor.name} className="w-full h-full object-cover" />
                      : <div className="w-full h-full flex items-center justify-center text-3xl">👤</div>}
                  </div>
                  <p className="text-xs font-medium truncate">{actor.name}</p>
                  <p className="text-xs text-neutral-500 truncate">{actor.character}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Where to Watch */}
        {movie.providers?.flatrate?.length > 0 && (
          <section className="mt-12 mb-8">
            <h2 className="text-xl font-bold mb-4">Where to Watch</h2>
            <div className="flex gap-4 flex-wrap">
              {movie.providers.flatrate.map(p => (
                <div key={p.provider_id} className="flex flex-col items-center gap-1">
                  <img src={`https://image.tmdb.org/t/p/w92${p.logo_path}`} alt={p.provider_name} title={p.provider_name} className="w-12 h-12 rounded-xl border border-white/10" />
                  <span className="text-xs text-neutral-400 text-center w-14 truncate">{p.provider_name}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Similar */}
        {movie.similar?.results?.length > 0 && (
          <section className="mt-12 mb-20">
            <h2 className="text-2xl font-bold mb-6">You May Also Like</h2>
            <div className="flex gap-4 overflow-x-auto no-scrollbar pb-4">
              {movie.similar.results.slice(0, 10).map(m => (
                <Link key={m.id} href={`/movies/${m.id}`} className="flex-none w-28 md:w-36 group">
                  <div className="rounded-xl overflow-hidden border border-white/10 mb-2 h-40 md:h-52">
                    <img src={m.poster_path ? `https://image.tmdb.org/t/p/w300${m.poster_path}` : "/fallback.jpg"} alt={m.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
                  </div>
                  <p className="text-xs font-medium truncate group-hover:text-red-400 transition">{m.title}</p>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* TMDB Attribution */}
        <div className="pb-12 text-center">
          <a href={`https://www.themoviedb.org/movie/${movie.id}`} target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-xs text-neutral-500 hover:text-neutral-300 transition">
            <img src="https://www.themoviedb.org/assets/2/v4/logos/v2/blue_short-8e7b30f73a4020692ccca9c88bafe5dcb6f8a62a4c6bc55cd9ba82bb2cd95f6c.svg" alt="TMDB" className="h-3 opacity-50" />
            Data from TMDB
          </a>
        </div>
      </div>
    </div>
  );
}