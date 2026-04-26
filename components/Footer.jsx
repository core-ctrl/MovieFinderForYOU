// components/Footer.jsx
import Link from "next/link";
import { Mail01Icon, News01Icon, Shield01Icon } from "@hugeicons/core-free-icons";
import AppIcon from "./AppIcon";

export default function Footer() {
  return (
    <footer className="bg-black border-t border-white/5 pt-12 pb-8 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
          <div>
            <h3 className="text-white font-bold text-lg mb-3">Movie Finder</h3>
            <p className="text-neutral-500 text-xs leading-relaxed">
              Discover movies, series, anime, trailers, blog guides, and streaming options with privacy-conscious personalization.
            </p>
          </div>
          <div>
            <h4 className="text-neutral-300 font-semibold text-sm mb-3">Discover</h4>
            <div className="flex flex-col gap-2">
              {[["Home", "/"], ["Movies", "/movies"], ["Series", "/series"], ["Blog", "/blog"], ["My List", "/my-list"]].map(([label, href]) => (
                <Link key={href} href={href} className="text-neutral-500 hover:text-white text-xs transition">{label}</Link>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-neutral-300 font-semibold text-sm mb-3">Legal</h4>
            <div className="flex flex-col gap-2">
              {[["About", "/about"], ["Contact", "/contact"], ["Privacy Policy", "/privacy-policy"], ["Terms and Conditions", "/terms-and-conditions"], ["DMCA", "/dmca"]].map(([label, href]) => (
                <Link key={href} href={href} className="text-neutral-500 hover:text-white text-xs transition">{label}</Link>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-neutral-300 font-semibold text-sm mb-3">Contact</h4>
            <div className="flex flex-col gap-2 text-xs text-neutral-500">
              <a href="mailto:moviefinderforyou@gmail.com" className="inline-flex items-center gap-2 transition hover:text-white">
                <AppIcon icon={Mail01Icon} size={12} />
                moviefinderforyou@gmail.com
              </a>
              <Link href="/blog" className="inline-flex items-center gap-2 transition hover:text-white">
                <AppIcon icon={News01Icon} size={12} />
                Editorial guides and blog
              </Link>
              <Link href="/privacy-policy" className="inline-flex items-center gap-2 transition hover:text-white">
                <AppIcon icon={Shield01Icon} size={12} />
                Cookie and privacy controls
              </Link>
            </div>
          </div>
        </div>

        {/* TMDB Attribution — REQUIRED */}
        <div className="border-t border-white/5 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img
              src="https://www.themoviedb.org/assets/2/v4/logos/v2/blue_short-8e7b30f73a4020692ccca9c88bafe5dcb6f8a62a4c6bc55cd9ba82bb2cd95f6c.svg"
              alt="TMDB Logo"
              className="h-4 opacity-60"
            />
            <p className="text-neutral-600 text-xs">
              This product uses the TMDB API but is not endorsed or certified by TMDB.
            </p>
          </div>
          <p className="text-neutral-700 text-xs">
            © {new Date().getFullYear()} Movie Finder. All rights to movie content belong to their respective owners.
          </p>
        </div>
      </div>
    </footer>
  );
}

