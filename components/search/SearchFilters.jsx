// components/search/SearchFilters.jsx
import React from "react";

export default function SearchFilters({ onChange }) {
    return (
        <div className="flex gap-2 items-center text-sm text-neutral-300">
            <select onChange={(e) => onChange?.({ type: e.target.value })} className="bg-white/6 px-3 py-1 rounded">
                <option value="">All</option>
                <option value="movie">Movies</option>
                <option value="tv">Series</option>
                <option value="anime">Anime</option>
            </select>
            <select onChange={(e) => onChange?.({ sort: e.target.value })} className="bg-white/6 px-3 py-1 rounded">
                <option value="relevance">Relevance</option>
                <option value="rating">Rating</option>
                <option value="recent">New</option>
            </select>
        </div>
    );
}
