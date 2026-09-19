import React from 'react';
import { motion, Variants } from 'framer-motion';

interface CoreCoursesProps {
  onOpenEnroll: (course?: string) => void;
}

export const CoreCourses: React.FC<CoreCoursesProps> = ({ onOpenEnroll }) => {
  const courses = [
    {
      id: 'fire-safety',
      title: 'Diploma in Fire & Safety',
      description: 'Build a strong foundation in hazard prevention, fire systems, and workplace safety essentials.',
      image: '/assets/course_fire_safety.jpg',
    },
    {
      id: 'industrial-safety',
      title: 'Industrial Safety',
      description: 'Learn industrial risk management, compliance practices, and shop-floor safety operations.',
      image: '/assets/course_industrial_safety.jpg',
    },
    {
      id: 'construction-safety',
      title: 'Construction Safety',
      description: 'Prepare for site-based safety leadership with construction-focused procedures and controls.',
      image: '/assets/course_construction_safety.jpg',
    },
    {
      id: 'international-cert',
      title: 'NEBOSH, IOSH & OSHA Certifications',
      description: 'Gain recognized certifications that strengthen your profile for safety roles in India and abroad.',
      image: '/assets/course_international_cert.jpg',
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
    <section id="courses" className="relative py-16 sm:py-24 lg:py-32 px-4 sm:px-6 lg:px-8 bg-slate-100/80 bg-industrial-grid">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-3xl mb-10 sm:mb-14"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-safety-orange/10 border border-safety-orange/30 text-safety-orange font-bold text-xs tracking-wider uppercase mb-3 sm:mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-safety-orange animate-pulse" />
            <span>Courses</span>
          </div>

          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-slate-950 tracking-tight leading-tight font-display">
            Choose a program that matches your ambition
          </h2>
        </motion.div>

        {/* 4 Course Cards Grid - Clean, Icon-free & Button-free with Motion */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6"
        >
          {courses.map((course) => (
            <motion.div
              key={course.id}
              variants={itemVariants}
              whileHover={{ y: -6, transition: { duration: 0.25 } }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onOpenEnroll(course.title)}
              className="group relative rounded-2xl sm:rounded-3xl bg-white border border-slate-300 p-4 sm:p-6 hover:shadow-2xl hover:border-safety-orange/50 transition-colors duration-300 flex flex-col justify-start shadow-lg shadow-slate-900/8 cursor-pointer"
            >
              {/* Top AI-Generated Course Image */}
              <div className="relative w-full aspect-[4/3] rounded-xl sm:rounded-2xl overflow-hidden mb-4 sm:mb-5 bg-slate-100 border border-slate-200/80 shadow-sm">
                <img
                  src={course.image}
                  alt={course.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/assets/hero_safety_bg.jpg';
                  }}
                />
              </div>

              {/* Course Title */}
              <h3 className="text-lg sm:text-xl font-bold text-safety-orange mb-2 sm:mb-3 leading-snug group-hover:opacity-90 transition-opacity">
                {course.title}
              </h3>

              {/* Course Description */}
              <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-normal">
                {course.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
