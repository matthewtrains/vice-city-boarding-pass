/* ===== REMIX layout (stub on the left, stacked route, cards) — 1000 x 420 units ===== */
function drawTicketRemix(ctx,S,A){
  const T=S.T,K=Math.hypot(ctx.getTransform().a,ctx.getTransform().b)||1;
  const LS=v=>{if('letterSpacing' in ctx)ctx.letterSpacing=v};
  const OS="Oswald,'Arial Narrow',Impact,sans-serif",PO="Poppins,Arial,sans-serif";
  const SH={dark:['rgba(40,10,60,.5)',3,1],glow:['rgba(255,255,255,.85)',6,0]};
  const t=(s,x,y,font,color,align='left',ls='0px',sh=null)=>{
    ctx.save();ctx.font=font;ctx.fillStyle=color;ctx.textAlign=align;ctx.textBaseline='alphabetic';LS(ls);
    if(sh){const q=SH[sh];ctx.shadowColor=q[0];ctx.shadowBlur=q[1]*K;ctx.shadowOffsetY=q[2]*K}
    ctx.fillText(s,x,y);ctx.restore()};
  const mw=(s,font,ls='0px')=>{ctx.save();ctx.font=font;LS(ls);const w=ctx.measureText(s).width;ctx.restore();return w};
  const fit=(s,font,maxW)=>{let o=s;while(mw(o,font)>maxW&&o.length>1)o=o.slice(0,-1);return o===s?s:o.trimEnd()+'…'};
  const card=(x,y,w,h)=>{ctx.fillStyle='rgba(255,255,255,.8)';ctx.strokeStyle='rgba(255,255,255,.9)';ctx.lineWidth=1.2;rrp(ctx,x,y,w,h,14);ctx.fill();ctx.stroke()};

  ctx.save();
  ctx.beginPath();
  ctx.moveTo(20,0);ctx.lineTo(970,0);ctx.lineTo(1000,30);ctx.lineTo(1000,400);ctx.arcTo(1000,420,980,420,20);ctx.lineTo(20,420);
  ctx.arcTo(0,420,0,400,20);ctx.lineTo(0,20);ctx.arcTo(0,0,20,0,20);ctx.closePath();
  for(let y=13;y<420;y+=26){ctx.moveTo(230+6.5,y);ctx.arc(230,y,6.5,0,Math.PI*2)}
  ctx.clip('evenodd');

  drawScene(ctx,1000,420,T,hash(S.ref),{u:1,sunX:700,sunY:160,sunR:340,clouds:6,base:400,cityH:.3,groundH:26,
    slabs:[[500,120,225],[610,130,150],[790,80,170]],towers:[[470,32,110],[900,28,200]],
    palms:[[580,424,.75,.38],[968,424,1.45,.4],[700,424,.55,.3]],veil:{x:230,y:58,w:770,h:290,a0:.4,a1:.1}});

  /* stub (left) */
  let g=ctx.createLinearGradient(0,0,230,420);g.addColorStop(0,T.h1);g.addColorStop(.55,T.h2);g.addColorStop(1,T.h3);
  ctx.fillStyle=g;ctx.fillRect(0,0,230,420);
  palm(ctx,168,430,.95,T.dk,.2);
  ctx.save();ctx.translate(26,212);ctx.rotate(-Math.PI/2);
  t('BOARDING PASS',0,7,`700 20px ${OS}`,'#fff','center','7px','dark');ctx.restore();
  ctx.fillStyle='#fff';rrp(ctx,62,24,144,144,14);ctx.fill();
  if(A.qr){ctx.imageSmoothingEnabled=false;ctx.drawImage(A.qr,70,32,128,128);ctx.imageSmoothingEnabled=true}
  else t('QR',134,104,`700 20px ${OS}`,'#222','center');
  t('SCAN AT THE GATE',134,186,`400 10px ${OS}`,'#fff','center','3px','dark');
  const sm=seatMapSize(S.seatInfo.layout);
  drawSeatMap(ctx,44,204,S,T);
  t('SEAT',218,212,`400 11px ${OS}`,'#fff','right','3px','dark');
  t(S.seat,218,248,`800 32px ${PO}`,'#fff','right','0px','dark');
  t('GATE',50,284,`400 11px ${OS}`,'#fff','left','3px','dark');
  t(String(S.gate),50,322,`800 38px ${PO}`,'#fff','left','0px','dark');
  t('CLASS',130,284,`400 11px ${OS}`,'#fff','left','3px','dark');
  t(fit(S.cl,`700 17px ${OS}`,88),130,312,`700 17px ${OS}`,'#fff','left','0px','dark');
  drawBarcode(ctx,50,340,164,26,S.h,'rgba(255,255,255,.92)');
  t(S.ref,132,390,`400 11px ${OS}`,'#fff','center','3px','dark');
  ctx.save();ctx.strokeStyle='rgba(255,255,255,.7)';ctx.lineWidth=1.4;ctx.setLineDash([3,5]);
  ctx.beginPath();ctx.moveTo(230,4);ctx.lineTo(230,416);ctx.stroke();ctx.restore();

  /* ribbon header */
  g=ctx.createLinearGradient(230,0,660,0);g.addColorStop(0,T.h1);g.addColorStop(.55,T.h2);g.addColorStop(1,T.h3);
  ctx.fillStyle=g;ctx.beginPath();ctx.moveTo(230,0);ctx.lineTo(660,0);ctx.lineTo(626,58);ctx.lineTo(230,58);ctx.closePath();ctx.fill();
  t('fly',254,44,`700 38px ${PO}`,'#fff','left','-1px','dark');
  const fw=mw('fly',`700 38px ${PO}`,'-1px');
  t('US',254+fw,44,`800 38px ${PO}`,'#fff','left','-1px','dark');
  const uw=mw('US',`800 38px ${PO}`,'-1px');
  star4(ctx,254+fw+uw+14,24,8,'#fff');
  t('Sunset service to Vice City',412,38,`italic 600 17px ${OS}`,'#fff','left','0px','dark');
  if(S.badge){
    ctx.save();ctx.font=`700 13px ${OS}`;LS('1.5px');
    const bw=ctx.measureText(S.badge).width+28,bx=944-bw;
    ctx.fillStyle=T.ac;rrp(ctx,bx,16,bw,26,13);ctx.fill();
    ctx.fillStyle='#fff';ctx.textBaseline='middle';ctx.textAlign='left';ctx.fillText(S.badge,bx+14,29.5);ctx.restore();
  }

  /* stacked route */
  t('DEPARTURE',264,80,`600 11px ${OS}`,T.ac,'left','4px');
  t('LSX',260,140,`800 76px ${PO}`,T.tx,'left','-2px','glow');
  t('LOS SANTOS',264,164,`700 20px ${OS}`,T.tx,'left','1px','glow');
  ctx.save();ctx.fillStyle=T.tx;
  for(let y=178;y<=190;y+=6){ctx.beginPath();ctx.arc(300,y,1.9,0,Math.PI*2);ctx.fill()}
  for(let y=212;y<=224;y+=6){ctx.beginPath();ctx.arc(300,y,1.9,0,Math.PI*2);ctx.fill()}
  ctx.restore();
  plane(ctx,300,201,.55,Math.PI/2,T.tx,1);
  const lines=[];if(S.depLine)lines.push(S.depLine);lines.push(S.conn?S.conn.toUpperCase():'NONSTOP');if(S.boardLine)lines.push(S.boardLine);
  lines.forEach((s,i)=>{
    const f=`700 13px ${OS}`,txt=fit(s,f,360),w=mw(txt,f,'2px')+26,cy=201-(lines.length-1)*15+i*30;
    ctx.fillStyle='rgba(255,255,255,.82)';rrp(ctx,326,cy-12,w,24,12);ctx.fill();
    ctx.strokeStyle=hexA(T.ac,.55);ctx.lineWidth=1;ctx.stroke();
    t(txt,339,cy+4.5,f,T.ac,'left','2px');
  });
  t('ARRIVAL',264,242,`600 11px ${OS}`,T.ac,'left','4px');
  t('VCI',260,306,`800 76px ${PO}`,T.tx,'left','-2px','glow');
  t('VICE CITY',264,328,`700 20px ${OS}`,T.tx,'left','1px','glow');

  /* cards (moved up so the connecting pill never touches them) */
  card(472,70,224,108);
  t('LANDS',490,92,`600 11px ${OS}`,T.ac,'left','4px');
  const dd=S.arrS.split(' · ')[0].split(' '),big=dd[0]+' '+dd[1];
  t(big,490,140,`800 44px ${PO}`,T.tx,'left','-1px');
  t(dd[2]+' · '+S.arrS.split(' · ')[1],490,168,`700 22px ${OS}`,T.tx,'left','1px');
  ctx.save();ctx.font=`700 12px ${OS}`;LS('2px');
  const cw=ctx.measureText(S.countdown).width+24;
  ctx.fillStyle='rgba(255,255,255,.88)';rrp(ctx,472,238,cw,26,13);ctx.fill();
  ctx.strokeStyle=T.ac;ctx.lineWidth=1.6;ctx.stroke();
  ctx.fillStyle=T.ac;ctx.textBaseline='middle';ctx.fillText(S.countdown,484,251.5);ctx.restore();

  card(712,70,256,108);
  t('YOUR SEAT',730,92,`600 11px ${OS}`,T.ac,'left','4px');
  t(S.seat,730,140,`800 44px ${PO}`,T.tx,'left','-1px');
  drawSeatMap(ctx,950-sm.w,98,S,T);
  t(fit(S.sinfo,`500 12px ${OS}`,224),730,166,`500 12px ${OS}`,T.tx,'left','0.5px');

  if(S.stamp){const k=Math.min(3,Math.ceil(K));ctx.drawImage(stampSprite(S,k),738,206,114,114)}

  /* info chips */
  const chips=[['PASSENGER',fit(S.name,`700 22px ${OS}`,200),262,236],['FLIGHT',S.flight,510,130],['CLASS',fit(S.cl,`700 20px ${OS}`,122),652,150],['PAX №',S.pax,814,146]];
  chips.forEach(([l,v,x,w])=>{
    ctx.fillStyle='rgba(255,255,255,.9)';rrp(ctx,x,338,w,56,12);ctx.fill();
    const ag=ctx.createLinearGradient(0,344,0,388);ag.addColorStop(0,T.ac);ag.addColorStop(1,T.h3);
    ctx.fillStyle=ag;rrp(ctx,x+8,347,4,38,2);ctx.fill();
    t(l,x+22,358,`400 10px ${OS}`,hexA(T.tx,.75),'left','3px');
    t(v.toUpperCase(),x+22,382,l==='CLASS'?`700 20px ${OS}`:`700 22px ${OS}`,T.tx);
  });

  t('Gate agents are not liable for launch-week sleep loss.',262,413,`italic 400 11px ${OS}`,'#fff','left','0px','dark');
  t('IDEA BY @VINEWOOD_MOTORS · UNOFFICIAL FAN ART',968,413,`400 9px ${OS}`,'rgba(255,255,255,.9)','right','2px','dark');
  ctx.restore();
}

/* ===== PORTRAIT PASS — tall phone-friendly layout, tears off at the bottom — 520 x 1100 units ===== */
function drawTicketTall(ctx,S,A){
  const T=S.T,K=Math.hypot(ctx.getTransform().a,ctx.getTransform().b)||1,W=520,H=1100,PERF=660;
  const LS=v=>{if('letterSpacing' in ctx)ctx.letterSpacing=v};
  const OS="Oswald,'Arial Narrow',Impact,sans-serif",PO="Poppins,Arial,sans-serif";
  const SH={dark:['rgba(40,10,60,.5)',3,1],glow:['rgba(255,255,255,.85)',6,0]};
  const t=(s,x,y,font,color,align='left',ls='0px',sh=null)=>{
    ctx.save();ctx.font=font;ctx.fillStyle=color;ctx.textAlign=align;ctx.textBaseline='alphabetic';LS(ls);
    if(sh){const q=SH[sh];ctx.shadowColor=q[0];ctx.shadowBlur=q[1]*K;ctx.shadowOffsetY=q[2]*K}
    ctx.fillText(s,x,y);ctx.restore()};
  const mw=(s,font,ls='0px')=>{ctx.save();ctx.font=font;LS(ls);const w=ctx.measureText(s).width;ctx.restore();return w};
  const fit=(s,font,maxW)=>{let o=s;while(mw(o,font)>maxW&&o.length>1)o=o.slice(0,-1);return o===s?s:o.trimEnd()+'…'};
  const chip=(x,y,w,h,l,v,vf)=>{
    ctx.fillStyle='rgba(255,255,255,.92)';ctx.strokeStyle=hexA(T.tx,.14);ctx.lineWidth=1;rrp(ctx,x,y,w,h,14);ctx.fill();ctx.stroke();
    const ag=ctx.createLinearGradient(0,y+8,0,y+h-8);ag.addColorStop(0,T.ac);ag.addColorStop(1,T.h3);
    ctx.fillStyle=ag;rrp(ctx,x+9,y+10,4,h-20,2);ctx.fill();
    t(l,x+26,y+24,`400 10px ${OS}`,hexA(T.tx,.75),'left','3px');
    t(v.toUpperCase(),x+26,y+h-14,vf,T.tx);
  };

  ctx.save();
  ctx.beginPath();rrPath(ctx,0,0,W,H,26);
  ctx.moveTo(14,PERF);ctx.arc(0,PERF,14,0,Math.PI*2);ctx.moveTo(W+14,PERF);ctx.arc(W,PERF,14,0,Math.PI*2);
  ctx.clip('evenodd');

  drawScene(ctx,W,H,T,hash(S.ref),{u:.6,sunX:370,sunY:215,sunR:330,clouds:6,base:372,cityH:.11,groundH:50,
    slabs:[[26,120,250],[170,100,290],[340,130,240]],towers:[[24,26,140],[470,24,180]],
    sign:{x:70,y:112,w:380,h:102},
    palms:[[42,384,1.25,.45],[486,384,1.45,.45],[262,384,.6,.35]]});

  /* header ribbon */
  let g=ctx.createLinearGradient(0,0,W,0);g.addColorStop(0,T.h1);g.addColorStop(.55,T.h2);g.addColorStop(1,T.h3);
  ctx.fillStyle=g;ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(W,0);ctx.lineTo(W,46);ctx.lineTo(0,68);ctx.closePath();ctx.fill();
  t('fly',24,44,`700 34px ${PO}`,'#fff','left','-1px','dark');
  const fw=mw('fly',`700 34px ${PO}`,'-1px');
  t('US',24+fw,44,`800 34px ${PO}`,'#fff','left','-1px','dark');
  star4(ctx,24+fw+mw('US',`800 34px ${PO}`,'-1px')+14,24,7,'#fff');
  if(S.badge){
    ctx.save();ctx.font=`700 12px ${OS}`;LS('1.5px');
    const bw=ctx.measureText(S.badge).width+26,bx=W-24-bw;
    ctx.fillStyle=T.ac;rrp(ctx,bx,14,bw,24,12);ctx.fill();
    ctx.fillStyle='#fff';ctx.textBaseline='middle';ctx.textAlign='left';ctx.fillText(S.badge,bx+13,26.5);ctx.restore();
  }
  t('Sunset service to Vice City',24,96,`italic 600 15px ${OS}`,'#fff','left','0px','dark');
  t('BOARDING PASS',W-24,96,`700 13px ${OS}`,'#fff','right','6px','dark');

  /* frosted info panel */
  ctx.fillStyle='rgba(255,255,255,.88)';rrp(ctx,12,368,W-24,662,24);ctx.fill();

  /* route */
  t('DEPARTURE',36,402,`600 11px ${OS}`,T.ac,'left','4px');
  t('ARRIVAL',W-36,402,`600 11px ${OS}`,T.ac,'right','4px');
  const RF=`800 86px ${PO}`;
  t('LSX',34,482,RF,T.tx,'left','-2px');
  t('VCI',W-34,482,RF,T.tx,'right','-2px');
  const lw=mw('LSX',RF,'-2px'),vw=mw('VCI',RF,'-2px'),x0=34+lw+16,x1=W-34-vw-16,mid=(x0+x1)/2,ly=446;
  ctx.save();ctx.fillStyle=T.tx;
  for(let x=x0;x<x1;x+=9){if(Math.abs(x-mid)>20){ctx.beginPath();ctx.arc(x,ly,2,0,Math.PI*2);ctx.fill()}}
  ctx.restore();
  plane(ctx,mid,ly,.55,0,T.tx,1);
  t('LOS SANTOS',38,510,`700 20px ${OS}`,T.tx,'left','1px');
  t('VICE CITY',W-38,510,`700 20px ${OS}`,T.tx,'right','1px');
  const lines=[];if(S.depLine)lines.push(S.depLine);lines.push(S.conn?S.conn.toUpperCase():'NONSTOP');if(S.boardLine)lines.push(S.boardLine);
  lines.forEach((s,i)=>{
    const f=`700 13px ${OS}`,txt=fit(s,f,420),w=mw(txt,f,'2px')+28,cy=540+i*28;
    ctx.fillStyle='rgba(255,255,255,.95)';rrp(ctx,W/2-w/2,cy-12,w,24,12);ctx.fill();
    ctx.strokeStyle=hexA(T.ac,.55);ctx.lineWidth=1;ctx.stroke();
    t(txt,W/2-w/2+14,cy+4.5,f,T.ac,'left','2px');
  });
  t('LANDS',36,606,`600 11px ${OS}`,T.ac,'left','4px');
  t(S.arrS,36,636,`700 26px ${OS}`,T.tx,'left','1px');
  ctx.save();ctx.font=`700 13px ${OS}`;LS('2px');
  const cw=ctx.measureText(S.countdown).width+26;
  ctx.fillStyle='rgba(255,255,255,.95)';rrp(ctx,W-36-cw,614,cw,28,14);ctx.fill();
  ctx.strokeStyle=T.ac;ctx.lineWidth=1.6;ctx.stroke();
  ctx.fillStyle=T.ac;ctx.textBaseline='middle';ctx.fillText(S.countdown,W-36-cw+13,628.5);ctx.restore();

  /* perforation */
  ctx.save();ctx.strokeStyle=hexA(T.tx,.4);ctx.lineWidth=2;ctx.setLineDash([7,7]);
  ctx.beginPath();ctx.moveTo(26,PERF);ctx.lineTo(W-26,PERF);ctx.stroke();ctx.restore();

  /* stub details */
  chip(24,682,W-48,66,'PASSENGER',fit(S.name,`700 28px ${OS}`,400),`700 28px ${OS}`);
  chip(24,760,148,66,'FLIGHT',S.flight,`700 26px ${OS}`);
  chip(184,760,172,66,'CLASS',fit(S.cl,`700 24px ${OS}`,130),`700 24px ${OS}`);
  chip(368,760,128,66,'GATE',String(S.gate),`700 26px ${OS}`);

  ctx.fillStyle='#fff';ctx.strokeStyle=hexA(T.tx,.18);ctx.lineWidth=1;rrp(ctx,24,840,150,150,14);ctx.fill();ctx.stroke();
  if(A.qr){ctx.imageSmoothingEnabled=false;ctx.drawImage(A.qr,32,848,134,134);ctx.imageSmoothingEnabled=true}
  else t('QR',99,925,`700 22px ${OS}`,'#222','center');

  ctx.fillStyle='rgba(255,255,255,.92)';ctx.strokeStyle=hexA(T.tx,.14);rrp(ctx,190,840,306,150,14);ctx.fill();ctx.stroke();
  t('YOUR SEAT',210,868,`600 11px ${OS}`,T.ac,'left','4px');
  t(S.seat,208,930,`800 58px ${PO}`,T.tx,'left','-1px');
  const sm=seatMapSize(S.seatInfo.layout);
  drawSeatMap(ctx,474-sm.w,880,S,T);
  t(fit(S.sinfo,`500 13px ${OS}`,270),210,958,`500 13px ${OS}`,T.tx,'left','0.5px');
  t('PAX № '+S.pax,210,980,`700 15px ${OS}`,T.tx,'left','2px');

  drawBarcode(ctx,24,1000,330,20,S.h,T.tx);
  t(S.ref,W-24,1016,`400 12px ${OS}`,T.tx,'right','3px');

  if(S.stamp){const k=Math.min(3,Math.ceil(K));ctx.drawImage(stampSprite(S,k),372,262,118,118)}

  t('Gate agents are not liable for launch-week sleep loss.',W/2,1058,`italic 400 11px ${OS}`,'#fff','center','0px','dark');
  t('IDEA BY @VINEWOOD_MOTORS · UNOFFICIAL FAN ART · NOT AFFILIATED',W/2,1076,`400 9px ${OS}`,'rgba(255,255,255,.92)','center','2px','dark');
  ctx.restore();
}

/* ===== SOCIAL CARD — square layout for posts and profile images, tears off at the bottom — 640 x 640 units ===== */
function drawTicketSquare(ctx,S,A){
  const T=S.T,K=Math.hypot(ctx.getTransform().a,ctx.getTransform().b)||1,W=640,H=640,PERF=500;
  const LS=v=>{if('letterSpacing' in ctx)ctx.letterSpacing=v};
  const OS="Oswald,'Arial Narrow',Impact,sans-serif",PO="Poppins,Arial,sans-serif";
  const SH={dark:['rgba(40,10,60,.5)',3,1],glow:['rgba(255,255,255,.85)',6,0]};
  const t=(s,x,y,font,color,align='left',ls='0px',sh=null)=>{
    ctx.save();ctx.font=font;ctx.fillStyle=color;ctx.textAlign=align;ctx.textBaseline='alphabetic';LS(ls);
    if(sh){const q=SH[sh];ctx.shadowColor=q[0];ctx.shadowBlur=q[1]*K;ctx.shadowOffsetY=q[2]*K}
    ctx.fillText(s,x,y);ctx.restore()};
  const mw=(s,font,ls='0px')=>{ctx.save();ctx.font=font;LS(ls);const w=ctx.measureText(s).width;ctx.restore();return w};
  const fit=(s,font,maxW)=>{let o=s;while(mw(o,font)>maxW&&o.length>1)o=o.slice(0,-1);return o===s?s:o.trimEnd()+'…'};
  const chip=(x,y,w,h,l,v,vf)=>{
    ctx.fillStyle='rgba(255,255,255,.92)';ctx.strokeStyle=hexA(T.tx,.14);ctx.lineWidth=1;rrp(ctx,x,y,w,h,14);ctx.fill();ctx.stroke();
    const ag=ctx.createLinearGradient(0,y+8,0,y+h-8);ag.addColorStop(0,T.ac);ag.addColorStop(1,T.h3);
    ctx.fillStyle=ag;rrp(ctx,x+9,y+10,4,h-20,2);ctx.fill();
    t(l,x+26,y+22,`400 10px ${OS}`,hexA(T.tx,.75),'left','3px');
    t(v.toUpperCase(),x+26,y+h-14,vf,T.tx);
  };

  ctx.save();
  ctx.beginPath();rrPath(ctx,0,0,W,H,30);
  ctx.moveTo(14,PERF);ctx.arc(0,PERF,14,0,Math.PI*2);ctx.moveTo(W+14,PERF);ctx.arc(W,PERF,14,0,Math.PI*2);
  ctx.clip('evenodd');

  drawScene(ctx,W,H,T,hash(S.ref),{u:.6,sunX:320,sunY:232,sunR:310,clouds:6,base:452,cityH:.1,groundH:30,
    slabs:[[30,120,310],[176,100,340],[470,130,300]],towers:[[44,26,210],[570,24,240]],
    palms:[[48,480,1.1,.45],[596,480,1.25,.45],[322,480,.62,.35]]});

  /* header */
  t('fly',32,52,`700 32px ${PO}`,'#fff','left','-1px','dark');
  const fw=mw('fly',`700 32px ${PO}`,'-1px');
  t('US',32+fw,52,`800 32px ${PO}`,'#fff','left','-1px','dark');
  star4(ctx,32+fw+mw('US',`800 32px ${PO}`,'-1px')+13,32,7,'#fff');
  if(S.badge){
    ctx.save();ctx.font=`700 12px ${OS}`;LS('1.5px');
    const bw=ctx.measureText(S.badge).width+26,bx=W-32-bw;
    ctx.fillStyle=T.ac;rrp(ctx,bx,28,bw,24,12);ctx.fill();
    ctx.fillStyle='#fff';ctx.textBaseline='middle';ctx.textAlign='left';ctx.fillText(S.badge,bx+13,40.5);ctx.restore();
    t('BOARDING PASS',W-32,78,`700 12px ${OS}`,'#fff','right','6px','dark');
  }else t('BOARDING PASS',W-32,52,`700 14px ${OS}`,'#fff','right','6px','dark');

  /* hero route */
  t('DEPARTURE',32,128,`600 11px ${OS}`,T.ac,'left','4px','glow');
  t('ARRIVAL',W-32,128,`600 11px ${OS}`,T.ac,'right','4px','glow');
  const RF=`800 112px ${PO}`;
  t('LSX',28,258,RF,T.tx,'left','-3px','glow');
  t('VCI',W-26,258,RF,T.tx,'right','-3px','glow');
  const lw=mw('LSX',RF,'-3px'),vw=mw('VCI',RF,'-3px'),x0=28+lw+14,x1=W-26-vw-14,mid=(x0+x1)/2,ly=218;
  ctx.save();ctx.fillStyle=T.tx;
  for(let x=x0;x<x1;x+=9){if(Math.abs(x-mid)>20){ctx.beginPath();ctx.arc(x,ly,2,0,Math.PI*2);ctx.fill()}}
  ctx.restore();
  plane(ctx,mid,ly,.6,0,T.tx,1);
  t('LOS SANTOS',34,288,`700 20px ${OS}`,T.tx,'left','1px','glow');
  t('VICE CITY',W-32,288,`700 20px ${OS}`,T.tx,'right','1px','glow');

  if(S.stamp){const k=Math.min(3,Math.ceil(K));ctx.drawImage(stampSprite(S,k),270,66,100,100)}

  /* landing + countdown */
  const df=`700 24px ${OS}`,dw=mw(S.arrS,df,'1px')+44;
  ctx.fillStyle='rgba(255,255,255,.9)';ctx.strokeStyle=hexA(T.ac,.4);ctx.lineWidth=1.2;rrp(ctx,32,304,dw,46,23);ctx.fill();ctx.stroke();
  t('LANDS',52,321,`600 10px ${OS}`,T.ac,'left','4px');
  t(S.arrS,52,343,df,T.tx,'left','1px');
  ctx.save();ctx.font=`700 16px ${OS}`;LS('2px');
  const cw=ctx.measureText(S.countdown).width+34,cx0=W-32-cw;
  ctx.fillStyle='rgba(255,255,255,.9)';rrp(ctx,cx0,304,cw,46,23);ctx.fill();
  ctx.strokeStyle=T.ac;ctx.lineWidth=1.6;ctx.stroke();
  ctx.fillStyle=T.ac;ctx.textBaseline='middle';ctx.fillText(S.countdown,cx0+17,327.5);ctx.restore();

  const lines=[];if(S.depLine)lines.push(S.depLine);lines.push(S.conn?S.conn.toUpperCase():'NONSTOP');if(S.boardLine)lines.push(S.boardLine);
  lines.forEach((s,i)=>{
    const f=`700 13px ${OS}`,txt=fit(s,f,520),w=mw(txt,f,'2px')+28,cy=370+i*22;
    ctx.fillStyle='rgba(255,255,255,.92)';rrp(ctx,W/2-w/2,cy-10,w,20,10);ctx.fill();
    ctx.strokeStyle=hexA(T.ac,.55);ctx.lineWidth=1;ctx.stroke();
    t(txt,W/2-w/2+14,cy+4.5,f,T.ac,'left','2px');
  });

  /* chips */
  chip(32,426,262,64,'PASSENGER',fit(S.name,`700 26px ${OS}`,220),`700 26px ${OS}`);
  chip(306,426,130,64,'FLIGHT',S.flight,`700 24px ${OS}`);
  chip(448,426,160,64,'CLASS',fit(S.cl,`700 22px ${OS}`,112),`700 22px ${OS}`);

  /* stub */
  ctx.fillStyle='rgba(255,255,255,.9)';ctx.fillRect(0,PERF,W,H-PERF);
  ctx.save();ctx.strokeStyle=hexA(T.tx,.4);ctx.lineWidth=2;ctx.setLineDash([7,7]);
  ctx.beginPath();ctx.moveTo(26,PERF);ctx.lineTo(W-26,PERF);ctx.stroke();ctx.restore();
  ctx.fillStyle='#fff';ctx.strokeStyle=hexA(T.tx,.18);ctx.lineWidth=1;rrp(ctx,32,514,108,108,14);ctx.fill();ctx.stroke();
  if(A.qr){ctx.imageSmoothingEnabled=false;ctx.drawImage(A.qr,40,522,92,92);ctx.imageSmoothingEnabled=true}
  else t('QR',86,574,`700 22px ${OS}`,'#222','center');
  t('SEAT',160,534,`600 11px ${OS}`,T.ac,'left','4px');
  t(S.seat,158,578,`800 44px ${PO}`,T.tx,'left','-1px');
  t('GATE',286,534,`600 11px ${OS}`,T.ac,'left','4px');
  t(String(S.gate),284,578,`800 44px ${PO}`,T.tx,'left','-1px');
  drawSeatMap(ctx,160,584,S,T);
  t(fit(S.sinfo,`500 12px ${OS}`,330),268,612,`500 12px ${OS}`,T.tx,'left','0.5px');
  drawBarcode(ctx,396,518,212,36,S.h,T.tx);
  t(S.ref,W-32,574,`400 11px ${OS}`,T.tx,'right','3px');
  t('PAX № '+S.pax,W-32,596,`700 14px ${OS}`,T.tx,'right','2px');
  t('IDEA BY @VINEWOOD_MOTORS · UNOFFICIAL FAN ART · NOT AFFILIATED',W/2,634,`400 8.5px ${OS}`,hexA(T.tx,.7),'center','2px');
  ctx.restore();
}

/* ===== ORIGINAL layout — by Vinewood Motors (@Vinewood_motors): header band, big LSX -> VCI, white passenger bar, stub on the right — 1000 x 410 units ===== */
function drawTicketOriginal(ctx,S,A){
  const T=S.T,K=Math.hypot(ctx.getTransform().a,ctx.getTransform().b)||1;
  const LS=v=>{if('letterSpacing' in ctx)ctx.letterSpacing=v};
  const OS="Oswald,'Arial Narrow',Impact,sans-serif",PO="Poppins,Arial,sans-serif";
  const text=(s,x,top,lh,font,color,align='left',shadow=false)=>{
    ctx.save();ctx.font=font;ctx.fillStyle=color;ctx.textAlign=align;ctx.textBaseline='middle';
    if(shadow){ctx.shadowColor='rgba(40,10,60,.45)';ctx.shadowBlur=3*K;ctx.shadowOffsetY=K}
    ctx.fillText(s,x,top+lh/2);ctx.restore()};
  const mw=(s,font,ls='0px')=>{ctx.save();ctx.font=font;LS(ls);const w=ctx.measureText(s).width;ctx.restore();return w};
  const fitText=(s,font,maxW)=>{let o=s;while(mw(o,font)>maxW&&o.length>1)o=o.slice(0,-1);return o===s?s:o.trimEnd()+'…'};
  const logo=(x,top,size)=>{
    const f1=`700 ${size}px ${PO}`,f2=`800 ${size}px ${PO}`,fw=mw('fly',f1,'-1px'),uw=mw('US',f2,'-1px');
    ctx.save();LS('-1px');
    ctx.shadowColor='rgba(40,10,60,.45)';ctx.shadowBlur=3*K;ctx.shadowOffsetY=K;
    ctx.textBaseline='middle';ctx.textAlign='left';ctx.fillStyle='#fff';
    ctx.font=f1;ctx.fillText('fly',x,top+size/2);ctx.font=f2;ctx.fillText('US',x+fw,top+size/2);ctx.restore();
    star4(ctx,x+fw+uw+size*.3,top+size*.3,size*.24,'#fff');
  };

  ctx.save();rrp(ctx,0,0,1000,410,6);ctx.clip();
  ctx.fillStyle=T.bd;ctx.fillRect(0,0,1000,410);
  ctx.save();ctx.translate(7,7);ctx.beginPath();ctx.rect(0,0,986,396);ctx.clip();
  drawScene(ctx,986,396,T,hash(S.ref),{u:1,sunX:700,sunY:150,sunR:300,clouds:5,base:396,cityH:.3,groundH:31,
    slabs:[[250,145,175],[330,140,95],[395,75,160],[520,120,190],[640,60,190],[720,70,135]],
    towers:[[180,40,96],[640,42,81],[800,32,156]],
    palms:[[60,330,1.15,.4],[570,190,.7,.4],[930,396,1.4,.4]],veil:{x:0,y:70,w:690,h:295,a0:.38,a1:.1}});
  ctx.restore();

  let g=ctx.createLinearGradient(7,0,670,0);
  g.addColorStop(0,T.h1);g.addColorStop(.55,T.h2);g.addColorStop(1,T.h3);
  const hdPath=()=>{ctx.beginPath();ctx.moveTo(7,7);ctx.lineTo(670,7);ctx.lineTo(670,54);ctx.arc(642,54,28,0,Math.PI/2);ctx.lineTo(7,82);ctx.closePath()};
  const stPath=()=>{ctx.beginPath();ctx.moveTo(720,7);ctx.lineTo(993,7);ctx.lineTo(993,45);ctx.arc(963,45,30,0,Math.PI/2);ctx.lineTo(720,75);ctx.closePath()};
  ctx.fillStyle=g;hdPath();ctx.fill();
  ctx.fillStyle='rgba(255,230,240,.35)';ctx.fillRect(720,75,273,328);
  g=ctx.createLinearGradient(720,0,993,0);g.addColorStop(0,T.pb1);g.addColorStop(.4,T.pb1);g.addColorStop(1,T.pb2);
  ctx.fillStyle=g;stPath();ctx.fill();
  ctx.save();hdPath();ctx.clip();palm(ctx,498,150,.6,T.dk,.35);palm(ctx,585,128,.4,T.dk,.35);ctx.restore();
  ctx.save();stPath();ctx.clip();palm(ctx,780,140,.45,T.dk,.35);ctx.restore();
  plane(ctx,676,60,1,-22*Math.PI/180,T.dk,.4);

  ctx.save();ctx.strokeStyle='#fff';ctx.lineWidth=3;ctx.setLineDash([8,5]);
  ctx.beginPath();ctx.moveTo(698.5,7);ctx.lineTo(698.5,403);ctx.stroke();ctx.restore();

  logo(40,18,48);
  ctx.save();ctx.translate(236+100,26+21);ctx.transform(1,0,Math.tan(-6*Math.PI/180),1,0,0);
  text('Next stop: Vice City',-100,-21,42,`italic 700 28px ${OS}`,'#fff','left',true);ctx.restore();
  text('BOARDING PASS',982,20,50,`700 34px ${OS}`,'#fff','right',true);

  text(S.conn.toUpperCase(),67,109,24,`600 16px ${OS}`,T.tx);
  text('PASSENGER #'+S.pax,663,99,37,`700 25px ${OS}`,T.ac,'right');
  if(S.badge){
    ctx.save();ctx.font=`700 14px ${OS}`;LS('1px');
    const bw=ctx.measureText(S.badge).width+24,bx=663-bw;
    ctx.fillStyle=T.ac;rrp(ctx,bx,132,bw,22,11);ctx.fill();
    ctx.fillStyle='#fff';ctx.textAlign='left';ctx.textBaseline='middle';ctx.fillText(S.badge,bx+12,143);ctx.restore();
  }
  const sm=seatMapSize(S.seatInfo.layout);
  drawSeatMap(ctx,663-sm.w,160,S,T);
  if(S.stamp){const k=Math.min(3,Math.ceil(K));ctx.drawImage(stampSprite(S,k),570,210,96,96)}

  text('DEPARTURE',67,140,31,`600 21px ${OS}`,T.tx);
  text('ARRIVAL',390,140,31,`600 21px ${OS}`,T.tx);
  ctx.save();LS('-3px');
  text('LSX',67,164,80,`800 80px ${PO}`,T.tx);
  text('VCI',390,164,80,`800 80px ${PO}`,T.tx);
  ctx.restore();
  ctx.save();ctx.strokeStyle=T.tx;ctx.lineWidth=3;
  ctx.beginPath();ctx.moveTo(236,198.5);ctx.lineTo(288,198.5);ctx.moveTo(324,198.5);ctx.lineTo(376,198.5);ctx.stroke();ctx.restore();
  plane(ctx,306,198.5,.62,0,T.tx,1);
  text('LOS SANTOS',67,245,40,`700 27px ${OS}`,T.tx);
  text('VICE CITY',390,245,40,`700 27px ${OS}`,T.tx);
  if(S.depLine)text(S.depLine.replace('DEPARTS ',''),67,278,28,`600 19px ${OS}`,T.tx);
  text(S.arrS,390,278,28,`600 19px ${OS}`,T.tx);

  ctx.fillStyle='rgba(255,255,255,.9)';ctx.fillRect(50,314,552,54);
  const long=S.cl.length>8,cf=long?`700 19px ${OS}`:`700 25px ${OS}`,cLH=long?27:27.5;
  [[10,'PASSENGER',fitText(S.name,`700 25px ${OS}`,200),`700 25px ${OS}`],
   [225,'FLIGHT',S.flight,`700 25px ${OS}`],[310,'SEAT',S.seat,`700 25px ${OS}`],
   [375,'GATE',String(S.gate),`700 25px ${OS}`],[430,'CLASS',S.cl,cf]].forEach(([x,l,v,f])=>{
     text(l,50+x,316,19,`400 13px ${OS}`,T.tx);
     text(v.toUpperCase(),50+x,335,long&&l==='CLASS'?cLH:27.5,f,T.tx)});
  ctx.fillStyle=T.tx;[215,300,365,420].forEach(x=>ctx.fillRect(50+x,322,1,38));
  ctx.fillStyle='#fff';ctx.fillRect(611,314,54,54);
  if(A.qr){ctx.imageSmoothingEnabled=false;ctx.drawImage(A.qr,614,317,48,48);ctx.imageSmoothingEnabled=true}

  ctx.save();ctx.translate(34,322);ctx.rotate(-Math.PI/2);
  text(S.ref+' · LSX-VCI',0,0,18,`400 12px ${OS}`,T.tx);ctx.restore();
  drawBarcodeV(ctx,12,107,24,238,S.h,T.tx);
  text('FlyUS will not be held responsible for any delays (even 13-year ones).',50,372,19,`italic 400 13px ${OS}`,'#fff','left',true);
  if(S.boardLine){ctx.save();LS('.5px');text(S.boardLine,663,373,19,`700 14px ${OS}`,'#fff','right',true);ctx.restore()}

  ctx.save();LS('-2px');
  text('LSX',735,86,48,`800 48px ${PO}`,T.tx);
  text('VCI',983,86,48,`800 48px ${PO}`,T.tx,'right');ctx.restore();
  plane(ctx,845,115,.5,0,T.tx,1);
  text('LOS SANTOS',735,140,19,`700 19px ${OS}`,T.tx);
  text('VICE CITY',983,140,19,`700 19px ${OS}`,T.tx,'right');
  text(S.arrS,983,163,13,`600 13px ${OS}`,T.tx,'right');

  ctx.fillStyle='rgba(255,255,255,.92)';ctx.fillRect(735,186,244,128);
  ctx.save();ctx.beginPath();ctx.rect(735,186,244,128);ctx.clip();
  text('PASSENGER',747,192,14,`400 12px ${OS}`,T.tx);
  text(fitText(S.name,`700 26px ${OS}`,220),747,206,28,`700 26px ${OS}`,T.tx);
  text('REF: '+S.ref,747,234,14,`400 13px ${OS}`,T.tx);
  let cx=747;
  [['SEAT',S.seat,`700 25px ${OS}`,28],['GATE',String(S.gate),`700 25px ${OS}`,28],['CLASS',S.cl,long?`700 19px ${OS}`:`700 25px ${OS}`,long?27:28]]
   .forEach(([l,v,f,lh])=>{text(l,cx,252,14,`400 12px ${OS}`,T.tx);text(v,cx,266,lh,f,T.tx);cx+=Math.max(mw(l,`400 12px ${OS}`),mw(v,f))+18});
  text(fitText(S.sinfo,`400 12px ${OS}`,220),747,297,14,`400 12px ${OS}`,T.tx);
  ctx.restore();
  drawBarcode(ctx,735,322,244,34,S.h+1,T.tx);
  text(`${S.ref} · ${S.flight} · LSX-VCI`,857,358,14,`400 12px ${OS}`,T.tx,'center');
  logo(900,378,24);
  ctx.restore();
}


