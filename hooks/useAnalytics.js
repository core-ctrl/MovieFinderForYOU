// hooks/useAnalytics.js
// Unified analytics — GA4 + internal event API
import { useCallback } from "react";
import axios from "axios";

const INTERNAL = process.env.NODE_ENV === "production";

export function useAnalytics() {
    const track = useCallback(async (event, props = {}) => {
        // Google Analytics 4
        if (typeof window !== "undefined" && window.gtag) {
            window.gtag("event", event, props);
        }

        // Mixpanel (optional)
        if (typeof window !== "undefined" && window.mixpanel) {
            window.mixpanel.track(event, props);
        }

        // Internal event store
        if (INTERNAL) {
            try {
                await axios.post("/api/analytics/event", { event, ...props }).catch(() => { });
            } catch { }
        }
    }, []);

    const trackTrailerPlay = (mediaId, mediaType, title) => track("trailer_play", { mediaId, mediaType, title });
    const trackSave = (mediaId, mediaType, title) => track("save", { mediaId, mediaType, title });
    const trackSearch = (query) => track("search", { query });
    const trackClick = (mediaId, mediaType, title) => track("click", { mediaId, mediaType, title });
    const trackPageView = (page) => track("page_view", { page });

    return { track, trackTrailerPlay, trackSave, trackSearch, trackClick, trackPageView };
}
