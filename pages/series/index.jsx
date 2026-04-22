// pages/series/index.jsx
import Head from "next/head";
import SectionRow from "../../components/SectionRow";
import { fetchTopRatedTV, fetchByGenre } from "../../lib/tmdb";

export default function SeriesPage({ series = [], drama = [], scifi = [], addToWishlist, wishlist, openAuth, openTrailer }) {
  const rowProps = { wishlist, addToWishlist, openAuth, onPlayTrailer: openTrailer };

  return (
    <div className="min-h-screen bg-black text-white pt-28 px-4 md:px-6">
      <Head><title>Series — Movie Finder</title></Head>

      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-10">📺 Series</h1>
        <SectionRow title="Top Rated" items={series} {...rowProps} />
        <SectionRow title="Drama" items={drama} {...rowProps} />
        <SectionRow title="Sci-Fi" items={scifi} {...rowProps} />
      </div>
    </div>
  );
}

export async function getServerSideProps() {
  try {
    const [series, drama, scifi] = await Promise.all([
      fetchTopRatedTV(),
      fetchByGenre(18, 1, "tv"),
      fetchByGenre(10765, 1, "tv"),
    ]);
    return { props: { series, drama, scifi } };
  } catch {
    return { props: {} };
  }
}
