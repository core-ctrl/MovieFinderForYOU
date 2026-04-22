// components/ui/Card.jsx
import React from "react";

export default function Card({ children, className = "" }) {
    return <div className={`bg-white/6 rounded-lg p-4 ${className}`}>{children}</div>;
}
