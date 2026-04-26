// services/authService.js
import { connectDB } from "../lib/mongodb.js";
import User from "../models/User.js";
import { signToken } from "../lib/auth.js";
import { sendLoginThankYouEmail, sendVerificationEmail } from "../lib/mailer.js";

function normalizeEmail(email) {
    return email.trim().toLowerCase();
}

function providerLabel(provider) {
    return provider === "google" ? "Google" : provider === "github" ? "GitHub" : "email and password";
}

function credentialsEnabled(user) {
    return Array.isArray(user.authProviders) && user.authProviders.includes("credentials");
}

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

    const normalizedEmail = normalizeEmail(email);
    const existing = await User.findOne({ email: normalizedEmail });
    if (existing) {
        if (!credentialsEnabled(existing)) {
            const providers = existing.authProviders.filter((provider) => provider !== "credentials").map(providerLabel).join(" or ");
            throw new Error(`An account with this email already exists. Please continue with ${providers}.`);
        }
        throw new Error("An account with this email already exists. Please sign in instead.");
    }

    const user = await User.create({
        name: name.trim(),
        email: normalizedEmail,
        password,
        authProviders: ["credentials"],
    });

    // Non-blocking email
    sendVerificationEmail(normalizedEmail, user.name).catch((e) =>
        console.warn("Welcome email failed:", e.message)
    );

    const token = signToken({ id: user._id, email: user.email, name: user.name });
    return {
        token,
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            avatar: user.avatar,
            authProviders: user.authProviders,
        },
    };
}

export async function loginUser({ email, password }) {
    await connectDB();
    const normalizedEmail = normalizeEmail(email);
    const user = await User.findOne({ email: normalizedEmail }).select("+password");
    if (!user) throw new Error("No account found with this email. Please create an account first.");

    if (!credentialsEnabled(user)) {
        const providers = user.authProviders.filter((provider) => provider !== "credentials").map(providerLabel).join(" or ");
        throw new Error(`This email is registered with ${providers}. Please use that sign-in option.`);
    }

    const valid = await user.comparePassword(password);
    if (!valid) throw new Error("Incorrect password. Please try again.");

    sendLoginThankYouEmail(user.email, user.name).catch(() => {});

    const token = signToken({ id: user._id, email: user.email, name: user.name });
    return {
        token,
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            avatar: user.avatar,
            authProviders: user.authProviders,
        },
    };
}

export async function loginOrCreateSocialUser({
    provider,
    providerId,
    email,
    name,
    avatar = "",
}) {
    await connectDB();

    const normalizedEmail = normalizeEmail(email);
    const providerIdField = provider === "google" ? "googleId" : "githubId";
    const providerMatch = { [providerIdField]: providerId };
    let user = await User.findOne({ $or: [providerMatch, { email: normalizedEmail }] }).select("+password");
    let created = false;

    if (!user) {
        created = true;
        user = await User.create({
            name: name?.trim() || normalizedEmail.split("@")[0],
            email: normalizedEmail,
            password: `SocialAuth${Math.random().toString(36).slice(2)}A1`,
            authProviders: [provider],
            [providerIdField]: providerId,
            avatar,
        });
        sendVerificationEmail(normalizedEmail, user.name).catch(() => {});
    } else {
        user.name = user.name || name?.trim() || normalizedEmail.split("@")[0];
        user.avatar = avatar || user.avatar || "";
        user.email = normalizedEmail;
        user[providerIdField] = providerId;

        const providers = new Set(user.authProviders || []);
        providers.add(provider);
        user.authProviders = Array.from(providers);
        await user.save();
    }

    sendLoginThankYouEmail(user.email, user.name).catch(() => {});

    const token = signToken({ id: user._id, email: user.email, name: user.name });
    return {
        token,
        isNewUser: created,
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            avatar: user.avatar,
            authProviders: user.authProviders,
        },
    };
}

export async function getUserById(id) {
    await connectDB();
    return User.findById(id).select("-password");
}


