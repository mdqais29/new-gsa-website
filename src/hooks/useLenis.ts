import { useEffect } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Prevent mobile address bar height changes from resetting scroll position or triggers
ScrollTrigger.config({
  ignoreMobileResize: true,
  autoRefreshEvents: 'visibilitychange,DOMContentLoaded,load',
});

export function useLenis() {
  useEffect(() => {
    // Detect mobile touch devices
    const isTouchDevice =
      'ontouchstart' in window ||
      navigator.maxTouchPoints > 0 ||
      window.innerWidth < 768;

    // On mobile touch devices, allow 100% native hardware-accelerated scrolling.
    // Running Lenis on mobile touch hijacks touch gestures, fights native inertia,
    // and causes GSAP pin-spacers to lock or snap back to 0 on slow scrolling.
    if (isTouchDevice) {
      return;
    }

    const lenis = new Lenis({
      duration: 1.0,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1.0,
    });

    // Synchronize Lenis scroll event with ScrollTrigger updates
    lenis.on('scroll', () => {
      ScrollTrigger.update();
    });

    // Bind GSAP ticker to Lenis requestAnimationFrame
    const updateTicker = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(updateTicker);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(updateTicker);
      lenis.destroy();
    };
  }, []);
}
