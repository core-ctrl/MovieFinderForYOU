// components/TopCarousel.jsx
import { useRef } from "react";
import { motion } from "framer-motion";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import MovieCard from "./MovieCard";

export default function TopCarousel({ items = [], title, onPlayTrailer, addToWishlist, wishlist, openAuth }) {
  const ref = useRef(null);
  const scroll = (dir) => ref.current?.scrollBy({ left: dir * 640, behavior: "smooth" });

  return (
    <motion.section className="mb-14 relative"
      initial={{ opacity: 0, y: 32 }} whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-xl md:text-2xl font-bold text-white">{title}</h3>
        <div className="hidden md:flex gap-1.5">
          <button onClick={() => scroll(-1)} className="w-8 h-8 rounded-full glass border border-white/10 flex items-center justify-center text-white hover:border-white/30 transition-all">
            <FaChevronLeft size={10} />
          </button>
          <button onClick={() => scroll(1)} className="w-8 h-8 rounded-full glass border border-white/10 flex items-center justify-center text-white hover:border-white/30 transition-all">
            <FaChevronRight size={10} />
          </button>
        </div>
      </div>

      <div ref={ref} className="row-scroll hide-scrollbar">
        {items.map((movie, idx) => (
          <div key={movie?.id || idx} className="flex-none w-36 md:w-44 overflow-visible hover:z-50 relative">
            <div className="absolute top-2 left-2 z-20 text-xs font-black text-white/50 select-none">#{idx+1}</div>
            <MovieCard item={movie} wishlist={wishlist} addToWishlist={addToWishlist}
              openAuth={openAuth} onPlayTrailer={onPlayTrailer} />
          </div>
        ))}
      </div>

      {/* Fade edges */}
      <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-black to-transparent pointer-events-none z-10" />
      <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-black to-transparent pointer-events-none z-10" />
    </motion.section>
  );
}
