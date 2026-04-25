// components/LazyImage.jsx
// Lazy-loaded image with blur-up placeholder and error fallback
import { useState, useRef, useEffect } from "react";

export default function LazyImage({ src, alt, className = "", fallback = "/fallback.jpg", sizes }) {
    const [loaded, setLoaded] = useState(false);
    const [error, setError] = useState(false);
    const [visible, setVisible] = useState(false);
    const ref = useRef(null);

    // Intersection Observer — only load when in viewport
    useEffect(() => {
        if (!ref.current) return;
        const observer = new IntersectionObserver(
            ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect(); } },
            { rootMargin: "200px" } // Pre-load 200px before entering view
        );
        observer.observe(ref.current);
        return () => observer.disconnect();
    }, []);

    return (
        <div ref={ref} className="relative overflow-hidden w-full h-full bg-surface-3">
            {/* Shimmer placeholder */}
            {!loaded && !error && (
                <div className="absolute inset-0 skeleton" />
            )}

            {/* Actual image — only loads when visible */}
            {visible && (
                <img
                    src={error ? fallback : src}
                    alt={alt}
                    sizes={sizes}
                    loading="lazy"
                    decoding="async"
                    onLoad={() => setLoaded(true)}
                    onError={() => { setError(true); setLoaded(true); }}
                    className={`${className} transition-opacity duration-500 ${loaded ? "opacity-100" : "opacity-0"}`}
                />
            )}
        </div>
    );
}
EOF

cat > /home/claude / movie - finder - v2 / components / SkeletonCard.jsx << 'EOF'
// components/SkeletonCard.jsx
import { motion } from "framer-motion";

export function SkeletonCard() {
    return (
        <div className="flex-none w-36 md:w-44">
            <div className="aspect-[2/3] skeleton rounded-card mb-2" />
            <div className="h-3 skeleton rounded w-3/4 mb-1.5" />
            <div className="h-3 skeleton rounded w-1/2" />
        </div>
    );
}

export function SkeletonRow({ count = 7 }) {
    return (
        <section className="mb-14">
            <div className="flex items-center justify-between mb-5">
                <div className="h-6 skeleton rounded-lg w-48" />
            </div>
            <div className="flex gap-4 overflow-hidden py-2">
                {Array.from({ length: count }).map((_, i) => (
                    <SkeletonCard key={i} />
                ))}
            </div>
        </section>
    );
}

export function SkeletonHero() {
    return (
        <div className="w-full h-[100vh] bg-surface-1 flex items-end px-12 pb-24 relative overflow-hidden">
            <div className="absolute inset-0 skeleton opacity-50" />
            <div className="max-w-2xl w-full relative z-10">
                <div className="h-3 skeleton rounded w-24 mb-4" />
                <div className="h-14 skeleton rounded-xl w-3/4 mb-3" />
                <div className="h-14 skeleton rounded-xl w-1/2 mb-6" />
                <div className="h-4 skeleton rounded w-full mb-2" />
                <div className="h-4 skeleton rounded w-2/3 mb-8" />
                <div className="flex gap-4">
                    <div className="h-12 w-36 skeleton rounded-xl" />
                    <div className="h-12 w-36 skeleton rounded-xl" />
                </div>
            </div>
        </div>
    );
}

export function SkeletonDetailPage() {
    return (
        <div className="min-h-screen bg-black pt-20">
            <div className="w-full h-[55vh] skeleton opacity-30" />
            <div className="max-w-6xl mx-auto px-6 -mt-40 relative z-10">
                <div className="flex gap-8">
                    <div className="w-48 h-72 skeleton rounded-2xl flex-shrink-0" />
                    <div className="flex-1 pt-16">
                        <div className="h-10 skeleton rounded-xl w-2/3 mb-4" />
                        <div className="h-4 skeleton rounded w-1/3 mb-4" />
                        <div className="flex gap-2 mb-6">
                            {[1, 2, 3].map(i => <div key={i} className="h-7 w-20 skeleton rounded-full" />)}
                        </div>
                        <div className="h-4 skeleton rounded w-full mb-2" />
                        <div className="h-4 skeleton rounded w-full mb-2" />
                        <div className="h-4 skeleton rounded w-3/4 mb-8" />
                        <div className="flex gap-3">
                            <div className="h-12 w-40 skeleton rounded-xl" />
                            <div className="h-12 w-32 skeleton rounded-xl" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}