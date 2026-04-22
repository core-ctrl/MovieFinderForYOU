// pages/api/user/list.js
// GET: fetch wishlist | POST: add to wishlist | DELETE: remove from wishlist
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import { getUserFromRequest } from "@/lib/auth";

export default async function handler(req, res) {
  const decoded = getUserFromRequest(req);
  if (!decoded) return res.status(401).json({ error: "Not authenticated" });

  await connectDB();

  if (req.method === "GET") {
    const user = await User.findById(decoded.id);
    return res.status(200).json({ list: user?.wishlist || [] });
  }

  if (req.method === "POST") {
    const { mediaId, mediaType, title, posterPath } = req.body;

    await User.findByIdAndUpdate(
      decoded.id,
      {
        $addToSet: {
          wishlist: { mediaId, mediaType, title, posterPath, addedAt: new Date() },
        },
      },
      { new: true }
    );

    return res.status(200).json({ message: "Added to list" });
  }

  if (req.method === "DELETE") {
    const { mediaId, mediaType } = req.query;

    await User.findByIdAndUpdate(decoded.id, {
      $pull: { wishlist: { mediaId: Number(mediaId), mediaType } },
    });

    return res.status(200).json({ message: "Removed from list" });
  }

  return res.status(405).json({ error: "Method not allowed" });
}
