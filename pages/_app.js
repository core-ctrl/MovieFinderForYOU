
// pages/_app.js
import { useState, useEffect, createContext, useContext } from "react";
import "../styles/globals.css";
import Navbar from "../components/Navbar";
import AuthWidget from "../components/AuthWidget";
import TrailerModal from "../components/TrailerModal";
import CookieBanner from "../components/CookieBanner";
import axios from "axios";

export const AuthContext = createContext(null);
export function useAuth() { return useContext(AuthContext); }

export default function App({ Component, pageProps }) {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [authOpen, setAuthOpen] = useState(false);
  const [wishlist, setWishlist] = useState([]);
  const [trailer, setTrailer] = useState({ open: false, key: null, title: "", id: null, type: "movie" });

  useEffect(() => {
    axios.get("/api/auth/me")
      .then(res => setUser(res.data.user))
      .catch(() => setUser(null))
      .finally(() => setAuthLoading(false));
  }, []);

  useEffect(() => {
    if (user) {
      axios.get("/api/user/list")
        .then(res => setWishlist((res.data.list || []).map(i => ({ ...i, id: i.mediaId }))))
        .catch(() => { });
    } else {
      try {
        const stored = localStorage.getItem("wishlist");
        if (stored) setWishlist(JSON.parse(stored));
      } catch { }
    }
  }, [user]);

  const login = (userData) => { setUser(userData); setAuthOpen(false); };

  const logout = async () => {
    await axios.post("/api/auth/logout");
    setUser(null);
    setWishlist([]);
  };

  const addToWishlist = async (movie) => {
    const isInList = wishlist.some(m => m.id === movie.id);
    const newList = isInList ? wishlist.filter(m => m.id !== movie.id) : [...wishlist, { ...movie }];
    setWishlist(newList);
    if (user) {
      try {
        if (isInList) {
          await axios.delete("/api/user/list", { params: { mediaId: movie.id, mediaType: movie.media_type || "movie" } });
        } else {
          await axios.post("/api/user/list", { mediaId: movie.id, mediaType: movie.media_type || (movie.title ? "movie" : "tv"), title: movie.title || movie.name, posterPath: movie.poster_path });
        }
      } catch (err) { console.error("Wishlist sync failed", err); }
    } else {
      localStorage.setItem("wishlist", JSON.stringify(newList));
    }
  };

  const openTrailer = (videoKey, title, id = null, type = "movie") => {
    if (!videoKey) { alert("❌ Trailer not available."); return; }
    setTrailer({ open: true, key: videoKey, title, id, type });
  };

  const closeTrailer = () => setTrailer({ open: false, key: null, title: "", id: null, type: "movie" });

  const sharedProps = { user, wishlist, addToWishlist, openAuth: () => setAuthOpen(true), openTrailer };

  return (
    <AuthContext.Provider value={{ user, login, logout, authLoading }}>
      <Navbar user={user} logout={logout} openAuth={() => setAuthOpen(true)} />
      <Component {...pageProps} {...sharedProps} />
      <AuthWidget open={authOpen} onClose={() => setAuthOpen(false)} onLogin={login} />
      <TrailerModal open={trailer.open} videoIdOrUrl={trailer.key} title={trailer.title} mediaId={trailer.id} mediaType={trailer.type} onClose={closeTrailer} />
      <CookieBanner />
    </AuthContext.Provider>
  );
}


