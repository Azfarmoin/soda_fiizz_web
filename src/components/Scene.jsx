import React, { useMemo } from 'react';
import Letters from './Letters.jsx';
import { rng, url } from '../lib/utils.js';

function condensation(seed) {
  const r = rng(seed), parts = [];
  for (let i = 0; i < 46; i++) {
    const x = (r() * 100).toFixed(1), y = (r() * 100).toFixed(1), s = +(.8 + r() * 2.1).toFixed(1);
    parts.push(`radial-gradient(circle at ${x}% ${y}%,rgba(255,255,255,.95) 0 ${s * .45}px,rgba(255,255,255,.35) ${s * .5}px ${s}px,transparent ${s + 1}px)`);
  }
  return parts.join(',');
}

export default function Scene({ f, i }) {
  const cond = useMemo(() => condensation(i + 3), [i]);
  const style = { '--c1': f.c1, '--c2': f.c2, '--c3': f.c3, '--c3x': f.c3x, '--c2a': f.c2a };
  const mask = { '--m': `url(${url(f.drink)})` };
  return (
    <section className="scene" id={`s${i}`} style={style}>
      <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true">
        <defs>
          <filter id={`mb${i}`} x="-30%" y="-40%" width="160%" height="180%"><feGaussianBlur stdDeviation="0 20" /></filter>
        </defs>
      </svg>
      <div className="bg"><div className="glow g1" /><div className="glow g2" /><div className="rays" /></div>
      <div className="world">
        <div className="word" aria-hidden="true"><Letters text={f.name} /></div>
        {f.flood
          ? <div className="flood" style={{ backgroundImage: `url(${url(f.splash)})` }} />
          : <img className="splash" src={url(f.splash)} alt="" />}
        <div className="trail" /><div className="pool" />
        {f.orbit.map((o, k) => (
          <div className="orb" key={k} style={{ width: `${o[1]}vmin`, margin: `${-o[1] / 2}vmin 0 0 ${-o[1] / 2}vmin` }}>
            <img src={url(o[0])} alt="" />
          </div>
        ))}
        <div className="dwrap">
          <div className="dglow" />
          <div className={`drink ${f.dcls}`}>
            <img src={url(f.drink)} alt={`${f.name.toLowerCase()} drink`} style={{ filter: `url(#mb${i})` }} />
            <div className="cond" style={{ ...mask, background: cond }} />
            <div className="shine" style={mask} />
          </div>
        </div>
        <div className="hero">
          {f.hero.map((h, k) => (
            <div className="hp" key={k} style={{ left: `${50 + h[2] * 100}%`, top: `${50 + h[3] * 100}%`, width: `${h[1] * 100}%`, transform: `translate(-50%,-50%) rotate(${h[4]}deg)`, zIndex: h[1] > .9 ? 5 : 1 }}>
              <img src={url(h[0])} alt="" />
            </div>
          ))}
        </div>
      </div>
      <div className="front">
        {f.front.map((o, k) => (
          <div className="fp" key={k} style={{ left: `${o[2]}%`, width: `${o[1]}vmin`, margin: `${-o[1] / 2}vmin 0 0 ${-o[1] / 2}vmin`, '--b': `${o[6]}px` }}>
            <img src={url(o[0])} alt="" />
          </div>
        ))}
      </div>
      <div className="vig" />
      <div className={`headline ${f.side}`}>
        <div className="kick">{`Flavor 0${i + 1} · ${f.name}`}</div>
        <div className="hl">{f.lines.map((l) => <div className="ln" key={l}><span>{l}</span></div>)}</div>
        <div className="sub">{f.sub}</div>
      </div>
    </section>
  );
}
