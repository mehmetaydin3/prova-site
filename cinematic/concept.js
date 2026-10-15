(() => {
  'use strict';
  const $ = selector => document.querySelector(selector);
  const $$ = selector => [...document.querySelectorAll(selector)];
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const desktop = matchMedia('(min-width: 901px)');
  const activeAnimations = new Set();
  function animate(element, frames, options = {}) {
    if (reduced.matches || !element.animate) return;
    const animation = element.animate(frames, {duration:500, easing:'cubic-bezier(.2,.75,.2,1)', ...options});
    activeAnimations.add(animation);
    animation.finished.catch(()=>{}).finally(()=>activeAnimations.delete(animation));
    return animation;
  }
  const reveals = $$('.promise-heading h2, .promise-heading > p, .promise-sequence article, .section-top, .purpose-layout h2, .purpose-copy, .feedback-heading, #score-title, .score-benefit, .ensemble-heading, .parent-moment h2, .parent-moment > p, .closing h2, .studio-preview > div, .journey-line li, .ensemble-images figure');
  const entrance = new IntersectionObserver(entries => entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    animate(entry.target, [{opacity:.3,transform:'translateY(22px)'},{opacity:1,transform:'translateY(0)'}]);
    entrance.unobserve(entry.target);
  }), {threshold:.13});
  reveals.forEach(element=>entrance.observe(element));
  // Progressive enhancement: content never relies on an initial hidden style.
  $$('.hero-heading > *').forEach((element,i)=>animate(element,[{opacity:.2,transform:'translateY(18px)'},{opacity:1,transform:'translateY(0)'}],{duration:650,delay:i*85}));
  $$('.hero-stage .device').forEach((element,i)=>animate(element,[{opacity:.1,translate:'0 45px'},{opacity:1,translate:'0 0'}],{duration:950,delay:200+i*85}));

  // Only one scroll frame is scheduled per input frame, with no persistent loop.
  let scrollFrame=0, heroVisible=true, scoreVisible=false, autoScore=true;
  const scorePage=$('.score-page');
  const layerButtons=$$('button[data-layer]');
  let currentLayer='both';
  function setLayer(layer, manual=false) {
    if(manual) autoScore=false;
    if(currentLayer===layer && !manual)return;
    currentLayer=layer;scorePage.dataset.layer=layer;
    layerButtons.forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.layer===layer)));
    $$('.score-beats article').forEach(article=>article.classList.toggle('is-current',article.dataset.scoreStep===layer));
    $('#score-response').textContent={student:'The student’s question. Their own layer.',teacher:'The teacher’s guidance. A separate layer.',both:'Two layers. One shared understanding.'}[layer];
    animate($('#score-response'),[{opacity:.3,transform:'translateY(4px)'},{opacity:1,transform:'translateY(0)'}],{duration:240});
  }
  function scrollUpdate(){
    scrollFrame=0;
    if(reduced.matches)return;
    if(heroVisible && desktop.matches){const y=Math.min(28,Math.max(0,scrollY*.035));$('.hero-stage').style.setProperty('--hero-depth',`${y}px`);}
    if(scoreVisible && desktop.matches && autoScore){
      const beats=$$('.score-beats article');let chosen=beats[0];
      for(const beat of beats) if(beat.getBoundingClientRect().top<innerHeight*.55)chosen=beat;
      setLayer(chosen.dataset.scoreStep);
    }
  }
  addEventListener('scroll',()=>{if(!scrollFrame&&(heroVisible||scoreVisible))scrollFrame=requestAnimationFrame(scrollUpdate);},{passive:true});
  const visibility=new IntersectionObserver(entries=>entries.forEach(entry=>{
    if(entry.target.matches('.overture')){heroVisible=entry.isIntersecting;if(heroVisible&&!scrollFrame)scrollFrame=requestAnimationFrame(scrollUpdate);}
    else {scoreVisible=entry.isIntersecting;if(!entry.isIntersecting)stopExchange();}
  }));visibility.observe($('.overture'));visibility.observe($('.score-story'));
  layerButtons.forEach(button=>button.addEventListener('click',()=>{stopExchange();setLayer(button.dataset.layer,true);}));
  const strokeFrames=[{strokeDashoffset:500},{strokeDashoffset:0}];
  function drawScore(){if(reduced.matches)return;$$('.draw-mark').forEach((path,i)=>animate(path,strokeFrames,{duration:1100,delay:i<2?i*100:350+(i-2)*100}));}
  $('#score-replay').addEventListener('click',drawScore);
  let exchangeTimer=0,exchangeStep=0,exchangePlaying=false;
  const exchangeButton=$('#play-exchange');
  const exchangeLabels=['Student saves a question on their layer.','Teacher opens the saved score and adds guidance.','Student reopens the score for the next practice.'];
  function stopExchange(){clearTimeout(exchangeTimer);exchangePlaying=false;exchangeButton.innerHTML='Play the exchange <span aria-hidden="true">↗</span>';exchangeButton.setAttribute('aria-pressed','false');}
  function exchangeBeat(){setLayer(['student','teacher','both'][exchangeStep],true);$('#exchange-status').textContent=exchangeLabels[exchangeStep];drawScore();exchangeStep++;if(exchangeStep<3)exchangeTimer=setTimeout(exchangeBeat,1900);else exchangeTimer=setTimeout(stopExchange,1200);}
  exchangeButton.addEventListener('click',()=>{
    if(exchangePlaying){stopExchange();return;}
    if(reduced.matches){setLayer(['student','teacher','both'][exchangeStep%3],true);$('#exchange-status').textContent=exchangeLabels[exchangeStep%3];exchangeStep++;return;}
    exchangePlaying=true;exchangeStep=0;exchangeButton.textContent='Pause exchange Ⅱ';exchangeButton.setAttribute('aria-pressed','true');exchangeBeat();
  });

  // Playback only moves after an explicit action; the scrubber is native keyboard UI.
  let seconds=18,running=false,last=0,playFrame=0,lastComment='',placedNote=null,lastBar=-1;
  const play=$('#wave-play'),time=$('#wave-time'),head=$('.wave-playhead'),scrub=$('#wave-scrub');
  function showComment(copy,foot){
    if(copy===lastComment)return;lastComment=copy;
    $('#wave-comment').textContent=copy;$('#comment-foot').textContent=foot;
    animate($('#wave-comment'),[{opacity:.2,transform:'translateY(7px)'},{opacity:1,transform:'translateY(0)'}],{duration:300});
  }
  function paint(){
    const position=Math.min(38,seconds);head.setAttribute('transform',`translate(${position/38*720} 0)`);
    const label=`0:${String(Math.floor(position)).padStart(2,'0')}`;
    if(time.textContent!==label){time.textContent=label;$('#scrub-value').textContent=label;}
    scrub.value=position;
    const barIndex=Math.floor(position/38*89);
    if(lastBar!==barIndex){lastBar=barIndex;$$('.wave-bars rect').forEach((bar,i)=>bar.classList.toggle('is-played',i<=barIndex));}
    $$('[data-seek]').forEach(button=>button.setAttribute('aria-pressed',String(Math.abs(position-Number(button.dataset.seek))<1)));
    if(placedNote && Math.abs(position-placedNote.at)<2)showComment(placedNote.body,`Sample note placed at 0:${String(placedNote.at).padStart(2,'0')} · conceptual, not saved to Prova.`);
    else if(position>=31)showComment('“Yes. Keep that shape in the next phrase.”','0:31 · Teacher feedback · sample comment.');
    else if(position>=18)showComment('“Let the half note ring its full value.”','0:18 · Teacher feedback · sample comment.');
    else showComment('A take. A closer listen. A note in the right place.','Silent conceptual demonstration · sample content.');
  }
  function stopPlayback(){running=false;cancelAnimationFrame(playFrame);play.textContent='▶';play.setAttribute('aria-label',reduced.matches?'Next feedback moment':'Play silent feedback demonstration');play.setAttribute('aria-pressed','false');}
  function tick(now){if(!running)return;if(last)seconds+=(now-last)/1000*2;last=now;paint();if(seconds>=38){stopPlayback();return;}playFrame=requestAnimationFrame(tick);}
  play.addEventListener('click',()=>{if(running){stopPlayback();return;}if(seconds>=38)seconds=0;if(reduced.matches){seconds=seconds<18?18:seconds<31?31:0;paint();return;}running=true;last=0;play.textContent='Ⅱ';play.setAttribute('aria-label','Pause silent demonstration');play.setAttribute('aria-pressed','true');playFrame=requestAnimationFrame(tick);});
  $$('[data-seek]').forEach(button=>button.addEventListener('click',()=>{stopPlayback();seconds=Number(button.dataset.seek);paint();$('#comment-state').textContent=`Reviewing the note at ${time.textContent}.`;}));
  scrub.addEventListener('input',()=>{stopPlayback();seconds=Number(scrub.value);paint();});
  $('#wave-reset').addEventListener('click',()=>{stopPlayback();seconds=0;placedNote=null;$('#comment-role').textContent='TEACHER → STUDENT';paint();$('#comment-state').textContent='Choose a moment, then leave a note.';});
  $('#place-comment').addEventListener('click',()=>{stopPlayback();$('#comment-role').textContent='TEACHER → STUDENT';placedNote={at:Math.floor(seconds),body:'“Try this phrase slowly, then connect it.”'};paint();$('#comment-state').textContent=`Sample note placed at ${time.textContent}. Nothing is saved or sent.`;animate($('#comment-state'),[{opacity:.2},{opacity:1}],{duration:250});});
  $('#review-comment').addEventListener('click',()=>{stopPlayback();seconds=placedNote?placedNote.at:18;paint();$('#comment-role').textContent='STUDENT / REVIEWING TEACHER FEEDBACK';$('#comment-state').textContent=`Student review at ${time.textContent}. Replay to hear where the guidance belongs.`;});
  new IntersectionObserver(entries=>entries.forEach(entry=>{if(!entry.isIntersecting)stopPlayback();})).observe($('#wave-demo'));

  function revealChart(){
    $$('.practice-chart i').forEach((bar,i)=>animate(bar,[{transform:'scaleY(.03)'},{transform:'scaleY(1)'}],{duration:700,delay:i*65}));
    animate($('.progress-number'),[{opacity:.3,transform:'translateY(10px)'},{opacity:1,transform:'translateY(0)'}],{duration:500});
  }
  $('#progress-replay').addEventListener('click',revealChart);
  $$('[data-progress]').forEach(button=>button.addEventListener('click',()=>{
    $$('[data-progress]').forEach(other=>other.setAttribute('aria-pressed',String(button===other)));
    const teacher=button.dataset.progress==='teacher';
    $('#progress-context').textContent=teacher?'See practice time between lessons. Know where to guide next.':'See the practice you’re building, one day at a time.';
    $('#progress-summary').textContent=teacher?'The same practice, a teacher’s perspective.':'Your effort, made visible.';revealChart();
  }));
  $('#badge-unlock').addEventListener('click',()=>{
    animate($('#badge-unlock'),[{transform:'scale(.9) rotate(-7deg)'},{transform:'scale(1.08) rotate(4deg)',offset:.55},{transform:'scale(1) rotate(0)'}],{duration:850});
    $('#badge-title').textContent='First steps. Well taken.';$('#badge-copy').textContent='Concept unlock: first practice session logged. A beginning worth keeping.';
  });
  const sceneEntrance=new IntersectionObserver(entries=>entries.forEach(entry=>{if(!entry.isIntersecting)return;if(entry.target===scorePage)drawScore();else revealChart();sceneEntrance.unobserve(entry.target);}),{threshold:.3});sceneEntrance.observe(scorePage);sceneEntrance.observe($('.practice-chart'));
  document.addEventListener('visibilitychange',()=>{if(document.hidden){stopPlayback();stopExchange();}});
  reduced.addEventListener('change',()=>{
    stopPlayback();stopExchange();activeAnimations.forEach(animation=>animation.cancel());
    $('.hero-stage').style.removeProperty('--hero-depth');
  });
  // Fragment navigation keeps keyboard focus with the content it reveals.
  $$('a[href^="#"]').forEach(link=>link.addEventListener('click',()=>{
    const target=link.hash?document.getElementById(link.hash.slice(1)):document.body;if(!target)return;
    if(!target.hasAttribute('tabindex'))target.setAttribute('tabindex','-1');target.focus({preventScroll:true});
  }));
  // The promise reads like three measures: the current handoff gets one quiet underline.
  const promiseObserver = new IntersectionObserver(entries => {
    const entering = entries.filter(entry => entry.isIntersecting);
    if (!entering.length) return;
    const current = entering[entering.length - 1].target;
    $$('.promise-sequence article').forEach(row => row.classList.toggle('is-current', row === current));
  }, { rootMargin: '-25% 0px -35% 0px', threshold: 0.1 });
  $$('.promise-sequence article').forEach(row => promiseObserver.observe(row));
  paint();
})();
