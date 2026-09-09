/**
 * Playground Presets & Configuration Data
 * Strictly under 650 LOC.
 */

export interface PlaygroundPreset {
  id: string;
  name: string;
  category: 'GET STARTED' | 'LAYOUT' | 'CREATIVE';
  icon: string;
  html: string;
  css: string;
  js: string;
  controls: {
    preset: string;
    start: string;
    end: string;
    easing: string;
    duration: number;
    triggerElement: string;
    triggerOnce: boolean;
    scrub: boolean;
    markers: boolean;
    translateY: boolean;
    scale: boolean;
    rotate: boolean;
    opacity: boolean;
    stagger: number;
    delay: number;
  };
}

export const PLAYGROUND_PRESETS: PlaygroundPreset[] = [
  {
    id: 'hero-reveal',
    name: 'Hero Reveal',
    category: 'GET STARTED',
    icon: 'play',
    html: `<section class="hero">
  <div class="content">
    <h1 class="title">
      Animate on Scroll,
      <span>Beautifully.</span>
    </h1>
    <p class="subtitle">
      Smooth, performant and modern scroll animations
      with ScrollCraft.
    </p>
    <button class="btn">Get Started</button>
  </div>
</section>`,
    css: `.hero {
  position: relative;
  min-height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 24px;
  background: #0c0e14;
  color: #ffffff;
  border-radius: 16px;
  overflow: hidden;
}

.title {
  font-size: 32px;
  font-weight: 800;
  line-height: 1.2;
}

.title span {
  color: #2563eb;
}

.subtitle {
  font-size: 15px;
  color: #94a3b8;
  margin: 16px 0 24px;
  max-width: 380px;
}

.btn {
  padding: 10px 22px;
  background: #ffffff;
  color: #09090b;
  font-weight: 600;
  font-size: 14px;
  border-radius: 9999px;
  border: none;
  cursor: pointer;
}`,
    js: `import { scrollCraft } from 'scroll-craft'

scrollCraft({
  target: '.hero .content',
  animate: {
    y: [50, 0],
    opacity: [0, 1],
    scale: [0.96, 1],
  },
  trigger: {
    element: '.hero',
    start: 'top 80%',
    end: 'top 20%',
    scrub: true,
    once: false,
  }
})`,
    controls: {
      preset: 'Fade Up',
      start: 'top 80%',
      end: 'top 20%',
      easing: 'easeOut',
      duration: 1.0,
      triggerElement: '.hero',
      triggerOnce: false,
      scrub: true,
      markers: false,
      translateY: true,
      scale: false,
      rotate: false,
      opacity: true,
      stagger: 0,
      delay: 0,
    },
  },
  {
    id: 'staggered-text',
    name: 'Staggered Text',
    category: 'GET STARTED',
    icon: 'text',
    html: `<div class="stagger-container">
  <p class="eyebrow">Awwwards Kinetic Typography</p>
  <h2 class="stagger-heading">
    <span class="word">Crafting</span>
    <span class="word">Fluid</span>
    <span class="word">Digital</span>
    <span class="word">Realms</span>
  </h2>
  <p class="desc">Words enter in cascading sequence on trigger.</p>
</div>`,
    css: `.stagger-container {
  padding: 48px 32px;
  background: #ffffff;
  color: #09090b;
  border-radius: 16px;
  border: 1px solid #e2e8f0;
}

.eyebrow {
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  color: #2563eb;
  letter-spacing: 0.1em;
  margin-bottom: 12px;
}

.stagger-heading {
  font-size: 36px;
  font-weight: 800;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.word {
  display: inline-block;
  color: #09090b;
}

.desc {
  font-size: 14px;
  color: #64748b;
  margin-top: 16px;
}`,
    js: `import { scrollCraft } from 'scroll-craft'

scrollCraft({
  target: '.word',
  animate: {
    y: [40, 0],
    opacity: [0, 1],
  },
  stagger: 0.12,
  duration: 0.8,
  easing: 'easeOut',
  trigger: {
    element: '.stagger-container',
    start: 'top 75%',
    once: true,
  }
})`,
    controls: {
      preset: 'Stagger',
      start: 'top 75%',
      end: 'top 25%',
      easing: 'easeOut',
      duration: 0.8,
      triggerElement: '.stagger-container',
      triggerOnce: true,
      scrub: false,
      markers: false,
      translateY: true,
      scale: false,
      rotate: false,
      opacity: true,
      stagger: 0.12,
      delay: 0,
    },
  },
  {
    id: 'parallax-section',
    name: 'Parallax Section',
    category: 'LAYOUT',
    icon: 'layers',
    html: `<div class="parallax-wrapper">
  <div class="layer-bg"></div>
  <div class="layer-card">
    <span class="badge">Parallax Active</span>
    <h3>Multi-layer Depth</h3>
    <p>Background moves slower than foreground card.</p>
  </div>
</div>`,
    css: `.parallax-wrapper {
  position: relative;
  height: 380px;
  border-radius: 16px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

.layer-bg {
  position: absolute;
  inset: -40px;
  background-image: url('/images/example-hero.jpg');
  background-size: cover;
  background-position: center;
  filter: brightness(0.65);
}

.layer-card {
  position: relative;
  z-index: 10;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(12px);
  padding: 24px 32px;
  border-radius: 16px;
  color: #09090b;
  box-shadow: 0 20px 40px rgba(0,0,0,0.3);
  text-align: center;
}

.badge {
  font-size: 11px;
  font-weight: 700;
  color: #2563eb;
  background: #eff6ff;
  padding: 4px 10px;
  border-radius: 9999px;
}`,
    js: `import { scrollCraft } from 'scroll-craft'

scrollCraft({
  target: '.layer-bg',
  animate: {
    y: [-60, 60],
  },
  scrub: true,
  trigger: {
    element: '.parallax-wrapper',
    start: 'top bottom',
    end: 'bottom top',
  }
})`,
    controls: {
      preset: 'Parallax',
      start: 'top bottom',
      end: 'bottom top',
      easing: 'linear',
      duration: 1.0,
      triggerElement: '.parallax-wrapper',
      triggerOnce: false,
      scrub: true,
      markers: false,
      translateY: true,
      scale: false,
      rotate: false,
      opacity: false,
      stagger: 0,
      delay: 0,
    },
  },
  {
    id: 'scale-scroll',
    name: 'Scale on Scroll',
    category: 'CREATIVE',
    icon: 'box',
    html: `<div class="scale-section">
  <div class="scale-box">
    <div class="inner-badge">Dynamic Scale</div>
    <h2>Zoom Impact</h2>
    <p>Smoothly scales into focus with subpixel precision.</p>
  </div>
</div>`,
    css: `.scale-section {
  min-height: 380px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #090b10;
  border-radius: 16px;
  padding: 32px;
}

.scale-box {
  background: linear-gradient(135deg, #1e293b, #0f172a);
  border: 1px solid #334155;
  border-radius: 20px;
  padding: 36px;
  color: #ffffff;
  text-align: center;
  box-shadow: 0 25px 50px -12px rgba(0,0,0,0.5);
}

.inner-badge {
  font-size: 11px;
  font-weight: 700;
  color: #38bdf8;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-bottom: 8px;
}`,
    js: `import { scrollCraft } from 'scroll-craft'

scrollCraft({
  target: '.scale-box',
  animate: {
    scale: [0.85, 1.08],
    opacity: [0.4, 1],
  },
  scrub: true,
  trigger: {
    element: '.scale-section',
    start: 'top 85%',
    end: 'center center',
  }
})`,
    controls: {
      preset: 'Scale In',
      start: 'top 85%',
      end: 'center center',
      easing: 'easeOut',
      duration: 1.2,
      triggerElement: '.scale-section',
      triggerOnce: false,
      scrub: true,
      markers: false,
      translateY: false,
      scale: true,
      rotate: false,
      opacity: true,
      stagger: 0,
      delay: 0,
    },
  },
];
