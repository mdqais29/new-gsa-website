import { useState, useEffect, useRef, useCallback } from 'react';

const TOTAL_FRAMES = 600;

function getFramePath(index: number): string {
  const padded = String(index).padStart(3, '0');
  return `/frames/hero/frame_${padded}.webp`;
}

interface UseHeroFramesProps {
  onFrameLoaded?: (index: number) => void;
}

export function useHeroFrames({ onFrameLoaded }: UseHeroFramesProps = {}) {
  const [isInitialReady, setIsInitialReady] = useState(false);
  const imagesRef = useRef<(HTMLImageElement | null)[]>(new Array(TOTAL_FRAMES + 1).fill(null));
  const lastFoundIndexRef = useRef<number>(1);
  const targetFrameRef = useRef<number>(1); // Allows the hook to know what frame is currently needed

  const setTargetFrame = useCallback((frame: number) => {
    targetFrameRef.current = frame;
  }, []);

  useEffect(() => {
    let isMounted = true;
    const images = imagesRef.current;
    
    // Track which images have been requested to avoid duplicate requests
    const requested = new Set<number>();

    // Phase 1: Load frame 1 urgently
    const firstImg = new Image();
    firstImg.src = getFramePath(1);
    requested.add(1);
    
    firstImg.onload = () => {
      if (!isMounted) return;
      images[1] = firstImg;
      setIsInitialReady(true);
      if (onFrameLoaded) onFrameLoaded(1);
    };

    // We will use a dynamic loading loop instead of static batches
    // This loop constantly checks the current targetFrame and loads frames around it
    let activeConnections = 0;
    const MAX_CONCURRENCY = 4; // Keep this low to prevent lagging the whole page
    
    let loopId: number;

    const loadNextPriorities = () => {
      if (!isMounted) return;

      // Fill up to max concurrency
      while (activeConnections < MAX_CONCURRENCY) {
        let nextIndexToLoad = -1;
        
        // 1. First priority: The exact target frame (if not loaded)
        const target = targetFrameRef.current;
        if (!images[target] && !requested.has(target)) {
          nextIndexToLoad = target;
        }
        
        // 2. Second priority: Frames immediately ahead of target (anticipating scroll down)
        if (nextIndexToLoad === -1) {
          for (let i = 1; i <= 30; i++) {
            const ahead = target + i;
            if (ahead <= TOTAL_FRAMES && !images[ahead] && !requested.has(ahead)) {
              nextIndexToLoad = ahead;
              break;
            }
          }
        }
        
        // 3. Third priority: Frames immediately behind target (anticipating scroll up)
        if (nextIndexToLoad === -1) {
          for (let i = 1; i <= 15; i++) {
            const behind = target - i;
            if (behind >= 1 && !images[behind] && !requested.has(behind)) {
              nextIndexToLoad = behind;
              break;
            }
          }
        }
        
        // 4. Fourth priority: Skeleton frames to ensure we always have SOMETHING close by
        if (nextIndexToLoad === -1) {
          for (let i = 10; i <= TOTAL_FRAMES; i += 10) {
            if (!images[i] && !requested.has(i)) {
              nextIndexToLoad = i;
              break;
            }
          }
        }
        
        // 5. Lowest priority: Fill remaining gaps sequentially starting from target
        if (nextIndexToLoad === -1) {
           for (let i = 1; i <= TOTAL_FRAMES; i++) {
             // Look ahead first, then loop around
             const checkIdx = ((target + i - 1) % TOTAL_FRAMES) + 1;
             if (!images[checkIdx] && !requested.has(checkIdx)) {
               nextIndexToLoad = checkIdx;
               break;
             }
           }
        }

        if (nextIndexToLoad !== -1) {
          requested.add(nextIndexToLoad);
          activeConnections++;
          
          const img = new Image();
          img.src = getFramePath(nextIndexToLoad);
          
          const handleComplete = () => {
            if (isMounted) {
              images[nextIndexToLoad] = img;
              activeConnections--;
              if (onFrameLoaded) onFrameLoaded(nextIndexToLoad);
            }
          };

          img.onload = handleComplete;
          img.onerror = () => {
            if (isMounted) activeConnections--; // Still free up connection on error
          };
        } else {
          // Everything is loaded or requested
          break; 
        }
      }
      
      // Schedule next check
      // Use setTimeout to yield thread to browser for smooth scrolling
      loopId = setTimeout(loadNextPriorities, 50) as unknown as number;
    };

    // Start background loading loop after a short delay to let the page render first
    setTimeout(loadNextPriorities, 500);

    return () => {
      isMounted = false;
      clearTimeout(loopId);
    };
  }, [onFrameLoaded]);

  // Helper to get nearest loaded frame to avoid any blank flicker
  const getNearestFrame = useCallback((targetIndex: number): HTMLImageElement | null => {
    const clamped = Math.max(1, Math.min(TOTAL_FRAMES, Math.round(targetIndex)));
    const images = imagesRef.current;

    // Direct hit with verified readiness
    const exact = images[clamped];
    if (exact && exact.complete && exact.naturalWidth > 0) {
      lastFoundIndexRef.current = clamped;
      return exact;
    }

    // Search outwards for closest available loaded frame (expanded search radius)
    for (let offset = 1; offset <= 120; offset++) {
      // Prefer looking backwards so the animation doesn't jump ahead of scroll
      const before = clamped - offset;
      if (before >= 1) {
        const imgBefore = images[before];
        if (imgBefore && imgBefore.complete && imgBefore.naturalWidth > 0) {
          lastFoundIndexRef.current = before;
          return imgBefore;
        }
      }
      
      const after = clamped + offset;
      if (after <= TOTAL_FRAMES) {
        const imgAfter = images[after];
        if (imgAfter && imgAfter.complete && imgAfter.naturalWidth > 0) {
          lastFoundIndexRef.current = after;
          return imgAfter;
        }
      }
    }

    // Check last successfully found frame
    const lastFound = images[lastFoundIndexRef.current];
    if (lastFound && lastFound.complete && lastFound.naturalWidth > 0) {
      return lastFound;
    }

    // Fallback to frame 1
    return images[1] || null;
  }, []);

  return {
    totalFrames: TOTAL_FRAMES,
    isInitialReady,
    getNearestFrame,
    setTargetFrame
  };
}
