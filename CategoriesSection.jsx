'use client';
import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';

const CATEGORIES = [
  {
    id: 'wet',  emoji: '🥬', num: '01', title: 'Wet Waste', color: '#2ecc71',
    desc: 'Organic, biodegradable materials from kitchen and garden.',
    bin: 'Green Bin', binClass: 'text-green-400 border-green-400/30 bg-green-400/10',
    examples: ['Food scraps', 'Vegetable peels', 'Garden waste'],
    tip: '♻ Can be composted or converted to biogas',
  },
  {
    id: 'dry',  emoji: '🗑️', num: '02', title: 'Dry Waste', color: '#3498db',
    desc: 'Non-biodegradable waste that cannot be easily recycled.',
    bin: 'Blue Bin', binClass: 'text-blue-400 border-blue-400/30 bg-blue-400/10',
    examples: ['Plastic bags', 'Wrappers', 'Styrofoam'],
    tip: '🚫 Reduce use of single-use plastics',
  },
  {
    id: 'rec',  emoji: '♻️', num: '03', title: 'Recyclable Waste', color: '#f39c12',
    desc: 'Materials that can be processed into new products.',
    bin: 'Yellow Bin', binClass: 'text-yellow-400 border-yellow-400/30 bg-yellow-400/10',
    examples: ['Metal cans', 'Glass bottles', 'Cardboard'],
    tip: '💡 Clean items before placing in recycling',
  },
  {
    id: 'ewaste', emoji: '📱', num: '04', title: 'E-Waste', color: '#e74c3c',
    desc: 'Electronic waste with hazardous components needing special disposal.',
    bin: 'Red Bin', binClass: 'text-red-400 border-red-400/30 bg-red-400/10',
    examples: ['Old phones', 'Batteries', 'Laptops'],
    tip: '⚠️ Never dump or burn — visit certified centres',
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: i => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.5, ease: 'easeOut' } }),
};

export default function CategoriesSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section id="categories" className="py-24" ref={ref}>
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-14">
          <div className="section-badge">🗂️ Waste Types</div>
          <h2 className="section-title">Four Waste Categories</h2>
          <p className="text-muted max-w-lg mx-auto">
            Understanding waste types is the first step towards responsible disposal and a cleaner environment.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {CATEGORIES.map((cat, i) => (
            <motion.div
              key={cat.id}
              custom={i}
              initial="hidden"
              animate={inView ? 'visible' : 'hidden'}
              variants={cardVariants}
            >
              <Card
                className="h-full group transition-all duration-300 cursor-default"
                sx={{
                  borderRadius: '20px',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  '&:hover': {
                    borderColor: `${cat.color} !important`,
                    transform: 'translateY(-6px)',
                    boxShadow: `0 20px 50px rgba(0,0,0,0.5), 0 0 0 1px ${cat.color}, 0 0 30px ${cat.color}33`,
                  },
                  '&::before': {
                    content: '""',
                    display: 'block',
                    height: '3px',
                    background: cat.color,
                    opacity: 0,
                    transition: 'opacity 0.3s',
                  },
                  '&:hover::before': { opacity: 1 },
                }}
              >
                <CardContent sx={{ p: 3, flex: 1, display: 'flex', flexDirection: 'column' }}>
                  {/* Top */}
                  <div className="flex justify-between items-start mb-3">
                    <span className="text-4xl leading-none" style={{ filter: `drop-shadow(0 4px 8px rgba(255,255,255,0.1))` }}>
                      {cat.emoji}
                    </span>
                    <span className="font-grotesk text-4xl font-black opacity-[0.04]">{cat.num}</span>
                  </div>

                  {/* Body */}
                  <h3 className="font-grotesk font-bold text-lg mb-2">{cat.title}</h3>
                  <p className="text-sm text-muted mb-3 flex-1 leading-relaxed">{cat.desc}</p>

                  {/* Bin badge */}
                  <div className={`inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide px-3 py-1 rounded-full border mb-3 w-fit ${cat.binClass}`}>
                    🗑️ {cat.bin}
                  </div>

                  {/* Examples */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {cat.examples.map(ex => (
                      <span key={ex} className="text-xs text-dim px-2 py-0.5 rounded-full"
                        style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
                        {ex}
                      </span>
                    ))}
                  </div>
                </CardContent>

                {/* Footer */}
                <div className="px-4 py-3 text-xs text-muted border-t border-subtle"
                  style={{ borderColor: 'rgba(255,255,255,0.07)' }}>
                  {cat.tip}
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
