// components/SectionRow.jsx
import { useRef } from "react";
import MovieCard from "./MovieCard";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

export default function SectionRow({
  title,
  subtitle,
  items = [],
  renderItem,
  isEmptyFallbackMessage,
  wishlist,
  addToWishlist,
  openAuth,
  onPlayTrailer,
}) {
  const scrollRef = useRef(null);

  const scroll = (dir) => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({ left: dir * 600, behavior: "smooth" });
  };

  if (!items || items.length === 0) {
    return (
      <section className="mb-12">
        <h3 className="text-xl font-bold mb-3">{title}</h3>
        <p className="text-neutral-500 text-sm">
          {isEmptyFallbackMessage || "Nothing here yet."}
        </p>
      </section>
    );
  }

  return (
    <section className="mb-12">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-xl md:text-2xl font-bold text-white">{title}</h3>
          {subtitle && <p className="text-sm text-neutral-400">{subtitle}</p>}
        </div>
        {/* Scroll buttons — desktop only */}
        <div className="hidden md:flex gap-2">
          <button
            onClick={() => scroll(-1)}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition"
          >
            <FaChevronLeft size={12} />
          </button>
          <button
            onClick={() => scroll(1)}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition"
          >
            <FaChevronRight size={12} />
          </button>
        </div>
      </div>

      {/* Cards */}
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto no-scrollbar py-2"
        style={{ scrollSnapType: "x mandatory" }}
      >
        {items.map((movie) => (
          <div
            key={movie.id}
            className="flex-none w-36 md:w-44 snap-start"
          >
            {renderItem ? (
              renderItem(movie)
            ) : (
              // FIX: was movie={movie}, must be item={movie}
              <MovieCard
                item={movie}
                wishlist={wishlist}
                addToWishlist={addToWishlist}
                openAuth={openAuth}
                onPlayTrailer={onPlayTrailer}
              />
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
