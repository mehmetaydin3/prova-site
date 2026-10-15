const fs=require('fs');const path=require('path');
(async()=>{
 const output='review/authored';fs.mkdirSync(output,{recursive:true});
 const tabs=await(await fetch('http://127.0.0.1:9234/json')).json();
 const ws=new WebSocket(tabs.find(t=>t.type==='page').webSocketDebuggerUrl);await new Promise(r=>ws.addEventListener('open',r,{once:true}));
 let id=0;const pending=new Map(),errors=[];ws.addEventListener('message',e=>{const m=JSON.parse(e.data);if(m.id){const p=pending.get(m.id);pending.delete(m.id);m.error?p.reject(m.error):p.resolve(m.result);}if(m.method==='Runtime.exceptionThrown')errors.push(m.params.exceptionDetails.text);});
 const send=(method,params={})=>new Promise((resolve,reject)=>{const n=++id;pending.set(n,{resolve,reject});ws.send(JSON.stringify({id:n,method,params}));});
 const run=async expression=>{const r=await send('Runtime.evaluate',{expression,awaitPromise:true,returnByValue:true});if(r.exceptionDetails)throw Error(JSON.stringify(r.exceptionDetails));return r.result.value;};
 const wait=ms=>new Promise(r=>setTimeout(r,ms));const assert=(test,label)=>{if(!test)throw Error(label)};
 const snap=async name=>{const r=await send('Page.captureScreenshot',{format:'png',captureBeyondViewport:false});fs.writeFileSync(path.join(output,name+'.png'),Buffer.from(r.data,'base64'));};
 await send('Page.enable');await send('Runtime.enable');
 await send('Page.addScriptToEvaluateOnNewDocument',{source:`window.qaCLS=0;window.qaLong=[];new PerformanceObserver(list=>list.getEntries().forEach(e=>{if(!e.hadRecentInput)window.qaCLS+=e.value})).observe({type:'layout-shift',buffered:true});new PerformanceObserver(list=>list.getEntries().forEach(e=>window.qaLong.push(e.duration))).observe({type:'longtask',buffered:true});`});
 const results=[];
 for(const [name,width,height,mobile] of [['desktop',1440,1000,false],['tablet',768,1024,true],['mobile',390,844,true],['small-mobile',320,740,true]]){
 await send('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'no-preference'}]});
 await send('Emulation.setDeviceMetricsOverride',{width,height,deviceScaleFactor:1,mobile});
 await send('Page.navigate',{url:'http://127.0.0.1:8094/cinematic/'});await wait(1200);
 await run(`Promise.all([...document.images].filter(i=>i.loading!=='lazy').map(i=>i.decode().catch(()=>{})))`);
 const total=await run('document.documentElement.scrollHeight');
 for(let y=0;y<total;y+=650){await run(`scrollTo({top:${y},behavior:'instant'})`);await wait(75);}
 await run(`scrollTo({top:0,behavior:'instant'})`);await wait(850);
 const layout=await run(`({width:innerWidth,scrollWidth:document.documentElement.scrollWidth,images:[...document.images].every(i=>i.complete&&i.naturalWidth),cls:window.qaCLS,longTasks:window.qaLong.length})`);
 assert(layout.scrollWidth===width,name+' horizontal overflow');assert(layout.images,name+' images');
 if(name!=='small-mobile'){
 await snap(name);const metrics=await send('Page.getLayoutMetrics');const full=await send('Page.captureScreenshot',{format:'png',captureBeyondViewport:true,clip:{x:0,y:0,width,height:metrics.cssContentSize.height,scale:1}});fs.writeFileSync(path.join(output,name+'-full.png'),Buffer.from(full.data,'base64'));
 }
 await run(`document.querySelector('#wave-demo').scrollIntoView({behavior:'instant',block:'center'});document.querySelector('#wave-reset').click();document.querySelector('#wave-play').click()`);await wait(380);
 const moving=await run(`({time:document.querySelector('#wave-time').textContent,head:document.querySelector('.wave-playhead').getAttribute('transform'),playing:document.querySelector('#wave-play').getAttribute('aria-pressed')})`);
 await wait(350);const later=await run(`document.querySelector('.wave-playhead').getAttribute('transform')`);assert(later!==moving.head,name+' actual playhead movement');
 const actions=await run(`(()=>{document.querySelector('[data-seek="18"]').click();const seek=document.querySelector('#wave-comment').textContent.includes('half note');const r=document.querySelector('#wave-scrub');r.value=24;r.dispatchEvent(new Event('input'));document.querySelector('#place-comment').click();const placement=document.querySelector('#comment-state').textContent.includes('0:24');document.querySelector('#review-comment').click();const review=document.querySelector('#comment-role').textContent.includes('STUDENT');document.querySelector('button[data-layer="teacher"]').click();const layer=document.querySelector('.score-page').dataset.layer==='teacher';document.querySelector('[data-progress="teacher"]').click();const progress=document.querySelector('#progress-context').textContent.includes('guide next');document.querySelector('#badge-unlock').click();const badge=document.querySelector('#badge-title').textContent.includes('Well taken');return {seek,placement,review,layer,progress,badge};})()`);
 assert(Object.values(actions).every(Boolean),name+' interactions '+JSON.stringify(actions));
 await run(`document.querySelector('#wave-scrub').focus()`);await send('Input.dispatchKeyEvent',{type:'keyDown',key:'ArrowRight',code:'ArrowRight',windowsVirtualKeyCode:39});await send('Input.dispatchKeyEvent',{type:'keyUp',key:'ArrowRight',code:'ArrowRight',windowsVirtualKeyCode:39});const keyboard=await run(`({value:document.querySelector('#wave-scrub').value,focus:document.activeElement.id,outline:getComputedStyle(document.activeElement).outlineStyle})`);assert(keyboard.value==='25'&&keyboard.focus==='wave-scrub',name+' keyboard range');
 await run(`document.querySelector('#score-demo').scrollIntoView({behavior:'instant',block:'center'});document.querySelector('#play-exchange').click()`);await wait(150);
 const first=await run(`document.querySelector('.score-page').dataset.layer`);await wait(1900);const second=await run(`document.querySelector('.score-page').dataset.layer`);assert(first==='student'&&second==='teacher',name+' actual timed exchange');
 await run(`document.querySelector('button[data-layer="both"]').click()`);
 if(name!=='small-mobile'){await run(`document.querySelector('#score').scrollIntoView({behavior:'instant'})`);await wait(550);await snap(name+'-score');await run(`document.querySelector('#feedback').scrollIntoView({behavior:'instant'})`);await wait(550);await snap(name+'-feedback');}
 const finalCLS=await run('window.qaCLS');results.push({name,...layout,moving,actions,keyboard,timedExchange:[first,second],finalCLS});
 }
 await send('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'reduce'}]});
 await wait(180);
 const reduced=await run(`(()=>{document.querySelector('#wave-reset').click();document.querySelector('#wave-play').click();document.querySelector('#play-exchange').click();return {time:document.querySelector('#wave-time').textContent,scroll:getComputedStyle(document.documentElement).scrollBehavior,sticky:getComputedStyle(document.querySelector('.score-sticky')).position,animations:document.getAnimations().filter(a=>a.playState==='running').length};})()`);
 assert(reduced.time==='0:18'&&reduced.scroll==='auto'&&reduced.sticky==='relative'&&reduced.animations===0,'reduced motion '+JSON.stringify(reduced));assert(errors.length===0,'browser errors');
 // Actual browser frames: a short silent capture of the two interactive scenes.
 await send('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'no-preference'}]});await send('Emulation.setDeviceMetricsOverride',{width:1100,height:820,deviceScaleFactor:1,mobile:false});
 await run(`document.querySelector('#wave-demo').scrollIntoView({behavior:'instant',block:'center'});document.querySelector('#wave-reset').click();document.querySelector('[data-seek="18"]').click();document.querySelector('#wave-play').click()`);
 const frames=[];const frameDir='/private/tmp/prova-authored-frames';fs.mkdirSync(frameDir,{recursive:true});let last=Date.now();
 for(let i=0;i<48;i++){
 if(i===24){await run(`document.querySelector('#score-demo').scrollIntoView({behavior:'instant',block:'center'});document.querySelector('#play-exchange').click()`);}
 const shot=await send('Page.captureScreenshot',{format:'png'});const now=Date.now();const file=path.join(frameDir,String(i).padStart(3,'0')+'.png');fs.writeFileSync(file,Buffer.from(shot.data,'base64'));frames.push({file,duration:Math.max(90,now-last)});last=now;await wait(100);
 }
 fs.writeFileSync(frameDir+'/frames.json',JSON.stringify(frames));fs.writeFileSync(output+'/checks.json',JSON.stringify({results,reduced,errors,recordingFrames:frames.length},null,2));console.log(JSON.stringify({results,reduced,errors,recordingFrames:frames.length},null,2));ws.close();
})().catch(e=>{console.error(e);process.exit(1)});
