// components/admin/UserStats.jsx
import React from "react";

export default function UserStats() {
    // placeholder stats
    return (
        <div className="bg-neutral-900 p-4 rounded">
            <h3 className="font-bold mb-2">Users</h3>
            <div>Active today: <strong>184</strong></div>
            <div>New signups: <strong>12</strong></div>
        </div>
    );
}
