// components/history/WatchHistoryRow.jsx
import React from "react";

export default function WatchHistoryRow({ items = [] }) {
    if (!items.length) return <div className="text-neutral-400">No history yet.</div>;
    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {items.map(it => (
                <div key={it.id} className="bg-white/6 p-3 rounded">
                    <img src={it.poster_path || "/fallback.jpg"} className="w-full h-40 object-cover rounded" />
                    <div className="mt-2 font-semibold">{it.title || it.name}</div>
                </div>
            ))}
        </div>
    );
}
