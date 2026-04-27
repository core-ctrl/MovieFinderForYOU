import { useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare01Icon, CheckmarkCircle01Icon } from "@hugeicons/core-free-icons";
import AppIcon from "./AppIcon";

export default function FeedbackForm() {
    const [message, setMessage] = useState("");
    const [userEmail, setUserEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setSuccess(false);

        try {
            await axios.post("/api/feedback", {
                message: message.trim(),
                userEmail: userEmail.trim(),
            });
            setSuccess(true);
            setMessage("");
            setUserEmail("");
        } catch (err) {
            setError(err.response?.data?.error || "Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full max-w-xl mx-auto">
            <AnimatePresence mode="wait">
                {success ? (
                    <motion.div
                        key="success"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="glass-strong rounded-2xl p-8 border border-green-500/20 text-center"
                    >
                        <div className="w-14 h-14 bg-green-500/10 border border-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                            <AppIcon icon={CheckmarkCircle01Icon} className="text-green-400" size={28} />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">Thank you!</h3>
                        <p className="text-neutral-400 text-sm">Your feedback has been submitted successfully.</p>
                        <button
                            onClick={() => setSuccess(false)}
                            className="mt-6 text-sm text-accent hover:text-accent-dark font-medium transition-colors"
                        >
                            Submit another feedback
                        </button>
                    </motion.div>
                ) : (
                    <motion.form
                        key="form"
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -12 }}
                        onSubmit={handleSubmit}
                        className="glass-strong rounded-2xl p-6 md:p-8 border border-white/10 flex flex-col gap-4"
                    >
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 bg-accent/10 border border-accent/20 rounded-xl flex items-center justify-center">
                                <AppIcon icon={MessageSquare01Icon} className="text-accent" size={18} />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-white">Send Feedback</h3>
                                <p className="text-xs text-neutral-500">We&apos;d love to hear from you</p>
                            </div>
                        </div>

                        <input
                            type="email"
                            placeholder="Your email (optional)"
                            value={userEmail}
                            onChange={(e) => setUserEmail(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-accent placeholder:text-neutral-600"
                        />

                        <textarea
                            placeholder="Your message..."
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            required
                            rows={4}
                            maxLength={2000}
                            className="w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-accent placeholder:text-neutral-600 resize-none"
                        />

                        <div className="flex items-center justify-between">
                            <span className="text-[10px] text-neutral-600">
                                {message.length}/2000
                            </span>
                        </div>

                        {error && (
                            <p className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-2">
                                {error}
                            </p>
                        )}

                        <button
                            type="submit"
                            disabled={loading || !message.trim()}
                            className="bg-accent hover:bg-accent-dark text-white font-bold py-3 rounded-xl transition-all hover:shadow-glow-red disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? "Sending..." : "Submit Feedback"}
                        </button>
                    </motion.form>
                )}
            </AnimatePresence>
        </div>
    );
}

