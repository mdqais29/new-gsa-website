import { useRef, useEffect, useCallback } from 'react';

/**
 * Video-scrub hero hook.
 * Loads a single MP4 video and seeks it via `video.currentTime` based on scroll.
 * 
 * Desktop: hero.mp4 (1920×1080, ~10MB)
 * Mobile:  hero-mobile.mp4 (960×540, ~2MB)
 * 
 * This replaces the old 600-frame image sequence approach (~90MB).
 */
export function useHeroVideo() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const isReadyRef = useRef(false);
  const readyCallbacksRef = useRef<(() => void)[]>([]);
  const durationRef = useRef(0);

  useEffect(() => {
    const isMobile = window.innerWidth < 768;
    const src = isMobile ? '/hero-mobile.mp4' : '/hero.mp4';

    const video = document.createElement('video');
    video.src = src;
    video.muted = true;
    video.playsInline = true;
    video.preload = 'auto';
    // Prevent autoplay — we control playback via currentTime
    video.pause();

    videoRef.current = video;

    const onLoaded = () => {
      durationRef.current = video.duration;
      isReadyRef.current = true;
      // Seek to frame 0 immediately
      video.currentTime = 0;
      readyCallbacksRef.current.forEach(cb => cb());
      readyCallbacksRef.current = [];
    };

    // 'loadedmetadata' fires as soon as duration is known (very fast)
    // 'canplaythrough' fires when enough data is buffered
    video.addEventListener('loadedmetadata', onLoaded, { once: true });

    // Force the browser to start loading
    video.load();

    return () => {
      video.removeEventListener('loadedmetadata', onLoaded);
      video.src = '';
      video.load(); // release memory
      videoRef.current = null;
      isReadyRef.current = false;
    };
  }, []);

  const seekTo = useCallback((progress: number) => {
    const video = videoRef.current;
    if (!video || !isReadyRef.current) return;
    // Clamp progress to [0, 1] and set currentTime
    const t = Math.max(0, Math.min(1, progress)) * durationRef.current;
    // Only seek if the difference is meaningful (> 1 frame at 30fps ≈ 0.033s)
    if (Math.abs(video.currentTime - t) > 0.02) {
      video.currentTime = t;
    }
  }, []);

  const waitForReady = useCallback((cb: () => void) => {
    if (isReadyRef.current) {
      cb();
    } else {
      readyCallbacksRef.current.push(cb);
    }
  }, []);

  const drawToCanvas = useCallback((canvas: HTMLCanvasElement) => {
    const video = videoRef.current;
    if (!video || !isReadyRef.current) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const w = rect.width || window.innerWidth;
    const h = rect.height || window.innerHeight;
    const targetW = Math.round(w);
    const targetH = Math.round(h);

    if (canvas.width !== targetW || canvas.height !== targetH) {
      canvas.width = targetW;
      canvas.height = targetH;
    }

    // Object-fit: cover math
    const vidW = video.videoWidth || 1920;
    const vidH = video.videoHeight || 1080;
    const imgRatio = vidW / vidH;
    const canvasRatio = canvas.width / canvas.height;

    let drawW: number, drawH: number, drawX: number, drawY: number;

    if (canvasRatio > imgRatio) {
      drawW = canvas.width;
      drawH = canvas.width / imgRatio;
      drawX = 0;
      drawY = (canvas.height - drawH) / 2;
    } else {
      drawH = canvas.height;
      drawW = canvas.height * imgRatio;
      drawX = (canvas.width - drawW) / 2;
      drawY = 0;
    }

    ctx.drawImage(video, drawX, drawY, drawW, drawH);
  }, []);

  return {
    videoRef,
    seekTo,
    waitForReady,
    drawToCanvas,
    isReadyRef,
  };
}
