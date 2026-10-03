import { FLAVORS } from '../data/flavors.js';
import { rng } from './utils.js';

// Particles are pure functions of timeline time, so scrubbing backward reverses them.
export function makeParticles() {
  const P = [];
  FLAVORS.forEach((f, i) => {
    const S = i * 10, r = rng(i * 17 + 5);
    const nb = [60, 46, 120, 56][i];
    for (let k = 0; k < nb; k++) {
      const lime = i === 2;
      P.push({ k: 'bub', t0: S + 2.5 + r() * (lime ? 5.6 : 6.4), dur: 2.4 + r() * 3, x0: .5 + (r() + r() + r() - 1.5) * .5, s: .35 + Math.pow(r(), 2) * 2.7, vy: (.2 + r() * .32) * (lime ? 1.7 : 1), wa: .01 + r() * .02, wf: 1.5 + r() * 3, ph: r() * 6.28, fr: r() > .78 });
    }
    const sprites = [['straw-4', 'straw-5', 'straw-2', 'straw-0'], ['mango-4', 'mango-5', 'mango-3', 'mango-2'], ['lime-3', 'lime-4', 'lime-0'], []][i];
    if (i === 0) for (let k = 0; k < 18; k++) P.push({ k: 'bit', t0: S + 2.8 + r() * 5.2, dur: 4 + r() * 3, spr: sprites[k % sprites.length], x0: .04 + r() * .92, y0: .5 + r() * .55, vx: (r() - .5) * .018, vy: -(.05 + r() * .08), sz: 3 + r() * 4, rot: r() * 360, rv: (r() - .5) * 120 });
    if (i === 1) for (let k = 0; k < 24; k++) P.push({ k: 'bit', t0: S + 3 + r() * 6, dur: 3 + r() * 2, spr: sprites[k % sprites.length], x0: r(), y0: -.12, vx: (r() - .5) * .02, vy: .24 + r() * .18, sz: 3 + r() * 3.6, rot: r() * 360, rv: (r() - .5) * 200 });
    if (i === 2) for (let k = 0; k < 10; k++) P.push({ k: 'bit', t0: S + 3.4 + r() * 5, dur: 3 + r() * 2.5, spr: sprites[k % sprites.length], x0: r(), y0: 1.1, vx: (r() - .5) * .03, vy: -(.14 + r() * .12), sz: 2 + r() * 2.4, rot: r() * 360, rv: (r() - .5) * 160 });
    const nd = [26, 34, 24, 90][i];
    for (let k = 0; k < nd; k++) {
      const burstT = i === 3 ? (r() < .75 ? S + 2.2 + r() * .9 : S + 4.8 + r() * 3.6) : S + 2.8 + r() * 2.2;
      P.push({ k: 'drop', t0: burstT, dur: 1.3 + r() * 1.6, ang: r() * 6.283, v: (i === 3 ? 30 : 18) + r() * (i === 3 ? 48 : 30), s0: i === 3 ? .5 + r() * 1.3 : .3 + r() * .6, g: i === 3 ? 1.8 + r() * 1.6 : .2 + r() * .5, col: i === 3 && r() > .4 ? f.c2 : f.c1, ox: .5, oy: i === 3 ? .5 : .56 });
    }
  });
  return P;
}

export function createCanvasRenderer(canvas, particles, images) {
  const cx = canvas.getContext('2d');
  let DPR = 1, W = innerWidth, H = innerHeight;
  const resize = () => { DPR = Math.min(window.devicePixelRatio || 1, 1.75); W = innerWidth; H = innerHeight; canvas.width = W * DPR; canvas.height = H * DPR; };
  resize();
  const draw = (t) => {
    cx.setTransform(DPR, 0, 0, DPR, 0, 0); cx.clearRect(0, 0, W, H);
    const vm = Math.min(W, H) / 100;
    for (const p of particles) {
      const u = t - p.t0; if (u < 0 || u > p.dur || t > Math.floor(p.t0 / 10) * 10 + 9.7) continue;
      const a = Math.min(1, u / .35) * Math.min(1, (p.dur - u) / .6);
      const f = FLAVORS[Math.floor(p.t0 / 10)];
      if (p.k === 'bub') {
        const x = (p.x0 + Math.sin(u * p.wf + p.ph) * p.wa) * W, y = H * 1.06 - p.vy * H * u, r = p.s * vm * (p.fr ? 1.9 : 1);
        cx.globalAlpha = a * (p.fr ? .55 : .9);
        const g = cx.createRadialGradient(x - r * .3, y - r * .35, r * .05, x, y, r);
        g.addColorStop(0, 'rgba(255,255,255,.18)'); g.addColorStop(.7, 'rgba(255,255,255,.05)'); g.addColorStop(1, f.c2 + '55');
        cx.fillStyle = g; cx.beginPath(); cx.arc(x, y, r, 0, 6.283); cx.fill();
        cx.strokeStyle = 'rgba(255,255,255,.6)'; cx.lineWidth = p.fr ? 2 : 1.1; cx.stroke();
        cx.fillStyle = 'rgba(255,255,255,.9)'; cx.beginPath(); cx.arc(x - r * .38, y - r * .4, Math.max(1, r * .16), 0, 6.283); cx.fill();
      } else if (p.k === 'bit') {
        const im = images[p.spr]; if (!im) continue;
        const x = (p.x0 + p.vx * u) * W, y = (p.y0 + p.vy * u) * H, sz = p.sz * vm * (1 + u * .04);
        cx.globalAlpha = a * .95; cx.save(); cx.translate(x, y); cx.rotate((p.rot + p.rv * u) * Math.PI / 180);
        cx.drawImage(im, -sz / 2, -sz / 2 * im.height / im.width, sz, sz * im.height / im.width); cx.restore();
      } else {
        const k = u * (1 + u * .25), x = p.ox * W + Math.cos(p.ang) * p.v * vm * k, y = p.oy * H + Math.sin(p.ang) * p.v * vm * k, r = p.s0 * vm * (1 + p.g * u);
        cx.globalAlpha = a * .92; cx.save(); cx.translate(x, y); cx.rotate(p.ang); cx.scale(1.35, 1);
        const g = cx.createRadialGradient(-r * .3, -r * .3, r * .05, 0, 0, r);
        g.addColorStop(0, 'rgba(255,255,255,.95)'); g.addColorStop(.25, p.col); g.addColorStop(1, p.col + 'aa');
        cx.fillStyle = g; cx.beginPath(); cx.arc(0, 0, r, 0, 6.283); cx.fill(); cx.restore();
      }
    }
    cx.globalAlpha = 1;
  };
  return { draw, resize };
}
