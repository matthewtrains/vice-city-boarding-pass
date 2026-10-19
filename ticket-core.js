const $=id=>document.getElementById(id);

/* ===== settings ===== */
const SHOW_DEPARTURE=false;                       // true = bring back departure date/time + boarding times
const RELEASE=new Date('2026-11-19T00:00:00');    // GTA VI release date; 00:00 local = store-listing unlock time (not officially confirmed)
if(SHOW_DEPARTURE)$('depFields').hidden=false;

/* ===== date helpers ===== */
const MON=['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];
const pad=n=>String(n).padStart(2,'0');
const fmtT=d=>`${pad(d.getHours())}:${pad(d.getMinutes())}`;
const fmtD=d=>`${pad(d.getDate())} ${MON[d.getMonth()]} ${d.getFullYear()}`;
const fmtDT=d=>`${fmtD(d)} · ${fmtT(d)}`;
function parseDep(){const d=new Date(`${$('dd').value||'2026-11-18'}T${$('dt').value||'16:00'}`);return isNaN(d)?new Date('2026-11-18T16:00'):d}
function countdown(){
  const ms=RELEASE-new Date();
  if(ms<=0)return 'LANDED';
  const d=Math.floor(ms/864e5);
  if(d>=1)return `T-${d} ${d===1?'DAY':'DAYS'}`;
  return `T-${Math.max(1,Math.floor(ms/36e5))} HRS`;
}

/* ===== data ===== */
const AIRPORTS=[
 ["ATL","Atlanta","Hartsfield-Jackson"],["LAX","Los Angeles","Los Angeles Intl."],["ORD","Chicago","O'Hare"],
 ["DFW","Dallas/Fort Worth","DFW Intl."],["DEN","Denver","Denver Intl."],["JFK","New York","John F. Kennedy"],
 ["SFO","San Francisco","San Francisco Intl."],["SEA","Seattle","Seattle-Tacoma"],["LAS","Las Vegas","Harry Reid"],
 ["MCO","Orlando","Orlando Intl."],["EWR","Newark","Newark Liberty"],["CLT","Charlotte","Charlotte Douglas"],
 ["PHX","Phoenix","Sky Harbor"],["IAH","Houston","George Bush Intercontinental"],["MIA","Miami","Miami Intl."],
 ["BOS","Boston","Logan"],["MSP","Minneapolis","Minneapolis-St. Paul"],["FLL","Fort Lauderdale","Fort Lauderdale-Hollywood"],
 ["DTW","Detroit","Detroit Metro"],["PHL","Philadelphia","Philadelphia Intl."],["LGA","New York","LaGuardia"],
 ["BWI","Baltimore","Baltimore/Washington"],["SLC","Salt Lake City","Salt Lake City Intl."],["SAN","San Diego","San Diego Intl."],
 ["IAD","Washington","Dulles"],["DCA","Washington","Reagan National"],["MDW","Chicago","Midway"],
 ["TPA","Tampa","Tampa Intl."],["HNL","Honolulu","Daniel K. Inouye"],["PDX","Portland","Portland Intl."],
 ["AUS","Austin","Austin-Bergstrom"],["BNA","Nashville","Nashville Intl."],["STL","St. Louis","Lambert"],
 ["MCI","Kansas City","Kansas City Intl."],["RDU","Raleigh-Durham","Raleigh-Durham Intl."],["PIT","Pittsburgh","Pittsburgh Intl."],
 ["CLE","Cleveland","Hopkins"],["CMH","Columbus","John Glenn"],["CVG","Cincinnati","Cincinnati/N. Kentucky"],
 ["IND","Indianapolis","Indianapolis Intl."],["SJC","San Jose","Mineta San Jose"],["OAK","Oakland","Oakland Intl."],
 ["SMF","Sacramento","Sacramento Intl."],["MSY","New Orleans","Louis Armstrong"],["SAT","San Antonio","San Antonio Intl."],
 ["SNA","Orange County","John Wayne"],["DAL","Dallas","Love Field"],["HOU","Houston","Hobby"],
 ["ANC","Anchorage","Ted Stevens"],["MKE","Milwaukee","Mitchell"],["JAX","Jacksonville","Jacksonville Intl."],
 ["RSW","Fort Myers","Southwest Florida"],["BDL","Hartford","Bradley"],["CHS","Charleston","Charleston Intl."]
];
AIRPORTS.sort((a,b)=>a[1].localeCompare(b[1])||a[0].localeCompare(b[0]));
const label=a=>`${a[1]} – ${a[2]} (${a[0]})`;
$('airports').innerHTML=AIRPORTS.map(a=>`<option value="${label(a)}"></option>`).join('');
$('from').addEventListener('focus',e=>e.target.select());
function resolveAirport(txt){
  const s=txt.trim().toLowerCase();
  if(!s)return "";
  const a=AIRPORTS.find(x=>label(x).toLowerCase()===s)
     ||AIRPORTS.find(x=>x[0].toLowerCase()===s)
     ||AIRPORTS.find(x=>`${x[1]} (${x[0]})`.toLowerCase()===s)
     ||AIRPORTS.find(x=>(x[1]+" "+x[2]+" "+x[0]).toLowerCase().includes(s));
  return a?`${a[1]} (${a[0]})`:txt.trim();
}
const EDITIONS={
  STANDARD:{badge:"",perk:"",cls:"ECONOMY"},
  SPECIAL:{badge:"Special Edition",perk:"Lounge",cls:"BUSINESS"},
  COLLECTOR:{badge:"Collector's Edition",perk:"Priority",cls:"FIRST"}
};
$('ed').onchange=()=>{$('cls').value=EDITIONS[$('ed').value].cls};

const THEMES={
 ECONOMY:{bd:"#c98ad6",pb1:"#ee8ac4",pb2:"#9a80e0",h1:"#ee8ac4",h2:"#c586d6",h3:"#9a80e0",tx:"#262d57",ac:"#e0449a",s1:"#a99bd8",s2:"#d79ad0",s3:"#e9a0d8",sun:"#ffd6f0",dk:"#5a4590",sl:"#8d6bb8",gd:"#2a2250"},
 BUSINESS:{bd:"#4aa8d0",pb1:"#4fc3d9",pb2:"#6a6ad8",h1:"#4fc3d9",h2:"#4a8fd8",h3:"#6a6ad8",tx:"#10304a",ac:"#0b7686",s1:"#7fb6dc",s2:"#a9c4e8",s3:"#f0c0d0",sun:"#fff3c4",dk:"#1f4d7a",sl:"#5f8fc0",gd:"#10304a"},
 FIRST:{bd:"#d9a441",pb1:"#d9a441",pb2:"#dc6b9a",h1:"#e0a04a",h2:"#e5876f",h3:"#dc6b9a",tx:"#3a2314",ac:"#a86a0e",s1:"#e48f8c",s2:"#f2b39a",s3:"#f4c08f",sun:"#fff3c4",dk:"#6d2c45",sl:"#c9708a",gd:"#3a2314"}
};
const CLASS_LABEL={ECONOMY:"ECONOMY",BUSINESS:"BUSINESS",FIRST:"FIRST CLASS"};
const CH="ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
const CAB={ECONOMY:[13,38,"ABCDEF"],BUSINESS:[5,12,"ACDF"],FIRST:[1,4,"ACDF"]};
function seatType(L,layout){
  if("AF".includes(L))return "Window";
  if(layout.length===6)return "BE".includes(L)?"Middle":"Aisle";
  return "Aisle";
}
function hash(s){let h=2166136261;for(const c of s){h^=c.charCodeAt(0);h=Math.imul(h,16777619)}return h>>>0}
function rng(seed){let a=seed;return()=>{a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
function hexA(h,a){const n=parseInt(h.slice(1),16);return `rgba(${n>>16&255},${n>>8&255},${n&255},${a})`}

/* ===== drawing primitives ===== */
function rrPath(ctx,x,y,w,h,r){ctx.moveTo(x+r,y);ctx.arcTo(x+w,y,x+w,y+h,r);ctx.arcTo(x+w,y+h,x,y+h,r);ctx.arcTo(x,y+h,x,y,r);ctx.arcTo(x,y,x+w,y,r);ctx.closePath()}
function rrp(ctx,x,y,w,h,r){ctx.beginPath();rrPath(ctx,x,y,w,h,r)}
const PALM_T=new Path2D('M0 0 C4 -60 2 -110 10 -170');
const PALM_F=['M10 -170 C-30 -190 -60 -170 -80 -140','M10 -170 C-20 -205 -50 -205 -75 -190','M10 -170 C50 -195 85 -175 100 -140',
  'M10 -170 C40 -210 75 -210 95 -190','M10 -170 C10 -205 15 -225 5 -245','M10 -170 C-5 -190 -40 -215 -55 -225'].map(d=>new Path2D(d));
function palm(ctx,x,y,s,color,a=1){
  ctx.save();ctx.translate(x,y);ctx.scale(s,s);ctx.globalAlpha=a;ctx.strokeStyle=color;ctx.lineCap='round';
  ctx.lineWidth=7;ctx.stroke(PALM_T);ctx.lineWidth=5;PALM_F.forEach(p=>ctx.stroke(p));ctx.restore();
}
function plane(ctx,x,y,s,rot,color,a=1){
  ctx.save();ctx.translate(x,y);ctx.rotate(rot);ctx.scale(s,s);ctx.globalAlpha=a;ctx.fillStyle=color;
  ctx.beginPath();ctx.ellipse(0,0,30,5,0,0,Math.PI*2);ctx.fill();
  [[-4,0,-18,-24,-9,-24,10,0],[-4,0,-18,24,-9,24,10,0],[-26,0,-36,-9,-31,-9,-20,0],[-26,0,-36,9,-31,9,-20,0]].forEach(p=>{
    ctx.beginPath();ctx.moveTo(p[0],p[1]);ctx.lineTo(p[2],p[3]);ctx.lineTo(p[4],p[5]);ctx.lineTo(p[6],p[7]);ctx.closePath();ctx.fill()});
  ctx.restore();
}
function star4(ctx,x,y,s,color){
  ctx.save();ctx.translate(x,y);ctx.fillStyle=color;ctx.beginPath();
  for(let i=0;i<8;i++){const a=i*Math.PI/4-Math.PI/2,r=i%2?s*.32:s;ctx.lineTo(Math.cos(a)*r,Math.sin(a)*r)}
  ctx.closePath();ctx.fill();ctx.restore();
}
function tower(ctx,x,y0,y1,w){
  ctx.lineWidth=Math.max(1.5,w*.12);ctx.beginPath();
  ctx.moveTo(x,y0);ctx.lineTo(x,y1);ctx.moveTo(x+w,y0);ctx.lineTo(x+w,y1);
  const st=w*1.4;
  for(let y=y0;y<y1;y+=st){ctx.moveTo(x,y);ctx.lineTo(x+w,y+st);ctx.moveTo(x+w,y);ctx.lineTo(x,y+st);ctx.moveTo(x,y);ctx.lineTo(x+w,y)}
  ctx.stroke();
}
/* Vice City sunset scene, shared by every layout and the wallpaper */
function drawScene(ctx,W,H,T,seed,o){
  const r=rng(seed),u=o.u;
  let g=ctx.createLinearGradient(0,0,0,H);
  g.addColorStop(0,T.s1);g.addColorStop(.5,T.s2);g.addColorStop(1,T.s3);
  ctx.fillStyle=g;ctx.fillRect(0,0,W,H);
  g=ctx.createRadialGradient(o.sunX,o.sunY,0,o.sunX,o.sunY,o.sunR);
  g.addColorStop(0,hexA(T.sun,.95));g.addColorStop(1,hexA(T.sun,0));
  ctx.fillStyle=g;ctx.fillRect(0,0,W,H);
  for(let i=0;i<(o.clouds||6);i++){
    const rx=(0.16+r()*0.26)*W,ry=rx*(0.07+r()*0.06),cx=r()*W,cy=H*(0.06+r()*0.6);
    ctx.save();ctx.translate(cx,cy);ctx.scale(1,ry/rx);
    const cg=ctx.createRadialGradient(0,0,0,0,0,rx);cg.addColorStop(0,'rgba(255,255,255,.4)');cg.addColorStop(1,'rgba(255,255,255,0)');
    ctx.fillStyle=cg;ctx.beginPath();ctx.arc(0,0,rx,0,Math.PI*2);ctx.fill();ctx.restore();
  }
  ctx.save();ctx.globalAlpha=.3;ctx.fillStyle=T.sl;
  for(let x=-u*10;x<W;){const bw=u*(22+r()*36),bh=H*o.cityH*(0.25+r()*.75);ctx.fillRect(x,o.base-bh,bw,bh+H);x+=bw+u*(2+r()*4)}
  ctx.restore();
  (o.slabs||[]).forEach(([x,w,top],i)=>{
    ctx.save();ctx.fillStyle=T.dk;ctx.globalAlpha=.24+(i%3)*.04;
    ctx.beginPath();ctx.moveTo(x,H);ctx.lineTo(x,top+w*.12);ctx.lineTo(x+w,top);ctx.lineTo(x+w,H);ctx.closePath();ctx.fill();
    ctx.fillStyle='#fff';ctx.globalAlpha=.14;ctx.fillRect(x+w*.1,top+w*.25,w*.7,w*.06);ctx.fillRect(x+w*.1,top+w*.36,w*.5,w*.04);ctx.restore()});
  ctx.save();ctx.strokeStyle=T.dk;ctx.globalAlpha=.32;
  (o.towers||[]).forEach(([x,w,y0])=>tower(ctx,x,y0,H,w));ctx.restore();
  if(o.sign){
    const {x:sx0,y:sy0,w:sw,h:sh}=o.sign;
    ctx.save();ctx.globalAlpha=.5;ctx.strokeStyle=T.dk;
    const tw=sw*.05;[sx0+sw*.08,sx0+sw*.92-tw].forEach(tx=>tower(ctx,tx,sy0+sh,H,tw));
    g=ctx.createLinearGradient(sx0,0,sx0+sw,0);g.addColorStop(0,T.h1);g.addColorStop(1,T.h3);
    rrp(ctx,sx0,sy0,sw,sh,sh*.08);ctx.fillStyle=g;ctx.globalAlpha=.82;ctx.fill();
    ctx.lineWidth=sh*.04;ctx.globalAlpha=.55;ctx.stroke();
    ctx.globalAlpha=.95;ctx.fillStyle='#fff';ctx.textAlign='center';ctx.textBaseline='middle';
    ctx.font=`700 ${sh*.2}px Poppins,Arial,sans-serif`;ctx.fillText('WELCOME TO',sx0+sw/2,sy0+sh*.3);
    ctx.font=`800 ${sh*.42}px Poppins,Arial,sans-serif`;ctx.fillText('VICE CITY',sx0+sw/2,sy0+sh*.68);
    ctx.restore();
  }
  (o.palms||[]).forEach(p=>palm(ctx,p[0],p[1],p[2],T.dk,p[3]));
  if(o.veil){const v=o.veil;g=ctx.createLinearGradient(v.x,0,v.x+v.w,0);g.addColorStop(0,`rgba(255,255,255,${v.a0})`);g.addColorStop(1,`rgba(255,255,255,${v.a1})`);ctx.fillStyle=g;ctx.fillRect(v.x,v.y,v.w,v.h)}
  g=ctx.createLinearGradient(0,0,0,H);g.addColorStop(0,'rgba(255,255,255,0)');g.addColorStop(1,'rgba(255,255,255,.3)');
  ctx.fillStyle=g;ctx.fillRect(0,0,W,H);
  g=ctx.createLinearGradient(0,H-o.groundH,0,H);g.addColorStop(0,hexA(T.gd,0));g.addColorStop(1,hexA(T.gd,.62));
  ctx.fillStyle=g;ctx.fillRect(0,H-o.groundH,W,o.groundH);
}
function arcText(ctx,txt,r,start,span){
  const n=txt.length;
  for(let i=0;i<n;i++){const a=start+span*(i+.5)/n;ctx.save();ctx.translate(r*Math.cos(a),r*Math.sin(a));ctx.rotate(a+Math.PI/2);ctx.fillText(txt[i],0,0);ctx.restore()}
}
function stampSprite(S,k){
  const R=50,c=document.createElement('canvas');c.width=c.height=Math.ceil(R*2*k);
  const x=c.getContext('2d');x.scale(k,k);x.translate(R,R);x.rotate(-14*Math.PI/180);
  const col=S.T.ac;x.strokeStyle=col;x.fillStyle=col;x.globalAlpha=.92;
  x.lineWidth=2.6;x.beginPath();x.arc(0,0,R-4,0,Math.PI*2);x.stroke();
  x.lineWidth=1;x.beginPath();x.arc(0,0,R-9,0,Math.PI*2);x.stroke();x.beginPath();x.arc(0,0,23,0,Math.PI*2);x.stroke();
  x.font="700 8.5px Oswald,Arial,sans-serif";x.textAlign='center';x.textBaseline='middle';
  if('letterSpacing' in x)x.letterSpacing='1px';
  arcText(x,'VICE CITY INTL · ARRIVAL · VCI · ',R-17,-Math.PI/2,Math.PI*1.96);
  if('letterSpacing' in x)x.letterSpacing='0px';
  x.font="700 11px Oswald,Arial,sans-serif";x.fillText('ARRIVED',0,-3);
  x.font="600 6.5px Oswald,Arial,sans-serif";x.fillText(S.arrDate,0,8);
  const r=rng(S.stampSeed);x.globalCompositeOperation='destination-out';
  for(let i=0;i<260;i++){x.globalAlpha=.4+r()*.6;x.beginPath();x.arc((r()-.5)*R*2,(r()-.5)*R*2,.35+r()*1.1,0,Math.PI*2);x.fill()}
  return c;
}
function seatMapSize(layout){const n=layout.length;return{w:n*10+(n-1)*3+10+8,h:3*10+2*3+8}}
function drawSeatMap(ctx,x,y,S,T){
  const {layout,r0,r1,row,L}=S.seatInfo,cs=10,g=3,aisle=10,pd=4,n=layout.length,gapAfter=n===6?3:2,{w,h}=seatMapSize(layout);
  const start=Math.max(r0,Math.min(row-1,r1-2));
  ctx.save();ctx.translate(x,y);
  ctx.fillStyle='rgba(255,255,255,.6)';ctx.strokeStyle=hexA(T.tx,.45);ctx.lineWidth=1.3;
  rrp(ctx,.7,.7,w-1.4,h-1.4,8);ctx.fill();ctx.stroke();
  for(let ri=0;ri<3;ri++)for(let ci=0;ci<n;ci++){
    const sx=pd+ci*(cs+g)+(ci>=gapAfter?aisle:0),sy=pd+ri*(cs+g),mine=(start+ri===row&&layout[ci]===L);
    rrp(ctx,sx,sy,cs,cs,2.5);
    if(mine){ctx.fillStyle=T.ac;ctx.fill();ctx.strokeStyle='#fff';ctx.lineWidth=1.5;ctx.stroke()}
    else{ctx.fillStyle=hexA(T.tx,.3);ctx.fill()}}
  ctx.restore();
}
function drawBarcode(ctx,x,y,w,h,seed,color){
  const r=rng(seed);let p=0;ctx.fillStyle=color;
  while(p<w){const bw=1+Math.floor(r()*3),gap=1+Math.floor(r()*2);ctx.fillRect(x+p,y,Math.min(bw,w-p),h);p+=bw+gap}
}
function drawBarcodeV(ctx,x,y,w,hh,seed,color){
  const r=rng(seed);let p=0;ctx.fillStyle=color;
  while(p<hh){const bh=1+Math.floor(r()*3),gap=1+Math.floor(r()*2);ctx.fillRect(x,y+p,w,Math.min(bh,hh-p));p+=bh+gap}
}


