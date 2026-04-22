// components/Navbar.jsx
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { FaSearch, FaUser, FaSignOutAlt } from "react-icons/fa";

export default function Navbar({ user, logout, openAuth }) {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [query, setQuery] = useState("");

  const navItems = [
    { name: "Home", href: "/" },
    { name: "Movies", href: "/movies" },
    { name: "Series", href: "/series" },
    { name: "My List", href: "/my-list" },
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
      setQuery("");
    }
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-black/40 backdrop-blur-xl border-b border-white/5 px-6 py-3">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        {/* Left: Logo + Links */}
        <div className="flex items-center gap-8">
          <Link
            href="/"
            className="text-2xl font-bold text-white hover:text-red-500 transition"
          >
            🎬 Finder
          </Link>

          <div className="hidden md:flex items-center gap-6 text-sm font-medium">
            {navItems.map((item) => {
              const isActive =
                router.pathname === item.href ||
                router.pathname.startsWith(item.href + "/");
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`relative pb-1 transition ${
                    isActive ? "text-white" : "text-neutral-400 hover:text-white"
                  }`}
                >
                  {item.name}
                  {isActive && (
                    <span className="absolute left-0 right-0 -bottom-0.5 h-[2px] rounded-full bg-red-600" />
                  )}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Right: Search + Auth */}
        <div className="flex items-center gap-4">
          {/* Search bar */}
          <form
            onSubmit={handleSearch}
            className="hidden md:flex items-center bg-white/10 rounded-full px-3 py-1.5 gap-2"
          >
            <FaSearch className="text-neutral-400 text-xs flex-shrink-0" />
            <input
              type="text"
              placeholder="Search..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="bg-transparent border-none outline-none text-white text-sm w-28 focus:w-44 transition-all placeholder:text-neutral-500"
            />
          </form>

          {/* Auth section */}
          {user ? (
            <div className="relative">
              <button
                onClick={() => setMenuOpen((o) => !o)}
                className="w-9 h-9 rounded-full bg-red-600 flex items-center justify-center text-white font-bold text-sm border-2 border-white/20 hover:border-white/50 transition"
              >
                {user.name?.[0]?.toUpperCase() || "U"}
              </button>

              {menuOpen && (
                <div className="absolute right-0 mt-2 w-52 bg-neutral-900 border border-white/10 rounded-xl p-2 shadow-2xl z-50 animate-fadeIn">
                  <div className="px-3 py-2 border-b border-white/10 mb-1">
                    <p className="text-white text-sm font-medium truncate">
                      {user.name}
                    </p>
                    <p className="text-neutral-400 text-xs truncate">
                      {user.email}
                    </p>
                  </div>
                  <Link
                    href="/profile"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 text-sm text-white hover:bg-white/5 rounded-lg transition"
                  >
                    <FaUser size={12} /> My Profile
                  </Link>
                  <Link
                    href="/my-list"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 text-sm text-white hover:bg-white/5 rounded-lg transition"
                  >
                    ❤️ My List
                  </Link>
                  <div className="border-t border-white/10 my-1" />
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      logout();
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 rounded-lg transition"
                  >
                    <FaSignOutAlt size={12} /> Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={openAuth}
              className="bg-red-600 hover:bg-red-700 text-white text-sm font-medium px-4 py-2 rounded-full transition"
            >
              Sign In
            </button>
          )}
        </div>
      </div>

      {/* Mobile row */}
      <div className="md:hidden mt-3 flex flex-col gap-2">
        <form
          onSubmit={handleSearch}
          className="flex items-center bg-white/10 rounded-full px-3 py-1.5 gap-2 mx-1"
        >
          <FaSearch className="text-neutral-400 text-xs" />
          <input
            type="text"
            placeholder="Search movies & series..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="bg-transparent outline-none text-white text-sm flex-1 placeholder:text-neutral-500"
          />
        </form>
        <div className="flex gap-4 overflow-x-auto no-scrollbar py-1 px-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-neutral-300 text-sm px-2 py-0.5 whitespace-nowrap"
            >
              {item.name}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
