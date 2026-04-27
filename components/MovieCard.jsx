// components/MovieCard.jsx
import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import Link from "next/link";
import { toggleWatchlist, selectInWatchlist } from "../store/slices/watchlistSlice";
import { openAuthModal } from "../store/slices/uiSlice";
import { selectUser } from "../store/slices/authSlice";

export default function MovieCard({ item }) {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const isInList = useSelector(selectInWatchlist(item?.id));
  const [hovered, setHovered] = useState(false);
  const [popPos, setPopPos] = useState("center");
  const cardRef = useRef(null);
  const hoverTimer = useRef(null);

  if (!item) return null;

  const isMovie = item.media_type === "movie" || item.title;
  const href = isMovie ? `/movies/${item.id}` : `/series/${item.id}`;
  const poster = item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : "/fallback.jpg";
  const title = item.title || item.name;
  const year = (item.release_date || item.first_air_date || "").slice(0, 4);
  const rating = item.vote_average?.toFixed(1);

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

  const handleTrailer = (e) => {
    e.preventDefault();
    e.stopPropagation();
    window.location.href = href;
  };

  const popX = popPos === "left" ? "0%" : popPos === "right" ? "-65%" : "-50%";

  return (
    <div ref={cardRef} className="relative overflow-visible"
      onMouseEnter={handleEnter} onMouseLeave={handleLeave}>

      <Link href={href}>
        <motion.div
          className="poster-card w-full aspect-[2/3] rounded-card overflow-hidden"
          whileHover={{ scale: 1.03 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        >
          <img src={poster} alt={title} loading="lazy" className="w-full h-full object-cover" />
          <motion.div
            className="absolute inset-0 flex flex-col justify-end p-3"
            style={{ background: "linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 60%)" }}
            initial={{ opacity: 0 }} whileHover={{ opacity: 1 }}
            transition={{ duration: 0.25 }}
          >
            <p className="text-white text-xs font-bold line-clamp-2">{title}</p>
            <div className="flex items-center gap-2 mt-1">
              {rating > 0 && <span className="text-yellow-400 text-xs">★ {rating}</span>}
              {year && <span className="text-neutral-400 text-xs">{year}</span>}
            </div>
          </motion.div>
        </motion.div>
      </Link>

      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 8 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="absolute z-[9999] w-72 glass-strong rounded-2xl overflow-hidden shadow-2xl border border-white/10 pointer-events-auto"
            style={{ top: "-4px", left: "50%", transform: `translateX(${popX})` }}
          >
            <div className="relative h-40">
              <img
                src={item.backdrop_path ? `https://image.tmdb.org/t/p/w780${item.backdrop_path}` : poster}
                alt={title} className="w-full h-full object-cover"
              />
              <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(17,17,17,0.95) 0%, transparent 60%)" }} />

              <button onClick={handleTrailer}
                className="absolute bottom-3 left-3 bg-white text-black px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 hover:bg-neutral-200 transition-colors">
                ▶ Trailer
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
                <span className="px-1.5 py-0.5 bg-white/10 rounded-md">{isMovie ? "Movie" : "Series"}</span>
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