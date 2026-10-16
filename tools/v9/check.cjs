const fs=require('fs');
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
(async()=>{
const tab=await(await fetch('http://127.0.0.1:9234/json/new?http://127.0.0.1:8099/explorations/',{method:'PUT'})).json();
const ws=new WebSocket(tab.webSocketDebuggerUrl);await new Promise(r=>ws.onopen=r);let id=0;const pending=new Map(),errors=[];ws.onmessage=e=>{const m=JSON.parse(e.data);if(m.id){pending.get(m.id)?.(m);pending.delete(m.id)}if(m.method==='Runtime.exceptionThrown')errors.push(m.params)};
const send=(method,params={})=>new Promise((resolve,reject)=>{pending.set(++id,m=>m.error?reject(m.error):resolve(m.result));ws.send(JSON.stringify({id,method,params}))});
const ev=async expression=>(await send('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true})).result.value;
await send('Runtime.enable');await send('Page.enable');const report=[];
for(const [size,w,h] of [['desktop',1440,1000],['mobile',390,844]]){
 await send('Emulation.setDeviceMetricsOverride',{width:w,height:h,deviceScaleFactor:1,mobile:size==='mobile'});
 for(const dir of ['a','b']){
 await send('Page.navigate',{url:`http://127.0.0.1:8099/explorations/${dir}/`});await sleep(700);await ev('Promise.all([...document.images].map(i=>{i.loading="eager";return i.decode().catch(()=>{})}))');
 const shot=async name=>fs.writeFileSync(`review/v9/${dir}-${size}-${name}.png`,Buffer.from((await send('Page.captureScreenshot',{format:'png'})).data,'base64'));
 await shot('hero');report.push({dir,size,...await ev('({width:innerWidth,scrollWidth:document.documentElement.scrollWidth,images:[...document.images].every(i=>i.complete&&i.naturalWidth>0),title:document.title})')});
 for(const [name,p] of [['reveal',.52],['return',.92]]){await ev(`(()=>{let f=document.querySelector('[data-film]');scrollTo({top:f.offsetTop+(f.offsetHeight-innerHeight)*${p},behavior:'instant'})})()`);await sleep(1100);await shot(name)}
 await ev("document.querySelector('#join').scrollIntoView({behavior:'instant'})");await sleep(100);await shot('closing');
 await ev("document.querySelector('[data-notes]').click()");report.push({dir,size,dialog:await ev("document.querySelector('dialog').open")});await ev("document.querySelector('dialog').close()");
 }
}
await send('Emulation.setDeviceMetricsOverride',{width:1000,height:720,deviceScaleFactor:1,mobile:false});
for(const dir of ['a','b']){
 await send('Page.navigate',{url:`http://127.0.0.1:8099/explorations/${dir}/`});await sleep(500);fs.mkdirSync(`review/v9/frames-${dir}`,{recursive:true});
 for(let i=0;i<36;i++){await ev(`(()=>{let f=document.querySelector('[data-film]');scrollTo({top:f.offsetTop+(f.offsetHeight-innerHeight)*${i/35},behavior:'instant'})})()`);await sleep(dir==='b'?200:40);fs.writeFileSync(`review/v9/frames-${dir}/${String(i).padStart(3,'0')}.png`,Buffer.from((await send('Page.captureScreenshot',{format:'png'})).data,'base64'))}
}
for(const w of [320,768]){await send('Emulation.setDeviceMetricsOverride',{width:w,height:844,deviceScaleFactor:1,mobile:w===320});for(const dir of ['a','b']){await send('Page.navigate',{url:`http://127.0.0.1:8099/explorations/${dir}/`});await sleep(300);report.push({dir,width:w,...await ev('({scrollWidth:document.documentElement.scrollWidth})')})}}
await send('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'reduce'}]});for(const dir of ['a','b']){await send('Page.navigate',{url:`http://127.0.0.1:8099/explorations/${dir}/`});await sleep(300);report.push({dir,reduced:await ev("({position:getComputedStyle(document.querySelector('.film-pin')).position,staticSteps:document.querySelector('.reduced-story')?getComputedStyle(document.querySelector('.reduced-story')).display:null})")})}
await send('Emulation.setEmulatedMedia',{features:[]});
for(const path of ['','a/','b/']){const r=await fetch(`http://127.0.0.1:8099/explorations/${path}`);report.push({path,status:r.status})}
fs.writeFileSync('review/v9/check.json',JSON.stringify({report,errors},null,2));console.log(JSON.stringify({report,errors}));ws.close();
})();
