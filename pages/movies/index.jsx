// pages/movies/index.jsx
import Head from "next/head";
import SectionRow from "../../components/SectionRow";
import { fetchTopRatedMovies, fetchByGenre } from "../../lib/tmdb";

export default function MoviesPage({ movies = [], action = [], comedy = [], thriller = [], addToWishlist, wishlist, openAuth, openTrailer }) {
  const rowProps = { wishlist, addToWishlist, openAuth, onPlayTrailer: openTrailer };

  return (
    <div className="min-h-screen bg-black text-white pt-28 px-4 md:px-6">
      <Head><title>Movies — Movie Finder</title></Head>

      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-10">🎬 Movies</h1>
        <SectionRow title="Top Rated" items={movies} {...rowProps} />
        <SectionRow title="Action" items={action} {...rowProps} />
        <SectionRow title="Comedy" items={comedy} {...rowProps} />
        <SectionRow title="Thriller" items={thriller} {...rowProps} />
      </div>
    </div>
  );
}

export async function getServerSideProps() {
  try {
    const [movies, action, comedy, thriller] = await Promise.all([
      fetchTopRatedMovies(),
      fetchByGenre(28),
      fetchByGenre(35),
      fetchByGenre(53),
    ]);
    return { props: { movies, action, comedy, thriller } };
  } catch {
    return { props: {} };
  }
}
