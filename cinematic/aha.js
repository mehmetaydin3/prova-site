(() => {
  const root = document.querySelector('.aha');
  const run = document.querySelector('#aha-run');
  const score = root.querySelector('.aha-score');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  const copy = [
    ['A lesson ends.', 'The intention stays on the page.'],
    ['Your teacher marks the phrase.', 'Not just which notes. How to listen.'],
    ['Stay with this one detail.', 'Let the half note carry the phrase.'],
    ['Tonight, you open the same music.', 'A clear place to begin again.']
  ];
  let frame = 0, previous = -1;
  const clamp = n => Math.max(0, Math.min(1, n));
  const ease = n => { n = clamp(n); return n * n * (3 - 2 * n); };
  function update() {
    frame = 0;
    const p = reduce.matches ? 0 : clamp(-run.getBoundingClientRect().top / Math.max(1, run.offsetHeight - innerHeight));
    const step = p < .18 ? 0 : p < .4 ? 1 : p < .72 ? 2 : 3;
    if (step !== previous) {
      root.dataset.step = step;
      root.querySelector('#aha-count').textContent = `0${step + 1} / 04`;
      root.querySelector('#aha-num').textContent = `0${step + 1}`;
      root.querySelector('#aha-line').innerHTML = `${copy[step][0]}<br><b>${copy[step][1]}</b>`;
      previous = step;
    }
    const mobile = innerWidth <= 700;
    const into = ease((p - .32) / .22), out = ease((p - .66) / .24);
    const zoom = 1 + into * (mobile ? .85 : 1.05) - out * (mobile ? 1.03 : 1.3);
    score.style.setProperty('--scale', zoom.toFixed(4));
    score.style.setProperty('--x', `${(-into * (mobile ? 10 : 30) - out * (mobile ? 42 : 160)).toFixed(2)}px`);
    score.style.setProperty('--y', `${(-out * (mobile ? 95 : 10)).toFixed(2)}px`);
    root.querySelector('.aha-progress i').style.transform = `scaleX(${p})`;
  }
  const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
  addEventListener('scroll', schedule, { passive: true });
  addEventListener('resize', schedule);
  reduce.addEventListener('change', schedule);
  schedule();
})();
