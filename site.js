(() => {
  'use strict';
  const appearance = document.querySelector('#appearance');
  const systemAppearance = matchMedia('(prefers-color-scheme: dark)');
  let appearanceChoice = 'system';
  try { const saved = localStorage.getItem('prova-appearance'); if (['light', 'dark'].includes(saved)) appearanceChoice = saved; } catch {}
  function syncAppearance() {
    if (appearanceChoice === 'system') delete document.documentElement.dataset.theme;
    else document.documentElement.dataset.theme = appearanceChoice;
    appearance.value = appearanceChoice;
    const dark = appearanceChoice === 'dark' || (appearanceChoice === 'system' && systemAppearance.matches);
    document.querySelector('meta[name="theme-color"]').content = dark ? '#060511' : '#F7F6FB';
  }
  appearance.addEventListener('change', () => {
    appearanceChoice = appearance.value;
    try { if (appearanceChoice === 'system') localStorage.removeItem('prova-appearance'); else localStorage.setItem('prova-appearance', appearanceChoice); } catch {}
    syncAppearance();
  });
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
  // A small guided sequence links captured, verified screens. It does not
  // operate the app, capture a take, or play the take shown in the images.
  const previewFigure = document.querySelector('.hero-product');
  const previewScreen = document.querySelector('#preview-screen');
  const previewDescription = document.querySelector('#preview-description');
  const previewButtons = [...document.querySelectorAll('[data-preview-step]')];
  document.querySelector('#preview-kicker').textContent = 'Interactive preview';
  const previewStates = {
    plan: {image: 'today-plan.jpg', alt: 'Actual Prova Today plan: the assigned Minuet passage, completed scale and practice suggestions.', copy: 'A clear plan keeps the teacher’s assignment in view between lessons.'},
    assignment: {image: 'assignment.jpg', alt: 'Actual Prova assignment: Minuet in G, bars 12 to 16, with a four-step checklist and practice button.', copy: 'The teacher’s passage and checklist show the student where to begin.'},
    practice: {image: 'practice.jpg', alt: 'Actual Prova Practice Mode with the teacher’s instruction, timer, metronome and recording controls.', copy: 'In Practice Mode, the instruction stays beside the work and the recording controls.'},
    take: {image: 'conversation.jpg', alt: 'Actual Prova assignment conversation with the linked Recordings section showing a shared Minuet take, 38 seconds long.', copy: 'A 38-second take appears in the assignment’s recording section after it has been shared.'},
    feedback: {image: 'conversation.jpg', alt: 'Actual Prova assignment thread: the teacher replies to the student’s question about third position.', copy: 'The teacher’s reply stays with the assignment, ready for the next practice.'}
  };
  let previewCurrent = 'plan';
  let previewTimer;
  function selectPreview(name) {
    const state = previewStates[name];
    if (!state) return;
    clearTimeout(previewTimer);
    previewCurrent = name;
    previewButtons.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.previewStep === name)));
    previewDescription.textContent = state.copy;
    if (!reduced() && previewScreen.getAttribute('src') !== `assets/product/${state.image}`) {
      previewFigure.dataset.changing = 'true';
      previewTimer = setTimeout(() => {
        previewScreen.src = `assets/product/${state.image}`;
        previewScreen.alt = state.alt;
        delete previewFigure.dataset.changing;
      }, 110);
    } else {
      previewScreen.src = `assets/product/${state.image}`;
      previewScreen.alt = state.alt;
      delete previewFigure.dataset.changing;
    }
  }
  previewButtons.forEach((button, index) => {
    button.addEventListener('click', () => selectPreview(button.dataset.previewStep));
    button.addEventListener('keydown', event => {
      if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
      event.preventDefault();
      const next = event.key === 'Home' ? 0 : event.key === 'End' ? previewButtons.length - 1 : (index + (event.key === 'ArrowRight' ? 1 : -1) + previewButtons.length) % previewButtons.length;
      previewButtons[next].focus(); previewButtons[next].click();
    });
  });
  const personaContent = {
    teacher: {copy: 'Set an assignment, hear the shared take and guide the next step.', target: 'feedback', label: 'Explore the teacher’s part'},
    student: {copy: 'Carry the instruction into practice, then share a take when it is ready.', target: 'practice', label: 'Explore the student’s part'},
    parent: {copy: 'Ask your child to show the plan and help make time for the next step.', target: 'assignment', label: 'Explore the family’s part'}
  };
  const personaLink = document.querySelector('#persona-link');
  document.querySelectorAll('[data-persona]').forEach(button => button.addEventListener('click', () => {
    const person = personaContent[button.dataset.persona];
    document.querySelectorAll('[data-persona]').forEach(choice => choice.setAttribute('aria-pressed', String(choice === button)));
    document.querySelector('#persona-copy').textContent = person.copy;
    document.querySelector('#persona-link-label').textContent = person.label;
    personaLink.dataset.previewTarget = person.target;
  }));
  personaLink.addEventListener('click', () => selectPreview(personaLink.dataset.previewTarget));
  document.addEventListener('prova:motionchange', () => {
    clearTimeout(previewTimer);
    if (reduced()) {
      const state = previewStates[previewCurrent];
      previewScreen.src = `assets/product/${state.image}`;
      previewScreen.alt = state.alt;
      delete previewFigure.dataset.changing;
    }
  });
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
  // Observe only two content groups per section. On mobile, a tall screenshot
  // enters when it actually reaches the viewport, without a reading delay.
  if ('IntersectionObserver' in window) {
    const pairedLayout = matchMedia('(min-width: 761px)');
    const settle = group => { group.classList.add('settled'); entrance.unobserve(group); };
    const entrance = new IntersectionObserver(entries => entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const section = entry.target.closest('[data-movement]');
      if (pairedLayout.matches) {
        // A tall phone can be visible before its centered explanation. Hold
        // both groups for the explanation, then let CSS stagger the product.
        const copy = section.querySelector('[data-entrance="copy"]');
        if (entry.target === copy || copy.classList.contains('settled')) {
          section.querySelectorAll('[data-entrance]').forEach(settle);
        }
      } else settle(entry.target);
    }), {threshold: .08, rootMargin: '0px 0px -32px 0px'});
    document.querySelectorAll('[data-movement]').forEach(section => {
      section.querySelectorAll('.movement-copy, .arrival-copy, .audience-intro, .evidence, .native-take, .audience-parts').forEach(group => {
        group.dataset.entrance = group.matches('.evidence, .native-take, .audience-parts') ? 'evidence' : 'copy';
        entrance.observe(group);
      });
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
  document.documentElement.classList.add('js-ready');
  arrival();
})();
