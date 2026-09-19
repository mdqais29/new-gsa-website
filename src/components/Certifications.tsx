import React from 'react';
import { Award } from 'lucide-react';
import { motion, Variants } from 'framer-motion';

export const Certifications: React.FC = () => {
  const certifications = [
    {
      id: 'iosh',
      country: 'UK',
      name: 'IOSH',
      description: 'Ideal for building practical workplace safety management capability.',
    },
    {
      id: 'osha',
      country: 'USA',
      name: 'OSHA',
      description: 'Strengthen your understanding of occupational safety requirements and best practices.',
    },
    {
      id: 'nebosh',
      country: 'UK',
      name: 'NEBOSH',
      description: 'Recognized by employers worldwide for health and safety excellence.',
    },
  ];

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.14,
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
    <section className="relative py-16 sm:py-24 lg:py-32 px-4 sm:px-6 lg:px-8 bg-slate-100/80 bg-industrial-grid">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="text-center max-w-3xl mx-auto mb-10 sm:mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-safety-orange/10 border border-safety-orange/30 text-safety-orange font-bold text-xs tracking-wider uppercase mb-3 sm:mb-4">
            <Award className="w-3.5 h-3.5" />
            <span>Certifications</span>
          </div>

          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-slate-950 tracking-tight leading-tight font-display">
            Globally respected credentials that open doors
          </h2>
        </motion.div>

        {/* 3 Credential Cards Grid with Motion */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 lg:gap-8"
        >
          {certifications.map((cert) => (
            <motion.div
              key={cert.id}
              variants={itemVariants}
              whileHover={{ y: -6, transition: { duration: 0.25 } }}
              className="group relative rounded-2xl sm:rounded-3xl bg-white border border-slate-300 shadow-lg shadow-slate-900/8 p-5 sm:p-8 hover:shadow-2xl hover:border-safety-orange/50 transition-colors duration-300 flex flex-col justify-start"
            >
              {/* Country Badge */}
              <div className="mb-4 sm:mb-5">
                <span className="inline-flex items-center justify-center px-3 py-1 rounded-full text-xs font-mono font-bold bg-orange-100 text-safety-orange border border-orange-300/80">
                  {cert.country}
                </span>
              </div>

              {/* Certification Name */}
              <h3 className="text-xl sm:text-2xl font-bold text-slate-950 mb-2 sm:mb-3 group-hover:text-safety-orange transition-colors">
                {cert.name}
              </h3>

              {/* Exact Description */}
              <p className="text-xs sm:text-base text-slate-800 leading-relaxed font-normal">
                {cert.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Certifications;
