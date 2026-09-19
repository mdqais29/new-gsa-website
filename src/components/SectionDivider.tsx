import React from 'react';

interface SectionDividerProps {
  className?: string;
}

export const SectionDivider: React.FC<SectionDividerProps> = ({ 
  className = '' 
}) => {
  return (
    <div 
      className={`relative w-full flex items-center justify-center pointer-events-none select-none my-0 ${className}`}
      aria-hidden="true"
    >
      {/* Crisp Full-Span Gradient Line (Transparent -> Orange -> Transparent) */}
      <div className="relative w-full h-[1.5px] max-w-7xl mx-auto bg-gradient-to-r from-transparent via-safety-orange/90 to-transparent">
        {/* Ambient Orange Glow bleeding downwards to smoothly transition sections */}
        <div className="absolute top-[1.5px] left-0 w-full h-24 bg-gradient-to-b from-safety-orange/15 to-transparent blur-sm" />
      </div>
    </div>
  );
};

export default SectionDivider;
