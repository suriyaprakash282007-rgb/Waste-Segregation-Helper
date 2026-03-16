'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import IconButton from '@mui/material/IconButton';

const navLinks = [
  { href: '#home',         label: 'Home' },
  { href: '#classifier',   label: 'Classify' },
  { href: '#categories',   label: 'Categories' },
  { href: '#how-it-works', label: 'How It Works' },
  { href: '#stats',        label: 'Stats' },
];

export default function Navbar() {
  const [scrolled,   setScrolled]   = useState(false);
  const [menuOpen,   setMenuOpen]   = useState(false);
  const [activeLink, setActiveLink] = useState('#home');

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => entries.forEach(e => e.isIntersecting && setActiveLink(`#${e.target.id}`)),
      { rootMargin: '-45% 0px -45% 0px' },
    );
    document.querySelectorAll('section[id]').forEach(s => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      <motion.header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? 'backdrop-blur-xl shadow-2xl' : ''
        }`}
        style={{ background: scrolled ? 'rgba(7,13,26,0.88)' : 'transparent',
                 borderBottom: scrolled ? '1px solid rgba(255,255,255,0.07)' : 'none' }}
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        <nav className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <span className="text-3xl drop-shadow-[0_0_8px_rgba(46,204,113,0.5)]">♻️</span>
            <div>
              <div className="font-grotesk font-bold text-xl text-white leading-none">WasteSense</div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-brand-primary">AI Powered</div>
            </div>
          </div>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(l => (
              <a
                key={l.href}
                href={l.href}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  activeLink === l.href
                    ? 'bg-white/10 text-white'
                    : 'text-brand-muted hover:text-white hover:bg-white/7'
                }`}
              >
                {l.label}
              </a>
            ))}
            <a
              href="#classifier"
              className="ml-2 flex items-center gap-2 btn-primary text-sm !py-2 !px-5"
            >
              <CameraAltIcon sx={{ fontSize: 16 }} /> Scan Now
            </a>
          </div>

          {/* Mobile hamburger */}
          <IconButton
            className="md:hidden"
            onClick={() => setMenuOpen(o => !o)}
            aria-label="Toggle navigation"
            sx={{ color: '#e8edf5' }}
          >
            {menuOpen ? <CloseIcon /> : <MenuIcon />}
          </IconButton>
        </nav>
      </motion.header>

      {/* Mobile overlay menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="fixed inset-0 z-40 flex flex-col items-center justify-center gap-8 backdrop-blur-2xl"
            style={{ background: 'rgba(7,13,26,0.97)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {navLinks.map((l, i) => (
              <motion.a
                key={l.href}
                href={l.href}
                onClick={closeMenu}
                className="text-2xl font-semibold text-white hover:text-brand-primary transition-colors"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: i * 0.06 }}
              >
                {l.label}
              </motion.a>
            ))}
            <motion.a
              href="#classifier"
              onClick={closeMenu}
              className="btn-primary mt-4"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.35 }}
            >
              <CameraAltIcon /> Scan Now
            </motion.a>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
