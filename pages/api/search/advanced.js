// pages/api/search/advanced.js
// Smart search endpoint with fuzzy, intent, scoring
import { searchLimiter } from "@/lib/rateLimit";
import { getCache, setCache } from "@/lib/cache";
import { searchMulti } from "@/lib/tmdb";
import { correctTypo, detectIntent, scoreResults } from "@/services/searchService";
import { requireAuth } from "@/middleware/requireAuth";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

export default async function handler(req, res) {
    if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });

    // Rate limit
    const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress || "unknown";
    const limit = searchLimiter(ip);
    if (!limit.allowed) return res.status(429).json({ error: "Too many searches. Slow down." });

    const { q = "", page = 1 } = req.query;
    if (!q.trim()) return res.status(400).json({ results: [], suggestions: [], intent: null });

    // Input sanitisation
    const sanitized = q.trim().slice(0, 100).replace(/[<>{}]/g, "");
    const corrected = correctTypo(sanitized);
    const intent = detectIntent(corrected);

    // Cache key
    const cacheKey = `search:${corrected}:${page}`;
    const cached = getCache(cacheKey);
    if (cached) {
        return res.status(200).json({ ...cached, cached: true });
    }

    // Get user preferences for personalised scoring
    let userGenres = [];
    try {
        const decoded = requireAuth(req);
        if (decoded) {
            await connectDB();
            const user = await User.findById(decoded.id).select("preferredGenres");
            userGenres = user?.preferredGenres || [];
        }
    } catch { }

    // Fetch from TMDB
    const raw = await searchMulti(corrected, Number(page));

    // Score results
    const results = scoreResults(raw, corrected, userGenres);

    // Track search analytics (non-blocking)
    trackSearch(sanitized, corrected, results.length).catch(() => { });

    const payload = {
        results: results.slice(0, 20),
        intent,
        corrected: corrected !== sanitized ? corrected : null, // "Did you mean?"
        originalQuery: sanitized,
        total: results.length,
    };

    setCache(cacheKey, payload);
    return res.status(200).json(payload);
}

// Analytics — fire and forget
async function trackSearch(query, corrected, resultCount) {
    // Extend this to write to MongoDB analytics collection
    // or send to Mixpanel / GA4 via server-side events
    if (process.env.NODE_ENV === "development") {
        console.log(`🔍 Search: "${query}"${corrected !== query ? ` → "${corrected}"` : ""} (${resultCount} results)`);
    }
}
