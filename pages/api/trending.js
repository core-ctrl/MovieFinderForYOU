import { fetchTrending } from "../../lib/tmdb";
import { searchLimiter } from "../../lib/rateLimit";
import { getClientIp, setPublicCache } from "../../lib/security";

export default async function handler(req, res) {
    const ip = getClientIp(req);
    const limit = searchLimiter(ip);
    if (!limit.allowed) {
        return res.status(429).json({ error: "Too many requests" });
    }

    try {
        const results = await fetchTrending(req.query.page);
        setPublicCache(res, "public, s-maxage=300, stale-while-revalidate=900");
        res.status(200).json({ results });
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch trending" });
    }
}
