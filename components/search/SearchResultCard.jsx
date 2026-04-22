// components/search/SearchResultCard.jsx
import React from "react";

export default function SearchResultCard({ item, onPlay, onAdd }) {
    return (
        <div className="flex gap-4 p-3 bg-neutral-900 rounded">
            <img src={item.poster_path || "/fallback.jpg"} className="w-20 h-28 object-cover rounded" />
            <div className="flex-1">
                <div className="flex justify-between">
                    <div>
                        <div className="font-semibold">{item.title || item.name}</div>
                        <div className="text-sm text-neutral-400">{item.year || item.release_date}</div>
                    </div>
                    <div className="text-sm">⭐ {item.vote_average ?? "—"}</div>
                </div>
                <p className="text-sm text-neutral-400 mt-2 line-clamp-2">{item.overview}</p>
                <div className="mt-3 flex gap-2">
                    <button onClick={() => onPlay(item)} className="bg-red-600 px-3 py-1 rounded">Play</button>
                    <button onClick={() => onAdd(item)} className="bg-white/6 px-3 py-1 rounded">Add</button>
                </div>
            </div>
        </div>
    );
}
