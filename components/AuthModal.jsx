// components/AuthModal.jsx
import React from "react";

export default function AuthModal({ open, onClose }) {
    if (!open) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/60" onClick={onClose} />
            <div className="relative bg-neutral-900 text-white p-6 rounded-lg max-w-md w-full z-60">
                <h3 className="text-xl font-bold mb-4">Sign in</h3>
                <button disabled className="w-full bg-white text-black py-2 rounded mb-2 opacity-50 cursor-not-allowed relative">
                    Continue with Google
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] uppercase tracking-wider text-neutral-600 bg-black/10 px-2 py-0.5 rounded-full">Coming Soon</span>
                </button>
                <button className="w-full bg-white/10 py-2 rounded">Continue with Email</button>
                <div className="text-sm text-neutral-400 mt-4">This is a frontend mock — connect your NextAuth provider server-side later.</div>
            </div>
        </div>
    );
}
