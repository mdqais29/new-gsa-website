import React from 'react';

interface SectionDividerProps {
  className?: string;
}

export const SectionDivider: React.FC<SectionDividerProps> = ({ 
  className = '' 
}) => {
  return (
    <div 
      className={`relative w-full flex items-center justify-center pointer-events-none select-none my-0 overflow-hidden ${className}`}
      aria-hidden="true"
    >
      {/* Crisp Full-Span Gradient Line (Transparent -> Orange -> Transparent) */}
      <div className="w-full h-[1.5px] max-w-7xl mx-auto bg-gradient-to-r from-transparent via-safety-orange/90 to-transparent" />
    </div>
  );
};

export default SectionDivider;
