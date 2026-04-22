// components/admin/GenreStats.jsx
import React from "react";

export default function GenreStats() {
    return (
        <div className="bg-neutral-900 p-4 rounded">
            <h3 className="font-bold mb-2">Top Genres</h3>
            <ul className="text-sm">
                <li>Action — 34%</li>
                <li>Drama — 18%</li>
                <li>Romance — 11%</li>
            </ul>
        </div>
    );
}
