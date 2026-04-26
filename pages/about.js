import Link from "next/link";
import { Building02Icon, DatabaseIcon, Mail01Icon, Shield01Icon } from "@hugeicons/core-free-icons";
import SEOMeta from "../components/SEOMeta";
import AppIcon from "../components/AppIcon";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-black px-4 pb-20 pt-28 text-white">
      <SEOMeta
        title="About Movie Finder"
        description="Learn how Movie Finder helps viewers discover movies and series with consent-aware personalization, accurate provider links, and secure account management."
        url="/about"
        keywords={["about movie finder", "movie discovery platform", "tmdb integration", "streaming search"]}
      />

      <section className="mx-auto max-w-4xl">
        <h1 className="mb-5 text-3xl font-bold md:text-4xl">About Movie Finder</h1>
        <p className="mb-8 text-base leading-8 text-neutral-300">
          Movie Finder is a discovery platform focused on helping viewers make faster watch decisions.
          We combine high-quality title metadata, provider availability, and preference-aware recommendation logic
          so users can find what to watch without jumping across multiple apps.
        </p>

        <div className="mb-8 grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
            <h2 className="mb-2 inline-flex items-center gap-2 text-lg font-semibold"><AppIcon icon={DatabaseIcon} size={18} /> Data sources</h2>
            <p className="text-sm leading-7 text-neutral-400">
              Movie and TV metadata is provided by TMDB. Trailer and provider references are resolved through officially available endpoints.
              Movie Finder does not host or distribute copyrighted video content.
            </p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
            <h2 className="mb-2 inline-flex items-center gap-2 text-lg font-semibold"><AppIcon icon={Shield01Icon} size={18} /> Privacy model</h2>
            <p className="text-sm leading-7 text-neutral-400">
              Analytics and ad scripts are gated by cookie consent. Recommendation preferences are user-managed and editable in profile settings.
              Essential authentication cookies are used only for session security.
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
          <h2 className="mb-3 inline-flex items-center gap-2 text-xl font-semibold"><AppIcon icon={Building02Icon} size={20} /> Platform commitments</h2>
          <ul className="space-y-2 text-sm leading-7 text-neutral-300">
            <li>Fast, mobile-first movie and series browsing with practical recommendation context.</li>
            <li>Clear legal attribution and transparent third-party integrations.</li>
            <li>Security-focused API design with input sanitization and rate limiting.</li>
            <li>Ad placements designed to preserve readability and avoid deceptive patterns.</li>
          </ul>
        </div>

        <div className="mt-8 flex flex-wrap gap-4 text-sm">
          <Link href="/contact" className="inline-flex items-center gap-2 text-neutral-300 transition hover:text-white"><AppIcon icon={Mail01Icon} size={14} /> Contact</Link>
          <Link href="/privacy-policy" className="text-neutral-300 transition hover:text-white">Privacy Policy</Link>
          <Link href="/terms-and-conditions" className="text-neutral-300 transition hover:text-white">Terms and Conditions</Link>
        </div>
      </section>
    </main>
  );
}
