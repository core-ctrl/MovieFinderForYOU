// pages/api/auth/register.js
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import { signToken } from "@/lib/auth";
import { sendVerificationEmail } from "@/lib/mailer";
import cookie from "cookie";

// Password strength rules
function validatePassword(password) {
  if (password.length < 8) return "Password must be at least 8 characters";
  if (!/[A-Z]/.test(password)) return "Password must contain at least one uppercase letter";
  if (!/[0-9]/.test(password)) return "Password must contain at least one number";
  return null;
}

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { name, email, password } = req.body;

  if (!name || !email || !password)
    return res.status(400).json({ error: "All fields are required" });

  const pwError = validatePassword(password);
  if (pwError) return res.status(400).json({ error: pwError });

  try {
    await connectDB();

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ error: "Email already registered" });

    const user = await User.create({ name, email, password });

    // Send welcome/verification email (non-blocking — don't fail if email fails)
    try {
      await sendVerificationEmail(email, name);
    } catch (emailErr) {
      console.warn("Email send failed (non-critical):", emailErr.message);
    }

    const token = signToken({ id: user._id, email: user.email, name: user.name });

    res.setHeader("Set-Cookie", cookie.serialize("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    }));

    return res.status(201).json({ user: { id: user._id, name: user.name, email: user.email } });
  } catch (err) {
    console.error("REGISTER_ERROR:", err);
    return res.status(500).json({ error: "Server error. Please try again." });
  }
}
