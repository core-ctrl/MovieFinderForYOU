import SEOMeta from "../components/SEOMeta";

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-black px-4 pb-20 pt-28 text-white">
      <SEOMeta
        title="Contact Movie Finder"
        description="Contact Movie Finder for support, legal notices, privacy requests, and partnership inquiries."
        url="/contact"
        keywords={["contact movie finder", "support", "privacy requests", "dmca notices"]}
      />

      <section className="mx-auto max-w-3xl">
        <h1 className="mb-4 text-3xl font-bold md:text-4xl">Contact</h1>
        <p className="mb-8 text-base leading-8 text-neutral-300">
          For account issues, privacy requests, legal notices, or business inquiries, contact the team through the channels below.
          We typically respond within two business days.
        </p>

        <div className="space-y-4">
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
            <h2 className="mb-2 text-lg font-semibold">General Support</h2>
            <p className="text-sm text-neutral-300">moviefinderforyou@gmail.com</p>
            <p className="mt-2 text-sm leading-7 text-neutral-400">
              Use this for login issues, recommendation feedback, broken provider links, or account troubleshooting.
            </p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
            <h2 className="mb-2 text-lg font-semibold">Privacy and Data Requests</h2>
            <p className="text-sm text-neutral-300">moviefinderforyou@gmail.com</p>
            <p className="mt-2 text-sm leading-7 text-neutral-400">
              Include the email used on your account and specify whether your request is for data access, correction, or deletion.
            </p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
            <h2 className="mb-2 text-lg font-semibold">Legal Notices</h2>
            <p className="text-sm text-neutral-300">moviefinderforyou@gmail.com</p>
            <p className="mt-2 text-sm leading-7 text-neutral-400">
              DMCA and intellectual property notices should include complete claim details and verifiable contact information.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
