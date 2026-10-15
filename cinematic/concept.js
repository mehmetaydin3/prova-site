(() => {
  'use strict';
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  // Core content is visible without JavaScript. Motion is editorial only.
  if (!reduced.matches && 'IntersectionObserver' in window) {
    const sections = [...document.querySelectorAll('.section-top, .purpose-layout, .feedback-heading, .score-layout, .ensemble-heading')];
    sections.forEach(section => section.setAttribute('data-reveal', ''));
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('seen');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.08 });
    sections.forEach(section => observer.observe(section));
    document.documentElement.classList.add('reveal-ready');
    reduced.addEventListener('change', event => {
      if (!event.matches) return;
      observer.disconnect();
      sections.forEach(section => section.classList.add('seen'));
      document.documentElement.classList.remove('reveal-ready');
    });
  }
})();
(() => {
  'use strict';
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  const play = document.querySelector('#wave-play');
  const head = document.querySelector('.wave-playhead');
  const time = document.querySelector('#wave-time');
  const comment = document.querySelector('#wave-comment');
  const foot = document.querySelector('#comment-foot');
  let seconds = 0, running = false, last = 0, raf = 0;
  function paint() {
    const position = Math.min(38, seconds);
    head.setAttribute('transform', `translate(${position / 38 * 720} 0)`);
    time.textContent = `0:${String(Math.floor(position)).padStart(2, '0')}`;
    if (position >= 31) { comment.textContent = '“Yes. Keep that shape in the next phrase.”'; foot.textContent = '0:31 · Teacher feedback · tap marker 1 to return to the earlier note.'; }
    else if (position >= 18) { comment.textContent = '“Let the half note ring its full value.”'; foot.textContent = '0:18 · Teacher feedback · the student can return to this moment.'; }
    else { comment.textContent = 'A take. A closer listen. A note in the right place.'; foot.textContent = 'Silent conceptual demonstration · sample comments, not captured app content.'; }
  }
  function stop() { running = false; cancelAnimationFrame(raf); play.textContent = '▶'; play.setAttribute('aria-label', 'Play silent feedback demonstration'); }
  function tick(now) { if (!running) return; if (last) seconds += (now-last)/1000*2; last=now; paint(); if(seconds>=38){stop();return;} raf=requestAnimationFrame(tick); }
  play.addEventListener('click', () => {
    if(running){stop();return;}
    if (seconds >= 38) seconds = 0;
    if(reduce.matches){seconds=seconds<18?18:seconds<31?31:0;paint();return;}
    running=true;last=0;play.textContent='Ⅱ';play.setAttribute('aria-label','Pause silent demonstration');raf=requestAnimationFrame(tick);
  });
  document.querySelectorAll('[data-seek]').forEach(button=>button.addEventListener('click',()=>{stop();seconds=Number(button.dataset.seek);paint();}));
  document.querySelector('#wave-reset').addEventListener('click',()=>{stop();seconds=0;paint();});
  new IntersectionObserver(entries=>entries.forEach(entry=>{if(!entry.isIntersecting)stop();})).observe(document.querySelector('#wave-demo'));
  document.addEventListener('visibilitychange',()=>{if(document.hidden)stop();});
  reduce.addEventListener('change',()=>stop());
  const page=document.querySelector('.score-page');
  const response=document.querySelector('#score-response');
  document.querySelectorAll('[data-layer]').forEach(button=>{if(button.tagName!=='BUTTON')return;button.addEventListener('click',()=>{
    page.dataset.layer=button.dataset.layer;
    document.querySelectorAll('button[data-layer]').forEach(other=>other.setAttribute('aria-pressed',String(button===other)));
    response.textContent={student:'The student’s question. Their own layer.',teacher:'The teacher’s guidance. A separate layer.',both:'Two layers. One shared understanding.'}[button.dataset.layer];
  });});
  function replay(element){element.classList.remove('replaying');void element.offsetWidth;element.classList.add('replaying');}
  document.querySelector('#score-replay').addEventListener('click',()=>replay(page));
  document.querySelector('#progress-replay').addEventListener('click',()=>replay(document.querySelector('.practice-chart')));
  const badge=document.querySelector('#badge-unlock');
  badge.addEventListener('click',()=>{badge.classList.remove('unlock');void badge.offsetWidth;badge.classList.add('unlock');document.querySelector('#badge-title').textContent='First steps. Well taken.';document.querySelector('#badge-copy').textContent='Concept unlock: first practice session logged. A beginning worth keeping.';});
  const observer = new IntersectionObserver(entries=>entries.forEach(entry=>{if(!entry.isIntersecting)return;replay(entry.target);observer.unobserve(entry.target);}),{threshold:.35});
  observer.observe(page);observer.observe(document.querySelector('.practice-chart'));
})();
