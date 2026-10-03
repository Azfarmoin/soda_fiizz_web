// Each flavor: colors, hero cluster [img, width, x, y, rotation], drink, splash, orbit slices, parallax front pieces.
// front: [img, sizeVmin, leftPercent, startVh, endVh, rotation, blurPx]
export const TOTAL = 54; // timeline units; each flavor = 10, finale starts at F
export const F = 40;

export const FLAVORS = [
  { key: 'strawberry', name: 'STRAWBERRY', lines: ['BORN FROM', 'STRAWBERRY.'], sub: 'Crushed cold, then carbonated until it sparkles.', side: 'left',
    c1: '#ff2d55', c2: '#ff8aa0', c3: '#5a0a1f', c3x: '#14030a', c2a: 'rgba(255,120,150,.10)', wash: '#d90f3a',
    hero: [['straw-1', .7, -.38, .2, -22], ['straw-5', .62, .38, .24, 18], ['straw-2', .5, .05, -.36, 8], ['straw-3', .92, 0, 0, -6]],
    drink: 'can-strawberry', dcls: 'dk-can', splash: 'splash-strawberry', rB: -14,
    orbit: [['straw-4', 11], ['straw-5', 13], ['straw-0', 15], ['straw-2', 10], ['straw-1', 12]],
    front: [['straw-4', 34, 6, 80, -120, 40, 6], ['straw-2', 26, 88, 110, -90, -50, 5], ['straw-1', 18, 20, 130, -60, 90, 3]] },
  { key: 'mango', name: 'MANGO', lines: ['PURE MANGO', 'ENERGY.'], sub: 'Sun-ripe pulp, poured gold and bottled bright.', side: 'right',
    c1: '#ffb21a', c2: '#ffe08a', c3: '#6b3a00', c3x: '#150a00', c2a: 'rgba(255,200,90,.10)', wash: '#f2a100',
    hero: [['mango-0', .92, -.3, .3, -14], ['mango-5', .5, .38, .26, 24], ['mango-3', .6, .1, -.38, 10], ['mango-1', 1.08, 0, 0, -4]],
    drink: 'can-mango', dcls: 'dk-wide', splash: 'splash-mango', flood: true, rB: 12,
    orbit: [['mango-4', 13], ['mango-5', 11], ['mango-2', 14], ['mango-3', 12], ['mango-0', 13]],
    front: [['mango-2', 32, 4, 90, -120, -30, 6], ['mango-5', 22, 90, 120, -80, 60, 4], ['mango-4', 28, 70, 140, -70, -70, 3]] },
  { key: 'lime', name: 'LIME', lines: ['FEEL', 'THE ZING.'], sub: 'Sharp, electric and ice cold from the first sip.', side: 'left',
    c1: '#6dff1f', c2: '#d8ff8a', c3: '#0f4a06', c3x: '#020d04', c2a: 'rgba(150,255,80,.10)', wash: '#35d400',
    hero: [['lime-0', .7, -.36, .3, -10], ['lime-1', .5, .4, .26, 14], ['lime-3', .26, .36, -.3, 30], ['lime-2', 1.0, 0, 0, 0]],
    drink: 'can-lime', dcls: 'dk-can', splash: 'splash-lime', push: true, rB: -10,
    orbit: [['lime-2', 12], ['lime-0', 14], ['lime-2', 9], ['lime-0', 11], ['lime-4', 8], ['lime-2', 13]],
    front: [['lime-0', 30, 5, 90, -110, -40, 6], ['lime-3', 16, 92, 120, -90, 80, 3], ['lime-2', 22, 12, 140, -70, 50, 4]] },
  { key: 'orange', name: 'ORANGE', lines: ['PURE', 'SUNSHINE.'], sub: 'Squeezed to a roar and bursting out of the can.', side: 'right',
    c1: '#ff6a13', c2: '#ffc27a', c3: '#6a2200', c3x: '#150600', c2a: 'rgba(255,150,60,.11)', wash: '#ff5a00',
    hero: [['orange-1', .62, -.4, .3, 25], ['orange-2', .55, .4, .28, -20], ['orange-4', .5, -.12, -.4, 12], ['orange-0', .96, 0, 0, 0]],
    drink: 'can-orange', dcls: 'dk-can', splash: 'splash-orange', burst: true, rB: 10,
    orbit: [['orange-2', 12], ['orange-3', 13], ['orange-5', 11], ['orange-6', 12], ['orange-7', 10], ['orange-1', 11]],
    front: [['orange-4', 32, 5, 90, -120, 45, 6], ['orange-2', 24, 90, 120, -90, -60, 4], ['orange-8', 20, 14, 140, -70, 70, 3]] },
];

// [drink image, fruit image, label]
export const FINALE = [
  ['can-strawberry', 'straw-3', 'Strawberry'], ['can-mango', 'mango-0', 'Mango'],
  ['can-lime', 'lime-2', 'Lime'], ['can-orange', 'orange-0', 'Orange'],
];

export const imageNames = () => {
  const s = new Set(['liquid-waves', 'bubbles-rainbow']);
  FLAVORS.forEach((f) => { f.hero.forEach((h) => s.add(h[0])); f.orbit.forEach((o) => s.add(o[0])); f.front.forEach((o) => s.add(o[0])); s.add(f.drink); s.add(f.splash); });
  FINALE.forEach((f) => { s.add(f[0]); s.add(f[1]); });
  return [...s];
};
