import { fetchNowPlaying } from "../../../lib/tmdb";

export default async function handler(req, res) {
    const { region = "US", page = 1 } = req.query;

    try {
        const results = await fetchNowPlaying(region, Number(page) || 1);
        res.setHeader("Cache-Control", "public, s-maxage=300, stale-while-revalidate=600");
        return res.status(200).json({ results });
    } catch (error) {
        console.error("NOW_PLAYING_API_ERROR:", error.message);
        return res.status(500).json({ error: "Failed to fetch now playing" });
    }
}

