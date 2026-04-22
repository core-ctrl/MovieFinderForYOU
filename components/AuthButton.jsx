// components/AuthButton.jsx
import React, { useState } from "react";
import AuthModal from "./AuthModal";

export default function AuthButton() {
    const [open, setOpen] = useState(false);
    return (
        <>
            <button onClick={() => setOpen(true)} className="bg-white/6 px-3 py-1 rounded text-white">Sign in</button>
            <AuthModal open={open} onClose={() => setOpen(false)} />
        </>
    );
}
