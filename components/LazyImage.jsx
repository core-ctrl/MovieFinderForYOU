import { useEffect, useRef, useState } from "react";

export default function LazyImage({ src, alt, className = "", fallback = "/fallback.jpg", sizes }) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  const [visible, setVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!ref.current) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px" }
    );

    observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className="relative h-full w-full overflow-hidden bg-surface-3">
      {!loaded && !error && <div className="absolute inset-0 skeleton" />}

      {visible && (
        <img
          src={error ? fallback : src}
          alt={alt}
          sizes={sizes}
          loading="lazy"
          decoding="async"
          onLoad={() => setLoaded(true)}
          onError={() => {
            setError(true);
            setLoaded(true);
          }}
          className={`${className} transition-opacity duration-500 ${loaded ? "opacity-100" : "opacity-0"}`}
        />
      )}
    </div>
  );
}
