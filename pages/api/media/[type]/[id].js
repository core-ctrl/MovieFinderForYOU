// pages/api/media/[type]/[id].js
// Fetches full movie or TV details including trailer, cast, providers
import { fetchDetails, fetchWatchProviders, fetchVideos } from "@/lib/tmdb";

export default async function handler(req, res) {
  const { type, id } = req.query;

  if (!["movie", "tv"].includes(type)) {
    return res.status(400).json({ error: "Type must be 'movie' or 'tv'" });
  }

  try {
    const [details, providers] = await Promise.all([
      fetchDetails(id, type),
      fetchWatchProviders(id, type),
    ]);

    if (!details || !details.id) {
      return res.status(404).json({ error: "Not found" });
    }

    return res.status(200).json({ ...details, providers });
  } catch (err) {
    console.error("MEDIA_DETAIL_ERROR:", err.message);
    return res.status(500).json({ error: "Failed to fetch details" });
  }
}
