// components/TopCarousel.jsx
import React, { useRef } from "react";
import MovieCard from "./MovieCard";

export default function TopCarousel({
    items = [],
    title = "Top Picks",
    onPlayTrailer,
    addToWishlist,
    wishlist,
    openAuth
}) {
    const scroller = useRef();

    const scrollLeft = () => scroller.current?.scrollBy({ left: -500, behavior: "smooth" });
    const scrollRight = () => scroller.current?.scrollBy({ left: 500, behavior: "smooth" });

    return (
        <section className="mb-10 relative">
            {/* Title row */}
            <div className="flex items-center justify-between mb-4 px-1">
                <h3 className="text-2xl md:text-3xl font-extrabold">{title}</h3>
                <span className="text-sm text-neutral-400">Top picks curated</span>
            </div>

            {/* Left Arrow */}
            <button
                onClick={scrollLeft}
                className="hidden md:flex absolute left-2 top-1/2 -translate-y-1/2 z-40 w-10 h-10 rounded-full bg-black/50 border border-white/10 text-xl items-center justify-center hover:bg-black/70"
            >
                ‹
            </button>

            {/* Scroll container — overflow-y-visible so hover card is not clipped */}
            <div
                ref={scroller}
                className="flex gap-5 overflow-x-auto overflow-y-visible no-scrollbar py-6 px-1 scroll-smooth"
                style={{ scrollSnapType: "x mandatory" }}
            >
                {items.map((movie, idx) => (
                    <div
                        key={movie?.id || idx}
                        className="flex-none w-40 md:w-52 snap-start relative overflow-visible hover:z-50"
                    // FIX: overflow-visible + hover:z-50 so card pops above siblings
                    >
                        {/* Rank Number */}
                        <div className="absolute top-2 left-2 bg-black/70 px-2 py-1 text-white rounded-md text-sm font-bold z-20">
                            #{idx + 1}
                        </div>

                        <MovieCard
                            item={movie}
                            wishlist={wishlist}
                            addToWishlist={addToWishlist}
                            openAuth={openAuth}
                            onPlayTrailer={onPlayTrailer}
                        />
                    </div>
                ))}
            </div>

            {/* Right Arrow */}
            <button
                onClick={scrollRight}
                className="hidden md:flex absolute right-2 top-1/2 -translate-y-1/2 z-40 w-10 h-10 rounded-full bg-black/50 border border-white/10 text-xl items-center justify-center hover:bg-black/70"
            >
                ›
            </button>

            {/* Fade Edges */}
            <div className="absolute left-0 top-0 bottom-0 w-10 bg-gradient-to-r from-black to-transparent pointer-events-none z-30" />
            <div className="absolute right-0 top-0 bottom-0 w-10 bg-gradient-to-l from-black to-transparent pointer-events-none z-30" />
        </section>
    );
}