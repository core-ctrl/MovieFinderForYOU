// components/SectionRow.jsx
import { useRef } from "react";
<<<<<<< HEAD
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
=======
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
>>>>>>> 3b3f76b6b2f75cfb78a3ee46561373052120bd14
          </button>
        </div>
      </div>

      {/* Cards */}
<<<<<<< HEAD
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
=======
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
>>>>>>> 3b3f76b6b2f75cfb78a3ee46561373052120bd14
  );
}
