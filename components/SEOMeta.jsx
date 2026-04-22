// components/SEOMeta.jsx
import Head from "next/head";

export default function SEOMeta({
  title = "Movie Finder — Discover Movies & Series",
  description = "Discover trending movies, top series, watch trailers and find where to stream. Personalised recommendations powered by TMDB.",
  image = "https://www.moviefinderforyou.com/og-default.jpg",
  url = "https://www.moviefinderforyou.com",
  type = "website",
  jsonLd = null,
}) {
  const fullTitle = title.includes("Movie Finder") ? title : `${title} — Movie Finder`;

  return (
    <Head>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <link rel="canonical" href={url} />

      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content="Movie Finder" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* JSON-LD Schema */}
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
    </Head>
  );
}

// Helper to build movie JSON-LD schema
export function movieSchema(movie) {
  return {
    "@context": "https://schema.org",
    "@type": "Movie",
    name: movie.title,
    description: movie.overview,
    datePublished: movie.release_date,
    image: movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : undefined,
    aggregateRating: movie.vote_average > 0 ? {
      "@type": "AggregateRating",
      ratingValue: movie.vote_average.toFixed(1),
      bestRating: "10",
      ratingCount: movie.vote_count,
    } : undefined,
    genre: movie.genres?.map(g => g.name),
    director: movie.credits?.crew?.find(c => c.job === "Director")?.name,
  };
}

export function tvSchema(show) {
  return {
    "@context": "https://schema.org",
    "@type": "TVSeries",
    name: show.name,
    description: show.overview,
    datePublished: show.first_air_date,
    image: show.poster_path ? `https://image.tmdb.org/t/p/w500${show.poster_path}` : undefined,
    aggregateRating: show.vote_average > 0 ? {
      "@type": "AggregateRating",
      ratingValue: show.vote_average.toFixed(1),
      bestRating: "10",
      ratingCount: show.vote_count,
    } : undefined,
    genre: show.genres?.map(g => g.name),
    numberOfSeasons: show.number_of_seasons,
  };
}
