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

    const validate = () => {
        if (!email.trim()) return "Email is required";
        if (!password) return "Password is required";
        return "";
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

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
                setError("Incorrect password.");
            } else {
                setError("Login failed. Try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        setError("");
        setLoading(true);

        try {
            await signInWithGoogle();
            router.push("/");
        } catch (err) {
            const code = err?.code || "";

            if (code === "auth/popup-closed-by-user") {
                setError("Popup closed.");
            } else {
                setError("Google sign-in failed.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Head>
                <title>Sign In — MovieFinder</title>
            </Head>

            <div className="min-h-screen flex items-center justify-center p-4 bg-black">
                <div className="w-full max-w-md p-8 rounded-xl bg-gray-900 text-white">

                    <h1 className="text-2xl font-bold mb-6 text-center">
                        Sign In
                    </h1>

                    <form onSubmit={handleSubmit} className="space-y-4">

                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full p-3 rounded bg-gray-800"
                        />

                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full p-3 rounded bg-gray-800"
                        />

                        {error && (
                            <p className="text-red-400 text-sm text-center">{error}</p>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-red-600 py-3 rounded"
                        >
                            {loading ? "Loading..." : "Sign In"}
                        </button>

                        <button
                            type="button"
                            onClick={handleGoogleLogin}
                            className="w-full bg-white text-black py-3 rounded"
                        >
                            Continue with Google
                        </button>

                    </form>
                </div>
            </div>
        </>
    );
}