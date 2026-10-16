(() => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  const clamp = v => Math.min(1,Math.max(0,v));
  const smooth = (p,a,b) => { const x=clamp((p-a)/(b-a)); return x*x*(3-2*x); };
  const films=[...document.querySelectorAll('[data-film]')];
  const dialog=document.querySelector('#preview-notes');
  document.querySelectorAll('[data-notes]').forEach(button=>button.addEventListener('click',()=>dialog.showModal()));
  dialog?.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();}});
  document.querySelectorAll('[data-wave]').forEach(w=>{
    for(let i=0;i<110;i++){const bar=document.createElement('i'); const h=12+Math.abs(Math.sin(i*.67)*Math.sin(i*.153))*85;bar.style.setProperty('--h',h+'%');bar.style.setProperty('--o',.4+Math.abs(Math.sin(i*.2))*.6);w.append(bar);}w.setAttribute('aria-hidden','true');
  });
  const aCopy=[['01 / THE INTENTION','01','Leave the lesson with a clear intention.'],['02 / ON THE MUSIC','02','One thought, exactly where it matters.'],['03 / INTO PRACTICE','03','The guidance goes home with you.']];
  const bCopy=[['01 / ASSIGN','Make the<br>next step clear.','The piece. The steps. The daily target.<br>Your intention, ready to take home.'],['02 / PRACTICE','Open it.<br>Know where to start.','Today brings the plan into focus.<br>Less figuring out. More playing.'],['03 / RECORD','Make the work<br>something to hear.','Practice with the tools close at hand.<br>Record a take. Share it by choice.'],['04 / LISTEN','Hear more than<br>the next lesson.','Shared takes give your teacher context.<br>Something specific to listen for.'],['05 / GUIDE','A response.<br>A way forward.','Leave feedback. Return to the music.<br>Carry the next thought into practice.']];
  let queued=false;
  function render(){queued=false;const mobile=innerWidth<=600;
    for(const film of films){const rect=film.getBoundingClientRect(); const p=reduce.matches?0:clamp(-rect.top/Math.max(1,film.offsetHeight-innerHeight));film.style.setProperty('--p',p);
      if(film.dataset.film==='a'){
        const z=smooth(p,.13,.43),out=smooth(p,.63,.88),draw=reduce.matches?1:smooth(p,.37,.58);
        film.style.setProperty('--zoom',z);film.style.setProperty('--opening',1-smooth(p,.11,.25));film.style.setProperty('--detail',smooth(p,.24,.35)*(1-smooth(p,.62,.73)));film.style.setProperty('--landing',out);film.style.setProperty('--draw',draw);film.style.setProperty('--words',reduce.matches?1:smooth(p,.50,.60));
        film.style.setProperty('--scale',mobile?1+z*.45-out*.9:1+z*1.23-out*1.53);
        film.style.setProperty('--sx',mobile?(-z*320-out*45)+'px':(-z*innerWidth*.25-out*innerWidth*.19)+'px');
        film.style.setProperty('--sy',mobile?(-z*20-out*100)+'px':(-z*10-out*30)+'px');film.style.setProperty('--turn',(-9+z*9-out*2)+'deg');
        const n=p<.32?0:p<.72?1:2;if(film.dataset.step!==String(n)){film.dataset.step=n;film.querySelector('.chapter').textContent=aCopy[n][0];film.querySelector('.scene-number').textContent=aCopy[n][1];film.querySelector('.scene-line').textContent=aCopy[n][2];}
      }else{
        const n=reduce.matches?0:Math.min(4,Math.floor(p*5));if(film.dataset.step!==String(n)){film.dataset.step=n;film.querySelector('.chapter').textContent=bCopy[n][0];film.querySelector('.b-count').textContent='0'+(n+1);film.querySelector('.b-scene-title').innerHTML=bCopy[n][1].replaceAll('<br>','<br> ');film.querySelector('.b-scene-copy').innerHTML=bCopy[n][2];film.querySelectorAll('.b-frame').forEach((f,i)=>{f.classList.toggle('current',i===n);f.classList.toggle('past',i===n-1);f.setAttribute('aria-hidden',String(i!==n));});film.querySelectorAll('.b-track span').forEach((t,i)=>t.classList.toggle('active',i===n));}
      }
    }
    const wave=document.querySelector('.wave');if(wave&&!reduce.matches){const r=wave.getBoundingClientRect();wave.style.setProperty('--wave-scale',.25+.75*smooth((innerHeight-r.top)/innerHeight,0,.6));}
  }
  function schedule(){if(!queued){queued=true;requestAnimationFrame(render)}}
  addEventListener('scroll',schedule,{passive:true});addEventListener('resize',schedule);reduce.addEventListener('change',schedule);render();
})();
