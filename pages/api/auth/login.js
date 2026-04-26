// pages/api/auth/login.js

import { validate, loginSchema } from "@/middleware/validate";
import { authLimiter } from "@/lib/rateLimit";
import * as AuthService from "@/services/authService";
import cookie from "cookie";
import { getClientIp } from "@/lib/security";

export default async function handler(req, res) {
  try {
    // ✅ Only POST allowed
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" });
    }

    // ✅ Get IP safely
    const ip = getClientIp(req) || "unknown";

    // ✅ Rate limiting
    const limit = authLimiter(ip);
    if (!limit.allowed) {
      return res.status(429).json({
        error: `Too many attempts. Retry in ${limit.retryAfter}s`,
      });
    }

    // ✅ Check body exists
    if (!req.body) {
      return res.status(400).json({ error: "Request body missing" });
    }

    // ✅ Validate input
    const { success, data, error } = validate(loginSchema, req.body);
    if (!success) {
      return res.status(400).json({ error });
    }

    // ✅ Login user
    const { token, user } = await AuthService.loginUser(data);

    // ✅ Set cookie
    res.setHeader(
      "Set-Cookie",
      cookie.serialize("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7,
        path: "/",
      })
    );

    // ✅ Success
    return res.status(200).json({ user });
  } catch (err) {
    console.error("Login Error:", err);

    const message = err.message || "Login failed";

    let status = 500;
    if (message.includes("No account")) status = 404;
    else if (message.includes("password")) status = 401;

    return res.status(status).json({ error: message });
  }
}