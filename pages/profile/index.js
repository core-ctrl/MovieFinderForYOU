// pages/profile/index.js
import { useState } from "react";
import Head from "next/head";
import axios from "axios";

const ALL_GENRES = [
  { id: 28, name: "Action" }, { id: 12, name: "Adventure" },
  { id: 16, name: "Animation" }, { id: 35, name: "Comedy" },
  { id: 80, name: "Crime" }, { id: 99, name: "Documentary" },
  { id: 18, name: "Drama" }, { id: 10751, name: "Family" },
  { id: 14, name: "Fantasy" }, { id: 27, name: "Horror" },
  { id: 9648, name: "Mystery" }, { id: 10749, name: "Romance" },
  { id: 878, name: "Sci-Fi" }, { id: 53, name: "Thriller" },
];

export default function ProfilePage({ user, wishlist = [], openAuth }) {
  const [selectedGenres, setSelectedGenres] = useState(user?.preferredGenres || []);
  const [saved, setSaved] = useState(false);

  if (!user) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center gap-4">
        <Head><title>Profile — Movie Finder</title></Head>
        <p className="text-4xl">👤</p>
        <p className="text-xl font-bold">Sign in to view your profile</p>
        <button onClick={openAuth} className="mt-4 bg-red-600 text-white px-6 py-3 rounded-xl font-medium">
          Sign In
        </button>
      </div>
    );
  }

  const toggleGenre = (id) => {
    setSelectedGenres((prev) =>
      prev.includes(id) ? prev.filter((g) => g !== id) : [...prev, id]
    );
    setSaved(false);
  };

  const savePreferences = async () => {
    await axios.post("/api/user/preferences", { genres: selectedGenres });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="min-h-screen bg-black text-white pt-28 px-4 md:px-6">
      <Head><title>Profile — Movie Finder</title></Head>

      <div className="max-w-3xl mx-auto">
        {/* Avatar + Name */}
        <div className="flex items-center gap-5 mb-10">
          <div className="w-20 h-20 rounded-full bg-red-600 flex items-center justify-center text-3xl font-bold">
            {user.name?.[0]?.toUpperCase()}
          </div>
          <div>
            <h1 className="text-2xl font-bold">{user.name}</h1>
            <p className="text-neutral-400 text-sm">{user.email}</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-10">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-5 text-center">
            <p className="text-3xl font-bold text-red-400">{wishlist.length}</p>
            <p className="text-sm text-neutral-400 mt-1">Saved Titles</p>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-2xl p-5 text-center">
            <p className="text-3xl font-bold text-red-400">{selectedGenres.length}</p>
            <p className="text-sm text-neutral-400 mt-1">Favourite Genres</p>
          </div>
        </div>

        {/* Genre Preferences */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-8">
          <h2 className="text-xl font-bold mb-4">Favourite Genres</h2>
          <p className="text-sm text-neutral-400 mb-5">
            Select genres to get personalised recommendations on the home page.
          </p>
          <div className="flex flex-wrap gap-3 mb-6">
            {ALL_GENRES.map((genre) => (
              <button
                key={genre.id}
                onClick={() => toggleGenre(genre.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                  selectedGenres.includes(genre.id)
                    ? "bg-red-600 text-white"
                    : "bg-white/10 text-neutral-300 hover:bg-white/20"
                }`}
              >
                {genre.name}
              </button>
            ))}
          </div>
          <button
            onClick={savePreferences}
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-2.5 rounded-xl font-medium transition text-sm"
          >
            {saved ? "✓ Saved!" : "Save Preferences"}
          </button>
        </div>
      </div>
    </div>
  );
}
