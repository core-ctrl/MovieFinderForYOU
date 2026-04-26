import SEOMeta from "../components/SEOMeta";

const updated = "April 26, 2026";

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-black px-4 pb-20 pt-28 text-white">
      <SEOMeta
        title="Terms and Conditions"
        description="Movie Finder Terms and Conditions covering use rules, intellectual property, disclaimers, and legal obligations."
        url="/terms-and-conditions"
        keywords={["terms and conditions", "movie finder terms", "platform rules", "legal"]}
      />

      <article className="prose prose-invert mx-auto max-w-4xl">
        <h1>Terms and Conditions</h1>
        <p>Last updated: {updated}</p>

        <h2>1. Acceptance of Terms</h2>
        <p>
          By using Movie Finder, you agree to these Terms and Conditions. If you do not agree, discontinue use of the service.
        </p>

        <h2>2. Service Description</h2>
        <p>
          Movie Finder provides movie and series discovery features, recommendation tools, and links to third-party providers.
          We do not host copyrighted films, episodes, or unauthorized streams.
        </p>

        <h2>3. User Accounts</h2>
        <p>
          You are responsible for maintaining account credential security and for activity under your account.
          You must provide accurate registration information and avoid impersonation or abuse.
        </p>

        <h2>4. Prohibited Use</h2>
        <p>
          You may not use the platform to perform scraping abuse, account attacks, reverse engineering of security controls, or any unlawful content activity.
          Automated behavior that harms service stability may be blocked.
        </p>

        <h2>5. Intellectual Property</h2>
        <p>
          The platform interface, application logic, and original editorial content belong to Movie Finder.
          Third-party metadata, logos, and media references remain property of their respective owners.
        </p>

        <h2>6. Third-Party Data and Attribution</h2>
        <p>
          This product uses the TMDB API but is not endorsed or certified by TMDB.
          Third-party providers and linked services operate independently from Movie Finder.
        </p>

        <h2>7. Availability and Changes</h2>
        <p>
          We may modify, suspend, or discontinue parts of the service to improve quality, security, or compliance.
          We are not liable for temporary outages, data source interruptions, or third-party API failures.
        </p>

        <h2>8. Disclaimer and Limitation</h2>
        <p>
          The service is provided on an as-is and as-available basis without warranties of uninterrupted availability or complete metadata accuracy.
          To the maximum extent permitted by law, liability is limited for indirect or consequential damages.
        </p>

        <h2>9. Termination</h2>
        <p>
          Accounts may be suspended or removed for violations of these terms, abuse, or attempts to compromise platform security.
        </p>

        <h2>10. Governing Law</h2>
        <p>
          These terms are governed by applicable laws of India. Jurisdiction for disputes will lie in Hyderabad, Telangana, unless otherwise required by law.
        </p>

        <h2>11. Contact</h2>
        <p>
          Legal and compliance inquiries: moviefinderforyou@gmail.com
        </p>
      </article>
    </main>
  );
}
