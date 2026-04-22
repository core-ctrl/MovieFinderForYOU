export function getPosterUrl(path, size = "w500") {
    if (!path) return "/fallback.jpg";
    const base = process.env.NEXT_PUBLIC_TMDB_IMAGE || "https://image.tmdb.org/t/p";
    return `${base}/${size}${path}`;
}
