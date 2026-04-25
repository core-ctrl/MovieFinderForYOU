// pages/api/recommendations.js
import { requireAuth } from "@/middleware/requireAuth";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import { getRecommendations, getBecauseYouWatched, getHiddenGems } from "@/services/recommendationService";

export default async function handler(req, res) {
    if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });

    const decoded = requireAuth(req);

    // Unauthenticated: return trending
    if (!decoded) {
        const { getHiddenGems: gems } = await import("@/services/recommendationService");
        return res.status(200).json({
            type: "trending",
            movies: [], tv: [], becauseYouWatched: [], hiddenGems: [],
        });
    }

    try {
        await connectDB();
        const user = await User.findById(decoded.id).select("preferredGenres watchHistory wishlist");

        const [recs, byw, gems] = await Promise.all([
            getRecommendations(user),
            getBecauseYouWatched(user),
            getHiddenGems(user.preferredGenres),
        ]);

        res.setHeader("Cache-Control", "private, s-maxage=300");
        return res.status(200).json({
            type: recs.source,
            movies: recs.movies,
            tv: recs.tv,
            becauseYouWatched: byw,
            hiddenGems: gems,
        });
    } catch (err) {
        console.error("RECS_ERROR:", err);
        return res.status(500).json({ error: "Failed to generate recommendations" });
    }
}
