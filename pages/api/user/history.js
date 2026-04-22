// pages/api/user/history.js
// GET: get watch history | POST: add to history
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import { getUserFromRequest } from "@/lib/auth";

export default async function handler(req, res) {
  const decoded = getUserFromRequest(req);
  if (!decoded) return res.status(401).json({ error: "Not authenticated" });

  await connectDB();

  if (req.method === "GET") {
    const user = await User.findById(decoded.id).select("watchHistory");
    return res.status(200).json({ history: user?.watchHistory || [] });
  }

  if (req.method === "POST") {
    const { mediaId, mediaType, title, posterPath } = req.body;

    await User.findByIdAndUpdate(decoded.id, {
      $push: {
        watchHistory: {
          $each: [{ mediaId, mediaType, title, posterPath, watchedAt: new Date() }],
          $position: 0,
          $slice: 50, // Keep last 50 items
        },
      },
    });

    return res.status(200).json({ message: "Added to history" });
  }

  return res.status(405).json({ error: "Method not allowed" });
}
