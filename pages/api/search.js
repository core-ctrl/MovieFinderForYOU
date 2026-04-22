// pages/api/search.js
import { searchMulti } from "@/lib/tmdb";

export default async function handler(req, res) {
  const { q, page = 1 } = req.query;
  if (!q) return res.status(400).json({ results: [] });

  const results = await searchMulti(q, Number(page));
  // Filter out person results
  const filtered = results.filter((r) => r.media_type !== "person");
  return res.status(200).json({ results: filtered });
}
