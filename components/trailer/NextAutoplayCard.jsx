// components/trailer/NextAutoplayCard.jsx
import React from "react";

export default function NextAutoplayCard({ next, onPlay }) {
    if (!next) return null;
    return (
        <div className="p-3 bg-white/5 rounded flex gap-3 items-center">
            <img src={next.poster_path || "/fallback.jpg"} className="w-20 h-28 object-cover rounded" />
            <div>
                <div className="font-semibold">{next.title || next.name}</div>
                <div className="text-sm text-neutral-300">Up next</div>
                <div className="mt-2">
                    <button className="bg-red-600 px-3 py-1 rounded" onClick={() => onPlay(next)}>Play now</button>
                </div>
            </div>
        </div>
    );
}
