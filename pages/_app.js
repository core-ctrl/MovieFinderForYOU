// pages/_app.js
import { useEffect, useState } from "react";
import { Provider, useDispatch, useSelector } from "react-redux";
import { AnimatePresence, motion } from "framer-motion";
import "../styles/globals.css";
import store from "../store";
import Navbar from "../components/Navbar";
import AuthWidget from "../components/AuthWidget";
import TrailerModal from "../components/TrailerModal";
import CookieBanner from "../components/CookieBanner";
import Footer from "../components/Footer";
import useLenis from "../hooks/useLenis";
import { initAnalytics } from "../lib/firebase";
import {
  fetchCurrentUser, logoutUser, selectUser, selectInitialized, setUser,
} from "../store/slices/authSlice";
import {
  fetchWatchlist, toggleWatchlist, toggleGuestWatchlist,
  setWatchlist, clearWatchlist, selectWatchlist,
} from "../store/slices/watchlistSlice";
import {
  openAuthModal, closeAuthModal, openTrailer, closeTrailer,
  selectAuthModalOpen, selectTrailer,
} from "../store/slices/uiSlice";

const pageVariants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } },
  exit: { opacity: 0, transition: { duration: 0.2 } },
};

function AppInner({ Component, pageProps, router }) {
  useLenis();
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const initialized = useSelector(selectInitialized);
  const wishlist = useSelector(selectWatchlist);
  const authOpen = useSelector(selectAuthModalOpen);
  const trailerState = useSelector(selectTrailer);
  const [authFeedback, setAuthFeedback] = useState({ type: "", message: "" });

  // Firebase analytics
  useEffect(() => {
    initAnalytics();
  }, []);

  // Boot: fetch current user from JWT cookie
  useEffect(() => {
    dispatch(fetchCurrentUser());
  }, [dispatch]);

  // Handle auth query params (e.g. ?authError=... ?authSuccess=...)
  useEffect(() => {
    const { authError, authSuccess, authMode, ...rest } = router.query;
    const message = typeof authError === "string"
      ? authError
      : typeof authSuccess === "string" ? authSuccess : "";
    if (!message) return;

    setAuthFeedback({
      type: typeof authError === "string" ? "error" : "success",
      message,
    });
    dispatch(openAuthModal(typeof authMode === "string" ? authMode : "login"));
    router.replace({ pathname: router.pathname, query: rest }, undefined, { shallow: true });
  }, [dispatch, router]);

  // Sync guest preferences when user logs in
  useEffect(() => {
    if (!user) return;
    let active = true;

    async function syncGuestPreferences() {
      try {
        const {
          hasMeaningfulPreferences,
          preferencesFromUser,
          readStoredPreferences,
          writeStoredPreferences,
        } = await import("../lib/userPreferences");

        const currentUserId = user.id || user._id;
        const stored = readStoredPreferences();
        const fromUser = preferencesFromUser(user);

        if (fromUser.completed) { writeStoredPreferences(fromUser); return; }
        if (!hasMeaningfulPreferences(stored) || stored.syncedUserId === currentUserId) return;

        const response = await fetch("/api/user/preferences", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            genres: stored.genres,
            languages: stored.languages,
            regions: stored.regions,
            regionGroup: stored.regionGroup,
            allowLocationRecommendations: stored.allowLocationRecommendations,
          }),
        });

        if (!response.ok) throw new Error("Preference sync failed");

        writeStoredPreferences({ ...stored, completed: true, syncedUserId: currentUserId });

        if (active) {
          dispatch(setUser({
            ...user,
            preferredGenres: stored.genres,
            preferredLanguages: stored.languages,
            preferredRegions: stored.regions,
            preferredRegionGroup: stored.regionGroup,
            allowLocationRecommendations: stored.allowLocationRecommendations,
          }));
        }
      } catch { }
    }

    syncGuestPreferences();
    return () => { active = false; };
  }, [dispatch, user]);

  // Sync wishlist when user changes
  useEffect(() => {
    if (!initialized) return;
    if (user) {
      dispatch(fetchWatchlist());
    } else {
      try {
        const stored = localStorage.getItem("watchlist");
        if (stored) dispatch(setWatchlist(JSON.parse(stored)));
        else dispatch(clearWatchlist());
      } catch { dispatch(clearWatchlist()); }
    }
  }, [user, initialized, dispatch]);

  const handleLogout = () => dispatch(logoutUser());

  const handleAddToWishlist = (movie) => {
    if (user) dispatch(toggleWatchlist(movie));
    else dispatch(toggleGuestWatchlist(movie));
  };

  const handleOpenTrailer = (key, title, id, type = "movie") => {
    if (!key) { alert("❌ Trailer not available."); return; }
    dispatch(openTrailer({ key, title, id, type }));
  };

  const sharedProps = {
    user,
    wishlist,
    addToWishlist: handleAddToWishlist,
    openAuth: (mode) => dispatch(openAuthModal(mode || "login")),
    openTrailer: handleOpenTrailer,
  };

  if (!initialized) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <>
      <Navbar user={user} logout={handleLogout} openAuth={(mode) => dispatch(openAuthModal(mode))} />

      <AnimatePresence mode="wait">
        <motion.div key={router.pathname} variants={pageVariants} initial="initial" animate="animate" exit="exit">
          <Component {...pageProps} {...sharedProps} />
        </motion.div>
      </AnimatePresence>

      <Footer />

      <AuthWidget
        open={authOpen}
        onClose={() => { setAuthFeedback({ type: "", message: "" }); dispatch(closeAuthModal()); }}
        onLogin={() => dispatch(closeAuthModal())}
        externalFeedback={authFeedback}
      />

      <TrailerModal
        open={trailerState.open}
        videoIdOrUrl={trailerState.key}
        title={trailerState.title}
        mediaId={trailerState.id}
        mediaType={trailerState.type}
        onClose={() => dispatch(closeTrailer())}
      />

      <CookieBanner />
    </>
  );
}

export default function App(props) {
  return (
    <Provider store={store}>
      <AppInner {...props} />
    </Provider>
  );
}