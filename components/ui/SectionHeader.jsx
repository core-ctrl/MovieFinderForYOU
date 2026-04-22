// components/ui/SectionHeader.jsx
import React from "react";
export default function SectionHeader({ title, subtitle, action }) {
    return (
        <div className="flex items-center justify-between mb-3">
            <div>
                <h3 className="text-2xl font-bold">{title}</h3>
                {subtitle && <div className="text-sm text-neutral-400">{subtitle}</div>}
            </div>
            <div>{action}</div>
        </div>
    );
}
