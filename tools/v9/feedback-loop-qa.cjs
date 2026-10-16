const fs=require('fs');
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
(async()=>{
 const tab=await(await fetch('http://127.0.0.1:9235/json/new?http://127.0.0.1:8102/',{method:'PUT'})).json();
 const ws=new WebSocket(tab.webSocketDebuggerUrl);await new Promise(r=>ws.onopen=r);
 let id=0;const pending=new Map(),errors=[];
 ws.onmessage=e=>{const m=JSON.parse(e.data);if(m.id){pending.get(m.id)?.(m);pending.delete(m.id)}if(m.method==='Runtime.exceptionThrown')errors.push(m.params.exceptionDetails?.text||'JavaScript exception')};
 const send=(method,params={})=>new Promise((resolve,reject)=>{pending.set(++id,m=>m.error?reject(m.error):resolve(m.result));ws.send(JSON.stringify({id,method,params}))});
 const ev=async expression=>{const r=await send('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true});if(r.exceptionDetails)throw new Error(JSON.stringify(r.exceptionDetails));return r.result?.value};
 const report=[];
 await send('Runtime.enable');await send('Page.enable');await send('Network.enable');await send('Network.setCacheDisabled',{cacheDisabled:true});
 for(const [device,w,h,mobile] of [['desktop',1440,960,false],['tablet',768,1024,true],['mobile',390,844,true],['small',320,720,true]]){
   await send('Emulation.setDeviceMetricsOverride',{width:w,height:h,deviceScaleFactor:1,mobile});
   await send('Page.navigate',{url:'http://127.0.0.1:8102/'});await sleep(700);
   await ev('Promise.all([...document.images].map(i=>{i.loading="eager";return i.decode().catch(()=>{})}))');
   const shot=async name=>fs.writeFileSync('review/v9/feedback-'+device+'-'+name+'.png',Buffer.from((await send('Page.captureScreenshot',{format:'png'})).data,'base64'));
   const place=p=>ev('(()=>{const f=document.querySelector("[data-loop]");scrollTo({top:f.getBoundingClientRect().top+scrollY+(f.offsetHeight-innerHeight)*'+p+',behavior:"instant"})})()');
   await place(.25);await sleep(760);if(device==='desktop')await shot('listening');
   await place(.53);await sleep(760);if(device==='desktop'||device==='mobile')await shot('response');
   const response=JSON.parse(await ev('JSON.stringify({width:innerWidth,scrollWidth:document.documentElement.scrollWidth,pinTop:Math.round(document.querySelector(".feedback-pin").getBoundingClientRect().top),chapter:document.querySelector(".loop-chapter").textContent,trackHeight:Math.round(document.querySelector(".loop-wave-track").getBoundingClientRect().height),comment:getComputedStyle(document.querySelector(".teacher-note")).opacity,hasReadableSequence:document.querySelectorAll(".loop-readable li").length===5})'));
   report.push({device,stage:'response',...response});
   if(device==='desktop'||device==='mobile'){await place(.71);await sleep(760);if(device==='desktop')await shot('score');else await shot('score');}
   if(device==='desktop'){await place(.94);await sleep(760);await shot('practice')}
   const state=JSON.parse(await ev('JSON.stringify({width:innerWidth,scrollWidth:document.documentElement.scrollWidth,filmHeight:document.querySelector(".feedback-run").offsetHeight,pinTop:Math.round(document.querySelector(".feedback-pin").getBoundingClientRect().top),chapter:document.querySelector(".loop-chapter").textContent,playhead:getComputedStyle(document.querySelector(".loop-playhead")).left,comment:getComputedStyle(document.querySelector(".teacher-note")).opacity,score:getComputedStyle(document.querySelector(".feedback-score")).opacity,phone:getComputedStyle(document.querySelector(".practice-return")).opacity,allImages:[...document.images].every(i=>i.naturalWidth>0),hasReadableSequence:document.querySelectorAll(".loop-readable li").length===5})'));
   report.push({device,...state});
 }
 await send('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'reduce'}]});
 await send('Page.navigate',{url:'http://127.0.0.1:8102/'});await sleep(300);
 await ev('document.querySelector("[data-loop]").scrollIntoView({behavior:"instant"})');await sleep(100);
 report.push({reduced:JSON.parse(await ev('JSON.stringify({matches:matchMedia("(prefers-reduced-motion: reduce)").matches,pinPosition:getComputedStyle(document.querySelector(".feedback-pin")).position,runHeight:document.querySelector(".feedback-run").offsetHeight,comment:getComputedStyle(document.querySelector(".teacher-note")).opacity,phone:getComputedStyle(document.querySelector(".practice-return")).opacity})'))});
 for(const p of ['/','/explorations/a/','/explorations/b/']){const r=await fetch('http://127.0.0.1:8102'+p);report.push({path:p,status:r.status})}
 report.push({errors});fs.writeFileSync('review/v9/feedback-loop-qa.json',JSON.stringify(report,null,2));console.log(JSON.stringify(report));
 await send('Emulation.setEmulatedMedia',{features:[]});
 await send('Emulation.setDeviceMetricsOverride',{width:1000,height:720,deviceScaleFactor:1,mobile:false});
 await send('Page.navigate',{url:'http://127.0.0.1:8102/'});await sleep(600);
 fs.mkdirSync('review/v9/feedback-frames',{recursive:true});
 for(let i=0;i<36;i++){await ev('(()=>{const f=document.querySelector("[data-loop]");scrollTo({top:f.getBoundingClientRect().top+scrollY+(f.offsetHeight-innerHeight)*'+(i/35)+',behavior:"instant"})})()');await sleep(250);fs.writeFileSync('review/v9/feedback-frames/'+String(i).padStart(3,'0')+'.png',Buffer.from((await send('Page.captureScreenshot',{format:'png'})).data,'base64'))}
 await ws.close();
})();
