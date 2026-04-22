// utils/providers.js
// Simple mapping for provider logic (frontend)
export const PROVIDER_SLUGS = {
    netflix: "netflix",
    prime: "prime",
    hotstar: "hotstar",
    sony: "sony",
};

// quick helper to decide if in theaters
export function isInTheaters(releaseDate) {
    if (!releaseDate) return false;
    const release = new Date(releaseDate);
    const now = new Date();
    const diffDays = (now - release) / (1000 * 60 * 60 * 24);
    return diffDays >= 0 && diffDays <= 60; // first 60 days considered theaters
}
