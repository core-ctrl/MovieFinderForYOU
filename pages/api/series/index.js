import { fetchTopRatedTV, fetchByGenre } from "../../lib/tmdb";

export default async function handler(req, res) {
    const { page = 1, genre } = req.query;

    try {
        let results;
        if (genre) {
            results = await fetchByGenre(genre, page, "tv");
        } else {
            results = await fetchTopRatedTV(page);
        }
        res.status(200).json({ results });
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch series" });
    }
}
