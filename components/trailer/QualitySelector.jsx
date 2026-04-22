// components/trailer/QualitySelector.jsx
import React from "react";

export default function QualitySelector({ quality = "720p", onChange }) {
    const opts = ["360p", "480p", "720p", "1080p"];
    return (
        <div className="flex gap-2">
            {opts.map(q => (
                <button key={q} onClick={() => onChange?.(q)} className={`px-2 py-1 rounded ${q === quality ? "bg-yellow-400" : "bg-white/6"}`}>{q}</button>
            ))}
        </div>
    );
}
