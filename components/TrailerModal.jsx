// components/TrailerModal.jsx
import { useEffect, useRef, useState } from "react";

/**
 * TrailerModal
 * Props:
 *  - open: boolean
 *  - onClose: () => void
 *  - provider: "youtube" | "file"
 *  - videoIdOrUrl: string (YouTube video id when provider="youtube", or src URL when provider="file")
 *  - title: string
 *
 * Notes:
 *  - For YouTube provider, it lazy loads the iframe API.
 *  - Saves position in localStorage under key `trailer_pos:{provider}:{idOrUrl}`
 */

export default function TrailerModal({
    open = false,
    onClose = () => { },
    provider = "youtube",
    videoIdOrUrl = null,
    title = "",
    mediaId = null,
    mediaType = "movie",
}) {
    const [progress, setProgress] = useState(0); // percent 0-100
    const [duration, setDuration] = useState(0); // seconds
    const [currentTime, setCurrentTime] = useState(0); // seconds
    const [isPlaying, setIsPlaying] = useState(false);
    const [muted, setMuted] = useState(true);
    const [repeat, setRepeat] = useState(false);

    const ytPlayerRef = useRef(null);
    const ytContainerRef = useRef(null);
    const fileVideoRef = useRef(null);
    const pollRef = useRef(null);
    const savedKey = `${provider}:${videoIdOrUrl}`;

    // lazy load YT API
    useEffect(() => {
        if (provider !== "youtube") return;
        if (typeof window === "undefined") return;

        if (!window.YT) {
            const id = "youtube-iframe-api";
            if (!document.getElementById(id)) {
                const tag = document.createElement("script");
                tag.id = id;
                tag.src = "https://www.youtube.com/iframe_api";
                document.body.appendChild(tag);
            }
        }
    }, [provider]);

    // mount player when modal opens
    useEffect(() => {
        if (!open) {
            cleanupPlayer();
            return;
        }

        // restore saved time
        const stored = safeGetSavedPos();
        if (stored) {
            setCurrentTime(stored);
        }

        if (provider === "youtube") {
            createOrUpdateYtPlayer(videoIdOrUrl);
        } else {
            // file video
            setTimeout(() => {
                if (!fileVideoRef.current) return;
                // try to set currentTime if saved
                try {
                    const stored = safeGetSavedPos();
                    if (stored && fileVideoRef.current.duration) {
                        fileVideoRef.current.currentTime = Math.min(stored, fileVideoRef.current.duration);
                    }
                } catch { }
                attachFilePoll();
            }, 80);
        }

        return () => {
            // do not destroy here — handled in cleanupPlayer when modal closes/changes
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open, videoIdOrUrl, provider]);

    // cleanup player when closed or provider changes
    function cleanupPlayer() {
        // clear poll
        if (pollRef.current) {
            clearInterval(pollRef.current);
            pollRef.current = null;
        }
        // destroy YT player
        try {
            if (ytPlayerRef.current && ytPlayerRef.current.destroy) {
                ytPlayerRef.current.destroy();
            }
        } catch { }
        ytPlayerRef.current = null;
        // pause file video and reset
        try {
            if (fileVideoRef.current) {
                fileVideoRef.current.pause();
            }
        } catch { }
        setIsPlaying(false);
        setProgress(0);
        setCurrentTime(0);
        setDuration(0);
    }

    // ------------------ YT player logic ------------------
    async function createOrUpdateYtPlayer(videoId) {
        // wait until YT API available
        const wait = () =>
            new Promise((res) => {
                const check = setInterval(() => {
                    if (window.YT && window.YT.Player) {
                        clearInterval(check);
                        res();
                    }
                }, 80);
            });

        if (typeof window === "undefined") return;
        await wait();

        // if already exists, load new id
        if (ytPlayerRef.current && ytPlayerRef.current.loadVideoById) {
            try {
                ytPlayerRef.current.loadVideoById(videoId);
            } catch { }
            attachYtPoll();
            // sync history
            addToHistory();
            return;
        }

        // create container id
        if (!ytContainerRef.current) return;
        ytContainerRef.current.innerHTML = `<div id="yt-player-${Date.now()}"></div>`;
        const containerId = ytContainerRef.current.firstChild.id;

        ytPlayerRef.current = new window.YT.Player(containerId, {
            videoId,
            playerVars: {
                autoplay: 1,
                controls: 0,
                playsinline: 1,
                rel: 0,
                modestbranding: 1,
            },
            events: {
                onReady: (e) => {
                    try {
                        e.target.setPlaybackQuality("hd720");
                        if (muted) e.target.mute();
                        else e.target.unMute();
                    } catch { }
                    attachYtPoll();
                    // restore pos
                    const saved = safeGetSavedPos();
                    if (saved) {
                        try {
                            e.target.seekTo(saved, true);
                        } catch { }
                    }
                    try {
                        e.target.playVideo();
                        setIsPlaying(true);
                        addToHistory(); // Sync history
                    } catch { }
                },
                onStateChange: (ev) => {
                    const YT = window.YT;
                    if (!YT) return;
                    if (ev.data === YT.PlayerState.PLAYING) {
                        setIsPlaying(true);
                        setDuration(ytPlayerRef.current.getDuration?.() || 0);
                    } else if (ev.data === YT.PlayerState.PAUSED) {
                        setIsPlaying(false);
                    } else if (ev.data === YT.PlayerState.ENDED) {
                        setIsPlaying(false);
                        if (repeat) {
                            try {
                                ytPlayerRef.current.seekTo(0);
                                ytPlayerRef.current.playVideo();
                            } catch { }
                        } else {
                            setProgress(100);
                            setCurrentTime(duration || (ytPlayerRef.current.getDuration?.() || 0));
                        }
                    }
                },
            },
        });
    }

    async function addToHistory() {
        if (!videoIdOrUrl || !mediaId) return;
        try {
            await fetch("/api/user/history", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    mediaId,
                    mediaType,
                })
            });
        } catch { }
    }

    function attachYtPoll() {
        if (pollRef.current) {
            clearInterval(pollRef.current);
            pollRef.current = null;
        }
        pollRef.current = setInterval(() => {
            try {
                if (!ytPlayerRef.current || !ytPlayerRef.current.getCurrentTime) return;
                const cur = ytPlayerRef.current.getCurrentTime();
                const dur = ytPlayerRef.current.getDuration();
                setCurrentTime(cur || 0);
                setDuration(dur || 0);
                setProgress(dur ? Math.min(100, (cur / dur) * 100) : 0);
                safeSavePos(cur || 0);
            } catch { }
        }, 250);
    }

    // ------------------ file/video element logic ------------------
    function attachFilePoll() {
        if (pollRef.current) {
            clearInterval(pollRef.current);
            pollRef.current = null;
        }
        pollRef.current = setInterval(() => {
            try {
                const v = fileVideoRef.current;
                if (!v) return;
                const cur = v.currentTime || 0;
                const dur = v.duration || 0;
                setCurrentTime(cur);
                setDuration(dur);
                setProgress(dur ? Math.min(100, (cur / dur) * 100) : 0);
                safeSavePos(cur);
            } catch { }
        }, 250);
    }

    // ------------------ helpers ------------------
    function safeSavePos(sec) {
        try {
            localStorage.setItem(`trailer_pos:${savedKey}`, String(Math.floor(sec)));
        } catch { }
    }

    function safeGetSavedPos() {
        try {
            const s = localStorage.getItem(`trailer_pos:${savedKey}`);
            return s ? Number(s) : 0;
        } catch { return 0; }
    }

    // -------------- controls --------------
    function togglePlayPause() {
        try {
            if (provider === "youtube") {
                if (!ytPlayerRef.current) return;
                const state = ytPlayerRef.current.getPlayerState();
                const YT = window.YT;
                if (state === YT.PlayerState.PLAYING) {
                    ytPlayerRef.current.pauseVideo();
                } else {
                    ytPlayerRef.current.playVideo();
                }
            } else {
                const v = fileVideoRef.current;
                if (!v) return;
                if (v.paused) v.play();
                else v.pause();
            }
        } catch { }
    }

    function skip(seconds) {
        try {
            if (provider === "youtube") {
                if (!ytPlayerRef.current) return;
                const cur = ytPlayerRef.current.getCurrentTime() || 0;
                const dur = ytPlayerRef.current.getDuration() || 0;
                let next = Math.min(Math.max(0, cur + seconds), dur);
                ytPlayerRef.current.seekTo(next, true);
            } else {
                const v = fileVideoRef.current;
                if (!v) return;
                v.currentTime = Math.min(Math.max(0, v.currentTime + seconds), v.duration || Infinity);
            }
        } catch { }
    }

    function toggleMute() {
        try {
            if (provider === "youtube") {
                if (!ytPlayerRef.current) return;
                const YT = window.YT;
                if (ytPlayerRef.current.isMuted && ytPlayerRef.current.isMuted()) {
                    ytPlayerRef.current.unMute();
                    setMuted(false);
                } else {
                    ytPlayerRef.current.mute();
                    setMuted(true);
                }
            } else {
                const v = fileVideoRef.current;
                if (!v) return;
                v.muted = !v.muted;
                setMuted(v.muted);
            }
        } catch { }
    }

    function handleRepeatToggle() {
        setRepeat((r) => !r);
    }

    function handleSeekPercent(pct) {
        try {
            if (!duration || duration <= 0) return;
            const t = (pct / 100) * duration;
            if (provider === "youtube") {
                ytPlayerRef.current?.seekTo(t, true);
            } else {
                fileVideoRef.current.currentTime = t;
            }
            setCurrentTime(t);
        } catch { }
    }

    // clicking on progress bar
    function onProgressClick(e) {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const pct = (x / rect.width) * 100;
        handleSeekPercent(pct);
    }

    // close modal (pause + save + cleanup)
    function handleClose() {
        // pause and save
        if (provider === "youtube") {
            try {
                if (ytPlayerRef.current && ytPlayerRef.current.pauseVideo) ytPlayerRef.current.pauseVideo();
            } catch { }
        } else {
            try {
                if (fileVideoRef.current) fileVideoRef.current.pause();
            } catch { }
        }
        safeSavePos(currentTime || 0);
        cleanupPlayer();
        onClose();
    }

    // keyboard handlers for spacebar/esc
    useEffect(() => {
        if (!open) return;
        const onKey = (e) => {
            if (e.key === "Escape") handleClose();
            if (e.code === "Space") {
                e.preventDefault();
                togglePlayPause();
            }
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open, currentTime, provider]);

    // show progress when file metadata loads
    function onFileLoadedMeta() {
        try {
            const v = fileVideoRef.current;
            setDuration(v.duration || 0);
            const stored = safeGetSavedPos();
            if (stored && v.duration) {
                v.currentTime = Math.min(stored, v.duration);
            }
            attachFilePoll();
            v.play().catch(() => { });
        } catch { }
    }

    // render nothing if closed
    if (!open) return null;

    return (
        <div
            className="fixed inset-0 z-[9999] flex items-start md:items-center justify-center p-6"
            role="dialog"
            aria-modal="true"
        >
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                onClick={handleClose}
            />

            {/* Modal content */}
            <div className="relative w-full max-w-[1200px] h-[60vh] md:h-[75vh] rounded-2xl overflow-hidden shadow-2xl">
                {/* PROGRESS BAR (thin yellow on top) */}
                <div
                    className="absolute top-0 left-0 right-0 h-[6px] bg-black/30 z-40"
                    onClick={onProgressClick}
                    role="progressbar"
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-valuenow={Math.round(progress)}
                >
                    <div
                        className="h-full bg-yellow-400 transition-all"
                        style={{ width: `${progress}%` }}
                    />
                </div>

                {/* Title overlay */}
                <div className="absolute left-6 top-6 z-40 text-white">
                    <div className="text-sm uppercase text-white/60 mb-1">Trailer</div>
                    <div className="text-2xl md:text-3xl font-extrabold">{title}</div>
                </div>

                {/* video container */}
                <div className="absolute inset-0 z-10 grid place-items-center bg-black">
                    {provider === "youtube" ? (
                        <div ref={ytContainerRef} className="w-full h-full" />
                    ) : (
                        <video
                            ref={fileVideoRef}
                            className="w-full h-full object-cover"
                            src={videoIdOrUrl}
                            onLoadedMetadata={onFileLoadedMeta}
                            controls={false}
                        />
                    )}
                </div>

                {/* Controls bottom-left */}
                <div className="absolute left-6 bottom-6 z-50 flex items-center gap-3">
                    <button
                        aria-label="Play/Pause"
                        onClick={togglePlayPause}
                        className="bg-black/60 border border-white/10 text-white px-3 py-2 rounded-lg"
                    >
                        {isPlaying ? "⏸" : "▶"}
                    </button>

                    <button
                        aria-label="Back 10s"
                        onClick={() => skip(-10)}
                        className="bg-black/60 border border-white/10 text-white px-3 py-2 rounded-lg"
                    >
                        ⏪
                    </button>

                    <button
                        aria-label="Forward 10s"
                        onClick={() => skip(10)}
                        className="bg-black/60 border border-white/10 text-white px-3 py-2 rounded-lg"
                    >
                        ⏩
                    </button>

                    <button
                        aria-label="Toggle repeat"
                        onClick={handleRepeatToggle}
                        className={`bg-black/60 border border-white/10 text-white px-3 py-2 rounded-lg ${repeat ? "ring-2 ring-yellow-400" : ""}`}
                    >
                        {repeat ? "🔁" : "↺"}
                    </button>

                    <button
                        aria-label="Mute"
                        onClick={toggleMute}
                        className="bg-black/60 border border-white/10 text-white px-3 py-2 rounded-lg"
                    >
                        {muted ? "🔇" : "🔊"}
                    </button>

                    {/* time display */}
                    <div className="text-white/80 text-sm ml-2">
                        {formatTime(currentTime)} / {formatTime(duration)}
                    </div>
                </div>

                {/* Close / extra controls top-right */}
                <div className="absolute right-4 top-4 z-50 flex items-center gap-2">
                    <button
                        onClick={() => {
                            // reset saved position for this trailer
                            try {
                                localStorage.removeItem(`trailer_pos:${savedKey}`);
                                setCurrentTime(0);
                                setProgress(0);
                            } catch { }
                        }}
                        className="bg-black/50 text-white px-3 py-2 rounded-md border border-white/10"
                        title="Reset saved position"
                    >
                        Reset
                    </button>

                    <button
                        onClick={handleClose}
                        aria-label="Close"
                        className="bg-black/60 text-white px-3 py-2 rounded-md border border-white/10"
                    >
                        ✕
                    </button>
                </div>
            </div>
        </div>
    );
}

// small helper
function formatTime(sec = 0) {
    if (!sec || !isFinite(sec)) return "0:00";
    const s = Math.floor(sec % 60);
    const m = Math.floor(sec / 60);
    return `${m}:${String(s).padStart(2, "0")}`;
}
