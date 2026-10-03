import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { FLAVORS, TOTAL, F } from '../data/flavors.js';
import { clamp } from './utils.js';
import { makeParticles, createCanvasRenderer } from './particles.js';

gsap.registerPlugin(ScrollTrigger);

// Fit each giant flavor word (and the finale headline) to the viewport width.
export function fitWords(root) {
  const scenes = [...root.querySelectorAll('.scene')];
  FLAVORS.forEach((f, i) => {
    const w = scenes[i].querySelector('.word');
    const probe = w.cloneNode(true);
    probe.style.cssText = 'position:fixed;left:0;top:0;visibility:hidden;font-size:100px;display:inline-flex;justify-content:flex-start;right:auto;letter-spacing:.005em';
    document.body.appendChild(probe);
    const w100 = probe.getBoundingClientRect().width; probe.remove();
    w.style.fontSize = Math.min(innerWidth * 0.96 / w100 * 100, innerHeight * (innerWidth < innerHeight ? .42 : .66)) + 'px';
  });
  const fw = root.querySelector('#fword'); fw.style.fontSize = '';
  const cs = parseFloat(getComputedStyle(fw).fontSize), mw = Math.max(...[...fw.children].map((l) => l.offsetWidth));
  if (mw) fw.style.fontSize = Math.min(cs, cs * innerWidth * .92 / mw) + 'px';
}

function buildTimeline(root) {
  const q1 = (s, r = root) => r.querySelector(s);
  const tl = gsap.timeline({ paused: true, defaults: { overwrite: false } });
  const ft = (t, from, to, at) => tl.fromTo(t, from, Object.assign({ immediateRender: false }, to), at);
  tl.set({}, {}, TOTAL);

  const scenes = [...root.querySelectorAll('.scene')];
  const wash = q1('#wash'), finale = q1('#finale');
  gsap.set(finale, { autoAlpha: 0 });
  gsap.set(wash, { opacity: 0 });

  FLAVORS.forEach((f, i) => {
    const S = i * 10, sc = scenes[i];
    const q = (s) => sc.querySelector(s), qa = (s) => [...sc.querySelectorAll(s)];
    const world = q('.world'), hero = q('.hero'), dwrap = q('.dwrap'), word = q('.word');
    const inner = qa('.word .ch i'), chs = qa('.word .ch'), blur = q1(`#mb${i} feGaussianBlur`);
    const trail = q('.trail'), pool = q('.pool'), glow = q('.dglow'), shine = q('.shine');
    const splash = q('.splash') || q('.flood');
    const spans = qa('.ln span'), kick = q('.kick'), sub = q('.sub');
    const sign = i % 2 ? -1 : 1;

    gsap.set(sc, { autoAlpha: i === 0 ? 1 : 0 });
    if (i > 0) tl.set(sc, { autoAlpha: 1 }, S - .25);
    tl.set(sc, { autoAlpha: 0 }, S + 9.75);

    gsap.set(dwrap, { xPercent: -50, yPercent: -50, y: '112vh', scale: .7, rotationZ: -14, rotationY: 50, transformPerspective: 1300 });
    gsap.set([trail, pool, splash], { xPercent: -50 });
    gsap.set(trail, { scaleY: .05, opacity: 0, transformOrigin: '50% 0%' });
    gsap.set(pool, { yPercent: -50, scaleX: 0, opacity: 0 });
    if (f.flood) gsap.set(splash, { xPercent: 0, yPercent: 100, opacity: 1 }); else gsap.set(splash, { yPercent: -50, scale: .25, opacity: 0, rotation: -10 });
    gsap.set(inner, { yPercent: 115, opacity: 0, scale: 1.5 }); gsap.set(chs, { filter: 'blur(22px)' });
    gsap.set(spans, { yPercent: 110 }); gsap.set([kick, sub], { opacity: 0 });
    gsap.set(qa('.fp'), { opacity: 0 });
    gsap.set(hero, { scale: i === 0 ? 1 : 3.2, rotation: i === 0 ? -3 : -18, filter: 'blur(0px)' });
    gsap.set(word, { yPercent: -50 });

    // entry: hero swells in from the colour wash
    if (i > 0) ft(hero, { scale: 3.2, rotation: -18, filter: 'blur(14px)' }, { scale: 1, rotation: -3, filter: 'blur(0px)', duration: 1.15, ease: 'power3.out' }, S - .1);
    ft(hero, { scale: 1, rotation: -3 }, { scale: 1.07, rotation: 2, duration: 1.4, ease: 'none' }, S + 1.05);

    // camera
    ft(world, { scale: 1 }, { scale: 1.08, duration: 2.4, ease: 'none' }, S);
    ft(world, { scale: 1.08 }, { scale: .94, duration: 4.6, ease: 'power2.out' }, S + 2.4);
    ft(world, { scale: .94 }, { scale: 1.05, duration: 2.6, ease: 'power1.in' }, S + 7.1);
    if (f.burst) tl.to(world, { keyframes: { x: [0, -12, 14, -9, 7, 0], y: [0, 7, -9, 5, -3, 0] }, duration: .8, ease: 'none', immediateRender: false }, S + 2.2);

    // hero: rise, or push through for lime
    if (f.push) {
      ft(hero, { scale: 1.07, rotation: 2 }, { scale: 2.9, rotation: -6, duration: 1.5, ease: 'power2.in' }, S + 1.95);
      ft(hero, { opacity: 1 }, { opacity: 0, duration: .7, ease: 'power1.in' }, S + 2.85);
      ft(hero, { scale: .3, y: '-36vh', rotation: f.rB, opacity: 0 }, { scale: .42, opacity: 1, duration: 1.5, ease: 'power2.out' }, S + 4.2);
    } else {
      ft(hero, { scale: 1.07, rotation: 2, y: '0vh' }, { scale: .42, rotation: f.rB, y: '-36vh', duration: 3.2, ease: 'power3.inOut' }, S + (f.burst ? 2.1 : 2.4));
    }
    ft(hero, { y: '-36vh', rotation: f.rB }, { y: '-38vh', rotation: f.rB + 6, duration: 2.8, ease: 'sine.inOut' }, S + 5.6);
    ft(hero, { scale: .42, y: '-38vh', rotation: f.rB + 6, filter: 'blur(0px)' }, { scale: 9, y: '6vh', rotation: f.rB + 40, filter: 'blur(10px)', duration: 1.5, ease: 'power3.in' }, S + 8.4);
    qa('.hp').forEach((hp, k) => {
      if (k === f.hero.length - 1) return;
      const im = hp.querySelector('img'), dir = f.hero[k][2] >= 0 ? 1 : -1, mult = f.burst ? 1.5 : 1;
      ft(im, { xPercent: 0, yPercent: 0, rotation: 0, scale: 1 }, { xPercent: dir * 70 * mult, yPercent: (k % 2 ? -1 : 1) * 40 * mult, rotation: dir * 30, scale: 1.15, duration: 1.8, ease: 'power3.out' }, S + (f.burst ? 2.1 : 2.4) + k * .12);
    });

    // liquid
    ft(trail, { scaleY: .05, opacity: 0 }, { scaleY: 1, opacity: .95, duration: 1.4, ease: 'power2.out' }, S + 2.5);
    ft(trail, { opacity: .95 }, { opacity: 0, duration: 1.4, ease: 'power1.in' }, S + 4.8);
    if (f.flood) {
      ft(splash, { yPercent: 100 }, { yPercent: 0, duration: 2.7, ease: 'power2.out' }, S + 2.4);
      ft(splash, { yPercent: 0 }, { yPercent: 115, duration: 1.2, ease: 'power2.in' }, S + 8.4);
    } else {
      const d = f.burst ? 1.5 : 2.2, st = f.burst ? S + 2.2 : S + 2.8;
      ft(splash, { scale: f.burst ? .1 : .25, opacity: 0, rotation: -10 }, { scale: f.burst ? 1.3 : 1, opacity: 1, rotation: 0, duration: d, ease: 'power3.out' }, st);
      ft(splash, { scale: f.burst ? 1.3 : 1, rotation: 0 }, { scale: 1.2, rotation: 5, duration: 3.4, ease: 'none' }, st + d);
      ft(splash, { opacity: 1, scale: 1.2 }, { opacity: 0, scale: 1.4, duration: .9, ease: 'power2.in' }, S + 8.4);
    }
    ft(pool, { scaleX: 0, opacity: 0 }, { scaleX: 1, opacity: .95, duration: 1.7, ease: 'power3.out' }, S + 3.6);
    ft(pool, { opacity: .95 }, { opacity: 0, duration: .9, ease: 'power2.in' }, S + 8.4);

    // drink emergence
    ft(dwrap, { y: '112vh', scale: .7, rotationZ: -14, rotationY: 50 }, { y: '0vh', scale: 1, rotationZ: 0, rotationY: -8, duration: 2.5, ease: 'back.out(1.35)' }, S + 3.0);
    ft(dwrap, { y: '0vh', scale: 1, rotationZ: 0, rotationY: -8 }, { y: '-2.5vh', scale: 1.04, rotationZ: 3, rotationY: 16, duration: 2.7, ease: 'sine.inOut' }, S + 5.5);
    ft(dwrap, { y: '-2.5vh', scale: 1.04, rotationZ: 3, rotationY: 16 }, { y: '-118vh', scale: 1.14, rotationZ: 9, rotationY: 30, duration: 1.5, ease: 'power2.in' }, S + 8.2);
    ft(blur, { attr: { stdDeviation: '0 20' } }, { attr: { stdDeviation: '0 0' }, duration: 2.0, ease: 'power2.out' }, S + 3.0);
    ft(blur, { attr: { stdDeviation: '0 0' } }, { attr: { stdDeviation: '0 24' }, duration: 1.3, ease: 'power2.in' }, S + 8.3);
    ft(glow, { opacity: 0 }, { opacity: i === 2 ? 1 : .8, duration: 1.6, ease: 'power2.out' }, S + 3.4);
    ft(glow, { opacity: i === 2 ? 1 : .8 }, { opacity: 0, duration: 1, ease: 'power2.in' }, S + 8.4);
    ft(shine, { '--sx': '-30%' }, { '--sx': '130%', duration: 5, ease: 'none' }, S + 3.4);

    // typography
    inner.forEach((c, k) => { const d = k % 2 ? 1 : -1; gsap.set(c, { rotation: d * 14, x: d * innerWidth * .06 }); });
    ft(inner, {}, { yPercent: 0, rotation: 0, x: 0, scale: 1, opacity: 1, duration: 1.5, ease: 'power4.out', stagger: .09 }, S + 3.3);
    ft(chs, {}, { filter: 'blur(0px)', duration: 1.3, ease: 'power3.out', stagger: .09 }, S + 3.3);
    ft(word, { letterSpacing: '0.32em' }, { letterSpacing: '0.005em', duration: 3.2, ease: 'power2.out' }, S + 3.3);
    ft(word, { x: -sign * 4 + 'vw' }, { x: sign * 4 + 'vw', duration: 5.6, ease: 'none' }, S + 3.3);
    ft(inner, { yPercent: 0, opacity: 1 }, { yPercent: -120, opacity: 0, duration: .9, ease: 'power3.in', stagger: { each: .05, from: 'center' } }, S + 8.2);
    ft(chs, { filter: 'blur(0px)' }, { filter: 'blur(16px)', duration: .9, ease: 'power3.in', stagger: { each: .05, from: 'center' } }, S + 8.2);
    ft(spans, { yPercent: 110 }, { yPercent: 0, duration: 1.0, ease: 'power4.out', stagger: .14 }, S + 4.4);
    ft([kick, sub], { opacity: 0 }, { opacity: 1, duration: .8, ease: 'power2.out', stagger: .3 }, S + 4.6);
    ft(spans, { yPercent: 0 }, { yPercent: -110, duration: .7, ease: 'power3.in', stagger: .08 }, S + 7.9);
    ft([kick, sub], { opacity: 1 }, { opacity: 0, duration: .5 }, S + 7.8);

    // parallax
    ft(q('.rays'), { rotation: 0 }, { rotation: 40, duration: 10, ease: 'none' }, S);
    ft(q('.g2'), { y: '0vh' }, { y: '-12vh', duration: 10, ease: 'none' }, S);
    ft(q('.g1'), { y: '4vh', scale: .95 }, { y: '-4vh', scale: 1.1, duration: 10, ease: 'none' }, S);
    qa('.fp').forEach((fp, k) => {
      const o = f.front[k];
      ft(fp, { y: o[3] + 'vh', rotation: 0 }, { y: o[4] + 'vh', rotation: o[5], duration: f.burst ? 6.5 : 7.5, ease: 'none' }, S + 2.0 + k * .4);
      ft(fp, { opacity: 0 }, { opacity: .95, duration: .8 }, S + 2.0 + k * .4);
      ft(fp, { opacity: .95 }, { opacity: 0, duration: .8 }, S + 8.6 + k * .1);
    });

    // orbiting slices
    const orbs = qa('.orb'), st = { a: 0, r: 0 };
    const turns = f.burst ? 1.6 : (f.push ? 1.4 : 1.1);
    const render = () => {
      const rx = Math.min(innerWidth * .42, innerHeight * .64), ry = innerHeight * .13;
      orbs.forEach((o, k) => {
        const n = orbs.length, ang = st.a * (1 + (k % 3) * .12) + k / n * 6.283, depth = Math.sin(ang);
        const x = Math.cos(ang) * rx * st.r * (.85 + (k % 3) * .15), y = depth * ry * st.r + Math.sin(ang * .5 + k * 2.1) * innerHeight * .17 * st.r;
        const s = .78 + .3 * (depth * .5 + .5);
        o.style.transform = `translate(${x.toFixed(1)}px,${y.toFixed(1)}px) rotate(${(ang * 57.3 * .6).toFixed(1)}deg) scale(${s.toFixed(3)})`;
        o.style.zIndex = depth > 0 ? 6 : 4; o.style.opacity = clamp(st.r * 1.6, 0, 1) * (depth > 0 ? 1 : .8);
      });
    };
    ft(st, { a: 0 }, { a: Math.PI * 2 * turns, duration: 5.0, ease: 'none', onUpdate: render }, S + 4.4);
    ft(st, { r: 0 }, { r: 1, duration: 1.5, ease: 'power2.out', onUpdate: render }, S + 4.4);
    ft(st, { r: 1 }, { r: 0, duration: .9, ease: 'power2.in', onUpdate: render }, S + 8.4);

    // flood-the-screen transition
    const next = i < 3 ? FLAVORS[i + 1].wash : '#0a0510';
    ft(wash, { opacity: 0, backgroundColor: f.wash }, { opacity: 1, duration: .65, ease: 'power2.in' }, S + 8.9);
    ft(wash, { backgroundColor: f.wash }, { backgroundColor: next, duration: .3, ease: 'none' }, S + 9.6);
    ft(wash, { opacity: 1 }, { opacity: 0, duration: 1.05, ease: 'power2.out' }, S + 9.95);
  });

  ft('#intro', { opacity: 1 }, { opacity: 0, duration: .7 }, .8);
  ft('#hint', { opacity: 1 }, { opacity: 0, duration: .7 }, .5);

  // finale
  const fw = q1('#fworld'), fl = [...q1('#fword').querySelectorAll('.ch i')], fch = [...q1('#fword').querySelectorAll('.ch')];
  const cells = [...root.querySelectorAll('.fcell')];
  const drinks = cells.map((c) => c.querySelector('.fdrink')), fruits = cells.map((c) => c.querySelector('.ffruit')), names = cells.map((c) => c.querySelector('.fname'));
  tl.set(finale, { autoAlpha: 1 }, F - .25);
  gsap.set(fw, { scale: 1.4, y: 0 });
  gsap.set(drinks, { y: '90vh', scale: .7, rotation: -10 });
  gsap.set(fruits, { opacity: 0, y: '-30vh', scale: 1.6 });
  gsap.set(names, { opacity: 0 });
  gsap.set(fl, { yPercent: 115, opacity: 0 }); gsap.set(fch, { filter: 'blur(20px)' });
  gsap.set(['#fsub', '#ctas'], { opacity: 0 });
  gsap.set('#ctas', { y: 30 });
  ft(fw, { scale: 1.4 }, { scale: 1, duration: 5.6, ease: 'power2.out' }, F + .4);
  ft(fw, { y: '0vh' }, { y: '-2.5vh', duration: 8, ease: 'none' }, F + 6);
  ft('#fbg', { x: '-3%', scale: 1.08 }, { x: '3%', scale: 1.0, duration: 14, ease: 'none' }, F);
  ft(drinks, { y: '90vh', scale: .7, rotation: -10 }, { y: '0vh', scale: 1, rotation: 0, duration: 2.6, ease: 'back.out(1.2)', stagger: .35 }, F + .9);
  ft(fruits, { opacity: 0, y: '-30vh', scale: 1.6 }, { opacity: 1, y: '0vh', scale: 1, duration: 2.2, ease: 'power3.out', stagger: .35 }, F + 1.6);
  ft(names, { opacity: 0 }, { opacity: .85, duration: 1 }, F + 3.4);
  drinks.forEach((d, k) => ft(d, { y: '0vh' }, { y: (k % 2 ? -2 : 2) + 'vh', duration: 7, ease: 'sine.inOut' }, F + 5));
  ft(fl, { yPercent: 115, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 1.5, ease: 'power4.out', stagger: .08 }, F + 3.0);
  ft(fch, { filter: 'blur(20px)' }, { filter: 'blur(0px)', duration: 1.3, ease: 'power3.out', stagger: .08 }, F + 3.0);
  ft('#fsub', { opacity: 0, letterSpacing: '1em' }, { opacity: 1, letterSpacing: '.3em', duration: 1.4, ease: 'power2.out' }, F + 5.4);
  ft('#ctas', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 1, ease: 'power3.out' }, F + 6.6);
  return tl;
}

/**
 * Wires the master scroll-scrubbed timeline, particle canvas and HUD to the rendered DOM.
 * Returns a cleanup function.
 */
export function createExperience(root, images) {
  let tl, st, tick, onResize, rz;
  const ctx = gsap.context(() => {
    fitWords(root);
    tl = buildTimeline(root);
    const particles = makeParticles();
    const renderer = createCanvasRenderer(root.querySelector('#fx'), particles, images);
    const rail = root.querySelector('#railfill'), count = root.querySelector('#count'), hud = root.querySelector('#hud');
    let last = -1;
    st = ScrollTrigger.create({ trigger: '#spacer', start: 'top top', end: 'bottom bottom', scrub: .9, animation: tl });
    tick = () => {
      const t = tl.time(); if (t === last) return; last = t;
      renderer.draw(t);
      const idx = t < F - .25 ? Math.min(3, Math.floor((t + .15) / 10)) : 4;
      hud.style.setProperty('--hc', idx < 4 ? FLAVORS[idx].c1 : '#fff3ea');
      count.innerHTML = idx < 4 ? `<b>0${idx + 1}</b> / 04 &nbsp; ${FLAVORS[idx].name}` : '<b>04</b> / 04 &nbsp; FROM FRUIT TO FIZZ';
      rail.style.height = (t / TOTAL * 100) + '%';
    };
    gsap.ticker.add(tick);
    onResize = () => { clearTimeout(rz); rz = setTimeout(() => { renderer.resize(); fitWords(root); ScrollTrigger.refresh(); last = -1; }, 200); };
    addEventListener('resize', onResize);
    tl.progress(0);
  }, root);
  return () => {
    removeEventListener('resize', onResize); clearTimeout(rz);
    gsap.ticker.remove(tick); st && st.kill(); ctx.revert();
  };
}
