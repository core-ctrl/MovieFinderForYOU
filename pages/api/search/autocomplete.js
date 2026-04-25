// /home/ / movie - finder - v2 / pages / api / search / autocomplete.js << 'EOF'
// pages/api/search/autocomplete.js
// Fast prefix-based suggestions
import { searchLimiter } from "@/lib/rateLimit";
import { getCache, setCache } from "@/lib/cache";
import { searchMulti } from "@/lib/tmdb";

export default async function handler(req, res) {
    const { q = "" } = req.query;
    if (!q || q.length < 2) return res.status(200).json({ suggestions: [] });

    const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
    const limit = searchLimiter(ip);
    if (!limit.allowed) return res.status(429).json({ suggestions: [] });

    const cacheKey = `ac:${q.toLowerCase().slice(0, 20)}`;
    const cached = getCache(cacheKey);
    if (cached) return res.status(200).json({ suggestions: cached });

    const results = await searchMulti(q, 1);
    const suggestions = results
        .filter((r) => r.media_type !== "person" && (r.title || r.name))
        .slice(0, 6)
        .map((r) => ({
            id: r.id,
            title: r.title || r.name,
            year: (r.release_date || r.first_air_date || "").slice(0, 4),
            type: r.media_type || (r.title ? "movie" : "tv"),
            poster: r.poster_path,
            rating: r.vote_average?.toFixed(1),
        }));

    setCache(cacheKey, suggestions);
    res.setHeader("Cache-Control", "s-maxage=300");
    return res.status(200).json({ suggestions });
}