const fs=require('fs');
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
(async()=>{
const tabs=await(await fetch('http://127.0.0.1:9235/json')).json();
const tab=await(await fetch('http://127.0.0.1:9235/json/new?http://127.0.0.1:8101/',{method:'PUT'})).json();
const ws=new WebSocket(tab.webSocketDebuggerUrl);await new Promise(r=>ws.onopen=r);let id=0;const pending=new Map(),errors=[];ws.onmessage=e=>{const m=JSON.parse(e.data);if(m.id){pending.get(m.id)?.(m);pending.delete(m.id)}if(m.method==='Runtime.exceptionThrown')errors.push(m.params.exceptionDetails?.text||'JavaScript exception')};
const send=(method,params={})=>new Promise((resolve,reject)=>{pending.set(++id,m=>m.error?reject(m.error):resolve(m.result));ws.send(JSON.stringify({id,method,params}))});
const ev=async expression=>{const r=await send('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true});if(r.exceptionDetails)throw new Error(JSON.stringify(r.exceptionDetails));return r.result?.value};
await send('Runtime.enable');await send('Page.enable');const report=[];
for(const [name,w,h,mobile] of [['desktop',1440,1000,false],['tablet',768,1024,true],['mobile',390,844,true]]){
 await send('Emulation.setDeviceMetricsOverride',{width:w,height:h,deviceScaleFactor:1,mobile});await send('Page.navigate',{url:'http://127.0.0.1:8101/'});await sleep(900);await ev('Promise.all([...document.images].map(i=>{i.loading="eager";return i.decode().catch(()=>{})}))');
 const screen=async suffix=>fs.writeFileSync(`review/v9/home-${name}-${suffix}.png`,Buffer.from((await send('Page.captureScreenshot',{format:'png'})).data,'base64'));
 await screen('hero');const raw=await ev('JSON.stringify({width:innerWidth,scrollWidth:document.documentElement.scrollWidth,title:document.title,images:[...document.images].map(i=>i.naturalWidth>0),cta:document.querySelector("#join .cta")?.getAttribute("href"),compare:[...document.querySelectorAll("a")].some(a=>a.getAttribute("href")==="/explorations/")})');let state;try{state=JSON.parse(raw)}catch(e){throw new Error('state result='+String(raw))};report.push({name,...state});
 await ev("document.getElementById('story').scrollIntoView({behavior:'instant'})");await sleep(150);await ev('(()=>{const f=document.querySelector("[data-film]");scrollTo({top:f.offsetTop+(f.offsetHeight-innerHeight)*.52,behavior:"instant"})})()');await sleep(100);await screen('reveal');
 await ev('document.querySelector(".a-plan").scrollIntoView({behavior:"instant"})');await sleep(150);await screen('assignment');
 await ev("document.querySelector('#join').scrollIntoView({behavior:'instant'})");await sleep(100);await screen('closing');
}
await send('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'reduce'}]});await send('Page.navigate',{url:'http://127.0.0.1:8101/'});await sleep(300);report.push({reduced:JSON.parse(await ev("JSON.stringify({position:getComputedStyle(document.querySelector('.film-pin')).position,filmHeight:document.querySelector('.a-film').offsetHeight,screenVisible:getComputedStyle(document.querySelector('.film-phone')).display})"))});
for(const p of ['/','/explorations/','/explorations/a/','/explorations/b/']){const r=await fetch('http://127.0.0.1:8101'+p);report.push({path:p,status:r.status})}
report.push({errors});fs.writeFileSync('review/v9/home-qa.json',JSON.stringify(report,null,2));console.log(JSON.stringify(report));ws.close();
})();
