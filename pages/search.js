// pages/search.js
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Link from "next/link";

export default function SearchPage({ addToWishlist, wishlist = [], openTrailer, openAuth }) {
  const router = useRouter();
  const { q } = router.query;
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!q) return;
    setLoading(true);
    fetch(`/api/search?q=${encodeURIComponent(q)}`)
      .then((r) => r.json())
      .then((data) => setResults(data.results || []))
      .catch(() => setResults([]))
      .finally(() => setLoading(false));
  }, [q]);

  return (
    <div className="min-h-screen bg-black text-white pt-28 px-4 md:px-6">
      <Head>
        <title>Search: {q} — Movie Finder</title>
      </Head>

      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold mb-2">
          Search results for{" "}
          <span className="text-red-400">"{q}"</span>
        </h1>
        <p className="text-neutral-400 text-sm mb-8">
          {loading ? "Searching..." : `${results.length} results`}
        </p>

        {loading && (
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {!loading && results.length === 0 && (
          <div className="text-center py-20 text-neutral-500">
            <p className="text-4xl mb-4">🎬</p>
            <p>No results found for "{q}"</p>
          </div>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
          {results.map((item) => {
            const isMovie = item.media_type === "movie" || item.title;
            const href = isMovie ? `/movies/${item.id}` : `/series/${item.id}`;
            const isInList = wishlist.some((m) => m.id === item.id);

            return (
              <div key={item.id} className="group cursor-pointer">
                <Link href={href}>
                  <div className="aspect-[2/3] rounded-xl overflow-hidden bg-white/5 border border-white/10 mb-2">
                    {item.poster_path ? (
                      <img
                        src={`https://image.tmdb.org/t/p/w300${item.poster_path}`}
                        alt={item.title || item.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-4xl">
                        🎬
                      </div>
                    )}
                  </div>
                </Link>
                <p className="text-sm font-medium truncate group-hover:text-red-400 transition">
                  {item.title || item.name}
                </p>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-xs text-neutral-500">
                    {isMovie ? "Movie" : "Series"} •{" "}
                    {(item.release_date || item.first_air_date || "").slice(0, 4)}
                  </span>
                  <button
                    onClick={() => addToWishlist({ ...item })}
                    className="text-xs text-neutral-400 hover:text-red-400 transition"
                  >
                    {isInList ? "❤️" : "🤍"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
