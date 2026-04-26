import React, { useEffect, useMemo, useState } from "react";
import { LANGUAGE_OPTIONS } from "../../lib/preferenceOptions";

export default function LanguageSelect({ primary = [], onChange }) {
    const primaryCodes = primary.length ? primary : ["en", "hi", "te", "ta"];
    const [selected, setSelected] = useState(primaryCodes);

    useEffect(() => onChange?.(selected), [selected, onChange]);

    const primaryLanguages = useMemo(
        () => primaryCodes
            .map((code) => LANGUAGE_OPTIONS.find((language) => language.code === code))
            .filter(Boolean),
        [primaryCodes]
    );
    const secondaryLanguages = useMemo(
        () => LANGUAGE_OPTIONS.filter((language) => !primaryCodes.includes(language.code)),
        [primaryCodes]
    );

    const toggle = (code) => {
        setSelected((current) => (current.includes(code) ? current.filter((item) => item !== code) : [...current, code]));
    };

    return (
        <div className="mx-auto max-w-3xl rounded-lg bg-neutral-900 p-6 text-white">
            <h2 className="mb-3 text-2xl font-bold">Which languages do you prefer?</h2>
            <p className="mb-4 text-sm text-neutral-400">We prioritize titles in your chosen languages.</p>

            <div className="mb-4">
                <h3 className="mb-2 text-sm text-neutral-300">Suggested</h3>
                <div className="flex flex-wrap gap-2">
                    {primaryLanguages.map((language) => (
                        <button
                            key={language.code}
                            onClick={() => toggle(language.code)}
                            className={`rounded-full px-3 py-2 text-sm ${selected.includes(language.code) ? "bg-red-600" : "bg-white/6"}`}
                        >
                            {language.label}
                        </button>
                    ))}
                </div>
            </div>

            <div>
                <h3 className="mb-2 text-sm text-neutral-300">More languages</h3>
                <div className="flex flex-wrap gap-2">
                    {secondaryLanguages.map((language) => (
                        <button
                            key={language.code}
                            onClick={() => toggle(language.code)}
                            className={`rounded-full px-3 py-2 text-sm ${selected.includes(language.code) ? "bg-red-600" : "bg-white/6"}`}
                        >
                            {language.label}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
