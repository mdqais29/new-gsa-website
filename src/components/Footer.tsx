import React from 'react';
import { Phone, Mail, MapPin, Globe, User, ArrowUp } from 'lucide-react';

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

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
    }
  };

  const quickLinks = [
    { name: 'Home', href: '#hero' },
    { name: 'Courses', href: '#courses' },
    { name: 'Why Us', href: '#why-us' },
    { name: 'Career Pathways', href: '#career' },
    { name: 'About Us', href: '#about' },
  ];

  const popularCourses = [
    'Diploma in Fire & Safety',
    'Industrial Safety',
    'Construction Safety',
    'Advanced Diploma in OHS',
    'NEBOSH IGC & HSA',
    'IOSH Managing Safely',
    'OSHA 30-Hour Certification',
  ];

  return (
    <footer className="relative bg-midnight-950 text-slate-300 pt-16 pb-12 border-t border-slate-800/90 overflow-hidden">
      {/* Background Dots & Ambient Glows */}
      <div className="absolute inset-0 bg-dots-dark opacity-40 pointer-events-none" />
      <div className="absolute -top-32 left-1/4 w-[500px] h-[500px] bg-safety-orange/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 right-1/4 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 pb-12 border-b border-white/10">
          {/* Col 1: Brand Statement (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="inline-flex items-center px-4 sm:px-5 py-2.5 sm:py-3 rounded-2xl bg-white/95 backdrop-blur-md shadow-2xl shadow-black/40 border border-white/40">
              <img
                src="/assets/gsa-logo-horizontal.png"
                alt="Global Safety Academy"
                className="h-10 sm:h-12 w-auto object-contain"
              />
            </div>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Global Safety Academy helps students build confident careers in industrial, construction, and occupational safety through practical training and globally recognized certifications.
            </p>
          </div>

          {/* Col 2 & 3: Popular Courses & Quick Links Side-by-Side */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-6 sm:gap-8 lg:col-span-5">
            {/* Popular Courses */}
            <div className="sm:col-span-3">
              <h4 className="text-xs font-mono font-bold text-white uppercase tracking-wider mb-4">
                Popular Courses
              </h4>
              <ul className="space-y-2 text-xs text-slate-300">
                {popularCourses.map((course, idx) => (
                  <li key={idx} className="hover:text-white transition-colors">
                    • {course}
                  </li>
                ))}
              </ul>
            </div>

            {/* Quick Links */}
            <div className="sm:col-span-2">
              <h4 className="text-xs font-mono font-bold text-white uppercase tracking-wider mb-4">
                Quick Links
              </h4>
              <ul className="space-y-2.5 text-xs sm:text-sm">
                {quickLinks.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      onClick={(e) => handleNavClick(e, link.href)}
                      className="text-slate-300 hover:text-safety-orange transition-colors inline-block"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Col 4: Contact Info (3 cols) */}
          <div className="lg:col-span-3 rounded-2xl bg-white/[0.04] backdrop-blur-xl border border-white/[0.08] p-5 shadow-xl shadow-black/20">
            <h4 className="text-xs font-mono font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-safety-orange" />
              <span>Academy Contact</span>
            </h4>
            <ul className="space-y-3 text-xs">
              <li className="flex items-start gap-2.5">
                <User className="w-4 h-4 text-safety-orange flex-shrink-0 mt-0.5" />
                <div>
                  <span className="text-slate-400 block text-[11px]">Contact Person:</span>
                  <strong className="text-white font-medium">Md. Riyazuddin</strong>
                </div>
              </li>

              <li className="flex items-start gap-2.5">
                <Phone className="w-4 h-4 text-safety-orange flex-shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <a href="tel:+919381740025" className="hover:text-safety-orange block text-white font-medium">
                    +91 93817 40025
                  </a>
                  <a href="tel:+919959340025" className="hover:text-safety-orange block text-slate-300">
                    +91 99593 40025
                  </a>
                </div>
              </li>

              <li className="flex items-start gap-2.5">
                <Mail className="w-4 h-4 text-safety-orange flex-shrink-0 mt-0.5" />
                <a href="mailto:info@globalsafetyacademy.com" className="hover:text-safety-orange text-slate-200">
                  info@globalsafetyacademy.com
                </a>
              </li>

              <li className="flex items-start gap-2.5">
                <Globe className="w-4 h-4 text-safety-orange flex-shrink-0 mt-0.5" />
                <a href="https://www.globalsafetyacademy.com" target="_blank" rel="noreferrer" className="hover:text-safety-orange text-slate-200">
                  www.globalsafetyacademy.com
                </a>
              </li>

              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-safety-orange flex-shrink-0 mt-0.5" />
                <address className="not-italic text-slate-300 leading-relaxed">
                  Shop 96, 97, 2nd Floor, LPT Market, Hyd Road, Nalgonda, Telangana 508001
                </address>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar & Copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>© 2026 Global Safety Academy. All rights reserved.</p>

          <div className="flex items-center gap-4">
            <div className="inline-flex items-center px-3.5 py-1.5 rounded-xl bg-white/95 backdrop-blur-md shadow-md border border-white/40">
              <img
                src="/assets/msme-govt-india.png"
                alt="Ministry of MSME, Govt. of India"
                className="h-7 sm:h-8 w-auto object-contain"
              />
            </div>

            <button
              onClick={scrollToTop}
              className="p-2.5 rounded-xl bg-white/[0.08] backdrop-blur-md hover:bg-safety-orange text-slate-300 hover:text-white border border-white/10 hover:border-safety-orange/50 transition-all shadow-lg hover:-translate-y-0.5 active:translate-y-0"
              aria-label="Scroll to top"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
