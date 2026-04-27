import { useEffect, useState } from "react";
import {
    getMovieDetails,
    getSeriesDetails,
    getMovieProviders,
    getSeriesProviders,
} from "../utils/tmdb";

export default function MovieCardHover({
    item,
    position = "center",
    wishlist = [],
    addToWishlist,
    openAuth,
    onPlayTrailer,
}) {
    const [details, setDetails] = useState(null);
    const [providers, setProviders] = useState([]);
    const [trailerKey, setTrailerKey] = useState(null);

    const isMovie = item.media_type === "movie" || item.title;
    const isInList = wishlist.some((m) => m.id === item.id);

    /* ───────── LOAD DATA ONLY ON HOVER ───────── */
    useEffect(() => {
        let mounted = true;

        async function load() {
            try {
                const d = isMovie
                    ? await getMovieDetails(item.id)
                    : await getSeriesDetails(item.id);

                if (!mounted) return;
                setDetails(d);

                const prov = isMovie
                    ? await getMovieProviders(item.id)
                    : await getSeriesProviders(item.id);

                const region =
                    prov?.results?.IN ||
                    prov?.results?.US ||
                    prov?.results?.GB ||
                    null;

                const flat =
                    region?.flatrate ||
                    region?.rent ||
                    region?.buy ||
                    [];

                setProviders(flat.slice(0, 4));

                const vid = d?.videos?.results?.find(
                    (v) =>
                        (v.type === "Trailer" || v.type === "Teaser") &&
                        v.site === "YouTube"
                );
                setTrailerKey(vid?.key || null);
            } catch { }
        }

        load();
        return () => (mounted = false);
    }, [item.id, isMovie]);

    const backdrop =
        item.backdrop_path || item.poster_path
            ? `https://image.tmdb.org/t/p/w780${item.backdrop_path || item.poster_path}`
            : "/fallback.jpg";

    const playTrailer = async () => {
        if (trailerKey) {
            onPlayTrailer(
                trailerKey,
                item.title || item.name,
                item.id,
                item.media_type || (isMovie ? "movie" : "tv")
            );
            return;
        }
        // Fetch if not preloaded
        try {
            const mediaType = item.media_type || (isMovie ? "movie" : "tv");
            const res = await fetch(`/api/trailer?id=${item.id}&media_type=${mediaType}`);
            const data = await res.json();
            const key = data.trailer?.key || null;
            if (key) {
                onPlayTrailer(key, item.title || item.name, item.id, mediaType);
            } else {
                alert("Trailer not available");
            }
        } catch {
            alert("Failed to load trailer");
        }
    };

    const handleWishlist = (e) => {
        e.stopPropagation();
        if (!wishlist && openAuth) return openAuth();
        addToWishlist(item);
    };

    /* ───────── POSITION LOGIC ───────── */
    const positionClass =
        position === "left"
            ? "left-0"
            : position === "right"
                ? "right-0"
                : "left-1/2 -translate-x-1/2";

    return (
        <div
            className={`
        absolute z-[9999]
        w-[420px]
        ${positionClass}
        -top-6
        bg-neutral-900/95
        rounded-xl
        overflow-hidden
        shadow-[0_20px_60px_rgba(0,0,0,0.9)]
        border border-white/10
        animate-netflixHover
        pointer-events-auto
      `}
        >
            {/* BACKDROP */}
            <div className="relative">
                <img
                    src={backdrop}
                    alt={item.title || item.name}
                    className="w-full h-48 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-900/70 to-transparent" />

                {/* PLAY */}
                <button
                    onClick={playTrailer}
                    className="
            absolute bottom-3 left-3
            bg-white text-black
            px-4 py-2 rounded-lg
            font-bold text-sm
            flex items-center gap-2
          "
                >
                    ▶ Play
                </button>

                {/* WISHLIST */}
                <button
                    onClick={handleWishlist}
                    className="
            absolute bottom-3 right-3
            bg-black/70 backdrop-blur
            w-10 h-10 rounded-full
            flex items-center justify-center
            text-white text-lg
            border border-white/20
          "
                >
                    {isInList ? "❤️" : "🤍"}
                </button>
            </div>

            {/* INFO */}
            <div className="p-4">
                <h3 className="text-lg font-bold text-white">
                    {item.title || item.name}
                </h3>

                <div className="flex items-center gap-3 text-sm text-gray-400 mt-1">
                    {details?.release_date?.slice(0, 4)}
                    {details?.vote_average > 0 && (
                        <span className="text-yellow-400">
                            ⭐ {details.vote_average.toFixed(1)}
                        </span>
                    )}
                    {details?.runtime > 0 && <span>{details.runtime} min</span>}
                    {details?.adult && (
                        <span className="text-red-500 font-semibold">18+</span>
                    )}
                </div>

                <p className="mt-2 text-sm text-gray-300 line-clamp-3">
                    {details?.overview || item.overview}
                </p>

                {/* PROVIDERS */}
                {providers.length > 0 && (
                    <div className="flex gap-2 mt-3">
                        {providers.map((p) => (
                            <img
                                key={p.provider_id}
                                src={`https://image.tmdb.org/t/p/w45${p.logo_path}`}
                                className="w-7 h-7 rounded"
                                alt=""
                            />
                        ))}
                    </div>
                )}
            </div>

            <style>{`
  @keyframes netflixHover {
    0% { opacity: 0; transform: translateY(14px) scale(0.92); }
    100% { opacity: 1; transform: translateY(0) scale(1); }
  }
  .animate-netflixHover {
    animation: netflixHover 0.28s cubic-bezier(0.18, 0.89, 0.32, 1.28);
  }
`}</style>
        </div>
    );
}

