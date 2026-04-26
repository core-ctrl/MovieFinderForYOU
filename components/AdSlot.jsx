import { useEffect } from "react";
import { ADSENSE_CLIENT_ID } from "../lib/site";
import { hasAdsConsent } from "../lib/analytics";

export default function AdSlot({
  slot = "0000000000",
  format = "auto",
  layout = "",
  responsive = true,
  className = "",
  label = "Sponsored",
}) {
  useEffect(() => {
    if (typeof window === "undefined" || !window.adsbygoogle || !ADSENSE_CLIENT_ID || !hasAdsConsent()) {
      return;
    }

    try {
      window.adsbygoogle.push({});
    } catch {
      // Ignore duplicate slot pushes during hydration.
    }
  }, []);

  return (
    <div className={`overflow-hidden rounded-2xl border border-white/8 bg-white/[0.03] p-4 ${className}`}>
      <div className="mb-3 text-[11px] font-semibold uppercase tracking-[0.24em] text-neutral-500">
        {label}
      </div>

      {ADSENSE_CLIENT_ID ? (
        <ins
          className="adsbygoogle"
          style={{ display: "block" }}
          data-ad-client={ADSENSE_CLIENT_ID}
          data-ad-slot={slot}
          data-ad-format={format}
          data-ad-layout={layout}
          data-full-width-responsive={responsive ? "true" : "false"}
        />
      ) : (
        <div className="flex min-h-[120px] items-center justify-center rounded-xl border border-dashed border-white/10 bg-black/20 text-center text-sm text-neutral-500">
          Configure `NEXT_PUBLIC_ADSENSE_CLIENT_ID` and ad slot IDs to activate this placement.
        </div>
      )}
    </div>
  );
}
