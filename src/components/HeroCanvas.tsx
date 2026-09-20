import React, { useRef, useEffect, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Phone, ArrowRight, ShieldCheck, Award, Briefcase } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

interface HeroCanvasProps {
  onOpenEnroll: (course?: string) => void;
}

const TOTAL_FRAMES = 300;

export const HeroCanvas: React.FC<HeroCanvasProps> = ({ onOpenEnroll }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Phase overlay refs — direct DOM manipulation, zero React re-renders during scroll
  const phase1Ref = useRef<HTMLDivElement>(null);
  const phase2Ref = useRef<HTMLDivElement>(null);
  const phase3Ref = useRef<HTMLDivElement>(null);

  const scrollProgressRef = useRef(0);
  const currentFrameRef = useRef(1);
  const imagesMapRef = useRef<Map<number, HTMLImageElement>>(new Map());

  // Phase overlay updates — direct DOM style manipulation, zero React re-renders
  const updateOverlays = useCallback((progress: number) => {
    // Phase 1: 0% - 28%
    const p1 = progress <= 0.25 ? 1 : Math.max(0, 1 - (progress - 0.25) / 0.03);
    if (phase1Ref.current) {
      phase1Ref.current.style.opacity = String(p1);
      phase1Ref.current.style.visibility = p1 > 0.05 ? 'visible' : 'hidden';
    }

    // Phase 2: 29% - 62%
    let p2 = 0;
    if (progress >= 0.28 && progress <= 0.62) {
      if (progress < 0.31) p2 = (progress - 0.28) / 0.03;
      else if (progress > 0.58) p2 = Math.max(0, 1 - (progress - 0.58) / 0.03);
      else p2 = 1;
    }
    if (phase2Ref.current) {
      phase2Ref.current.style.opacity = String(p2);
      phase2Ref.current.style.visibility = p2 > 0.05 ? 'visible' : 'hidden';
    }

    // Phase 3: 63% - 100%
    const p3 = progress >= 0.62 ? Math.min(1, (progress - 0.62) / 0.03) : 0;
    if (phase3Ref.current) {
      phase3Ref.current.style.opacity = String(p3);
      phase3Ref.current.style.visibility = p3 > 0.05 ? 'visible' : 'hidden';
      phase3Ref.current.style.pointerEvents = progress >= 0.62 ? 'auto' : 'none';
    }
  }, []);

  // Helper to draw an image to canvas with cover scaling
  const renderImageToCanvas = useCallback((img: HTMLImageElement) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    const canvasRatio = canvas.width / canvas.height;
    const imgRatio = img.width / img.height;

    let drawWidth = canvas.width;
    let drawHeight = canvas.height;
    let offsetX = 0;
    let offsetY = 0;

    if (canvasRatio > imgRatio) {
      drawHeight = canvas.width / imgRatio;
      offsetY = (canvas.height - drawHeight) / 2;
    } else {
      drawWidth = canvas.height * imgRatio;
      offsetX = (canvas.width - drawWidth) / 2;
    }

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.fillStyle = '#0a0a0f';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
  }, []);

  // Find nearest loaded frame and draw it
  const renderFrame = useCallback((targetIndex: number) => {
    currentFrameRef.current = targetIndex;
    const map = imagesMapRef.current;

    if (map.has(targetIndex)) {
      renderImageToCanvas(map.get(targetIndex)!);
      return;
    }

    // Search outwards for nearest loaded frame
    for (let offset = 1; offset < 35; offset++) {
      if (map.has(targetIndex - offset)) {
        renderImageToCanvas(map.get(targetIndex - offset)!);
        return;
      }
      if (map.has(targetIndex + offset)) {
        renderImageToCanvas(map.get(targetIndex + offset)!);
        return;
      }
    }

    if (map.has(1)) {
      renderImageToCanvas(map.get(1)!);
    }
  }, [renderImageToCanvas]);

  // Frame loading & Canvas sizing lifecycle
  useEffect(() => {
    // Both mobile and desktop now use full 1080p frames for razor-sharp Retina clarity
    const folder = '/frames-desktop';

    const getFrameUrl = (idx: number) => {
      const padded = String(idx).padStart(3, '0');
      return `${folder}/frame_${padded}.webp`;
    };

    const map = imagesMapRef.current;

    const loadFrame = (idx: number): Promise<HTMLImageElement> => {
      return new Promise((resolve, reject) => {
        if (map.has(idx)) {
          resolve(map.get(idx)!);
          return;
        }
        const img = new Image();
        img.onload = () => {
          map.set(idx, img);
          // If the user is currently at this exact frame, redraw immediately
          if (currentFrameRef.current === idx) {
            renderImageToCanvas(img);
          }
          resolve(img);
        };
        img.onerror = () => reject();
        img.src = getFrameUrl(idx);
      });
    };

    // 1. Immediately load & display Frame 1
    loadFrame(1).then((img) => {
      renderImageToCanvas(img);
    }).catch(() => {});

    // 2. Load skeleton (every 10th frame: 10, 20, 30... 300) so scrubbing is immediately responsive
    const skeletonIndices: number[] = [];
    for (let i = 10; i <= TOTAL_FRAMES; i += 10) {
      skeletonIndices.push(i);
    }

    // 3. Queue all intermediate frames
    const remainingIndices: number[] = [];
    for (let i = 2; i <= TOTAL_FRAMES; i++) {
      if (i % 10 !== 0) remainingIndices.push(i);
    }

    const fullQueue = [...skeletonIndices, ...remainingIndices];

    // Concurrently fetch frames without blocking UI
    let active = 0;
    const isMobile = typeof window !== 'undefined' ? window.innerWidth < 768 : false;
    const CONCURRENCY = isMobile ? 6 : 8;

    const processQueue = () => {
      while (active < CONCURRENCY && fullQueue.length > 0) {
        const nextIdx = fullQueue.shift()!;
        active++;
        loadFrame(nextIdx)
          .catch(() => {})
          .finally(() => {
            active--;
            processQueue();
          });
      }
    };

    processQueue();

    // Canvas resize handling
    const handleResize = () => {
      const canvas = canvasRef.current;
      if (canvas) {
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        canvas.width = window.innerWidth * dpr;
        canvas.height = window.innerHeight * dpr;
        renderFrame(currentFrameRef.current);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [renderImageToCanvas, renderFrame]);

  // GSAP ScrollTrigger
  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const ctx = gsap.context(() => {
      const proxy = { progress: 0 };

      gsap.to(proxy, {
        progress: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: container,
          start: 'top top',
          end: '+=550%',
          pin: true,
          pinSpacing: true,
          anticipatePin: 1,
          scrub: 1.8, // Ultra-luxurious buttery momentum glide on both desktop and mobile
          onLeave: () => {
            scrollProgressRef.current = 1;
            updateOverlays(1);
            renderFrame(TOTAL_FRAMES);
          },
          onLeaveBack: () => {
            scrollProgressRef.current = 0;
            updateOverlays(0);
            renderFrame(1);
          },
          onUpdate: (self) => {
            const progress = self.progress;
            scrollProgressRef.current = progress;
            updateOverlays(progress);

            const targetFrame = Math.max(1, Math.min(TOTAL_FRAMES, Math.round(progress * (TOTAL_FRAMES - 1)) + 1));
            renderFrame(targetFrame);
          },
        },
      });
    }, container);

    return () => ctx.revert();
  }, [updateOverlays, renderFrame]);

  return (
    <section id="hero" ref={containerRef} className="relative z-20 w-full h-[100vh] h-[100dvh] overflow-hidden bg-midnight-950">
      {/* HTML5 Canvas Background */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full object-cover pointer-events-none"
        style={{ 
          display: 'block',
          backgroundImage: 'url(/hero-poster.webp)',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      />

      {/* Gentle Vignette: Desktop only */}
      <div className="hidden sm:block absolute inset-0 pointer-events-none bg-gradient-to-t from-midnight-950/40 via-transparent to-midnight-950/15" />

      {/* PHASE 1 OVERLAY (0% - 28%): Starting Career */}
      <div
        ref={phase1Ref}
        className="absolute inset-0 z-30 flex items-end pb-12 sm:pb-16 md:pb-20 lg:pb-24 justify-start px-5 sm:px-12 md:px-16 lg:px-20 xl:px-24 pointer-events-none"
        style={{ opacity: 1, visibility: 'visible', transition: 'none' }}
      >
        <div className="absolute bottom-0 left-0 right-0 h-[45%] sm:h-full sm:inset-0 pointer-events-none bg-gradient-to-t from-black via-black/70 to-transparent sm:bg-gradient-to-r sm:from-midnight-950/90 sm:via-midnight-950/40 sm:to-transparent" />

        <div className="relative z-10 max-w-md lg:max-w-lg text-left drop-shadow-[0_8px_30px_rgba(0,0,0,1)]">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-safety-orange/10 border border-safety-orange/30 text-safety-orange shadow-md mb-2 sm:mb-3.5">
            <span className="w-1.5 h-1.5 rounded-full bg-safety-orange animate-pulse" />
            <span className="text-[11px] sm:text-xs md:text-sm font-bold tracking-wider uppercase font-mono">
              Start Your Journey
            </span>
          </div>

          <h2 className="text-base sm:text-2xl lg:text-3xl font-bold text-white tracking-tight leading-[1.25] sm:leading-[1.28] mb-2 sm:mb-3.5 font-syncopate uppercase">
            Start your safety career with{' '}
            <span className="text-[#FF3E00]">
              expert mentorship.
            </span>
          </h2>

          <p className="text-xs sm:text-sm md:text-base text-slate-200 leading-relaxed font-normal">
            Learn industrial safety from experienced professionals. Build strong core fundamentals, master workplace compliance, and prepare for high-growth engineering roles.
          </p>
        </div>
      </div>

      {/* PHASE 2 OVERLAY (29% - 62%): Practical Safety Training */}
      <div
        ref={phase2Ref}
        className="absolute inset-0 z-30 flex items-end pb-12 sm:pb-16 md:pb-20 lg:pb-24 justify-start sm:justify-end px-5 sm:px-12 md:px-16 lg:px-20 xl:px-24 pointer-events-none"
        style={{ opacity: 0, visibility: 'hidden', transition: 'none' }}
      >
        <div className="absolute bottom-0 left-0 right-0 h-[45%] sm:h-full sm:inset-0 pointer-events-none bg-gradient-to-t from-black via-black/70 to-transparent sm:bg-gradient-to-l sm:from-midnight-950/90 sm:via-midnight-950/40 sm:to-transparent" />

        <div className="relative z-10 max-w-md lg:max-w-lg text-left sm:text-right sm:ml-auto drop-shadow-[0_8px_30px_rgba(0,0,0,1)]">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-safety-orange/10 border border-safety-orange/30 text-safety-orange shadow-md mb-2 sm:mb-3.5">
            <span className="text-[11px] sm:text-xs md:text-sm font-bold tracking-wider uppercase font-mono">
              Practical Safety Training
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-safety-orange animate-pulse" />
          </div>

          <h2 className="text-base sm:text-2xl lg:text-3xl font-bold text-white tracking-tight leading-[1.25] sm:leading-[1.28] mb-2 sm:mb-3.5 font-syncopate uppercase">
            Learn industrial safety &{' '}
            <span className="text-[#FF3E00]">
              risk practices.
            </span>
          </h2>

          <p className="text-xs sm:text-sm md:text-base text-slate-200 leading-relaxed font-normal">
            Gain clear understanding of hazard identification, fire safety protocols, and workplace compliance through structured lessons and case studies.
          </p>
        </div>
      </div>

      {/* PHASE 3 OVERLAY (63% - 100%): Fixed Hero Lockup */}
      <div
        ref={phase3Ref}
        className="absolute inset-0 z-30 flex items-end pb-8 sm:pb-0 sm:items-center justify-start px-5 sm:px-12 md:px-16 lg:px-20 xl:px-24"
        style={{ opacity: 0, visibility: 'hidden', pointerEvents: 'none', transition: 'none' }}
      >
        <div className="absolute bottom-0 left-0 right-0 h-[55%] sm:h-full sm:inset-0 pointer-events-none bg-gradient-to-t from-black via-black/80 to-transparent sm:bg-gradient-to-r sm:from-midnight-950/95 sm:via-midnight-950/75 sm:to-transparent" />

        <div className="relative z-10 w-full max-w-xl lg:max-w-2xl text-left drop-shadow-[0_8px_30px_rgba(0,0,0,1)]">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-safety-orange sm:bg-safety-orange/10 border border-safety-orange sm:border-safety-orange/30 text-white sm:text-safety-orange shadow-[0_4px_12px_rgba(255,62,0,0.4)] sm:shadow-md mb-2 sm:mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-white sm:bg-safety-orange animate-pulse" />
            <span className="text-[11px] sm:text-xs md:text-sm font-bold tracking-wider uppercase font-mono">
              Admissions Open • 2026 Batch
            </span>
          </div>

          <h1 className="text-lg sm:text-2xl md:text-3xl lg:text-[2.5rem] font-bold text-white tracking-tight leading-[1.22] mb-2 sm:mb-4 font-syncopate uppercase">
            Become a{' '}
            <span className="text-[#FF3E00]">
              Certified Safety Engineer
            </span>{' '}
            & Earn High Salaries
          </h1>

          <p className="text-xs sm:text-sm md:text-base lg:text-lg text-slate-200 max-w-xl mb-3 sm:mb-7 font-normal leading-relaxed">
            Get certified in recognized programs including Diploma in Fire & Safety, IOSH, OSHA, and NEBOSH. Unlock high-paying safety careers in India and abroad with dedicated job guidance.
          </p>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-start gap-2.5 sm:gap-3 mb-3 sm:mb-7">
            <button
              onClick={() => onOpenEnroll()}
              className="w-full sm:w-auto px-6 sm:px-7 py-3 sm:py-3.5 rounded-full bg-[#FF3E00] hover:bg-[#E03500] text-white font-extrabold text-xs sm:text-sm md:text-base shadow-lg shadow-[#FF3E00]/30 hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center justify-center gap-2 group"
            >
              <span>Enroll Now</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <a
              href="tel:+919381740025"
              className="w-full sm:w-auto px-6 sm:px-7 py-3 sm:py-3.5 rounded-full bg-midnight-950/90 hover:bg-midnight-900 text-white font-extrabold text-xs sm:text-sm md:text-base border border-white/30 hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center justify-center gap-2.5 shadow-lg"
            >
              <Phone className="w-4 h-4 text-[#FF3E00]" />
              <span>Call +91 93817 40025</span>
            </a>
          </div>

          <div className="w-full text-[10px] sm:text-xs md:text-sm font-semibold text-white">
            <div className="sm:hidden flex flex-col items-center gap-2 max-w-sm mx-auto">
              <div className="flex items-center justify-center gap-x-4">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#FF3E00] flex-shrink-0" />
                  <span className="whitespace-nowrap">Practical Safety Training</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5 text-[#FF3E00] flex-shrink-0" />
                  <span className="whitespace-nowrap">Global Certifications</span>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <div className="flex items-center gap-1.5">
                  <Briefcase className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                  <span className="whitespace-nowrap">High-Salary Career Support</span>
                </div>
              </div>
            </div>

            <div className="hidden sm:flex items-center justify-start gap-x-6">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#FF3E00] flex-shrink-0" />
                <span>Practical Safety Training</span>
              </div>
              <span className="text-white/50">•</span>
              <div className="flex items-center gap-1.5">
                <Award className="w-4 h-4 text-[#FF3E00] flex-shrink-0" />
                <span>Global Certifications</span>
              </div>
              <span className="text-white/50">•</span>
              <div className="flex items-center gap-1.5">
                <Briefcase className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>High-Salary Career Support</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroCanvas;
