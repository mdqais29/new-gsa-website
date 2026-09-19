import React, { useState } from 'react';
import { Menu, X, ArrowRight, Phone } from 'lucide-react';

interface NavbarProps {
  onOpenEnroll: (course?: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenEnroll }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith('#')) {
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        const headerOffset = 80;
        const elementPosition = target.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
      setMobileMenuOpen(false);
    }
  };

  const navLinks = [
    { name: 'Home', href: '#hero' },
    { name: 'Courses', href: '#courses' },
    { name: 'Why Us', href: '#why-us' },
    { name: 'Career', href: '#career' },
    { name: 'About', href: '#about' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-4 sm:px-6 lg:px-8 py-3.5 sm:py-4 transition-all duration-500 pointer-events-none">
      {/* 1. PC / DESKTOP VERSION: Unified Continuous White Navbar */}
      <div className="hidden sm:flex mx-auto items-center justify-between transition-all duration-500 pointer-events-auto max-w-5xl rounded-full bg-white border border-slate-300 shadow-2xl shadow-slate-950/20 px-4 sm:px-6 py-2 sm:py-2.5">
        {/* Left: Brand Identity */}
        <a
          href="#hero"
          className="flex items-center flex-shrink-0"
        >
          <img
            src="/assets/gsa-logo-horizontal.png"
            alt="Global Safety Academy"
            className="h-9 sm:h-10 md:h-11 w-auto object-contain"
          />
        </a>

        {/* Center: Navigation Links */}
        <nav className="flex items-center gap-1 lg:gap-2">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={(e) => handleNavClick(e, link.href)}
              className="text-xs lg:text-sm font-bold transition-all duration-200 tracking-wide px-3.5 py-1.5 rounded-full text-slate-950 hover:text-safety-orange hover:bg-orange-50"
            >
              {link.name}
            </a>
          ))}
        </nav>

        {/* Right: Standalone CTA Button */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => onOpenEnroll()}
            className="group flex items-center gap-2 rounded-full font-extrabold text-xs sm:text-sm transition-all duration-200 px-6 py-2.5 bg-gradient-to-r from-safety-orange to-orange-600 text-white hover:brightness-105 hover:-translate-y-0.5 active:translate-y-0 shadow-md shadow-orange-500/20"
          >
            <span>Contact Us</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </div>

      {/* 2. MOBILE VERSION: Modern Split Modular Islands */}
      <div className="sm:hidden flex items-center justify-between">
        {/* Left Island: Brand Logo Pod */}
        <a
          href="#hero"
          className="pointer-events-auto flex items-center flex-shrink-0 rounded-full bg-white border border-slate-300 shadow-xl shadow-slate-950/15 px-3.5 py-1.5 active:scale-95 transition-all"
        >
          <img
            src="/assets/gsa-logo-horizontal.png"
            alt="Global Safety Academy"
            className="h-8 w-auto object-contain"
          />
        </a>

        {/* Right Island: Standalone Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="pointer-events-auto w-11 h-11 rounded-full bg-white border border-slate-300 shadow-xl shadow-slate-950/15 flex items-center justify-center text-slate-950 hover:text-safety-orange active:scale-95 transition-all"
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Drawer Dropdown */}
      {mobileMenuOpen && (
        <div
          className="pointer-events-auto sm:hidden mt-3 max-w-md mx-auto rounded-3xl p-5 shadow-2xl bg-white border border-slate-300 text-slate-950 animate-in fade-in slide-in-from-top-3 duration-200"
        >
          <nav className="flex flex-col gap-2">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className="px-4 py-2.5 text-sm font-bold rounded-xl transition-all text-slate-950 hover:text-safety-orange hover:bg-orange-50"
              >
                {link.name}
              </a>
            ))}
            <div className="pt-3 mt-2 border-t border-slate-200 flex flex-col gap-2.5">
              <a
                href="tel:+919381740025"
                className="flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-xl border text-slate-900 bg-slate-100 border-slate-300"
              >
                <Phone className="w-3.5 h-3.5 text-safety-orange" />
                <span>Call +91 93817 40025</span>
              </a>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenEnroll();
                }}
                className="w-full py-3 rounded-full bg-safety-orange hover:bg-orange-600 text-white text-xs font-bold shadow-lg flex items-center justify-center gap-2"
              >
                <span>Contact Us / Inquiry</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};
