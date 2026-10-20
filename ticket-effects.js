(() => {
  const stage=$('stage'),ticket=$('ticket'),reduce=matchMedia('(prefers-reduced-motion: reduce)'),fine=matchMedia('(hover: hover) and (pointer: fine)');
  const stampPositions={remix:[738,206,114],tall:[372,262,118],square:[270,66,100],original:[570,210,96],ocean:[596,191,114],neon:[694,237,66]};
  let motion=null,stampVersion=0,tiltFrame=0,pointer=null,bounds=null;

  function resetTilt(){if(tiltFrame)cancelAnimationFrame(tiltFrame);tiltFrame=0;pointer=null;bounds=null;stage.style.transform='';}
  function canTilt(){return $('tiltPreview').checked&&!reduce.matches&&fine.matches&&!exporting;}
  stage.addEventListener('pointerenter',event=>{if(event.pointerType==='mouse'&&canTilt())bounds=stage.getBoundingClientRect();});
  stage.addEventListener('pointermove',event=>{
    if(event.pointerType!=='mouse'||!canTilt()){resetTilt();return;}
    pointer={x:event.clientX,y:event.clientY};if(!bounds)bounds=stage.getBoundingClientRect();if(tiltFrame)return;
    tiltFrame=requestAnimationFrame(()=>{tiltFrame=0;if(!pointer||!bounds||!canTilt())return;const x=Math.max(-1,Math.min(1,(pointer.x-bounds.left)/bounds.width*2-1)),y=Math.max(-1,Math.min(1,(pointer.y-bounds.top)/bounds.height*2-1));stage.style.transform=`perspective(1100px) rotateX(${-y*2.2}deg) rotateY(${x*3}deg)`;});
  });
  stage.addEventListener('pointerleave',resetTilt);stage.addEventListener('pointercancel',resetTilt);$('tiltPreview').addEventListener('change',resetTilt);

  function clearStamp(paint=true){
    const old=motion;motion=null;stampVersion++;
    if(old){if(old.animation)old.animation.cancel();if(old.canvas)old.canvas.remove();}
    if(paint&&STATE)redraw().catch(()=>{});
  }
  for(const [key,D] of Object.entries(DESIGNS)){
    const render=D.draw;
    D.draw=function(ctx,S,A){const hide=ctx.canvas===ticket&&motion&&motion.key===key&&motion.state===S&&S.stamp;return render(ctx,hide?{...S,stamp:false}:S,A);};
  }
  const previousRedraw=redraw;
  redraw=async function(){
    if(motion&&(motion.key!==$('design').value||motion.state!==STATE||!STATE||!STATE.stamp))clearStamp(false);
    const result=await previousRedraw();bounds=null;return result;
  };

  function staleStampExports(){
    if($('outwrap').style.display==='block'){$('outwrap').classList.add('stale');$('outmsg').textContent='Previous export — download again for the updated stamp.';}
    const result=$('zipResult'),link=result&&result.querySelector('a');
    if(link)result.replaceChildren(document.createTextNode('Previous ZIP — download again to update the stamp. '),link);
  }
  async function animateArrival(){
    clearStamp(false);
    if(!STATE||!STATE.stamp)return;
    const key=$('design').value,D=curDesign(),position=stampPositions[key];
    if(!$('animateStamp').checked||reduce.matches||!position){await redraw();return;}
    const record={key,state:STATE,version:++stampVersion,canvas:null,animation:null};motion=record;
    await redraw();if(motion!==record||!STATE.stamp)return;
    const [x,y,size]=position,sprite=stampSprite(record.state,3),overlay=document.createElement('canvas');
    overlay.width=sprite.width;overlay.height=sprite.height;overlay.getContext('2d').drawImage(sprite,0,0);overlay.className='preview-stamp';overlay.setAttribute('aria-hidden','true');
    Object.assign(overlay.style,{left:(x/D.W*100)+'%',top:(y/D.H*100)+'%',width:(size/D.W*100)+'%',height:(size/D.H*100)+'%'});
    record.canvas=overlay;stage.append(overlay);
    if(typeof overlay.animate!=='function'){clearStamp();return;}
    record.animation=overlay.animate([
      {transform:'translate(10%,-55%) scale(1.85) rotate(7deg)',opacity:0,offset:0},
      {transform:'translate(4%,-20%) scale(1.35) rotate(3deg)',opacity:1,offset:.38},
      {transform:'translate(0,0) scale(.94) rotate(-1deg)',opacity:1,offset:.68},
      {transform:'translate(0,0) scale(1.035) rotate(.5deg)',opacity:1,offset:.82},
      {transform:'translate(0,0) scale(1) rotate(0deg)',opacity:1,offset:1}
    ],{duration:560,easing:'cubic-bezier(.2,.7,.25,1)',fill:'forwards'});
    record.animation.finished.then(()=>{if(motion===record)clearStamp();}).catch(()=>{});
  }
  $('stampOn').addEventListener('change',event=>{
    event.stopImmediatePropagation();if(!STATE)return;
    clearStamp(false);STATE.stamp=$('stampOn').checked;staleStampExports();
    if(STATE.stamp)animateArrival().catch(error=>{clearStamp();$('loading').textContent='Stamp animation failed: '+(error.message||error);});
    else redraw().catch(()=>{});
  },true);
  $('animateStamp').addEventListener('change',()=>{if(!$('animateStamp').checked&&motion)clearStamp();});
  document.addEventListener('click',event=>{
    const button=event.target.closest&&event.target.closest('button');
    if(button&&['dl','dlSelected','wp','printActive'].includes(button.id)){resetTilt();if(motion)clearStamp();}
  },true);

  const night=document.createElement('canvas');night.id='landscapeNight';night.className='night-scene';night.setAttribute('aria-hidden','true');$('landscape').after(night);
  function drawNight(){
    const w=innerWidth,h=innerHeight,d=Math.min(devicePixelRatio||1,1.5);night.width=w*d;night.height=h*d;
    const ctx=night.getContext('2d');ctx.scale(d,d);const random=rng(42);
    let gradient=ctx.createLinearGradient(0,0,0,h);gradient.addColorStop(0,'#080e24');gradient.addColorStop(.5,'#292346');gradient.addColorStop(.7,'#64405e');gradient.addColorStop(1,'#0b1631');ctx.fillStyle=gradient;ctx.fillRect(0,0,w,h);
    const mx=w*.8,my=h*.35,mr=Math.min(w,h)*.095;
    for(let i=0;i<95;i++){const x=random()*w,y=random()*h*.64;if(Math.hypot(x-mx,y-my)<mr*1.2)continue;ctx.globalAlpha=.35+random()*.55;ctx.fillStyle='#fff2e3';ctx.beginPath();ctx.arc(x,y,.45+random()*1.15,0,Math.PI*2);ctx.fill();}
    ctx.globalAlpha=1;gradient=ctx.createRadialGradient(mx,my,0,mx,my,mr*3.4);gradient.addColorStop(0,'#fff0ca66');gradient.addColorStop(1,'#fff0ca00');ctx.fillStyle=gradient;ctx.fillRect(0,0,w,h);
    ctx.fillStyle='#fff0d7';ctx.beginPath();ctx.arc(mx,my,mr,0,Math.PI*2);ctx.fill();
    ctx.fillStyle='#0e1a34';ctx.fillRect(0,h*.7,w,h*.3);
    for(let i=0;i<35;i++){ctx.strokeStyle=`rgba(222,191,225,${.11*(1-i/35)})`;ctx.beginPath();ctx.moveTo(0,h*.71+i*h*.009);ctx.lineTo(w,h*.71+i*h*.009);ctx.stroke();}
    ctx.fillStyle='#f2dfc5';for(let i=0;i<14;i++){const rw=mr*(1.6-i*.09);ctx.globalAlpha=.12*(1-i/14);ctx.fillRect(mx-rw/2,h*.715+i*h*.009,rw,1.4);}ctx.globalAlpha=1;
    for(let bx=0;bx<w;bx+=30){const bh=10+random()*h*.06;ctx.fillStyle='#14132a';ctx.fillRect(bx,h*.7-bh,23,bh);if(bh>20){ctx.fillStyle='#dfadbf88';ctx.fillRect(bx+6,h*.7-bh+8,3,3);}}
    palm(ctx,w*.04,h*1.05,h/340,'#080c20',.96);palm(ctx,w*.97,h*1.04,h/290,'#080c20',.96);palm(ctx,w*.9,h*1.05,h/410,'#080c20',.8);
  }
  function setScene(isNight){document.body.classList.toggle('night-mode',isNight);$('sceneSunset').setAttribute('aria-pressed',String(!isNight));$('sceneNight').setAttribute('aria-pressed',String(isNight));}
  $('sceneSunset').onclick=()=>setScene(false);$('sceneNight').onclick=()=>setScene(true);
  function motionChanged(){resetTilt();if(reduce.matches&&motion)clearStamp();}
  reduce.addEventListener('change',motionChanged);fine.addEventListener('change',resetTilt);
  window.addEventListener('resize',()=>{resetTilt();drawNight();});window.addEventListener('blur',resetTilt);
  drawNight();setScene(false);
})();
