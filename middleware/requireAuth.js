// middleware/requireAuth.js
// Use in API routes: const user = requireAuth(req); if (!user) return res.status(401)...
import { getUserFromRequest } from "../lib/auth.js";
import { connectDB } from "../lib/mongodb.js";
import User from "../models/User.js";

// Returns decoded JWT payload (fast, no DB)
export function requireAuth(req) {
    return getUserFromRequest(req);
}

// Returns full user from DB (slower, use only when needed)
export async function requireAuthFull(req) {
    const decoded = getUserFromRequest(req);
    if (!decoded) return null;
    await connectDB();
    return User.findById(decoded.id).select("-password");
}

// Returns user only if admin
export async function requireAdmin(req) {
    const user = await requireAuthFull(req);
    if (!user?.isAdmin) return null;
    return user;
}
