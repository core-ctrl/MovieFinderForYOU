import axios from "axios";
import { setCache, getCache } from "../../lib/cache";

export default async function handler(req, res) {
    const CACHE_KEY = "tmdb_genres";
    const cached = getCache(CACHE_KEY);
    if (cached) return res.json({ genres: cached });

    try {
        const TMDB_API_KEY = process.env.TMDB_API_KEY;

        const [movieGenres, tvGenres] = await Promise.all([
            axios.get(`https://api.themoviedb.org/3/genre/movie/list?api_key=${TMDB_API_KEY}&language=en-US`),
            axios.get(`https://api.themoviedb.org/3/genre/tv/list?api_key=${TMDB_API_KEY}&language=en-US`)
        ]);

        // MERGE + REMOVE DUPLICATES
        const merged = [...movieGenres.data.genres, ...tvGenres.data.genres];
        const unique = Array.from(new Map(merged.map(g => [g.id, g])).values());

        setCache(CACHE_KEY, unique);

        res.json({ genres: unique });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}
