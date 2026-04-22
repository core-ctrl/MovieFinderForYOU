// pages/api/auth/me.js
// Returns current user from JWT cookie
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import { getUserFromRequest } from "@/lib/auth";

export default async function handler(req, res) {
  const decoded = getUserFromRequest(req);

  if (!decoded) {
    return res.status(401).json({ user: null });
  }

  try {
    await connectDB();
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({ user: null });
    }

    return res.status(200).json({ user });
  } catch (err) {
    return res.status(500).json({ user: null });
  }
}
