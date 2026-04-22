// components/ui/GlassContainer.jsx
import React from "react";
export default function GlassContainer({ children, className = "" }) {
    return (
        <div className={`bg-white/5 backdrop-blur-md border border-white/6 rounded-lg p-4 ${className}`}>
            {children}
        </div>
    );
}
