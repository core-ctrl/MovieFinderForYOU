// pages/api/auth/change-password.js
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import { getUserFromRequest } from "@/lib/auth";

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    try {
        // Verify user is authenticated
        const decoded = getUserFromRequest(req);
        if (!decoded) {
            return res.status(401).json({ error: "Unauthorized" });
        }

        const { oldPassword, newPassword } = req.body;

        // Validate input
        if (!oldPassword || !newPassword) {
            return res.status(400).json({ error: "Current password and new password are required" });
        }

        // Validate password strength
        if (newPassword.length < 8) {
            return res.status(400).json({ error: "Password must be at least 8 characters" });
        }
        if (!/[A-Z]/.test(newPassword)) {
            return res.status(400).json({ error: "Password must contain an uppercase letter" });
        }
        if (!/[0-9]/.test(newPassword)) {
            return res.status(400).json({ error: "Password must contain a number" });
        }

        await connectDB();

        // Find user by ID
        const user = await User.findById(decoded.id).select("+password");

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // Check if user has credentials auth (password-based login)
        const hasCredentials = user.authProviders && user.authProviders.includes("credentials");
        if (!hasCredentials) {
            return res.status(400).json({ error: "Password change not available for social login accounts" });
        }

        // Verify current password
        const isValid = await user.comparePassword(oldPassword);
        if (!isValid) {
            return res.status(400).json({ error: "Current password is incorrect" });
        }

        // Update password
        user.password = newPassword;
        await user.save();

        return res.status(200).json({ message: "Password changed successfully" });
    } catch (error) {
        console.error("CHANGE_PASSWORD_ERROR:", error.message);
        return res.status(500).json({ error: "Failed to change password" });
    }
}

