# Pulp: Fruit Fizz (React + Vite)

Scroll-scrubbed cinematic beverage site. React renders the scenes; one GSAP ScrollTrigger timeline
(54 units) drives everything from scroll position, so scrolling back reverses it.

## Run
    npm install
    npm run dev       # http://localhost:5173
    npm run build     # outputs dist/ (relative base, can be hosted anywhere)
    npm run preview

## Structure
    index.html
    src/
      main.jsx, App.jsx            preloader + mounts the experience
      styles.css                   all styles
      data/flavors.js              flavors, colors, image roles, finale items, timeline constants
      components/                  Scene, Finale, Hud, Loader, Letters
      lib/timeline.js              master scrubbed timeline, HUD updates, resize handling
      lib/particles.js             canvas bubbles/droplets/fruit bits (pure function of timeline time)
      lib/utils.js
    public/img/                    cutouts, drinks, splashes, backgrounds (webp)

## Notes
- Strawberry and lime drinks (`public/img/can-strawberry.webp`, `can-lime.webp`) are recolors of the Fizz can; replace with real images.
- Lime fruit is the supplied lemon cutout shifted to green.
- The finale CTA (`Finale.jsx`) has no destination yet.
