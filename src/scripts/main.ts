// Moteur d'animations du site (GSAP + Lenis).
// Les pages déclarent leurs animations avec des attributs data-* ; ce fichier les active.
// Avec la navigation Astro (ClientRouter), tout est ré-initialisé à chaque page
// (« astro:page-load ») et nettoyé avant le changement de page (« astro:before-swap »).
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import Lenis from 'lenis';
import { initForms } from './forms';

gsap.registerPlugin(ScrollTrigger, SplitText);

declare global {
  interface Window {
    __motionReady?: boolean;
  }
}

const html = document.documentElement;
const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
const EASE = 'expo.out';

window.__motionReady = true;

let lenis: Lenis | null = null;
let ctx: gsap.Context | null = null;
let cleanups: Array<() => void> = [];
let curtainCovering = false;
let firstLoad = true;

/* ------------------------------------------------------------------
   Éléments globaux (créés une seule fois)
   ------------------------------------------------------------------ */
function setupLenis() {
  if (reduced) return;
  lenis = new Lenis({ lerp: 0.1, smoothWheel: true, wheelMultiplier: 1 });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => lenis?.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);
}

function setupProgress() {
  const bar = document.querySelector<HTMLElement>('[data-progress]');
  if (!bar) return;
  const update = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.transform = `scaleX(${max > 0 ? window.scrollY / max : 0})`;
  };
  window.addEventListener('scroll', update, { passive: true });
  document.addEventListener('astro:page-load', update);
}

let lastY = 0;
function setupHeaderScroll() {
  const onScroll = () => {
    const header = document.querySelector<HTMLElement>('[data-header]');
    if (!header) return;
    const y = window.scrollY;
    header.classList.toggle('is-scrolled', y > 30);
    const goingDown = y > lastY && y > 400;
    header.classList.toggle('is-hidden', goingDown && !html.classList.contains('menu-open'));
    lastY = y;
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  document.addEventListener('astro:page-load', onScroll);
}

function setupCursor() {
  if (!finePointer || reduced) return;
  const cursor = document.querySelector<HTMLElement>('[data-cursor]');
  const dot = document.querySelector<HTMLElement>('[data-cursor-dot]');
  const label = document.querySelector<HTMLElement>('[data-cursor-label]');
  if (!cursor || !dot || !label) return;

  const xRing = gsap.quickTo(cursor, 'x', { duration: 0.5, ease: 'power3' });
  const yRing = gsap.quickTo(cursor, 'y', { duration: 0.5, ease: 'power3' });
  const xDot = gsap.quickTo(dot, 'x', { duration: 0.08 });
  const yDot = gsap.quickTo(dot, 'y', { duration: 0.08 });
  let visible = false;

  window.addEventListener('pointermove', (e) => {
    if (!visible) {
      gsap.to([cursor, dot], { opacity: 1, duration: 0.3 });
      visible = true;
    }
    xRing(e.clientX);
    yRing(e.clientY);
    xDot(e.clientX);
    yDot(e.clientY);

    const target = e.target as HTMLElement;
    const labelled = target.closest<HTMLElement>('[data-cursor-text]');
    const interactive = target.closest('a, button, summary, input, textarea, select, label, [data-cursor-hover]');
    cursor.classList.toggle('has-label', !!labelled);
    cursor.classList.toggle('is-hover', !labelled && !!interactive);
    label.textContent = labelled?.dataset.cursorText ?? '';
  });
  document.addEventListener('pointerleave', () => {
    gsap.to([cursor, dot], { opacity: 0, duration: 0.3 });
    visible = false;
  });
}

function setupCardGlow() {
  // Halo lumineux qui suit la souris sur les cartes (.card::after).
  if (!finePointer) return;
  document.addEventListener('pointermove', (e) => {
    const card = (e.target as HTMLElement).closest<HTMLElement>('.card');
    if (!card) return;
    const r = card.getBoundingClientRect();
    card.style.setProperty('--mx', `${e.clientX - r.left}px`);
    card.style.setProperty('--my', `${e.clientY - r.top}px`);
  });
}

/* ------------------------------------------------------------------
   Intro (première visite) et transitions entre pages
   ------------------------------------------------------------------ */
function playIntro(): Promise<void> {
  const loader = document.querySelector<HTMLElement>('[data-loader]');
  if (!html.classList.contains('first-visit') || !loader || reduced) return Promise.resolve();
  try {
    sessionStorage.setItem('gfy-intro', '1');
  } catch {}

  const logo = loader.querySelector('.loader-logo');
  const count = loader.querySelector<HTMLElement>('[data-loader-count]');
  const counter = { v: 0 };

  return new Promise((resolve) => {
    const tl = gsap.timeline({
      onComplete: () => {
        html.classList.remove('first-visit');
        gsap.set(loader, { clearProps: 'all' });
      },
    });
    tl.from(logo, { scale: 0.4, rotate: -120, opacity: 0, duration: 1.2, ease: 'expo.out' })
      .to(counter, {
        v: 100,
        duration: 1.3,
        ease: 'power2.inOut',
        onUpdate: () => {
          if (count) count.textContent = String(Math.round(counter.v));
        },
      }, 0.1)
      .to(logo, { scale: 1.15, duration: 0.35, ease: 'power2.in' }, '>-0.1')
      .add(() => resolve(), '>-0.05')
      .to(loader, { clipPath: 'inset(0 0 100% 0)', duration: 1, ease: 'expo.inOut' });
  });
}

function coverCurtain(): Promise<void> {
  const curtain = document.querySelector<HTMLElement>('[data-curtain]');
  if (!curtain || reduced) return Promise.resolve();
  curtainCovering = true;
  const logo = curtain.querySelector('.curtain-logo');
  return new Promise((resolve) => {
    gsap
      .timeline({ onComplete: () => resolve() })
      .fromTo(curtain, { clipPath: 'inset(100% 0 0 0)' }, { clipPath: 'inset(0% 0 0 0)', duration: 0.65, ease: 'expo.inOut' })
      .fromTo(logo, { opacity: 0, scale: 0.6, rotate: -60 }, { opacity: 1, scale: 1, rotate: 0, duration: 0.5, ease: 'back.out(2)' }, '-=0.25');
  });
}

function uncoverCurtain() {
  const curtain = document.querySelector<HTMLElement>('[data-curtain]');
  if (!curtain || !curtainCovering) return;
  curtainCovering = false;
  gsap
    .timeline()
    .to(curtain.querySelector('.curtain-logo'), { opacity: 0, scale: 0.8, duration: 0.25 })
    .to(curtain, { clipPath: 'inset(0 0 100% 0)', duration: 0.8, ease: 'expo.inOut' }, '-=0.05')
    .set(curtain, { clipPath: 'inset(100% 0 0 0)' });
}

/* ------------------------------------------------------------------
   Animations de la page courante
   ------------------------------------------------------------------ */
function initPage() {
  initForms();
  initMenu();
  initAccordions();

  if (reduced) {
    initSliders(false);
    return;
  }

  ctx = gsap.context(() => {
    initSplits();
    initReveals();
    initParallax();
    initCounters();
    initMarquees();
    initScrubWords();
    initHorizontal();
    initDraw();
    initImageReveals();
    initScreens();
    initStacks();
    initFooterGiant();
    initHero();
  });
  initMagnetic();
  initTilt();
  initSliders(true);

  // Les positions changent quand les polices et les images sont chargées.
  document.fonts?.ready.then(() => ScrollTrigger.refresh());
}

function destroyPage() {
  cleanups.forEach((fn) => fn());
  cleanups = [];
  ctx?.revert();
  ctx = null;
  ScrollTrigger.getAll().forEach((t) => t.kill());
}

/* --- Titres découpés en mots / lettres --- */
function initSplits() {
  document.querySelectorAll<HTMLElement>('[data-split]').forEach((el) => {
    if (el.closest('[data-hero]')) return; // géré par la timeline du hero
    const type = el.dataset.split === 'chars' ? 'chars' : 'words';
    gsap.set(el, { visibility: 'visible' });
    SplitText.create(el, {
      type: 'lines,words,chars',
      mask: 'lines',
      autoSplit: true,
      onSplit(self) {
        return gsap.from(self[type], {
          yPercent: 115,
          rotate: type === 'chars' ? 8 : 4,
          duration: 1.2,
          ease: EASE,
          stagger: type === 'chars' ? 0.018 : 0.045,
          scrollTrigger: { trigger: el, start: 'clamp(top 88%)', once: true },
        });
      },
    });
  });
}

/* --- Apparitions en fondu / glissé --- */
function initReveals() {
  document.querySelectorAll<HTMLElement>('[data-reveal]').forEach((el) => {
    if (el.closest('[data-hero]')) return;
    const delay = parseFloat(el.dataset.revealDelay ?? '0');
    gsap.fromTo(
      el,
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 1.2, ease: EASE, delay, scrollTrigger: { trigger: el, start: 'clamp(top 90%)', once: true } },
    );
  });
  document.querySelectorAll<HTMLElement>('[data-reveal-stagger]').forEach((el) => {
    if (el.closest('[data-hero]')) return;
    gsap.fromTo(
      el.children,
      { opacity: 0, y: 60 },
      {
        opacity: 1,
        y: 0,
        duration: 1.1,
        ease: EASE,
        stagger: 0.09,
        scrollTrigger: { trigger: el, start: 'clamp(top 88%)', once: true },
      },
    );
  });
}

/* --- Parallaxe au défilement --- */
function initParallax() {
  document.querySelectorAll<HTMLElement>('[data-parallax]').forEach((el) => {
    const speed = parseFloat(el.dataset.parallax || '0.2');
    gsap.fromTo(
      el,
      { yPercent: speed * 50 },
      {
        yPercent: -speed * 50,
        ease: 'none',
        scrollTrigger: { trigger: el.parentElement ?? el, start: 'top bottom', end: 'bottom top', scrub: true },
      },
    );
  });
}

/* --- Compteurs animés --- */
function initCounters() {
  document.querySelectorAll<HTMLElement>('[data-counter]').forEach((el) => {
    const end = parseFloat(el.dataset.counter || '0');
    const obj = { v: 0 };
    el.textContent = '0';
    gsap.to(obj, {
      v: end,
      duration: 2.2,
      delay: el.closest('[data-hero]') ? heroDelay + 0.6 : 0,
      ease: 'power3.out',
      onUpdate: () => (el.textContent = String(Math.round(obj.v))),
      scrollTrigger: { trigger: el, start: 'clamp(top 92%)', once: true },
    });
  });
}

/* --- Bandeaux défilants (vitesse liée au scroll) --- */
function initMarquees() {
  document.querySelectorAll<HTMLElement>('[data-marquee]').forEach((el) => {
    const track = el.querySelector<HTMLElement>('[data-marquee-track]');
    if (!track) return;
    const dir = el.dataset.marquee === 'reverse' ? 1 : -1;
    const duration = parseFloat(el.dataset.marqueeDuration || '30');
    const tween = gsap.fromTo(
      track,
      { xPercent: dir === -1 ? 0 : -50 },
      { xPercent: dir === -1 ? -50 : 0, duration, ease: 'none', repeat: -1 },
    );
    ScrollTrigger.create({
      trigger: el,
      start: 'top bottom',
      end: 'bottom top',
      onUpdate: (self) => {
        const boost = 1 + Math.min(Math.abs(self.getVelocity()) / 400, 4);
        gsap.to(tween, { timeScale: boost, duration: 0.2, overwrite: true });
        gsap.to(tween, { timeScale: 1, duration: 1.2, delay: 0.2, ease: 'power2.out' });
      },
    });
  });
}

/* --- Texte dont les mots s'illuminent au défilement --- */
function initScrubWords() {
  document.querySelectorAll<HTMLElement>('[data-scrub-words]').forEach((el) => {
    const split = SplitText.create(el, { type: 'words' });
    gsap.fromTo(
      split.words,
      { opacity: 0.14 },
      {
        opacity: 1,
        stagger: 0.1,
        ease: 'none',
        scrollTrigger: { trigger: el, start: 'top 80%', end: 'bottom 45%', scrub: true },
      },
    );
  });
}

/* --- Section épinglée qui défile à l'horizontale (ordinateur uniquement) --- */
function initHorizontal() {
  const mm = gsap.matchMedia();
  mm.add('(min-width: 1024px)', () => {
    document.querySelectorAll<HTMLElement>('[data-hscroll]').forEach((section) => {
      const track = section.querySelector<HTMLElement>('[data-hscroll-track]');
      const bar = section.querySelector<HTMLElement>('[data-hscroll-bar]');
      if (!track) return;
      const distance = () => Math.max(0, track.scrollWidth - track.clientWidth);
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: () => `+=${distance()}`,
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
        },
      });
      tl.to(track, { x: () => -distance(), ease: 'none' }, 0);
      if (bar) tl.fromTo(bar, { scaleX: 0 }, { scaleX: 1, ease: 'none' }, 0);
    });
  });
}

/* --- Tracés SVG qui se dessinent --- */
function initDraw() {
  document.querySelectorAll<SVGPathElement>('[data-draw]').forEach((path) => {
    const length = path.getTotalLength();
    gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });
    const scrub = path.dataset.draw !== 'once';
    gsap.to(path, {
      strokeDashoffset: 0,
      ease: 'none',
      duration: scrub ? undefined : 1.6,
      scrollTrigger: scrub
        ? { trigger: path.closest('[data-draw-scope]') ?? path, start: 'top 70%', end: 'bottom 60%', scrub: true }
        : { trigger: path, start: 'clamp(top 90%)', once: true },
    });
  });
  // Icônes dont les traits se dessinent à l'apparition
  document.querySelectorAll<HTMLElement>('[data-draw-icon]').forEach((wrap) => {
    const shapes = wrap.querySelectorAll<SVGGeometryElement>('path, circle, rect');
    shapes.forEach((s) => {
      const len = s.getTotalLength?.() ?? 100;
      gsap.set(s, { strokeDasharray: len, strokeDashoffset: len });
    });
    gsap.to(shapes, {
      strokeDashoffset: 0,
      duration: 1.4,
      ease: 'power2.inOut',
      stagger: 0.12,
      scrollTrigger: { trigger: wrap, start: 'clamp(top 92%)', once: true },
    });
  });
}

/* --- Images dévoilées derrière un masque --- */
function initImageReveals() {
  document.querySelectorAll<HTMLElement>('[data-img-reveal]').forEach((el) => {
    const img = el.querySelector('img');
    const tl = gsap.timeline({ scrollTrigger: { trigger: el, start: 'clamp(top 85%)', once: true } });
    tl.fromTo(el, { clipPath: 'inset(100% 0% 0% 0% round 22px)' }, { clipPath: 'inset(0% 0% 0% 0% round 22px)', duration: 1.4, ease: 'expo.inOut' });
    if (img) tl.fromTo(img, { scale: 1.35 }, { scale: 1, duration: 1.8, ease: EASE }, 0);
  });
}

/* --- Captures d'écran qui défilent dans un cadre de navigateur --- */
function initScreens() {
  document.querySelectorAll<HTMLElement>('[data-screen]').forEach((frame) => {
    const img = frame.querySelector<HTMLElement>('img');
    if (!img) return;
    const shift = () => Math.max(0, img.offsetHeight - frame.clientHeight);
    if (frame.dataset.screen === 'scroll') {
      gsap.to(img, {
        y: () => -shift(),
        ease: 'none',
        scrollTrigger: {
          trigger: frame.closest('[data-screen-scope]') ?? frame,
          start: 'top 75%',
          end: 'bottom 25%',
          scrub: 1,
          invalidateOnRefresh: true,
        },
      });
    } else {
      const host = frame.closest<HTMLElement>('[data-screen-host]') ?? frame;
      const enter = () => gsap.to(img, { y: -shift(), duration: Math.max(2, shift() / 400), ease: 'power1.inOut', overwrite: true });
      const leave = () => gsap.to(img, { y: 0, duration: 1.2, ease: 'power3.out', overwrite: true });
      host.addEventListener('mouseenter', enter);
      host.addEventListener('mouseleave', leave);
      cleanups.push(() => {
        host.removeEventListener('mouseenter', enter);
        host.removeEventListener('mouseleave', leave);
      });
    }
  });
}

/* --- Cartes empilées (la précédente recule quand la suivante arrive) --- */
function initStacks() {
  document.querySelectorAll<HTMLElement>('[data-stack]').forEach((stack) => {
    const items = gsap.utils.toArray<HTMLElement>('[data-stack-item]', stack);
    items.forEach((item, i) => {
      const next = items[i + 1];
      if (!next) return;
      gsap.to(item.firstElementChild, {
        scale: 0.9,
        opacity: 0.35,
        filter: 'blur(2px)',
        ease: 'none',
        scrollTrigger: { trigger: next, start: 'top bottom', end: 'top 20%', scrub: true },
      });
    });
  });
}

/* --- Grand logo du pied de page --- */
function initFooterGiant() {
  const giant = document.querySelector<HTMLElement>('[data-footer-giant]');
  if (!giant) return;
  gsap.fromTo(
    giant,
    { yPercent: 70, opacity: 0 },
    {
      yPercent: 0,
      opacity: 1,
      ease: 'none',
      scrollTrigger: { trigger: giant, start: 'top bottom', end: 'bottom bottom', scrub: true },
    },
  );
}

/* --- Hero : timeline d'entrée + profondeur à la souris --- */
let heroDelay = 0;
function initHero() {
  const hero = document.querySelector<HTMLElement>('[data-hero]');
  if (!hero) return;

  const tl = gsap.timeline({ delay: heroDelay, defaults: { ease: EASE } });
  hero.querySelectorAll<HTMLElement>('[data-split]').forEach((el, i) => {
    gsap.set(el, { visibility: 'visible' });
    const type = el.dataset.split === 'chars' ? 'chars' : 'words';
    const split = SplitText.create(el, { type: 'lines,words,chars', mask: 'lines' });
    tl.from(split[type], { yPercent: 120, rotate: type === 'chars' ? 10 : 5, duration: 1.4, stagger: type === 'chars' ? 0.025 : 0.06 }, i * 0.12);
  });
  // Texte en dégradé : il monte d'un bloc derrière un masque (le découpage casserait le dégradé).
  tl.from(hero.querySelectorAll('[data-mask-up]'), { yPercent: 110, duration: 1.4 }, 0);
  const reveals = hero.querySelectorAll<HTMLElement>('[data-reveal]');
  tl.fromTo(reveals, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 1.2, stagger: 0.1 }, 0.45);
  hero.querySelectorAll<HTMLElement>('[data-reveal-stagger]').forEach((group) => {
    tl.fromTo(group.children, { opacity: 0, y: 40, scale: 0.9 }, { opacity: 1, y: 0, scale: 1, duration: 1.2, stagger: 0.08 }, 0.6);
  });

  // Pile de visuels qui tourne automatiquement
  const cards = gsap.utils.toArray<HTMLElement>('[data-hero-card]', hero);
  if (cards.length) {
    tl.from(cards, { y: 160, rotate: (i) => (i - 1.5) * 18, opacity: 0, duration: 1.6, stagger: 0.12 }, 0.3);
    let order = cards.slice();
    const layout = (animate: boolean) => {
      order.forEach((card, i) => {
        const props = { x: i * 26, y: i * -22, rotate: i * 4 - 2, scale: 1 - i * 0.06, zIndex: cards.length - i, opacity: i > 2 ? 0 : 1 - i * 0.18 };
        animate ? gsap.to(card, { ...props, duration: 1.2, ease: 'expo.inOut' }) : gsap.set(card, props);
      });
    };
    layout(false);
    const cycle = gsap.delayedCall(4, function next() {
      const first = order.shift()!;
      gsap.to(first, { y: 80, opacity: 0, rotate: -12, duration: 0.6, ease: 'power3.in', onComplete: () => layout(true) });
      order.push(first);
      cycle.restart(true);
    });
    cleanups.push(() => cycle.kill());
  }

  // Objets flottants
  hero.querySelectorAll<HTMLElement>('[data-float]').forEach((el, i) => {
    gsap.to(el, { y: '+=18', rotate: i % 2 ? 4 : -4, duration: 3 + i * 0.6, ease: 'sine.inOut', yoyo: true, repeat: -1 });
  });

  // Blobs de l'aurore
  hero.querySelectorAll<HTMLElement>('.aurora span').forEach((blob, i) => {
    gsap.to(blob, { xPercent: i % 2 ? -18 : 22, yPercent: i % 2 ? 14 : -10, duration: 9 + i * 2, ease: 'sine.inOut', yoyo: true, repeat: -1 });
  });

  // Profondeur à la souris
  if (finePointer) {
    const layers = gsap.utils.toArray<HTMLElement>('[data-depth]', hero).map((el) => ({
      d: parseFloat(el.dataset.depth || '0.05'),
      x: gsap.quickTo(el, 'x', { duration: 1.2, ease: 'power3' }),
      y: gsap.quickTo(el, 'y', { duration: 1.2, ease: 'power3' }),
    }));
    const move = (e: PointerEvent) => {
      const nx = e.clientX / window.innerWidth - 0.5;
      const ny = e.clientY / window.innerHeight - 0.5;
      layers.forEach((l) => {
        l.x(nx * l.d * 600);
        l.y(ny * l.d * 600);
      });
    };
    hero.addEventListener('pointermove', move);
    cleanups.push(() => hero.removeEventListener('pointermove', move));
  }

  // Le hero s'estompe et recule en sortant de l'écran
  const content = hero.querySelector('[data-hero-content]');
  if (content) {
    gsap.to(content, {
      yPercent: -18,
      opacity: 0.2,
      ease: 'none',
      scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true },
    });
  }
}

/* --- Boutons magnétiques --- */
function initMagnetic() {
  if (!finePointer) return;
  document.querySelectorAll<HTMLElement>('[data-magnetic]').forEach((el) => {
    const strength = parseFloat(el.dataset.magnetic || '0.4') || 0.4;
    const x = gsap.quickTo(el, 'x', { duration: 0.6, ease: 'power3' });
    const y = gsap.quickTo(el, 'y', { duration: 0.6, ease: 'power3' });
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      x((e.clientX - (r.left + r.width / 2)) * strength);
      y((e.clientY - (r.top + r.height / 2)) * strength);
    };
    const leave = () => gsap.to(el, { x: 0, y: 0, duration: 1, ease: 'elastic.out(1, 0.35)' });
    el.addEventListener('pointermove', move);
    el.addEventListener('pointerleave', leave);
    cleanups.push(() => {
      el.removeEventListener('pointermove', move);
      el.removeEventListener('pointerleave', leave);
      gsap.set(el, { clearProps: 'transform' });
    });
  });
}

/* --- Inclinaison 3D des cartes --- */
function initTilt() {
  if (!finePointer) return;
  document.querySelectorAll<HTMLElement>('[data-tilt]').forEach((el) => {
    gsap.set(el, { transformPerspective: 900 });
    const rx = gsap.quickTo(el, 'rotationX', { duration: 0.6, ease: 'power3' });
    const ry = gsap.quickTo(el, 'rotationY', { duration: 0.6, ease: 'power3' });
    const max = parseFloat(el.dataset.tilt || '8') || 8;
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      ry(((e.clientX - r.left) / r.width - 0.5) * max * 2);
      rx(-((e.clientY - r.top) / r.height - 0.5) * max * 2);
    };
    const leave = () => {
      rx(0);
      ry(0);
    };
    el.addEventListener('pointermove', move);
    el.addEventListener('pointerleave', leave);
    cleanups.push(() => {
      el.removeEventListener('pointermove', move);
      el.removeEventListener('pointerleave', leave);
    });
  });
}

/* --- Carrousel de témoignages --- */
function initSliders(animated: boolean) {
  document.querySelectorAll<HTMLElement>('[data-slider]').forEach((slider) => {
    const slides = Array.from(slider.querySelectorAll<HTMLElement>('[data-slide]'));
    const dots = Array.from(slider.querySelectorAll<HTMLButtonElement>('[data-slide-dot]'));
    const bar = slider.querySelector<HTMLElement>('[data-slide-bar]');
    if (slides.length < 2) return;
    let index = 0;
    let timer: gsap.core.Tween | null = null;

    const show = (next: number) => {
      const prev = slides[index];
      index = (next + slides.length) % slides.length;
      const cur = slides[index];
      slides.forEach((s) => s.setAttribute('aria-hidden', String(s !== cur)));
      dots.forEach((d, i) => d.setAttribute('aria-current', String(i === index)));
      if (animated) {
        gsap.to(prev, { opacity: 0, y: -30, duration: 0.6, ease: 'power3.in' });
        gsap.fromTo(cur, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 1, delay: 0.45, ease: EASE });
        gsap.fromTo(cur.querySelectorAll('[data-slide-anim]'), { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.9, delay: 0.6, stagger: 0.08, ease: EASE });
      } else {
        slides.forEach((s) => (s.style.opacity = s === cur ? '1' : '0'));
      }
      restart();
    };
    const restart = () => {
      timer?.kill();
      if (!animated || !bar) return;
      timer = gsap.fromTo(bar, { scaleX: 0 }, { scaleX: 1, duration: 7, ease: 'none', onComplete: () => show(index + 1) });
    };

    slides.forEach((s, i) => {
      s.style.opacity = i === 0 ? '1' : '0';
      s.setAttribute('aria-hidden', String(i !== 0));
    });
    const onClick = (e: Event) => {
      const t = (e.target as HTMLElement).closest<HTMLElement>('[data-slide-prev], [data-slide-next], [data-slide-dot]');
      if (!t) return;
      if (t.hasAttribute('data-slide-prev')) show(index - 1);
      else if (t.hasAttribute('data-slide-next')) show(index + 1);
      else show(dots.indexOf(t as HTMLButtonElement));
    };
    slider.addEventListener('click', onClick);
    restart();
    cleanups.push(() => {
      timer?.kill();
      slider.removeEventListener('click', onClick);
    });
  });
}

/* --- FAQ en accordéon (balises <details> animées) --- */
function initAccordions() {
  document.querySelectorAll<HTMLDetailsElement>('details[data-accordion]').forEach((d) => {
    const summary = d.querySelector('summary');
    const body = d.querySelector<HTMLElement>('[data-accordion-body]');
    if (!summary || !body) return;
    const onClick = (e: Event) => {
      if (reduced) return;
      e.preventDefault();
      if (d.open) {
        gsap.to(body, { height: 0, opacity: 0, duration: 0.5, ease: 'power3.inOut', onComplete: () => d.removeAttribute('open') });
        d.classList.remove('is-open');
      } else {
        d.setAttribute('open', '');
        d.classList.add('is-open');
        gsap.fromTo(body, { height: 0, opacity: 0 }, { height: 'auto', opacity: 1, duration: 0.6, ease: 'power3.out', onComplete: () => ScrollTrigger.refresh() });
      }
    };
    summary.addEventListener('click', onClick);
    cleanups.push(() => summary.removeEventListener('click', onClick));
  });
}

/* --- Menu mobile --- */
function initMenu() {
  const toggle = document.querySelector<HTMLButtonElement>('[data-menu-toggle]');
  const menu = document.querySelector<HTMLElement>('[data-menu]');
  if (!toggle || !menu) return;
  const bg = menu.querySelector('.mobile-menu-bg');
  const links = menu.querySelectorAll('[data-menu-link]');
  const tl = gsap
    .timeline({ paused: true, defaults: { ease: 'expo.inOut' } })
    .set(menu, { visibility: 'visible' })
    .fromTo(bg, { clipPath: 'circle(0% at calc(100% - 3rem) 2.4rem)' }, { clipPath: 'circle(150% at calc(100% - 3rem) 2.4rem)', duration: 0.9 })
    .fromTo(links, { y: 60, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.06, duration: 0.8, ease: EASE }, 0.35);

  const setOpen = (open: boolean) => {
    html.classList.toggle('menu-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Fermer le menu' : 'Ouvrir le menu');
    menu.setAttribute('aria-hidden', String(!open));
    if (open) {
      lenis?.stop();
      reduced ? tl.progress(1) : tl.timeScale(1).play();
    } else {
      lenis?.start();
      reduced ? tl.progress(0) : tl.timeScale(1.6).reverse();
    }
  };
  const onToggle = () => setOpen(!html.classList.contains('menu-open'));
  const onKey = (e: KeyboardEvent) => e.key === 'Escape' && html.classList.contains('menu-open') && setOpen(false);
  toggle.addEventListener('click', onToggle);
  document.addEventListener('keydown', onKey);
  cleanups.push(() => {
    toggle.removeEventListener('click', onToggle);
    document.removeEventListener('keydown', onKey);
    html.classList.remove('menu-open');
    lenis?.start();
    tl.kill();
  });
}

/* ------------------------------------------------------------------
   Cycle de vie avec la navigation Astro
   ------------------------------------------------------------------ */
setupLenis();
setupProgress();
setupHeaderScroll();
setupCursor();
setupCardGlow();

document.addEventListener('astro:before-preparation', (event) => {
  if (reduced) return;
  const e = event as Event & { loader: () => Promise<void> };
  const original = e.loader;
  e.loader = async () => {
    await Promise.all([coverCurtain(), original()]);
  };
});

document.addEventListener('astro:before-swap', () => destroyPage());

document.addEventListener('astro:after-swap', () => {
  if (!reduced) html.classList.add('motion');
  lenis?.scrollTo(0, { immediate: true, force: true });
});

document.addEventListener('astro:page-load', () => {
  if (firstLoad) {
    firstLoad = false;
    // Première page : si l'intro se joue, le hero démarre pendant que le rideau se lève.
    const intro = html.classList.contains('first-visit') && !reduced;
    heroDelay = intro ? 1.85 : 0.15;
    playIntro();
    initPage();
    return;
  }
  heroDelay = curtainCovering ? 0.4 : 0.1;
  initPage();
  uncoverCurtain();
});
