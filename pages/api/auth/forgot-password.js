// pages/api/auth/forgot-password.js
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import { sendPasswordResetEmail } from "@/lib/mailer";
import crypto from "crypto";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { email } = req.body;
  if (!email) return res.status(400).json({ error: "Email is required" });

  try {
    await connectDB();
    const user = await User.findOne({ email });

    // Always return success — don't reveal if email exists
    if (!user) return res.status(200).json({ message: "If that email exists, a reset link has been sent." });

    // Generate token
    const token = crypto.randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    user.resetPasswordToken = token;
    user.resetPasswordExpires = expires;
    await user.save();

    await sendPasswordResetEmail(email, token);

    return res.status(200).json({ message: "If that email exists, a reset link has been sent." });
  } catch (err) {
    console.error("FORGOT_PASSWORD_ERROR:", err);
    return res.status(500).json({ error: "Server error." });
  }
}
