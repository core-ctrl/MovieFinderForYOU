// pages/api/user/status.js
// Quick endpoint to check if user is logged in (used by _app.js)
import { getUserFromRequest } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

export default async function handler(req, res) {
  const decoded = getUserFromRequest(req);
  if (!decoded) return res.status(200).json({ loggedIn: false, user: null });

  try {
    await connectDB();
    const user = await User.findById(decoded.id).select("name email preferredGenres wishlist isAdmin");
    if (!user) return res.status(200).json({ loggedIn: false, user: null });
    return res.status(200).json({ loggedIn: true, user });
  } catch {
    return res.status(200).json({ loggedIn: false, user: null });
  }
}
