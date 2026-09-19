import React, { useState } from 'react';
import { useLenis } from './hooks/useLenis';
import { Navbar } from './components/Navbar';
import { HeroCanvas } from './components/HeroCanvas';
import { WhyChooseUs } from './components/WhyChooseUs';
import { CoreCourses } from './components/CoreCourses';
import { Certifications } from './components/Certifications';
import { CareerHub } from './components/CareerHub';
import { AboutFieldProof } from './components/AboutFieldProof';
import { ClosingCTA } from './components/ClosingCTA';
import { Footer } from './components/Footer';
import { EnrollModal } from './components/EnrollModal';
import { SectionDivider } from './components/SectionDivider';

export const App: React.FC = () => {
  // Initialize Lenis kinetic smooth scrolling integrated with GSAP ScrollTrigger
  useLenis();

  const [enrollModalOpen, setEnrollModalOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<string | undefined>(undefined);

  const handleOpenEnroll = (course?: string) => {
    setSelectedCourse(course);
    setEnrollModalOpen(true);
  };

  const handleCloseEnroll = () => {
    setEnrollModalOpen(false);
    setSelectedCourse(undefined);
  };

  return (
    <div className="min-h-screen bg-slate-100 text-midnight-900 font-sans selection:bg-safety-orange selection:text-white relative">
      {/* Floating Glass Navigation Bar */}
      <Navbar onOpenEnroll={handleOpenEnroll} />

      {/* 1. Cinematic Hero Section (Pinned 300vh Canvas Frame-Scrub) */}
      <HeroCanvas onOpenEnroll={handleOpenEnroll} />

      {/* Orange Section Divider Line */}
      <SectionDivider />

      {/* 2. Why Choose Us Section (Glassmorphic Bento Grid) */}
      <WhyChooseUs />

      {/* Orange Section Divider Line */}
      <SectionDivider />

      {/* 3. Core Courses Section (Visual Cards with Depth) */}
      <CoreCourses onOpenEnroll={handleOpenEnroll} />

      {/* Orange Section Divider Line */}
      <SectionDivider />

      {/* 4. Globally Respected Certifications (NEBOSH, IOSH, OSHA) */}
      <Certifications />

      {/* Orange Section Divider Line */}
      <SectionDivider />

      {/* 5. Interactive Career Pathway & Eligibility Hub (3-Tab Switcher) */}
      <CareerHub onOpenEnroll={handleOpenEnroll} />

      {/* Orange Section Divider Line */}
      <SectionDivider />

      {/* 6. About Us & Field Proof (Industrial Gallery) */}
      <AboutFieldProof />

      {/* Orange Section Divider Line */}
      <SectionDivider />

      {/* 7. High-Impact Closing CTA */}
      <ClosingCTA onOpenEnroll={handleOpenEnroll} />

      {/* Orange Section Divider Line */}
      <SectionDivider />

      {/* 8. Comprehensive Midnight Navy Footer */}
      <Footer />

      {/* Interactive Quick Enroll / Admission Modal */}
      <EnrollModal
        isOpen={enrollModalOpen}
        onClose={handleCloseEnroll}
        defaultCourse={selectedCourse}
      />
    </div>
  );
};

export default App;
