// pages/api/trailer.js
import { fetchVideos } from "../../lib/tmdb";

export default async function handler(req, res) {
  const { id, media_type } = req.query;
  if (!id) return res.status(400).json({ error: "Missing id" });

  try {
    // fetchVideos now returns an array containing the single "best/safe" trailer
    const videos = await fetchVideos(id, media_type || "movie");
    const trailer = videos.length > 0 ? videos[0] : null;

    return res.status(200).json({ trailer, videos });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to fetch videos" });
  }
}
