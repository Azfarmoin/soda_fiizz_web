import React, { useMemo } from 'react';
import Letters from './Letters.jsx';
import { FINALE } from '../data/flavors.js';
import { rng, url } from '../lib/utils.js';

export default function Finale() {
  const bubbles = useMemo(() => {
    const r = rng(99);
    return Array.from({ length: 26 }, () => {
      const sz = 8 + r() * 34;
      return { left: `${(r() * 100).toFixed(1)}%`, width: sz, height: sz, '--dx': `${((r() - .5) * 90).toFixed(0)}px`, animationDuration: `${(9 + r() * 10).toFixed(1)}s`, animationDelay: `${(-r() * 18).toFixed(1)}s` };
    });
  }, []);
  return (
    <section id="finale" aria-label="From fruit to fizz">
      <div className="fbg" id="fbg" /><div className="fbub" /><div className="fbg2" />
      <div className="bubs">{bubbles.map((b, k) => <b key={k} style={b} />)}</div>
      <div className="fworld" id="fworld">
        <div className="fword" id="fword">
          <div><Letters text="FROM FRUIT" /></div>
          <div><Letters text="TO FIZZ." /></div>
        </div>
        <div className="fgrid">
          {FINALE.map(([drink, fruit, label]) => (
            <div className={`fcell${drink === 'can-mango' ? ' w' : ''}`} key={label}>
              <div className="ffruit"><img src={url(fruit)} alt="" /></div>
              <div className="fdrink"><img src={url(drink)} alt={`${label} drink`} /></div>
              <div className="fname">{label}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="fsub" id="fsub">STRAWBERRY<u>{'·'}</u>MANGO<u>{'·'}</u>LIME<u>{'·'}</u>ORANGE</div>
      <div className="ctas" id="ctas">
        {/* <a className="cta" href="#shop" id="cta" onClick={(e) => e.preventDefault()}>Taste the transformation<i>{'→'}</i></a> */}
        <button className="replay" type="button" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>{'Replay ↑'}</button>
      </div>
    </section>
  );
}
