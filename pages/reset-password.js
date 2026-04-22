// pages/reset-password.js
import { useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import axios from "axios";
import { FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import Link from "next/link";

export default function ResetPasswordPage() {
<<<<<<< HEAD
  const router = useRouter();
  const { token } = router.query;
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirm) return setError("Passwords do not match");
    setLoading(true); setError("");
    try {
      await axios.post("/api/auth/reset-password", { token, password });
      setSuccess(true);
      setTimeout(() => router.push("/"), 3000);
    } catch (err) {
      setError(err.response?.data?.error || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <Head><title>Reset Password — Movie Finder</title></Head>
      <div className="w-full max-w-md bg-neutral-900 border border-white/10 rounded-2xl p-8">
        <h1 className="text-2xl font-bold text-white mb-2">🔒 Reset Password</h1>
        <p className="text-neutral-400 text-sm mb-8">Enter your new password below.</p>

        {success ? (
          <div className="text-center">
            <p className="text-green-400 text-lg mb-2">✓ Password reset!</p>
            <p className="text-neutral-400 text-sm">Redirecting to home...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="relative">
              <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
              <input type={showPass ? "text" : "password"} placeholder="New Password"
                value={password} onChange={(e) => setPassword(e.target.value)} required
                className="w-full bg-white/5 border border-white/10 text-white rounded-lg pl-10 pr-10 py-3 text-sm focus:outline-none focus:border-red-500 placeholder:text-neutral-500" />
              <button type="button" onClick={() => setShowPass(s => !s)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500">
                {showPass ? <FaEyeSlash size={14} /> : <FaEye size={14} />}
              </button>
            </div>
            <div className="relative">
              <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
              <input type="password" placeholder="Confirm Password"
                value={confirm} onChange={(e) => setConfirm(e.target.value)} required
                className="w-full bg-white/5 border border-white/10 text-white rounded-lg pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-red-500 placeholder:text-neutral-500" />
            </div>
            {error && <p className="text-red-400 text-sm">{error}</p>}
            <button type="submit" disabled={loading}
              className="bg-red-600 hover:bg-red-700 disabled:opacity-60 text-white font-semibold py-3 rounded-lg transition">
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </form>
        )}
        <p className="text-center mt-6">
          <Link href="/" className="text-neutral-400 hover:text-white text-sm transition">← Back to Home</Link>
        </p>
      </div>
    </div>
  );
}
=======
    const router = useRouter();
    const { token } = router.query;
    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");
    const [showPass, setShowPass] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirm) return setError("Passwords do not match");
        setLoading(true); setError("");
        try {
            await axios.post("/api/auth/reset-password", { token, password });
            setSuccess(true);
            setTimeout(() => router.push("/"), 3000);
        } catch (err) {
            setError(err.response?.data?.error || "Something went wrong.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-black flex items-center justify-center px-4">
            <Head><title>Reset Password — Movie Finder</title></Head>
            <div className="w-full max-w-md bg-neutral-900 border border-white/10 rounded-2xl p-8">
                <h1 className="text-2xl font-bold text-white mb-2">🔒 Reset Password</h1>
                <p className="text-neutral-400 text-sm mb-8">Enter your new password below.</p>

                {success ? (
                    <div className="text-center">
                        <p className="text-green-400 text-lg mb-2">✓ Password reset!</p>
                        <p className="text-neutral-400 text-sm">Redirecting to home...</p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        <div className="relative">
                            <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
                            <input type={showPass ? "text" : "password"} placeholder="New Password"
                                value={password} onChange={(e) => setPassword(e.target.value)} required
                                className="w-full bg-white/5 border border-white/10 text-white rounded-lg pl-10 pr-10 py-3 text-sm focus:outline-none focus:border-red-500 placeholder:text-neutral-500" />
                            <button type="button" onClick={() => setShowPass(s => !s)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500">
                                {showPass ? <FaEyeSlash size={14} /> : <FaEye size={14} />}
                            </button>
                        </div>
                        <div className="relative">
                            <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
                            <input type="password" placeholder="Confirm Password"
                                value={confirm} onChange={(e) => setConfirm(e.target.value)} required
                                className="w-full bg-white/5 border border-white/10 text-white rounded-lg pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-red-500 placeholder:text-neutral-500" />
                        </div>
                        {error && <p className="text-red-400 text-sm">{error}</p>}
                        <button type="submit" disabled={loading}
                            className="bg-red-600 hover:bg-red-700 disabled:opacity-60 text-white font-semibold py-3 rounded-lg transition">
                            {loading ? "Resetting..." : "Reset Password"}
                        </button>
                    </form>
                )}
                <p className="text-center mt-6">
                    <Link href="/" className="text-neutral-400 hover:text-white text-sm transition">← Back to Home</Link>
                </p>
            </div>
        </div>
    ); 
>>>>>>> 3b3f76b6b2f75cfb78a3ee46561373052120bd14
