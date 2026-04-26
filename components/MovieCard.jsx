// components/MovieCard.jsx
import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import Link from "next/link";
import { FavouriteIcon, PlayIcon } from "@hugeicons/core-free-icons";
import LazyImage from "./LazyImage";
import AppIcon from "./AppIcon";
import { toggleWatchlist, toggleGuestWatchlist, selectInWatchlist } from "../store/slices/watchlistSlice";
import { openTrailer, openAuthModal } from "../store/slices/uiSlice";
import { selectUser } from "../store/slices/authSlice";

function isLikelyTheatrical(item, nowPlayingIds) {
  const isMovie = item.media_type === "movie" || item.title;
  if (!isMovie) return false;

  if (nowPlayingIds && nowPlayingIds.size > 0) {
    return nowPlayingIds.has(item.id);
  }

  if (item?.availability?.theatrical?.length) return true;
  const releaseDate = item?.release_date || item?.first_air_date;
  if (!releaseDate) return false;
  const date = new Date(releaseDate);
  if (Number.isNaN(date.getTime())) return false;
  const diffDays = (Date.now() - date.getTime()) / (1000 * 60 * 60 * 24);
  return diffDays >= -7 && diffDays <= 45 && !item?.availability?.flatrate?.length;
}

export default function MovieCard({ item, nowPlayingIds }) {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const isInList = useSelector(selectInWatchlist(item?.id));
  const [hovered, setHovered] = useState(false);
  const [popPos, setPopPos] = useState("center");
  const [trailerLoading, setTrailerLoading] = useState(false);
  const cardRef = useRef(null);
  const hoverTimer = useRef(null);

  if (!item) return null;

  const isMovie = item.media_type === "movie" || item.title;
  const href = isMovie ? `/movies/${item.id}` : `/series/${item.id}`;
  const poster = item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : "/fallback.jpg";
  const title = item.title || item.name;
  const year = (item.release_date || item.first_air_date || "").slice(0, 4);
  const rating = item.vote_average?.toFixed(1);
  const inTheaters = isLikelyTheatrical(item, nowPlayingIds);

  const handleEnter = () => {
    hoverTimer.current = setTimeout(() => {
      if (cardRef.current) {
        const { left, right } = cardRef.current.getBoundingClientRect();
        if (left < 200) setPopPos("left");
        else if (window.innerWidth - right < 200) setPopPos("right");
        else setPopPos("center");
      }
      setHovered(true);
    }, 180);
  };
  const handleLeave = () => { clearTimeout(hoverTimer.current); setHovered(false); };

  const handleWishlist = (e) => {
    e.preventDefault(); e.stopPropagation();
    if (!user) { dispatch(openAuthModal("login")); return; }
    dispatch(toggleWatchlist(item));
  };

  const handleTrailer = async (e) => {
    e.preventDefault(); e.stopPropagation();
    const mediaType = item.media_type || (isMovie ? "movie" : "tv");

    // If we already have the key, open immediately
    if (item.trailerKey) {
      dispatch(openTrailer({ key: item.trailerKey, title, id: item.id, type: mediaType }));
      return;
    }

    // Otherwise fetch on-demand
    setTrailerLoading(true);
    try {
      const res = await fetch(`/api/trailer?id=${item.id}&media_type=${mediaType}`);
      const data = await res.json();
      const key = data.trailer?.key || null;
      if (key) {
        dispatch(openTrailer({ key, title, id: item.id, type: mediaType }));
      } else {
        alert("❌ Trailer not available.");
      }
    } catch {
      alert("❌ Failed to load trailer.");
    } finally {
      setTrailerLoading(false);
    }
  };

  const popX = popPos === "left" ? "0%" : popPos === "right" ? "-65%" : "-50%";

  return (
    <div ref={cardRef} className="relative overflow-visible"
      onMouseEnter={handleEnter} onMouseLeave={handleLeave}>

      {/* Poster */}
      <Link href={href}>
        <motion.div
          className="poster-card w-full aspect-[2/3] rounded-card overflow-hidden"
          whileHover={{ scale: 1.03 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        >
          <LazyImage
            src={poster}
            alt={title}
            className="w-full h-full object-cover"
          />

          {inTheaters ? (
            <div className="absolute left-2 top-2 z-20 rounded-full border border-amber-400/30 bg-amber-500/85 px-2 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-black">
              Theater
            </div>
          ) : null}

          {/* Overlay - always visible for text readability */}
          <div
            className="absolute inset-0 flex flex-col justify-end p-3"
            style={{ background: "linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 60%)" }}
          >
            <p className="text-white text-xs font-bold line-clamp-2 leading-snug">{title}</p>
            <div className="flex items-center gap-2 mt-1">
              {rating > 0 && <span className="text-yellow-400 text-xs">★ {rating}</span>}
              {year && <span className="text-neutral-400 text-xs">{year}</span>}
            </div>
          </div>
        </motion.div>
      </Link>

      {/* Wishlist button */}
      <AnimatePresence>
        {hovered && (
          <motion.button onClick={handleWishlist}
            initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }}
            className="absolute top-2 right-2 z-20 w-8 h-8 glass rounded-full flex items-center justify-center text-sm border border-white/20 hover:border-white/40 transition-colors"
          >
            <AppIcon icon={FavouriteIcon} size={14} className={isInList ? "fill-current text-white" : "text-white"} />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Hover Preview Card */}
      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 8 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="absolute z-[9999] w-72 bg-neutral-900/95 rounded-2xl overflow-hidden shadow-2xl border border-white/10 pointer-events-auto"
            style={{ top: "-4px", left: "50%", transform: `translateX(${popX})` }}
          >
            <div className="relative h-40">
              {item.trailerKey ? (
                <iframe
                  className="w-full h-full object-cover"
                  src={`https://www.youtube.com/embed/${item.trailerKey}?autoplay=1&mute=1&controls=0&loop=1&playlist=${item.trailerKey}&playsinline=1&vq=hd2160`}
                  title={title}
                  allow="autoplay; encrypted-media; picture-in-picture"
                  allowFullScreen={false}
                  style={{ border: "none" }}
                />
              ) : (
                <LazyImage
                  src={item.backdrop_path ? `https://image.tmdb.org/t/p/w780${item.backdrop_path}` : poster}
                  alt={title} className="w-full h-full object-cover"
                />
              )}
              <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(17,17,17,0.95) 0%, transparent 60%)" }} />
              <button onClick={handleTrailer}
                disabled={trailerLoading}
                className="absolute bottom-3 left-3 bg-white text-black px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 hover:bg-neutral-200 transition-colors disabled:opacity-50">
                <AppIcon icon={PlayIcon} size={14} className="fill-current" />
                {trailerLoading ? "Loading…" : "Trailer"}
              </button>
              <button onClick={handleWishlist}
                className="absolute bottom-3 right-3 glass w-8 h-8 rounded-full flex items-center justify-center text-sm border border-white/20">
                <AppIcon icon={FavouriteIcon} size={14} className={isInList ? "fill-current text-white" : "text-white"} />
              </button>
            </div>
            <div className="p-4">
              <h3 className="font-bold text-white text-sm mb-1.5 line-clamp-1">{title}</h3>
              <div className="flex items-center gap-3 text-xs text-neutral-400 mb-2">
                {year && <span>{year}</span>}
                {rating > 0 && <span className="text-yellow-400">★ {rating}</span>}
                <span className="px-1.5 py-0.5 bg-white/8 rounded-md">{isMovie ? "Movie" : "Series"}</span>
                {inTheaters ? <span className="px-1.5 py-0.5 rounded-md bg-amber-500/15 text-amber-300">In theaters</span> : null}
              </div>
              {item.overview && (
                <p className="text-xs text-neutral-500 line-clamp-3 leading-relaxed">{item.overview}</p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

