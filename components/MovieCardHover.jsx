<<<<<<< HEAD
=======
// components/MovieCardHover.jsx
>>>>>>> 3b3f76b6b2f75cfb78a3ee46561373052120bd14
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

<<<<<<< HEAD
    /* ───────── LOAD DATA ONLY ON HOVER ───────── */
=======
>>>>>>> 3b3f76b6b2f75cfb78a3ee46561373052120bd14
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

<<<<<<< HEAD
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

=======
                const region = prov?.results?.IN || prov?.results?.US || prov?.results?.GB || null;
                const flat = region?.flatrate || region?.rent || region?.buy || [];
                setProviders(flat.slice(0, 4));

                const vid = d?.videos?.results?.find(
                    (v) => (v.type === "Trailer" || v.type === "Teaser") && v.site === "YouTube"
                );
>>>>>>> 3b3f76b6b2f75cfb78a3ee46561373052120bd14
                setTrailerKey(vid?.key || null);
            } catch { }
        }

        load();
        return () => (mounted = false);
    }, [item.id]);

    const backdrop =
        item.backdrop_path || item.poster_path
            ? `https://image.tmdb.org/t/p/w780${item.backdrop_path || item.poster_path}`
            : "/fallback.jpg";

    const playTrailer = () => {
<<<<<<< HEAD
        if (trailerKey) {
            onPlayTrailer(trailerKey, item.title || item.name);
        }
=======
        if (trailerKey) onPlayTrailer(trailerKey, item.title || item.name);
>>>>>>> 3b3f76b6b2f75cfb78a3ee46561373052120bd14
    };

    const handleWishlist = (e) => {
        e.stopPropagation();
        if (!wishlist && openAuth) return openAuth();
        addToWishlist(item);
    };

<<<<<<< HEAD
    /* ───────── POSITION LOGIC ───────── */
    const positionClass =
        position === "left"
            ? "left-0 translate-x-0"
            : position === "right"
                ? "right-0 translate-x-0"
=======
    const positionClass =
        position === "left"
            ? "left-0"
            : position === "right"
                ? "right-0"
>>>>>>> 3b3f76b6b2f75cfb78a3ee46561373052120bd14
                : "left-1/2 -translate-x-1/2";

    return (
        <div
<<<<<<< HEAD
            className={`
        absolute z-[9999]
        w-[420px]
        ${positionClass}
        -top-6
        bg-[#141414]
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
                    className="w-full h-48 object-cover"
                />

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
=======
            className={`absolute z-[9999] w-80 ${positionClass} -top-6 bg-neutral-900 rounded-xl overflow-hidden shadow-2xl border border-white/10 pointer-events-auto`}
            style={{ animation: "netflixHover 0.28s cubic-bezier(0.18,0.89,0.32,1.28) forwards" }}
        >
            <style>{`@keyframes netflixHover { 0% { opacity:0; transform:translateY(14px) scale(0.92); } 100% { opacity:1; transform:translateY(0) scale(1); } }`}</style>

            {/* BACKDROP */}
            <div className="relative">
                <img src={backdrop} alt={item.title || item.name} className="w-full h-48 object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-900/70 to-transparent" />

                {/* PLAY */}
                <button onClick={playTrailer} className="absolute bottom-3 left-3 bg-white text-black px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2">
>>>>>>> 3b3f76b6b2f75cfb78a3ee46561373052120bd14
                    ▶ Play
                </button>

                {/* WISHLIST */}
<<<<<<< HEAD
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
=======
                <button onClick={handleWishlist} className="absolute bottom-3 right-3 bg-black/70 backdrop-blur w-10 h-10 rounded-full flex items-center justify-center text-white text-lg border border-white/20">
>>>>>>> 3b3f76b6b2f75cfb78a3ee46561373052120bd14
                    {isInList ? "❤️" : "🤍"}
                </button>
            </div>

            {/* INFO */}
            <div className="p-4">
<<<<<<< HEAD
                <h3 className="text-lg font-bold">
                    {item.title || item.name}
                </h3>

                <div className="flex items-center gap-3 text-sm text-gray-400 mt-1">
                    {details?.release_date?.slice(0, 4)}
                    {details?.vote_average && (
                        <span className="text-yellow-400">
                            ⭐ {details.vote_average.toFixed(1)}
                        </span>
                    )}
                    {details?.runtime && <span>{details.runtime} min</span>}
                    {details?.adult && (
                        <span className="text-red-500 font-semibold">18+</span>
                    )}
=======
                <h3 className="text-lg font-bold">{item.title || item.name}</h3>

                <div className="flex items-center gap-3 text-sm text-gray-400 mt-1">
                    {details?.release_date?.slice(0, 4)}
                    {details?.vote_average > 0 && (
                        <span className="text-yellow-400">⭐ {details.vote_average.toFixed(1)}</span>
                    )}
                    {details?.runtime > 0 && <span>{details.runtime} min</span>}
                    {details?.adult && <span className="text-red-500 font-semibold">18+</span>}
>>>>>>> 3b3f76b6b2f75cfb78a3ee46561373052120bd14
                </div>

                <p className="mt-2 text-sm text-gray-300 line-clamp-3">
                    {details?.overview || item.overview}
                </p>

<<<<<<< HEAD
                {/* PROVIDERS */}
                {providers.length > 0 && (
                    <div className="flex gap-2 mt-3">
                        {providers.map((p) => (
                            <img
                                key={p.provider_id}
                                src={`https://image.tmdb.org/t/p/w45${p.logo_path}`}
                                className="w-7 h-7 rounded"
                            />
=======
                {providers.length > 0 && (
                    <div className="flex gap-2 mt-3">
                        {providers.map((p) => (
                            <img key={p.provider_id} src={`https://image.tmdb.org/t/p/w45${p.logo_path}`} className="w-7 h-7 rounded" alt="" />
>>>>>>> 3b3f76b6b2f75cfb78a3ee46561373052120bd14
                        ))}
                    </div>
                )}
            </div>
<<<<<<< HEAD

            {/* ANIMATION */}
            <style jsx>{`
        @keyframes netflixHover {
          0% {
            opacity: 0;
            transform: translateY(14px) scale(0.92);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        .animate-netflixHover {
          animation: netflixHover 0.28s cubic-bezier(0.18, 0.89, 0.32, 1.28);
        }
      `}</style>
        </div>
    );
}
=======
        </div>
    );
}
>>>>>>> 3b3f76b6b2f75cfb78a3ee46561373052120bd14
