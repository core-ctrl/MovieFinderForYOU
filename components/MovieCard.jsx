// components/MovieCard.jsx
// FIX #3: If item.trailerKey is missing (cards don't get it from SSR),
// we fetch it from TMDB on demand when the user clicks Play Trailer.

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

export default function MovieCard({ item, addToWishlist, wishlist = [], openAuth, onPlayTrailer }) {
  const [hovered, setHovered] = useState(false);
  const [pos, setPos] = useState("center");
  const [fetchingTrailer, setFetchingTrailer] = useState(false);
  const cardRef = useRef(null);
  const timer = useRef(null);

  if (!item) return null;

  const isMovie = item.media_type === "movie" || item.title;
  const href = isMovie ? `/movies/${item.id}` : `/series/${item.id}`;
  const poster = item.poster_path
    ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
    : "/fallback.jpg";
  const isInList = wishlist.some(m => m.id === item.id);
  const title = item.title || item.name;
  const year = (item.release_date || item.first_air_date || "").slice(0, 4);
  const rating = item.vote_average?.toFixed(1);

  const handleEnter = () => {
    timer.current = setTimeout(() => {
      if (cardRef.current) {
        const rect = cardRef.current.getBoundingClientRect();
        const sw = window.innerWidth;
        if (rect.left < 180) setPos("left");
        else if (sw - rect.right < 180) setPos("right");
        else setPos("center");
      }
      setHovered(true);
    }, 200);
  };

  const handleLeave = () => { clearTimeout(timer.current); setHovered(false); };

  /* ─────────────────────────────────────────────────────────────
     FIX #3: Fetch trailer key on demand if item.trailerKey is
     missing. Cards only have trailerKey if it was pre-fetched
     server-side (only hero slides get that). For regular cards,
     we hit the TMDB videos endpoint at click time.
  ───────────────────────────────────────────────────────────── */
  const resolveTrailerKey = async () => {
    // Already have it
    if (item.trailerKey) return item.trailerKey;
    // Check nested videos array
    if (item.videos?.results?.length) {
      const vid = item.videos.results.find(
        v => (v.type === "Trailer" || v.type === "Teaser") && v.site === "YouTube"
      );
      if (vid?.key) return vid.key;
    }
    // Fetch from TMDB via our own API proxy
    try {
      const mediaType = item.media_type || (isMovie ? "movie" : "tv");
      const res = await fetch(`/api/tmdb/videos?id=${item.id}&type=${mediaType}`);
      if (res.ok) {
        const data = await res.json();
        const vid = (data.results || []).find(
          v => (v.type === "Trailer" || v.type === "Teaser") && v.site === "YouTube"
        );
        return vid?.key || null;
      }
    } catch { }
    return null;
  };

  const handleTrailer = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (fetchingTrailer) return;
    setFetchingTrailer(true);
    const key = await resolveTrailerKey();
    setFetchingTrailer(false);
    // openTrailer(key, title, id, type) — matches _app.js signature
    onPlayTrailer?.(key, title, item.id, item.media_type || (isMovie ? "movie" : "tv"));
  };

  const handleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!addToWishlist && openAuth) return openAuth();
    addToWishlist?.(item);
  };

  const popX = pos === "left" ? "0%" : pos === "right" ? "-60%" : "-50%";

  return (
    <div ref={cardRef} className="relative overflow-visible"
      onMouseEnter={handleEnter} onMouseLeave={handleLeave}>
      {/* Poster */}
      <Link href={href}>
        <motion.div className="poster-card w-full aspect-[2/3]"
          whileHover={{ scale: 1.03 }} transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}>
          <img src={poster} alt={title} loading="lazy" />
          <div className="absolute inset-0 flex flex-col justify-end p-3 opacity-0 hover:opacity-100 transition-opacity duration-300 z-10">
            <p className="text-white text-xs font-bold line-clamp-2 leading-tight">{title}</p>
            <div className="flex items-center gap-2 mt-1">
              {rating > 0 && <span className="text-yellow-400 text-xs">★ {rating}</span>}
              {year && <span className="text-neutral-400 text-xs">{year}</span>}
            </div>
          </div>
        </motion.div>
      </Link>

      {/* Heart */}
      <motion.button onClick={handleWishlist}
        className="absolute top-2 right-2 z-20 w-8 h-8 rounded-full glass flex items-center justify-center text-sm"
        initial={{ opacity: 0 }} whileHover={{ scale: 1.2 }}
        animate={{ opacity: hovered ? 1 : 0 }}
        transition={{ duration: 0.2 }}>
        {isInList ? "❤️" : "🤍"}
      </motion.button>

      {/* Play button on poster */}
      <AnimatePresence>
        {hovered && (
          <motion.button onClick={handleTrailer}
            initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 4 }}
            className="absolute bottom-3 left-3 z-20 flex items-center gap-1.5 bg-white text-black text-xs font-bold px-3 py-1.5 rounded-lg disabled:opacity-60"
            disabled={fetchingTrailer}>
            {fetchingTrailer ? "⏳" : "▶"} {fetchingTrailer ? "Loading…" : "Play"}
          </motion.button>
        )}
      </AnimatePresence>

      {/* Hover Preview Card */}
      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 8 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="absolute z-[9999] w-72 glass-strong rounded-2xl overflow-hidden shadow-2xl border border-white/10 pointer-events-auto"
            style={{ top: "-8px", left: "50%", transform: `translateX(${popX})` }}
          >
            <div className="relative h-40">
              <img
                src={item.backdrop_path ? `https://image.tmdb.org/t/p/w780${item.backdrop_path}` : poster}
                alt={title} className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-surface-2/90 to-transparent" />
              <button onClick={handleTrailer} disabled={fetchingTrailer}
                className="absolute bottom-3 left-3 bg-white text-black px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 disabled:opacity-60">
                {fetchingTrailer ? "⏳ Loading…" : "▶ Play Trailer"}
              </button>
              <button onClick={handleWishlist}
                className="absolute bottom-3 right-3 glass w-8 h-8 rounded-full flex items-center justify-center text-sm border border-white/20">
                {isInList ? "❤️" : "🤍"}
              </button>
            </div>
            <div className="p-4">
              <h3 className="font-bold text-white text-sm mb-1 line-clamp-1">{title}</h3>
              <div className="flex items-center gap-3 text-xs text-neutral-400 mb-2">
                {year && <span>{year}</span>}
                {rating > 0 && <span className="text-yellow-400">★ {rating}</span>}
                <span className="px-1.5 py-0.5 bg-white/10 rounded text-neutral-300">{isMovie ? "Movie" : "Series"}</span>
              </div>
              {item.overview && <p className="text-xs text-neutral-400 line-clamp-3 leading-relaxed">{item.overview}</p>}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}