import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { FavouriteIcon, PlayIcon, Search01Icon, Tv01Icon } from "@hugeicons/core-free-icons";
import SEOMeta from "../components/SEOMeta";
import { trackSearchQuery } from "../lib/analytics";
import { sanitizeSearchQuery } from "../lib/security";
import AppIcon from "../components/AppIcon";

export default function SearchPage({ addToWishlist, wishlist = [] }) {
  const router = useRouter();
  const rawQuery = router.query.q;
  const query = useMemo(() => sanitizeSearchQuery(rawQuery || ""), [rawQuery]);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query) return undefined;

    let active = true;
    setLoading(true);

    fetch(`/api/search?q=${encodeURIComponent(query)}`)
      .then((response) => response.json())
      .then((data) => {
        if (!active) return;
        const nextResults = data.results || [];
        setResults(nextResults);
        trackSearchQuery(query, nextResults.length);
      })
      .catch(() => {
        if (active) setResults([]);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [query]);

  return (
    <div className="min-h-screen bg-black px-4 pt-28 text-white md:px-6">
      <SEOMeta
        title={query ? `Search results for ${query}` : "Search movies and series"}
        description={query ? `Explore search results, trailers, and streaming options for ${query}.` : "Search for movies, TV series, anime, cast members, and streaming guides."}
        url={query ? `/search?q=${encodeURIComponent(query)}` : "/search"}
        keywords={["movie search", "series search", query]}
        noindex={!query}
      />

      <div className="mx-auto max-w-6xl">
        <h1 className="mb-2 text-2xl font-bold">
          Search results for <span className="text-red-400">"{query}"</span>
        </h1>
        <p className="mb-8 text-sm text-neutral-400">{loading ? "Searching..." : `${results.length} results`}</p>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="h-10 w-10 animate-spin rounded-full border-2 border-red-600 border-t-transparent" />
          </div>
        ) : null}

        {!loading && results.length === 0 ? (
          <div className="py-20 text-center text-neutral-500">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-red-400">
              <AppIcon icon={Search01Icon} size={28} />
            </div>
            <p>No results found for "{query}"</p>
          </div>
        ) : null}

        <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {results.map((item) => {
            const isMovie = item.media_type === "movie" || item.title;
            const href = isMovie ? `/movies/${item.id}` : `/series/${item.id}`;
            const isInList = wishlist.some((media) => media.id === item.id);
            const TypeIcon = isMovie ? PlayIcon : Tv01Icon;

            return (
              <div key={item.id} className="group cursor-pointer">
                <Link href={href}>
                  <div className="mb-2 aspect-[2/3] overflow-hidden rounded-xl border border-white/10 bg-white/5">
                    {item.poster_path ? (
                      <img
                        src={`https://image.tmdb.org/t/p/w300${item.poster_path}`}
                        alt={item.title || item.name}
                        className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                        loading="lazy"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-red-400">
                        <AppIcon icon={TypeIcon} size={32} />
                      </div>
                    )}
                  </div>
                </Link>

                <p className="truncate text-sm font-medium transition group-hover:text-red-400">{item.title || item.name}</p>
                <div className="mt-1 flex items-center justify-between">
                  <span className="text-xs text-neutral-500">
                    {isMovie ? "Movie" : "Series"} • {(item.release_date || item.first_air_date || "").slice(0, 4)}
                  </span>
                  <button
                    onClick={() => addToWishlist({ ...item })}
                    className="text-neutral-400 transition hover:text-red-400"
                    aria-label={isInList ? "Remove from watchlist" : "Add to watchlist"}
                  >
                    <AppIcon icon={FavouriteIcon} size={14} className={isInList ? "fill-current text-red-400" : ""} />
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
