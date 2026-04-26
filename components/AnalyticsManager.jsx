import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Script from "next/script";
import {
  COOKIE_CONSENT_EVENT,
  initializeGtagConsent,
  readCookieConsent,
  shouldLoadAdsense,
  shouldLoadAnalytics,
  trackPageView,
} from "../lib/analytics";
import { ADSENSE_CLIENT_ID, GA_MEASUREMENT_ID } from "../lib/site";

export default function AnalyticsManager() {
  const router = useRouter();
  const [consent, setConsent] = useState(() => readCookieConsent());

  useEffect(() => {
    const handleConsent = (event) => {
      setConsent(event.detail || readCookieConsent());
    };

    window.addEventListener(COOKIE_CONSENT_EVENT, handleConsent);
    return () => window.removeEventListener(COOKIE_CONSENT_EVENT, handleConsent);
  }, []);

  useEffect(() => {
    if (!shouldLoadAnalytics()) return undefined;

    const handleRouteChange = (url) => trackPageView(url);
    router.events.on("routeChangeComplete", handleRouteChange);
    trackPageView(window.location.pathname + window.location.search);

    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, [router.events, consent.analytics]);

  useEffect(() => {
    if (!shouldLoadAnalytics()) return;
    initializeGtagConsent(consent);
  }, [consent]);

  return (
    <>
      {shouldLoadAnalytics() ? (
        <>
          <Script
            id="ga4-src"
            src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
            strategy="afterInteractive"
          />
          <Script
            id="ga4-config"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                window.gtag = gtag;
                gtag('js', new Date());
                gtag('consent', 'default', {
                  analytics_storage: 'denied',
                  ad_storage: 'denied',
                  ad_user_data: 'denied',
                  ad_personalization: 'denied'
                });
                gtag('config', '${GA_MEASUREMENT_ID}', {
                  send_page_view: false,
                  anonymize_ip: true,
                  allow_google_signals: false
                });
              `,
            }}
          />
        </>
      ) : null}

      {shouldLoadAdsense() && ADSENSE_CLIENT_ID ? (
        <Script
          id="adsense-src"
          strategy="afterInteractive"
          async
          crossOrigin="anonymous"
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT_ID}`}
        />
      ) : null}
    </>
  );
}
