(() => {
  'use strict';
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  const motionButton = document.querySelector('#motion-toggle');
  let prefersLess = false;
  try { prefersLess = localStorage.getItem('prova-reduce-motion') === 'true'; } catch {}
  const reduced = () => motion.matches || prefersLess;
  function syncMotion() {
    document.documentElement.dataset.motion = reduced() ? 'reduce' : 'full';
    motionButton.setAttribute('aria-pressed', String(reduced()));
    motionButton.textContent = reduced() ? 'Reduced motion on' : 'Reduce motion';
    motionButton.disabled = motion.matches;
    motionButton.title = motion.matches ? 'Following your device’s reduced motion preference' : '';
    document.dispatchEvent(new Event('prova:motionchange'));
  }
  syncMotion();
  motionButton.addEventListener('click', () => { prefersLess = !prefersLess; try { localStorage.setItem('prova-reduce-motion', String(prefersLess)); } catch {} syncMotion(); document.querySelector('#launch-film').pause(); });
  function buttonText(button, text) {
    button.textContent = text;
    button.setAttribute('aria-label', text.replace(/[▶Ⅱ↗↻✓]/g, '').trim());
  }
  const dialog = document.querySelector('#image-dialog');
  const screenDescriptions = {
    assignment: 'Actual assignment: Minuet in G, bars 12 to 16, with a four-step checklist.',
    practice: 'Actual practice screen: the teacher’s instruction, timer, metronome, and recorder.',
    conversation: 'Actual assignment thread: the student asks about position and the teacher replies. A shared take appears below.',
    review: 'Actual teacher review: practice sessions, the student’s practice note, and their shared take.'
  };
  const fullImage = document.querySelector('#full-image');
  const imageWell = document.querySelector('.image-well');
  const imageFallback = document.querySelector('.image-fallback');
  const imageStatus = document.querySelector('#image-status');
  const retryImage = document.querySelector('#retry-image');
  let currentImage = 'assignment';
  function imageReady() {
    const retryFocused = document.activeElement === retryImage;
    imageWell.dataset.state = 'ready'; imageFallback.hidden = true;
    if (retryFocused && dialog.open) document.querySelector('#close-image').focus({preventScroll: true});
  }
  function loadImage(retry = false) {
    imageWell.dataset.state = 'loading'; imageFallback.hidden = false; retryImage.hidden = true;
    imageStatus.textContent = 'Loading the app screen…';
    fullImage.alt = screenDescriptions[currentImage];
    fullImage.src = `assets/product/${currentImage}.jpg${retry ? '?retry=' + Date.now() : ''}`;
    if (fullImage.complete && fullImage.naturalWidth) imageReady();
  }
  fullImage.addEventListener('load', imageReady);
  fullImage.addEventListener('error', () => {
    imageWell.dataset.state = 'error'; imageFallback.hidden = false; retryImage.hidden = false;
    imageStatus.textContent = 'This screen couldn’t load. You can retry or close this view.';
  });
  retryImage.addEventListener('click', () => loadImage(true));
  document.querySelectorAll('[data-image]').forEach(button => button.addEventListener('click', () => {
    currentImage = button.dataset.image;
    loadImage();
    dialog.showModal();
    document.querySelector('#close-image').focus();
  }));
  document.querySelector('#close-image').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => { if (event.target === dialog) { const r = dialog.getBoundingClientRect(); if (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) dialog.close(); } });

  function emphasize(element) {
    if (element.animate) element.animate([{opacity: .45}, {opacity: 1}], {duration: reduced() ? 200 : 250, easing: 'ease-in-out'});
  }
  // One restrained entrance per step: content is always readable, even before
  // enhancement. Product detail follows the headline by one quick token.
  if ('IntersectionObserver' in window) {
    document.documentElement.classList.add('motion-ready');
    const entrance = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('settled'); entrance.unobserve(entry.target); }
    }), {threshold: .12});
    document.querySelectorAll('[data-movement]').forEach(section => entrance.observe(section));
  }
  const notes = [...document.querySelectorAll('[data-time]')];
  notes.forEach(note => note.addEventListener('click', () => {
    const copy = note.querySelector('.note-copy').textContent;
    notes.forEach(button => button.setAttribute('aria-pressed', String(button === note)));
    document.querySelector('#selected-feedback').textContent = copy;
    document.querySelector('#next-focus').textContent = copy;
    document.querySelector('#feedback-status').textContent = `At 0:${note.dataset.time}: ${copy}`;
    emphasize(document.querySelector('#selected-feedback'));
  }));

  const film = document.querySelector('#launch-film');
  const filmButton = document.querySelector('#film-toggle');
  const filmStatus = document.querySelector('#film-status');
  filmButton.addEventListener('click', async () => {
    if (!film.paused) { film.pause(); return; }
    film.hidden = false;
    if (film.ended) film.currentTime = 0;
    try { await film.play(); filmStatus.textContent = ''; }
    catch { film.hidden = true; filmStatus.textContent = 'The film could not play. The app screenshot remains visible; you can try again.'; }
  });
  film.addEventListener('ended', () => { film.hidden = true; });
  const syncFilm = () => { buttonText(filmButton, film.paused ? (film.ended ? 'Replay the native motion study ↻' : 'Play the native motion study ▶') : 'Pause the native motion study Ⅱ'); };
  ['play', 'pause', 'ended'].forEach(event => film.addEventListener(event, syncFilm));
  film.addEventListener('error', () => { film.hidden = true; filmStatus.textContent = 'The film is unavailable. The app screenshot is still visible.'; });
  document.addEventListener('visibilitychange', () => { if (document.hidden) film.pause(); });
  if ('IntersectionObserver' in window) new IntersectionObserver(entries => { if (!entries[0].isIntersecting) film.pause(); }, {threshold: .1}).observe(film);
  motion.addEventListener('change', () => { syncMotion(); film.pause(); });

  // Beta destination is configured by the owner, never invented or collected locally.
  const betaURL = document.querySelector('meta[name="prova-beta-url"]')?.content;
  if (betaURL && /^(https:\/\/|mailto:)/.test(betaURL)) {
    const action = document.querySelector('#beta-action');
    action.href = betaURL;
    action.textContent = 'Request beta access ↗';
    document.querySelectorAll('[data-beta-request]').forEach(link => { link.href = betaURL; link.textContent = 'Request beta access ↗'; });
    document.querySelector('#access-status').textContent = 'Teachers can request beta access. Students join through their teacher.';
  }

  // Downbeat-inspired arrival: no curtain, no blocked content, once per tab.
  // Brand geometry is the icon crop: 626 × 766 inside a 1024px tile.
  function arrival() {
    if (reduced() || location.hash === '#still') return;
    try { if (sessionStorage.getItem('prova-arrival')) return; sessionStorage.setItem('prova-arrival', '1'); } catch { return; }
    const slot = document.querySelector('#brand-slot');
    const r = slot.getBoundingClientRect();
    const mark = document.createElement('div');
    mark.className = 'arrival-mark';
    mark.setAttribute('aria-hidden', 'true');
    const art = document.createElement('img'); art.src = 'assets/brandmark.png'; art.alt = ''; mark.append(art);
    mark.style.left = `${r.left + r.width / 2 - 32}px`;
    mark.style.top = `${r.top + r.height / 2 - 32}px`;
    document.body.append(mark);
    const start = performance.now();
    const spring = t => { const w = Math.sqrt(420), z = 35 / (2 * w), wd = w * Math.sqrt(1 - z * z); return 1 - Math.exp(-z * w * t) * (Math.cos(wd * t) + z * w / wd * Math.sin(wd * t)); };
    function frame(now) {
      if (reduced() || now - start > 414) { mark.remove(); return; }
      const p = spring((now - start) / 1000);
      mark.style.transform = `translateY(${-80 * (1 - p)}px) scale(${1 - .375 * p})`;
      mark.style.opacity = String(Math.min(1, (now - start) / 80));
      requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }
  arrival();
})();
