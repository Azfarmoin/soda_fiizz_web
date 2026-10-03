import React, { useEffect, useRef, useState } from 'react';
import { FLAVORS, imageNames } from './data/flavors.js';
import { url } from './lib/utils.js';
import { createExperience } from './lib/timeline.js';
import Scene from './components/Scene.jsx';
import Finale from './components/Finale.jsx';
import Hud from './components/Hud.jsx';
import Loader from './components/Loader.jsx';

// Preloads every image (the canvas also needs the fruit sprites) and the web fonts.
function usePreload() {
  const [progress, setProgress] = useState(0);
  const [images, setImages] = useState(null);
  useEffect(() => {
    const names = imageNames(), map = {};
    let done = 0;
    const tick = () => { done++; setProgress(Math.round(done / (names.length + 1) * 100)); };
    const jobs = names.map((n) => new Promise((res) => {
      const im = new Image();
      im.onload = im.onerror = () => { map[n] = im; tick(); res(); };
      im.src = url(n);
    }));
    jobs.push((document.fonts?.ready ?? Promise.resolve()).catch(() => {}).then(tick));
    Promise.all(jobs).then(() => setImages(map));
  }, []);
  return { progress, images };
}

export default function App() {
  const { progress, images } = usePreload();
  const root = useRef(null);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    if (!images || !root.current) return;
    const cleanup = createExperience(root.current, images);
    const t = setTimeout(() => setHidden(true), 150);
    return () => { clearTimeout(t); cleanup(); };
  }, [images]);

  return (
    <>
      <Loader progress={progress} done={hidden} />
      <div ref={root}>
        {images && (
          <>
            <div id="stage">
              <div id="scenes">{FLAVORS.map((f, i) => <Scene f={f} i={i} key={f.key} />)}</div>
              <Finale />
              <canvas id="fx" />
              <div id="wash" />
              <div id="grain" />
              <Hud />
            </div>
            <div id="spacer" />
          </>
        )}
      </div>
    </>
  );
}
