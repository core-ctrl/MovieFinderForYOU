// pages/api/admin/users.js
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import { getUserFromRequest } from "@/lib/auth";

async function checkAdmin(req) {
  const decoded = getUserFromRequest(req);
  if (!decoded) return false;
  await connectDB();
  const user = await User.findById(decoded.id);
  return user?.isAdmin || false;
}

export default async function handler(req, res) {
  if (!await checkAdmin(req)) return res.status(403).json({ error: "Forbidden" });

  if (req.method === "GET") {
    const users = await User.find().sort({ createdAt: -1 }).select("name email createdAt wishlist isAdmin").limit(200);
    return res.status(200).json({ users });
  }

  if (req.method === "DELETE") {
    const { id } = req.query;
    await User.findByIdAndDelete(id);
    return res.status(200).json({ message: "Deleted" });
  }

  if (req.method === "PATCH") {
    const { id, isAdmin } = req.body;
    await User.findByIdAndUpdate(id, { isAdmin });
    return res.status(200).json({ message: "Updated" });
  }

  return res.status(405).json({ error: "Method not allowed" });
}
