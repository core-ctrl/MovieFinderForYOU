// utils/tmdb.js
// Client-side TMDB helpers (call our own API routes, not TMDB directly)

export async function getMovieDetails(id) {
  try {
    const res = await fetch(`/api/media/movie/${id}`);
    return res.ok ? res.json() : null;
  } catch {
    return null;
  }
}

export async function getSeriesDetails(id) {
  try {
    const res = await fetch(`/api/media/tv/${id}`);
    return res.ok ? res.json() : null;
  } catch {
    return null;
  }
}

export async function getMovieProviders(id) {
  // Providers are included in the details response already
  return null;
}

export async function getSeriesProviders(id) {
  return null;
}
