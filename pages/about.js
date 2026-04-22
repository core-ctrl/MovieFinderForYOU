// pages/about.js
import Head from "next/head";
import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-black text-white pt-28 pb-20 px-4">
      <Head><title>About — Movie Finder</title></Head>
      <div className="max-w-3xl mx-auto">
        <Link href="/" className="text-red-400 hover:underline text-sm">← Back to Home</Link>
        <h1 className="text-3xl font-bold mt-6 mb-6">About Movie Finder</h1>

        <p className="text-neutral-300 leading-relaxed text-lg mb-8">
          Movie Finder is a free movie and series discovery platform. Browse trending titles, watch trailers, find where to stream, and save your favourites — all in one place.
        </p>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-8">
          <div className="flex items-center gap-4 mb-4">
            <img
              src="https://www.themoviedb.org/assets/2/v4/logos/v2/blue_long_2-9665a76b1ae401a510ec1e0ca6ea8e53.svg"
              alt="TMDB Logo"
              className="h-8"
            />
          </div>
          <p className="text-neutral-300 text-sm leading-relaxed">
            This product uses the TMDB API but is not endorsed or certified by TMDB.
            All movie and series data, posters, backdrops and metadata are provided by
            <a href="https://www.themoviedb.org" target="_blank" rel="noopener noreferrer" className="text-red-400 hover:underline ml-1">
              themoviedb.org
            </a>.
            All rights to movie content belong to their respective owners.
            Movie Finder is a discovery tool only — we do not host or distribute any content.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-10">
          {[
            { icon: "🎬", label: "Movies & Series", value: "500,000+" },
            { icon: "⭐", label: "Ratings", value: "Live from TMDB" },
            { icon: "🎥", label: "Trailers", value: "YouTube Embeds" },
            { icon: "🌍", label: "Languages", value: "Multi-language" },
            { icon: "📱", label: "Platform", value: "Web + Mobile" },
            { icon: "🔒", label: "Data", value: "Secure & Private" },
          ].map((s) => (
            <div key={s.label} className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
              <div className="text-2xl mb-1">{s.icon}</div>
              <div className="text-sm font-semibold">{s.value}</div>
              <div className="text-xs text-neutral-500">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="flex gap-4 flex-wrap text-sm">
          <Link href="/privacy" className="text-neutral-400 hover:text-white transition">Privacy Policy</Link>
          <Link href="/terms" className="text-neutral-400 hover:text-white transition">Terms of Service</Link>
          <Link href="/dmca" className="text-neutral-400 hover:text-white transition">DMCA</Link>
          <a href="mailto:moviefinderforyou@gmail.com" className="text-neutral-400 hover:text-white transition">Contact</a>
        </div>
      </div>
    </div>
  );
}
