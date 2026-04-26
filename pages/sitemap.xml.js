import { fetchTopRatedMovies, fetchTopRatedTV } from "../lib/tmdb";
import { getAllArticles } from "../lib/blog";
import { SITE_URL } from "../lib/site";

function renderUrl(path, changefreq = "weekly", priority = "0.7") {
  return `<url><loc>${SITE_URL}${path}</loc><changefreq>${changefreq}</changefreq><priority>${priority}</priority></url>`;
}

function generateSitemap({ movies, series, articles }) {
  const staticPages = [
    renderUrl("/", "daily", "1.0"),
    renderUrl("/movies", "daily", "0.9"),
    renderUrl("/series", "daily", "0.9"),
    renderUrl("/blog", "weekly", "0.8"),
    renderUrl("/about", "monthly", "0.5"),
    renderUrl("/contact", "monthly", "0.5"),
    renderUrl("/privacy-policy", "monthly", "0.4"),
    renderUrl("/terms-and-conditions", "monthly", "0.4"),
  ];

  const moviePages = movies.map((movie) => renderUrl(`/movies/${movie.id}`, "weekly", "0.8"));
  const seriesPages = series.map((show) => renderUrl(`/series/${show.id}`, "weekly", "0.8"));
  const blogPages = articles.map((article) => renderUrl(`/blog/${article.slug}`, "monthly", "0.7"));

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${[...staticPages, ...moviePages, ...seriesPages, ...blogPages].join("\n  ")}
</urlset>`;
}

export default function Sitemap() {
  return null;
}

export async function getServerSideProps({ res }) {
  try {
    const [movies, series] = await Promise.all([fetchTopRatedMovies(), fetchTopRatedTV()]);
    const articles = getAllArticles();
    const sitemap = generateSitemap({
      movies: movies.slice(0, 50),
      series: series.slice(0, 50),
      articles,
    });

    res.setHeader("Content-Type", "text/xml");
    res.setHeader("Cache-Control", "public, s-maxage=86400, stale-while-revalidate=604800");
    res.write(sitemap);
    res.end();
  } catch {
    res.statusCode = 500;
    res.end();
  }

  return { props: {} };
}
