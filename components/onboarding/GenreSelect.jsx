import React, { useEffect, useState } from "react";
import { ALL_GENRES } from "../../lib/preferenceOptions";

export default function GenreSelect({ value = [], onChange, minRequired = 3 }) {
    const [selected, setSelected] = useState(value);

    useEffect(() => onChange?.(selected), [selected, onChange]);

    const toggle = (genreId) => {
        setSelected((current) =>
            current.includes(genreId) ? current.filter((id) => id !== genreId) : [...current, genreId]
        );
    };

    return (
        <div className="mx-auto max-w-3xl rounded-lg bg-neutral-900 p-6 text-white">
            <h2 className="mb-3 text-2xl font-bold">Which genres do you like?</h2>
            <p className="mb-4 text-sm text-neutral-400">Pick at least {minRequired} to personalize suggestions.</p>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                {ALL_GENRES.map((genre) => {
                    const active = selected.includes(genre.id);
                    return (
                        <button
                            key={genre.id}
                            onClick={() => toggle(genre.id)}
                            className={`rounded-full px-3 py-2 text-sm font-medium transition ${
                                active ? "bg-red-600 text-white shadow-lg" : "bg-white/6 text-white"
                            }`}
                        >
                            {genre.name}
                        </button>
                    );
                })}
            </div>

            <div className="mt-6 text-right">
                <span className="mr-4 text-sm text-neutral-400">{selected.length} selected</span>
            </div>
        </div>
    );
}
