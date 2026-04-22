// components/SectionRow.jsx
import { useRef } from "react";
import { motion } from "framer-motion";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import MovieCard from "./MovieCard";
import { SkeletonCard } from "./SkeletonCard";

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
};

export default function SectionRow({
  title, subtitle, items = [], renderItem,
  wishlist, addToWishlist, openAuth, onPlayTrailer,
  loading = false,
}) {
  const scrollRef = useRef(null);
  const scroll    = (dir) => scrollRef.current?.scrollBy({ left: dir * 640, behavior: "smooth" });

  return (
    <motion.section className="mb-14"
      initial={{ opacity: 0, y: 32 }} whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Header */}
      <div className="flex items-end justify-between mb-5 px-0.5">
        <div>
          <h3 className="text-xl md:text-2xl font-bold text-white">{title}</h3>
          {subtitle && <p className="text-neutral-500 text-sm mt-0.5">{subtitle}</p>}
        </div>
        <div className="hidden md:flex gap-1.5">
          <button onClick={() => scroll(-1)}
            className="w-8 h-8 rounded-full glass border border-white/10 flex items-center justify-center text-white hover:border-white/30 transition-all">
            <FaChevronLeft size={10} />
          </button>
          <button onClick={() => scroll(1)}
            className="w-8 h-8 rounded-full glass border border-white/10 flex items-center justify-center text-white hover:border-white/30 transition-all">
            <FaChevronRight size={10} />
          </button>
        </div>
      </div>

      {/* Cards */}
      {loading ? (
        <div className="flex gap-4 overflow-hidden py-2">
          {Array.from({ length: 7 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : (
        <motion.div ref={scrollRef}
          variants={containerVariants} initial="hidden" whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
          className="row-scroll hide-scrollbar"
        >
          {items.map(movie => (
            <motion.div key={movie.id} variants={itemVariants} className="flex-none w-36 md:w-44">
              {renderItem ? renderItem(movie) : (
                <MovieCard item={movie} wishlist={wishlist} addToWishlist={addToWishlist}
                  openAuth={openAuth} onPlayTrailer={onPlayTrailer} />
              )}
            </motion.div>
          ))}
        </motion.div>
      )}
    </motion.section>
  );
}
