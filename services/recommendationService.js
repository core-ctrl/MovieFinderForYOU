// services/recommendationService.js
// Hybrid recommendation engine:
// 1. Content-based filtering (genre overlap, cast)
// 2. Trending weighting (TMDB popularity)
// 3. User history signals (watchlist, searches, clicks)

import { getCache, setCache } from "../lib/cache.js";
import { fetchRecommendedByGenres, fetchByGenre, fetchTrendingMovies, fetchTrendingTV } from "../lib/tmdb.js";

// ── Score a candidate item against user profile ────────────────────
function scoreForUser(item, profile) {
    let score = 0;

    const { preferredGenres = [], watchedIds = [], searchGenres = [] } = profile;
    const itemGenres = item.genre_ids || item.genres?.map((g) => g.id) || [];

    // Genre overlap with explicit preferences
    const prefOverlap = itemGenres.filter((g) => preferredGenres.includes(g)).length;
    score += prefOverlap * 15;

    // Genre overlap with implicit (from search history)
    const searchOverlap = itemGenres.filter((g) => searchGenres.includes(g)).length;
    score += searchOverlap * 8;

    // Skip already watched
    if (watchedIds.includes(item.id)) score -= 1000;

    // Popularity boost (logarithmic so blockbusters don't dominate)
    score += Math.log10(Math.max(item.popularity || 1, 1)) * 5;

    // Rating boost
    if (item.vote_average >= 8) score += 20;
    else if (item.vote_average >= 7) score += 10;
    else if (item.vote_average < 5) score -= 10;

    // Vote count quality gate
    if (item.vote_count < 50) score -= 15;

    return score;
}

// ── Build user profile from DB data ──────────────────────────────
export function buildUserProfile(user) {
    const preferredGenres = user.preferredGenres || [];

    // Extract genre signals from watch history
    const watchedIds = (user.watchHistory || []).map((h) => h.mediaId);

    // Implicit genres from wishlist items (if genre_ids stored)
    const searchGenres = [];

    return { preferredGenres, watchedIds, searchGenres };
}

// ── Main recommendation generator ─────────────────────────────────
export async function getRecommendations(user, options = {}) {
    const { limit = 20, type = "all" } = options;
    const cacheKey = `recs:${user._id}:${type}`;
    const cached = getCache(cacheKey);
    if (cached) return cached;

    const profile = buildUserProfile(user);

    // If user has no preferences, return trending
    if (!profile.preferredGenres.length) {
        const [movies, tv] = await Promise.all([
            fetchTrendingMovies().then((r) => r.slice(0, limit)),
            fetchTrendingTV().then((r) => r.slice(0, limit)),
        ]);
        const result = { movies, tv, source: "trending" };
        setCache(cacheKey, result);
        return result;
    }

    // Fetch candidates from preferred genres
    const genreBatches = profile.preferredGenres.slice(0, 3); // Top 3 genres

    const [movieCandidates, tvCandidates, trendingMovies, trendingTV] = await Promise.all([
        Promise.all(genreBatches.map((g) => fetchByGenre(g, 1, "movie"))).then((r) => r.flat()),
        Promise.all(genreBatches.map((g) => fetchByGenre(g, 1, "tv"))).then((r) => r.flat()),
        fetchTrendingMovies(),
        fetchTrendingTV(),
    ]);

    // Deduplicate by id
    const dedup = (arr) => {
        const seen = new Set();
        return arr.filter((i) => { if (seen.has(i.id)) return false; seen.add(i.id); return true; });
    };

    const allMovies = dedup([...trendingMovies, ...movieCandidates]);
    const allTV = dedup([...trendingTV, ...tvCandidates]);

    // Score and sort
    const movies = allMovies
        .map((i) => ({ ...i, _score: scoreForUser(i, profile) }))
        .sort((a, b) => b._score - a._score)
        .slice(0, limit);

    const tv = allTV
        .map((i) => ({ ...i, _score: scoreForUser(i, profile) }))
        .sort((a, b) => b._score - a._score)
        .slice(0, limit);

    const result = { movies, tv, source: "personalized", genres: profile.preferredGenres };
    setCache(cacheKey, result);
    return result;
}

// ── "Because You Watched" — content-based similar items ──────────
export async function getBecauseYouWatched(user) {
    const history = (user.watchHistory || []).slice(0, 3); // Last 3 watched
    if (!history.length) return [];

    const results = [];
    for (const item of history) {
        const cacheKey = `byw:${item.mediaId}:${item.mediaType}`;
        let recs = getCache(cacheKey);

        if (!recs) {
            try {
                const { fetchDetails } = await import("../lib/tmdb.js");
                const details = await fetchDetails(item.mediaId, item.mediaType || "movie");
                recs = details?.similar?.results?.slice(0, 10) || details?.recommendations?.results?.slice(0, 10) || [];
                if (recs.length) setCache(cacheKey, recs);
            } catch { recs = []; }
        }

        if (recs.length) {
            results.push({
                because: item.title,
                items: recs.slice(0, 8),
                mediaType: item.mediaType,
            });
        }
    }

    return results;
}

// ── "Hidden Gems" — high-rated, low-popularity ────────────────────
export async function getHiddenGems(genreIds = []) {
    const cacheKey = `hidden:${genreIds.join(",")}`;
    const cached = getCache(cacheKey);
    if (cached) return cached;

    const candidates = genreIds.length
        ? await Promise.all(genreIds.slice(0, 2).map((g) => fetchByGenre(g, 2))).then((r) => r.flat())
        : await fetchByGenre(18, 2); // default: drama page 2

    const gems = candidates
        .filter((i) => i.vote_average >= 7.5 && i.vote_count >= 100 && i.popularity < 50)
        .sort((a, b) => b.vote_average - a.vote_average)
        .slice(0, 15);

    setCache(cacheKey, gems);
    return gems;
}