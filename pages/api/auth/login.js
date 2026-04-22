// pages/api/auth/login.js
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import { signToken } from "@/lib/auth";
import { authLimiter } from "@/lib/rateLimit";
import cookie from "cookie";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  // Rate limiting
  const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress || "unknown";
  const limit = authLimiter(ip);
  if (!limit.allowed) {
    return res.status(429).json({ error: `Too many attempts. Try again in ${limit.retryAfter} seconds.` });
  }

  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: "Email and password are required" });

  try {
    await connectDB();
    const user = await User.findOne({ email }).select("+password");
    if (!user) return res.status(401).json({ error: "Invalid email or password" });

    const isValid = await user.comparePassword(password);
    if (!isValid) return res.status(401).json({ error: "Invalid email or password" });

    const token = signToken({ id: user._id, email: user.email, name: user.name });

    res.setHeader("Set-Cookie", cookie.serialize("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    }));

    return res.status(200).json({ user: { id: user._id, name: user.name, email: user.email } });
  } catch (err) {
    console.error("LOGIN_ERROR:", err);
    return res.status(500).json({ error: "Server error. Please try again." });
  }
}
