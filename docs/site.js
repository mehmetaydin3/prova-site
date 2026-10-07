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
  document.querySelectorAll('[data-image]').forEach(button => button.addEventListener('click', () => {
    const full = document.querySelector('#full-image');
    full.src = `assets/product/${button.dataset.image}.jpg`;
    full.alt = screenDescriptions[button.dataset.image];
    dialog.showModal();
    document.querySelector('#close-image').focus();
  }));
  document.querySelector('#close-image').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => { if (event.target === dialog) { const r = dialog.getBoundingClientRect(); if (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) dialog.close(); } });

  function emphasize(element) {
    if (element.animate) element.animate([{opacity: .45}, {opacity: 1}], {duration: reduced() ? 200 : 250, easing: 'ease-in-out'});
  }
  const checks = [...document.querySelectorAll('[data-check]')];
  function checklistChanged() {
    const completed = checks.filter(input => input.checked).length;
    const next = checks.find(input => !input.checked)?.nextElementSibling.textContent;
    const focus = next ? `Next: ${next.charAt(0).toLowerCase()}${next.slice(1)}` : 'All steps checked. Bring the take to your next lesson.';
    document.querySelector('#checklist-count').textContent = `${completed} of 4 steps`;
    document.querySelector('#checklist-fill').style.width = `${completed / 4 * 100}%`;
    document.querySelector('#checklist-status').textContent = next ? focus + '.' : focus;
    document.querySelector('#practice-focus').textContent = focus;
    emphasize(document.querySelector('#checklist-count'));
  }
  checks.forEach(input => input.addEventListener('change', checklistChanged));

  const clock = document.querySelector('#practice-clock');
  const timerButton = document.querySelector('#practice-toggle');
  const timerStatus = document.querySelector('#practice-status');
  let elapsed = 0, startedAt = null, timer = null;
  function tick() {
    const seconds = Math.floor((elapsed + (startedAt === null ? 0 : performance.now() - startedAt)) / 1000);
    clock.textContent = `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`;
  }
  function pauseTimer() {
    if (startedAt === null) return;
    elapsed += performance.now() - startedAt;
    startedAt = null;
    clearInterval(timer);
    timer = null;
    buttonText(timerButton, 'Continue the preview ▶');
    timerButton.setAttribute('aria-pressed', 'false');
    timerStatus.textContent = 'Preview paused. No practice is saved.';
    tick();
  }
  timerButton.addEventListener('click', () => {
    if (startedAt !== null) { pauseTimer(); return; }
    startedAt = performance.now();
    timer = setInterval(tick, 200);
    buttonText(timerButton, 'Pause the preview Ⅱ');
    timerButton.setAttribute('aria-pressed', 'true');
    timerStatus.textContent = 'Preview running. The instruction stays in view.';
    emphasize(clock);
  });
  document.querySelector('#practice-reset').addEventListener('click', () => {
    pauseTimer(); elapsed = 0; tick(); buttonText(timerButton, 'Start the preview ▶');
    timerStatus.textContent = 'A sample timer. No practice is saved.';
  });
  document.addEventListener('visibilitychange', () => { if (document.hidden) pauseTimer(); });

  const shareButton = document.querySelector('#share-preview');
  function sharePreview(shared) {
    document.querySelector('.share-demo').dataset.shared = String(shared);
    shareButton.setAttribute('aria-pressed', String(shared));
    buttonText(shareButton, shared ? 'Shared in this example ✓' : 'Share with teacher ↗');
    document.querySelector('#share-status').textContent = shared ? 'In this example, your teacher can now hear the take.' : 'Private. This sample take is only yours.';
    emphasize(document.querySelector('#share-status'));
  }
  shareButton.addEventListener('click', () => sharePreview(true));
  document.querySelector('#share-reset').addEventListener('click', () => sharePreview(false));

  const beats = [...document.querySelectorAll('[data-beat]')];
  if ('IntersectionObserver' in window) {
    document.documentElement.classList.add('motion-ready');
    const settle = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('settled'); settle.unobserve(entry.target); }
    }), {threshold: .15});
    document.querySelectorAll('.evidence').forEach(element => settle.observe(element));
    const follow = new IntersectionObserver(entries => entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      beats.forEach(link => {
        if (link.dataset.beat === entry.target.id) link.setAttribute('aria-current', 'step');
        else link.removeAttribute('aria-current');
      });
    }), {rootMargin: '-20% 0px -45% 0px', threshold: 0});
    document.querySelectorAll('[data-movement]').forEach(element => follow.observe(element));
    new IntersectionObserver(entries => { if (!entries[0].isIntersecting) pauseTimer(); }, {threshold: .1}).observe(document.querySelector('.timer-demo'));
  }

  const wave = document.querySelector('#waveform');
  const bars = Array.from({length: 80}, (_, i) => {
    const bar = document.createElement('i');
    // Illustrative waveform, not a signal extracted from a student recording.
    bar.style.height = `${14 + 72 * Math.abs(Math.sin(i * 1.71) * Math.cos(i * .17))}%`;
    wave.append(bar);
    return bar;
  });
  const position = document.querySelector('#position');
  const notes = [...document.querySelectorAll('[data-time]')];
  let selectedFeedback = 'Let the half note ring its full value.';
  function seek(value, announce = false) {
    const time = Math.max(0, Math.min(47, Number(value)));
    position.value = String(time);
    position.setAttribute('aria-valuetext', `${time} seconds of a 47-second sample take`);
    document.querySelector('#timecode').textContent = `0:${String(time).padStart(2, '0')}`;
    document.querySelector('#playhead').style.left = `${time / 47 * 100}%`;
    bars.forEach((bar, i) => bar.classList.toggle('played', i / 80 <= time / 47));
    notes.forEach(note => note.setAttribute('aria-pressed', String(Number(note.dataset.time) === time)));
    if (time === 18 || time === 41) {
      selectedFeedback = time === 18 ? 'Let the half note ring its full value.' : 'Lovely dynamics here. Keep that.';
      document.querySelector('#next-focus').textContent = selectedFeedback;
    }
    if (announce) document.querySelector('#feedback-status').textContent = time === 18 ? 'At 0:18: let the half note ring its full value.' : time === 41 ? 'At 0:41: lovely dynamics here. Keep that.' : `Sample position: 0:${String(time).padStart(2, '0')}. Select a note to find its moment.`;
  }
  position.addEventListener('input', () => seek(position.value));
  position.addEventListener('change', () => seek(position.value, true));
  notes.forEach(note => note.addEventListener('click', () => seek(note.dataset.time, true)));
  document.querySelector('#carry-feedback').addEventListener('click', () => {
    pauseTimer();
    document.querySelector('#practice-note').textContent = selectedFeedback;
    document.querySelector('#practice-status').textContent = 'Your selected sample feedback is now beside the practice preview.';
    const target = document.querySelector('#practice');
    target.scrollIntoView({behavior: reduced() ? 'instant' : 'smooth', block: 'start'});
    timerButton.focus({preventScroll: true});
    emphasize(document.querySelector('.practice-note'));
  });
  seek(18);

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
  const syncFilm = () => { buttonText(filmButton, film.paused ? (film.ended ? 'Replay the entrance ↻' : 'Play the entrance ▶') : 'Pause the entrance Ⅱ'); };
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
