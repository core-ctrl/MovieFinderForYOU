// components/Navbar.jsx
import Link from "next/link";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaSearch, FaUser, FaSignOutAlt, FaCog, FaHeart, FaBars, FaTimes } from "react-icons/fa";

export default function Navbar({ user, logout, openAuth }) {
  const router = useRouter();
  const [scrolled, setScrolled]   = useState(false);
  const [menuOpen, setMenuOpen]   = useState(false);
  const [mobileOpen, setMobile]   = useState(false);
  const [query, setQuery]         = useState("");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navItems = [
    { name: "Home",    href: "/" },
    { name: "Movies",  href: "/movies" },
    { name: "Series",  href: "/series" },
    { name: "My List", href: "/my-list" },
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) { router.push(`/search?q=${encodeURIComponent(query.trim())}`); setQuery(""); }
  };

  return (
    <>
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed top-0 left-0 w-full z-[100] transition-all duration-500 ${
          scrolled ? "bg-black/90 backdrop-blur-2xl border-b border-white/5 shadow-2xl" : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-5 md:px-8 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <span className="text-2xl font-black tracking-tight">
              <span className="gradient-text-red">MOVIE</span>
              <span className="text-white">FINDER</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map(item => {
              const active = router.pathname === item.href || router.pathname.startsWith(item.href + "/");
              return (
                <Link key={item.href} href={item.href}
                  className={`relative px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                    active ? "text-white" : "text-neutral-400 hover:text-white"
                  }`}
                >
                  {active && (
                    <motion.span layoutId="nav-pill"
                      className="absolute inset-0 bg-white/8 rounded-lg"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
                    />
                  )}
                  <span className="relative z-10">{item.name}</span>
                </Link>
              );
            })}
          </div>

          {/* Right */}
          <div className="flex items-center gap-3">
            {/* Search */}
            <form onSubmit={handleSearch} className="hidden md:flex items-center glass rounded-full px-3 py-1.5 gap-2 group">
              <FaSearch className="text-neutral-500 text-xs flex-shrink-0 group-focus-within:text-accent transition-colors" />
              <input type="text" placeholder="Search..." value={query} onChange={e => setQuery(e.target.value)}
                className="bg-transparent outline-none text-white text-sm w-28 focus:w-48 transition-all duration-300 placeholder:text-neutral-600" />
            </form>

            {/* Auth */}
            {user ? (
              <div className="relative">
                <button onClick={() => setMenuOpen(o => !o)}
                  className="w-9 h-9 rounded-full bg-gradient-to-br from-accent to-accent-dark flex items-center justify-center text-white font-bold text-sm border-2 border-white/10 hover:border-white/30 transition-all">
                  {user.name?.[0]?.toUpperCase()}
                </button>
                <AnimatePresence>
                  {menuOpen && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9, y: -8 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9, y: -8 }}
                      transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                      className="absolute right-0 mt-2 w-56 glass-strong rounded-2xl p-2 shadow-2xl border border-white/10"
                    >
                      <div className="px-3 py-2 border-b border-white/8 mb-1">
                        <p className="text-white text-sm font-semibold truncate">{user.name}</p>
                        <p className="text-neutral-500 text-xs truncate">{user.email}</p>
                      </div>
                      {[
                        { icon: <FaUser size={11} />, label: "Profile", href: "/profile" },
                        { icon: <FaHeart size={11} />, label: "My List", href: "/my-list" },
                      ].map(item => (
                        <Link key={item.href} href={item.href} onClick={() => setMenuOpen(false)}
                          className="flex items-center gap-3 px-3 py-2 text-sm text-white hover:bg-white/6 rounded-xl transition-colors">
                          <span className="text-neutral-400">{item.icon}</span> {item.label}
                        </Link>
                      ))}
                      <div className="border-t border-white/8 mt-1 pt-1">
                        <button onClick={() => { setMenuOpen(false); logout(); }}
                          className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-400 hover:bg-red-500/8 rounded-xl transition-colors">
                          <FaSignOutAlt size={11} /> Sign Out
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <button onClick={openAuth}
                className="bg-accent hover:bg-accent-dark text-white text-sm font-semibold px-5 py-2 rounded-full transition-all hover:shadow-glow-red">
                Sign In
              </button>
            )}

            {/* Mobile burger */}
            <button onClick={() => setMobile(o => !o)} className="md:hidden text-white">
              {mobileOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-white/5 bg-black/95 backdrop-blur-2xl"
            >
              <div className="px-5 py-4 flex flex-col gap-1">
                <form onSubmit={handleSearch} className="flex items-center glass rounded-xl px-3 py-2 gap-2 mb-3">
                  <FaSearch className="text-neutral-500 text-xs" />
                  <input type="text" placeholder="Search movies & series..." value={query}
                    onChange={e => setQuery(e.target.value)}
                    className="bg-transparent outline-none text-white text-sm flex-1 placeholder:text-neutral-600" />
                </form>
                {navItems.map(item => (
                  <Link key={item.href} href={item.href} onClick={() => setMobile(false)}
                    className="px-3 py-2.5 text-neutral-300 hover:text-white text-sm font-medium rounded-xl hover:bg-white/5 transition-colors">
                    {item.name}
                  </Link>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </>
  );
}
