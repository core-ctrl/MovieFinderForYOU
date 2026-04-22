// pages/api/auth/forgot-password.js
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import { sendPasswordResetEmail } from "@/lib/mailer";
import crypto from "crypto";

export default async function handler(req, res) {
<<<<<<< HEAD
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
=======
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
EOF

cat > /home/claude / movie - finder - v2 / pages / api / auth / reset - password.js << 'EOF'
// pages/api/auth/reset-password.js
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

function validatePassword(password) {
    if (password.length < 8) return "Password must be at least 8 characters";
    if (!/[A-Z]/.test(password)) return "Password must contain at least one uppercase letter";
    if (!/[0-9]/.test(password)) return "Password must contain at least one number";
    return null;
}

export default async function handler(req, res) {
    if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

    const { token, password } = req.body;
    if (!token || !password) return res.status(400).json({ error: "Token and password are required" });

    const pwError = validatePassword(password);
    if (pwError) return res.status(400).json({ error: pwError });

    try {
        await connectDB();
        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: new Date() },
        });

        if (!user) return res.status(400).json({ error: "Invalid or expired reset link." });

        user.password = password; // hashed by pre-save hook
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();

        return res.status(200).json({ message: "Password reset successfully. You can now log in." });
    } catch (err) {
        console.error("RESET_PASSWORD_ERROR:", err);
        return res.status(500).json({ error: "Server error." });
    }
>>>>>>> 3b3f76b6b2f75cfb78a3ee46561373052120bd14
}
