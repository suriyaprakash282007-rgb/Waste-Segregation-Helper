'use client';
import { useRef, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';

const STATS = [
  { emoji: '🌍', target: '2.1', suffix: 'B', label: 'Tons of waste generated yearly', decimal: true, color: '#2ecc71' },
  { emoji: '♻️', target: '32',  suffix: '%', label: 'Of waste is currently recycled',  decimal: false, color: '#f39c12' },
  { emoji: '💧', target: '7000',suffix: 'L', label: 'Water saved per ton recycled paper', decimal: false, color: '#3498db' },
  { emoji: '⚡', target: '95',  suffix: '%', label: 'Energy saved recycling aluminium', decimal: false, color: '#e74c3c' },
];

function StatCounter({ target, suffix, decimal, color, inView }) {
  const ref = useRef(null);
  useEffect(() => {
    if (!inView || !ref.current) return;
    const el = ref.current;
    const floatTo = parseFloat(target);
    const start = performance.now();
    const dur = 1600;
    const step = ts => {
      const p = Math.min((ts - start) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      const v = floatTo * eased;
      el.textContent = (decimal ? v.toFixed(1) : Math.floor(v).toLocaleString()) + suffix;
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [inView, target, suffix, decimal]);

  return (
    <span ref={ref} className="font-grotesk text-4xl font-extrabold"
      style={{ background: `linear-gradient(135deg, ${color}, ${color}99)`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
      0{suffix}
    </span>
  );
}

export default function StatsSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section id="stats" className="py-24" ref={ref}>
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-14">
          <div className="section-badge">📊 Impact</div>
          <h2 className="section-title">Why Proper Segregation Matters</h2>
          <p className="text-muted max-w-lg mx-auto">Small everyday actions compound into massive environmental change.</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-14">
          {STATS.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.1, duration: 0.5, ease: 'easeOut' }}
              className="glass-card rounded-2xl p-7 text-center hover:-translate-y-1 transition-transform duration-300"
              style={{ border: '1px solid rgba(255,255,255,0.07)' }}
            >
              <div className="text-4xl mb-3">{s.emoji}</div>
              <div className="mb-1">
                <StatCounter
                  target={s.target} suffix={s.suffix} decimal={s.decimal}
                  color={s.color} inView={inView}
                />
              </div>
              <p className="text-sm text-muted leading-snug">{s.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Quote */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.5 }}
          className="text-center max-w-2xl mx-auto"
        >
          <blockquote
            className="text-lg italic text-muted pl-5 text-left"
            style={{ borderLeft: '3px solid #00c9a7' }}
          >
            "Waste is only waste if we waste it. Proper segregation turns it into a resource."
          </blockquote>
        </motion.div>
      </div>
    </section>
  );
}
