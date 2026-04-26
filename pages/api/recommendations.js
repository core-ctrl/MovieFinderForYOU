import { requireAuth } from "@/middleware/requireAuth";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import {
  buildUserProfile,
  getRecommendations,
  getBecauseYouWatched,
  getHiddenGems,
} from "@/services/recommendationService";
import { sanitizeSearchQuery } from "@/lib/security";

function parseNumberList(value) {
  if (!value) return [];
  return String(value)
    .split(",")
    .map((item) => Number(item.trim()))
    .filter((item) => Number.isFinite(item));
}

function parseStringList(value) {
  if (!value) return [];
  return String(value)
    .split(",")
    .map((item) => sanitizeSearchQuery(item).toUpperCase())
    .filter(Boolean);
}

export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });

  const decoded = requireAuth(req);

  if (!decoded) {
    const guestProfile = {
      preferredGenres: parseNumberList(req.query.genres),
      preferredLanguages: String(req.query.languages || "")
        .split(",")
        .map((item) => item.trim().toLowerCase())
        .filter(Boolean),
      preferredRegions: parseStringList(req.query.regions),
      preferredRegionGroup: typeof req.query.regionGroup === "string" ? req.query.regionGroup : "",
      allowLocationRecommendations: req.query.allowLocationRecommendations === "true",
      watchHistory: [],
    };

    const recs = await getRecommendations(guestProfile);
    const gems = await getHiddenGems(guestProfile.preferredGenres);

    res.setHeader("Cache-Control", "private, s-maxage=180");
    return res.status(200).json({
      type: recs.source,
      movies: recs.movies,
      tv: recs.tv,
      becauseYouWatched: [],
      hiddenGems: gems,
    });
  }

  try {
    await connectDB();
    const user = await User.findById(decoded.id).select(
      "preferredGenres preferredLanguages preferredRegions preferredRegionGroup allowLocationRecommendations watchHistory wishlist"
    );

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
