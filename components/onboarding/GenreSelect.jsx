// components/onboarding/GenreSelect.jsx
import React, { useState, useEffect } from "react";

const ALL_GENRES = [
    "Thriller", "Romance", "Anime", "Sci-Fi", "Horror", "Action",
    "Comedy", "Drama", "Documentary", "Mystery", "Fantasy", "Crime", "Bollywood", "Tollywood"
];

export default function GenreSelect({ value = [], onChange, minRequired = 3 }) {
    const [selected, setSelected] = useState(value);

    useEffect(() => onChange?.(selected), [selected]);

    const toggle = (g) => {
        setSelected((s) => (s.includes(g) ? s.filter(x => x !== g) : [...s, g]));
    };

    return (
        <div className="p-6 bg-neutral-900 rounded-lg text-white max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold mb-3">Which genres do you like?</h2>
            <p className="text-sm text-neutral-400 mb-4">Pick at least {minRequired} to personalize suggestions.</p>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {ALL_GENRES.map((g) => {
                    const active = selected.includes(g);
                    return (
                        <button
                            key={g}
                            onClick={() => toggle(g)}
                            className={`px-3 py-2 rounded-full text-sm font-medium transition ${active ? "bg-red-600 text-white shadow-lg" : "bg-white/6 text-white"
                                }`}
                        >
                            {g}
                        </button>
                    );
                })}
            </div>

            <div className="mt-6 text-right">
                <span className="text-sm text-neutral-400 mr-4">{selected.length} selected</span>
            </div>
        </div>
    );
}
