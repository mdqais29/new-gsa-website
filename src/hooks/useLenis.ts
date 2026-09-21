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
    // Only disable Lenis on small mobile touchscreens (phones),
    // NEVER on PC / laptops that happen to report touch points (e.g. Windows laptops with touchscreens)!
    const isMobilePhone =
      window.innerWidth < 768 && ('ontouchstart' in window || navigator.maxTouchPoints > 0);

    if (isMobilePhone) {
      return;
    }

    const lenis = new Lenis({
      duration: 1.2,
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
    // Restore GSAP's built-in lag smoothing cushion (absorbs minor browser timing hiccups like air suspension)
    gsap.ticker.lagSmoothing(500, 33);

    return () => {
      gsap.ticker.remove(updateTicker);
      lenis.destroy();
    };
  }, []);
}
