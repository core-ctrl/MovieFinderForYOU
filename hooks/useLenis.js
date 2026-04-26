import { useEffect, useRef } from "react";

export default function useLenis() {
  const lenisRef = useRef(null);

  useEffect(() => {
    let rafId = null;
    let disposed = false;

    async function init() {
      const { default: Lenis } = await import("@studio-freight/lenis");
      if (disposed) return;

      const lenis = new Lenis({
        duration: 1.4,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothTouch: false,
        touchMultiplier: 2,
      });

      lenisRef.current = lenis;

      const raf = (time) => {
        lenis.raf(time);
        rafId = requestAnimationFrame(raf);
      };

      rafId = requestAnimationFrame(raf);
    }

    init().catch(() => {});

    return () => {
      disposed = true;
      if (rafId) cancelAnimationFrame(rafId);
      if (lenisRef.current) {
        lenisRef.current.destroy();
        lenisRef.current = null;
      }
    };
  }, []);

  return lenisRef;
}
