// pages/privacy.js
import Head from "next/head";
import Link from "next/link";

export default function PrivacyPage() {
    return (
        <div className="min-h-screen bg-black text-white pt-28 pb-20 px-4">
            <Head>
                <title>Privacy Policy — Movie Finder</title>
            </Head>
            <div className="max-w-3xl mx-auto prose prose-invert">
                <Link href="/" className="text-red-400 hover:underline text-sm">← Back to Home</Link>
                <h1 className="text-3xl font-bold mt-6 mb-2">Privacy Policy</h1>
                <p className="text-neutral-400 text-sm mb-8">Last updated: {new Date().toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" })}</p>

                {[
                    { title: "1. What We Collect", body: `We collect your name, email address and password (hashed) when you create an account. We also store your saved watchlist and genre preferences in our database. We do not collect payment information, phone numbers, or any government ID.` },
                    { title: "2. How We Use Your Data", body: `Your data is used solely to provide personalised movie and series recommendations, save your watchlist, and send you account-related emails (welcome email, password reset). We do not sell your data to any third party.` },
                    { title: "3. Third-Party Services", body: `This product uses the TMDB API to fetch movie and series data. Movie posters, backdrops and metadata are provided by TMDB (themoviedb.org). Trailers are embedded from YouTube. We do not control the data practices of TMDB or YouTube — please refer to their respective privacy policies.` },
                    { title: "4. Cookies", body: `We use a single HTTP-only cookie to keep you logged in. This cookie does not track you across websites. We may use Google Analytics cookies for traffic analytics — you can opt out via the cookie banner.` },
                    { title: "5. Data Storage", body: `Your account data is stored in MongoDB Atlas (cloud database hosted on AWS Mumbai region). Passwords are hashed using bcrypt and never stored in plain text.` },
                    { title: "6. Your Rights", body: `You can delete your account and all associated data at any time from your Profile page. You can also request a copy of your data by emailing us at moviefinderforyou@gmail.com.` },
                    { title: "7. Children", body: `This service is not directed to children under the age of 13. We do not knowingly collect data from children.` },
                    { title: "8. Changes", body: `We may update this policy from time to time. Continued use of the service after changes means you accept the updated policy.` },
                    { title: "9. Contact", body: `For any privacy concerns, email us at: moviefinderforyou@gmail.com` },
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
EOF

cat > /home/claude / movie - finder - v2 / pages / terms.js << 'EOF'
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
EOF

cat > /home/claude / movie - finder - v2 / pages / dmca.js << 'EOF'
// pages/dmca.js
import Head from "next/head";
import Link from "next/link";

export default function DMCAPage() {
    return (
        <div className="min-h-screen bg-black text-white pt-28 pb-20 px-4">
            <Head><title>DMCA Policy — Movie Finder</title></Head>
            <div className="max-w-3xl mx-auto">
                <Link href="/" className="text-red-400 hover:underline text-sm">← Back to Home</Link>
                <h1 className="text-3xl font-bold mt-6 mb-2">DMCA Policy</h1>

                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-8">
                    <p className="text-neutral-300 leading-relaxed mb-4">
                        Movie Finder is a <strong className="text-white">discovery and aggregation platform</strong>. We do not host, store, upload or distribute any movies, TV shows or other copyrighted content.
                    </p>
                    <p className="text-neutral-300 leading-relaxed">
                        All movie data and images are served directly from <strong className="text-white">TMDB (themoviedb.org)</strong>. All trailers are embedded from <strong className="text-white">YouTube</strong>. We do not control or host this content.
                    </p>
                </div>

                <h2 className="text-xl font-bold mb-3">If You Believe Your Content Is Being Infringed</h2>
                <p className="text-neutral-300 leading-relaxed mb-6">
                    Since we do not host content, the correct DMCA contact for movie data is <a href="https://www.themoviedb.org/talk/5f9c9c9c9c9c9c9c9c9c9c9c" className="text-red-400 hover:underline">TMDB</a> and for trailers it is <a href="https://www.youtube.com/t/dmca_policy" className="text-red-400 hover:underline">YouTube</a>.
                </p>

                <h2 className="text-xl font-bold mb-3">Contact Us</h2>
                <p className="text-neutral-300 leading-relaxed">
                    If you have a concern specific to Movie Finder platform content, email:<br />
                    <a href="mailto:moviefinderforyou@gmail.com" className="text-red-400 hover:underline">moviefinderforyou@gmail.com</a>
                </p>
            </div>
        </div>
    );
}
EOF

cat > /home/claude / movie - finder - v2 / pages / about.js << 'EOF'
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