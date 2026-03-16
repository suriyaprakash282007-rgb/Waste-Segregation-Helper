'use client';
import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import Chip from '@mui/material/Chip';

const STEPS = [
  { icon: '🖼️', step: '01', title: 'Upload Image', desc: 'User uploads or captures a photo of waste via web interface or WebRTC camera.', color: '#2ecc71' },
  { icon: '🔀', step: '02', title: 'API Gateway', desc: 'Request routes through Next.js API → AWS API Gateway securely via HTTPS.', color: '#3498db' },
  { icon: '🧠', step: '03', title: 'AWS Rekognition', desc: 'AI model detects objects with high confidence labels using deep learning vision.', color: '#f39c12' },
  { icon: '🏷️', step: '04', title: 'Classify & Return', desc: 'Labels are mapped to waste categories. Results + disposal tips returned to user.', color: '#e74c3c' },
];

const TECH = [
  { icon: '⚛️', label: 'React.js' },
  { icon: '▲', label: 'Next.js' },
  { icon: '🌊', label: 'Tailwind CSS' },
  { icon: '🎨', label: 'Material UI' },
  { icon: '🎞️', label: 'Framer Motion' },
  { icon: '📦', label: 'React Dropzone' },
  { icon: '📷', label: 'WebRTC Camera' },
  { icon: '🐍', label: 'Node.js + Express' },
  { icon: '☁️', label: 'AWS Rekognition' },
  { icon: '🗄️', label: 'DynamoDB' },
  { icon: '📁', label: 'Amazon S3' },
  { icon: '⚡', label: 'AWS Lambda' },
];

export default function HowItWorksSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <section id="how-it-works" className="py-24" style={{ background: 'var(--clr-bg2)' }} ref={ref}>
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-14">
          <div className="section-badge">⚙️ Technology</div>
          <h2 className="section-title">How It Works</h2>
          <p className="text-muted max-w-lg mx-auto">
            Powered by AWS Rekognition, React + Next.js, and a smart multi-label classification engine.
          </p>
        </div>

        {/* Flow Steps */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-14">
          {STEPS.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.1, duration: 0.5, ease: 'easeOut' }}
              className="relative glass-card rounded-2xl p-6 hover:-translate-y-1 transition-transform duration-300"
              style={{ border: '1px solid rgba(255,255,255,0.07)' }}
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center text-xl mb-4"
                style={{ background: `${s.color}18`, border: `1px solid ${s.color}33` }}
              >
                {s.icon}
              </div>
              <div className="text-xs font-bold text-dim mb-1">STEP {s.step}</div>
              <h3 className="font-grotesk font-bold text-base mb-2">{s.title}</h3>
              <p className="text-sm text-muted leading-relaxed">{s.desc}</p>

              {/* Arrow connector (hidden on last) */}
              {i < 3 && (
                <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full flex items-center justify-center z-10 text-xs text-dim hidden lg:flex"
                  style={{ background: 'var(--clr-bg2)', border: '1px solid rgba(255,255,255,0.1)' }}>
                  ›
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Tech Stack Pills */}
        <div className="flex flex-wrap gap-2.5 justify-center mb-14">
          {TECH.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: i * 0.04, duration: 0.3 }}
            >
              <Chip
                label={`${t.icon} ${t.label}`}
                sx={{
                  bgcolor: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.09)',
                  color: '#7a90b8',
                  fontWeight: 500,
                  fontSize: '0.8rem',
                  '&:hover': { borderColor: 'rgba(0,201,167,0.4)', color: '#00c9a7', bgcolor: 'rgba(0,201,167,0.06)' },
                  transition: 'all 0.25s',
                }}
              />
            </motion.div>
          ))}
        </div>

        {/* AWS Setup Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="rounded-2xl p-6 flex flex-col sm:flex-row gap-5"
          style={{ background: 'linear-gradient(135deg,rgba(0,201,167,0.06),rgba(0,153,217,0.04))', border: '1px solid rgba(0,201,167,0.2)' }}
        >
          <div className="w-14 h-14 flex-shrink-0 rounded-xl flex items-center justify-center text-2xl"
            style={{ background: 'linear-gradient(135deg,#00c9a7,#0099d9)' }}>
            🔑
          </div>
          <div>
            <h3 className="font-grotesk font-bold text-lg mb-2">Connect AWS Rekognition</h3>
            <p className="text-sm text-muted mb-3">To enable real AI classification, add your AWS credentials to <code className="text-brand-primary">.env.local</code>:</p>
            <pre className="text-xs p-4 rounded-xl overflow-x-auto mb-3" style={{ background: 'rgba(0,0,0,0.45)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <code className="text-brand-primary">{`AWS_ACCESS_KEY_ID=your_key
AWS_SECRET_ACCESS_KEY=your_secret
AWS_REGION=us-east-1
NEXT_PUBLIC_USE_DEMO_MODE=false`}</code>
            </pre>
            <p className="text-sm text-muted">Then restart <code className="text-brand-primary">npm run dev</code> — real Rekognition kicks in!</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
