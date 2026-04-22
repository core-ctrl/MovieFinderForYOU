// components/ProviderIcons.jsx
const mapping = {
    "Netflix": "/providers/netflix.png",
    "Prime Video": "/providers/prime.png",
    "Disney Plus": "/providers/disney.png",
    "Disney+": "/providers/disney.png",
    "Hotstar": "/providers/hotstar.png",
    "Disney+ Hotstar": "/providers/hotstar.png",
    "ZEE5": "/providers/zee5.png",
    "JioCinema": "/providers/jiocinema.png",
};

export default function ProviderIcons({ providers = [] }) {
    if (!providers || providers.length === 0) return null;
    return (
        <div className="flex items-center gap-2">
            {providers.slice(0, 6).map(p => (
                <img
                    key={p.provider_id}
                    src={mapping[p.provider_name] || "/providers/default.png"}
                    alt={p.provider_name}
                    className="h-6"
                />
            ))}
        </div>
    );
}
