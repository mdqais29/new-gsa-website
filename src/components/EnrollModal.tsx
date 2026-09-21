import React, { useState } from 'react';
import { X, Phone, MessageSquare, CheckCircle, Mail, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';

interface EnrollModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultCourse?: string;
}

export const EnrollModal: React.FC<EnrollModalProps> = ({
  isOpen,
  onClose,
  defaultCourse = 'Diploma in Fire & Safety',
}) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    course: defaultCourse,
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);

    // Trigger celebration confetti
    try {
      confetti({
        particleCount: 75,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#FF3E00', '#FF7A00', '#10B981', '#3B82F6'],
      });
    } catch {
      // safe fallback
    }

    // WhatsApp auto-redirect trigger with pre-filled message
    const waText = encodeURIComponent(
      `Hello Global Safety Academy,\nI have an inquiry regarding courses & admissions:\n• Name: ${formData.name}\n• Phone: ${formData.phone}${formData.email ? `\n• Email: ${formData.email}` : ''}\n• Program/Subject: ${formData.course}${formData.message ? `\n• Message: ${formData.message}` : ''}`
    );
    window.open(`https://wa.me/919381740025?text=${waText}`, '_blank');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-midnight-950/80 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 15 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-lg rounded-3xl bg-white p-6 sm:p-8 border border-slate-200 shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto z-10"
          >
            {/* Ambient Top Glow */}
            <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-64 h-64 bg-safety-orange/15 rounded-full blur-3xl pointer-events-none" />

            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            {!submitted ? (
              <div>
                <div className="mb-5">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-safety-orange/10 text-safety-orange text-xs font-mono font-bold uppercase mb-2">
                    <Mail className="w-3.5 h-3.5" />
                    <span>Contact Us • Admissions 2026</span>
                  </div>
                  <h3 className="text-2xl font-extrabold text-midnight-950 font-display">
                    Get in Touch with Us
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 mt-1">
                    Have questions regarding syllabus, eligibility, or fees? Send an inquiry and our team will get back to you promptly.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-3.5">
                  <div>
                    <label className="block text-xs font-bold text-midnight-950 uppercase tracking-wider mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Your Name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-sm text-midnight-950 placeholder:text-slate-400 focus:outline-none focus:border-safety-orange focus:bg-white focus:ring-2 focus:ring-safety-orange/20 transition-all"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="block text-xs font-bold text-midnight-950 uppercase tracking-wider mb-1">
                        Phone / WhatsApp *
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="+91 98765 43210"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-sm text-midnight-950 placeholder:text-slate-400 focus:outline-none focus:border-safety-orange focus:bg-white focus:ring-2 focus:ring-safety-orange/20 transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-midnight-950 uppercase tracking-wider mb-1">
                        Email Address
                      </label>
                      <input
                        type="email"
                        placeholder="name@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-sm text-midnight-950 placeholder:text-slate-400 focus:outline-none focus:border-safety-orange focus:bg-white focus:ring-2 focus:ring-safety-orange/20 transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-midnight-950 uppercase tracking-wider mb-1">
                      Program or Inquiry Subject *
                    </label>
                    <select
                      value={formData.course}
                      onChange={(e) => setFormData({ ...formData, course: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-sm text-midnight-950 focus:outline-none focus:border-safety-orange focus:bg-white focus:ring-2 focus:ring-safety-orange/20"
                    >
                      <option value="Diploma in Fire & Safety">Diploma in Fire & Safety (1 Year)</option>
                      <option value="Advanced Diploma in Construction Safety">Advanced Diploma in Construction Safety</option>
                      <option value="IOSH & OSHA International">IOSH & OSHA International</option>
                      <option value="Industrial Safety Management">Industrial Safety Management</option>
                      <option value="Construction Site Safety">Construction Site Safety</option>
                      <option value="Fast-Track Safety Certification">Fast-Track Safety Certification</option>
                      <option value="General Admission & Fee Inquiry">General Admission & Fee Inquiry</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-midnight-950 uppercase tracking-wider mb-1">
                      Your Message / Query (Optional)
                    </label>
                    <textarea
                      rows={2}
                      placeholder="Ask about batch timings, fees, or course details..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-sm text-midnight-950 placeholder:text-slate-400 focus:outline-none focus:border-safety-orange focus:bg-white focus:ring-2 focus:ring-safety-orange/20 transition-all resize-none"
                    />
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    className="w-full mt-2 py-3.5 px-6 rounded-xl bg-gradient-to-r from-safety-orange to-orange-600 text-white font-extrabold text-sm shadow-lg shadow-safety-orange/30 hover:brightness-105 transition-all flex items-center justify-center gap-2"
                  >
                    <span>Submit Inquiry</span>
                    <Send className="w-4 h-4" />
                  </motion.button>
                </form>

                <div className="mt-4 pt-3.5 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-600">
                  <div className="flex items-center gap-1.5">
                    <span>Direct Hotline:</span>
                    <a href="tel:+919381740025" className="font-bold text-safety-orange hover:underline flex items-center gap-1">
                      <Phone className="w-3 h-3" />
                      <span>+91 93817 40025</span>
                    </a>
                  </div>
                  <a
                    href="https://wa.me/919381740025"
                    target="_blank"
                    rel="noreferrer"
                    className="font-bold text-emerald-600 hover:underline flex items-center gap-1"
                  >
                    <MessageSquare className="w-3 h-3" />
                    <span>Chat on WhatsApp</span>
                  </a>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold text-midnight-950 mb-2">
                  Inquiry Submitted!
                </h3>
                <p className="text-sm text-slate-600 max-w-sm mx-auto mb-6">
                  Thank you for contacting Global Safety Academy. Our admissions team will reach out to you shortly.
                </p>
                <button
                  onClick={() => {
                    setSubmitted(false);
                    onClose();
                  }}
                  className="px-6 py-2.5 rounded-xl bg-midnight-950 text-white text-xs font-bold hover:bg-midnight-900 transition-colors"
                >
                  Close
                </button>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
