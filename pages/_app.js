import { useEffect } from "react";
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
import {
  fetchCurrentUser, logoutUser, selectUser, selectInitialized,
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

// Inner app — has access to Redux hooks
function AppInner({ Component, pageProps, router }) {
  useLenis();
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const initialized = useSelector(selectInitialized);
  const wishlist = useSelector(selectWatchlist);
  const authOpen = useSelector(selectAuthModalOpen);
  const trailerState = useSelector(selectTrailer);

  // Boot: fetch current user from JWT cookie
  useEffect(() => { dispatch(fetchCurrentUser()); }, [dispatch]);

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

  // Props passed to every page via _app
  const sharedProps = {
    user,
    wishlist,
    addToWishlist: handleAddToWishlist,
    openAuth: (mode) => dispatch(openAuthModal(mode || "login")),
    openTrailer: handleOpenTrailer,
  };

  if (!initialized) {
    // Show minimal loader while checking auth
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <>
      <Navbar
        user={user}
        logout={handleLogout}
        openAuth={(mode) => dispatch(openAuthModal(mode))}
      />

      <AnimatePresence mode="wait">
        <motion.div
          key={router.pathname}
          variants={pageVariants}
          initial="initial"
          animate="animate"
          exit="exit"
        >
          <Component {...pageProps} {...sharedProps} />
        </motion.div>
      </AnimatePresence>

      <Footer />

      <AuthWidget
        open={authOpen}
        onClose={() => dispatch(closeAuthModal())}
        onLogin={() => dispatch(closeAuthModal())}
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

// Outer app — wraps with Redux Provider
export default function App(props) {
  return (
    <Provider store={store}>
      <AppInner {...props} />
    </Provider>
  );
}