<<<<<<< HEAD
=======

>>>>>>> 3b3f76b6b2f75cfb78a3ee46561373052120bd14
// pages/sitemap.xml.js
import { fetchTopRatedMovies, fetchTopRatedTV, fetchTrending } from "../lib/tmdb";

const BASE = "https://www.moviefinderforyou.com";

function generateSitemap(movies, series) {
<<<<<<< HEAD
  return `<?xml version="1.0" encoding="UTF-8"?>
=======
    return `<?xml version="1.0" encoding="UTF-8"?>
>>>>>>> 3b3f76b6b2f75cfb78a3ee46561373052120bd14
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>${BASE}/</loc><changefreq>daily</changefreq><priority>1.0</priority></url>
  <url><loc>${BASE}/movies</loc><changefreq>daily</changefreq><priority>0.9</priority></url>
  <url><loc>${BASE}/series</loc><changefreq>daily</changefreq><priority>0.9</priority></url>
  <url><loc>${BASE}/about</loc><changefreq>monthly</changefreq><priority>0.5</priority></url>
  <url><loc>${BASE}/privacy</loc><changefreq>monthly</changefreq><priority>0.3</priority></url>
  <url><loc>${BASE}/terms</loc><changefreq>monthly</changefreq><priority>0.3</priority></url>
  ${movies.map(m => `<url><loc>${BASE}/movies/${m.id}</loc><changefreq>weekly</changefreq><priority>0.8</priority></url>`).join("\n  ")}
  ${series.map(s => `<url><loc>${BASE}/series/${s.id}</loc><changefreq>weekly</changefreq><priority>0.8</priority></url>`).join("\n  ")}
</urlset>`;
}

<<<<<<< HEAD
export default function Sitemap() {}

export async function getServerSideProps({ res }) {
  try {
    const [movies, series] = await Promise.all([
      fetchTopRatedMovies(),
      fetchTopRatedTV(),
    ]);
    const sitemap = generateSitemap(movies, series);
    res.setHeader("Content-Type", "text/xml");
    res.setHeader("Cache-Control", "public, s-maxage=86400, stale-while-revalidate");
    res.write(sitemap);
    res.end();
  } catch {
    res.status(500).end();
  }
  return { props: {} };
}
=======
export default function Sitemap() { }

export async function getServerSideProps({ res }) {
    try {
        const [movies, series] = await Promise.all([
            fetchTopRatedMovies(),
            fetchTopRatedTV(),
        ]);
        const sitemap = generateSitemap(movies, series);
        res.setHeader("Content-Type", "text/xml");
        res.setHeader("Cache-Control", "public, s-maxage=86400, stale-while-revalidate");
        res.write(sitemap);
        res.end();
    } catch {
        res.status(500).end();
    }
    return { props: {} };
}


>>>>>>> 3b3f76b6b2f75cfb78a3ee46561373052120bd14
