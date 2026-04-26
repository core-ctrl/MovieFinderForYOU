import { searchLimiter } from "@/lib/rateLimit";
import { getCache, setCache } from "@/lib/cache";
import { searchMulti } from "@/lib/tmdb";
import { getClientIp, sanitizeSearchQuery, setPublicCache } from "@/lib/security";

export default async function handler(req, res) {
  const query = sanitizeSearchQuery(req.query.q || "");
  if (!query || query.length < 2) return res.status(200).json({ suggestions: [] });

  const ip = getClientIp(req);
  const limit = searchLimiter(ip);
  if (!limit.allowed) return res.status(429).json({ suggestions: [] });

  const cacheKey = `ac:${query.toLowerCase().slice(0, 20)}`;
  const cached = getCache(cacheKey);
  if (cached) {
    setPublicCache(res, "public, s-maxage=300, stale-while-revalidate=900");
    return res.status(200).json({ suggestions: cached });
  }

  const results = await searchMulti(query, 1);
  const suggestions = results
    .filter((result) => result.media_type !== "person" && (result.title || result.name))
    .slice(0, 6)
    .map((result) => ({
      id: result.id,
      title: result.title || result.name,
      year: (result.release_date || result.first_air_date || "").slice(0, 4),
      type: result.media_type || (result.title ? "movie" : "tv"),
      poster: result.poster_path,
      rating: result.vote_average?.toFixed(1),
    }));

  setCache(cacheKey, suggestions);
  setPublicCache(res, "public, s-maxage=300, stale-while-revalidate=900");
  return res.status(200).json({ suggestions });
}
