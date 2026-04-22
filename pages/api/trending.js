import { fetchTrending } from "../../lib/tmdb";

export default async function handler(req, res) {
    try {
        const results = await fetchTrending(req.query.page);
        res.status(200).json({ results });
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch trending" });
    }
}
