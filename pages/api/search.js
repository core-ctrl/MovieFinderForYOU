import { searchLimiter } from "../../lib/rateLimit";
import { searchMulti } from "../../lib/tmdb";
import { getClientIp, sanitizeSearchQuery, setPublicCache } from "../../lib/security";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const ip = getClientIp(req);
  const limit = searchLimiter(ip);
  if (!limit.allowed) {
    return res.status(429).json({ error: "Too many search requests. Please slow down.", results: [] });
  }

  const query = sanitizeSearchQuery(req.query.q || "");
  const page = Math.max(1, Number(req.query.page || 1));

  if (!query) {
    return res.status(200).json({ results: [] });
  }

  try {
    const results = await searchMulti(query, page);
    setPublicCache(res, "public, s-maxage=120, stale-while-revalidate=300");
    return res.status(200).json({ results });
  } catch {
    return res.status(500).json({ error: "Failed to search titles", results: [] });
  }
}
