import { useState, useEffect, useCallback, useMemo } from "react";

/**
 * YouTube quality mapping
 * vq param: passed to iframe playerVars.vq
 * ytQuality: passed to player.setPlaybackQuality()
 */
export const QUALITY_MAP = {
    "1080p": { vq: "hd1080", yt: "hd1080", width: 1920 },
    "1440p": { vq: "hd1440", yt: "hd1440", width: 2560 },
    "2160p": { vq: "hd2160", yt: "hd2160", width: 3840 },
    "4320p": { vq: "hd4320", yt: "highres", width: 7680 },
};

const QUALITY_ORDER = ["1080p", "1440p", "2160p", "4320p"];

function getScreenPhysicalWidth() {
    if (typeof window === "undefined") return 1920;
    return Math.round(window.screen.width * (window.devicePixelRatio || 1));
}

function getScreenPhysicalHeight() {
    if (typeof window === "undefined") return 1080;
    return Math.round(window.screen.height * (window.devicePixelRatio || 1));
}

function getConnectionInfo() {
    if (typeof navigator === "undefined") return { effectiveType: "4g", downlink: 10, saveData: false };
    const conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    if (!conn) return { effectiveType: "4g", downlink: 10, saveData: false };
    return {
        effectiveType: conn.effectiveType || "4g",
        downlink: conn.downlink || 10,
        saveData: !!conn.saveData,
    };
}

function getDeviceMemory() {
    if (typeof navigator === "undefined") return 4;
    return navigator.deviceMemory || 4;
}

/**
 * Determine optimal quality based on screen + network + memory
 */
export function computeOptimalQuality({
    screenWidth,
    screenHeight,
    effectiveType,
    downlink,
    saveData,
    memory,
    cap,
} = {}) {
    const w = screenWidth || getScreenPhysicalWidth();
    const h = screenHeight || getScreenPhysicalHeight();
    const conn = getConnectionInfo();
    const et = effectiveType || conn.effectiveType;
    const dl = downlink || conn.downlink;
    const sd = saveData !== undefined ? saveData : conn.saveData;
    const mem = memory || getDeviceMemory();

    // Minimum enforced quality: 1080p always
    const FLOOR = "1080p";

    // Determine max quality screen can physically display
    let maxByScreen = "4320p";
    if (w >= 7680 || h >= 4320) maxByScreen = "4320p";
    else if (w >= 3840 || h >= 2160) maxByScreen = "2160p";
    else if (w >= 2560 || h >= 1440) maxByScreen = "1440p";
    else if (w >= 1920 || h >= 1080) maxByScreen = "1080p";

    // Determine max quality network can sustain (Mbps)
    let maxByNetwork = "4320p";
    if (dl >= 40 && et === "4g") maxByNetwork = "4320p";
    else if (dl >= 25 && et === "4g") maxByNetwork = "2160p";
    else if (dl >= 15 && (et === "4g" || et === "5g")) maxByNetwork = "1440p";
    else if (dl >= 8 && (et === "4g" || et === "5g")) maxByNetwork = "1080p";

    // Memory constraint — 4K+ needs decent RAM
    let maxByMemory = "4320p";
    if (mem < 4) maxByMemory = "1080p";
    else if (mem < 6) maxByMemory = "1440p";
    else if (mem < 8) maxByMemory = "2160p";

    // Pick the most conservative of the three, but never below 1080p
    const pickIndex = (q) => QUALITY_ORDER.indexOf(q);
    const bestIndex = Math.min(pickIndex(maxByScreen), pickIndex(maxByNetwork), pickIndex(maxByMemory));
    let chosen = QUALITY_ORDER[Math.max(0, bestIndex)];
    if (pickIndex(chosen) < pickIndex(FLOOR)) chosen = FLOOR;

    // Apply explicit cap if provided
    if (cap && pickIndex(cap) < pickIndex(chosen)) {
        chosen = cap;
    }
    // Re-apply floor after cap just in case
    if (pickIndex(chosen) < pickIndex(FLOOR)) chosen = FLOOR;

    return chosen;
}

/**
 * React hook for adaptive video quality
 * @param {Object} options
 * @param {string} options.cap - Hard cap e.g. "720p" for cards
 * @param {string} options.initial - Initial quality before detection
 */
export default function useAdaptiveVideoQuality(options = {}) {
    const { cap, initial = "2160p" } = options;

    const [quality, setQuality] = useState(initial);
    const [connectionInfo, setConnectionInfo] = useState(() => getConnectionInfo());
    const [screenInfo, setScreenInfo] = useState(() => ({
        width: getScreenPhysicalWidth(),
        height: getScreenPhysicalHeight(),
    }));

    const recompute = useCallback(() => {
        const q = computeOptimalQuality({
            screenWidth: getScreenPhysicalWidth(),
            screenHeight: getScreenPhysicalHeight(),
            ...getConnectionInfo(),
            memory: getDeviceMemory(),
            cap,
        });
        setQuality(q);
        setConnectionInfo(getConnectionInfo());
        setScreenInfo({ width: getScreenPhysicalWidth(), height: getScreenPhysicalHeight() });
    }, [cap]);

    useEffect(() => {
        // Compute on mount
        recompute();

        if (typeof window === "undefined") return;

        // Listen for connection changes
        const conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
        if (conn) {
            conn.addEventListener("change", recompute);
        }

        // Listen for resize (orientation change, external monitor)
        const onResize = () => {
            // Debounce slightly
            window.clearTimeout(window._aqResizeTimer);
            window._aqResizeTimer = window.setTimeout(recompute, 500);
        };
        window.addEventListener("resize", onResize);

        return () => {
            if (conn) conn.removeEventListener("change", recompute);
            window.removeEventListener("resize", onResize);
        };
    }, [recompute]);

    const mapped = useMemo(() => QUALITY_MAP[quality] || QUALITY_MAP["1080p"], [quality]);

    return {
        quality,
        vqParam: mapped.vq,
        ytQuality: mapped.yt,
        width: mapped.width,
        isHighEnd: QUALITY_ORDER.indexOf(quality) >= QUALITY_ORDER.indexOf("1440p"),
        connectionInfo,
        screenInfo,
        recompute,
        setQuality,
    };
}
