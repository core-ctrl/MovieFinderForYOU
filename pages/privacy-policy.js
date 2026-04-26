import SEOMeta from "../components/SEOMeta";

const updated = "April 26, 2026";

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-black px-4 pb-20 pt-28 text-white">
      <SEOMeta
        title="Privacy Policy"
        description="Movie Finder Privacy Policy covering account data, cookies, analytics consent, recommendation settings, and user rights."
        url="/privacy-policy"
        keywords={["privacy policy", "cookies", "gdpr", "movie finder privacy"]}
      />

      <article className="prose prose-invert mx-auto max-w-4xl">
        <h1>Privacy Policy</h1>
        <p>Last updated: {updated}</p>

        <h2>1. Scope</h2>
        <p>
          This policy explains how Movie Finder collects, uses, stores, and protects personal data when you use the website and related services.
          Movie Finder is a discovery platform and does not host pirated streams or downloadable media files.
        </p>

        <h2>2. Data We Collect</h2>
        <p>
          We collect account information you provide directly, including name, email address, and encrypted password hash.
          We also store recommendation preferences such as selected genres, language choices, region choices, and optional location-awareness settings.
          We do not collect payment card data.
        </p>

        <h2>3. Cookies and Consent</h2>
        <p>
          Essential cookies are used for secure authentication and session continuity. Analytics and advertising cookies are disabled until you provide consent through the cookie banner.
          You can update consent by clearing saved preferences and choosing again on your next visit.
        </p>

        <h2>4. Analytics and Advertising</h2>
        <p>
          With consent, we use Google Analytics 4 for aggregated usage insights and Google AdSense for advertisement delivery.
          Without consent, these scripts do not load and no analytics or ad identifiers are written by our frontend logic.
        </p>

        <h2>5. Recommendation Data</h2>
        <p>
          Recommendation quality is improved using saved preferences and account interactions such as watchlist actions.
          Location-aware recommendation behavior remains optional and is activated only when the setting is enabled by the user.
        </p>

        <h2>6. Data Retention</h2>
        <p>
          Account data is retained while the account remains active. If you request deletion, identifiable account records and preference metadata are removed
          except where retention is legally required for security or dispute resolution.
        </p>

        <h2>7. Security Controls</h2>
        <p>
          We apply technical controls including secure cookie settings, input sanitization, request rate limiting, API bot filtering, HTTPS enforcement in production, and security headers.
          No system is perfectly secure, but we continuously review and harden our controls.
        </p>

        <h2>8. Your Rights</h2>
        <p>
          You may request access, correction, or deletion of personal data by contacting us via the support email listed on the Contact page.
          We will verify identity before processing account-level requests.
        </p>

        <h2>9. Third-Party Services</h2>
        <p>
          We use third-party services including TMDB for title metadata and provider information. Trailers may reference YouTube-hosted assets.
          Third-party services have independent privacy policies.
        </p>

        <h2>10. Contact</h2>
        <p>
          Privacy requests: moviefinderforyou@gmail.com
        </p>
      </article>
    </main>
  );
}
