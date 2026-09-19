import React from 'react';
import { ArrowRight, Phone, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';

interface ClosingCTAProps {
  onOpenEnroll: (course?: string) => void;
}

export const ClosingCTA: React.FC<ClosingCTAProps> = ({ onOpenEnroll }) => {
  return (
    <section className="relative py-12 sm:py-20 px-4 sm:px-6 lg:px-8 bg-slate-100/80 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        {/* Midnight Navy High-Contrast Container with Motion */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 20 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="relative rounded-2xl sm:rounded-3xl bg-midnight-950 border border-slate-700 p-6 sm:p-12 lg:p-16 text-center overflow-hidden shadow-2xl"
        >
          {/* Radial Ambient Orange/Amber Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-safety-orange/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute inset-0 bg-industrial-grid-dark opacity-30 pointer-events-none" />

          <div className="relative z-10 max-w-3xl mx-auto">
            {/* Live Indicator Pill */}
            <div className="inline-flex items-center gap-2 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full bg-midnight-950/65 backdrop-blur-md border border-white/20 shadow-md text-[#FF3E00] text-[11px] sm:text-xs md:text-sm font-mono font-bold tracking-widest uppercase mb-4 sm:mb-6">
              <span className="w-2 h-2 rounded-full bg-[#FF3E00] animate-pulse" />
              <span>Next Batch Starting Soon</span>
            </div>

            {/* Headline */}
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight mb-4 sm:mb-6 font-display">
              Get trained for globally valued safety careers.
            </h2>

            <p className="text-xs sm:text-base md:text-lg text-slate-200 font-normal leading-relaxed mb-6 sm:mb-10 max-w-2xl mx-auto">
              Enroll today in our certified diploma & international programs. Transform your career prospects with industry-accredited certifications and field mastery.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 sm:gap-4">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onOpenEnroll()}
                className="w-full sm:w-auto px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl bg-gradient-to-r from-safety-orange to-orange-600 text-white font-bold text-xs sm:text-sm md:text-base shadow-xl shadow-safety-orange/40 hover:shadow-glow-orange transition-all flex items-center justify-center gap-2 group"
              >
                <span>Enroll Now</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </motion.button>

              <motion.a
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                href="tel:+919381740025"
                className="w-full sm:w-auto px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm md:text-base border border-white/30 shadow-lg transition-all flex items-center justify-center gap-2.5 backdrop-blur-md"
              >
                <Phone className="w-4 h-4 text-safety-orange" />
                <span>Call Now (+91 93817 40025)</span>
              </motion.a>
            </div>

            {/* Guarantee Note */}
            <div className="mt-6 sm:mt-8 flex items-center justify-center gap-2 text-[11px] sm:text-xs text-slate-300 font-mono text-center">
              <ShieldCheck className="w-4 h-4 text-safety-orange flex-shrink-0" />
              <span>Free Career Counseling & Immediate Eligibility Assessment</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
