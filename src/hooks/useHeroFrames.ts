import { useEffect, useRef, useCallback } from 'react';

// Use every 4th frame: reduces 600 → 150 frames (~22MB vs ~90MB)
// This is the single biggest performance win — 4x less network load
const FRAME_STEP = 4;
const TOTAL_SOURCE_FRAMES = 600;
const TOTAL_FRAMES = Math.floor(TOTAL_SOURCE_FRAMES / FRAME_STEP); // 150

function getFramePath(logicalIndex: number): string {
  // Map logical index (1-150) to actual file index (1, 5, 9, ... 597, 600)
  const actualIndex = Math.min(TOTAL_SOURCE_FRAMES, ((logicalIndex - 1) * FRAME_STEP) + 1);
  const padded = String(actualIndex).padStart(3, '0');
  return `/frames/hero/frame_${padded}.webp`;
}

export function useHeroFrames() {
  const imagesRef = useRef<(HTMLImageElement | null)[]>(new Array(TOTAL_FRAMES + 1).fill(null));
  const isInitialReadyRef = useRef(false);
  const initialReadyCallbacksRef = useRef<(() => void)[]>([]);
  const lastFoundIndexRef = useRef<number>(1);
  const targetFrameRef = useRef<number>(1);
  // Allows HeroCanvas to register a redraw function
  const redrawCallbackRef = useRef<((frameIdx: number) => void) | null>(null);

  const setTargetFrame = useCallback((frame: number) => {
    targetFrameRef.current = frame;
  }, []);

  const onRedraw = useCallback((cb: (frameIdx: number) => void) => {
    redrawCallbackRef.current = cb;
  }, []);

  useEffect(() => {
    let isMounted = true;
    const images = imagesRef.current;
    const requested = new Set<number>();

    const markLoaded = (idx: number, img: HTMLImageElement) => {
      if (!isMounted) return;
      images[idx] = img;

      // Signal initial ready
      if (idx === 1 && !isInitialReadyRef.current) {
        isInitialReadyRef.current = true;
        initialReadyCallbacksRef.current.forEach(cb => cb());
        initialReadyCallbacksRef.current = [];
      }

      // Trigger redraw if loaded frame is near current target
      if (redrawCallbackRef.current) {
        const target = targetFrameRef.current;
        if (Math.abs(target - idx) <= 10) {
          redrawCallbackRef.current(idx);
        }
      }
    };

    // Phase 1: Load frame 1 urgently (and last frame)
    const loadUrgent = (idx: number) => {
      if (requested.has(idx)) return;
      requested.add(idx);
      const img = new Image();
      img.src = getFramePath(idx);
      img.onload = () => markLoaded(idx, img);
      img.onerror = () => {}; // silently fail
    };

    loadUrgent(1);
    loadUrgent(TOTAL_FRAMES); // Last frame needed for final lockup

    // Phase 2: Smart background loader using requestIdleCallback or setTimeout fallback
    let activeConnections = 0;
    const MAX_CONCURRENCY = 3;
    let stopped = false;

    const scheduleNext = (fn: () => void) => {
      if (stopped) return;
      if (typeof requestIdleCallback !== 'undefined') {
        requestIdleCallback(fn, { timeout: 200 });
      } else {
        setTimeout(fn, 80);
      }
    };

    const loadFrame = (idx: number) => {
      if (stopped || requested.has(idx) || idx < 1 || idx > TOTAL_FRAMES) return false;
      requested.add(idx);
      activeConnections++;

      const img = new Image();
      img.src = getFramePath(idx);
      img.onload = () => {
        markLoaded(idx, img);
        activeConnections--;
        scheduleNext(pumpLoader);
      };
      img.onerror = () => {
        activeConnections--;
        scheduleNext(pumpLoader);
      };
      return true;
    };

    const pumpLoader = () => {
      if (stopped || activeConnections >= MAX_CONCURRENCY) return;

      const target = targetFrameRef.current;

      // Try to fill up to MAX_CONCURRENCY
      while (activeConnections < MAX_CONCURRENCY) {
        let loaded = false;

        // Priority 1: Exact target frame
        if (!images[target] && !requested.has(target)) {
          loaded = loadFrame(target);
          if (loaded) continue;
        }

        // Priority 2: Frames ahead (scroll direction)
        let found = false;
        for (let i = 1; i <= 20; i++) {
          const ahead = target + i;
          if (ahead <= TOTAL_FRAMES && !images[ahead] && !requested.has(ahead)) {
            loadFrame(ahead);
            found = true;
            break;
          }
        }
        if (found) continue;

        // Priority 3: Frames behind
        for (let i = 1; i <= 10; i++) {
          const behind = target - i;
          if (behind >= 1 && !images[behind] && !requested.has(behind)) {
            loadFrame(behind);
            found = true;
            break;
          }
        }
        if (found) continue;

        // Priority 4: Every 10th frame skeleton
        for (let i = 10; i <= TOTAL_FRAMES; i += 10) {
          if (!images[i] && !requested.has(i)) {
            loadFrame(i);
            found = true;
            break;
          }
        }
        if (found) continue;

        // Priority 5: Fill remaining gaps
        for (let i = 1; i <= TOTAL_FRAMES; i++) {
          const checkIdx = ((target + i - 1) % TOTAL_FRAMES) + 1;
          if (!images[checkIdx] && !requested.has(checkIdx)) {
            loadFrame(checkIdx);
            found = true;
            break;
          }
        }
        if (!found) break; // Everything loaded or requested
      }
    };

    // Delay the background loader to let page resources (CSS, JS, fonts) load first
    const startTimer = setTimeout(() => {
      if (!stopped) pumpLoader();
    }, 800);

    return () => {
      isMounted = false;
      stopped = true;
      clearTimeout(startTimer);
    };
  }, []);

  // Get nearest loaded frame — zero-allocation fast path
  const getNearestFrame = useCallback((targetIndex: number): HTMLImageElement | null => {
    const clamped = Math.max(1, Math.min(TOTAL_FRAMES, Math.round(targetIndex)));
    const images = imagesRef.current;

    // Direct hit
    const exact = images[clamped];
    if (exact && exact.complete && exact.naturalWidth > 0) {
      lastFoundIndexRef.current = clamped;
      return exact;
    }

    // Search outward (prefer behind so we don't skip ahead of scroll)
    for (let offset = 1; offset <= 50; offset++) {
      const before = clamped - offset;
      if (before >= 1) {
        const img = images[before];
        if (img && img.complete && img.naturalWidth > 0) {
          lastFoundIndexRef.current = before;
          return img;
        }
      }
      const after = clamped + offset;
      if (after <= TOTAL_FRAMES) {
        const img = images[after];
        if (img && img.complete && img.naturalWidth > 0) {
          lastFoundIndexRef.current = after;
          return img;
        }
      }
    }

    // Last resort
    const lastFound = images[lastFoundIndexRef.current];
    if (lastFound && lastFound.complete && lastFound.naturalWidth > 0) return lastFound;
    return images[1] || null;
  }, []);

  // Synchronous check + async notification pattern for isInitialReady
  const waitForInitial = useCallback((cb: () => void) => {
    if (isInitialReadyRef.current) {
      cb();
    } else {
      initialReadyCallbacksRef.current.push(cb);
    }
  }, []);

  return {
    totalFrames: TOTAL_FRAMES,
    isInitialReadyRef,
    waitForInitial,
    getNearestFrame,
    setTargetFrame,
    onRedraw,
  };
}
