import React from 'react';
import { HardHat, Flame, Building2, Compass, GraduationCap } from 'lucide-react';
import { motion } from 'framer-motion';

export const AboutFieldProof: React.FC = () => {
  return (
    <section id="about" className="relative py-16 sm:py-24 lg:py-32 px-4 sm:px-6 lg:px-8 bg-slate-100/80 bg-industrial-grid overflow-hidden">
      <div className="max-w-7xl mx-auto">
        {/* ABOUT US & FIELD EXPERTISE */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch">
          
          {/* Left Column: Vision & Philosophy */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-5 flex flex-col justify-center space-y-6"
          >
            <div className="max-w-lg">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-safety-orange/10 border border-safety-orange/30 text-safety-orange font-bold text-xs tracking-wider uppercase mb-4 sm:mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-safety-orange animate-pulse" />
                <span>About Us</span>
              </div>

              <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-slate-950 tracking-tight leading-[1.15] mb-3 font-display">
                Train Smart. Work Safe. <br />
                <span className="text-[#FF3E00]">
                  Succeed Globally.
                </span>
              </h2>

              <p className="text-xs sm:text-base text-slate-700 leading-relaxed font-normal">
                Global Safety Academy builds skilled safety professionals through practical training and globally recognized certifications, preparing them for successful safety careers.
              </p>
            </div>

            {/* 3 Modern Stacked Pillar Cards */}
            <div className="space-y-2.5 sm:space-y-3">
              {/* Card 1: Industrial Safety */}
              <motion.div
                whileHover={{ y: -3, x: 2, transition: { duration: 0.2 } }}
                className="group relative p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-white border border-slate-200/90 shadow-sm hover:shadow-md hover:border-safety-orange/40 transition-colors duration-300 flex items-center justify-between gap-3 sm:gap-4"
              >
                <div className="flex items-center gap-3 sm:gap-3.5">
                  <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-orange-500/10 text-safety-orange border border-orange-200 flex items-center justify-center flex-shrink-0 group-hover:bg-safety-orange group-hover:text-white transition-colors duration-300">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm sm:text-base font-bold text-slate-950 group-hover:text-safety-orange transition-colors duration-300">
                      Industrial Safety
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-600 leading-snug">
                      Industry-focused training for modern workplace risks
                    </p>
                  </div>
                </div>
                <div className="hidden sm:flex items-center justify-center w-7 h-7 rounded-full bg-slate-50 text-slate-400 group-hover:bg-orange-50 group-hover:text-safety-orange group-hover:translate-x-0.5 transition-all flex-shrink-0 border border-slate-100 group-hover:border-orange-200">
                  <span className="text-xs font-bold">01</span>
                </div>
              </motion.div>

              {/* Card 2: Construction Safety */}
              <motion.div
                whileHover={{ y: -3, x: 2, transition: { duration: 0.2 } }}
                className="group relative p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-white border border-slate-200/90 shadow-sm hover:shadow-md hover:border-safety-orange/40 transition-colors duration-300 flex items-center justify-between gap-3 sm:gap-4"
              >
                <div className="flex items-center gap-3 sm:gap-3.5">
                  <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-amber-500/10 text-amber-600 border border-amber-200 flex items-center justify-center flex-shrink-0 group-hover:bg-amber-600 group-hover:text-white transition-colors duration-300">
                    <HardHat className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm sm:text-base font-bold text-slate-950 group-hover:text-safety-orange transition-colors duration-300">
                      Construction Safety
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-600 leading-snug">
                      Site-oriented learning for field roles and compliance
                    </p>
                  </div>
                </div>
                <div className="hidden sm:flex items-center justify-center w-7 h-7 rounded-full bg-slate-50 text-slate-400 group-hover:bg-amber-50 group-hover:text-amber-600 group-hover:translate-x-0.5 transition-all flex-shrink-0 border border-slate-100 group-hover:border-amber-200">
                  <span className="text-xs font-bold">02</span>
                </div>
              </motion.div>

              {/* Card 3: Fire Safety */}
              <motion.div
                whileHover={{ y: -3, x: 2, transition: { duration: 0.2 } }}
                className="group relative p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-white border border-slate-200/90 shadow-sm hover:shadow-md hover:border-safety-orange/40 transition-colors duration-300 flex items-center justify-between gap-3 sm:gap-4"
              >
                <div className="flex items-center gap-3 sm:gap-3.5">
                  <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-rose-500/10 text-rose-600 border border-rose-200 flex items-center justify-center flex-shrink-0 group-hover:bg-rose-600 group-hover:text-white transition-colors duration-300">
                    <Flame className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm sm:text-base font-bold text-slate-950 group-hover:text-safety-orange transition-colors duration-300">
                      Fire Safety
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-600 leading-snug">
                      Emergency readiness, prevention, and response basics
                    </p>
                  </div>
                </div>
                <div className="hidden sm:flex items-center justify-center w-7 h-7 rounded-full bg-slate-50 text-slate-400 group-hover:bg-rose-50 group-hover:text-rose-600 group-hover:translate-x-0.5 transition-all flex-shrink-0 border border-slate-100 group-hover:border-rose-200">
                  <span className="text-xs font-bold">03</span>
                </div>
              </motion.div>
            </div>

            {/* 2 Bottom Support Cards (Field Training & Career Support) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-3.5">
              <motion.div
                whileHover={{ y: -3, transition: { duration: 0.2 } }}
                className="group rounded-xl sm:rounded-2xl bg-white border border-slate-200/90 p-3.5 sm:p-4 shadow-sm hover:shadow-md hover:border-safety-orange/40 transition-colors duration-300 flex items-start gap-3"
              >
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center flex-shrink-0 border border-blue-200 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                  <Compass className="w-5 h-5" />
                </div>
                <div>
                  <h5 className="text-sm font-bold text-slate-950 mb-1 group-hover:text-safety-orange transition-colors duration-300">
                    Field Training
                  </h5>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Hands-on sessions with real workplace context
                  </p>
                </div>
              </motion.div>

              <motion.div
                whileHover={{ y: -3, transition: { duration: 0.2 } }}
                className="group rounded-xl sm:rounded-2xl bg-white border border-slate-200/90 p-3.5 sm:p-4 shadow-sm hover:shadow-md hover:border-safety-orange/40 transition-colors duration-300 flex items-start gap-3"
              >
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center flex-shrink-0 border border-emerald-200 group-hover:bg-emerald-600 group-hover:text-white transition-colors duration-300">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <div>
                  <h5 className="text-sm font-bold text-slate-950 mb-1 group-hover:text-safety-orange transition-colors duration-300">
                    Career Support
                  </h5>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Guidance from admission to job direction
                  </p>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Right Column: Real Photos Collage Dedicated Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
            className="lg:col-span-6 flex flex-col h-full"
          >
            <div className="rounded-2xl sm:rounded-3xl bg-white border border-slate-200/90 shadow-lg shadow-slate-900/5 p-4 sm:p-6 h-full flex flex-col justify-between">
              <div className="flex items-center gap-2 mb-3 sm:mb-4">
                <span className="w-2 h-2 rounded-full bg-safety-orange animate-pulse" />
                <h4 className="text-xs sm:text-sm font-bold text-slate-900 tracking-wide font-display">
                  Our Expertise on Field
                </h4>
              </div>

              {/* Single Master Field Expertise Collage Image */}
              <div className="relative flex-1 w-full rounded-xl sm:rounded-2xl overflow-hidden border border-slate-200/80 bg-slate-50 min-h-[240px] sm:min-h-[380px] flex items-center justify-center">
                <img
                  src="/assets/field_expertise_collage.jpg"
                  alt="Global Safety Academy - Field Training and Expertise"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutFieldProof;
