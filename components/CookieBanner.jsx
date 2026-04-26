import { useEffect, useState } from "react";
import Link from "next/link";
import { CookieIcon, Shield01Icon } from "@hugeicons/core-free-icons";
import { readCookieConsent, writeCookieConsent } from "../lib/analytics";
import AppIcon from "./AppIcon";

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = readCookieConsent();
    if (!consent.updatedAt) {
      setVisible(true);
    }
  }, []);

  const saveConsent = (nextConsent) => {
    writeCookieConsent(nextConsent);
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[200] p-4">
      <div className="mx-auto flex max-w-5xl flex-col gap-4 rounded-3xl border border-white/10 bg-neutral-950/95 p-5 shadow-2xl backdrop-blur-xl animate-fadeIn md:flex-row md:items-center">
        <div className="flex flex-1 gap-4">
          <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-red-400">
            <AppIcon icon={CookieIcon} size={20} />
          </div>
          <div>
            <p className="mb-1 flex items-center gap-2 text-sm font-semibold text-white">
              Privacy-first cookies
              <AppIcon icon={Shield01Icon} size={15} className="text-emerald-400" />
            </p>
            <p className="text-sm leading-relaxed text-neutral-400">
              We only activate analytics and ads after consent. Essential cookies keep your session secure and remember account-related settings.
              Read our{" "}
              <Link href="/privacy-policy" className="text-red-400 hover:underline">
                Privacy Policy
              </Link>
              {" "}and{" "}
              <Link href="/terms-and-conditions" className="text-red-400 hover:underline">
                Terms and Conditions
              </Link>
              .
            </p>
          </div>
        </div>

        <div className="flex flex-shrink-0 flex-col gap-2 sm:flex-row">
          <button
            onClick={() => saveConsent({ essential: true, analytics: false, ads: false })}
            className="rounded-xl border border-white/10 px-4 py-2 text-sm font-medium text-neutral-300 transition hover:border-white/20 hover:text-white"
          >
            Essential only
          </button>
          <button
            onClick={() => saveConsent({ essential: true, analytics: true, ads: true })}
            className="rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-500"
          >
            Accept analytics and ads
          </button>
        </div>
      </div>
    </div>
  );
}
