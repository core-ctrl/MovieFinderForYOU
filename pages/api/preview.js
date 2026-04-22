// pages/api/preview.js
import { fetchVideos } from "../../lib/tmdb";

export default async function handler(req, res) {
    try {
        const { id, media = "movie" } = req.query;

        const videos = await fetchVideos(id, media);

        // fetchVideos already filters for the safe/best trailer
        const best = videos[0];

        return res.status(200).json({ key: best ? best.key : null });
    } catch (err) {
        console.error("PREVIEW_API_ERROR:", err.message);
        res.status(500).json({ key: null });
    }
}
