// pages/terms.js
import Head from "next/head";
import Link from "next/link";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-black text-white pt-28 pb-20 px-4">
      <Head><title>Terms of Service — Movie Finder</title></Head>
      <div className="max-w-3xl mx-auto">
        <Link href="/" className="text-red-400 hover:underline text-sm">← Back to Home</Link>
        <h1 className="text-3xl font-bold mt-6 mb-2">Terms of Service</h1>
        <p className="text-neutral-400 text-sm mb-8">Last updated: {new Date().toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" })}</p>

        {[
          { title: "1. Acceptance", body: "By using Movie Finder, you agree to these terms. If you do not agree, please do not use the service." },
          { title: "2. What We Are", body: "Movie Finder is a movie and series discovery platform. We display publicly available metadata (titles, ratings, overviews, posters) sourced from TMDB. We do not host, stream, distribute or store any movie or TV show content. All trailers are embedded from YouTube." },
          { title: "3. TMDB Attribution", body: "This product uses the TMDB API but is not endorsed or certified by TMDB. All movie and series data, images and metadata are © their respective rights holders. Movie Finder is a fan-built discovery tool." },
          { title: "4. User Accounts", body: "You are responsible for keeping your account credentials secure. You must not share your account or use the service for any unlawful purpose. We reserve the right to terminate accounts that violate these terms." },
          { title: "5. Intellectual Property", body: "The Movie Finder platform design, code and branding are our property. Movie data, posters and metadata belong to TMDB and the original rights holders. You may not scrape, reproduce or redistribute our platform or the underlying data." },
          { title: "6. Disclaimer", body: "Movie Finder is provided 'as is' without warranties of any kind. We are not liable for inaccuracies in movie data (sourced from TMDB), broken trailer links (hosted on YouTube), or service interruptions." },
          { title: "7. Changes", body: "We reserve the right to modify or discontinue the service at any time. We will notify registered users of significant changes via email." },
          { title: "8. Governing Law", body: "These terms are governed by the laws of India. Any disputes shall be subject to the jurisdiction of courts in Hyderabad, Telangana." },
          { title: "9. Contact", body: "Questions? Email us at moviefinderforyou@gmail.com" },
        ].map((s) => (
          <div key={s.title} className="mb-8">
            <h2 className="text-xl font-bold text-white mb-2">{s.title}</h2>
            <p className="text-neutral-300 leading-relaxed">{s.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
