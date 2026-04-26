import Head from "next/head";
import { buildSeo } from "../lib/seo";

export default function SEOMeta({
  title = "Discover Movies, Series, Streaming Guides, and Trailers",
  description,
  image,
  url = "/",
  type = "website",
  jsonLd = null,
  keywords = [],
  noindex = false,
}) {
  const meta = buildSeo({
    title,
    description,
    image,
    path: url,
    type,
    keywords,
    noindex,
  });

  return (
    <Head>
      <title>{meta.title}</title>
      <meta name="description" content={meta.description} />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <link rel="canonical" href={meta.canonical} />

      {meta.keywords ? <meta name="keywords" content={meta.keywords} /> : null}
      {meta.noindex ? <meta name="robots" content="noindex,nofollow" /> : <meta name="robots" content="index,follow,max-image-preview:large" />}

      <meta property="og:title" content={meta.title} />
      <meta property="og:description" content={meta.description} />
      <meta property="og:image" content={meta.image} />
      <meta property="og:url" content={meta.canonical} />
      <meta property="og:type" content={meta.type} />
      <meta property="og:site_name" content="Movie Finder" />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={meta.title} />
      <meta name="twitter:description" content={meta.description} />
      <meta name="twitter:image" content={meta.image} />

      {jsonLd ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      ) : null}
    </Head>
  );
}
