import { useRef, useCallback, useEffect } from 'react';

export function useHeroFrames() {
  const totalFrames = 150;
  const loadedFramesRef = useRef(new Map<number, HTMLImageElement>());
  const isLoadedMapRef = useRef(new Set<number>());
  const redrawCallbacks = useRef<((frameIndex: number) => void)[]>([]);
  const currentTargetRef = useRef(1);
  const loadingQueueRef = useRef<number[]>([]);
  const isCurrentlyLoadingRef = useRef(false);
  const initialReadyCallbacks = useRef<(() => void)[]>([]);

  const getNearestFrame = useCallback((targetIndex: number): HTMLImageElement | null => {
    if (loadedFramesRef.current.has(targetIndex)) return loadedFramesRef.current.get(targetIndex)!;
    // Search outwards
    for (let offset = 1; offset < 50; offset++) {
      if (loadedFramesRef.current.has(targetIndex - offset)) return loadedFramesRef.current.get(targetIndex - offset)!;
      if (loadedFramesRef.current.has(targetIndex + offset)) return loadedFramesRef.current.get(targetIndex + offset)!;
    }
    return loadedFramesRef.current.get(1) || null;
  }, []);

  const activeLoadsRef = useRef(0);
  const MAX_CONCURRENT = 5;

  const loadNextInQueue = useCallback(() => {
    while (activeLoadsRef.current < MAX_CONCURRENT && loadingQueueRef.current.length > 0) {
      // Prioritize frames near the current target
      loadingQueueRef.current.sort((a, b) => {
        return Math.abs(a - currentTargetRef.current) - Math.abs(b - currentTargetRef.current);
      });

      const indexToLoad = loadingQueueRef.current.shift()!;
      activeLoadsRef.current++;

      const img = new Image();
      const paddedIndex = String(indexToLoad).padStart(3, '0');
      
      img.onload = () => {
        loadedFramesRef.current.set(indexToLoad, img);
        activeLoadsRef.current--;
        
        // Redraw current target if this newly loaded frame is better
        redrawCallbacks.current.forEach(cb => cb(currentTargetRef.current));
        
        if (indexToLoad === 1) {
          initialReadyCallbacks.current.forEach(cb => cb());
          initialReadyCallbacks.current = [];
        }
        
        loadNextInQueue();
      };
      
      img.onerror = () => {
        activeLoadsRef.current--;
        loadNextInQueue();
      };

      img.src = `/frames-optimized/frame_${paddedIndex}.webp`;
    }
  }, []);

  useEffect(() => {
    // Generate progressive loading queue
    const queue: number[] = [];
    
    // Priority 1: First frame
    queue.push(1);
    
    // Priority 2: Every 10th frame (low fps skeleton)
    for (let i = 10; i <= totalFrames; i += 10) {
      queue.push(i);
    }
    
    // Priority 3: Every 2nd frame (medium fps)
    for (let i = 2; i <= totalFrames; i += 2) {
      if (!queue.includes(i)) queue.push(i);
    }
    
    // Priority 4: All remaining frames (full 60fps equivalent)
    for (let i = 2; i <= totalFrames; i++) {
      if (!queue.includes(i)) queue.push(i);
    }

    loadingQueueRef.current = queue.filter(i => !isLoadedMapRef.current.has(i));
    isLoadedMapRef.current = new Set(queue);

    // Kick off 3 concurrent loaders for fast loading
    loadNextInQueue();
    loadNextInQueue();
    loadNextInQueue();
  }, [loadNextInQueue]);

  return {
    totalFrames,
    getNearestFrame,
    setTargetFrame: useCallback((frame: number) => {
      currentTargetRef.current = frame;
    }, []),
    waitForInitial: useCallback((cb: () => void) => {
      if (loadedFramesRef.current.has(1)) cb();
      else initialReadyCallbacks.current.push(cb);
    }, []),
    onRedraw: useCallback((cb: (frameIndex: number) => void) => {
      redrawCallbacks.current.push(cb);
    }, []),
  };
}
