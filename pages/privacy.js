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
