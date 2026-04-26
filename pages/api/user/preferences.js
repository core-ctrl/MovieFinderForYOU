// pages/api/user/preferences.js
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import { getUserFromRequest } from "@/lib/auth";
import { ALL_GENRES, LANGUAGE_OPTIONS, REGION_GROUPS, REGION_OPTIONS } from "@/lib/preferenceOptions";

const validGenreIds = new Set(ALL_GENRES.map((genre) => genre.id));
const validLanguageCodes = new Set(LANGUAGE_OPTIONS.map((language) => language.code));
const validRegionCodes = new Set(REGION_OPTIONS.map((region) => region.code));
const validRegionGroups = new Set(REGION_GROUPS.map((group) => group.id));

function sanitizeArray(values, validValues, limit = 8) {
  if (!Array.isArray(values)) return [];
  return [...new Set(values.filter((value) => validValues.has(value)))].slice(0, limit);
}

export default async function handler(req, res) {
  const decoded = getUserFromRequest(req);
  if (!decoded) return res.status(401).json({ error: "Not authenticated" });

  await connectDB();

  if (req.method === "GET") {
    const user = await User.findById(decoded.id);
    return res.status(200).json({
      genres: user?.preferredGenres || [],
      languages: user?.preferredLanguages || [],
      regions: user?.preferredRegions || [],
      regionGroup: user?.preferredRegionGroup || "",
      allowLocationRecommendations: Boolean(user?.allowLocationRecommendations),
    });
  }

  if (req.method === "POST") {
    const genres = sanitizeArray(req.body?.genres, validGenreIds, 10);
    const languages = sanitizeArray(req.body?.languages, validLanguageCodes, 8);
    const regions = sanitizeArray(req.body?.regions, validRegionCodes, 5);
    const regionGroup = validRegionGroups.has(req.body?.regionGroup) ? req.body.regionGroup : "";
    const allowLocationRecommendations = Boolean(req.body?.allowLocationRecommendations);

    await User.findByIdAndUpdate(decoded.id, {
      preferredGenres: genres,
      preferredLanguages: languages,
      preferredRegions: regions,
      preferredRegionGroup: regionGroup,
      allowLocationRecommendations,
    });

    return res.status(200).json({ message: "Preferences saved" });
  }

  return res.status(405).json({ error: "Method not allowed" });
}
