// pages/api/auth/register.js
import { connectDB } from "@/lib/mongodb";
import { validate, registerSchema } from "@/middleware/validate";
import { authLimiter } from "@/lib/rateLimit";
import * as AuthService from "@/services/authService";
import cookie from "cookie";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress || "unknown";
  const limit = authLimiter(ip);
  if (!limit.allowed)
    return res.status(429).json({ error: `Too many attempts. Retry in ${limit.retryAfter}s` });

  const { success, data, error } = validate(registerSchema, req.body);
  if (!success) return res.status(400).json({ error });

  try {
    const { token, user } = await AuthService.registerUser(data);
    res.setHeader("Set-Cookie", cookie.serialize("token", token, {
      httpOnly: true, secure: process.env.NODE_ENV === "production",
      sameSite: "lax", maxAge: 60 * 60 * 24 * 7, path: "/",
    }));
    return res.status(201).json({ user });
  } catch (err) {
    const status = err.message.includes("already") ? 400 : 500;
    return res.status(status).json({ error: err.message });
  }
}
