import React, { useRef, useEffect, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useHeroFrames } from '../hooks/useHeroFrames';
import { Phone, ArrowRight, ShieldCheck, Award, Briefcase } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

interface HeroCanvasProps {
  onOpenEnroll: (course?: string) => void;
}

export const HeroCanvas: React.FC<HeroCanvasProps> = ({ onOpenEnroll }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Phase overlay refs — we mutate style directly, NO React state involved
  const phase1Ref = useRef<HTMLDivElement>(null);
  const phase2Ref = useRef<HTMLDivElement>(null);
  const phase3Ref = useRef<HTMLDivElement>(null);

  const lastDrawnFrameRef = useRef(1);
  const scrollProgressRef = useRef(0);

  const { totalFrames, waitForInitial, getNearestFrame, setTargetFrame, onRedraw } = useHeroFrames();

  // Canvas drawing function — pure imperative, no React state dependency
  const drawFrame = useCallback((frameNum: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = getNearestFrame(frameNum);
    if (!img || !img.complete || img.naturalWidth === 0) return;

    // Use DPR 1 always — the visual difference is negligible but the perf win is huge
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
    const imgRatio = img.naturalWidth / img.naturalHeight;
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

    ctx.drawImage(img, drawX, drawY, drawW, drawH);
  }, [getNearestFrame]);

  // Phase overlay updates — direct DOM manipulation, zero React re-renders
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

  // Register redraw callback for when frames load near current scroll position
  useEffect(() => {
    onRedraw((loadedIdx: number) => {
      const progress = scrollProgressRef.current;
      const currentTarget = Math.max(1, Math.min(totalFrames, Math.round(1 + progress * (totalFrames - 1))));
      if (Math.abs(currentTarget - loadedIdx) <= 8) {
        lastDrawnFrameRef.current = currentTarget;
        drawFrame(currentTarget);
      }
    });
  }, [drawFrame, totalFrames, onRedraw]);

  // Initial draw and window resize
  useEffect(() => {
    let lastWidth = window.innerWidth;

    const handleResize = () => {
      if (Math.abs(window.innerWidth - lastWidth) > 10 || window.innerWidth >= 768) {
        lastWidth = window.innerWidth;
        drawFrame(lastDrawnFrameRef.current);
      }
    };

    window.addEventListener('resize', handleResize);

    // Wait for initial frame to be ready, then draw
    waitForInitial(() => {
      drawFrame(1);
    });

    return () => window.removeEventListener('resize', handleResize);
  }, [drawFrame, waitForInitial]);

  // GSAP ScrollTrigger Scrubbing Engine
  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const endDistance = '+=550%';

    const ctx = gsap.context(() => {
      const proxy = { progress: 0 };

      gsap.to(proxy, {
        progress: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: container,
          start: 'top top',
          end: endDistance,
          pin: true,
          pinSpacing: true,
          anticipatePin: 1,
          scrub: 1.2, // Reduced from 2.5 — much more responsive to scroll input
          onLeave: () => {
            scrollProgressRef.current = 1;
            updateOverlays(1);
            setTargetFrame(totalFrames);
            lastDrawnFrameRef.current = totalFrames;
            drawFrame(totalFrames);
          },
          onEnterBack: () => {
            scrollProgressRef.current = 1;
            updateOverlays(1);
            setTargetFrame(totalFrames);
            lastDrawnFrameRef.current = totalFrames;
            drawFrame(totalFrames);
          },
        },
        onUpdate: () => {
          const progress = proxy.progress;
          scrollProgressRef.current = progress;

          // Update overlays via direct DOM manipulation — no React re-render
          updateOverlays(progress);

          // Determine target frame
          let targetFrame: number;
          if (progress > 0.999) {
            targetFrame = totalFrames;
          } else if (progress < 0.001) {
            targetFrame = 1;
          } else {
            const exactFrame = 1 + progress * (totalFrames - 1);
            targetFrame = Math.max(1, Math.min(totalFrames, Math.round(exactFrame)));
          }

          setTargetFrame(targetFrame);

          if (targetFrame !== lastDrawnFrameRef.current) {
            lastDrawnFrameRef.current = targetFrame;
            drawFrame(targetFrame);
          }
        },
      });
    }, container);

    return () => ctx.revert();
  }, [totalFrames, drawFrame, updateOverlays, setTargetFrame]);

  return (
    <section id="hero" ref={containerRef} className="relative z-20 w-full h-[100vh] overflow-hidden bg-midnight-950">
      {/* HTML5 Canvas Background */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full object-cover pointer-events-none"
        style={{ display: 'block' }}
      />

      {/* Gentle Vignette: Desktop only to keep mobile 100% bright and clean */}
      <div className="hidden sm:block absolute inset-0 pointer-events-none bg-gradient-to-t from-midnight-950/40 via-transparent to-midnight-950/15" />

      {/* PHASE 1 OVERLAY (0% - 28%): Starting Career */}
      <div
        ref={phase1Ref}
        className="absolute inset-0 z-30 flex items-end pb-14 sm:pb-16 md:pb-20 lg:pb-24 justify-start px-5 sm:px-12 md:px-16 lg:px-20 xl:px-24 pointer-events-none"
        style={{ opacity: 1, visibility: 'visible', transition: 'none' }}
      >
        {/* Phase 1 Studio Scrim - Strictly restrained to bottom 45% on mobile */}
        <div className="absolute bottom-0 left-0 right-0 h-[45%] sm:h-full sm:inset-0 pointer-events-none bg-gradient-to-t from-black via-black/70 to-transparent sm:bg-gradient-to-r sm:from-midnight-950/90 sm:via-midnight-950/40 sm:to-transparent" />

        <div className="relative z-10 max-w-md lg:max-w-lg text-left drop-shadow-[0_8px_30px_rgba(0,0,0,1)]">
          {/* Eyebrow - Smoked Glass Translucent Capsule */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-safety-orange/10 border border-safety-orange/30 text-safety-orange shadow-md mb-2 sm:mb-3.5">
            <span className="w-1.5 h-1.5 rounded-full bg-safety-orange animate-pulse" />
            <span className="text-[11px] sm:text-xs md:text-sm font-bold tracking-wider uppercase font-mono">
              Start Your Journey
            </span>
          </div>

          {/* Clean, Crisp Headline */}
          <h2 className="text-base sm:text-2xl lg:text-3xl font-bold text-white tracking-tight leading-[1.25] sm:leading-[1.28] mb-2 sm:mb-3.5 font-syncopate uppercase">
            Start your safety career with{' '}
            <span className="text-[#FF3E00]">
              expert mentorship.
            </span>
          </h2>

          {/* Simple, Clear Description */}
          <p className="text-xs sm:text-sm md:text-base text-slate-200 leading-relaxed font-normal">
            Learn industrial safety from experienced professionals. Build strong core fundamentals, master workplace compliance, and prepare for high-growth engineering roles.
          </p>
        </div>
      </div>

      {/* PHASE 2 OVERLAY (29% - 62%): Practical Safety Training */}
      <div
        ref={phase2Ref}
        className="absolute inset-0 z-30 flex items-end pb-14 sm:pb-16 md:pb-20 lg:pb-24 justify-start sm:justify-end px-5 sm:px-12 md:px-16 lg:px-20 xl:px-24 pointer-events-none"
        style={{ opacity: 0, visibility: 'hidden', transition: 'none' }}
      >
        {/* Phase 2 Studio Scrim - Strictly restrained to bottom 45% on mobile */}
        <div className="absolute bottom-0 left-0 right-0 h-[45%] sm:h-full sm:inset-0 pointer-events-none bg-gradient-to-t from-black via-black/70 to-transparent sm:bg-gradient-to-l sm:from-midnight-950/90 sm:via-midnight-950/40 sm:to-transparent" />

        <div className="relative z-10 max-w-md lg:max-w-lg text-left sm:text-right sm:ml-auto drop-shadow-[0_8px_30px_rgba(0,0,0,1)]">
          {/* Eyebrow - Smoked Glass Translucent Capsule */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-safety-orange/10 border border-safety-orange/30 text-safety-orange shadow-md mb-2 sm:mb-3.5">
            <span className="text-[11px] sm:text-xs md:text-sm font-bold tracking-wider uppercase font-mono">
              Practical Safety Training
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-safety-orange animate-pulse" />
          </div>

          {/* Clean, Crisp Headline */}
          <h2 className="text-base sm:text-2xl lg:text-3xl font-bold text-white tracking-tight leading-[1.25] sm:leading-[1.28] mb-2 sm:mb-3.5 font-syncopate uppercase">
            Learn industrial safety &{' '}
            <span className="text-[#FF3E00]">
              risk practices.
            </span>
          </h2>

          {/* Simple, Clear Description */}
          <p className="text-xs sm:text-sm md:text-base text-slate-200 leading-relaxed font-normal">
            Gain clear understanding of hazard identification, fire safety protocols, and workplace compliance through structured lessons and case studies.
          </p>
        </div>
      </div>

      {/* PHASE 3 OVERLAY (63% - 100%): Fixed Hero Lockup (Solid, Crisp & Instant) */}
      <div
        ref={phase3Ref}
        className="absolute inset-0 z-30 flex items-end pb-12 sm:pb-0 sm:items-center justify-start px-5 sm:px-12 md:px-16 lg:px-20 xl:px-24"
        style={{ opacity: 0, visibility: 'hidden', pointerEvents: 'none', transition: 'none' }}
      >
        {/* Phase 3 Studio Scrim - Restrained to bottom 55% on mobile for complete top visual freedom */}
        <div className="absolute bottom-0 left-0 right-0 h-[55%] sm:h-full sm:inset-0 pointer-events-none bg-gradient-to-t from-black via-black/80 to-transparent sm:bg-gradient-to-r sm:from-midnight-950/95 sm:via-midnight-950/75 sm:to-transparent" />

        <div className="relative z-10 w-full max-w-xl lg:max-w-2xl text-left drop-shadow-[0_8px_30px_rgba(0,0,0,1)]">
          {/* Eyebrow - Smoked Glass Translucent Capsule (Solid Orange on Mobile for Contrast) */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-safety-orange sm:bg-safety-orange/10 border border-safety-orange sm:border-safety-orange/30 text-white sm:text-safety-orange shadow-[0_4px_12px_rgba(255,62,0,0.4)] sm:shadow-md mb-2.5 sm:mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-white sm:bg-safety-orange animate-pulse" />
            <span className="text-[11px] sm:text-xs md:text-sm font-bold tracking-wider uppercase font-mono">
              Admissions Open • 2026 Batch
            </span>
          </div>

          {/* Scaled H1 Headline */}
          <h1 className="text-lg sm:text-2xl md:text-3xl lg:text-[2.5rem] font-bold text-white tracking-tight leading-[1.22] mb-2 sm:mb-4 font-syncopate uppercase">
            Become a{' '}
            <span className="text-[#FF3E00]">
              Certified Safety Engineer
            </span>{' '}
            & Earn High Salaries
          </h1>

          {/* Sub-headline */}
          <p className="text-xs sm:text-sm md:text-base lg:text-lg text-slate-200 max-w-xl mb-4 sm:mb-7 font-normal leading-relaxed">
            Get certified in recognized programs including Diploma in Fire & Safety, IOSH, OSHA, and NEBOSH. Unlock high-paying safety careers in India and abroad with dedicated job guidance.
          </p>

          {/* CTAs - Full-width stacked on mobile, row on desktop */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-start gap-2.5 sm:gap-3 mb-4 sm:mb-7">
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

          {/* Highlights - Responsive V-Shape on Mobile, Clean Row on Desktop */}
          <div className="w-full text-[10px] sm:text-xs md:text-sm font-semibold text-white">
            {/* Mobile V-Shape Layout (< sm) */}
            <div className="sm:hidden flex flex-col items-center gap-2 max-w-sm mx-auto">
              {/* Top Row: 2 items closer together */}
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
              {/* Bottom Row: Centered point forming exact V-shape */}
              <div className="flex items-center justify-center">
                <div className="flex items-center gap-1.5">
                  <Briefcase className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                  <span className="whitespace-nowrap">High-Salary Career Support</span>
                </div>
              </div>
            </div>

            {/* Desktop Row Layout (>= sm) */}
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
