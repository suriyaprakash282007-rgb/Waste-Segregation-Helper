'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

export default function Footer() {
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const fn = () => setShowTop(window.scrollY > 400);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  return (
    <>
      <footer className="py-16 border-t" style={{ background: 'var(--clr-bg2)', borderColor: 'rgba(255,255,255,0.07)' }}>
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-10 mb-12 pb-12 border-b" style={{ borderColor: 'rgba(255,255,255,0.07)' }}>
            {/* Brand */}
            <div>
              <div className="font-grotesk font-bold text-xl mb-3">♻️ WasteSense</div>
              <p className="text-sm text-muted leading-relaxed mb-4">AI-powered waste segregation helper for a cleaner, greener planet.</p>
              <div className="flex flex-wrap gap-2">
                {['🔒 Secure', '☁️ Cloud', '🤖 AI-First'].map(b => (
                  <span key={b} className="text-xs font-semibold px-2.5 py-1 rounded-full text-muted"
                    style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
                    {b}
                  </span>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            {[
              {
                title: 'Quick Links',
                links: [['Home','#home'],['Classify','#classifier'],['Categories','#categories'],['How It Works','#how-it-works']],
              },
              {
                title: 'Categories',
                links: [['🥬 Wet Waste','#categories'],['🗑️ Dry Waste','#categories'],['♻️ Recyclable','#categories'],['📱 E-Waste','#categories']],
              },
              {
                title: 'Tech Stack',
                links: [['React + Next.js','#how-it-works'],['AWS Rekognition','#how-it-works'],['Amazon S3','#how-it-works'],['DynamoDB','#how-it-works']],
              },
            ].map(col => (
              <div key={col.title}>
                <h4 className="text-xs font-bold uppercase tracking-widest text-dim mb-4">{col.title}</h4>
                <ul className="space-y-2">
                  {col.links.map(([label, href]) => (
                    <li key={label}>
                      <a href={href} className="text-sm text-muted hover:text-brand-primary transition-colors">{label}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-center gap-2 text-xs text-dim">
            <p>© 2025 WasteSense AI — Built with 💚 for a greener planet</p>
            <p>Powered by React · Next.js · AWS Rekognition</p>
          </div>
        </div>
      </footer>

      {/* Scroll-to-top button */}
      <AnimatePresence>
        {showTop && (
          <motion.button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="fixed bottom-8 left-8 z-50 w-11 h-11 rounded-full flex items-center justify-center text-white hover:-translate-y-0.5 transition-transform"
            style={{ background: 'linear-gradient(135deg,#00c9a7,#0099d9)', boxShadow: '0 4px 20px rgba(0,201,167,0.4)' }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            aria-label="Back to top"
          >
            <KeyboardArrowUpIcon />
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
}
