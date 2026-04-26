// components/AdBanner.jsx
import { useEffect } from "react";

export default function AdBanner({ slot = "horizontal", className = "" }) {
    useEffect(() => {
        try {
            if (typeof window !== "undefined" && window.adsbygoogle) {
                (window.adsbygoogle = window.adsbygoogle || []).push({});
            }
        } catch (e) { }
    }, []);

    if (process.env.NODE_ENV === "development") {
        return (
            <div className={`flex items-center justify-center border border-white/5 border-dashed rounded-xl text-neutral-700 text-xs py-6 my-6 ${className}`}>
                📢 Ad placement (hidden in dev)
            </div>
        );
    }

    return (
        <div className={`my-6 ${className}`}>
            <ins
                className="adsbygoogle"
                style={{ display: "block" }}
                data-ad-client="ca-pub-XXXXXXXXXXXXXXXXX"
                data-ad-slot="XXXXXXXXXX"
                data-ad-format="auto"
                data-full-width-responsive="true"
            />
        </div>
    );
}
