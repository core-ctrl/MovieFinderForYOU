// pages/_app.js
import { useState, useEffect, createContext, useContext } from "react";
import { AnimatePresence, motion } from "framer-motion";
import "../styles/globals.css";
import Navbar from "../components/Navbar";
import AuthWidget from "../components/AuthWidget";
import TrailerModal from "../components/TrailerModal";
import CookieBanner from "../components/CookieBanner";
import Footer from "../components/Footer";
import useLenis from "../hooks/useLenis";
import axios from "axios";

export const AuthContext = createContext(null);
export function useAuth() { return useContext(AuthContext); }

const pageVariants = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] } },
  exit: { opacity: 0, y: -10, transition: { duration: 0.25 } },
};

export default function App({ Component, pageProps, router }) {
  useLenis();

  const [user, setUser] = useState(null);
  const [authLoading, setAuthL] = useState(true);
  const [authOpen, setAuthOpen] = useState(false);
  const [wishlist, setWishlist] = useState([]);
  const [trailer, setTrailer] = useState({ open: false, key: null, title: "", id: null, type: "movie" });

  // ── FIX: replace alert() with a proper toast ──
  const [toast, setToast] = useState(null); // { message, type }
  const showToast = (message, type = "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  useEffect(() => {
    axios.get("/api/auth/me")
      .then(r => setUser(r.data.user))
      .catch(() => setUser(null))
      .finally(() => setAuthL(false));
  }, []);

  useEffect(() => {
    if (user) {
      axios.get("/api/user/list")
        .then(r => setWishlist((r.data.list || []).map(i => ({ ...i, id: i.mediaId }))))
        .catch(() => { });
    } else {
      try {
        const s = localStorage.getItem("wishlist");
        if (s) setWishlist(JSON.parse(s));
      } catch { }
    }
  }, [user]);

  const login = (u) => { setUser(u); setAuthOpen(false); };
  const logout = async () => { await axios.post("/api/auth/logout"); setUser(null); setWishlist([]); };

  const addToWishlist = async (movie) => {
    const inList = wishlist.some(m => m.id === movie.id);
    const next = inList ? wishlist.filter(m => m.id !== movie.id) : [...wishlist, movie];
    setWishlist(next);
    if (user) {
      try {
        if (inList)
          await axios.delete("/api/user/list", { params: { mediaId: movie.id, mediaType: movie.media_type || "movie" } });
        else
          await axios.post("/api/user/list", {
            mediaId: movie.id,
            mediaType: movie.media_type || (movie.title ? "movie" : "tv"),
            title: movie.title || movie.name,
            posterPath: movie.poster_path,
          });
      } catch { }
    } else {
      localStorage.setItem("wishlist", JSON.stringify(next));
    }
  };

  // ── FIX: no more alert() — show a nice toast instead ──
  const openTrailer = (key, title, id, type = "movie") => {
    if (!key) {
      showToast("Trailer not available for this title.");
      return;
    }
    setTrailer({ open: true, key, title, id, type });
  };

  const closeTrailer = () => setTrailer({ open: false, key: null, title: "", id: null, type: "movie" });

  const shared = { user, wishlist, addToWishlist, openAuth: () => setAuthOpen(true), openTrailer };

  return (
    <AuthContext.Provider value={{ user, login, logout, authLoading }}>
      {/* Global Navbar — rendered ONCE here only */}
      <Navbar user={user} logout={logout} openAuth={() => setAuthOpen(true)} />

      <AnimatePresence mode="wait">
        <motion.div key={router.pathname} variants={pageVariants} initial="initial" animate="animate" exit="exit">
          <Component {...pageProps} {...shared} />
        </motion.div>
      </AnimatePresence>

      <Footer />
      <AuthWidget open={authOpen} onClose={() => setAuthOpen(false)} onLogin={login} />
      <TrailerModal
        open={trailer.open}
        videoIdOrUrl={trailer.key}
        title={trailer.title}
        mediaId={trailer.id}
        mediaType={trailer.type}
        onClose={closeTrailer}
      />
      <CookieBanner />

      {/* ── Toast notification (replaces browser alert) ── */}
      <AnimatePresence>
        {toast && (
          <motion.div
            key="toast"
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[99999] flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-2xl border border-white/10 backdrop-blur-md"
            style={{ background: "rgba(20,20,20,0.92)", minWidth: 260 }}
          >
            <span className="text-lg">{toast.type === "error" ? "🎬" : "✅"}</span>
            <span className="text-white text-sm font-medium">{toast.message}</span>
            <button
              onClick={() => setToast(null)}
              className="ml-auto text-white/40 hover:text-white transition text-lg leading-none"
              aria-label="Dismiss"
            >✕</button>
          </motion.div>
        )}
      </AnimatePresence>
    </AuthContext.Provider>
  );
}