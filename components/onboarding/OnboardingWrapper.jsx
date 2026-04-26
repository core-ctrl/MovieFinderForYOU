// components/onboarding/OnboardingWrapper.jsx
import React, { useState, useEffect } from "react";
import WelcomeScreen from "./WelcomeScreen";
import GenreSelect from "./GenreSelect";
import LanguageSelect from "./LanguageSelect";

export default function OnboardingWrapper({ onComplete }) {
    const [step, setStep] = useState(0);
    const [genres, setGenres] = useState([]);
    const [languages, setLanguages] = useState([]);

    // fetch location-based primary languages
    const [primaryLangs, setPrimaryLangs] = useState(["en", "hi", "te", "ta", "kn", "ml"]);

    useEffect(() => {
        // location detection stub (replace with ipapi or server-side detection later)
        async function detect() {
            try {
                const res = await fetch("https://ipapi.co/json").then(r => r.json()).catch(() => null);
                if (res?.country === "US") setPrimaryLangs(["en", "es", "fr"]);
                if (res?.country === "JP") setPrimaryLangs(["ja", "en"]);
                // more rules as needed
            } catch { }
        }
        detect();
    }, []);

    const next = () => setStep(s => s + 1);
    const prev = () => setStep(s => Math.max(0, s - 1));

    return (
        <div className="min-h-screen bg-neutral-900 text-white p-6">
            {step === 0 && <WelcomeScreen onNext={next} />}
            {step === 1 && (
                <div className="max-w-4xl mx-auto">
                    <GenreSelect onChange={setGenres} />
                    <div className="flex justify-between mt-6">
                        <button onClick={prev} className="px-4 py-2 bg-white/6 rounded">Back</button>
                        <button onClick={next} className="px-4 py-2 bg-red-600 rounded disabled:opacity-50" disabled={genres.length < 1}>Continue</button>
                    </div>
                </div>
            )}
            {step === 2 && (
                <div className="max-w-4xl mx-auto">
                    <LanguageSelect primary={primaryLangs} onChange={setLanguages} />
                    <div className="flex justify-between mt-6">
                        <button onClick={prev} className="px-4 py-2 bg-white/6 rounded">Back</button>
                        <button onClick={() => onComplete?.({ genres, languages })} className="px-4 py-2 bg-red-600 rounded">Finish</button>
                    </div>
                </div>
            )}
        </div>
    );
}
