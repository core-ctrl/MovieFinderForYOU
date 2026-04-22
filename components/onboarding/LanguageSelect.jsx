// components/onboarding/LanguageSelect.jsx
import React, { useEffect, useState } from "react";

/**
 * LanguageSelect: shows primary (location-based) and secondary languages.
 * Props:
 *  - primary: string[] (preselected primary languages)
 *  - secondary: string[] (other languages)
 *  - onChange: (langs) => void
 */
export default function LanguageSelect({ primary = [], secondary = ["Japanese", "Korean", "Spanish", "French", "German", "Arabic"], onChange }) {
    const [selected, setSelected] = useState(primary);

    useEffect(() => onChange?.(selected), [selected]);

    const toggle = (lang) => {
        setSelected((s) => (s.includes(lang) ? s.filter(x => x !== lang) : [...s, lang]));
    };

    return (
        <div className="p-6 bg-neutral-900 rounded-lg text-white max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold mb-3">Which languages do you prefer?</h2>
            <p className="text-sm text-neutral-400 mb-4">We detected your region and highlighted primary choices.</p>

            <div className="mb-4">
                <h3 className="text-sm text-neutral-300 mb-2">Primary</h3>
                <div className="flex flex-wrap gap-2">
                    {primary.map((l) => (
                        <button
                            key={l}
                            onClick={() => toggle(l)}
                            className={`px-3 py-2 rounded-full text-sm ${selected.includes(l) ? "bg-red-600" : "bg-white/6"}`}
                        >
                            {l}
                        </button>
                    ))}
                </div>
            </div>

            <div>
                <h3 className="text-sm text-neutral-300 mb-2">More languages</h3>
                <div className="flex flex-wrap gap-2">
                    {secondary.map((l) => (
                        <button
                            key={l}
                            onClick={() => toggle(l)}
                            className={`px-3 py-2 rounded-full text-sm ${selected.includes(l) ? "bg-red-600" : "bg-white/6"}`}
                        >
                            {l}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
