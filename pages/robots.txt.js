import { SITE_URL } from "../lib/site";

export default function Robots() {
  return null;
}

export async function getServerSideProps({ res }) {
  const body = `User-agent: *
Allow: /
Disallow: /api/
Disallow: /admin

Sitemap: ${SITE_URL}/sitemap.xml
`;

  res.setHeader("Content-Type", "text/plain");
  res.setHeader("Cache-Control", "public, s-maxage=86400, stale-while-revalidate=604800");
  res.write(body);
  res.end();

  return { props: {} };
}
