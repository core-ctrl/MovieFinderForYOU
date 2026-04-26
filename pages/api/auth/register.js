// pages/api/auth/register.js

import { validate, registerSchema } from "@/middleware/validate";
import { authLimiter } from "@/lib/rateLimit";
import * as AuthService from "@/services/authService";
import cookie from "cookie";
import { getClientIp } from "@/lib/security";

export default async function handler(req, res) {
  try {
    // ✅ Allow only POST
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" });
    }

    // ✅ Get IP safely
    const ip = getClientIp(req) || "unknown";

    // ✅ Rate limit
    const limit = authLimiter(ip);
    if (!limit.allowed) {
      return res.status(429).json({
        error: `Too many attempts. Retry in ${limit.retryAfter}s`,
      });
    }

    // ✅ Ensure body exists
    if (!req.body) {
      return res.status(400).json({ error: "Request body missing" });
    }

    // ✅ Validate input
    const { success, data, error } = validate(registerSchema, req.body);
    if (!success) {
      return res.status(400).json({ error });
    }

    // ✅ Register user
    const { token, user } = await AuthService.registerUser(data);

    // ✅ Set cookie properly
    res.setHeader(
      "Set-Cookie",
      cookie.serialize("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: "/",
      })
    );

    // ✅ Success response
    return res.status(201).json({ user });
  } catch (err) {
    console.error("Register Error:", err);

    const message = err.message || "Something went wrong";

    const status =
      message.includes("already exists") ||
        message.includes("Please continue")
        ? 409
        : 500;

    return res.status(status).json({ error: message });
  }
}
