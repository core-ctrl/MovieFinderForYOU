// pages/api/admin/stats.js
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import { getUserFromRequest } from "@/lib/auth";

export default async function handler(req, res) {
  const decoded = getUserFromRequest(req);
  if (!decoded) return res.status(401).json({ error: "Unauthorized" });

  await connectDB();

  const user = await User.findById(decoded.id);
  if (!user?.isAdmin) return res.status(403).json({ error: "Forbidden" });

  const [totalUsers, recentUsers] = await Promise.all([
    User.countDocuments(),
    User.find().sort({ createdAt: -1 }).limit(10).select("name email createdAt wishlist"),
  ]);

  const totalWishlists = recentUsers.reduce(
    (acc, u) => acc + (u.wishlist?.length || 0),
    0
  );

  return res.status(200).json({ totalUsers, totalWishlists, recentUsers });
}
