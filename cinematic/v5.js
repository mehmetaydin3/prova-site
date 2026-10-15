(() => {
  'use strict';
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const bridges = [...document.querySelectorAll('.musical-handoff')];
  let frame = 0;
  const visible = new Set();
  // The same five lines move from sound to notation, then into the rhythm of practice.
  function render() {
    frame = 0;
    for (const bridge of bridges) {
      if (!visible.has(bridge) && !reduced.matches) continue;
      const rect = bridge.getBoundingClientRect();
      const progress = reduced.matches ? .65 : Math.max(0, Math.min(1, (innerHeight - rect.top) / (innerHeight + rect.height)));
      const resolve = progress * progress * (3 - 2 * progress);
      bridge.querySelectorAll('path').forEach((path, line) => {
        let d = '';
        for (let x = 0; x <= 1200; x += 8) {
          const envelope = Math.sin(x / 1200 * Math.PI);
          const wave = Math.sin(x * .048 + line * .6) * 36 * envelope;
          const staff = (line - 2) * 13;
          const rhythm = Math.sin(x * .018) * 24 * envelope;
          const y = 90 + (bridge.classList.contains('to-night') ? staff * (1-resolve) + rhythm * resolve + (line-2)*4 : wave * (1-resolve) + staff * resolve);
          d += `${x ? 'L' : 'M'}${x},${y.toFixed(1)}`;
        }
        path.setAttribute('d',d);
      });
      const cursor = bridge.querySelector('circle');
      cursor.setAttribute('cx', (resolve * 1200).toFixed(1));
      cursor.setAttribute('cy', '90');
    }
  }
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => entry.isIntersecting ? visible.add(entry.target) : visible.delete(entry.target));
    if (!frame) frame = requestAnimationFrame(render);
  });
  bridges.forEach(bridge => observer.observe(bridge));
  addEventListener('scroll', () => { if (visible.size && !reduced.matches && !frame) frame = requestAnimationFrame(render); }, {passive:true});
  addEventListener('resize', () => { if (!frame) frame = requestAnimationFrame(render); });
  reduced.addEventListener('change',render);
  const minutes = [12,18,8,22,16,20,0];
  document.querySelectorAll('.practice-chart i').forEach((bar,i) => bar.dataset.minutes = minutes[i] || '—');
  document.querySelector('#badge-unlock').addEventListener('click', () => {
    document.querySelector('.achievement-instrument').classList.add('is-unlocked');
  });
})();
