'use client';
import { useState, useCallback, useRef } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import Webcam from 'react-webcam';
import axios from 'axios';

import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Chip from '@mui/material/Chip';
import LinearProgress from '@mui/material/LinearProgress';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Alert from '@mui/material/Alert';

import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import ShareIcon from '@mui/icons-material/Share';
import RefreshIcon from '@mui/icons-material/Refresh';
import CloseIcon from '@mui/icons-material/Close';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import CategoryIcon from '@mui/icons-material/Category';
import PublicIcon from '@mui/icons-material/Public';

/* ── Constants ─────────────────────────────────────────────────────────────── */
const DEMO_DATA = {
  wet_waste: {
    category: 'wet_waste', label: 'Wet Waste', emoji: '🥬', color: '#2ecc71',
    confidence: 88.4, description: 'Organic, biodegradable household waste.',
    disposal: 'Compost or hand over to biogas plants. Use the GREEN bin.',
    examples: ['Food scraps', 'Vegetable peels', 'Fruit waste', 'Garden clippings', 'Eggshells'],
    tips: ['Segregate daily to prevent odour', 'Use for home composting', 'Can generate biogas', 'Never mix with dry waste'],
    impact: '🌱 Composting 1 kg of wet waste saves ~0.5 kg of CO₂!', binColor: 'Green Bin',
    labels: ['Food', 'Vegetable', 'Organic Material', 'Plant'],
  },
  dry_waste: {
    category: 'dry_waste', label: 'Dry Waste', emoji: '🗑️', color: '#3498db',
    confidence: 82.1, description: 'Non-biodegradable waste going to landfill.',
    disposal: 'Dispose in designated landfill bins. Use the BLUE bin.',
    examples: ['Plastic bags', 'Wrappers', 'Styrofoam', 'Ceramics', 'Rubber'],
    tips: ['Avoid single-use plastics', 'Do not burn dry waste', 'Clean before disposal', 'Reduce consumption'],
    impact: '♻️ Reducing dry waste by 10% prevents 200 kg of landfill waste yearly!', binColor: 'Blue Bin',
    labels: ['Plastic', 'Bag', 'Packaging', 'Container', 'Wrapper'],
  },
  recyclable: {
    category: 'recyclable', label: 'Recyclable Waste', emoji: '♻️', color: '#f39c12',
    confidence: 91.7, description: 'Materials that can become new products.',
    disposal: 'Clean and sort before placing in YELLOW recycling bins.',
    examples: ['Metal cans', 'Glass bottles', 'Newspaper', 'Cardboard', 'Aluminium foil'],
    tips: ['Rinse containers before recycling', 'Flatten cardboard boxes', 'Remove lids from bottles', 'Check local guidelines'],
    impact: '💚 Recycling 1 aluminium can saves energy to run a TV for 3 hours!', binColor: 'Yellow Bin',
    labels: ['Metal', 'Aluminium Can', 'Glass', 'Cardboard', 'Newspaper'],
  },
  e_waste: {
    category: 'e_waste', label: 'E-Waste', emoji: '📱', color: '#e74c3c',
    confidence: 86.3, description: 'Electronic waste with hazardous components.',
    disposal: 'Drop at certified e-waste collection centres. Never dump or burn.',
    examples: ['Old phones', 'Batteries', 'Chargers', 'Laptops', 'PCBs'],
    tips: ['Never throw in regular bins', 'Find certified e-waste recyclers', 'Donate working electronics', 'Remove data first'],
    impact: '⚡ Proper e-waste recycling recovers gold, silver, copper & rare metals!', binColor: 'Red Bin',
    labels: ['Electronics', 'Mobile Phone', 'Battery', 'Cable', 'Circuit Board'],
  },
};

const SAMPLES = [
  { category: 'wet_waste',  emoji: '🥬', label: 'Wet Waste' },
  { category: 'dry_waste',  emoji: '🗑️', label: 'Dry Waste' },
  { category: 'recyclable', emoji: '♻️', label: 'Recyclable' },
  { category: 'e_waste',    emoji: '📱', label: 'E-Waste' },
];

/* ── Loading Steps ──────────────────────────────────────────────────────────── */
const STEPS = [
  { id: 1, icon: '🖼️', label: 'Loading image…' },
  { id: 2, icon: '🧠', label: 'Running AI model…' },
  { id: 3, icon: '🏷️', label: 'Generating result…' },
];

/* ── Result Panel ──────────────────────────────────────────────────────────── */
function ResultSuccess({ data, onReset, onShare }) {
  const [tab, setTab] = useState(0);
  const [barWidth, setBarWidth] = useState(0);

  // Animate confidence bar on mount
  useState(() => setTimeout(() => setBarWidth(data.confidence), 100));
  // Framer Motion handles this better:
  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
      {/* Header */}
      <div className="flex items-center gap-4 mb-5 pb-5 border-b border-subtle">
        <motion.div
          className="text-6xl leading-none"
          initial={{ scale: 0, rotate: -30 }} animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 15 }}
          style={{ filter: `drop-shadow(0 0 16px ${data.color}66)` }}
        >
          {data.emoji}
        </motion.div>
        <div>
          <div className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: data.color }}>
            Classification Result
          </div>
          <h3 className="font-grotesk text-2xl font-bold" style={{ color: data.color }}>{data.label}</h3>
          <div className="text-sm text-muted mt-0.5">🗑️ Dispose in the <strong>{data.binColor}</strong></div>
        </div>
      </div>

      {/* Confidence */}
      <div className="mb-5">
        <div className="flex justify-between text-xs text-muted mb-2">
          <span>AI Confidence</span>
          <span className="font-bold" style={{ color: data.color }}>{data.confidence}%</span>
        </div>
        <LinearProgress
          variant="determinate"
          value={data.confidence}
          sx={{
            height: 6,
            '& .MuiLinearProgress-bar': {
              background: `linear-gradient(90deg, ${data.color}, ${data.color}99)`,
              boxShadow: `0 0 8px ${data.color}77`,
            },
          }}
        />
      </div>

      {/* Description */}
      <p className="text-sm text-muted mb-4">{data.description}</p>

      {/* Disposal */}
      <div
        className="flex items-start gap-3 rounded-xl p-3.5 mb-5 text-sm"
        style={{ background: `${data.color}11`, border: `1px solid ${data.color}33` }}
      >
        <CheckCircleIcon sx={{ fontSize: 18, color: data.color, mt: '2px', flexShrink: 0 }} />
        <span>{data.disposal}</span>
      </div>

      {/* Tabs */}
      <Tabs
        value={tab} onChange={(_, v) => setTab(v)}
        sx={{ minHeight: 36, mb: 2, '& .MuiTab-root': { minHeight: 36, fontSize: '0.8rem', fontWeight: 600, py: 1 } }}
      >
        <Tab icon={<LightbulbIcon sx={{ fontSize: 16 }} />} iconPosition="start" label="Tips" />
        <Tab icon={<CategoryIcon sx={{ fontSize: 16 }} />} iconPosition="start" label="Examples" />
        <Tab icon={<PublicIcon sx={{ fontSize: 16 }} />} iconPosition="start" label="Impact" />
      </Tabs>

      <AnimatePresence mode="wait">
        <motion.div
          key={tab}
          initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.25 }}
          className="min-h-[80px] mb-4"
        >
          {tab === 0 && (
            <ul className="space-y-2">
              {data.tips.map((tip, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-muted">
                  <span className="text-green-400 font-bold mt-px">✓</span> {tip}
                </li>
              ))}
            </ul>
          )}
          {tab === 1 && (
            <div className="flex flex-wrap gap-2">
              {data.examples.map((ex, i) => (
                <Chip key={i} label={ex} size="small"
                  sx={{ bgcolor: 'rgba(255,255,255,0.05)', color: '#7a90b8', border: '1px solid rgba(255,255,255,0.1)', fontWeight: 500 }}
                />
              ))}
            </div>
          )}
          {tab === 2 && (
            <div className="rounded-xl p-4 text-sm"
              style={{ background: `${data.color}0e`, border: `1px solid ${data.color}22` }}>
              {data.impact}
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Labels */}
      {data.labels.length > 0 && (
        <div className="mb-5">
          <p className="text-xs font-bold uppercase tracking-widest text-dim mb-2">AI Detected Objects</p>
          <div className="flex flex-wrap gap-1.5">
            {data.labels.map((l, i) => (
              <span key={i} className="text-xs px-2.5 py-1 rounded-full text-muted"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
                {l}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3">
        <button onClick={onReset}
          className="flex-1 flex items-center justify-center gap-2 text-sm font-semibold py-2.5 rounded-full transition-all hover:-translate-y-0.5"
          style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)' }}>
          <RefreshIcon sx={{ fontSize: 16 }} /> Scan Again
        </button>
        <button onClick={onShare}
          className="flex-1 flex items-center justify-center gap-2 text-sm font-semibold py-2.5 rounded-full transition-all hover:-translate-y-0.5"
          style={{ background: 'rgba(0,201,167,0.1)', border: '1px solid rgba(0,201,167,0.3)', color: '#00c9a7' }}>
          <ShareIcon sx={{ fontSize: 16 }} /> Share
        </button>
      </div>
    </motion.div>
  );
}

/* ── Loading Panel ──────────────────────────────────────────────────────────── */
function ResultLoading({ step }) {
  return (
    <div className="text-center py-8">
      <div className="relative w-32 h-32 mx-auto mb-6 rounded-2xl overflow-hidden"
        style={{ background: 'rgba(0,201,167,0.04)' }}>
        <div className="scanner-line" />
        {['tl','tr','bl','br'].map(c => (
          <div key={c} className={`absolute ${c.includes('t')?'top-1':'bottom-1'} ${c.includes('l')?'left-1':'right-1'} w-4 h-4`}
            style={{
              borderTopWidth:    c.includes('t') ? 2 : 0,
              borderBottomWidth: c.includes('b') ? 2 : 0,
              borderLeftWidth:   c.includes('l') ? 2 : 0,
              borderRightWidth:  c.includes('r') ? 2 : 0,
              borderStyle: 'solid', borderColor: '#00c9a7',
            }} />
        ))}
      </div>
      <h3 className="font-grotesk font-bold text-lg mb-2">Analysing Waste…</h3>
      <p className="text-muted text-sm mb-6">AI is examining image properties</p>
      <div className="space-y-2 text-left max-w-xs mx-auto">
        {STEPS.map(s => (
          <div key={s.id}
            className={`flex items-center gap-2 text-sm px-4 py-2 rounded-full transition-all ${
              step === s.id ? 'text-brand-primary bg-[rgba(0,201,167,0.08)]'
            : step >  s.id ? 'text-green-400' : 'text-dim'
            }`}>
            <span>{s.icon}</span> {s.label}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Idle Panel ─────────────────────────────────────────────────────────────── */
function ResultIdle() {
  return (
    <div className="text-center py-8">
      <div className="relative w-40 h-40 mx-auto mb-6">
        <div className="orbit-ring absolute inset-0">
          {['🥬','🗑️','♻️','📱'].map((em, i) => (
            <div key={i} className="absolute top-1/2 left-1/2 text-2xl"
              style={{ transform: `translate(-50%,-50%) rotate(${i*90}deg) translateX(64px)` }}>
              {em}
            </div>
          ))}
        </div>
        <div className="absolute inset-10 rounded-full flex items-center justify-center font-grotesk font-extrabold text-xl"
          style={{ background: 'linear-gradient(135deg,#00c9a7,#0099d9)', boxShadow: '0 0 40px rgba(0,201,167,0.4)' }}>
          AI
        </div>
      </div>
      <h3 className="font-grotesk font-bold text-lg mb-2">Awaiting Your Image</h3>
      <p className="text-muted text-sm">Upload a waste image to see the AI classification result here.</p>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════════════
   MAIN CLASSIFIER COMPONENT
══════════════════════════════════════════════════════════════════════════════ */
export default function ClassifierSection() {
  const [preview,      setPreview]      = useState(null); // data URL
  const [base64,       setBase64]       = useState(null);
  const [demoCategory, setDemoCategory] = useState(null);
  const [state,        setState]        = useState('idle'); // idle|loading|success|error
  const [result,       setResult]       = useState(null);
  const [loadStep,     setLoadStep]     = useState(1);
  const [cameraOpen,   setCameraOpen]   = useState(false);
  const [toast,        setToast]        = useState(null);
  const webcamRef = useRef(null);
  const fileInputRef = useRef(null);

  const showToast = (msg, type = 'info') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const onDrop = useCallback(files => {
    if (!files.length) return;
    const file = files[0];
    const reader = new FileReader();
    reader.onload = e => {
      setBase64(e.target.result);
      setPreview(e.target.result);
      setDemoCategory(null);
      setState('idle');
      showToast('✅ Image loaded! Click "Classify Waste" to analyse.', 'success');
    };
    reader.readAsDataURL(file);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.png', '.jpg', '.jpeg', '.webp'] },
    maxSize: 10 * 1024 * 1024,
    noClick: true,
  });

  const loadSample = (category) => {
    const d = DEMO_DATA[category];
    const canvas = document.createElement('canvas');
    canvas.width = 400; canvas.height = 300;
    const ctx = canvas.getContext('2d');
    const g = ctx.createLinearGradient(0, 0, 400, 300);
    g.addColorStop(0, d.color + '33'); g.addColorStop(1, d.color + '11');
    ctx.fillStyle = g; ctx.fillRect(0, 0, 400, 300);
    ctx.font = '100px serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText(d.emoji, 200, 120);
    ctx.font = 'bold 26px Outfit,sans-serif'; ctx.fillStyle = d.color;
    ctx.fillText(d.label, 200, 220);
    ctx.font = '14px Outfit,sans-serif'; ctx.fillStyle = 'rgba(255,255,255,0.4)';
    ctx.fillText('Sample Image (Demo Mode)', 200, 258);
    const dataUrl = canvas.toDataURL();
    setPreview(dataUrl); setBase64(null); setDemoCategory(category);
    setState('idle');
    showToast(`📷 Sample loaded: ${d.label}`, 'success');
  };

  const captureFromCamera = useCallback(() => {
    const img = webcamRef.current?.getScreenshot();
    if (!img) return;
    setPreview(img); setBase64(img); setDemoCategory(null);
    setCameraOpen(false); setState('idle');
    showToast('📸 Photo captured! Click "Classify Waste".', 'success');
  }, []);

  const animateSteps = () => {
    setLoadStep(1);
    setTimeout(() => setLoadStep(2), 700);
    setTimeout(() => setLoadStep(3), 1400);
  };

  const classify = async () => {
    if (state === 'loading') return;
    setState('loading'); animateSteps();

    // Demo path
    if (demoCategory) {
      await new Promise(r => setTimeout(r, 2000));
      setResult(DEMO_DATA[demoCategory]);
      setState('success'); return;
    }
    if (!base64) { showToast('⚠️ Please upload an image first.', 'warning'); setState('idle'); return; }

    try {
      const { data } = await axios.post('/api/classify-waste', { image_base64: base64 }, { timeout: 30000 });
      await new Promise(r => setTimeout(r, 400));
      setResult(data);
      setState('success');
      if (data.demo_mode) showToast('ℹ️ Demo mode result.', 'info');
      else showToast('✅ AI classification complete!', 'success');
    } catch {
      // Client-side demo fallback
      await new Promise(r => setTimeout(r, 1800));
      const keys = Object.keys(DEMO_DATA);
      const cat  = keys[Math.floor(Math.random() * keys.length)];
      setResult(DEMO_DATA[cat]);
      setState('success');
      showToast('ℹ️ Backend offline — showing demo result.', 'warning');
    }
  };

  const reset = () => {
    setPreview(null); setBase64(null); setDemoCategory(null);
    setResult(null); setState('idle');
  };

  const share = async () => {
    const text = result
      ? `♻️ WasteSense AI classified my waste as ${result.label}! Dispose in ${result.binColor}.`
      : 'Check out WasteSense AI!';
    if (navigator.share) { try { await navigator.share({ title: 'WasteSense AI', text }); return; } catch {} }
    await navigator.clipboard.writeText(text).catch(() => {});
    showToast('📋 Result copied to clipboard!', 'success');
  };

  const canClassify = (preview || demoCategory) && state !== 'loading';

  return (
    <section id="classifier" className="py-24" style={{ background: 'var(--clr-bg2)' }}>
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="section-badge">🤖 AI Classification Engine</div>
          <h2 className="section-title">Upload &amp; Classify Your Waste</h2>
          <p className="text-muted max-w-xl mx-auto">
            Drop your image or capture with your camera. Our AI analyses it instantly using computer vision.
          </p>
        </div>

        {/* Demo Banner */}
        <Alert
          severity="info" icon="🧪"
          sx={{ mb: 4, background: 'rgba(243,156,18,0.08)', color: '#f5c842', border: '1px solid rgba(243,156,18,0.25)',
                '.MuiAlert-icon': { display: 'none' } }}
        >
          <strong>Demo Mode Active</strong> — Results are simulated. Add AWS credentials to enable real AI.
        </Alert>

        <div className="grid lg:grid-cols-2 gap-8 items-start">
          {/* ── Upload Panel ── */}
          <div className="glass-card rounded-3xl p-7">
            {/* Drop Zone */}
            <div
              {...getRootProps()}
              onClick={() => fileInputRef.current?.click()}
              className={`relative border-2 border-dashed rounded-2xl min-h-[260px] flex items-center justify-center cursor-pointer transition-all duration-300 overflow-hidden mb-5 ${
                isDragActive
                  ? 'border-brand-primary bg-[rgba(0,201,167,0.06)] shadow-[inset_0_0_40px_rgba(0,201,167,0.07)]'
                  : 'border-white/10 hover:border-brand-primary/50 hover:bg-[rgba(0,201,167,0.02)]'
              }`}
            >
              <input {...getInputProps()} ref={fileInputRef} />
              <AnimatePresence mode="wait">
                {preview ? (
                  <motion.div key="preview" className="absolute inset-0" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                    <div
                      className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity"
                      style={{ background: 'rgba(0,0,0,0.55)' }}
                      onClick={e => { e.stopPropagation(); fileInputRef.current?.click(); }}
                    >
                      <span className="text-sm font-semibold text-white bg-white/15 backdrop-blur border border-white/20 px-4 py-2 rounded-full flex items-center gap-2">
                        <RefreshIcon sx={{ fontSize: 16 }} /> Change Image
                      </span>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div key="idle" className="text-center p-8" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <div className="relative w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                      {[80,100,120].map((s, i) => (
                        <div key={i} className="absolute rounded-full border border-[rgba(0,201,167,0.2)] animate-pulse-soft"
                          style={{ width: s, height: s, animationDelay: `${i*0.5}s` }} />
                      ))}
                      <CloudUploadIcon sx={{ fontSize: 40, color: '#00c9a7', position: 'relative', zIndex: 1 }} />
                    </div>
                    <p className="font-semibold text-white mb-1">Drop your image here</p>
                    <p className="text-muted text-sm mb-4">or click to browse — PNG, JPG, WEBP</p>
                    <span className="text-sm font-semibold px-5 py-2 rounded-full transition-all"
                      style={{ background: 'rgba(0,201,167,0.1)', border: '1px solid rgba(0,201,167,0.3)', color: '#00c9a7' }}>
                      Browse Files
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Camera Button */}
            <button
              onClick={() => setCameraOpen(true)}
              className="w-full flex items-center justify-center gap-2 text-sm font-semibold py-2.5 rounded-xl mb-5 transition-all hover:opacity-80"
              style={{ background: 'rgba(52,152,219,0.1)', border: '1px solid rgba(52,152,219,0.3)', color: '#3498db' }}
            >
              <CameraAltIcon sx={{ fontSize: 18 }} /> Capture with Camera (WebRTC)
            </button>

            {/* Classify Button */}
            <button
              onClick={classify}
              disabled={!canClassify}
              className={`w-full flex items-center justify-center gap-2 font-bold text-base py-3.5 rounded-full transition-all ${
                canClassify
                  ? 'text-white hover:-translate-y-0.5 hover:shadow-[0_12px_40px_rgba(0,201,167,0.45)]'
                  : 'text-white/30 cursor-not-allowed'
              }`}
              style={canClassify
                ? { background: 'linear-gradient(135deg,#00c9a7,#0099d9)', boxShadow: '0 6px 25px rgba(0,201,167,0.3)' }
                : { background: 'rgba(255,255,255,0.06)' }}
            >
              {state === 'loading' ? (
                <><span className="animate-spin border-2 border-white/20 border-t-white rounded-full w-5 h-5" />Analysing…</>
              ) : (
                <><AutoFixHighIcon sx={{ fontSize: 20 }} />Classify Waste</>
              )}
            </button>

            {/* Sample Buttons */}
            <div className="mt-6">
              <p className="text-xs font-bold uppercase tracking-widest text-dim mb-3">Try a sample:</p>
              <div className="grid grid-cols-4 gap-2">
                {SAMPLES.map(s => (
                  <button key={s.category} onClick={() => loadSample(s.category)}
                    className="flex flex-col items-center gap-1 py-2.5 px-1 rounded-xl text-xs font-semibold text-muted uppercase tracking-wide transition-all hover:-translate-y-0.5 hover:text-brand-primary hover:border-brand-primary/40"
                    style={{ background: 'var(--clr-card2)', border: '1px solid rgba(255,255,255,0.07)' }}>
                    <span className="text-2xl">{s.emoji}</span>
                    <span className="leading-tight text-center">{s.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* ── Result Panel ── */}
          <div className="glass-card rounded-3xl p-7 min-h-[500px] flex items-center justify-center">
            <AnimatePresence mode="wait">
              {state === 'idle'    && <ResultIdle key="idle" />}
              {state === 'loading' && <ResultLoading key="loading" step={loadStep} />}
              {state === 'success' && result && (
                <ResultSuccess key="success" data={result} onReset={reset} onShare={share} />
              )}
              {state === 'error'   && (
                <motion.div key="error" className="text-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <div className="text-5xl mb-4">⚠️</div>
                  <h3 className="font-grotesk font-bold text-lg mb-2">Classification Failed</h3>
                  <p className="text-muted text-sm mb-4">Could not process image. Please try again.</p>
                  <button onClick={reset} className="btn-secondary text-sm !py-2 !px-6">Try Again</button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Camera Modal */}
      <AnimatePresence>
        {cameraOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(12px)' }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          >
            <motion.div
              className="glass-card rounded-3xl p-6 w-full max-w-lg"
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-grotesk font-bold text-lg">📸 Camera Capture</h3>
                <IconButton onClick={() => setCameraOpen(false)} sx={{ color: '#7a90b8' }}>
                  <CloseIcon />
                </IconButton>
              </div>
              <div className="rounded-xl overflow-hidden mb-4 bg-black">
                <Webcam
                  ref={webcamRef}
                  screenshotFormat="image/jpeg"
                  videoConstraints={{ facingMode: 'environment' }}
                  className="w-full"
                />
              </div>
              <div className="flex gap-3">
                <button onClick={() => setCameraOpen(false)}
                  className="flex-1 btn-secondary !py-2.5 justify-center !text-sm">
                  Cancel
                </button>
                <button onClick={captureFromCamera}
                  className="flex-1 btn-primary !py-2.5 justify-center !text-sm">
                  <CameraAltIcon sx={{ fontSize: 18 }} /> Capture Photo
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            className="fixed bottom-6 right-6 z-50 max-w-sm rounded-xl px-5 py-3.5 text-sm font-medium shadow-2xl"
            style={{ background: 'var(--clr-card)', border: '1px solid rgba(255,255,255,0.12)' }}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
          >
            {toast.msg}
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
