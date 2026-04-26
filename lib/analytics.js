import { ADSENSE_CLIENT_ID, GA_MEASUREMENT_ID } from "./site";

export const COOKIE_CONSENT_KEY = "movie_finder_cookie_preferences_v1";
export const COOKIE_CONSENT_EVENT = "movie-finder:cookie-consent";

const defaultConsent = {
  essential: true,
  analytics: false,
  ads: false,
  updatedAt: "",
};

export function readCookieConsent() {
  if (typeof window === "undefined") return defaultConsent;

  try {
    const stored = window.localStorage.getItem(COOKIE_CONSENT_KEY);
    if (!stored) return defaultConsent;
    return { ...defaultConsent, ...JSON.parse(stored) };
  } catch {
    return defaultConsent;
  }
}

export function writeCookieConsent(consent) {
  if (typeof window === "undefined") return;

  const payload = {
    ...defaultConsent,
    ...consent,
    updatedAt: new Date().toISOString(),
  };

  window.localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(payload));
  window.dispatchEvent(new CustomEvent(COOKIE_CONSENT_EVENT, { detail: payload }));
}

export function hasAnalyticsConsent() {
  return readCookieConsent().analytics === true;
}

export function hasAdsConsent() {
  return readCookieConsent().ads === true;
}

function canTrack() {
  return typeof window !== "undefined" && typeof window.gtag === "function" && hasAnalyticsConsent();
}

export function initializeGtagConsent(consent) {
  if (typeof window === "undefined" || typeof window.gtag !== "function") return;

  window.gtag("consent", "update", {
    analytics_storage: consent.analytics ? "granted" : "denied",
    ad_storage: consent.ads ? "granted" : "denied",
    ad_user_data: consent.ads ? "granted" : "denied",
    ad_personalization: consent.ads ? "granted" : "denied",
  });
}

export function trackPageView(url) {
  if (!canTrack() || !GA_MEASUREMENT_ID) return;

  window.gtag("config", GA_MEASUREMENT_ID, {
    page_path: url,
    anonymize_ip: true,
  });
}

export function trackEvent(eventName, params = {}) {
  if (!canTrack()) return;
  window.gtag("event", eventName, params);
}

export function trackSearchQuery(query, resultCount = 0) {
  trackEvent("search", {
    search_term: query,
    result_count: resultCount,
  });
}

export function trackWatchNowClick({ provider, title, destination }) {
  trackEvent("watch_now_click", {
    provider_name: provider,
    content_title: title,
    destination_url: destination,
  });
}

export function trackWebVital(metric) {
  if (!canTrack()) return;

  window.gtag("event", metric.name, {
    event_category: "Web Vitals",
    event_label: metric.id,
    non_interaction: true,
    value: Math.round(metric.name === "CLS" ? metric.value * 1000 : metric.value),
  });
}

export function shouldLoadAnalytics() {
  return Boolean(GA_MEASUREMENT_ID) && hasAnalyticsConsent();
}

export function shouldLoadAdsense() {
  return Boolean(ADSENSE_CLIENT_ID) && hasAdsConsent();
}
