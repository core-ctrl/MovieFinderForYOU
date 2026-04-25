// Step 9: Updated search page with smart features
//home/claude / movie - finder - v2 / pages / search.js << 'EOF'
// pages/search.js
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import SEOMeta from "../components/SEOMeta";
import LazyImage from "../components/LazyImage";
import AdBanner from "../components/AdBanner";
import { useAnalytics } from "../hooks/useAnalytics";
import { useSelector } from "react-redux";
import { selectWatchlist } from "../store/slices/watchlistSlice";
import axios from "axios";

export default function SearchPage({ openTrailer, addToWishlist }) {
  const router = useRouter();
  const { q } = router.query;
  const { trackSearch, trackClick } = useAnalytics();
  const wishlist = useSelector(selectWatchlist);

  const [results, setResults] = useState([]);
  const [corrected, setCorrected] = useState(null);
  const [intent, setIntent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("all"); // all | movie | tv

  useEffect(() => {
    if (!q) return;
    setLoading(true);
    trackSearch(q);

    axios.get(`/api/search/advanced?q=${encodeURIComponent(q)}`)
      .then(({ data }) => {
        setResults(data.results || []);
        setCorrected(data.corrected);
        setIntent(data.intent);
      })
      .catch(() => setResults([]))
      .finally(() => setLoading(false));
  }, [q]);

  const filtered = results.filter((r) => {
    if (filter === "movie") return r.media_type === "movie" || r.title;
    if (filter === "tv") return r.media_type === "tv" || r.name;
    return true;
  });

  return (
    <>
      <SEOMeta
        title={`Search: ${q}`}
        description={`Search results for "${q}" — movies, series and anime on Movie Finder`}
        url={`https://www.moviefinderforyou.com/search?q=${encodeURIComponent(q || "")}`}
      />

      <div className="min-h-screen bg-black text-white pt-28 px-4 md:px-8">
        <div className="max-w-6xl mx-auto">

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold mb-1">
              Results for <span className="gradient-text-red">"{q}"</span>
            </h1>

            {/* "Did you mean?" */}
            {corrected && (
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="text-sm text-neutral-400 mt-2">
                Did you mean{" "}
                <Link href={`/search?q=${encodeURIComponent(corrected)}`}
                  className="text-accent hover:underline font-medium">{corrected}</Link>?
              </motion.p>
            )}

            {/* Intent chip */}
            {intent && intent.type !== "title" && (
              <motion.span initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                className="inline-flex items-center gap-1.5 mt-2 text-xs bg-accent/10 border border-accent/20 text-accent px-3 py-1 rounded-full">
                {intent.type === "mood" && `😊 Mood: ${intent.mood}`}
                {intent.type === "actor" && `🎭 Actor: ${intent.actor}`}
                {intent.type === "year" && `📅 Year: ${intent.year}`}
              </motion.span>
            )}

            {/* Filters */}
            <div className="flex gap-2 mt-4">
              {[["all", "All"], ["movie", "Movies"], ["tv", "Series"]].map(([v, l]) => (
                <button key={v} onClick={() => setFilter(v)}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${filter === v ? "bg-accent text-white" : "glass border border-white/10 text-neutral-400 hover:text-white"
                    }`}>
                  {l}
                </button>
              ))}
              <span className="ml-auto text-neutral-600 text-sm self-center">
                {loading ? "Searching..." : `${filtered.length} results`}
              </span>
            </div>
          </div>

          {/* Loading */}
          {loading && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
              {Array.from({ length: 10 }).map((_, i) => (
                <div key={i} className="animate-fadeIn" style={{ animationDelay: `${i * 0.05}s` }}>
                  <div className="aspect-[2/3] skeleton rounded-card mb-2" />
                  <div className="h-3 skeleton rounded w-3/4 mb-1" />
                  <div className="h-3 skeleton rounded w-1/2" />
                </div>
              ))}
            </div>
          )}

          {/* Empty */}
          {!loading && filtered.length === 0 && (
            <div className="text-center py-24">
              <p className="text-5xl mb-4">🎬</p>
              <p className="text-xl font-bold mb-2">No results found</p>
              <p className="text-neutral-500">Try a different spelling or browse by genre</p>
              <Link href="/" className="mt-6 inline-block text-accent hover:underline text-sm">← Browse all titles</Link>
            </div>
          )}

          {/* Results grid */}
          {!loading && filtered.length > 0 && (
            <>
              <motion.div
                className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5"
                initial="hidden"
                animate="show"
                variants={{ hidden: {}, show: { transition: { staggerChildren: 0.04 } } }}
              >
                {filtered.map((item, i) => {
                  const isMovie = item.media_type === "movie" || item.title;
                  const href = isMovie ? `/movies/${item.id}` : `/series/${item.id}`;
                  const isInList = wishlist.some((m) => m.id === item.id);

                  return (
                    <motion.div key={item.id}
                      variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } } }}
                      className="group"
                      onClick={() => trackClick(item.id, item.media_type, item.title || item.name)}
                    >
                      <Link href={href}>
                        <div className="aspect-[2/3] poster-card rounded-card overflow-hidden mb-2">
                          <LazyImage
                            src={item.poster_path ? `https://image.tmdb.org/t/p/w300${item.poster_path}` : "/fallback.jpg"}
                            alt={item.title || item.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </Link>
                      <p className="text-sm font-medium truncate group-hover:text-accent transition-colors">
                        {item.title || item.name}
                      </p>
                      <div className="flex items-center justify-between mt-0.5">
                        <span className="text-xs text-neutral-600">
                          {isMovie ? "Movie" : "Series"} · {(item.release_date || item.first_air_date || "").slice(0, 4)}
                        </span>
                        <button onClick={() => addToWishlist(item)}
                          className="text-xs text-neutral-600 hover:text-accent transition-colors">
                          {isInList ? "❤️" : "🤍"}
                        </button>
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>

              {/* Ad between results and footer */}
              <AdBanner slot="horizontal" className="mt-10" />
            </>
          )}
        </div>
      </div>
    </>
  );
}