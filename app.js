/**
 * AI Waste Segregation Helper — app.js
 * Handles image upload, classification API calls, result rendering, and UI interactions.
 */

/* ══════════════════════════════════════════════════════════════════════════
   CONFIG
════════════════════════════════════════════════════════════════════════════ */
const CONFIG = {
  backendUrl: 'http://localhost:5000',
  apiEndpoint: '/api/classify-waste',
  maxFileSizeMB: 10,
  supportedTypes: ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'],
  demoMode: false, // set to true only for offline/demo environments
};

/* ══════════════════════════════════════════════════════════════════════════
   DEMO DATA — used when backend is offline
════════════════════════════════════════════════════════════════════════════ */
const DEMO_DB = {
  wet_waste: {
    category: 'wet_waste', label: 'Wet Waste', emoji: '🥬', color: '#2ecc71',
    confidence: (82 + Math.random() * 14).toFixed(1),
    description: 'Organic, biodegradable household waste from kitchen and garden.',
    disposal: 'Compost it or hand over to biogas plants. Always use the GREEN bin.',
    examples: ['Food scraps', 'Vegetable peels', 'Fruit waste', 'Garden waste', 'Eggshells'],
    tips: ['Segregate daily to avoid odour', 'Use for home composting', 'Can generate biogas', 'Never mix with dry waste'],
    impact: '🌱 Composting 1 kg of wet waste saves ~0.5 kg of CO₂ emissions!',
    bin_color: 'Green Bin',
    matched_labels: ['Food', 'Vegetable', 'Organic Material', 'Plant'],
    demo_mode: true,
  },
  dry_waste: {
    category: 'dry_waste', label: 'Dry Waste', emoji: '🗑️', color: '#3498db',
    confidence: (75 + Math.random() * 18).toFixed(1),
    description: 'Non-biodegradable waste that cannot be easily recycled.',
    disposal: 'Dispose in designated landfill bins. Use the BLUE bin.',
    examples: ['Plastic bags', 'Wrappers', 'Styrofoam', 'Ceramics', 'Rubber'],
    tips: ['Avoid single-use plastics', 'Do not burn dry waste', 'Clean before disposal', 'Reduce plastic use'],
    impact: '♻️ Reducing dry waste by 10% prevents 200 kg of landfill waste per year!',
    bin_color: 'Blue Bin',
    matched_labels: ['Plastic', 'Bag', 'Packaging', 'Container', 'Wrapper'],
    demo_mode: true,
  },
  recyclable: {
    category: 'recyclable', label: 'Recyclable Waste', emoji: '♻️', color: '#f39c12',
    confidence: (78 + Math.random() * 16).toFixed(1),
    description: 'Materials that can be processed and reused to create new products.',
    disposal: 'Clean and sort before placing in YELLOW recycling bins.',
    examples: ['Metal cans', 'Glass bottles', 'Newspaper', 'Cardboard', 'Aluminium foil'],
    tips: ['Rinse containers before recycling', 'Flatten cardboard boxes', 'Remove bottle lids', 'Check local recycling guide'],
    impact: '💚 Recycling 1 aluminium can saves energy enough to run a TV for 3 hours!',
    bin_color: 'Yellow Bin',
    matched_labels: ['Metal', 'Aluminium Can', 'Glass', 'Cardboard', 'Newspaper'],
    demo_mode: true,
  },
  e_waste: {
    category: 'e_waste', label: 'E-Waste', emoji: '📱', color: '#e74c3c',
    confidence: (80 + Math.random() * 15).toFixed(1),
    description: 'Electronic waste containing hazardous materials requiring special disposal.',
    disposal: 'Drop at certified e-waste collection centres. Never dump or burn.',
    examples: ['Old phones', 'Batteries', 'Chargers', 'Laptops', 'Circuit boards'],
    tips: ['Never throw in regular bins', 'Find certified e-waste recyclers', 'Donate working electronics', 'Remove data before disposal'],
    impact: '⚡ Proper e-waste recycling recovers precious gold, silver, copper & rare earth metals!',
    bin_color: 'Red Bin',
    matched_labels: ['Electronics', 'Mobile Phone', 'Battery', 'Cable', 'Circuit Board'],
    demo_mode: true,
  },
};

/* ══════════════════════════════════════════════════════════════════════════
   DOM REFERENCES
════════════════════════════════════════════════════════════════════════════ */
const $  = id => document.getElementById(id);
const $$ = sel => document.querySelectorAll(sel);

const DOM = {
  // Upload
  dropZone:        $('drop-zone'),
  fileInput:       $('file-input'),
  browseBtn:       $('browse-btn'),
  changeBtn:       $('change-image-btn'),
  previewDefault:  $('drop-zone-default'),
  previewContent:  $('preview-content'),
  previewImg:      $('preview-img'),
  uploadForm:      $('upload-form'),
  classifyBtn:     $('classify-btn'),
  uploadHint:      $('upload-hint'),

  // Results
  resultIdle:      $('result-idle'),
  resultLoading:   $('result-loading'),
  resultSuccess:   $('result-success'),
  resultError:     $('result-error'),
  errorMessage:    $('error-message'),

  // Result fields
  resultEmoji:     $('result-emoji'),
  resultCategory:  $('result-category'),
  resultBin:       $('result-bin'),
  confidenceBar:   $('confidence-bar'),
  confidenceValue: $('confidence-value'),
  resultDesc:      $('result-description'),
  disposalText:    $('disposal-text'),
  tipsList:        $('tips-list'),
  examplesGrid:    $('examples-grid'),
  impactText:      $('impact-text'),
  labelsWrap:      $('labels-wrap'),
  detectedBlock:   $('detected-labels-block'),

  // Buttons
  retryBtn:        $('retry-btn'),
  scanAgainBtn:    $('scan-again-btn'),
  shareBtn:        $('share-btn'),

  // Nav
  hamburger:       $('hamburger-btn'),
  navLinks:        document.querySelector('.nav-links'),

  // Global
  header:          $('site-header'),
  toast:           $('toast'),
  scrollTopBtn:    $('scroll-top-btn'),
  demoBanner:      $('demo-banner'),
};

/* ══════════════════════════════════════════════════════════════════════════
   STATE
════════════════════════════════════════════════════════════════════════════ */
let state = {
  imageFile: null,
  imageBase64: null,
  currentCategory: null,
  isLoading: false,
  activeTab: 'tips',
  demoCategory: null, // set when using sample buttons
};

/* ══════════════════════════════════════════════════════════════════════════
   UTILITIES
════════════════════════════════════════════════════════════════════════════ */

/** Show a toast notification */
function showToast(msg, type = 'info', duration = 3500) {
  const t = DOM.toast;
  t.textContent = msg;
  t.className = `toast ${type} show`;
  clearTimeout(t._timer);
  t._timer = setTimeout(() => t.classList.remove('show'), duration);
}

/** Toggle result panel states */
function showPanel(name) {
  ['result-idle','result-loading','result-success','result-error'].forEach(id => {
    const el = $(id);
    if (el) { el.hidden = (id !== `result-${name}`); }
  });
  // Give the panel a flex/block style so it is centred properly
  const panels = { idle: true, loading: true, success: false, error: true };
  DOM.resultSuccess.style.display = name === 'success' ? 'block' : 'none';
}

/** Animate counter numbers */
function animateCounter(el, to, suffix = '', decimal = false) {
  const duration = 1400;
  const start     = performance.now();
  const from      = 0;
  const floatTo   = parseFloat(to);

  function step(ts) {
    const progress = Math.min((ts - start) / duration, 1);
    const eased    = 1 - Math.pow(1 - progress, 3);
    const value    = from + (floatTo - from) * eased;
    el.textContent = (decimal ? value.toFixed(1) : Math.floor(value).toLocaleString()) + suffix;
    if (progress < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

/** Scroll reveal observer */
function initReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((e, i) => {
      if (e.isIntersecting) {
        setTimeout(() => e.target.classList.add('visible'), i * 80);
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.1 });

  $$('.category-card, .flow-step, .impact-stat-card, .setup-card').forEach(el => {
    el.classList.add('reveal');
    observer.observe(el);
  });
}

/** Hero counter animation */
function initHeroCounters() {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        $$('.stat-num').forEach(el => {
          const target = el.dataset.target;
          const suffix = el.dataset.suffix || '';
          animateCounter(el, target, suffix);
        });
        observer.disconnect();
      }
    });
  }, { threshold: 0.5 });
  const heroStats = document.querySelector('.hero-stats');
  if (heroStats) observer.observe(heroStats);
}

/** Impact counters */
function initImpactCounters() {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        $$('.impact-number.counter').forEach(el => {
          const target  = el.dataset.target;
          const suffix  = el.dataset.suffix || '';
          const decimal = String(target).includes('.');
          animateCounter(el, target, suffix, decimal);
        });
        observer.disconnect();
      }
    });
  }, { threshold: 0.4 });
  const grid = document.querySelector('.impact-grid');
  if (grid) observer.observe(grid);
}

/* ══════════════════════════════════════════════════════════════════════════
   IMAGE HANDLING
════════════════════════════════════════════════════════════════════════════ */

function validateFile(file) {
  if (!CONFIG.supportedTypes.includes(file.type)) {
    showToast('❌ Please upload a PNG, JPG, JPEG or WEBP image.', 'error');
    return false;
  }
  if (file.size > CONFIG.maxFileSizeMB * 1024 * 1024) {
    showToast(`❌ File too large. Max size is ${CONFIG.maxFileSizeMB} MB.`, 'error');
    return false;
  }
  return true;
}

function loadImageFile(file) {
  if (!validateFile(file)) return;

  state.imageFile   = file;
  state.demoCategory = null; // clear any demo preset

  const reader = new FileReader();
  reader.onload = e => {
    state.imageBase64 = e.target.result;
    showPreview(e.target.result);
    enableClassify();
    showToast('✅ Image loaded! Click "Classify Waste" to analyse.', 'success');
  };
  reader.readAsDataURL(file);
}

function showPreview(src) {
  DOM.previewImg.src = src;
  DOM.previewDefault.hidden = true;
  DOM.previewContent.hidden = false;
  DOM.previewContent.setAttribute('aria-hidden', 'false');
}

function resetUpload() {
  state.imageFile    = null;
  state.imageBase64  = null;
  state.demoCategory = null;
  DOM.fileInput.value = '';
  DOM.previewImg.src  = '';
  DOM.previewDefault.hidden  = false;
  DOM.previewContent.hidden  = true;
  DOM.previewContent.setAttribute('aria-hidden', 'true');
  disableClassify();
  showPanel('idle');
}

function enableClassify() {
  DOM.classifyBtn.disabled = false;
  DOM.uploadHint.textContent = '✅ Image ready — click Classify Waste';
}
function disableClassify() {
  DOM.classifyBtn.disabled = true;
  DOM.uploadHint.textContent = '';
}

/* ══════════════════════════════════════════════════════════════════════════
   CLASSIFICATION
════════════════════════════════════════════════════════════════════════════ */

async function classifyWaste() {
  if (state.isLoading) return;

  // If using sample button, send the sample canvas image to the real backend
  if (state.demoCategory && state.imageBase64) {
    // Fall through — imageBase64 is set from the sample canvas, send it to backend
  } else if (!state.imageBase64) {
    showToast('⚠️ Please upload an image first.', 'info');
    return;
  }

  state.isLoading = true;
  setLoadingUI(true);
  showPanel('loading');
  animateLoadingSteps();

  try {
    const response = await fetch(`${CONFIG.backendUrl}${CONFIG.apiEndpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ image_base64: state.imageBase64 }),
      signal: AbortSignal.timeout(30_000),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({ error: 'Server error' }));
      throw new Error(err.error || `HTTP ${response.status}`);
    }

    const data = await response.json();
    await sleep(400); // let last loading step animate
    renderResult(data);
    const engineLabel = data.engine === 'aws_rekognition' ? '☁️ AWS Rekognition' : '🤖 Local AI';
    showToast(`✅ Classification complete! Engine: ${engineLabel}`, 'success');

  } catch (err) {
    console.error('Classification failed:', err.message);
    state.isLoading = false;
    setLoadingUI(false);

    // Show the error panel with a meaningful message
    const isNetworkError = err.name === 'TypeError' || err.name === 'TimeoutError';
    const friendlyMsg = isNetworkError
      ? '⚠️ Cannot reach the backend server. Make sure the Flask backend is running on port 5000.'
      : `❌ Classification failed: ${err.message}`;
    DOM.errorMessage.textContent = friendlyMsg;
    showPanel('error');
    showToast(friendlyMsg, 'error', 5000);
    return;
  }

  state.isLoading = false;
  setLoadingUI(false);
}

// simulateClassification is no longer used in main mode.
// Sample buttons now generate a real canvas image and send it to the backend via classifyWaste().

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

/** Toggle loading state on the classify button */
function setLoadingUI(loading) {
  const btnText    = DOM.classifyBtn.querySelector('.btn-text');
  const btnLoading = DOM.classifyBtn.querySelector('.btn-loading');
  DOM.classifyBtn.disabled = loading;
  btnText.hidden    =  loading;
  btnLoading.hidden = !loading;
}

/** Animate the 3-step loading panel */
function animateLoadingSteps() {
  const steps = [1, 2, 3];
  steps.forEach(i => $(`step-${i}`)?.classList.remove('active', 'done'));
  $('step-1')?.classList.add('active');

  setTimeout(() => {
    $('step-1')?.classList.replace('active', 'done');
    $('step-2')?.classList.add('active');
  }, 700);
  setTimeout(() => {
    $('step-2')?.classList.replace('active', 'done');
    $('step-3')?.classList.add('active');
  }, 1400);
  setTimeout(() => {
    $('step-3')?.classList.replace('active', 'done');
  }, 2000);
}

/* ══════════════════════════════════════════════════════════════════════════
   RESULT RENDERING
════════════════════════════════════════════════════════════════════════════ */

function renderResult(data) {
  state.currentCategory = data.category;

  // Header
  DOM.resultEmoji.textContent    = data.emoji || '♻️';
  DOM.resultCategory.textContent = data.label || 'Unknown';
  DOM.resultBin.innerHTML        = `<i class="fa-solid fa-trash"></i> Dispose in the <strong>${data.bin_color || 'Segregated'}</strong>`;

  // Apply accent colour
  DOM.resultCategory.style.color = data.color || '#00c9a7';
  DOM.resultEmoji.style.textShadow = `0 0 20px ${data.color}66`;

  // Confidence
  const conf = parseFloat(data.confidence) || 85;
  DOM.confidenceValue.textContent = `${conf}%`;
  DOM.confidenceBar.setAttribute('aria-valuenow', conf);
  requestAnimationFrame(() => { DOM.confidenceBar.style.width = `${conf}%`; });

  // Description & disposal
  DOM.resultDesc.textContent    = data.description || '';
  DOM.disposalText.textContent  = data.disposal    || '';

  // Tips
  DOM.tipsList.innerHTML = (data.tips || [])
    .map(tip => `<li>${tip}</li>`).join('');

  // Examples
  DOM.examplesGrid.innerHTML = (data.examples || [])
    .map(ex => `<span>${ex}</span>`).join('');

  // Impact
  DOM.impactText.textContent = data.impact || '';

  // Detected labels / visual cues
  const labels = data.matched_labels || data.all_labels || [];
  const cuesTitle = data.engine === 'aws_rekognition' ? 'AI Detected Objects:' : '🔍 Visual Cues Detected:';
  const titleEl = document.querySelector('.labels-title');
  if (titleEl) titleEl.textContent = cuesTitle;
  if (labels.length) {
    DOM.labelsWrap.innerHTML = labels.map(l => `<span class="label-chip">${l}</span>`).join('');
    DOM.detectedBlock.hidden = false;
  } else {
    DOM.detectedBlock.hidden = true;
  }

  // Reset tabs
  switchTab('tips');

  showPanel('success');

  // Scroll result into view on mobile
  if (window.innerWidth < 768) {
    document.getElementById('result-panel')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

/* ══════════════════════════════════════════════════════════════════════════
   TABS
════════════════════════════════════════════════════════════════════════════ */

function switchTab(name) {
  state.activeTab = name;
  $$('.tab-btn').forEach(btn => {
    const active = btn.dataset.tab === name;
    btn.classList.toggle('active', active);
    btn.setAttribute('aria-selected', active);
  });
  ['tips','examples','impact'].forEach(tab => {
    const el = $(`tab-${tab}`);
    if (el) el.hidden = tab !== name;
  });
}

/* ══════════════════════════════════════════════════════════════════════════
   SHARE
════════════════════════════════════════════════════════════════════════════ */

async function shareResult() {
  if (!state.currentCategory) return;
  const cat = DEMO_DB[state.currentCategory] || {};
  const text = `♻️ WasteSense AI classified my waste as ${cat.label || state.currentCategory}!\nDispose in the ${cat.bin_color || 'correct bin'}.\n\nCheck it out at WasteSense.ai`;

  if (navigator.share) {
    try { await navigator.share({ title: 'WasteSense AI Result', text }); return; }
    catch { /* fallthrough */ }
  }
  await navigator.clipboard.writeText(text).catch(() => {});
  showToast('📋 Result copied to clipboard!', 'success');
}

/* ══════════════════════════════════════════════════════════════════════════
   NAVIGATION
════════════════════════════════════════════════════════════════════════════ */

function initNavbar() {
  // Hamburger
  DOM.hamburger?.addEventListener('click', () => {
    const open = DOM.navLinks.classList.toggle('open');
    DOM.hamburger.classList.toggle('open', open);
    DOM.hamburger.setAttribute('aria-expanded', open);
    document.body.style.overflow = open ? 'hidden' : '';
  });

  // Close menu on link click
  $$('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      DOM.navLinks.classList.remove('open');
      DOM.hamburger?.classList.remove('open');
      DOM.hamburger?.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });

  // Active link on scroll
  const sections = $$('section[id]');
  const navLinks  = $$('.nav-link');
  const observer  = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        navLinks.forEach(l => l.classList.toggle('active', l.getAttribute('href') === `#${e.target.id}`));
      }
    });
  }, { rootMargin: '-45% 0px -45% 0px' });
  sections.forEach(s => observer.observe(s));

  // Header scroll effect
  window.addEventListener('scroll', () => {
    DOM.header?.classList.toggle('scrolled', window.scrollY > 40);
    DOM.scrollTopBtn?.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });

  // Scroll to top
  DOM.scrollTopBtn?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

/* ══════════════════════════════════════════════════════════════════════════
   SAMPLE BUTTONS
════════════════════════════════════════════════════════════════════════════ */

function initSampleButtons() {
  $$('.sample-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const cat = btn.dataset.category;
      state.demoCategory = cat;
      state.imageFile    = null;

      // Create a canvas placeholder image for preview AND for sending to the backend
      const canvas = document.createElement('canvas');
      canvas.width  = 400; canvas.height = 300;
      const ctx = canvas.getContext('2d');
      const data = DEMO_DB[cat];

      // Gradient background
      const grad = ctx.createLinearGradient(0,0,400,300);
      grad.addColorStop(0, data.color + '33');
      grad.addColorStop(1, data.color + '11');
      ctx.fillStyle = grad;
      ctx.fillRect(0,0,400,300);

      // Emoji
      ctx.font = '100px serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(data.emoji, 200, 120);

      // Label
      ctx.font = 'bold 28px Outfit, sans-serif';
      ctx.fillStyle = data.color;
      ctx.fillText(data.label, 200, 220);

      ctx.font = '16px Outfit, sans-serif';
      ctx.fillStyle = 'rgba(255,255,255,0.5)';
      ctx.fillText('Sample Image', 200, 260);

      // Store as base64 so it gets sent to the real backend API
      const dataUrl = canvas.toDataURL('image/png');
      state.imageBase64 = dataUrl; // will be sent to backend via classifyWaste()

      showPreview(dataUrl);
      enableClassify();
      DOM.uploadHint.textContent = `✅ Sample: ${data.label} — click Classify Waste`;
      showToast(`📷 Sample loaded: ${data.label}`, 'success');
    });
  });
}

/* ══════════════════════════════════════════════════════════════════════════
   EVENT LISTENERS
════════════════════════════════════════════════════════════════════════════ */

function initEventListeners() {
  // Drop zone click
  DOM.dropZone.addEventListener('click', e => {
    if (e.target === DOM.dropZone || e.target.closest('#drop-zone-default')) {
      DOM.fileInput.click();
    }
  });

  // Keyboard accessibility for drop zone
  DOM.dropZone.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); DOM.fileInput.click(); }
  });

  // Browse button
  DOM.browseBtn?.addEventListener('click', e => { e.stopPropagation(); DOM.fileInput.click(); });

  // File input change
  DOM.fileInput.addEventListener('change', e => {
    const file = e.target.files[0];
    if (file) loadImageFile(file);
  });

  // Drag and drop
  DOM.dropZone.addEventListener('dragover', e => { e.preventDefault(); DOM.dropZone.classList.add('drag-over'); });
  DOM.dropZone.addEventListener('dragleave', () => DOM.dropZone.classList.remove('drag-over'));
  DOM.dropZone.addEventListener('drop', e => {
    e.preventDefault();
    DOM.dropZone.classList.remove('drag-over');
    const file = e.dataTransfer.files[0];
    if (file) loadImageFile(file);
  });

  // Paste image
  document.addEventListener('paste', e => {
    const item = [...(e.clipboardData?.items || [])].find(i => i.type.startsWith('image/'));
    if (item) { const file = item.getAsFile(); if (file) loadImageFile(file); }
  });

  // Change image button
  DOM.changeBtn?.addEventListener('click', e => { e.stopPropagation(); DOM.fileInput.click(); });

  // Classify form submit
  DOM.uploadForm.addEventListener('submit', e => { e.preventDefault(); classifyWaste(); });

  // Retry button
  DOM.retryBtn?.addEventListener('click', () => { showPanel('idle'); });

  // Scan again
  DOM.scanAgainBtn?.addEventListener('click', resetUpload);

  // Share
  DOM.shareBtn?.addEventListener('click', shareResult);

  // Tabs
  $$('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => switchTab(btn.dataset.tab));
  });
}

/* ══════════════════════════════════════════════════════════════════════════
   BACKEND STATUS CHECK
════════════════════════════════════════════════════════════════════════════ */

async function checkBackendStatus() {
  try {
    const res = await fetch(`${CONFIG.backendUrl}/`, { signal: AbortSignal.timeout(4_000) });
    if (res.ok) {
      const data = await res.json();
      console.log('✅ Backend connected:', data);
      const engine = data.engine || 'local_ai';

      if (engine === 'aws_rekognition') {
        // AWS mode — show a green success banner
        DOM.demoBanner.style.cssText = 'display:flex;background:rgba(46,204,113,.08);border-color:rgba(46,204,113,.3);color:#2ecc71';
        DOM.demoBanner.innerHTML = `
          <i class="fa-brands fa-aws" aria-hidden="true"></i>
          <strong>AWS Rekognition Active</strong> — Real cloud AI is classifying your waste images.`;
      } else {
        // Local AI mode — show an info banner
        DOM.demoBanner.style.cssText = 'display:flex;background:rgba(0,201,167,.06);border-color:rgba(0,201,167,.25);color:#00c9a7';
        DOM.demoBanner.innerHTML = `
          <i class="fa-solid fa-robot" aria-hidden="true"></i>
          <strong>Local AI Active</strong> — Flask backend is running with real image analysis (PIL + NumPy). No API key needed!`;
      }
    }
  } catch {
    // Backend not running
    DOM.demoBanner.style.cssText = 'display:flex';
    DOM.demoBanner.innerHTML = `
      <i class="fa-solid fa-triangle-exclamation" aria-hidden="true"></i>
      <strong>Backend Offline</strong> — Start the Flask backend to enable AI classification.
      <a href="#how-it-works" class="demo-link">Setup Guide →</a>`;
    console.warn('⚠️ Backend not running. Start with: py backend/app.py');
  }
}


/* ══════════════════════════════════════════════════════════════════════════
   INIT
════════════════════════════════════════════════════════════════════════════ */

/* ══════════════════════════════════════════════════════════════════════════
   TECH STACK TABS
════════════════════════════════════════════════════════════════════════════ */

function initTechTabs() {
  const tabBtns   = $$('.tech-tab-btn');
  const panels    = $$('.tech-panel');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.techTab;

      // Update buttons
      tabBtns.forEach(b => {
        b.classList.toggle('active', b === btn);
        b.setAttribute('aria-selected', b === btn);
      });

      // Update panels
      panels.forEach(panel => {
        const show = panel.id === `tpanel-${target}`;
        panel.hidden = !show;
        panel.classList.toggle('active', show);
      });
    });
  });
}

/* ══════════════════════════════════════════════════════════════════════════
   INIT
════════════════════════════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initEventListeners();
  initSampleButtons();
  initReveal();
  initHeroCounters();
  initImpactCounters();
  initTechTabs();

  // Show initial panel
  showPanel('idle');

  // Check backend
  checkBackendStatus();

  // Smooth entrance for classifier section items
  $$('.classifier-grid > *').forEach((el, i) => {
    el.style.animationDelay = `${i * 0.1}s`;
  });

  console.log('♻️ WasteSense AI Waste Segregation Helper — v1.0.0');
  console.log('🔗 Backend URL:', CONFIG.backendUrl);
});
