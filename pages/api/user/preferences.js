// pages/api/user/preferences.js
// GET: get preferred genres | POST: save preferred genres
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import { getUserFromRequest } from "@/lib/auth";

export default async function handler(req, res) {
  const decoded = getUserFromRequest(req);
  if (!decoded) return res.status(401).json({ error: "Not authenticated" });

  await connectDB();

  if (req.method === "GET") {
    const user = await User.findById(decoded.id);
    return res.status(200).json({ genres: user?.preferredGenres || [] });
  }

  if (req.method === "POST") {
    const { genres } = req.body; // Array of genre IDs

    await User.findByIdAndUpdate(decoded.id, { preferredGenres: genres });

    return res.status(200).json({ message: "Preferences saved" });
  }

  return res.status(405).json({ error: "Method not allowed" });
}
