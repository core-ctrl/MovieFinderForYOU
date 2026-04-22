import { fetchTrending } from '../../../lib/tmdb';

export default async function handler(req, res) {
    const { page = 1, genre } = req.query;

    try {
        let results;
        if (genre) {
            results = await fetchByGenre(genre, page, "movie");
        } else {
            results = await fetchTopRatedMovies(page);
        }
        res.status(200).json({ results });
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch movies" });
    }
}
