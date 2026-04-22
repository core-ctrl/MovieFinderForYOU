// components/search/SearchAutocomplete.jsx
import React from "react";

export default function SearchAutocomplete({ suggestions = [], onPick }) {
    if (!suggestions?.length) return null;
    return (
        <div className="absolute left-0 right-0 bg-neutral-900 rounded shadow-lg mt-2 z-50 p-2">
            {suggestions.map((s, i) => (
                <div key={i} onClick={() => onPick(s)} className="p-2 hover:bg-white/6 rounded cursor-pointer text-white">
                    <div className="font-medium">{s.title || s.name || s.query}</div>
                    <div className="text-sm text-neutral-400">{s.subtitle}</div>
                </div>
            ))}
        </div>
    );
}
