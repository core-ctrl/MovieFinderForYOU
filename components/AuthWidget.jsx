// components/AuthWidget.jsx
import { useState } from "react";
import axios from "axios";
import { FaTimes, FaEnvelope, FaLock, FaUser, FaEye, FaEyeSlash } from "react-icons/fa";

function PasswordStrength({ password }) {
  if (!password) return null;
  const checks = [
    { label: "8+ chars", ok: password.length >= 8 },
    { label: "Uppercase", ok: /[A-Z]/.test(password) },
    { label: "Number", ok: /[0-9]/.test(password) },
  ];
  const score = checks.filter(c => c.ok).length;
  const color = score === 1 ? "bg-red-500" : score === 2 ? "bg-yellow-500" : "bg-green-500";
  return (
    <div className="mt-1">
      <div className="flex gap-1 mb-1">
        {[1,2,3].map(i => <div key={i} className={`h-1 flex-1 rounded-full transition-all ${i <= score ? color : "bg-white/10"}`} />)}
      </div>
      <div className="flex gap-3">
        {checks.map(c => <span key={c.label} className={`text-xs ${c.ok ? "text-green-400" : "text-neutral-500"}`}>{c.ok ? "✓" : "·"} {c.label}</span>)}
      </div>
    </div>
  );
}

export default function AuthWidget({ open, onClose, onLogin }) {
  const [mode, setMode] = useState("login"); // login | signup | forgot
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  const handleChange = e => { setForm(p => ({ ...p, [e.target.name]: e.target.value })); setError(""); };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true); setError(""); setSuccess("");
    try {
      if (mode === "forgot") {
        await axios.post("/api/auth/forgot-password", { email: form.email });
        setSuccess("Reset link sent! Check your email 📧");
        return;
      }
      const endpoint = mode === "login" ? "/api/auth/login" : "/api/auth/register";
      const payload = mode === "login"
        ? { email: form.email, password: form.password }
        : { name: form.name, email: form.email, password: form.password };
      const res = await axios.post(endpoint, payload);
      if (mode === "signup") {
        setSuccess("Account created! Check your email 🎬");
        setTimeout(() => onLogin(res.data.user), 1500);
      } else {
        onLogin(res.data.user);
      }
    } catch (err) {
      setError(err.response?.data?.error || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const switchMode = (m) => { setMode(m); setError(""); setSuccess(""); setForm({ name: "", email: "", password: "" }); };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      <div className="relative z-10 w-full max-w-md bg-neutral-900 border border-white/10 rounded-2xl p-8 shadow-2xl animate-fadeIn" onClick={e => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 text-neutral-400 hover:text-white transition"><FaTimes size={18} /></button>

        <div className="text-center mb-8">
          <p className="text-red-500 text-3xl mb-2">🎬</p>
          <h1 className="text-2xl font-bold text-white mb-1">
            {mode === "login" ? "Welcome Back" : mode === "signup" ? "Create Account" : "Forgot Password"}
          </h1>
          <p className="text-neutral-400 text-sm">
            {mode === "login" ? "Sign in to save your favourites"
              : mode === "signup" ? "Join for personalised recommendations"
              : "Enter your email to get a reset link"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {mode === "signup" && (
            <div className="relative">
              <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
              <input type="text" name="name" placeholder="Full Name" value={form.name} onChange={handleChange} required
                className="w-full bg-white/5 border border-white/10 text-white rounded-lg pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-red-500 placeholder:text-neutral-500 transition" />
            </div>
          )}

          <div className="relative">
            <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
            <input type="email" name="email" placeholder="Email Address" value={form.email} onChange={handleChange} required
              className="w-full bg-white/5 border border-white/10 text-white rounded-lg pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-red-500 placeholder:text-neutral-500 transition" />
          </div>

          {mode !== "forgot" && (
            <div>
              <div className="relative">
                <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
                <input type={showPass ? "text" : "password"} name="password" placeholder="Password" value={form.password} onChange={handleChange} required
                  className="w-full bg-white/5 border border-white/10 text-white rounded-lg pl-10 pr-10 py-3 text-sm focus:outline-none focus:border-red-500 placeholder:text-neutral-500 transition" />
                <button type="button" onClick={() => setShowPass(s => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-white transition">
                  {showPass ? <FaEyeSlash size={14} /> : <FaEye size={14} />}
                </button>
              </div>
              {mode === "signup" && <PasswordStrength password={form.password} />}
              {mode === "login" && (
                <button type="button" onClick={() => switchMode("forgot")} className="text-xs text-neutral-500 hover:text-red-400 transition mt-1 float-right">
                  Forgot password?
                </button>
              )}
            </div>
          )}

          {error && <p className="text-red-400 text-sm text-center">{error}</p>}
          {success && <p className="text-green-400 text-sm text-center">{success}</p>}

          <button type="submit" disabled={loading} className="mt-2 bg-red-600 hover:bg-red-700 disabled:opacity-60 text-white font-semibold py-3 rounded-lg transition text-sm">
            {loading ? "Please wait..." : mode === "login" ? "Sign In" : mode === "signup" ? "Create Account" : "Send Reset Link"}
          </button>
        </form>

        <div className="text-center mt-5 text-sm text-neutral-400 flex justify-center gap-4">
          {mode !== "login" && <button onClick={() => switchMode("login")} className="hover:text-red-400 transition">Sign In</button>}
          {mode !== "signup" && <button onClick={() => switchMode("signup")} className="hover:text-red-400 transition">Create Account</button>}
        </div>
      </div>
    </div>
  );
}
