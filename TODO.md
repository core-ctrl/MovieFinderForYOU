# Fix Play Trailer Button - TODO

## Steps

- [x] 1. Analyze codebase and identify issues
- [x] 2. Fix `lib/tmdb.js` - rewrite `pickSafeTrailer` to correctly filter `type === "Trailer" && site === "YouTube"`
- [x] 3. Fix `components/TrailerModal.jsx` - simplify to iframe-based modal with close on ESC/backdrop click
- [x] 4. Fix `pages/movies/[id].jsx` - add `isTrailerOpen` state, strict trailer filtering, disable button when no trailer, local modal
- [x] 5. Fix `pages/series/[id].jsx` - same changes as movies detail page
- [x] 6. Fix `pages/api/trailer.js` - ensure compatibility with updated `fetchVideos`
- [x] 7. Test and verify (Build passed for all edited files; unrelated pre-existing error in change-password.js)

