import crypto from "crypto";
import { connectDB } from "@/lib/mongodb";
import { sendPasswordResetEmail } from "@/lib/mailer";
import User from "@/models/User";
import { authLimiter } from "@/lib/rateLimit";
import { getClientIp, sanitizeEmail } from "@/lib/security";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const ip = getClientIp(req);
  const limit = authLimiter(ip);
  if (!limit.allowed) {
    return res.status(429).json({ error: `Too many attempts. Retry in ${limit.retryAfter}s` });
  }

  const email = sanitizeEmail(req.body?.email);
  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }

  try {
    await connectDB();
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(200).json({ message: "If that email exists, a reset link has been sent." });
    }

    const token = crypto.randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + 60 * 60 * 1000);

    user.resetPasswordToken = token;
    user.resetPasswordExpires = expires;
    await user.save();

    await sendPasswordResetEmail(email, token);

    return res.status(200).json({ message: "If that email exists, a reset link has been sent." });
  } catch (error) {
    console.error("FORGOT_PASSWORD_ERROR:", error.message);
    return res.status(500).json({ error: "Server error." });
  }
}
