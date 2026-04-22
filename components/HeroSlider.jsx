import { useState, useEffect, useRef, useCallback } from "react";

/**
 * HeroSlider — Hybrid Cinematic (Netflix + AppleTV)
 * FIXES:
 *  1. Removed internal nav links (duplicate of global Navbar)
 *  2. Fixed onPlayTrailer call signature to match _app.js openTrailer(key, title, id, type)
 *  3. Removed duplicate inline controls block
 */

const ROTATE_INTERVAL_MS = 9000;
const SKIP_SECONDS = 60;
const MOTION_SCALE = 1.125;
const ACCENT_SATURATION = 2.0;

export default function HeroSlider({
    slides = [],
    onPlayTrailer,
    wishlist = [],
    addToWishlist,
    openAuth,
}) {
    if (!slides || slides.length === 0) return null;

    const [index, setIndex] = useState(0);
    const [muted, setMuted] = useState(true);
    const [volume, setVolume] = useState(28);
    const [showInfo, setShowInfo] = useState(true);
    const [showVideo, setShowVideo] = useState(false);
    const [zoom, setZoom] = useState(false);
    const [isHovering, setIsHovering] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [parallax, setParallax] = useState({ x: 0, y: 0 });
    const [dominantRgb, setDominantRgb] = useState([200, 30, 30]);

    const startX = useRef(null);
    const sectionRef = useRef(null);
    const ytContainerRef = useRef(null);
    const ytPlayerRef = useRef(null);
    const rotateTimer = useRef(null);
    const userInteracting = useRef(false);
    const hasLoadedYTApi = useRef(false);

    const slide = slides[index];

    const isInList = Array.isArray(wishlist) && slide
        ? wishlist.some((m) => m.id === slide.id)
        : false;

    const handleWishlist = (e) => {
        e?.stopPropagation?.();
        if (!addToWishlist) { if (openAuth) openAuth(); return; }
        if ((!Array.isArray(wishlist) || wishlist.length === 0) && openAuth) { openAuth(); return; }
        addToWishlist(slide);
    };

    const bgImage = slide?.backdrop_path || slide?.poster_path || "/fallback.jpg";
    const videoKey = slide?.trailerKey;

    const bgUrl = (path) =>
        path && path.startsWith("http") ? path : `https://image.tmdb.org/t/p/original${path}`;

    /* ── Dominant color ── */
    useEffect(() => {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.src = bgUrl(bgImage);
        img.onload = () => {
            try {
                const canvas = document.createElement("canvas");
                const ctx = canvas.getContext("2d");
                const w = (canvas.width = 80), h = (canvas.height = 80);
                ctx.drawImage(img, 0, 0, w, h);
                const data = ctx.getImageData(0, 0, w, h).data;
                let r = 0, g = 0, b = 0, count = 0;
                for (let i = 0; i < data.length; i += 4 * 6) {
                    r += data[i]; g += data[i + 1]; b += data[i + 2]; count++;
                }
                if (count > 0)
                    setDominantRgb([Math.round(r / count), Math.round(g / count), Math.round(b / count)]);
            } catch { }
        };
    }, [bgImage]);

    /* ── YT API ── */
    const ensureYouTubeAPI = useCallback(() => {
        if (typeof window === "undefined") return Promise.resolve();
        if (window.YT && window.YT.Player) return Promise.resolve();
        if (hasLoadedYTApi.current)
            return new Promise((res) => {
                const check = setInterval(() => {
                    if (window.YT && window.YT.Player) { clearInterval(check); res(); }
                }, 100);
            });
        return new Promise((resolve) => {
            hasLoadedYTApi.current = true;
            if (!document.getElementById("youtube-iframe-api")) {
                const tag = document.createElement("script");
                tag.src = "https://www.youtube.com/iframe_api";
                tag.id = "youtube-iframe-api";
                document.body.appendChild(tag);
            }
            const check = setInterval(() => {
                if (window.YT && window.YT.Player) { clearInterval(check); resolve(); }
            }, 100);
        });
    }, []);

    /* ── Create/update inline player ── */
    const createOrUpdatePlayer = useCallback(async (videoId) => {
        if (!videoId) return;
        await ensureYouTubeAPI();

        if (ytPlayerRef.current) {
            try {
                ytPlayerRef.current.loadVideoById(videoId);
                ytPlayerRef.current.setVolume(volume);
                muted ? ytPlayerRef.current.mute() : ytPlayerRef.current.unMute();
            } catch { }
            return;
        }

        const containerId = `ytp-${Date.now()}`;
        if (!ytContainerRef.current) return;
        ytContainerRef.current.innerHTML = `<div id="${containerId}"></div>`;

        ytPlayerRef.current = new window.YT.Player(containerId, {
            videoId,
            playerVars: { autoplay: 1, controls: 0, modestbranding: 1, rel: 0, loop: 1, playlist: videoId, playsinline: 1 },
            events: {
                onReady: (e) => {
                    try {
                        e.target.setVolume(volume);
                        muted ? e.target.mute() : e.target.unMute();
                    } catch { }
                },
                onStateChange: (event) => {
                    if (event.data === window.YT.PlayerState.PLAYING) {
                        setIsPlaying(true);
                        if (!muted) {
                            let v = volume;
                            const fadeIn = setInterval(() => {
                                v = Math.min(100, v + 4);
                                try { ytPlayerRef.current.setVolume(v); } catch { }
                                if (v >= volume) clearInterval(fadeIn);
                            }, 120);
                        }
                    } else {
                        setIsPlaying(false);
                    }
                },
            },
        });
    }, [ensureYouTubeAPI, muted, volume]);

    useEffect(() => {
        if (!videoKey) {
            if (ytContainerRef.current) ytContainerRef.current.innerHTML = "";
            if (ytPlayerRef.current) {
                try { ytPlayerRef.current.destroy(); } catch { }
                ytPlayerRef.current = null;
            }
            return;
        }
        if (showVideo) createOrUpdatePlayer(videoKey);
    }, [videoKey, showVideo, createOrUpdatePlayer]);

    useEffect(() => {
        if (!ytPlayerRef.current) return;
        try {
            muted ? ytPlayerRef.current.mute() : ytPlayerRef.current.unMute();
            ytPlayerRef.current.setVolume(volume);
        } catch { }
    }, [muted, volume]);

    /* ── Parallax ── */
    useEffect(() => {
        const handleMove = (e) => {
            if (!sectionRef.current) return;
            const rect = sectionRef.current.getBoundingClientRect();
            setParallax({
                x: (e.clientX - rect.left) / rect.width - 0.5,
                y: (e.clientY - rect.top) / rect.height - 0.5,
            });
        };
        window.addEventListener("mousemove", handleMove);
        return () => window.removeEventListener("mousemove", handleMove);
    }, []);

    /* ── Timings ── */
    useEffect(() => {
        setShowInfo(true); setShowVideo(false); setZoom(false);
        const t1 = setTimeout(() => setShowInfo(false), 3000);
        const t2 = setTimeout(() => setShowVideo(true), 4200);
        const t3 = setTimeout(() => setZoom(true), 900);
        return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
    }, [index]);

    /* ── Swipe ── */
    const handleTouchStart = (e) => (startX.current = e.touches[0].clientX);
    const handleTouchEnd = (e) => {
        if (!startX.current) return;
        const diff = startX.current - e.changedTouches[0].clientX;
        if (diff > 50) setIndex((i) => (i + 1) % slides.length);
        if (diff < -50) setIndex((i) => (i - 1 + slides.length) % slides.length);
    };

    /* ── Auto rotate ── */
    useEffect(() => {
        const shouldRotate = !isHovering && !userInteracting.current && !isPlaying;
        if (!shouldRotate) { if (rotateTimer.current) clearTimeout(rotateTimer.current); return; }
        rotateTimer.current = setTimeout(() => setIndex((i) => (i + 1) % slides.length), ROTATE_INTERVAL_MS);
        return () => clearTimeout(rotateTimer.current);
    }, [index, isHovering, isPlaying, slides.length]);

    /* ── Controls ── */
    const handlePlayClick = async () => {
        userInteracting.current = true;
        setShowVideo(true);
        await ensureYouTubeAPI();
        createOrUpdatePlayer(videoKey);
        setTimeout(() => { try { ytPlayerRef.current.playVideo(); } catch { } }, 300);
    };

    const handlePlayPause = () => {
        if (!ytPlayerRef.current) return;
        try {
            const s = ytPlayerRef.current.getPlayerState();
            s === window.YT.PlayerState.PLAYING
                ? ytPlayerRef.current.pauseVideo()
                : ytPlayerRef.current.playVideo();
        } catch { }
    };

    const handleSkipIntro = () => {
        if (!ytPlayerRef.current) return;
        try {
            ytPlayerRef.current.seekTo((ytPlayerRef.current.getCurrentTime() || 0) + SKIP_SECONDS, true);
        } catch { }
    };

    /* ─────────────────────────────────────────────────────────
       FIX #2: Hero "Play" button now calls openTrailer with the
       correct positional signature: (key, title, id, type)
       instead of passing an object {provider, id, title}
    ───────────────────────────────────────────────────────── */
    const handleHeroTrailer = () => {
        if (slide?.trailerKey) {
            // Correct: openTrailer(key, title, id, type)
            onPlayTrailer(
                slide.trailerKey,
                slide.title || slide.name,
                slide.id,
                slide.media_type || (slide.title ? "movie" : "tv")
            );
        } else {
            // No trailer key — play inline background video instead
            handlePlayClick();
        }
    };

    /* ── Color helpers ── */
    function saturateColor([r, g, b], factor = 1.0) {
        r /= 255; g /= 255; b /= 255;
        const max = Math.max(r, g, b), min = Math.min(r, g, b);
        const l = (max + min) / 2;
        let s = 0;
        if (max !== min)
            s = l > 0.5 ? (max - min) / (2 - max - min) : (max - min) / (max + min);
        s = Math.min(1, s * factor);
        let h = 0;
        if (max === r) h = (g - b) / (max - min);
        else if (max === g) h = 2 + (b - r) / (max - min);
        else h = 4 + (r - g) / (max - min);
        h *= 60; if (h < 0) h += 360;
        function hslToRgb(h, s, l) {
            const c = (1 - Math.abs(2 * l - 1)) * s;
            const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
            const m = l - c / 2;
            let rr, gg, bb;
            if (h < 60) [rr, gg, bb] = [c, x, 0];
            else if (h < 120) [rr, gg, bb] = [x, c, 0];
            else if (h < 180) [rr, gg, bb] = [0, c, x];
            else if (h < 240) [rr, gg, bb] = [0, x, c];
            else if (h < 300) [rr, gg, bb] = [x, 0, c];
            else[rr, gg, bb] = [c, 0, x];
            return [Math.round((rr + m) * 255), Math.round((gg + m) * 255), Math.round((bb + m) * 255)];
        }
        return hslToRgb(h, s, l);
    }

    const saturated = saturateColor(dominantRgb, ACCENT_SATURATION);
    const accent = `rgba(${saturated[0]}, ${saturated[1]}, ${saturated[2]}, 0.86)`;
    const accentLight = `rgba(${saturated[0]}, ${saturated[1]}, ${saturated[2]}, 0.22)`;
    const accentText = (saturated[0] * 0.299 + saturated[1] * 0.587 + saturated[2] * 0.114) > 186 ? "#000" : "#fff";

    const enhanceOverview = (text) => {
        if (!text) return "";
        if (text.length < 200) return text;
        const snippet = text.slice(0, 220);
        const last = Math.max(snippet.lastIndexOf(". "), snippet.lastIndexOf("! "), snippet.lastIndexOf("? "));
        if (last > 60) return snippet.slice(0, last + 1);
        return snippet.slice(0, 180).replace(/\s+\S*$/, "") + "…";
    };

    return (
        <section
            ref={sectionRef}
            className="relative top-0 w-full h-[100vh] overflow-hidden bg-black select-none"
            onTouchStart={(e) => { userInteracting.current = true; handleTouchStart(e); }}
            onTouchEnd={(e) => { handleTouchEnd(e); userInteracting.current = false; }}
            onMouseEnter={() => { setIsHovering(true); userInteracting.current = true; }}
            onMouseLeave={() => { setIsHovering(false); userInteracting.current = false; }}
            aria-roledescription="carousel"
        >
            {/* film grain */}
            <div aria-hidden className="pointer-events-none absolute inset-0 z-50"
                style={{
                    backgroundImage: "url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22160%22 height=%22100%22><filter id=%22n%22><feTurbulence baseFrequency=%220.9%22 numOctaves=%221%22 stitchTiles=%22stitch%22/></filter><rect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23n)%22 opacity=%220.03%22/></svg>')",
                    mixBlendMode: "overlay",
                }}
            />

            {/* dust particles */}
            <div className="pointer-events-none z-40 absolute inset-0">
                <div className="absolute w-px h-px bg-white/8 rounded-full animate-dust" style={{ left: "18%", top: "22%", animationDelay: "0s" }} />
                <div className="absolute w-px h-px bg-white/9 rounded-full animate-dust" style={{ left: "40%", top: "55%", animationDelay: "0.6s" }} />
                <div className="absolute w-px h-px bg-white/7 rounded-full animate-dust" style={{ left: "78%", top: "35%", animationDelay: "1.1s" }} />
            </div>

            {/* cinematic bars */}
            <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-black/85 to-transparent z-30" />
            <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/85 to-transparent z-30" />

            {/* background image */}
            <img
                src={bgUrl(bgImage)}
                alt={slide?.title || slide?.name || "hero background"}
                className={`absolute inset-0 w-full h-full object-cover transition-transform duration-[2200ms] will-change-transform ${zoom ? `scale-[${MOTION_SCALE}]` : "scale-[1.03]"}`}
                style={{
                    transform: `perspective(1200px) translateX(${parallax.x * -16}px) translateY(${parallax.y * -10}px) rotateY(${parallax.x * 3}deg) rotateX(${parallax.y * -2.8}deg)`,
                    transitionTimingFunction: "cubic-bezier(.2,.9,.2,1)",
                }}
            />

            {/* YT inline player */}
            <div
                ref={ytContainerRef}
                className="absolute inset-0 w-full h-full pointer-events-none transition-opacity duration-[800ms] [&_iframe]:w-full [&_iframe]:h-full [&_iframe]:absolute [&_iframe]:top-0 [&_iframe]:left-0"
                style={{
                    opacity: showVideo ? 1 : 0,
                    transform: `translateX(${parallax.x * -5}px) translateY(${parallax.y * -3}px)`,
                    willChange: "transform, opacity",
                }}
                aria-hidden={!showVideo}
            />

            {/* ─────────────────────────────────────────────────────────
                FIX #1: REMOVED the duplicate nav block that was here.
                Navigation is handled globally by Navbar in _app.js.
            ───────────────────────────────────────────────────────── */}

            {/* glass info card */}
            <div className="absolute inset-0 z-40 flex items-end md:items-center px-6 md:px-12 pb-10 md:pb-16 pointer-events-none">
                <div
                    className={`max-w-4xl w-full transition-all duration-700 ${showInfo ? "opacity-100" : "opacity-0 pointer-events-none"}`}
                    style={{
                        transform: `translateX(${parallax.x * 8}px) translateY(${parallax.y * 6}px) rotateY(${parallax.x * -2}deg) rotateX(${parallax.y * 2}deg)`,
                        pointerEvents: "auto",
                    }}
                >
                    <div style={{ position: "relative" }}>
                        <h1 className="text-4xl md:text-6xl font-extrabold text-white leading-tight mb-3 drop-shadow-lg">
                            <span style={{ position: "relative", zIndex: 3 }}>{slide?.title || slide?.name}</span>
                        </h1>
                        <div aria-hidden style={{
                            position: "absolute", left: 0, top: "6px", width: "80%", height: "36px",
                            filter: "blur(28px)", background: `linear-gradient(90deg, ${accent}, ${accentLight})`,
                            opacity: 0.22, zIndex: 2, borderRadius: 8, pointerEvents: "none",
                        }} />
                    </div>

                    <div className="mt-4 p-4 md:p-6 rounded-2xl" style={{
                        background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)",
                        backdropFilter: "blur(8px) saturate(120%)", boxShadow: "0 8px 30px rgba(0,0,0,0.6)",
                    }}>
                        <button onClick={handleWishlist}
                            className="bg-neutral-700/40 text-white px-5 py-3 rounded-lg font-semibold border border-white/10 hover:bg-white/10 transition">
                            {isInList ? "❤️ In My List" : "🤍 Add to My List"}
                        </button>

                        {(slide?.genres || []).slice(0, 6).map((g, i) => (
                            <span key={i} className="text-xs px-3 py-1 rounded-full bg-white/6 border border-white/8 text-white">
                                {typeof g === "string" ? g : g.name}
                            </span>
                        ))}

                        {(slide?.providers || []).slice(0, 3).map((p, i) => (
                            <button key={i} onClick={() => p?.url && window.open(p.url, "_blank")}
                                className="text-xs px-2 py-1 rounded bg-white/6 border border-white/8 text-white flex items-center gap-2">
                                {p?.logo ? <img src={p.logo} alt={p.name} className="w-6 h-3 object-contain" /> : p.name}
                            </button>
                        ))}
                    </div>

                    <p className="text-gray-200 md:text-lg mb-4" style={{ maxWidth: "65ch" }}>
                        {enhanceOverview(slide?.overview)}
                    </p>

                    {/* FIX #2 applied here — uses handleHeroTrailer */}
                    <button
                        onClick={handleHeroTrailer}
                        className="px-6 py-3 rounded-lg font-bold text-lg flex items-center gap-3"
                        style={{ background: `linear-gradient(90deg, ${accent}, rgba(255,255,255,0.06))`, color: accentText }}
                    >
                        ▶ Play
                    </button>

                    <button onClick={() => setShowInfo((s) => !s)}
                        className="bg-neutral-700/40 text-white px-5 py-3 rounded-lg font-semibold border border-white/6">
                        ⓘ More Info
                    </button>

                    <button onClick={handleSkipIntro}
                        className="bg-black/60 text-white px-4 py-2 rounded-md text-sm border border-white/10">
                        ⏭ Skip Intro
                    </button>

                    <div className="ml-auto flex items-center gap-3">
                        <button onClick={() => setMuted((m) => !m)}
                            className="bg-black/50 border border-white/6 text-white px-3 py-2 rounded-md">
                            {muted ? "🔇" : "🔊"}
                        </button>
                        <input aria-label="Volume"
                            onChange={(e) => {
                                const v = Number(e.target.value);
                                setVolume(v); setMuted(v === 0);
                                try { if (ytPlayerRef.current) ytPlayerRef.current.setVolume(v); } catch { }
                            }}
                            value={volume} type="range" min="0" max="100" className="h-1 w-36"
                        />
                    </div>
                </div>
            </div>

            {/* inline playback controls — only shown when bg video is active */}
            {videoKey && showVideo && (
                <div className="absolute bottom-6 left-6 z-50 flex items-center gap-3">
                    <button onClick={handlePlayPause}
                        className="bg-black/60 border border-white/10 text-white px-4 py-2 rounded-xl">⏯</button>
                    <button onClick={() => setIndex((i) => (i + 1) % slides.length)}
                        className="bg-black/60 border border-white/10 text-white px-4 py-2 rounded-xl">➜</button>
                </div>
            )}

            {/* slide dots */}
            <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-[90] flex items-center gap-3">
                {slides.map((s, i) => {
                    const active = i === index;
                    return (
                        <button key={i} onClick={() => setIndex(i)}
                            aria-label={`Go to slide ${i + 1}: ${s?.title || s?.name || ""}`}
                            className={`relative rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white/30 ${active
                                ? "w-3 h-3 bg-white scale-125 shadow-[0_0_12px_rgba(255,255,255,0.85)]"
                                : "w-6 h-6 bg-gray-500/60 md:w-3 md:h-3"}`}
                        >
                            {active && (
                                <span className="absolute inset-0 w-full h-full rounded-full bg-white/30 animate-ping" aria-hidden />
                            )}
                        </button>
                    );
                })}
            </div>

            <style jsx>{`
                @keyframes dust {
                    0% { transform: translateY(0) translateX(0) scale(1); opacity: 0; }
                    10% { opacity: 0.7; }
                    100% { transform: translateY(-60px) translateX(30px) scale(1.2); opacity: 0; }
                }
                .animate-dust {
                    width: 2px; height: 2px; border-radius: 999px;
                    animation: dust 6s linear infinite;
                }
                :global(.animate-ping) { animation-duration: 1.2s; }
            `}</style>
        </section>
    );
}