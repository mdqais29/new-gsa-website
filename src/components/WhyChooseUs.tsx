import React from 'react';
import { BadgeCheck, HardHat, TrendingUp, GraduationCap } from 'lucide-react';
import { motion, Variants } from 'framer-motion';

export const WhyChooseUs: React.FC = () => {
  const cards = [
    {
      id: 'cert',
      title: 'International Certifications',
      description: 'Learning pathways aligned with NEBOSH, IOSH, and OSHA standards.',
      icon: BadgeCheck,
    },
    {
      id: 'training',
      title: 'Practical Training',
      description: 'Real-world, job-relevant learning that prepares you for site and industry demands.',
      icon: HardHat,
    },
    {
      id: 'support',
      title: 'Career Guidance & Support',
      description: 'Guidance on career planning, interviews, and the next steps after training.',
      icon: TrendingUp,
    },
    {
      id: 'faculty',
      title: 'Expert Faculty',
      description: 'Learn from mentors who understand both certification goals and workplace realities.',
      icon: GraduationCap,
    },
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
    hidden: { opacity: 0, y: 30 },
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
    <section id="why-us" className="relative py-16 sm:py-24 lg:py-32 px-4 sm:px-6 lg:px-8 bg-slate-100/80 overflow-hidden bg-industrial-grid">
      {/* Ambient background glow */}
      <div className="absolute top-1/2 -left-48 w-96 h-96 bg-safety-orange/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 -right-48 w-96 h-96 bg-safety-orange/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="text-center max-w-3xl mx-auto mb-10 sm:mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-safety-orange/10 border border-safety-orange/30 text-safety-orange font-bold text-xs tracking-wider uppercase mb-3 sm:mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-safety-orange animate-pulse" />
            <span>Why Choose Us</span>
          </div>

          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-slate-950 tracking-tight leading-tight font-display">
            Everything you need to launch a strong safety career
          </h2>
        </motion.div>

        {/* 4 Cards Grid with Staggered Motion and Hover Physics */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6"
        >
          {cards.map((item) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.id}
                variants={itemVariants}
                whileHover={{ y: -6, transition: { duration: 0.25 } }}
                className="group relative rounded-2xl sm:rounded-3xl bg-white border border-slate-300 p-5 sm:p-8 hover:shadow-2xl hover:border-safety-orange/50 transition-colors duration-300 flex flex-col justify-start shadow-lg shadow-slate-900/8"
              >
                {/* Header Row (Icon + Title on Mobile, Stacked on Desktop) */}
                <div className="flex items-center gap-3.5 mb-3 sm:mb-0 sm:block">
                  {/* Icon Container */}
                  <div className="w-11 h-11 sm:w-12 sm:h-12 flex-shrink-0 rounded-xl sm:rounded-2xl bg-orange-100/70 border border-orange-300/80 flex items-center justify-center text-safety-orange sm:mb-6 group-hover:scale-110 group-hover:bg-safety-orange group-hover:text-white group-hover:shadow-md transition-all duration-300">
                    <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>

                  {/* Title */}
                  <h3 className="text-lg sm:text-xl font-bold text-slate-950 sm:mb-3 group-hover:text-safety-orange transition-colors leading-tight">
                    {item.title}
                  </h3>
                </div>

                {/* Description */}
                <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-normal">
                  {item.description}
                </p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};
