import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../lib/firebase";
import { useRouter } from "next/router";
import Head from "next/head";
import { signInWithGoogle } from "@/lib/firebaseAuth";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    // ✅ Improved validation
    const validate = () => {
        if (!email || email.trim().length === 0) return "Email is required";
        if (!password) return "Password is required";
        return "";
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        console.log("EMAIL:", email); // 🔍 debug

        const validationError = validate();
        if (validationError) {
            setError(validationError);
            return;
        }

        setLoading(true);

        try {
            await signInWithEmailAndPassword(auth, email.trim(), password);
            router.push("/");
        } catch (err) {
            const code = err?.code || "";

            if (code === "auth/user-not-found") {
                setError("No account found with this email.");
            } else if (code === "auth/wrong-password") {
                setError("Incorrect password. Please try again.");
            } else if (code === "auth/too-many-requests") {
                setError("Too many failed attempts. Please try again later.");
            } else if (code === "auth/invalid-email") {
                setError("Invalid email address.");
            } else if (code === "auth/invalid-credential") {
                setError("Invalid email or password.");
            } else if (code === "auth/user-disabled") {
                setError("This account has been disabled.");
            } else {
                setError(err.message || "Something went wrong. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    // ✅ Google login
    const handleGoogleLogin = async () => {
        setError("");
        setLoading(true);

        try {
            await signInWithGoogle();
            router.push("/");
        } catch (err) {
            const code = err?.code || "";
            if (code === "auth/popup-closed-by-user") {
                setError("Sign-in popup was closed before completing.");
            } else if (code === "auth/cancelled-popup-request") {
                setError("Another sign-in popup is already open.");
            } else if (code === "auth/account-exists-with-different-credential") {
                setError("An account already exists with the same email but different sign-in method.");

                return (
                    <>
                        <Head>
                            <title>Sign In — MovieFinder</title>
                        </Head>

                        <div className="min-h-screen bg-surface-0 flex items-center justify-center p-4">
                            <div className="w-full max-w-md glass-strong rounded-2xl p-8 border border-white/10 shadow-2xl">

                                <div className="text-center mb-8">
                                    <h1 className="text-2xl font-black text-white">Welcome back</h1>
                                    <p className="text-neutral-500 text-sm mt-1">
                                        Sign in to access your watchlist
                                    </p>
                                </div>

                                <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>

                                    {/* EMAIL */}
                                    <div>
                                        <label className="block text-sm text-neutral-400 mb-1">
                                            Email
                                        </label>
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            onInput={(e) => setEmail(e.target.value)} // 🔥 FIX
                                            placeholder="you@example.com"
                                            autoComplete="email"
                                            className="w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-accent"
                                        />
                                    </div>

                                    {/* PASSWORD */}
                                    <div>
                                        <label className="block text-sm text-neutral-400 mb-1">
                                            Password
                                        </label>
                                        <input
                                            type="password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            onInput={(e) => setPassword(e.target.value)} // 🔥 FIX
                                            placeholder="••••••••"
                                            autoComplete="current-password"
                                            className="w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-accent"
                                        />
                                    </div>

                                    {/* ERROR */}
                                    {error && (
                                        <p className="text-red-400 text-sm text-center bg-red-500/10 border border-red-500/20 rounded-xl py-2 px-3">
                                            {error}
                                        </p>
                                    )}

                                    {/* EMAIL LOGIN */}
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="bg-accent hover:bg-accent-dark disabled:opacity-50 text-white font-semibold py-3 rounded-xl"
                                    >
                                        {loading ? "Please wait..." : "Sign In"}
                                    </button>

                                    {/* GOOGLE LOGIN */}
                                    <button
                                        type="button"
                                        onClick={handleGoogleLogin}
                                        disabled={loading}
                                        className="bg-white text-black font-semibold py-3 rounded-xl"
                                    >
                                        Continue with Google
                                    </button>

                                </form>

                                <p className="text-center text-xs text-neutral-700 mt-6">
                                    Don&apos;t have an account?{" "}
                                    <a href="/" className="text-neutral-500 hover:text-accent">
                                        Back to home
                                    </a>
                                </p>

                            </div>
                        </div>
                    </>
                );
            }