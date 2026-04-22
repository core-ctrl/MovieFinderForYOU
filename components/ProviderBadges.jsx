// components/ProviderBadges.jsx
import React from "react";

export default function ProviderBadges({ providers = [] }) {
    if (!providers || !providers.length) return null;
    return (
        <div className="flex items-center gap-2">
            {providers.map(p => (
                <img key={p} src={`/providers/${p}.png`} alt={p} className="w-10 h-6 object-contain" />
            ))}
        </div>
    );
}
