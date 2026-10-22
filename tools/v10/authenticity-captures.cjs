const fs=require('fs'),path=require('path');
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const root=path.resolve(__dirname,'../..'),out=path.join(root,'review/v10/baseline');
fs.mkdirSync(out,{recursive:true});
(async()=>{
  const target=await(await fetch('http://127.0.0.1:9235/json/new?http://127.0.0.1:8105/',{method:'PUT'})).json();
  const ws=new WebSocket(target.webSocketDebuggerUrl);await new Promise(r=>ws.onopen=r);
  let id=0;const pending=new Map();ws.onmessage=e=>{const m=JSON.parse(e.data);if(m.id){pending.get(m.id)?.(m);pending.delete(m.id)}};
  const send=(method,params={})=>new Promise((resolve,reject)=>{pending.set(++id,m=>m.error?reject(m.error):resolve(m.result));ws.send(JSON.stringify({id,method,params}))});
  const ev=async expression=>{const r=await send('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true});if(r.exceptionDetails)throw Error(JSON.stringify(r.exceptionDetails));return r.result?.value};
  const all=[], checks=[], errors=[];
  ws.addEventListener('message',e=>{const m=JSON.parse(e.data);if(m.method==='Runtime.exceptionThrown')errors.push(m.params)});
  for(const [device,width,height,mobile] of [['desktop',1440,980,false],['mobile',390,844,true]]){
    await send('Emulation.setDeviceMetricsOverride',{width,height,deviceScaleFactor:1,mobile});
    await send('Runtime.enable');await send('Page.enable');await send('Page.navigate',{url:'http://127.0.0.1:8105/'});await sleep(500);
    await ev('Promise.all([...document.images].map(i=>{i.loading="eager";return i.decode().catch(()=>{})}))');
    await ev('document.documentElement.style.scrollBehavior="auto"');
    const capture=async name=>{await sleep(1500);const d=await send('Page.captureScreenshot',{format:'png'});const file=`authentic-${name}-${device}.png`;fs.writeFileSync(path.join(out,file),Buffer.from(d.data,'base64'));all.push(file);return file};
    await ev('scrollTo(0,0)');await capture('hero');
    for(let i=0;i<5;i++){
      await ev(mobile ? `document.querySelectorAll('.loop-mobile-stage')[${i}].scrollIntoView({block:'start',behavior:'instant'})` : `(()=>{const e=document.querySelector('.loop');const t=e.offsetHeight-innerHeight;scrollTo(0,e.offsetTop+t*${i/4})})()`);
      await sleep(450);await capture(`recording-${String(i+1).padStart(2,'0')}`);
      if(!mobile) {
        const bounds=await ev(`(()=>{const r=document.querySelector('.loop-screen.is-active').getBoundingClientRect();return {left:r.left,right:r.right,top:r.top,bottom:r.bottom}})()`);
        if(bounds.left<0||bounds.right>width||bounds.top<0||bounds.bottom>height)throw Error('Native screen clipped: '+JSON.stringify(bounds));
      }
    }
    for(const [name,p] of [['close',0],['teacher',.5],['wide',1]]) {
      await ev(`(()=>{const e=document.querySelector('.score-scroll');scrollTo(0,e.offsetTop+e.parentElement.offsetTop+(e.offsetHeight-innerHeight)*${p})})()`);
      await capture(`score-${name}`);
      checks.push({device,name,...await ev(`({scale:parseFloat(document.querySelector('.score-camera').style.getPropertyValue('--cam-scale')),beat:document.querySelector('.score-stage').dataset.beat})`)});
    }
    for(const layer of ['mine','teacher','both']) {
      await ev(`document.querySelector('[data-score-layer="${layer}"]').click()`);
      const actual=await ev(`document.querySelector('.score-stage').dataset.layer`);
      if(actual!==layer)throw Error('Layer switch failed');
    }
    await ev(`document.querySelector('[data-motion-toggle]').click()`);
    if(await ev(`getComputedStyle(document.querySelector('.score-sticky')).position`)!=='relative')throw Error('Reduced motion failed');
    await ev(`document.querySelector('[data-stage="3"]').click()`);
    if(await ev(`document.querySelector('[data-count]').textContent`)!=='04')throw Error('Reduced motion chapters failed');
    await ev(`document.querySelector('[data-motion-toggle]').click()`);
    await ev(`document.querySelector('#join').scrollIntoView({block:'start',behavior:'instant'})`);await capture('closing');
    const state=JSON.parse(await ev('JSON.stringify({width:innerWidth,scrollWidth:document.documentElement.scrollWidth,stage:document.querySelector("[data-count]").textContent,visibleNative:[...document.querySelectorAll(".loop-screen")].filter(e=>getComputedStyle(e).visibility!=="hidden"&&getComputedStyle(e).opacity!=="0").length,images:[...document.images].filter(i=>i.closest(".hero-stage,.loop-visual,.loop-mobile-stage,.score-native-proof,.closing-screen")).every(i=>i.naturalWidth>0)})'));
    if(state.width!==state.scrollWidth)throw Error(`${device} overflow: ${JSON.stringify(state)}`);
    if(!state.images)throw Error(`${device} capture image failed to load`);
    console.log(device,JSON.stringify(state));
  }
  for(const device of ['desktop','mobile']){
    const fsIn=all.filter(f=>f.endsWith(`-${device}.png`));
    const labels=fsIn.map(f=>f.replace(`authentic-`,'').replace(`-${device}.png`,''));
    const width=device==='desktop'?1440:390,title=device==='desktop'?'Desktop':'Mobile';
    const figures=fsIn.map((f,i)=>`<figure><figcaption><b>${String(i+1).padStart(2,'0')}</b> ${labels[i].replaceAll('-',' ').toUpperCase()}</figcaption><img src="${f}" alt="${title} browser capture: ${labels[i]}"></figure>`).join('');
    const html=`<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Prova V10 authentic UI · ${title}</title><style>*{box-sizing:border-box}body{margin:0;background:#15141a;color:#eee;font:13px -apple-system,BlinkMacSystemFont,Segoe UI,sans-serif}header{position:sticky;top:0;z-index:2;padding:16px 4vw;background:#15141a;border-bottom:1px solid #393640;color:#c5baff;font:10px monospace;letter-spacing:.12em}main{width:min(100%,${width}px);margin:auto;padding-bottom:32px}figure{margin:0 0 22px}figcaption{padding:10px 4vw;color:#aaa5b5;font:9px monospace;letter-spacing:.12em}figcaption b{color:#b3a4ff;margin-right:9px}img{display:block;width:100%;height:auto}footer{padding:18px 4vw;color:#85808d;font:9px/1.5 monospace}</style><header>PROVA · V10 · ${title.toUpperCase()} AUTHENTICITY REVIEW</header><main>${figures}<footer>Viewport states captured from the working site at actual scroll positions. App screenshots are native captures; stage transitions are website motion. Missing native app states are labeled in-page.</footer></main>`;
    fs.writeFileSync(path.join(out,`authentic-full-${device}.html`),html);
    await send('Emulation.setDeviceMetricsOverride',{width:device==='desktop'?1440:390,height:device==='desktop'?980:844,deviceScaleFactor:1,mobile:device==='mobile'});
    await send('Page.navigate',{url:`http://127.0.0.1:8105/review/v10/baseline/authentic-full-${device}.html`});await sleep(500);await ev('Promise.all([...document.images].map(i=>i.decode()))');
    const metrics=await send('Page.getLayoutMetrics'),height=Math.ceil(metrics.cssContentSize.height);
    const data=await send('Page.captureScreenshot',{format:'png',captureBeyondViewport:true,clip:{x:0,y:0,width,height,scale:1}});
    fs.writeFileSync(path.join(out,`authentic-full-${device}.png`),Buffer.from(data.data,'base64'));console.log('storyboard',device,width,height);
  }
  for(const device of ['desktop','mobile']) {
    const c=checks.filter(x=>x.device===device);
    if(!(c[0].scale>c[2].scale*2 && c[0].beat==='0' && c[2].beat==='4'))throw Error('Camera progression failed '+JSON.stringify(c));
  }
  if(errors.length)throw Error(JSON.stringify(errors));
  fs.writeFileSync(path.join(out,'checks.json'),JSON.stringify({checks,errors,layers:'passed',reducedMotion:'passed',captures:all},null,2));
  await send('Page.close'); ws.close();
})().catch(e=>{console.error(e);process.exitCode=1});
