(() => {
  const loop = document.querySelector('[data-loop]');
  if (!loop) return;
  const prefersReduced = matchMedia('(prefers-reduced-motion: reduce)');
  const tabs = [...document.querySelectorAll('[data-stage]')];
  const screens = [...document.querySelectorAll('.loop-screen')];
  const stages = [
    {chapter:'THE ASSIGNMENT',title:'The next practice is clear.',description:'Today gives Maya a concrete place to begin: Minuet in G, bars 12–16, with the left hand alone.',aside:'Assignment and practice steps live together in Prova.',screen:'.loop-screen-today'},
    {chapter:'THE TAKE',title:'A take is hers to share.',description:'The student records in Prova, then decides whether to share that clip privately with the teacher.',aside:'This capture shows the native share prompt; the test canceled it.',screen:'.loop-screen-share'},
    {chapter:'THE TEACHER LISTENS',title:'A moment comes into focus.',description:'In the seeded teacher review, the playhead lands at 0:42 and the related comment is highlighted on the take.',aside:'“Keep the bow on the string through the F♯…”',screen:'.loop-screen-listening'},
    {chapter:'THE REPLY',title:'A thought, right where it belongs.',description:'The real comment composer opens at the selected moment, ready for a teacher’s note.',aside:'The pictured draft is open at 0:56; it has not been posted.',screen:'.loop-screen-compose'},
    {chapter:'BACK WITH THE STUDENT',title:'The guidance stays with the take.',description:'The student view shows timestamped comments with their authors, so the teacher’s thought is easy to return to.',aside:'Teacher and student comments remain distinct.',screen:'.loop-screen-student'}
  ];
  let active = -1;
  let scheduled = false;
  const copy = {
    chapter:document.querySelector('[data-chapter]'),
    title:document.querySelector('[data-title]'),
    description:document.querySelector('[data-description]'),
    aside:document.querySelector('[data-aside]'),
    count:document.querySelector('[data-count]'),
    progress:document.querySelector('[data-progress]')
  };
  const clamp = (v,lo,hi) => Math.min(hi,Math.max(lo,v));
  function setStage(index, fromScroll=false) {
    index = clamp(index,0,stages.length-1);
    if (active === index) return;
    const animateCopy = active >= 0 && !motionReduced();
    active = index;
    const stage = stages[index];
    copy.chapter.textContent = stage.chapter;
    copy.title.textContent = stage.title;
    copy.description.textContent = stage.description;
    copy.aside.textContent = stage.aside;
    if (animateCopy) [copy.chapter,copy.title,copy.description,copy.aside].forEach(el => el.animate?.([{opacity:.55,transform:'translateY(8px)'},{opacity:1,transform:'translateY(0)'}],{duration:420,easing:'cubic-bezier(.2,.72,.2,1)'}));
    copy.count.textContent = String(index+1).padStart(2,'0');
    copy.progress.style.width = `${index/(stages.length-1)*100}%`;
    screens.forEach(node => { const selectors=stage.screen?(Array.isArray(stage.screen)?stage.screen:[stage.screen]):[]; const shown=selectors.some(selector=>node.matches(selector)); node.classList.toggle('is-active',shown); node.setAttribute('aria-hidden',String(!shown)); node.inert=!shown; });
    tabs.forEach((button,i) => button.setAttribute('aria-pressed',String(i===index)));

  }
  let manualReduced = false;
  const motionButton = document.querySelector('[data-motion-toggle]');
  const motionReduced = () => prefersReduced.matches || manualReduced;
  function syncMotion() {
    const reduced=motionReduced();
    document.documentElement.dataset.motion = reduced?'reduce':'full';
    loop.dataset.reduced = String(reduced);
    motionButton.setAttribute('aria-pressed',String(reduced));
    motionButton.textContent = reduced?'Motion reduced':'Reduce motion';
  }
  function onScroll() {
    scheduled = false;
    if (motionReduced()) return;
    const rect = document.querySelector('.loop').getBoundingClientRect();
    const travel = Math.max(1,rect.height-innerHeight);
    const progress = clamp(-rect.top/travel,0,1);
    setStage(Math.round(progress*(stages.length-1)),true);
  }
  function requestScrollUpdate() {
    if (!scheduled) { scheduled=true; requestAnimationFrame(onScroll); }
  }
  tabs.forEach((button,index) => button.addEventListener('click',() => {
    if (motionReduced()) { setStage(index); return; }
    const section = document.querySelector('.loop');
    const travel = Math.max(0,section.offsetHeight-innerHeight);
    const destination = section.offsetTop + travel*(index/(stages.length-1));
    window.scrollTo({top:destination,behavior:'smooth'});
  }));
  addEventListener('scroll',requestScrollUpdate,{passive:true});
  addEventListener('resize',requestScrollUpdate,{passive:true});
  prefersReduced.addEventListener('change',() => {
    syncMotion();
    if (!motionReduced()) requestScrollUpdate();
  });
  motionButton.addEventListener('click',() => {
    manualReduced = !manualReduced;
    syncMotion();
    if (motionReduced()) setStage(active < 0?0:active); else requestScrollUpdate();
  });
  syncMotion();
  setStage(0);
  if (!motionReduced()) requestScrollUpdate();
})();


// Editorial score camera: begin inside the phrase, then reveal the shared page.
(() => {
  const section = document.querySelector('.score-scroll');
  if (!section) return;
  const stage = section.querySelector('.score-stage');
  const camera = section.querySelector('.score-camera');
  const caption = section.querySelector('[data-score-caption]');
  const buttons = [...section.querySelectorAll('[data-score-layer]')];
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const captions = ['One phrase. A place to begin.', 'The teacher shapes the phrase.', 'A thought stays beside the music.', 'The student adds a way forward.', 'Two readings. One shared score.'];
  let queued = false;
  function render() {
    queued = false;
    const still = reduced.matches || document.documentElement.dataset.motion === 'reduce';
    const progress = still ? 1 : Math.max(0, Math.min(1, -section.getBoundingClientRect().top / Math.max(1, section.offsetHeight - innerHeight)));
    const beat = Math.min(4, Math.floor(progress * 4.999));
    const wide = Math.min(stage.clientWidth * .94 / camera.offsetWidth, stage.clientHeight * .94 / camera.offsetHeight);
    const pullback = progress * progress * (3 - 2 * progress);
    const scale = wide * (2.8 - 1.8 * pullback);
    camera.style.setProperty('--cam-scale', scale);
    camera.style.setProperty('--cam-x', `${-camera.offsetWidth * .055 * scale * (1 - pullback)}px`);
    camera.style.setProperty('--cam-y', `${camera.offsetHeight * .20 * scale * (1 - pullback)}px`);
    stage.dataset.beat = String(beat);
    caption.textContent = captions[beat];
    section.querySelector('.score-progress span').style.width = `${progress * 100}%`;
  }
  function schedule() { if (!queued) { queued = true; requestAnimationFrame(render); } }
  buttons.forEach(button => button.addEventListener('click', () => {
    stage.dataset.layer = button.dataset.scoreLayer;
    stage.classList.add('layers-explored');
    buttons.forEach(b => b.setAttribute('aria-pressed', String(b === button)));
  }));
  addEventListener('scroll', schedule, {passive:true});
  addEventListener('resize', schedule, {passive:true});
  reduced.addEventListener('change', schedule);
  new MutationObserver(schedule).observe(document.documentElement, {attributes:true, attributeFilter:['data-motion']});
  render();
})();
