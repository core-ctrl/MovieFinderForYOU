import { fetchByGenre, fetchTopRatedTV } from "../../../lib/tmdb";

export default async function handler(req, res) {
  const { page = 1, genre } = req.query;

  try {
    const results = genre
      ? await fetchByGenre(genre, page, "tv")
      : await fetchTopRatedTV(page);

    return res.status(200).json({ results });
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch series" });
  }
}
