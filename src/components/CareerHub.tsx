import React, { useState } from 'react';
import { CheckCircle, Briefcase, FileText, GraduationCap, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence, Variants } from 'framer-motion';

interface CareerHubProps {
  onOpenEnroll: (course?: string) => void;
}

export const CareerHub: React.FC<CareerHubProps> = ({ onOpenEnroll }) => {
  const [activeTab, setActiveTab] = useState<'10th-12th' | 'graduates' | 'engineers'>('10th-12th');

  const packages = {
    '10th-12th': {
      tabLabel: 'For 10th / 12th',
      packageName: 'Career Starter Package',
      tagline: 'Basic safety training to help you start a career in workplace safety.',
      certifications: ['Diploma', 'IOSH', 'OSHA'],
      eligibilitySummary: '10th pass (SSC) or 12th pass (Intermediate)',
      careerOutcome: 'Junior Safety Officer, Fire Safety Assistant, Site Supervisor',
      recommendedFor: 'For students who have passed 10th or 12th and want to learn basic safety skills.',
    },
    'graduates': {
      tabLabel: 'For Graduates',
      packageName: 'Professional Growth Package',
      tagline: 'Safety training program for degree holders wanting to work in safety.',
      certifications: ['PG Diploma', 'NEBOSH HSA', 'OSHA'],
      eligibilitySummary: 'Any degree (B.Sc, B.Com, B.A, or technical diploma)',
      careerOutcome: 'Safety Officer, Safety Inspector, Safety Assistant',
      recommendedFor: 'For college graduates who want to build a career in workplace safety.',
    },
    'engineers': {
      tabLabel: 'For Engineers',
      packageName: 'Global Career Package',
      tagline: 'Comprehensive safety training with international safety certifications.',
      certifications: ['PG Diploma', 'NEBOSH IGC', 'OSHA'],
      eligibilitySummary: 'B.Tech / B.E (Any branch) or Polytechnic Diploma',
      careerOutcome: 'Safety Engineer, Safety Supervisor, HSE Officer',
      recommendedFor: 'For engineering graduates and diploma holders seeking safety engineering jobs.',
    },
  };

  const currentPkg = packages[activeTab];

  const careerRoles = [
    'Safety Professionals',
    'HSE Auditors',
    'Safety Consultants',
    'Safety Managers',
    'Safety Engineers',
    'HSE Officers',
    'Safety Advisors',
    'Job opportunities in India and Abroad',
  ];

  const requiredDocuments = [
    'Aadhaar Card',
    'SSC Certificate',
    'Engineering / Graduation / Technical Diploma Certificates',
    'Passport Size Photo',
  ];

  const generalEligibility = [
    '10th',
    'Intermediate',
    'B.Tech',
    'Any Graduation',
    'Technical Diploma',
  ];

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 25 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 15,
      },
    },
  };

  return (
    <section id="career" className="relative py-16 sm:py-24 lg:py-32 px-4 sm:px-6 lg:px-8 bg-slate-100/80 bg-industrial-grid">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="text-center max-w-3xl mx-auto mb-10 sm:mb-14"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-safety-orange/10 border border-safety-orange/30 text-safety-orange font-bold text-xs tracking-wider uppercase mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-safety-orange animate-pulse" />
            <span>Course Packages</span>
          </div>

          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-slate-950 tracking-tight leading-tight mb-3 sm:mb-4 font-display">
            Pick the right learning path according to your background
          </h2>

          <p className="text-sm sm:text-base text-slate-800 font-normal leading-relaxed">
            Choose a learning path based on your qualification to learn practical safety skills.
          </p>
        </motion.div>

        {/* 3-Tab Filter Switcher - Responsive Grid on Mobile, Flex on Desktop */}
        <div className="flex justify-center mb-8 sm:mb-10">
          <div className="grid grid-cols-3 sm:inline-flex w-full sm:w-auto p-1 sm:p-1.5 rounded-2xl bg-white border border-slate-300 shadow-md max-w-lg sm:max-w-none">
            {(['10th-12th', 'graduates', 'engineers'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`relative px-2 sm:px-6 py-2 sm:py-3 rounded-xl text-[11px] sm:text-sm font-bold transition-all duration-300 flex items-center justify-center text-center ${
                  activeTab === tab
                    ? 'bg-gradient-to-r from-safety-orange to-orange-600 text-white shadow-md shadow-safety-orange/30'
                    : 'text-slate-800 hover:text-safety-orange hover:bg-slate-100/80'
                }`}
              >
                <span>{packages[tab].tabLabel}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Active Package Card with Animated Presence */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.5 }}
          className="mb-10 sm:mb-14 rounded-2xl sm:rounded-3xl bg-white p-5 sm:p-8 lg:p-12 border border-slate-300 shadow-2xl relative overflow-hidden"
        >
          <div className="absolute -top-20 -right-20 w-80 h-80 bg-safety-orange/10 rounded-full blur-3xl pointer-events-none" />

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 15 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -15 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center"
            >
              {/* Left Col: Package Details */}
              <div className="lg:col-span-7">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100 text-orange-950 text-xs font-mono font-bold uppercase mb-3 sm:mb-4 border border-orange-300">
                  <span>Course Details</span>
                </div>

                <h3 className="text-xl sm:text-3xl lg:text-4xl font-extrabold text-slate-950 mb-2 sm:mb-3 font-display">
                  {currentPkg.packageName}
                </h3>

                <p className="text-sm sm:text-base text-slate-800 mb-5 sm:mb-6 leading-relaxed font-normal">
                  {currentPkg.tagline}
                </p>

                {/* Certifications Included */}
                <div className="space-y-2.5 sm:space-y-3 mb-6 sm:mb-8">
                  <span className="text-[11px] sm:text-xs font-mono font-bold text-slate-600 uppercase tracking-wider block">
                    COURSES INCLUDED:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3">
                    {currentPkg.certifications.map((cert, idx) => (
                      <div
                        key={idx}
                        className="p-3 sm:p-3.5 rounded-xl sm:rounded-2xl bg-slate-50 border border-slate-300 shadow-sm flex items-center sm:flex-col sm:justify-center gap-2.5 sm:gap-0"
                      >
                        <div className="w-6 h-6 rounded-lg bg-orange-100 text-safety-orange flex items-center justify-center sm:mb-1.5 flex-shrink-0">
                          <CheckCircle className="w-4 h-4" />
                        </div>
                        <span className="text-xs font-bold text-slate-950 leading-snug">
                          {cert}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <button
                    onClick={() => onOpenEnroll(currentPkg.packageName)}
                    className="w-full sm:w-auto px-7 py-3 rounded-xl bg-gradient-to-r from-safety-orange to-orange-600 text-white text-xs sm:text-sm font-bold shadow-lg shadow-safety-orange/30 hover:shadow-glow-orange hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center justify-center gap-2"
                  >
                    <span>Inquire Now</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Right Col: Package Highlights & Job Roles */}
              <div className="lg:col-span-5 rounded-2xl bg-midnight-950 text-white p-5 sm:p-8 shadow-2xl border border-slate-700">
                <span className="text-xs font-mono font-bold text-safety-orange uppercase tracking-wider block mb-2">
                  ROLES YOU CAN WORK AS
                </span>
                <h4 className="text-base sm:text-lg font-bold text-white mb-3 sm:mb-4">
                  {currentPkg.careerOutcome}
                </h4>
                <p className="text-xs sm:text-sm text-slate-200 leading-relaxed mb-5 sm:mb-6 font-normal">
                  {currentPkg.recommendedFor}
                </p>

                <div className="pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-1 text-xs">
                  <span className="text-slate-300">Eligibility:</span>
                  <span className="font-semibold text-safety-orange">{currentPkg.eligibilitySummary}</span>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </motion.div>

        {/* Accompanying Cards: Opportunities, Documents & Eligibility with Stagger */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6"
        >
          {/* Card 1: Career Opportunities */}
          <motion.div
            variants={itemVariants}
            whileHover={{ y: -6, transition: { duration: 0.25 } }}
            className="rounded-2xl sm:rounded-3xl bg-white p-5 sm:p-8 border border-slate-300 shadow-lg shadow-slate-900/8 hover:shadow-2xl hover:border-safety-orange/50 transition-colors duration-300"
          >
            <div className="flex items-center gap-3 mb-5 sm:mb-6">
              <div className="w-10 h-10 rounded-xl bg-orange-100/80 text-safety-orange flex items-center justify-center">
                <Briefcase className="w-5 h-5" />
              </div>
              <h4 className="text-base sm:text-lg font-bold text-slate-950">
                Career Opportunities
              </h4>
            </div>

            <ul className="space-y-2.5">
              {careerRoles.map((role, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-800">
                  <span className="w-1.5 h-1.5 rounded-full bg-safety-orange mt-1.5 flex-shrink-0" />
                  <span className={idx === careerRoles.length - 1 ? "font-bold text-safety-orange" : ""}>
                    {role}
                  </span>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Card 2: Documents Required */}
          <motion.div
            variants={itemVariants}
            whileHover={{ y: -6, transition: { duration: 0.25 } }}
            className="rounded-2xl sm:rounded-3xl bg-white p-5 sm:p-8 border border-slate-300 shadow-lg shadow-slate-900/8 hover:shadow-2xl hover:border-safety-orange/50 transition-colors duration-300"
          >
            <div className="flex items-center gap-3 mb-5 sm:mb-6">
              <div className="w-10 h-10 rounded-xl bg-orange-100/80 text-safety-orange flex items-center justify-center">
                <FileText className="w-5 h-5" />
              </div>
              <h4 className="text-base sm:text-lg font-bold text-slate-950">
                Documents Required
              </h4>
            </div>

            <ul className="space-y-3">
              {requiredDocuments.map((doc, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-800">
                  <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span>{doc}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Card 3: Eligibility */}
          <motion.div
            variants={itemVariants}
            whileHover={{ y: -6, transition: { duration: 0.25 } }}
            className="rounded-2xl sm:rounded-3xl bg-white p-5 sm:p-8 border border-slate-300 shadow-lg shadow-slate-900/8 hover:shadow-2xl hover:border-safety-orange/50 transition-colors duration-300"
          >
            <div className="flex items-center gap-3 mb-5 sm:mb-6">
              <div className="w-10 h-10 rounded-xl bg-blue-100/80 text-blue-600 flex items-center justify-center">
                <GraduationCap className="w-5 h-5" />
              </div>
              <h4 className="text-base sm:text-lg font-bold text-slate-950">
                Eligibility
              </h4>
            </div>

            <ul className="space-y-3">
              {generalEligibility.map((elig, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-800">
                  <CheckCircle className="w-4 h-4 text-safety-orange flex-shrink-0 mt-0.5" />
                  <span>{elig}</span>
                </li>
              ))}
            </ul>

            <div className="mt-6 pt-4 border-t border-slate-200/80">
              <p className="text-xs text-slate-700 font-medium">
                No prior safety experience is needed to join.
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default CareerHub;
