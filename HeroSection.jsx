'use client';
import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';

const PARTICLES = [
  { x: '15%', y: '20%', size: 80,  delay: 0,   color: '#2ecc71' },
  { x: '75%', y: '15%', size: 120, delay: 1.5, color: '#3498db' },
  { x: '50%', y: '60%', size: 60,  delay: 3,   color: '#f39c12' },
  { x: '85%', y: '70%', size: 90,  delay: 0.8, color: '#e74c3c' },
  { x: '10%', y: '75%', size: 50,  delay: 2,   color: '#9b59b6' },
  { x: '60%', y: '30%', size: 70,  delay: 4,   color: '#2ecc71' },
];

const FLOATING = [
  { x: '5%',  y: '40%', delay: 0, emoji: '🌿' },
  { x: '90%', y: '30%', delay: 1, emoji: '📱' },
  { x: '20%', y: '80%', delay: 2, emoji: '♻️' },
  { x: '70%', y: '80%', delay: 3, emoji: '🥤' },
];

function Counter({ target, suffix = '', decimal = false }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      const floatTo = parseFloat(target);
      const start = performance.now();
      const dur = 1400;
      function step(ts) {
        const p = Math.min((ts - start) / dur, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        const v = floatTo * eased;
        el.textContent = (decimal ? v.toFixed(1) : Math.floor(v)) + suffix;
        if (p < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
      obs.disconnect();
    }, { threshold: 0.5 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [target, suffix, decimal]);
  return <span ref={ref}>0{suffix}</span>;
}

export default function HeroSection() {
  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center overflow-hidden pt-24 pb-16"
    >
      {/* Mesh gradient */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse 70% 60% at 20% 50%, rgba(0,201,167,0.12) 0%, transparent 60%),
            radial-gradient(ellipse 50% 50% at 80% 20%, rgba(52,152,219,0.10) 0%, transparent 50%),
            radial-gradient(ellipse 60% 40% at 60% 80%, rgba(155,89,182,0.08) 0%, transparent 55%)
          `,
        }}
      />
      {/* Grid */}
      <div className="absolute inset-0 hero-grid pointer-events-none opacity-60" />

      {/* Floating particles */}
      {PARTICLES.map((p, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full pointer-events-none"
          style={{
            left: p.x, top: p.y,
            width: p.size, height: p.size,
            background: p.color,
            opacity: 0.06,
            filter: 'blur(40px)',
          }}
          animate={{ scale: [1, 1.3, 1], opacity: [0.06, 0.1, 0.06], x: [0, 10, 0], y: [0, -10, 0] }}
          transition={{ duration: 8, repeat: Infinity, delay: p.delay, ease: 'easeInOut' }}
        />
      ))}

      {/* Floating emojis */}
      {FLOATING.map((f, i) => (
        <motion.div
          key={i}
          className="absolute text-3xl pointer-events-none"
          style={{ left: f.x, top: f.y, opacity: 0.12 }}
          animate={{ y: [0, -20, 0], rotate: [0, 10, 0] }}
          transition={{ duration: 6, repeat: Infinity, delay: f.delay, ease: 'easeInOut' }}
        >
          {f.emoji}
        </motion.div>
      ))}

      {/* Content */}
      <div className="container mx-auto px-6 relative z-10 max-w-3xl">
        {/* Badge */}
        <motion.div
          className="section-badge mb-6"
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
        >
          <span className="inline-block w-2 h-2 rounded-full bg-brand-primary animate-blink mr-2" />
          AI-Powered Waste Intelligence
        </motion.div>

        {/* Headline */}
        <motion.h1
          className="font-grotesk text-5xl md:text-7xl font-extrabold leading-[1.08] tracking-tight mb-6"
          initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}
        >
          Segregate Waste<br />
          <span className="gradient-text">Smartly with AI</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          className="text-lg md:text-xl text-muted max-w-2xl mb-10"
          initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}
        >
          Upload a photo of any waste item and our intelligent AI instantly classifies it —
          empowering you to dispose responsibly and build a cleaner, greener world. 🌍
        </motion.p>

        {/* CTAs */}
        <motion.div
          className="flex flex-wrap gap-4 mb-14"
          initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}
        >
          <a href="#classifier" className="btn-primary text-base">
            <span>Start Classifying</span>
            <ArrowForwardIcon sx={{ fontSize: 18 }} />
          </a>
          <a href="#how-it-works" className="btn-secondary text-base text-white">
            <PlayCircleOutlineIcon sx={{ fontSize: 18 }} />
            <span>How It Works</span>
          </a>
        </motion.div>

        {/* Stats */}
        <motion.div
          className="flex items-center gap-8 flex-wrap"
          initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.4 }}
        >
          {[
            { target: '4',  suffix: '',  label: 'Categories',    decimal: false },
            { target: '95', suffix: '%', label: 'Accuracy',      decimal: false },
            { target: '2',  suffix: 's', label: 'Instant Result',decimal: false },
          ].map((s, i) => (
            <div key={i} className="flex items-center gap-8">
              <div className="text-center">
                <div
                  className="font-grotesk text-3xl font-extrabold"
                  style={{ background: 'linear-gradient(135deg,#00c9a7,#0099d9)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
                >
                  <Counter target={s.target} suffix={s.suffix} decimal={s.decimal} />
                </div>
                <div className="text-xs text-muted font-semibold uppercase tracking-wider mt-1">{s.label}</div>
              </div>
              {i < 2 && <div className="w-px h-10" style={{ background: 'rgba(255,255,255,0.15)' }} />}
            </div>
          ))}
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-dim text-xs uppercase tracking-widest">
        <div className="w-5 h-8 rounded-full border-2 border-dim flex justify-center pt-1">
          <div className="w-0.5 h-2 bg-dim rounded-full scroll-wheel-anim" />
        </div>
        Scroll
      </div>
    </section>
  );
}
