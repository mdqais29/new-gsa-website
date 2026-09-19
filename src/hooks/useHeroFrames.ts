import { useState, useEffect, useRef, useCallback } from 'react';

const TOTAL_FRAMES = 600;

function getFramePath(index: number): string {
  const padded = String(index).padStart(3, '0');
  return `/frames/hero/frame_${padded}.webp`;
}

export function useHeroFrames() {
  const [isInitialReady, setIsInitialReady] = useState(false);
  const imagesRef = useRef<(HTMLImageElement | null)[]>(new Array(TOTAL_FRAMES + 1).fill(null));
  const lastFoundIndexRef = useRef<number>(1);

  useEffect(() => {
    let isMounted = true;
    const images = imagesRef.current;

    // Phase 1: Load frame 1 urgently
    const firstImg = new Image();
    firstImg.src = getFramePath(1);
    firstImg.onload = () => {
      if (!isMounted) return;
      images[1] = firstImg;
      setIsInitialReady(true);
    };

    // Phase 2: Load key sequence in priority batches
    const priorityIndices: number[] = [];
    const secondaryIndices: number[] = [];

    for (let i = 2; i <= TOTAL_FRAMES; i++) {
      if (i <= 60 || i % 4 === 0) {
        priorityIndices.push(i);
      } else {
        secondaryIndices.push(i);
      }
    }

    const loadBatch = (indices: number[], concurrency = 8): Promise<void> => {
      return new Promise((resolve) => {
        let cursor = 0;
        let active = 0;

        const pump = () => {
          if (!isMounted) return;
          if (cursor >= indices.length && active === 0) {
            resolve();
            return;
          }

          while (active < concurrency && cursor < indices.length) {
            const idx = indices[cursor++];
            active++;

            const img = new Image();
            img.src = getFramePath(idx);

            img.onload = () => {
              if (isMounted) {
                images[idx] = img;
              }
              active--;
              pump();
            };

            img.onerror = () => {
              active--;
              pump();
            };
          }
        };

        pump();
      });
    };

    // Sequentially kick off priority then remaining
    loadBatch(priorityIndices, 10).then(() => {
      if (isMounted) {
        loadBatch(secondaryIndices, 6);
      }
    });

    return () => {
      isMounted = false;
    };
  }, []);

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

    // If scrubbing in the video and no nearby frame is found, search backwards to find the highest loaded frame
    if (clamped > 1) {
      for (let i = clamped; i >= 1; i--) {
        const img = images[i];
        if (img && img.complete && img.naturalWidth > 0) {
          lastFoundIndexRef.current = i;
          return img;
        }
      }
    }

    return images[1] || null;
  }, []);

  return {
    totalFrames: TOTAL_FRAMES,
    isInitialReady,
    getNearestFrame,
  };
}
