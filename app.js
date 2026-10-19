const DESIGNS={
  remix:{W:1000,H:420,draw:drawTicketRemix,tear:{axis:'x',x:23,side:'left'}},
  tall:{W:520,H:1100,draw:drawTicketTall,tear:{axis:'y',pos:60}},
  square:{W:640,H:640,draw:drawTicketSquare,tear:{axis:'y',pos:78.125}},
  original:{W:1000,H:410,draw:drawTicketOriginal,tear:{axis:'x',x:69.85,side:'right'}}
};
const curDesign=()=>DESIGNS[$('design').value]||DESIGNS.remix;

/* ===== build ===== */
let STATE=null,buildToken=0;
function loadImg(src){return new Promise((res,rej)=>{const i=new Image();i.onload=()=>res(i);i.onerror=()=>rej(new Error("image load failed"));i.src=src})}
function loadFonts(){
  return Promise.all(["400 16px Oswald","600 16px Oswald","700 16px Oswald","italic 600 16px Oswald","italic 400 16px Oswald","700 16px Poppins","800 16px Poppins"].map(f=>document.fonts.load(f)));
}
async function redraw(){
  if(!STATE)return;
  const D=curDesign();
  await loadFonts();
  const cv=$('ticket'),ctx=cv.getContext('2d');
  cv.width=D.W*2;cv.height=D.H*2;
  $('stage').style.maxWidth=Math.min(D.W,1000)+'px';
  ctx.setTransform(1,0,0,1,0,0);ctx.scale(2,2);
  D.draw(ctx,STATE,{qr:STATE.qr});
}
$('design').onchange=redraw;
async function build(seedExtra){
  const my=++buildToken;
  const name=$('name').value.trim().toUpperCase(), cls=$('cls').value;
  const ed=$('ed').value, E=EDITIONS[ed], T=THEMES[cls];
  const h=hash(name+seedExtra), r=rng(h);
  let code="";for(let i=0;i<6;i++)code+=CH[Math.floor(r()*CH.length)];
  const ref="VC6-"+code, flight="FU "+(100+Math.floor(r()*900));
  const [r0,r1,layout]=CAB[cls];
  const row=r0+Math.floor(r()*(r1-r0+1));
  const L=layout[Math.floor(r()*layout.length)];
  const gate=1+Math.floor(r()*24);
  const pax=(1000+Math.floor(r()*9000)).toLocaleString('en-US');
  const from=resolveAirport($('from').value);
  const side="ABC".includes(L)?"Left":"Right";
  let depLine="",boardLine="";
  if(SHOW_DEPARTURE){
    const dep=parseDep();
    depLine="DEPARTS "+fmtDT(dep);
    boardLine=`BOARDING ${fmtT(new Date(dep-45*6e4))} · GATE CLOSES ${fmtT(new Date(dep-15*6e4))}`;
  }
  const q=(typeof qrcode==='function')?qrcode(0,'M'):null;
  let qrImg=null;
  if(q){q.addData(`FLYUS|${ref}|${name}|${flight}|LSX-VCI|${row}${L}|${gate}|${CLASS_LABEL[cls]}|${ed}`);q.make();
    $('qrtmp').innerHTML=q.createImgTag(6,0);qrImg=await loadImg($('qrtmp').querySelector('img').src)}
  STATE={T,h,name,cls,cl:CLASS_LABEL[cls],ref,flight,seat:row+L,gate,pax,conn:from?("Connecting from "+from):"",badge:E.badge.toUpperCase(),
    sinfo:`${seatType(L,layout)} seat · ${side} side`+(E.perk?` · ${E.perk}`:""),
    arrS:fmtDT(RELEASE),arrDate:fmtD(RELEASE),countdown:countdown(),depLine,boardLine,
    stamp:$('stampOn').checked,stampSeed:h%997,seatInfo:{layout,r0,r1,row,L},qr:qrImg};
  await redraw();
  if(my!==buildToken)return;
  $('stage').style.display='block';$('act').style.display='flex';
  if($('outwrap').style.display==='block'){$('outwrap').classList.add('stale');$('outmsg').textContent='Previous export — use Download PNG again for this ticket.'}
  renderBoard(r,flight,gate);
}
$('f').onsubmit=e=>{e.preventDefault();build("")};
$('re').onclick=()=>build(String(Math.random()));

/* ===== split-flap arrivals board ===== */
const BCOLS=[6,13,5,3,10],BCH='ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789 ';
let boardToken=0;
function renderBoard(r,flight,gate){
  const froms=['SUNSET KEYS','NEON HARBOR','PALM BAY','GULF CROSSING','LAKESIDE','CORAL POINT'];
  const stats=['ON TIME','DELAYED','LANDING','ON TIME','GATE OPEN'];
  const rows=[[flight,'LOS SANTOS',fmtT(RELEASE),String(gate),countdown()]];
  const decoys=[];
  for(let i=0;i<3;i++){
    const t=new Date(RELEASE.getTime()+Math.floor((r()*480-180)/5)*5*6e4);
    decoys.push({t,row:['FU '+(100+Math.floor(r()*900)),froms[Math.floor(r()*froms.length)],fmtT(t),String(1+Math.floor(r()*24)),stats[Math.floor(r()*stats.length)]]});
  }
  decoys.sort((a,b)=>a.t-b.t).forEach(d=>rows.push(d.row));
  const el=$('boardRows');
  const keepH=$('board').offsetHeight;
  if(keepH)$('board').style.minHeight=keepH+'px';
  el.innerHTML='';
  rows.forEach((row,ri)=>{
    const re=document.createElement('div');re.className='brow'+(ri===0?' mine':'');
    row.forEach((txt,ci)=>{
      const g=document.createElement('span');g.className='bgrp';
      const n=BCOLS[ci],padded=(txt.toUpperCase()+' '.repeat(n)).slice(0,n);
      for(let k=0;k<n;k++){const c=document.createElement('i');c.textContent=' ';c.dataset.t=padded[k];g.appendChild(c)}
      re.appendChild(g)});
    el.appendChild(re)});
  $('board').style.display='block';
  const my=++boardToken,cells=[...el.querySelectorAll('i')],start=performance.now();
  cells.forEach((c,i)=>{c._end=start+350+(i%34)*38+Math.random()*450});
  (function tick(now){
    if(my!==boardToken)return;
    let done=true;
    cells.forEach(c=>{
      if(now>=c._end){if(c.textContent!==c.dataset.t){c.textContent=c.dataset.t;c.classList.remove('flap');void c.offsetWidth;c.classList.add('flap')}}
      else{done=false;if(Math.random()<.5)c.textContent=BCH[Math.floor(Math.random()*BCH.length)]}});
    if(!done)requestAnimationFrame(tick);else $('board').style.minHeight='';
  })(performance.now());
}

/* ===== tear-off animation (stub on the left, the right, or the bottom) ===== */
function tearAnim(tr){
  return new Promise(res=>{
    if(matchMedia('(prefers-reduced-motion: reduce)').matches){res();return}
    const cv=$('ticket'),stage=$('stage'),N=42,horiz=tr.axis==='y',zz=[];
    for(let i=0;i<=N;i++)zz.push(horiz?`${(i/N*100).toFixed(2)}% ${tr.pos+(i%2?.3:-.3)}%`:`${tr.x+(i%2?.5:-.5)}% ${(i/N*100).toFixed(2)}%`);
    const c2=document.createElement('canvas');c2.width=cv.width;c2.height=cv.height;c2.getContext('2d').drawImage(cv,0,0);
    c2.className='tearc';c2.style.transformOrigin=horiz?`50% ${tr.pos}%`:`${tr.x}% 50%`;stage.appendChild(c2);
    let keep,rip,move;
    if(horiz){const rv=zz.slice().reverse().join(', ');keep=`polygon(0% 0%, 100% 0%, ${rv})`;rip=`polygon(0% 100%, 100% 100%, ${rv})`;move='translate(0%,12%) rotate(4deg)'}
    else if(tr.side==='left'){keep=`polygon(100% 0%, ${zz.join(', ')}, 100% 100%)`;rip=`polygon(0% 0%, ${zz.join(', ')}, 0% 100%)`;move='translate(-9%,14%) rotate(-10deg)'}
    else{keep=`polygon(0% 0%, ${zz.join(', ')}, 0% 100%)`;rip=`polygon(100% 0%, ${zz.join(', ')}, 100% 100%)`;move='translate(9%,14%) rotate(10deg)'}
    cv.style.clipPath=keep;c2.style.clipPath=rip;
    c2.style.transition='transform .85s cubic-bezier(.5,0,.9,.4), opacity .85s ease-in';
    requestAnimationFrame(()=>requestAnimationFrame(()=>{c2.style.transform=move;c2.style.opacity='0'}));
    setTimeout(()=>{c2.remove();cv.style.clipPath='';res()},950);
  });
}

/* ===== wallpaper ===== */
async function renderWallpaper(W,H,lay){
  if(!STATE)throw new Error("Generate a ticket first");
  const S=STATE,T=S.T,D=curDesign(),portrait=H>W,ticketPortrait=D.H>D.W,Mx=Math.max(W,H);
  const rot=(lay==='fit')&&(D.W!==D.H)&&(ticketPortrait!==portrait);
  const tw=rot?D.H:D.W, th=rot?D.W:D.H, wide=th<tw*.7;
  const wf=portrait?.9:.92, hf=wide?(portrait?.5:.62):.9;
  const sc=Math.min(W*wf/tw, H*hf/th);
  const cx=W/2, cy=H*((wide&&portrait)?.6:.52);
  await loadFonts();
  const c=document.createElement('canvas');c.width=W;c.height=H;
  const ctx=c.getContext('2d'),u=Mx/1000,ps=Math.min(H/620,W/400);
  let sign;
  if(portrait){const sw=W*.72,sh=sw*.27;sign={x:(W-sw)/2,y:H*.72,w:sw,h:sh}}
  else{const sh=H*.15,sw=sh/.27;sign={x:(W-sw)/2,y:H*.05,w:sw,h:sh}}
  const slabs=[];const sr=rng(hash(S.ref)+3);
  for(let i=0;i<4;i++){const w=W*(.1+sr()*.08);slabs.push([W*(.03+i*.25+sr()*.05),w,H*(portrait?.74:.8)-H*(.14+sr()*.2)])}
  drawScene(ctx,W,H,T,hash(S.ref)+7,{u,sunX:W*(portrait?.64:.7),sunY:H*(portrait?.3:.34),sunR:Mx*.55,clouds:9,base:H*(portrait?.78:.84),cityH:.22,groundH:H*.07,
    slabs,sign,palms:[[W*.05,H*1.02,ps*1.5,.45],[W*.95,H*1.02,ps*1.8,.45],[W*.3,H*1.02,ps*.9,.35]]});
  ctx.save();
  ctx.translate(cx,cy);
  ctx.rotate(rot?Math.PI/2+1.2*Math.PI/180:-1.2*Math.PI/180);
  ctx.scale(sc,sc);
  ctx.translate(-D.W/2,-D.H/2);
  ctx.save();
  ctx.shadowColor='rgba(25,5,45,.55)';ctx.shadowBlur=45*sc;ctx.shadowOffsetY=24*sc;
  rrp(ctx,0,0,D.W,D.H,22);ctx.fillStyle=T.h2;ctx.fill();
  ctx.restore();
  D.draw(ctx,S,{qr:S.qr});
  ctx.restore();
  const fs=Math.round(Mx/110);
  ctx.font=`600 ${fs}px Oswald,sans-serif`;ctx.fillStyle='rgba(255,255,255,.75)';ctx.textAlign='center';ctx.textBaseline='middle';
  if('letterSpacing' in ctx)ctx.letterSpacing=(fs*.12)+'px';
  ctx.fillText('IDEA BY @VINEWOOD_MOTORS · UNOFFICIAL FAN ART · NOT AFFILIATED WITH ROCKSTAR GAMES OR TAKE-TWO',W/2,H-Mx/55);
  return new Promise((res,rej)=>c.toBlob(b=>b?res(b):rej(new Error('canvas export failed')),'image/png'));
}

/* ===== buttons (no page jumps: smooth scroll only after the animation finishes) ===== */
function showMsg(html){$('outmsg').innerHTML=html;$('outwrap').style.display='block'}
function triggerDownload(url,name){try{const a=document.createElement('a');a.href=url;a.download=name;a.rel='noopener';document.body.appendChild(a);a.click();a.remove()}catch(e){}}
function smoothScrollTo(el){
  const y=el.getBoundingClientRect().top+window.scrollY-20;
  window.scrollTo({top:Math.max(0,y),behavior:'smooth'});
}
let lastBlobUrl=null;
function presentExport(blob,name,msg){
  if(lastBlobUrl)URL.revokeObjectURL(lastBlobUrl);
  lastBlobUrl=URL.createObjectURL(blob);
  $('outwrap').classList.remove('stale');
  $('out').src=lastBlobUrl;
  showMsg(`${msg} <a href="${lastBlobUrl}" download="${name}">Save PNG</a> (or right-click the image).`);
  setTimeout(()=>smoothScrollTo($('outwrap')),80);
  setTimeout(()=>triggerDownload(lastBlobUrl,name),800);
}
$('dl').onclick=async()=>{
  const btn=$('dl');btn.disabled=true;
  try{
    const blobP=new Promise((res,rej)=>$('ticket').toBlob(b=>b?res(b):rej(new Error('canvas export failed')),'image/png'));
    await tearAnim(curDesign().tear);
    presentExport(await blobP,STATE.ref+'.png','Ticket ready.');
  }catch(err){showMsg("PNG export failed: "+String(err.message||err).replace(/</g,'&lt;'))}
  finally{btn.disabled=false}
};
$('wp').onclick=async()=>{
  const btn=$('wp');btn.disabled=true;
  try{
    const [W,H]=$('wsize').value.split('x').map(Number);
    showMsg(`Rendering ${W}×${H} wallpaper…`);
    const blob=await renderWallpaper(W,H,$('wlay').value);
    presentExport(blob,`${STATE.ref}-wallpaper-${W}x${H}.png`,`Wallpaper ready (${W}×${H}).`);
  }catch(err){showMsg("Wallpaper export failed: "+String(err.message||err).replace(/</g,'&lt;'))}
  finally{btn.disabled=false}
};

/* Preview controls, ticket resolution, and synthesized paper-rip audio */
function oceanText(ctx,s,x,y,size,color,weight=700,max=999){ctx.save();ctx.fillStyle=color;ctx.textBaseline='alphabetic';let z=size;do{ctx.font=`${weight} ${z}px Oswald,Arial,sans-serif`;if(ctx.measureText(s).width<=max)break;z--}while(z>10);ctx.fillText(s,x,y);ctx.restore();}
function drawOcean(ctx,S,A){
const T=S.T,W=1200,H=460;ctx.save();rrp(ctx,0,0,W,H,22);ctx.clip();drawScene(ctx,W,H,T,hash(S.ref),{u:1,sunX:380,sunY:150,sunR:450,base:380,cityH:.12,groundH:90,clouds:8,palms:[[48,460,1.55,.42],[540,460,.85,.35],[690,460,1.4,.42]]});
ctx.fillStyle='rgba(255,255,255,.28)';ctx.fillRect(0,260,768,200);for(let i=0;i<7;i++){ctx.strokeStyle='rgba(255,255,255,.25)';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(0,290+i*19);ctx.bezierCurveTo(220,270+i*19,420,320+i*19,768,285+i*19);ctx.stroke()}
oceanText(ctx,'flyUS',34,57,36,'#fff');oceanText(ctx,'OCEAN DRIVE / BOARDING COLLECTION',34,86,12,T.tx,600);oceanText(ctx,'VICE',32,191,112,T.tx);oceanText(ctx,'CITY',32,300,112,T.tx);ctx.fillStyle='rgba(255,255,255,.91)';rrp(ctx,34,328,690,94,14);ctx.fill();oceanText(ctx,'PASSENGER',54,350,11,T.ac,500);oceanText(ctx,S.name,54,388,32,T.tx,700,340);oceanText(ctx,'CABIN',430,350,11,T.ac,500);oceanText(ctx,S.cl,430,384,23,T.tx,700,160);oceanText(ctx,'FLIGHT',618,350,11,T.ac,500);oceanText(ctx,S.flight,618,384,23,T.tx,700,90);oceanText(ctx,S.conn||'NONSTOP FROM LOS SANTOS',34,450,12,T.tx,600,680);
ctx.fillStyle='#fff8ef';ctx.fillRect(768,0,432,H);ctx.fillStyle=T.ac;ctx.fillRect(768,0,432,9);oceanText(ctx,'LSX',798,62,38,T.tx);plane(ctx,925,45,.55,0,T.ac);oceanText(ctx,'VCI',985,62,38,T.tx);oceanText(ctx,'LANDS',798,93,12,T.ac,500);oceanText(ctx,S.arrS,798,126,25,T.tx,700,365);ctx.fillStyle=hexA(T.ac,.12);rrp(ctx,798,145,370,40,10);ctx.fill();oceanText(ctx,S.badge||'SUNSET SERVICE',812,171,18,T.ac,700,340);ctx.fillStyle='#fff';rrp(ctx,798,210,144,144,10);ctx.fill();if(A.qr){ctx.imageSmoothingEnabled=false;ctx.drawImage(A.qr,806,218,128,128);ctx.imageSmoothingEnabled=true}
oceanText(ctx,'SEAT',967,223,12,T.ac,500);oceanText(ctx,S.seat,967,267,43,T.tx);oceanText(ctx,'GATE',1081,223,12,T.ac,500);oceanText(ctx,String(S.gate),1081,267,43,T.tx);drawSeatMap(ctx,967,286,S,T);oceanText(ctx,S.countdown,967,351,21,T.ac);drawBarcode(ctx,798,376,370,29,S.h,T.tx);oceanText(ctx,S.ref+' / PAX '+S.pax,798,425,13,T.tx);oceanText(ctx,'IDEA: @VINEWOOD_MOTORS / UNOFFICIAL FAN ART',798,447,10,T.tx,400,370);ctx.save();ctx.setLineDash([5,7]);ctx.strokeStyle=T.ac;ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(768,12);ctx.lineTo(768,H);ctx.stroke();ctx.restore();if(S.stamp)ctx.drawImage(stampSprite(S,2),596,191,114,114);ctx.restore();
}
function drawPageBackground(){const cv=$('landscape'),w=innerWidth,h=innerHeight,d=Math.min(devicePixelRatio||1,1.5);cv.width=w*d;cv.height=h*d;const c=cv.getContext('2d');c.scale(d,d);let g=c.createLinearGradient(0,0,0,h);g.addColorStop(0,'#291945');g.addColorStop(.47,'#ad6c91');g.addColorStop(.7,'#f0ae95');g.addColorStop(1,'#302d56');c.fillStyle=g;c.fillRect(0,0,w,h);const x=w*.8,y=h*.38,r=Math.min(w,h)*.16;g=c.createRadialGradient(x,y,0,x,y,r*2.5);g.addColorStop(0,'#ffd5a3aa');g.addColorStop(1,'#ffd5a300');c.fillStyle=g;c.fillRect(0,0,w,h);c.fillStyle='#ffd7b5';c.beginPath();c.arc(x,y,r,0,Math.PI*2);c.fill();c.fillStyle='#313350';c.fillRect(0,h*.7,w,h*.3);for(let i=0;i<35;i++){c.strokeStyle=`rgba(245,192,186,${.18*(1-i/35)})`;c.beginPath();c.moveTo(0,h*.71+i*h*.009);c.lineTo(w,h*.71+i*h*.009);c.stroke()}palm(c,w*.04,h*1.05,h/340,'#19132f',.92);palm(c,w*.97,h*1.04,h/290,'#19132f',.92);palm(c,w*.9,h*1.05,h/410,'#19132f',.7);const rnd=rng(42);c.fillStyle='#30203f';for(let bx=0;bx<w;bx+=30){const bh=10+rnd()*h*.06;c.fillRect(bx,h*.7-bh,23,bh)}}
DESIGNS.ocean={W:1200,H:460,draw:drawOcean,tear:{axis:'x',x:64,side:'right'}};
function updateLayoutSelection(){const key=$('design').value;document.querySelectorAll('.layout-choice').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.layout===key)));$('layoutName').textContent=$('design').selectedOptions[0].textContent;updateExportOptions();}
function drawLayoutThumbnails(){if(!STATE)return;document.querySelectorAll('.layout-choice').forEach(button=>{const cv=button.querySelector('canvas'),D=DESIGNS[button.dataset.layout],box=cv.getBoundingClientRect(),w=Math.max(80,box.width),h=Math.max(70,box.height),d=Math.min(devicePixelRatio||1,2);cv.width=Math.round(w*d);cv.height=Math.round(h*d);const ctx=cv.getContext('2d');ctx.scale(d,d);const scale=Math.min((w-16)/D.W,(h-16)/D.H);ctx.translate((w-D.W*scale)/2,(h-D.H*scale)/2);ctx.scale(scale,scale);D.draw(ctx,STATE,{qr:STATE.qr});});updateLayoutSelection();}
function updateExportOptions(){const D=curDesign();for(const option of $('ticketScale').options){const scale=Number(option.value);option.textContent=`${scale}× — ${D.W*scale} × ${D.H*scale} px`;}const scale=Number($('ticketScale').value);$('exportDimensions').textContent=`Ticket PNG: ${D.W*scale} × ${D.H*scale} pixels. Wallpaper size is separate.`;}
$('ticketScale').onchange=updateExportOptions;
let audioContext=null;
async function prepareRipAudio(){if(!$('ripSoundOn').checked)return false;try{const AudioClass=window.AudioContext||window.webkitAudioContext;if(!AudioClass)return false;if(!audioContext||audioContext.state==='closed')audioContext=new AudioClass();if(audioContext.state==='suspended')await audioContext.resume();return audioContext.state==='running';}catch(e){return false;}}
function playPaperRip(){
if(!$('ripSoundOn').checked||!audioContext||audioContext.state!=='running')return false;
try{const ac=audioContext,duration=.84,samples=Math.ceil(ac.sampleRate*duration),buffer=ac.createBuffer(1,samples,ac.sampleRate),data=buffer.getChannelData(0);
let drift=0;for(let i=0;i<samples;i++){const t=i/ac.sampleRate;drift=drift*.84+(Math.random()*2-1)*.16;const flutter=.35+.65*Math.pow(Math.abs(Math.sin(t*93+Math.sin(t*31)*1.8)),3);const crackle=Math.random()<.008?(Math.random()*2-1)*.85:0;data[i]=((Math.random()*2-1)*.62+drift*.8)*flutter+crackle;}
const noise=ac.createBufferSource(),high=ac.createBiquadFilter(),low=ac.createBiquadFilter(),gain=ac.createGain();noise.buffer=buffer;high.type='highpass';high.frequency.value=400;low.type='lowpass';low.frequency.value=6500;noise.connect(high);high.connect(low);low.connect(gain);gain.connect(ac.destination);
const start=ac.currentTime+.008;gain.gain.setValueAtTime(0,start);gain.gain.linearRampToValueAtTime(.32,start+.035);gain.gain.linearRampToValueAtTime(.2,start+.25);gain.gain.linearRampToValueAtTime(.3,start+.62);gain.gain.exponentialRampToValueAtTime(.001,start+duration);noise.start(start);noise.stop(start+duration);noise.onended=()=>{noise.disconnect();high.disconnect();low.disconnect();gain.disconnect();};return true;}catch(e){return false;}}
let exporting=false;
function lockExportControls(){const controls=[...document.querySelectorAll('input,select,button')],states=controls.map(control=>control.disabled);controls.forEach(control=>control.disabled=true);return()=>controls.forEach((control,i)=>control.disabled=states[i]);}
$('dl').onclick=async()=>{
if(!STATE||exporting)return;exporting=true;
const soundRequested=$('ripSoundOn').checked,audioReady=prepareRipAudio(),D=curDesign(),S=STATE,scale=Number($('ticketScale').value),unlock=lockExportControls();
try{
$('exportStatus').textContent='Rendering ticket PNG…';await loadFonts();
const cv=document.createElement('canvas');cv.width=D.W*scale;cv.height=D.H*scale;const ctx=cv.getContext('2d');ctx.scale(scale,scale);D.draw(ctx,S,{qr:S.qr});
const blob=await new Promise((resolve,reject)=>cv.toBlob(b=>b?resolve(b):reject(new Error('PNG export failed')),'image/png'));
await audioReady;const played=playPaperRip();$('exportStatus').textContent='Tearing off your ticket…';await tearAnim(D.tear);
presentExport(blob,`${S.ref}-${cv.width}x${cv.height}.png`,`Ticket ready (${cv.width}×${cv.height}).`);
$('exportStatus').textContent=`Saved at ${cv.width} × ${cv.height} px.`+(soundRequested&&!played?' Sound unavailable in this browser; PNG export is unaffected.':'');
}catch(e){$('exportStatus').textContent='Ticket export failed: '+(e.message||e);}finally{unlock();exporting=false;}
};
$('ripSoundOn').onchange=()=>{if(!$('ripSoundOn').checked&&audioContext&&audioContext.state==='running')audioContext.suspend().catch(()=>{});};
const baseBuild=build;
build=async function(seed){try{await baseBuild(seed);drawLayoutThumbnails();$('loading').textContent=typeof qrcode==='function'?'':'QR library unavailable. Connect to the internet and reload to include QR codes.';}catch(e){$('loading').textContent='Could not render: '+e.message;throw e;}};
$('design').onchange=async()=>{await redraw();updateLayoutSelection();};document.querySelectorAll('.layout-choice').forEach(button=>button.addEventListener('click',async()=>{$('design').value=button.dataset.layout;await redraw();updateLayoutSelection();}));
$('ed').onchange=()=>{$('cls').value=EDITIONS[$('ed').value].cls;build('');};['cls','stampOn'].forEach(id=>$(id).addEventListener('change',()=>build('')));
window.addEventListener('resize',()=>{drawPageBackground();drawLayoutThumbnails();});drawPageBackground();updateExportOptions();build('').catch(()=>{});
