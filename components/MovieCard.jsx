import { useState, useRef } from "react";
import MovieCardHover from "./MovieCardHover";

export default function MovieCard({
  item,
  addToWishlist,
  wishlist = [],
  openAuth,
  onPlayTrailer,
}) {
  const [hovered, setHovered] = useState(false);
  const [position, setPosition] = useState("center");
  const cardRef = useRef(null);
  const timer = useRef(null);

  const movie = item;
  if (!movie) return null;

  const poster = movie.poster_path
    ? `${process.env.NEXT_PUBLIC_TMDB_IMAGE}/w500${movie.poster_path}`
    : "/fallback.jpg";

  const handleMouseEnter = () => {
    timer.current = setTimeout(() => {
      if (cardRef.current) {
        const rect = cardRef.current.getBoundingClientRect();
        const screenW = window.innerWidth;

        if (rect.left < 160) setPosition("left");
        else if (screenW - rect.right < 160) setPosition("right");
        else setPosition("center");
      }

      setHovered(true);
    }, 180);
  };

  const handleMouseLeave = () => {
    clearTimeout(timer.current);
    setHovered(false);
  };

  const handleWishlist = (e) => {
    e.stopPropagation();
    if (!wishlist && openAuth) return openAuth();
    addToWishlist(movie);
  };

  const handleTrailer = () => {
    const key =
      movie.trailerKey ||
      movie.videos?.[0]?.key ||
      movie.video_key ||
      null;

    onPlayTrailer(key, movie.title || movie.name, movie.id, movie.media_type || (movie.title ? "movie" : "tv"));
  };

  return (
    <div
      ref={cardRef}
      className="
        relative 
        overflow-visible      /* SUPER IMPORTANT */
        group cursor-pointer 
        transition-transform duration-300 
      "
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Poster */}
      <img
        src={poster}
        alt={movie.title}
        className="w-full h-72 object-cover rounded-lg shadow-lg"
        onClick={handleTrailer}
      />

      {/* Heart */}
      <button
        onClick={handleWishlist}
        className="
          absolute top-2 right-2 z-20 
          bg-black/60 backdrop-blur-sm 
          w-9 h-9 rounded-full flex items-center justify-center
          text-white opacity-0 group-hover:opacity-100 transition
        "
      >
        {wishlist.some((m) => m.id === movie.id) ? "❤️" : "🤍"}
      </button>

      {/* Play Button */}
      <div className="absolute bottom-3 left-3 z-20 opacity-0 group-hover:opacity-100 transition">
        <button
          onClick={(e) => { e.stopPropagation(); handleTrailer(); }}
          className="px-3 py-1 bg-white text-black rounded-lg font-semibold text-sm flex items-center gap-2"
        >
          ▶ Play Trailer
        </button>
      </div>

      {/* The hover preview card */}
      {hovered && (
        <MovieCardHover
          item={movie}
          position={position}
          wishlist={wishlist}
          addToWishlist={addToWishlist}
          openAuth={openAuth}
          onPlayTrailer={onPlayTrailer}
        />
      )}
    </div>
  );
}
