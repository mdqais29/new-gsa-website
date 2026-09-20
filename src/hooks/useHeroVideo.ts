import { useEffect, useRef, useCallback } from 'react';

export function useHeroVideo(canvasRef: React.RefObject<HTMLCanvasElement>) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const targetProgressRef = useRef(0);
  const isReadyRef = useRef(false);
  const readyCallbacksRef = useRef<(() => void)[]>([]);

  useEffect(() => {
    const video = document.createElement('video');
    videoRef.current = video;

    const isMobile = window.innerWidth < 768;
    video.src = isMobile ? '/hero-mobile.mp4' : '/hero.mp4';
    video.preload = 'auto';
    video.muted = true;
    video.playsInline = true;
    video.crossOrigin = 'anonymous';
    // Hide the video, we only use it for data
    video.style.display = 'none';
    document.body.appendChild(video);

    const onCanPlay = () => {
      if (!isReadyRef.current) {
        isReadyRef.current = true;
        readyCallbacksRef.current.forEach(cb => cb());
        readyCallbacksRef.current = [];
      }
    };

    video.addEventListener('canplay', onCanPlay);
    video.addEventListener('loadedmetadata', onCanPlay);

    // Initial load trigger
    video.load();

    return () => {
      video.removeEventListener('canplay', onCanPlay);
      video.removeEventListener('loadedmetadata', onCanPlay);
      if (document.body.contains(video)) {
        document.body.removeChild(video);
      }
    };
  }, []);

  // Safe seek function that prevents decoder choking
  const processSeekQueue = useCallback(() => {
    const video = videoRef.current;
    if (!video || !isReadyRef.current || isNaN(video.duration)) {
      requestAnimationFrame(processSeekQueue);
      return;
    }

    const targetTime = targetProgressRef.current * video.duration;
    
    if (!video.seeking) {
      if (Math.abs(video.currentTime - targetTime) > 0.01) {
        video.currentTime = targetTime;
      }
    }
    
    requestAnimationFrame(processSeekQueue);
  }, []);

  // Draw EXACTLY when the video has finished seeking to a new frame.
  // Drawing in a blind requestAnimationFrame loop causes horrific jitter because 
  // it draws stale frames while the video decoder is still working asynchronously.
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const drawToCanvas = () => {
      const canvas = canvasRef.current;
      if (video && canvas && isReadyRef.current && video.readyState >= 2) {
        const ctx = canvas.getContext('2d', { alpha: false });
        if (ctx) {
          const canvasRatio = canvas.width / canvas.height;
          const videoRatio = video.videoWidth / video.videoHeight;

          let drawWidth = canvas.width;
          let drawHeight = canvas.height;
          let offsetX = 0;
          let offsetY = 0;

          if (canvasRatio > videoRatio) {
            drawHeight = canvas.width / videoRatio;
            offsetY = (canvas.height - drawHeight) / 2;
          } else {
            drawWidth = canvas.height * videoRatio;
            offsetX = (canvas.width - drawWidth) / 2;
          }

          ctx.fillStyle = '#0a0a0f';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(video, offsetX, offsetY, drawWidth, drawHeight);
        }
      }
    };

    video.addEventListener('seeked', drawToCanvas);
    
    const seekId = requestAnimationFrame(processSeekQueue);
    return () => {
      video.removeEventListener('seeked', drawToCanvas);
      cancelAnimationFrame(seekId);
    };
  }, [processSeekQueue, canvasRef]);

  return {
    setProgress: useCallback((progress: number) => {
      targetProgressRef.current = progress;
    }, []),
    waitForReady: useCallback((cb: () => void) => {
      if (isReadyRef.current) cb();
      else readyCallbacksRef.current.push(cb);
    }, [])
  };
}
