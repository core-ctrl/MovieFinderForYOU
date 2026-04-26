/**
 * Video quality utilities for adaptive YouTube playback
 */

export const YT_QUALITY_MAP = {
    "1080p": { vq: "hd1080", yt: "hd1080", width: 1920, label: "Full HD" },
    "1440p": { vq: "hd1440", yt: "hd1440", width: 2560, label: "2K" },
    "2160p": { vq: "hd2160", yt: "hd2160", width: 3840, label: "4K" },
    "4320p": { vq: "hd4320", yt: "highres", width: 7680, label: "8K" },
};

export const QUALITY_ORDER = Object.keys(YT_QUALITY_MAP);

/**
 * Get quality details by key
 */
export function getQualityDetails(key) {
    return YT_QUALITY_MAP[key] || YT_QUALITY_MAP["1080p"];
}

/**
 * Get all quality options as array
 */
export function getQualityOptions() {
    return QUALITY_ORDER.map((key) => ({ key, ...YT_QUALITY_MAP[key] }));
}

/**
 * Get a user-friendly label for a quality key
 */
export function getQualityLabel(key) {
    return YT_QUALITY_MAP[key]?.label || key;
}
