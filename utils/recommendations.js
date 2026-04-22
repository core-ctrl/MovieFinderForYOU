// utils/recommendations.js
// Frontend-only helper that returns mock recommendations. Replace with server logic later.

export function recommendByGenres(genres = [], pool = []) {
    if (!genres.length) return pool.slice(0, 10);
    // naive: filter pool for items having any genre
    return pool.filter(item => (item.genre_names || []).some(g => genres.includes(g))).slice(0, 12);
}
