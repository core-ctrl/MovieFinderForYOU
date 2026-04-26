import React from "react";
import { getQualityOptions, getQualityLabel } from "../../utils/videoQuality";

export default function QualitySelector({ quality = "1080p", onChange, disabled = false }) {
    const options = getQualityOptions();

    return (
        <div className="flex flex-wrap gap-1.5">
            {options.map((opt) => {
                const active = opt.key === quality;
                return (
                    <button
                        key={opt.key}
                        onClick={() => !disabled && onChange?.(opt.key)}
                        disabled={disabled}
                        className={`
              px-2.5 py-1 rounded-md text-xs font-semibold transition-all
              ${active
                                ? "bg-yellow-400 text-black shadow-[0_0_10px_rgba(250,204,21,0.5)]"
                                : "bg-white/10 text-white/70 hover:bg-white/20 hover:text-white"
                            }
              ${disabled ? "opacity-40 cursor-not-allowed" : "cursor-pointer"}
            `}
                        title={`${opt.label} (${opt.width}px wide)`}
                    >
                        {opt.label}
                    </button>
                );
            })}
        </div>
    );
}

