// components/ProfileMenu.jsx
import React, { useState } from "react";

export default function ProfileMenu({ user }) {
    const [open, setOpen] = useState(false);
    return (
        <div className="relative">
            <button onClick={() => setOpen(s => !s)} className="rounded-full w-9 h-9 bg-white/10">
                {user?.avatar ? <img src={user.avatar} className="w-full h-full object-cover rounded-full" /> : "U"}
            </button>

            {open && (
                <div className="absolute right-0 mt-2 bg-neutral-900 text-white rounded shadow p-3 w-48">
                    <div className="mb-2 font-semibold">{user?.name || "Guest"}</div>
                    <button className="w-full text-left py-1">Profile</button>
                    <button className="w-full text-left py-1">Settings</button>
                    <button className="w-full text-left py-1 text-red-500">Sign out</button>
                </div>
            )}
        </div>
    );
}
