/* Prova V10: one motion system for the hero and the two signature films.
   A film is a pinned frame whose scroll progress p (0 → 1) drives keyframe tracks: every element in its
   scene is placed by sample(track, p), with one camera easing, so movement reads as one camera, not a set
   of separate animations. Geometry is recomputed on resize from the scene's size; the captures' own
   coordinates (402 × 874 pt) say where the waveform and the score page sit inside each screen.
   Reduce Motion, or no JavaScript, gets the storyboard instead (site.css). */
(() => {
  const root = document.documentElement;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const lerp = (a, b, t) => a + (b - a) * t;
  const cam = t => (t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);   // --cam
  const out = t => 1 - Math.pow(1 - t, 3);
  const pop = t => { const c = 1.9; return 1 + (c + 1) * Math.pow(t - 1, 3) + c * Math.pow(t - 1, 2); };
  const lin = t => t;
  const seg = (p, a, b) => clamp((p - a) / (b - a));

  /* A track: [{p, ...values, ease?}], values interpolated per segment with the later frame's easing. */
  function sample(track, p) {
    if (p <= track[0].p) return track[0];
    for (let i = 1; i < track.length; i++) {
      const b = track[i];
      if (p <= b.p) {
        const a = track[i - 1], t = (b.ease || cam)(seg(p, a.p, b.p)), v = {};
        for (const k in b) if (k !== 'p' && k !== 'ease') v[k] = lerp(a[k] ?? b[k], b[k], t);
        return v;
      }
    }
    return track[track.length - 1];
  }
  const place = (el, v) => {
    el.style.transform = `translate3d(${v.x.toFixed(2)}px, ${v.y.toFixed(2)}px, 0) scale(${v.s.toFixed(4)})`;
    el.style.opacity = v.o.toFixed(3);
  };
  /* Layers inside a device: [name, from, to] windows in order. The incoming screen fades in on top of the
     outgoing one, which stays opaque until it is covered: a cut that never dims to black. A name may recur. */
  function layers(device, windows, p, fade = .012) {
    const o = new Map(), z = new Map();
    windows.forEach(([name, a, b], i) => {
      const v = p < a - fade || p > b + fade ? 0 : seg(p, a - fade, a + fade);
      if (!o.has(name)) o.set(name, 0);
      if (v > 0 && v >= o.get(name)) { o.set(name, v); z.set(name, i + 1); }
    });
    for (const [name, v] of o) {
      const el = device.querySelector(`[data-layer="${name}"]`);
      if (!el) continue;
      el.style.opacity = v.toFixed(3); el.style.zIndex = z.get(name) || 0;
    }
  }
  const inset = (g, pad) => { for (const k in g) if (k !== 'cam') for (const fr of g[k]) fr.x += pad; };
  /* The scene is full-bleed (its clip is the viewport); compositions sit inside the wrap's width. */
  function frameOf(film, scene) {
    const r = scene.getBoundingClientRect(), head = film.querySelector('.film-head').getBoundingClientRect();
    const pad = Math.max(0, head.left - r.left);
    return { w: r.width, h: r.height, pad, iw: r.width - 2 * pad };
  }
  const clock = s => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;

  /* Where things sit inside a 402 × 874 pt capture (measured on the PNGs). */
  const PT = { w: 402, h: 874 };
  const WAVE = {                      // the waveform's bars in each screen
    review: { x: 39, y: 227, w: 323, h: 64 },
    take: { x: 47, y: 232, w: 308, h: 67 }
  };
  const PAGE = { x: 5, y: 212, w: 392, h: 507 };            // Mark up's page (Mine / Both)
  const PART = { w: 595.28, h: 770.36 };                     // the part page (assets/v10/minuet-part.svg)
  const VIEW = {                                             // the camera on the part page
    system3: { x: 16, y: 250, w: 552 },                      // bars 11–16, full width
    bars: { x: 143, y: 270, w: 432 },                        // bars 12–16
    close: { x: 202, y: 276, w: 306 },                       // bars 13–15
    tight: { x: 222, y: 280, w: 282 },                       // bars 13–15, closer
    page: { x: 0, y: 0, w: 595.28 }
  };

  /* ---------- Film 01 · The Sound of Progress ---------- */
  function soundFilm(film) {
    const scene = film.querySelector('.scene');
    const S = scene.querySelector('[data-el="student"]'), T = scene.querySelector('[data-el="teacher"]');
    const W = scene.querySelector('[data-el="wave"]'), share = scene.querySelector('[data-el="share"]'), next = scene.querySelector('[data-el="next"]');
    const tc = W.querySelector('[data-tc]'), playhead = W.querySelector('[data-playhead]'), played = W.querySelector('[data-played]');
    const pin = W.querySelector('[data-pin]'), note = W.querySelector('[data-note]'), typed = W.querySelector('[data-type]');
    const full = typed.textContent; let shown = -1;
    drawWave(W);
    const DUR = 48, AT = 18;
    const anchors = [0, .14, .30, .50, .70, .86];
    const rests = [.05, .23, .45, .64, .80, .95];
    let g;                                                   // geometry tracks, rebuilt on resize

    function build() {
      const f = frameOf(film, scene), w = f.iw, h = f.h, portrait = w < 720 || w / h < 1.05;
      const dh = Math.min(h * (portrait ? .98 : .96), 760), dw = dh * PT.w / PT.h;
      scene.style.setProperty('--dw', dw + 'px');
      const k = dw / PT.w;                                   // px per capture pt at scale 1
      const cx = (w - dw) / 2, cy = (h - dh) / 2;
      // The wave stage: wide on the left (landscape) or across the top (portrait).
      const ww = portrait ? w : Math.min(w * .58, 760), wh = Math.round(clamp(ww * .17, 80, 130));
      W.style.setProperty('--ww', ww + 'px'); W.style.setProperty('--wh', wh + 'px');
      // The comment bubble hangs from the pin at 0:18; its notch points at it.
      const pinX = 20 + (ww - 40) * (AT / DUR), nw = Math.min(440, ww - 24);
      const nl = clamp(pinX - 34, 0, ww - nw);
      W.style.setProperty('--nw', nw + 'px'); W.style.setProperty('--nl', nl + 'px'); W.style.setProperty('--notch', (pinX - nl) + 'px');
      const wH = W.offsetHeight, nH = note.offsetHeight + 18;
      const wx = 0, wy = portrait ? 0 : Math.max(0, (h - wH - nH) / 2);
      // The teacher's device beside the stage, smaller: context for the magnified waveform.
      const tS = portrait ? clamp((h - wH - nH - 16) / dh, .3, .5) : .8, tx = portrait ? (w - dw * tS) / 2 : Math.min(w - dw * tS, wx + ww + w * .06), ty = portrait ? wH + nH + 12 : (h - dh * tS) / 2;
      // FLIP: the stage starts exactly over the device's waveform, uniform scale on its bars' width.
      const body = W.querySelector('.wave-body'), bx = body.offsetLeft, by = body.offsetTop, bw = body.offsetWidth;
      const from = (devX, devY, devS, rect) => {
        const s = (rect.w * k * devS) / bw;
        return { x: devX + rect.x * k * devS - bx * s, y: devY + rect.y * k * devS - by * s, s };
      };
      const tReview = { x: portrait ? (w - dw) / 2 : Math.min(w * .52, w - dw - 24), y: cy, s: 1 };
      const wf1 = from(tReview.x, tReview.y, 1, WAVE.review);
      const sBack = portrait ? { x: -dw * .7, y: cy + dh * .06, s: .8 } : { x: w * .02, y: cy + dh * .07, s: .84 };
      const wf2 = from(cx, cy, 1, WAVE.take);
      g = {
        S: [
          { p: 0, x: cx, y: cy, s: 1, o: 1 }, { p: .30, x: cx, y: cy, s: 1, o: 1 },
          { p: .36, ...sBack, o: portrait ? 0 : .3 }, { p: .42, ...sBack, o: 0 }, { p: .70, ...sBack, o: 0 },
          { p: .75, x: cx, y: cy, s: 1, o: 1 }, { p: 1, x: cx, y: cy, s: 1, o: 1 }
        ],
        T: [
          { p: 0, x: w + 40, y: cy, s: 1, o: 0 }, { p: .30, x: w + 40, y: cy, s: 1, o: 0 },
          { p: .36, ...tReview, o: 1, ease: out }, { p: .42, ...tReview, o: 1 },
          { p: .48, x: tx, y: ty, s: tS, o: 1 }, { p: .70, x: tx, y: ty, s: tS, o: 1 },
          { p: .76, x: w + 40, y: ty, s: tS, o: 0 }, { p: 1, x: w + 40, y: ty, s: tS, o: 0 }
        ],
        W: [
          { p: 0, ...wf1, o: 0 }, { p: .42, ...wf1, o: 0 }, { p: .435, ...wf1, o: 1, ease: lin },
          { p: .48, x: wx, y: wy, s: 1, o: 1 }, { p: .70, x: wx, y: wy, s: 1, o: 1 },
          { p: .768, ...wf2, o: 1 }, { p: .79, ...wf2, o: 0, ease: lin }, { p: 1, ...wf2, o: 0 }
        ],
        share: (() => { const x = portrait ? (w - 200) / 2 : cx + dw + 18, y = portrait ? cy + dh * .12 : cy + dh * .3;
          return [{ p: 0, x, y: y + 10, s: 1, o: 0 }, { p: .215, x, y: y + 10, s: 1, o: 0 }, { p: .245, x, y, s: 1, o: 1, ease: out }, { p: .31, x, y, s: 1, o: 1 }, { p: .34, x, y: y - 8, s: 1, o: 0 }, { p: 1, x, y: y - 8, s: 1, o: 0 }]; })(),
        next: (() => { const x = portrait ? 0 : cx + dw + 18, y = portrait ? cy + dh * .1 : cy + dh * .42;
          return [{ p: 0, x, y: y + 10, s: 1, o: 0 }, { p: .885, x, y: y + 10, s: 1, o: 0 }, { p: .915, x, y, s: 1, o: 1, ease: out }, { p: 1, x, y, s: 1, o: 1 }]; })()
      };
      inset(g, f.pad);
    }

    function render(p) {
      place(S, sample(g.S, p)); place(T, sample(g.T, p)); place(W, sample(g.W, p));
      place(share, sample(g.share, p)); place(next, sample(g.next, p));
      layers(S, [['score', -1, .17], ['recorder', .17, .70], ['recordings', .70, .768], ['take', .768, .895], ['score', .895, 2]], p);
      layers(T, [['inbox', -1, .385], ['review', .385, .58], ['compose', .58, .655], ['answered', .655, 2]], p);
      // The playhead runs the take from 0:00 to 0:18 and stops there: the moment.
      const prog = (AT / DUR) * clamp(seg(p, .465, .56));
      playhead.style.left = (prog * 100).toFixed(3) + '%';
      played.style.clipPath = `inset(0 ${(100 - prog * 100).toFixed(3)}% 0 0)`;
      const t = Math.round(prog * DUR);
      if (tc.textContent !== clock(t)) tc.textContent = clock(t);
      const pp = seg(p, .562, .585);
      pin.style.transform = `scaleY(${pop(pp).toFixed(3)})`; pin.style.opacity = pp > 0 ? 1 : 0;
      // The comment: Alex types it, then it is posted at 0:18.
      note.style.opacity = Math.min(seg(p, .575, .59), 1 - seg(p, .70, .735)).toFixed(3);
      const n = Math.round(full.length * seg(p, .59, .65));
      if (n !== shown) { shown = n; typed.textContent = full.slice(0, n); }
      note.style.setProperty('--caret', p > .585 && p < .655 ? 1 : 0);
    }
    return { film, anchors, rests, build, render };
  }

  function drawWave(W) {
    let data;
    try { data = JSON.parse(document.getElementById('take-peaks').textContent); } catch { return; }
    const n = data.peaks.length, step = 960 / n, ns = 'http://www.w3.org/2000/svg';
    const bars = data.peaks.map((v, i) => { const hgt = Math.max(5, v * 112); return `<rect x="${(i * step + step * .18).toFixed(2)}" y="${(60 - hgt / 2).toFixed(2)}" width="${(step * .64).toFixed(2)}" height="${hgt.toFixed(2)}" rx="${(step * .32).toFixed(2)}"/>`; }).join('');
    W.querySelector('[data-wave]').innerHTML = bars;
    const copy = document.createElementNS(ns, 'svg');
    copy.setAttribute('viewBox', '0 0 960 120'); copy.setAttribute('preserveAspectRatio', 'none'); copy.innerHTML = bars;
    W.querySelector('[data-played]').appendChild(copy);
  }

  /* ---------- Film 02 · The Music Between Us ---------- */
  function musicFilm(film) {
    const scene = film.querySelector('.scene');
    const D = scene.querySelector('[data-el="score"]'), SH = scene.querySelector('[data-el="sheet"]');
    const svg = SH.querySelector('[data-camera]'), who = SH.querySelector('[data-who]'), segs = [...SH.querySelectorAll('[data-seg] i')];
    const anchors = [0, .12, .28, .45, .62, .78];
    const rests = [.05, .25, .41, .56, .75, .93];
    let g, aspect = 2.2;

    function build() {
      const f = frameOf(film, scene), w = f.iw, h = f.h, portrait = w < 720 || w / h < 1.05;
      // The sheet: the anchor. Landscape: the left two thirds. Portrait: across the top.
      aspect = portrait ? 2.0 : 3.0;
      // The device: centred and large to open; beside (or under) the sheet afterwards, at a fixed share
      // of the frame, so the sheet takes the rest and the score anchors the composition.
      const dh = Math.min(h * .96, 760), dw = dh * PT.w / PT.h, k = dw / PT.w;
      scene.style.setProperty('--dw', dw + 'px');
      const cx = (w - dw) / 2, cy = (h - dh) / 2, tagsH = 52, gap = 56;
      const sideS = clamp(Math.min(.72, (w * .27) / dw), .45, .72);
      const sw = portrait ? w : Math.min(w - dw * sideS - gap, (h - 64) * aspect, 960), sh = sw / aspect;
      SH.style.setProperty('--sw', sw + 'px'); SH.style.setProperty('--sh', sh + 'px');
      const sx = 0, sy = portrait ? 0 : (h - sh - tagsH) / 2;
      const dS = portrait ? clamp((h - sh - tagsH - 12) / dh, .3, .62) : sideS;
      const dx = portrait ? (w - dw * dS) / 2 : sw + gap, dy = portrait ? sh + tagsH + 10 : (h - dh * dS) / 2;
      // The dive: scale the device until system 3 of its page covers the sheet's rect exactly.
      const v = VIEW.system3, vh = v.w / aspect, vy = 315 - vh / 2;
      const pk = PAGE.w / PART.w;                            // capture pt per part unit
      const regionX = PAGE.x + v.x * pk, regionY = PAGE.y + vy * pk, regionW = v.w * pk;
      const ds = sw / (regionW * k);
      const dive = { x: sx - regionX * k * ds, y: sy - regionY * k * ds, s: ds };
      g = {
        D: [
          { p: 0, x: cx, y: cy, s: 1, o: 1 }, { p: .12, x: cx, y: cy, s: 1, o: 1 },
          { p: .21, ...dive, o: 1 }, { p: .235, ...dive, o: 0, ease: lin },
          { p: .275, x: dx, y: dy + 24, s: dS, o: 0 }, { p: .31, x: dx, y: dy, s: dS, o: 1, ease: out },
          { p: 1, x: dx, y: dy, s: dS, o: 1 }
        ],
        SH: [{ p: 0, x: sx, y: sy, s: 1, o: 0 }, { p: .205, x: sx, y: sy, s: 1, o: 0 }, { p: .23, x: sx, y: sy, s: 1, o: 1, ease: lin }, { p: 1, x: sx, y: sy, s: 1, o: 1 }],
        // The camera on the page: bars 12–16 (on a phone, bars 13–15, so the staff stays legible), a push-in
        // while the score changes hands, and a pull-back at the end to the whole system.
        cam: (() => {
          const main = portrait ? VIEW.close : VIEW.bars, push = portrait ? VIEW.tight : VIEW.close;
          const at = (view, cy) => ({ ...view, y: cy - view.w / aspect / 2 });
          return [
            { p: 0, ...v, y: vy }, { p: .21, ...v, y: vy },
            { p: .29, ...at(main, 318) }, { p: .46, ...at(main, 318) },
            { p: .52, ...at(push, 314) }, { p: .60, ...at(main, 318) },
            { p: .90, ...at(main, 318) }, { p: .98, ...v, y: vy }, { p: 1, ...v, y: vy }
          ];
        })()
      };
      inset(g, f.pad);
    }

    function render(p) {
      place(D, sample(g.D, p)); place(SH, sample(g.SH, p));
      const c = sample(g.cam, p);
      svg.setAttribute('viewBox', `${c.x.toFixed(2)} ${c.y.toFixed(2)} ${c.w.toFixed(2)} ${(c.w / aspect).toFixed(2)}`);
      // Ink: Alex's circle, then Maya's bracket; the layer control decides what shows.
      const drawT = out(seg(p, .30, .38)), drawS = out(seg(p, .64, .72));
      const mode = p < .86 ? 'both' : p < .91 ? 'mine' : p < .96 ? 'theirs' : 'both';
      const teacherView = p < .48 || p >= .80;
      const showT = !teacherView || mode !== 'theirs' ? 1 : 0, showS = !teacherView || mode !== 'mine' ? 1 : 0;
      film.style.setProperty('--draw-t', drawT.toFixed(3)); film.style.setProperty('--draw-s', drawS.toFixed(3));
      SH.style.setProperty('--show-t', showT); SH.style.setProperty('--show-s', showS);
      layers(D, [['t-blank', -1, .30], ['t-mine', .30, .48], ['s-theirs', .48, .62], ['s-both', .62, .80], ['t-both', .80, .86], ['t-mine2', .86, .91], ['t-theirs', .91, .96], ['t-both', .96, 2]], p);
      // The tags: whose view, which layer is chosen, and the save that sends it.
      const label = teacherView ? 'Alex · teacher' : 'Maya · student';
      if (who.textContent !== label) who.textContent = label;
      const active = !teacherView ? (p < .62 ? 'theirs' : 'both') : p < .48 ? 'mine' : mode;
      for (const i of segs) {
        i.classList.toggle('on', i.dataset.l === active);
        if (i.dataset.t) { const t = teacherView ? i.dataset.t : i.dataset.s; if (i.textContent !== t) i.textContent = t; }
      }
      SH.style.setProperty('--tags', seg(p, .26, .30).toFixed(3));
      const saved = Math.max(Math.min(seg(p, .385, .40), 1 - seg(p, .44, .46)), Math.min(seg(p, .725, .74), 1 - seg(p, .775, .79)));
      SH.style.setProperty('--saved', saved.toFixed(3));
    }
    return { film, anchors, rests, build, render };
  }

  /* ---------- The runner: scroll → progress, smoothed, one rAF for both films ---------- */
  const films = [];
  for (const el of document.querySelectorAll('.film')) {
    const f = el.dataset.film === 'sound' ? soundFilm(el) : musicFilm(el);
    f.caps = [...el.querySelectorAll('.captions p')];
    f.btns = [...el.querySelectorAll('.beats button')];
    f.p = 0; f.target = 0; f.beat = -1;
    films.push(f);
  }
  const range = f => { const r = f.film.getBoundingClientRect(); const span = f.film.offsetHeight - innerHeight; return { top: scrollY + r.top, span: Math.max(1, span) }; };
  function setBeat(f, p) {
    let b = 0; f.anchors.forEach((a, i) => { if (p >= a - .001) b = i; });
    if (b === f.beat) return;
    f.beat = b;
    f.caps.forEach(c => c.classList.toggle('on', +c.dataset.beat === b));
    f.btns.forEach(btn => { if (+btn.dataset.go === b) btn.setAttribute('aria-current', 'step'); else btn.removeAttribute('aria-current'); });
  }
  let raf = 0, last = 0, still = reduce.matches;
  function frame(now) {
    raf = 0;
    const dt = Math.min(64, now - (last || now)); last = now;
    let moving = false;
    for (const f of films) {
      const { top, span } = range(f);
      f.target = clamp((scrollY - top) / span);
      const k = 1 - Math.exp(-dt / 70);
      const np = Math.abs(f.target - f.p) < .0004 ? f.target : lerp(f.p, f.target, k);
      if (np !== f.p || !f.drawn) {
        f.p = np; f.drawn = true;
        const r = f.film.getBoundingClientRect();
        if (r.bottom > -50 && r.top < innerHeight + 50) f.render(f.p);
      }
      setBeat(f, f.target);
      if (f.p !== f.target) moving = true;
    }
    if (moving) raf = requestAnimationFrame(frame); else last = 0;
  }
  const kick = () => { if (!raf && !still) raf = requestAnimationFrame(frame); };
  function layout() {
    if (still) return;
    for (const f of films) { f.build(); f.drawn = false; }
    kick();
  }
  function setStill() {
    still = reduce.matches;
    films.forEach(f => f.film.classList.toggle('still', still));
    if (!still) layout();
  }
  // The beat buttons: jump to a moment's resting point; arrow keys move between them.
  for (const f of films) {
    f.btns.forEach((btn, i) => {
      btn.addEventListener('click', () => {
        const { top, span } = range(f);
        scrollTo({ top: top + f.rests[+btn.dataset.go] * span, behavior: reduce.matches ? 'auto' : 'smooth' });
      });
      btn.addEventListener('keydown', e => {
        const d = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
        if (!d) return;
        e.preventDefault();
        const nb = f.btns[(i + d + f.btns.length) % f.btns.length];
        nb.focus(); nb.click();
      });
    });
  }
  addEventListener('scroll', kick, { passive: true });
  addEventListener('resize', () => { clearTimeout(layout.t); layout.t = setTimeout(layout, 120); });
  reduce.addEventListener?.('change', setStill);
  window.addEventListener('load', layout);
  setStill();

  /* ---------- The hero: the two screens arrive on the Downbeat, once a session ---------- */
  const hero = document.querySelector('.hero');
  const arrive = () => hero && hero.classList.add('arrive');
  if (reduce.matches) arrive();
  else {
    const imgs = [...document.querySelectorAll('.hero-devices img')];
    Promise.all(imgs.map(i => i.decode().catch(() => {}))).then(() => requestAnimationFrame(arrive));
    setTimeout(arrive, 1500);
  }
  try {
    const tile = document.getElementById('brand-tile');
    if (tile && !reduce.matches && !sessionStorage.getItem('prova-downbeat') && tile.animate) {
      sessionStorage.setItem('prova-downbeat', '1');
      // Motion.Spring.downbeat (m 1, k 420, c 35): a dip on the beat and a settled return, ≈ 414 ms.
      tile.animate([{ transform: 'translateY(0) scale(1)' }, { transform: 'translateY(2px) scale(.94)', offset: .3 }, { transform: 'translateY(-1px) scale(1.02)', offset: .62 }, { transform: 'none' }],
        { duration: 414, easing: 'cubic-bezier(.3, .7, .4, 1)', delay: 250 });
    }
  } catch { /* storage blocked: no Downbeat, nothing else changes */ }
})();
