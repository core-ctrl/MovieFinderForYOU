// components/onboarding/WelcomeScreen.jsx
import React from "react";

export default function WelcomeScreen({ onNext }) {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-black to-neutral-900 text-white p-6">
            <div className="max-w-2xl text-center">
                <h1 className="text-4xl md:text-6xl font-extrabold mb-4">Movie Finder</h1>
                <p className="text-lg text-neutral-300 mb-8">
                    Personalized movie & series suggestions — tailored to your taste.
                </p>

                <div className="flex gap-4 justify-center">
                    <button
                        onClick={onNext}
                        className="bg-red-600 hover:bg-red-700 px-6 py-3 rounded-lg font-semibold"
                    >
                        Get Started
                    </button>
                </div>
            </div>
        </div>
    );
}
