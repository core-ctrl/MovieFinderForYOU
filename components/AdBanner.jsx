// components/AdBanner.jsx
// Google AdSense banner — placed between content rows
// Replace data-ad-client and data-ad-slot with your AdSense IDs
import { useEffect } from "react";

export default function AdBanner({ slot = "horizontal", className = "" }) {
    useEffect(() => {
        // Push ad after component mounts
        try {
            if (typeof window !== "undefined" && window.adsbygoogle) {
                (window.adsbygoogle = window.adsbygoogle || []).push({});
            }
        } catch { }
    }, []);

    // Don't show in development
    if (process.env.NODE_ENV === "development") {
        return (
            <div className={`flex items-center justify-center bg-white/3 border border-white/5 border-dashed rounded-xl text-neutral-700 text-xs py-6 my-6 ${className}`}>
                📢 Ad placement — Google AdSense (hidden in dev)
            </div>
        );
    }

    return (
        <div className={`my-6 ${className}`}>
            <ins
                className="adsbygoogle"
                style={{ display: "block" }}
                data-ad-client="ca-pub-XXXXXXXXXXXXXXXXX"   // ← Replace with your AdSense publisher ID
                data-ad-slot={slot === "horizontal" ? "XXXXXXXXXX" : "XXXXXXXXXX"} // ← Replace with slot ID
                data-ad-format="auto"
                data-full-width-responsive="true"
            />
        </div>
    );
}
EOF

cat > /home/claude / movie - finder - v2 / components / WatchNowButtons.jsx << 'EOF'
// components/WatchNowButtons.jsx
// Affiliate "Where to Watch" buttons — each click is a potential affiliate revenue
// Register for: Amazon Associates, Apple TV affiliate, JustWatch partner API
const PROVIDER_AFFILIATE = {
    "Netflix": null,                            // No affiliate program
    "Amazon Prime": "https://www.amazon.com/dp/",    // + ASIN (Amazon Associates)
    "Apple TV": "https://tv.apple.com/",         // Apple Affiliate
    "Hotstar": "https://www.hotstar.com/",      // Hotstar affiliate
    "JioCinema": "https://www.jiocinema.com/",
    "ZEE5": "https://www.zee5.com/",
    "SonyLIV": "https://www.sonyliv.com/",
    "YouTube Premium": "https://www.youtube.com/",
};

export default function WatchNowButtons({ providers = [], title }) {
    if (!providers.length) return null;

    const trackClick = (providerName) => {
        // GA4 event
        if (typeof gtag !== "undefined") {
            gtag("event", "affiliate_click", { provider: providerName, content_title: title });
        }
        // Mixpanel
        if (typeof mixpanel !== "undefined") {
            mixpanel.track("Affiliate Click", { provider: providerName, title });
        }
    };

    return (
        <div className="mt-4">
            <p className="text-xs text-neutral-500 mb-3 uppercase tracking-wider font-semibold">Stream On</p>
            <div className="flex flex-wrap gap-3">
                {providers.map((p) => {
                    const base = PROVIDER_AFFILIATE[p.provider_name];
                    const href = base || `https://www.justwatch.com/in/search?q=${encodeURIComponent(title)}`;

                    return (
                        <a key={p.provider_id} href={href} target="_blank" rel="noopener noreferrer sponsored"
                            onClick={() => trackClick(p.provider_name)}
                            className="flex items-center gap-2 bg-white/8 hover:bg-white/15 border border-white/10 hover:border-white/20 px-3 py-2 rounded-xl transition-all group">
                            <img src={`https://image.tmdb.org/t/p/w45${p.logo_path}`} alt={p.provider_name}
                                className="w-6 h-6 rounded-lg" />
                            <span className="text-xs font-medium text-white group-hover:text-accent transition-colors">
                                {p.provider_name}
                            </span>
                        </a>
                    );
                })}

                {/* JustWatch fallback */}
                <a href={`https://www.justwatch.com/in/search?q=${encodeURIComponent(title)}`}
                    target="_blank" rel="noopener noreferrer"
                    onClick={() => trackClick("JustWatch")}
                    className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/8 px-3 py-2 rounded-xl transition-all text-xs text-neutral-400 hover:text-white">
                    🔍 More options
                </a>
            </div>
        </div>
    );
}
