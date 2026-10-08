(() => {
  'use strict';
  const appearanceButtons = [...document.querySelectorAll('[data-appearance]')];
  const systemAppearance = matchMedia('(prefers-color-scheme: dark)');
  let appearanceChoice = 'system';
  try { const saved = localStorage.getItem('prova-appearance'); if (['light', 'dark'].includes(saved)) appearanceChoice = saved; } catch {}
  function syncAppearance() {
    if (appearanceChoice === 'system') delete document.documentElement.dataset.theme;
    else document.documentElement.dataset.theme = appearanceChoice;
    const dark = appearanceChoice === 'dark' || (appearanceChoice === 'system' && systemAppearance.matches);
    const selected = dark ? 'dark' : 'light';
    appearanceButtons.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.appearance === selected)));
    document.querySelector('meta[name="theme-color"]').content = dark ? '#060511' : '#F7F6FB';
  }
  appearanceButtons.forEach(button => button.addEventListener('click', () => {
    appearanceChoice = button.dataset.appearance;
    try { localStorage.setItem('prova-appearance', appearanceChoice); } catch {}
    syncAppearance();
  }));
  systemAppearance.addEventListener('change', syncAppearance);
  syncAppearance();
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
  let viewerOpener;
  let viewerAnimation;
  let closingViewer = false;
  const closeImage = document.querySelector('#close-image');
  const duration = token => parseFloat(getComputedStyle(document.documentElement).getPropertyValue(token));
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
  document.querySelectorAll('[data-image]').forEach(link => link.addEventListener('click', event => {
    // Keep the native image URL when enhancement is unavailable or a new tab is requested.
    if (typeof dialog.showModal !== 'function' || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    viewerOpener = link;
    currentImage = link.dataset.image;
    loadImage();
    document.documentElement.classList.add('viewer-open');
    dialog.showModal();
    closeImage.focus({preventScroll: true});
    imageWell.scrollTop = 0;
    if (dialog.animate) viewerAnimation = dialog.animate(
      reduced() ? [{opacity: .94}, {opacity: 1}] : [{opacity: .94, transform: 'translateY(8px)'}, {opacity: 1, transform: 'translateY(0)'}],
      {duration: duration(reduced() ? '--m-reduced' : '--m-standard'), easing: 'ease-out'});
  }));
  function closeViewer() {
    if (!dialog.open || closingViewer) return;
    closingViewer = true;
    viewerAnimation?.cancel();
    const finish = () => { if (dialog.open) { dialog.close(); releaseViewer(); } };
    if (!reduced() && dialog.animate) {
      viewerAnimation = dialog.animate([{opacity: 1}, {opacity: .94}], {duration: duration('--m-quick'), easing: 'ease-out'});
      viewerAnimation.finished.then(finish, finish);
    } else finish();
  }
  closeImage.addEventListener('click', closeViewer);
  dialog.addEventListener('cancel', event => { event.preventDefault(); closeViewer(); });
  dialog.addEventListener('keydown', event => {
    if (event.key !== 'Tab') return;
    const stops = [closeImage, imageWell, ...(!retryImage.hidden ? [retryImage] : [])];
    const first = stops[0], last = stops[stops.length - 1];
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  });
  function releaseViewer() {
    viewerAnimation?.cancel();
    closingViewer = false;
    document.documentElement.classList.remove('viewer-open');
    viewerOpener?.focus({preventScroll: true});
  }
  // A queued close event from a rapid reopen must not release the new viewer.
  dialog.addEventListener('close', () => { if (!dialog.open) releaseViewer(); });
  const outsideViewer = event => {
    const r = dialog.getBoundingClientRect();
    return event.target === dialog && (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom);
  };
  let backdropPress = false;
  dialog.addEventListener('pointerdown', event => { backdropPress = outsideViewer(event); });
  dialog.addEventListener('click', event => { if (backdropPress && outsideViewer(event)) closeViewer(); backdropPress = false; });
  document.addEventListener('prova:motionchange', () => { if (reduced()) viewerAnimation?.cancel(); });

  let feedbackAnimation;
  function emphasize(element) {
    feedbackAnimation?.cancel();
    if (element.animate) feedbackAnimation = element.animate([{opacity: .45}, {opacity: 1}], {duration: reduced() ? 200 : 250, easing: 'ease-in-out'});
  }
  // Settle each section as one composition so image and explanation arrive
  // together. Content remains visible when scripting is unavailable.
  if ('IntersectionObserver' in window) {
    const settle = section => { section.classList.add('settled'); entrance.unobserve(section); };
    const entrance = new IntersectionObserver(entries => entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      settle(entry.target);
    }), {threshold: .08, rootMargin: '0px 0px -32px 0px'});
    document.querySelectorAll('[data-movement]').forEach(section => {
      section.dataset.entrance = 'story';
      entrance.observe(section);
    });
    document.documentElement.classList.add('motion-ready');
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
  const syncFilm = () => { buttonText(filmButton, film.paused ? (film.ended ? 'Replay the launch study ↻' : 'Watch the launch study ▶') : 'Pause the launch study Ⅱ'); };
  ['play', 'pause', 'ended'].forEach(event => film.addEventListener(event, syncFilm));
  film.addEventListener('error', () => { film.hidden = true; filmStatus.textContent = 'The film is unavailable. The app screenshot is still visible.'; });
  document.addEventListener('visibilitychange', () => { if (document.hidden) film.pause(); });
  if ('IntersectionObserver' in window) new IntersectionObserver(entries => { if (!entries[0].isIntersecting) film.pause(); }, {threshold: .1}).observe(film);
  motion.addEventListener('change', () => { syncMotion(); film.pause(); });

  // Beta destination is configured by the owner, never invented or collected locally.
  const betaURL = document.querySelector('meta[name="prova-beta-url"]')?.content;
  if (betaURL && /^(https:\/\/|mailto:)/.test(betaURL)) {
    const action = document.querySelector('#join-action');
    action.href = betaURL;
    action.textContent = 'Request beta access ↗';
    document.querySelector('#access-status').textContent = 'Teachers can request beta access. Students join through their teacher.';
  }

  document.documentElement.classList.add('js-ready');
})();
