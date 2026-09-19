import React, { useRef, useEffect, useState, useCallback } from 'react';
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
  
  const { totalFrames, getNearestFrame, isInitialReady } = useHeroFrames();
  
  // Progress tracker for Phase 1, Phase 2, Phase 3
  const [scrollProgress, setScrollProgress] = useState(0);
  const lastDrawnFrameRef = useRef(1);

  // Canvas drawing function with proper aspect-ratio cover math and DPR
  const drawFrame = useCallback((frameNum: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = getNearestFrame(frameNum);
    if (!img || !img.complete || img.naturalWidth === 0) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const rect = canvas.getBoundingClientRect();
    
    // Set actual canvas resolution with fallback if rect is 0
    const w = rect.width || window.innerWidth;
    const h = rect.height || window.innerHeight;
    const targetW = Math.round(w * dpr);
    const targetH = Math.round(h * dpr);

    if (canvas.width !== targetW || canvas.height !== targetH) {
      canvas.width = targetW;
      canvas.height = targetH;
    }

    // Object-fit: cover math
    const imgRatio = img.naturalWidth / img.naturalHeight;
    const canvasRatio = canvas.width / canvas.height;

    let drawW: number;
    let drawH: number;
    let drawX: number;
    let drawY: number;

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

    // Paint directly over previous frame to prevent single-frame white/black flash
    ctx.drawImage(img, drawX, drawY, drawW, drawH);
  }, [getNearestFrame]);

  // Initial draw and window resize handling
  useEffect(() => {
    const handleResize = () => {
      drawFrame(lastDrawnFrameRef.current);
    };

    window.addEventListener('resize', handleResize);
    if (isInitialReady) {
      drawFrame(lastDrawnFrameRef.current);
    }

    return () => window.removeEventListener('resize', handleResize);
  }, [drawFrame, isInitialReady]);

  // GSAP ScrollTrigger Scrubbing Engine
  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const isDesktop = window.innerWidth >= 768;
    const endDistance = isDesktop ? '+=550%' : '+=350%';

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: container,
        start: 'top top',
        end: endDistance,
        pin: true,
        scrub: 0.5,
        onUpdate: (self) => {
          const progress = self.progress;
          setScrollProgress(progress);

          // Hysteresis threshold to completely eliminate frame oscillation/jitter when stopping
          const rawTarget = 1 + progress * (totalFrames - 1);
          const current = lastDrawnFrameRef.current;
          let targetFrame = current;

          if (rawTarget > current + 0.55) {
            targetFrame = Math.min(totalFrames, Math.floor(rawTarget));
          } else if (rawTarget < current - 0.55) {
            targetFrame = Math.max(1, Math.ceil(rawTarget));
          }

          if (targetFrame !== current) {
            lastDrawnFrameRef.current = targetFrame;
            drawFrame(targetFrame);
          }
        },
      });
    }, container);

    return () => ctx.revert();
  }, [totalFrames, drawFrame]);

  // Phase Opacity Calculations - Calibrated for generous holding time & smooth reads
  // Phase 1: 0% - 24% (solid until 18%, gracefully fades out by 26%)
  const phase1Opacity = scrollProgress <= 0.18 
    ? 1 
    : Math.max(0, 1 - (scrollProgress - 0.18) / 0.08);

  // Phase 2: 30% - 66% (fades in 30%-38%, solid hold 38%-58%, fades out 58%-68%)
  let phase2Opacity = 0;
  if (scrollProgress >= 0.28 && scrollProgress <= 0.68) {
    if (scrollProgress < 0.38) {
      phase2Opacity = (scrollProgress - 0.28) / 0.10;
    } else if (scrollProgress > 0.58) {
      phase2Opacity = Math.max(0, 1 - (scrollProgress - 0.58) / 0.10);
    } else {
      phase2Opacity = 1;
    }
  }

  // Phase 3: 68% - 100% Fixed Hero Lockup (fades in 68%-80%, remains firmly locked & interactable)
  const phase3Progress = Math.max(0, Math.min(1, (scrollProgress - 0.68) / 0.12));
  const isPhase3Active = scrollProgress >= 0.68;

  return (
    <section id="hero" ref={containerRef} className="relative w-full h-[100dvh] overflow-hidden bg-midnight-950">
      {/* HTML5 Canvas Background */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full object-cover pointer-events-none"
        style={{ display: 'block' }}
      />

      {/* Gentle Vignette: subtle bottom fade for smooth section transition without dark side washes */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-midnight-950/40 via-transparent to-midnight-950/15" />

      {/* PHASE 1 OVERLAY (0% - 25%): Starting Career (Lowered for clear engineer visibility) */}
      <div
        className="absolute inset-0 z-30 flex items-end pb-10 sm:pb-16 md:pb-20 lg:pb-24 justify-start px-5 sm:px-12 md:px-16 lg:px-20 xl:px-24 pointer-events-none transition-opacity duration-300"
        style={{ opacity: phase1Opacity, visibility: phase1Opacity > 0.02 ? 'visible' : 'hidden' }}
      >
        {/* Phase 1 Studio Scrim */}
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-midnight-950 via-midnight-950/80 to-transparent sm:bg-gradient-to-r sm:from-midnight-950/90 sm:via-midnight-950/40 sm:to-transparent" />

        <div className="relative z-10 max-w-md lg:max-w-lg text-left">
          {/* Eyebrow - Smoked Glass Translucent Capsule */}
          <div className="inline-flex items-center gap-2 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full bg-midnight-950/65 backdrop-blur-md border border-white/20 shadow-md mb-2 sm:mb-3.5">
            <span className="w-2 h-2 rounded-full bg-[#FF3E00] animate-pulse" />
            <span className="text-[11px] sm:text-xs md:text-sm font-bold tracking-widest text-[#FF3E00] uppercase font-mono">
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

      {/* PHASE 2 OVERLAY (35% - 65%): Practical Safety Training (Lowered for clear engineer visibility) */}
      <div
        className="absolute inset-0 z-30 flex items-end pb-10 sm:pb-16 md:pb-20 lg:pb-24 justify-start sm:justify-end px-5 sm:px-12 md:px-16 lg:px-20 xl:px-24 pointer-events-none transition-opacity duration-300"
        style={{ opacity: phase2Opacity, visibility: phase2Opacity > 0.02 ? 'visible' : 'hidden' }}
      >
        {/* Phase 2 Studio Scrim */}
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-midnight-950 via-midnight-950/80 to-transparent sm:bg-gradient-to-l sm:from-midnight-950/90 sm:via-midnight-950/40 sm:to-transparent" />

        <div className="relative z-10 max-w-md lg:max-w-lg text-left sm:text-right sm:ml-auto">
          {/* Eyebrow - Smoked Glass Translucent Capsule */}
          <div className="inline-flex items-center gap-2 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full bg-midnight-950/65 backdrop-blur-md border border-white/20 shadow-md mb-2 sm:mb-3.5">
            <span className="text-[11px] sm:text-xs md:text-sm font-bold tracking-widest text-[#FF3E00] uppercase font-mono">
              Practical Safety Training
            </span>
            <span className="w-2 h-2 rounded-full bg-[#FF3E00] animate-pulse" />
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

      {/* PHASE 3 OVERLAY (75% - 100%): Fixed Hero Lockup (Bottom on Mobile, Left-Centered on Desktop) */}
      <div
        className={`absolute inset-0 z-30 flex items-end pb-8 sm:pb-0 sm:items-center justify-start px-5 sm:px-12 md:px-16 lg:px-20 xl:px-24 transition-all duration-500 ${
          isPhase3Active ? 'pointer-events-auto' : 'pointer-events-none'
        }`}
        style={{
          opacity: phase3Progress,
          transform: `scale(${0.97 + phase3Progress * 0.03}) translateY(${(1 - phase3Progress) * 16}px)`,
          visibility: phase3Progress > 0.05 ? 'visible' : 'hidden',
        }}
      >
        {/* Phase 3 Studio Scrim - Seamless bottom-to-top on mobile, left-to-right on desktop */}
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-midnight-950 via-midnight-950/90 to-transparent sm:bg-gradient-to-r sm:from-midnight-950/95 sm:via-midnight-950/75 sm:to-transparent" />

        <div className="relative z-10 w-full max-w-xl lg:max-w-2xl text-left">
          {/* Eyebrow - Smoked Glass Translucent Capsule */}
          <div className="inline-flex items-center gap-2 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full bg-midnight-950/65 backdrop-blur-md border border-white/20 shadow-md mb-2.5 sm:mb-4">
            <span className="w-2 h-2 rounded-full bg-[#FF3E00] animate-pulse" />
            <span className="text-[11px] sm:text-xs md:text-sm font-bold tracking-widest text-[#FF3E00] uppercase font-mono">
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
