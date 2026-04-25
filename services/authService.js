// services/authService.js
import { connectDB } from "../lib/mongodb.js";
import User from "../models/User.js";
import { signToken } from "../lib/auth.js";
import { sendVerificationEmail } from "../lib/mailer.js";

// Validate password strength
export function validatePassword(pw) {
    if (!pw || pw.length < 8) return "Password must be at least 8 characters";
    if (!/[A-Z]/.test(pw)) return "Must contain an uppercase letter";
    if (!/[0-9]/.test(pw)) return "Must contain a number";
    return null;
}

export async function registerUser({ name, email, password }) {
    const err = validatePassword(password);
    if (err) throw new Error(err);

    await connectDB();

    const existing = await User.findOne({ email });
    if (existing) throw new Error("Email already registered");

    const user = await User.create({ name, email, password });

    // Non-blocking email
    sendVerificationEmail(email, name).catch((e) =>
        console.warn("Welcome email failed:", e.message)
    );

    const token = signToken({ id: user._id, email: user.email, name: user.name });
    return { token, user: { id: user._id, name: user.name, email: user.email } };
}

export async function loginUser({ email, password }) {
    await connectDB();
    const user = await User.findOne({ email }).select("+password");
    if (!user) throw new Error("Invalid email or password");

    const valid = await user.comparePassword(password);
    if (!valid) throw new Error("Invalid email or password");

    const token = signToken({ id: user._id, email: user.email, name: user.name });
    return { token, user: { id: user._id, name: user.name, email: user.email } };
}

export async function getUserById(id) {
    await connectDB();
    return User.findById(id).select("-password");
}


