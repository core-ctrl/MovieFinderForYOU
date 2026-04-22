// components/GenreRow.jsx
import MovieCard from "./MovieCard";
import Link from "next/link";

export default function GenreRow({
    title,
    items = [],
    genreId,

    // NEW: global props
    wishlist,
    addToWishlist,
    openAuth,
    onPlayTrailer,
}) {
    return (
        <section className="my-8">
            {/* Header */}
            <div className="flex justify-between items-center mb-3 px-1">
                <h2 className="text-2xl font-bold">{title}</h2>

                <Link href={`/genre/${genreId}`}>
                    <p className="text-gray-300 hover:text-white transition cursor-pointer">
                        See All →
                    </p>
                </Link>
            </div>

            {/* Horizontal Row */}
            <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory hide-scrollbar">
                {items.map((movie) => (
                    <div
                        key={movie.id}
                        className="min-w-[180px] md:min-w-[200px] snap-start"
                    >
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
        </section>
    );
}
