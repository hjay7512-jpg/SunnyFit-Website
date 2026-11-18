'use strict';

function createBrandFinale(){
  const layer=document.querySelector('.brand-finale');
  const field=layer.querySelector('.brand-field'),orb=layer.querySelector('.finale-orb');
  const end=layer.querySelector('.brand-end'),slogan=layer.querySelector('.brand-slogan'),downloads=layer.querySelector('.brand-download');
  const zero=end.querySelector('.brand-zero');
  const orbZero=new URLSearchParams(location.search).get('zero')==='ball';
  layer.classList.toggle('use-orb-zero',orbZero);

  function hide(){
    layer.hidden=true;
    layer.classList.remove('is-looking');
    end.inert=true;
    end.setAttribute('aria-hidden','true');
  }

  function render(share,progress,pose){
    const feed=ease(.44,.96,share);
    if(!feed){hide();return}
    layer.hidden=false;
    const w=layer.clientWidth,h=layer.clientHeight;
    // Centre of the original accessory in the 375 × 812 community art.
    const dock=new DOMPoint(333,750+(1-feed)*22).matrixTransform(pose);
    const lift=ease(0,.43,progress),zoom=ease(.28,.79,progress);
    const from=44*pose.a,closeUp=Math.max(from,Math.min(w,h)*.29);
    const centreX=mix(dock.x,w*.5,lift);
    const centreY=mix(dock.y,h*.5,lift)-Math.sin(Math.PI*lift)*Math.min(h*.075,60);
    let x=centreX,y=centreY,diameter=from*Math.pow(closeUp/from,lift);
    if(orbZero){
      const land=ease(.43,.91,progress),slot=zero.getBoundingClientRect();
      x=mix(centreX,slot.left+slot.width/2,land);
      y=mix(centreY,slot.top+slot.height/2,land);
      diameter*=Math.pow(slot.height/closeUp,land);
    }else{
      diameter*=Math.pow(Math.hypot(w,h)*1.1/closeUp,zoom);
    }
    const ballOpacity=orbZero?feed:feed*(1-ease(.70,.92,progress));
    orb.style.display=ballOpacity>0?'block':'none';
    if(ballOpacity>0){
      orb.style.left=x+'px';
      orb.style.top=y+'px';
      orb.style.width=diameter+'px';
      orb.style.opacity=String(ballOpacity);
    }
    field.style.opacity=String(ease(.03,.66,progress));
    field.style.setProperty('--bloom',String(ease(.2,.57,progress)*(1-ease(.6,.94,progress))));
    layer.classList.toggle('is-looking',orbZero&&progress>=.92&&!lowMotion());
    const reveal=orbZero?ease(.53,.89,progress):ease(.78,.97,progress);
    end.style.opacity=String(reveal);
    end.inert=progress<.99;
    end.setAttribute('aria-hidden',String(reveal<.5));
    slogan.style.opacity=String(ease(.87,.985,progress));
    downloads.style.opacity=String(ease(.94,1,progress));
  }
  return {hide,render};
}

function createWorkoutStory() {
  const byId=id=>document.getElementById(id);
  const cover=byId('course-cover'),layout=byId('result-layout'),avatars=byId('rank-avatars');
  const badge=byId('save-mark'),poster=byId('course-poster');
  const video=byId('course-film');
  const session=document.querySelector('.session-copy'),result=document.querySelector('.result-copy');
  const status=document.querySelector('.assistive-status');
  const course={
    title:'30-Min Row & Strength Intervals Rower',
    duration:1800,
    source:'https://d28bc4v39ieape.cloudfront.net/f2c5427b-942c-435e-bc4f-2765da700260/hls/1879669227667542017_audioconvert_202618855.m3u8'
  };
  // Simulated participant log. Seconds, strokes, miles and kcal per interval.
  // Strength intervals advance the session clock and energy, keeping rowing totals fixed.
  const intervals=[
    [180,60,.29,16],[240,100,.50,28],[120,0,0,14],[240,102,.51,31],
    [150,0,0,18],[240,106,.52,32],[150,0,0,18],[240,108,.53,31],[240,44,.21,22]
  ];
  const profiles=[
    {name:'Mia',total:224,trend:-.12,avatar:1},{name:'Kai',total:205,trend:-.15,avatar:2},
    {name:'Remy',total:195,trend:.08,avatar:3},{name:'Jo',total:187,trend:-.10,avatar:4}
  ];
  const clamp=(x,lo=0,hi=1)=>Math.min(hi,Math.max(lo,x));
  const clock=s=>Math.floor(s/60).toString().padStart(2,'0')+':'+Math.floor(s%60).toString().padStart(2,'0');
  function activity(secondsPlayed) {
    const elapsed=Math.floor(clamp(secondsPlayed,0,course.duration));
    let remaining=elapsed,strokes=0,miles=0,energy=0;
    for(const [seconds,count,distance,kcal] of intervals){
      const fraction=clamp(remaining/seconds);
      strokes+=count*fraction;miles+=distance*fraction;energy+=kcal*fraction;
      remaining-=seconds;
    }
    const kcal=Math.round(energy),f=elapsed/course.duration;
    const rivals=profiles.map(a=>({...a,kcal:Math.round(a.total*(f+a.trend*Math.sin(Math.PI*f)))}));
    const leaders=[{name:'Alex',me:true,kcal,avatar:0},...rivals].sort((a,b)=>b.kcal-a.kcal);
    return {elapsed,strokes:Math.floor(strokes),miles,kcal,leaders,rank:leaders.findIndex(a=>a.me)+1};
  }
  const totals=activity(course.duration);
  const insight='You rowed '+totals.miles.toFixed(2)+' miles in '+totals.strokes+' strokes. After each strength block, ease into the first few strokes to find your rhythm again.';
  result.querySelector('.support').textContent=insight;
  const S=DEVICE.width,L=DEVICE.height;
  const landscapeToBody=new DOMMatrix([0,1,-1,0,S,0]);
  const images=[cover,layout,avatars,badge,poster];
  const tapAt=.038,playAt=.105,saveAt=.75,returnAt=.86;
  let resultArt,chapter='',completed=false,prepared=false,playing=false;
  function preparation(width,height,draw){
    const c=document.createElement('canvas');c.width=width*2;c.height=height*2;
    const g=c.getContext('2d');g.scale(2,2);draw(g);return c;
  }
  function box(g,x,y,w,h,r,fill){
    g.beginPath();g.roundRect(x,y,w,h,r);g.fillStyle=fill;g.fill();
  }
  function print(g,text,x,y,size,weight=500,color='#1c1c20'){
    g.font=weight+' '+size+'px -apple-system,BlinkMacSystemFont,"Segoe UI",Arial,sans-serif';
    g.fillStyle=color;g.textAlign='left';g.textBaseline='alphabetic';g.fillText(text,x,y);
  }
  function paragraph(g,str,x,y,width,size,leading,weight=450,color='#202026'){
    g.font=weight+' '+size+'px -apple-system,BlinkMacSystemFont,"Segoe UI",Arial,sans-serif';
    let line='';
    for(const word of str.split(' ')){
      const next=line?line+' '+word:word;
      if(line&&g.measureText(next).width>width){print(g,line,x,y,size,weight,color);line=word;y+=leading}
      else line=next;
    }
    if(line)print(g,line,x,y,size,weight,color);
  }
  function crop(g,image,x,y,w,h){
    const iw=image.videoWidth||image.naturalWidth||image.width,ih=image.videoHeight||image.naturalHeight||image.height;
    if(!iw||!ih||w<=0||h<=0)return;
    const k=Math.max(w/iw,h/ih),sw=w/k,sh=h/k;
    g.drawImage(image,(iw-sw)/2,(ih-sh)/2,sw,sh,x,y,w,h);
  }
  function recommendationChips(g,labels){
    const source=document.querySelector('#screen'),y=641,h=59;
    g.save();g.beginPath();g.rect(16,y,343,h);g.clip();
    const panel=g.createLinearGradient(16,0,359,0);
    panel.addColorStop(0,'#f4f5f6');panel.addColorStop(1,'#f7f2f1');g.fillStyle=panel;g.fillRect(16,y,343,h);
    let left=18;
    // Reuse the recommendation pill's original icon, glass edges and radius.
    for(const label of labels){
      g.font='600 14px "Segoe UI",Arial,sans-serif';
      const textWidth=Math.ceil(g.measureText(label).width);
      g.drawImage(source,124,y,36,h,left,y,36,h);
      g.drawImage(source,158,y,1,h,left+36,y,textWidth+5,h);
      g.drawImage(source,274,y,13,h,left+41+textWidth,y,13,h);
      print(g,label,left+39,674,14,600);
      left+=textWidth+54;
    }
    g.restore();
  }
  function homeScreen(){
    return preparation(375,812,g=>{
      g.drawImage(screen,0,0,375,812);
      print(g,'Cardio · 0/200 kcal',207,229,15,450,'#555762');
      paragraph(g,'Ready for your next row, Alex? Alternate rowing and strength today.',80,284,265,15,20);
      g.save();g.beginPath();g.roundRect(24,328,327,245,9);g.clip();
      crop(g,cover,24,328,327,245);
      const shade=g.createLinearGradient(0,462,0,573);shade.addColorStop(0,'#14151700');shade.addColorStop(1,'#141517e8');
      g.fillStyle=shade;g.fillRect(24,460,327,113);
      paragraph(g,course.title,38,509,289,18,22,650,'white');print(g,'30 min  |  Row + strength',38,555,14,500,'white');
      g.restore();
      recommendationChips(g,['Easy row','20 min core','Outdoor Run']);
    });
  }
  function resultScreen(){
    if(resultArt)return resultArt;
    resultArt=preparation(375,812,g=>{
      g.drawImage(layout,0,0,375,812);
      print(g,'Workout complete',28,145,17,650,'#d5494c');
      print(g,totals.miles.toFixed(2),28,186,30,680);print(g,'mi rowed',97,186,14,550);
      print(g,'Nov 2, 2026  ·  Row + strength',28,210,13,450,'#60616a');
      print(g,clock(totals.elapsed),40,294,24,650);print(g,String(totals.kcal),206,294,24,650);
      print(g,totals.miles.toFixed(2),40,390,24,650);print(g,String(totals.strokes),206,390,24,650);
      paragraph(g,insight,28,515,318,16,24);
      g.save();g.beginPath();g.roundRect(28,661,40,40,5);g.clip();crop(g,cover,28,661,40,40);g.restore();
      g.font='600 16px "Segoe UI",Arial';
      let title=course.title;
      while(g.measureText(title+'…').width>198)title=title.slice(0,-1);
      print(g,title.trimEnd()+'…',80,677,16,600);
      print(g,'30 min  |  Row + strength',80,698,13,450,'#63646b');
    });
    return resultArt;
  }
  function prepareFilm(){
    if(prepared)return;
    prepared=true;video.preload='metadata';video.load();
  }
  function updatePlayback(inWorkout){
    const shouldPlay=inWorkout&&!document.hidden;
    if(shouldPlay===playing)return;
    playing=shouldPlay;
    if(playing){
      prepareFilm();
      video.play().catch(queuePaint);
    }else video.pause();
  }
  // The decoder supplies fresh frames even when the visitor holds their place.
  const decodedFrames='requestVideoFrameCallback' in video;
  let frameRequest=null;
  function nextVideoFrame(){
    frameRequest=null;
    queuePaint();
    if(!video.paused&&!video.ended){
      frameRequest=decodedFrames?video.requestVideoFrameCallback(nextVideoFrame):requestAnimationFrame(nextVideoFrame);
    }
  }
  video.addEventListener('playing',()=>{if(frameRequest===null)nextVideoFrame()});
  video.addEventListener('pause',()=>{
    if(frameRequest===null)return;
    if(decodedFrames)video.cancelVideoFrameCallback(frameRequest);
    else cancelAnimationFrame(frameRequest);
    frameRequest=null;
  });
  video.addEventListener('timeupdate',queuePaint);
  video.addEventListener('loadeddata',queuePaint);
  document.addEventListener('visibilitychange',()=>{
    if(document.hidden)updatePlayback(false);
    else queuePaint();
  });
  const openingDistance=()=>track.clientHeight*3.5;
  const afterDistance=()=>track.clientHeight*5;
  function goHome(){track.scrollTop=openingDistance()}
  const week=createWeekStory({totals,course,preparation,print,paragraph,box,crop,recommendationChips});
  function goScene(scene){
    if(scene==='home')goHome();
    else if(scene==='result')track.scrollTop=track.clientHeight*8.5;
    else if(scene==='week'||scene==='recovery')week.goto(1.3);
    else if(/^day-[1-7]$/.test(scene))week.goto(1.3+(Number(scene.slice(4))-1)*.86);
    else if(scene==='weekly')week.goto(7.65);
    else if(scene==='report')week.goto(9.04);
    else if(scene==='community')week.goto(12.48);
    else if(scene==='brand'||scene==='finale')week.goto(15.45);
  }
  function onStage(el,alpha){
    el.style.opacity=String(alpha);el.setAttribute('aria-hidden',String(alpha<.02));
  }
  function announce(key,text){if(key!==chapter){chapter=key;status.textContent=text}}
  function centered(cx,cy,unit,angle=0){
    return new DOMMatrix().translate(cx,cy).rotate(angle).scale(unit).translate(-S/2,-L/2);
  }
  function frameAt(u,w,h,mobile){
    const entry=shot(1,w,h,mobile),base=entry.phone,center=new DOMPoint(S/2,L/2).matrixTransform(base);
    const landscapeWidth=Math.min(w*(mobile?.945:.574),(h-62)*1.83,1370);
    const lu=landscapeWidth/L,lx=w*(mobile?.5:.68),ly=h*(mobile?.384:.52);
    const turn=ease(.088,.245,u),finish=ease(returnAt,.99,u);
    const orientation=turn-finish,theta=orientation*Math.PI/2;
    const safe=w<1024?75:90;
    const resultUnit=mobile?Math.min((h*.689-safe)/L,w*1.66/L):Math.min(base.a,(h-safe-18)/L);
    const resultX=w*(mobile?.5:.29),resultY=mobile?(h*.689+safe)/2:(safe+h*.91)/2;
    const cx=mix(mix(center.x,lx,turn),resultX,finish),cy=mix(mix(center.y,ly,turn),resultY,finish);
    const unscaledWidth=Math.cos(theta)*S+Math.sin(theta)*L;
    const unscaledHeight=Math.sin(theta)*S+Math.cos(theta)*L;
    const unit=Math.min(mix(mix(base.a,lu,turn),resultUnit,finish),
      (Math.min(cx,w-cx)*2-6)/unscaledWidth,2*Math.min(cy-safe+4,h-cy-4)/unscaledHeight);
    const body=centered(cx,cy,unit,-90*orientation);
    return {body,landscape:body.multiply(landscapeToBody),entry};
  }
  function setShell(m){
    applyMatrix(m);
    const rim=ctx.createLinearGradient(0,0,S,0);rim.addColorStop(0,'#646964');rim.addColorStop(.025,'#222522');rim.addColorStop(.97,'#151815');rim.addColorStop(1,'#717670');
    box(ctx,0,0,S,L,17,rim);
    ctx.beginPath();ctx.roundRect(4,4,S-8,L-8,13);ctx.clip();
  }
  function hud(g,d,compact){
    const panel='rgba(19,22,23,.65)',white='#fff';
    const x=compact?10:42,y=compact?56:58,rw=compact?232:164,rows=compact?3:5,rowH=compact?52:36;
    const peers=compact?(d.rank<=3?d.leaders.slice(0,3):[...d.leaders.slice(0,2),d.leaders.find(a=>a.me)]):d.leaders;
    box(g,x,y,rw,56+rows*rowH,8,panel);
    print(g,'All',x+14,y+22,compact?19:15,700,white);print(g,'Friends',x+(compact?67:57),y+22,compact?18:14,500,'#c8c9cb');
    print(g,'Ranking  '+d.rank+' / 5',x+12,y+44,compact?16:12,550,'#e6ebea');
    peers.forEach((a,i)=>{
      const rowY=y+52+i*rowH;const rank=d.leaders.indexOf(a)+1;
      if(a.me)box(g,x+2,rowY,rw-4,rowH-2,5,'#fff3');
      print(g,String(rank),x+9,rowY+rowH*.59,compact?17:13,650,white);
      const sz=compact?32:26;
      g.drawImage(avatars,a.avatar*28,0,28,28,x+27,rowY+(rowH-sz)/2,sz,sz);
      print(g,a.me?'Alex · You':a.name,x+(compact?68:59),rowY+(compact?22:15),compact?18:13,650,white);
      print(g,a.kcal+' kcal',x+(compact?68:59),rowY+(compact?41:29),compact?14:11,450,'#eef1f0');
    });
    const dx=compact?630:646,pw=compact?169:134;
    box(g,dx,y,pw,compact?251:242,8,panel);
    [[clock(d.elapsed),'TIME ELAPSED'],[String(d.strokes),'STROKES'],[String(d.kcal),'CALORIES (KCAL)'],[d.miles.toFixed(2),'DISTANCE (MI)']].forEach(([v,k],i)=>{
      print(g,v,dx+14,y+29+i*59,compact?27:22,650,white);print(g,k,dx+14,y+46+i*59,compact?13:10,600,'#e4e8e6');
    });
    box(g,338,362,136,4,2,'#fffe');
  }
  function bounds(m,x,y,w,h){
    const ps=[[x,y],[x+w,y],[x+w,y+h],[x,y+h]].map(([a,b])=>new DOMPoint(a,b).matrixTransform(m));
    const xs=ps.map(p=>p.x),ys=ps.map(p=>p.y);
    return [Math.min(...xs),Math.min(...ys),Math.max(...xs)-Math.min(...xs),Math.max(...ys)-Math.min(...ys)];
  }
  function drawDisplay(f,u,data,mobile){
    ctx.save();setShell(f.body);
    if(u<.248){
      ctx.drawImage(phoneTexture,0,0,S,L);
      const pulse=ease(tapAt,.128,u);
      if(pulse>0&&pulse<1){
        const k=(S-8)/375,x=4+187*k,y=4+613*k;
        ctx.save();ctx.globalAlpha=Math.sin(Math.PI*pulse);ctx.fillStyle='#fff7';ctx.beginPath();ctx.arc(x,y,6+13*pulse,0,Math.PI*2);ctx.fill();
        ctx.strokeStyle='white';ctx.lineWidth=1.8;ctx.beginPath();ctx.arc(x,y,9+26*pulse,0,Math.PI*2);ctx.stroke();ctx.restore();
      }
    }
    applyMatrix(f.body.inverse());
    if(u>=.105){
      const film=video.readyState>=2?video:poster;
      if(u<.245){
        const k=(S-8)/375,a=bounds(f.body,4+24*k,4+328*k,327*k,245*k),b=bounds(f.body,4,4,S-8,L-8),v=ease(.105,.168,u);
        const rect=a.map((value,i)=>mix(value,b[i],v));
        ctx.save();ctx.beginPath();ctx.roundRect(...rect,(1-v)*8*k);ctx.clip();
        crop(ctx,cover,...rect);
        const reveal=ease(.116,.161,u);
        if(reveal>0){ctx.beginPath();ctx.rect(rect[0],rect[1]+rect[3]*(1-reveal),rect[2],rect[3]*reveal);ctx.clip();crop(ctx,film,...rect)}
        ctx.restore();
      }else{
        ctx.save();applyMatrix(f.landscape);crop(ctx,film,4,4,L-8,S-8);ctx.restore();
      }
      ctx.save();applyMatrix(f.landscape);ctx.translate(4,4);ctx.scale((L-8)/812,(S-8)/375);
      const ui=ease(.203,.259,u)*(1-ease(saveAt,.785,u));
      if(ui>0){ctx.save();ctx.globalAlpha=ui;hud(ctx,data,mobile);ctx.restore()}
      const saving=ease(saveAt,.785,u);
      if(saving>0){
        ctx.save();ctx.globalAlpha=saving;ctx.fillStyle='#101012a6';ctx.fillRect(0,0,812,375);
        ctx.drawImage(badge,369,128,74.25,74.25);ctx.textAlign='center';ctx.font=(mobile?'500 22px':'500 16px')+' "Segoe UI",Arial';ctx.fillStyle='white';ctx.fillText('Saving Your Workout…',406,mobile?236:228);ctx.restore();
      }
      ctx.restore();
    }
    const summary=ease(returnAt,.935,u);
    if(summary>0){ctx.save();ctx.globalAlpha=summary;applyMatrix(f.body);ctx.drawImage(resultScreen(),4,4,S-8,L-8);ctx.restore()}
    ctx.restore();
  }
  let started=false,turnFrom=0,turnTarget=0,turnAt=0;
  function entryProgress(now){
    return mix(turnFrom,turnTarget,clamp((now-turnAt)/680));
  }
  function renderAfterHome(w,h,mobile,totalProgress){
    const actual=clamp((track.scrollTop-openingDistance())/afterDistance());
    const travel=track.scrollTop/track.clientHeight-8.5;
    if(actual>.75)week.prepare();
    if(travel<=0)week.hide();
    let u=actual;
    const target=actual>=playAt?1:0,now=performance.now();
    if(!actual||actual>=saveAt||lowMotion()){
      turnFrom=turnTarget=target;
    }else{
      // Crossing Start Now plays the press and turn once, even on a single flick.
      if(target!==turnTarget){
        turnFrom=entryProgress(now);turnAt=now;turnTarget=target;
      }
      const turn=entryProgress(now);
      u=turn===0?Math.min(actual,tapAt):turn===1?Math.max(actual,.26):mix(tapAt,.26,turn);
      if(turn!==target)queuePaint();
    }
    if(lowMotion())u=actual<playAt?.02:actual<saveAt?.32:actual<returnAt?.81:1;
    const inWorkout=actual>=playAt&&actual<saveAt&&u>=playAt;
    updatePlayback(inWorkout);
    if(inWorkout)started=true;
    if(started&&actual<=tapAt){
      started=false;
      if(video.readyState>0)video.currentTime=0;
    }
    if(actual<=tapAt)completed=false;
    if(actual>=saveAt&&!completed){
      completed=true;
      stage.dispatchEvent(new CustomEvent('sunnyfit:workout-complete',{bubbles:true,detail:{
        simulated:true,title:course.title,seconds:totals.elapsed,strokes:totals.strokes,miles:totals.miles,kcal:totals.kcal
      }}));
    }
    if(!actual){
      onStage(session,0);onStage(result,0);
      if(chapter&&chapter!=='home')announce('home','SunnyFit Home');
      return false;
    }
    const f=frameAt(u,w,h,mobile);
    const data=activity(video.currentTime);
    drawRoom(f.entry,mobile,1,w,h);
    lightBehindCopy(w,h,mobile,1);
    if(!mobile&&u>returnAt){
      ctx.save();ctx.globalAlpha=ease(returnAt,.98,u);
      const light=ctx.createLinearGradient(w*.32,0,w*.87,0);light.addColorStop(0,'#faf8f200');light.addColorStop(.55,'#faf8f2e3');light.addColorStop(1,'#faf8f2f5');ctx.fillStyle=light;ctx.fillRect(0,0,w,h);
      ctx.restore();
    }
    if(travel>0&&week.ready()){
      const view=week.state(travel);
      ctx.save();setShell(f.body);ctx.translate(4,4);ctx.scale((S-8)/375,(L-8)/812);
      week.draw(ctx,view,resultScreen());
      ctx.restore();
      const screenPose=f.body.translate(4,4).scale((S-8)/375,(L-8)/812);
      week.controls(view,screenPose);
      onStage(gymCopy,0);onStage(homeCopy,0);onStage(session,0);onStage(result,1-view.home);
      onStage(week.planCopy,view.home*(1-view.reportCopy));onStage(week.reportCopy,view.reportCopy*(1-view.share));
      onStage(week.communityCopy,view.share*(1-ease(0,.30,view.finale)));
      footer.style.opacity='1';footer.style.color='#343830';
      hint.textContent=view.finale===1?'Scroll to revisit ↑':'Scroll to continue ↓';
      rail.style.width=Math.round(totalProgress*rail.parentElement.clientWidth)+'px';
      if(view.home>.5)announce(view.key,view.description);
      else announce('result','Workout complete. '+clock(totals.elapsed)+', '+totals.strokes+' strokes, '+totals.miles.toFixed(2)+' miles, '+totals.kcal+' calories. '+insight);
      return true;
    }
    drawDisplay(f,u,data,mobile);
    onStage(gymCopy,0);onStage(homeCopy,1-ease(.06,.17,u));
    onStage(session,ease(.145,.235,u)*(1-ease(.83,.89,u)));onStage(result,ease(.935,.99,u));
    footer.style.opacity='1';
    footer.style.color='#343830';hint.textContent=u<playAt?'Scroll to start ↓':'Scroll to continue ↓';
    rail.style.width=Math.round(totalProgress*rail.parentElement.clientWidth)+'px';
    const key=u<playAt?'home':u<saveAt?'training':u<.935?'saving':'result';
    const messages={home:'SunnyFit Home',training:course.title,saving:'Saving your workout.',result:'Workout complete. '+clock(totals.elapsed)+', '+totals.strokes+' strokes, '+totals.miles.toFixed(2)+' miles, '+totals.kcal+' calories. '+insight};
    announce(key,messages[key]);
    return true;
  }
  return {course,activity,images,homeScreen,prepareFilm,renderAfterHome,goHome,goScene};
}


function createWeekStory({totals,course,preparation,print,paragraph,box,crop,recommendationChips}){
  const days=[
    {type:'Recovery',minutes:5,title:'5-Min Rowing Specific Cooldown',message:'Your row is complete. Ease your legs and shoulders into a five-minute cooldown.'},
    {type:'Strength',minutes:20,title:'20-Min Beginner Upper Body Dumbbell',message:'Sculpt upper-body strength and boost calorie burn with dumbbell basics.'},
    {type:'Cardio',minutes:20,title:'20-Min Beginner Interval Run',message:'Burn fat and build endurance with easy-to-follow treadmill intervals.'},
    {type:'Mobility',minutes:15,title:'15-Min Beginner Stretch and Mobility Flow',message:'Release muscle tightness and restore mobility with a smooth flow.'},
    {type:'Strength',minutes:20,title:'20-Min Beginner Lower Body Dumbbell Strength',message:'Fire up your legs and metabolism with controlled dumbbell moves.'},
    {type:'Cardio',minutes:20,title:'20-Min Indoor Bike Foundations Ride',message:'Keep the sweat flowing with a smooth, low-impact cardio ride.'},
    {type:'Mobility',minutes:10,title:'10-Min Full Body Stretch',message:'Ease muscular tension and reset your body with full-body stretches.'}
  ];
  const weekdays=['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
  const alternatives=[
    ['Easy stretch','5 min mobility','Gentle walk'],
    ['20 min core','Outdoor Run','Quick stretch'],
    ['Outdoor Run','Easy ride','10 min core'],
    ['Gentle yoga','Hip mobility','Easy walk'],
    ['20 min core','Upper body','Leg stretch'],
    ['Outdoor ride','Low-impact row','Easy walk'],
    ['Hip mobility','Easy stretch','Gentle yoga']
  ];
  // Only completed sessions enter the report. All seven Home suggestions are offered.
  const records=[
    {day:0,title:course.title,type:'Cardio',minutes:totals.elapsed/60,kcal:totals.kcal},
    ...[[3,45],[4,120]].map(([day,kcal])=>({day,title:days[day].title,type:days[day].type,minutes:days[day].minutes,kcal}))
  ];
  const daily=weekdays.map((_,i)=>records.filter(s=>s.day===i).reduce((n,s)=>n+s.minutes,0));
  const minutes=daily.reduce((a,b)=>a+b,0),kcal=records.reduce((n,s)=>n+s.kcal,0);
  const activeDays=daily.filter(Boolean).length;
  const reportSummary=records.length+' workouts · '+minutes+' min';
  const dateRange='Nov 2–8, 2026';
  const planCopy=document.querySelector('.next-copy'),reportCopy=document.querySelector('.report-copy');
  const communityCopy=document.querySelector('.community-copy');
  reportCopy.querySelector('.support').textContent='Your row, mobility flow and strength session added up to '+minutes+' minutes across '+activeDays+' days.';
  const openButton=document.querySelector('#weekly-open'),frame=document.querySelector('#weekly-frame');
  const categories={Cardio:['CARDIO','ROWING','Rowing'],Strength:['STRENGTH','LOWER_BODY','Lower body'],Mobility:['MIND_BODY','STRETCHING','Stretching']};
  const reportData={reportId:'1000000570',periodKey:202645,timezone:'America/Los_Angeles',startDateStr:'2026-11-02',endDateStr:'2026-11-08',
    workoutCount:records.length,activeDays,totalDuration:minutes*60,totalKcal:kcal,lastWeekCompare:{hasLastWeek:false},
    dailyTrends:daily.map((value,i)=>({dateStr:'11/'+String(i+2).padStart(2,'0'),dayOfWeek:weekdays[i],duration:value*60,kcal:records.filter(r=>r.day===i).reduce((sum,r)=>sum+r.kcal,0)})),
    workoutBreakdown:records.map(r=>{const [group,type,name]=categories[r.type];return {group,durationSec:r.minutes*60,subtypes:[{type,name,durationSec:r.minutes*60}]}}),
    analysis:{aiRecommendation:'Your 30-minute row was your longest session. You followed it with mobility on Thursday and lower-body strength on Friday. Next week, leave room for an easy stretch after your row.'}
  };
  const post=(message)=>frame.contentWindow.postMessage(message,location.protocol==='file:'?'*':location.origin);
  const shareStart=10.62,shareEnd=12.18;
  const brand=createBrandFinale();
  let mounted=false,lastInside=-1,lastShare=-1,lastReduced=null,lastTap=0,lastLeaving=false,shareOrigin=null;
  let previousTravel=null,pressedAt=null;
  window.addEventListener('message',event=>{
    if(event.source!==frame.contentWindow||event.origin!==location.origin)return;
    const message=event.data||{};
    if(message.type==='report-request')post({type:'report-data',detail:reportData});
    if(message.type==='report-mounted'){mounted=true;lastInside=-1;lastShare=-1;queuePaint()}
    if(message.type==='report-back')goto(7.7,true);
    if(message.type==='report-share'&&!frame.hidden){
      const travel=track.scrollTop/track.clientHeight-8.5;
      if(travel<8.9||travel>=shareStart)return;
      shareOrigin={travel,inside:Math.max(0,lastInside)};
      goto(shareStart+.015);
      requestAnimationFrame(()=>goto(shareEnd+.08,true));
    }
    if(message.type==='community-reopen'&&lastShare>=.99){
      const where=shareOrigin?shareOrigin.travel:9.04;
      shareOrigin=null;goto(where);
    }
    if(message.type==='report-move'&&!frame.hidden&&Number.isFinite(message.delta))track.scrollTop+=message.delta;
  });
  const assets=new Map(),dayArt=[];
  let loading=false,loaded=false,readyArt;
  function prepare(){
    if(loading)return;
    loading=true;
    const names=['plan-home.png','weekly-ready.png',...days.map((_,i)=>'day-'+(i+1)+'.webp')];
    Promise.all(names.map(name=>{
      const im=new Image();im.src='media/'+name;assets.set(name,im);return im.decode();
    })).then(()=>{loaded=true;queuePaint()}).catch(error=>{console.error('Weekly artwork could not load',error);loading=false});
  }
  const ready=()=>loaded;
  function goto(travel,animate=false){
    track.scrollTo({top:track.clientHeight*(8.5+travel),behavior:animate&&!lowMotion()?'smooth':'instant'});
  }
  openButton.addEventListener('click',()=>goto(9.04,true));
  function syncCommunity(progress,tap=0,leaving=false){
    const reducedMotion=lowMotion();
    if(!mounted||(progress===lastShare&&reducedMotion===lastReduced&&tap===lastTap&&leaving===lastLeaving))return;
    post({type:'community-progress',progress,reducedMotion,tap,leaving});
    lastShare=progress;lastReduced=reducedMotion;lastTap=tap;lastLeaving=leaving;
    frame.title=progress>.7?'SunnyFam community':'SunnyFit Weekly Report';
  }
  function hide(){
    for(const el of [planCopy,reportCopy,communityCopy]){
      el.style.opacity='0';el.setAttribute('aria-hidden','true');
    }
    openButton.hidden=true;frame.hidden=true;shareOrigin=null;pressedAt=null;previousTravel=null;brand.hide();syncCommunity(0);
  }
  function state(travel){
    const reduced=lowMotion();
    function phase(start,end){return reduced?Number(travel>=(start+end)/2):ease(start,end,travel)}
    const home=phase(.25,1.05),sequence=Math.max(0,Math.min(7,(travel-1.2)/.86));
    const day=Math.min(6,Math.floor(sequence)),fraction=sequence-day;
    const change=reduced?Number(fraction>=.86):ease(.72,1,fraction);
    const readyAmount=day===6?change:0;
    const detail=phase(8.23,8.95);
    let share=phase(shareStart,shareEnd),shareTap=0;
    // Play the tap in real time, including when a single wheel or touch gesture crosses its whole scroll range.
    const now=performance.now();
    if(travel<shareStart)pressedAt=null;
    else if(mounted&&previousTravel!==null&&previousTravel>=8.2&&previousTravel<shareStart)pressedAt=now;
    previousTravel=travel;
    if(pressedAt!==null){
      const elapsed=now-pressedAt,pressDuration=reduced?140:360;
      shareTap=elapsed<pressDuration?(reduced?.5:elapsed/pressDuration):0;
      const release=reduced?Number(elapsed>=pressDuration):ease(pressDuration,pressDuration+380,elapsed);
      share=Math.min(share,release);
      if(release<1)queuePaint();else pressedAt=null;
    }
    const finale=share===1?phase(13.08,15.23):0;
    let inside=shareOrigin?shareOrigin.inside:Math.max(0,Math.min(1,(travel-9.16)/1.12));
    if(shareOrigin&&travel<shareStart-.01){
      const origin=shareOrigin;shareOrigin=null;
      if(travel>shareStart-.6&&travel>origin.travel){
        goto(origin.travel+(travel-shareStart));
      }else inside=Math.max(0,Math.min(1,(travel-9.16)/1.12));
    }
    const selected=Math.min(6,day+Number(change>=.5));
    const key=finale>.75?'brand':share>.7?'community':share>.06?'sharing':detail>=.5?(inside>.5?'report-analysis':'report-detail'):readyAmount>=.5?'report-ready':'day-'+(selected+1);
    const description=key.startsWith('day-')?'Day '+(selected+1)+'. '+days[selected].message+' '+days[selected].title:
      key==='brand'?'SunnyFit 3.0. Fit For Everyone.':key==='community'?'Alex shared a weekly report with SunnyFam. '+dateRange+'. '+reportSummary+', '+kcal+' calories, '+activeDays+' active days.':
      key==='sharing'?'Sharing your weekly report with SunnyFam.':key==='report-ready'?'Your weekly report is ready. '+dateRange+'. '+reportSummary+'. View Now.':
      'Weekly Report. '+dateRange+'. '+reportSummary+', '+kcal+' calories, '+activeDays+' active days.';
    return {home,day,change,readyAmount,detail,inside,share,shareTap,finale,key,description,
      reportCopy:day===6?readyAmount:0,tap:reduced?0:ease(8.05,8.35,travel)};
  }
  function dayMessage(g,day){
    const x=80,right=347,lineHeight=19,size=15,first='Day '+(day+1);
    const font=(weight)=>weight+' '+size+'px "Segoe UI",Arial,sans-serif';
    g.font=font(700);
    let cursor=x+g.measureText(first).width;
    const lines=[[]];g.font=font(450);
    for(const word of ['–',...days[day].message.split(' ')]){
      const space=cursor===x?0:g.measureText(' ').width,w=g.measureText(word).width;
      if(cursor+space+w>right){lines.push([]);cursor=x}
      if(cursor>x)cursor+=g.measureText(' ').width;
      lines[lines.length-1].push({word,x:cursor});cursor+=w;
    }
    const firstY=290-(lines.length-1)*lineHeight/2;
    print(g,first,x,firstY,size,700);
    lines.forEach((words,i)=>words.forEach(word=>print(g,word.word,word.x,firstY+i*lineHeight,size,450)));
  }
  function homeArt(day){
    if(dayArt[day])return dayArt[day];
    const entry=days[day];
    dayArt[day]=preparation(375,812,g=>{
      g.drawImage(assets.get('plan-home.png'),0,0,375,812);
      print(g,day===0?'Recovery':'Dynamic Plan',16,229,20,650);
      const target=day===0?'Cardio · '+totals.kcal+'/200 kcal':entry.type+' · 0/'+entry.minutes+' min';
      g.font='450 16px "Segoe UI",Arial,sans-serif';
      print(g,target,359-g.measureText(target).width,229,16,450,'#60636a');
      dayMessage(g,day);
      g.save();g.beginPath();g.roundRect(24,328,327,245,9);g.clip();
      crop(g,assets.get('day-'+(day+1)+'.webp'),24,328,327,245);
      const shade=g.createLinearGradient(0,440,0,573);shade.addColorStop(0,'#10111400');shade.addColorStop(1,'#101114df');
      g.fillStyle=shade;g.fillRect(24,440,327,133);
      g.font='650 18px "Segoe UI",Arial,sans-serif';
      paragraph(g,entry.title,38,g.measureText(entry.title).width>292?506:528,292,18,22,650,'white');
      print(g,entry.minutes+' min  |  '+entry.type,38,554,14,500,'white');g.restore();
      recommendationChips(g,alternatives[day]);
    });
    return dayArt[day];
  }
  function centeredText(g,str,x,y,size,weight,color){
    g.font=weight+' '+size+'px "Segoe UI",Arial,sans-serif';print(g,str,x-g.measureText(str).width/2,y,size,weight,color);
  }
  function chart(g,x,y,w,h,labeled){
    const max=Math.max(...daily),points=daily.map((v,i)=>[x+i*w/6,y+h-v/max*(h-8)]);
    const area=g.createLinearGradient(0,y,0,y+h+3);area.addColorStop(0,'#ee526583');area.addColorStop(1,'#f7c4c905');
    g.beginPath();g.moveTo(x,y+h);points.forEach(([px,py])=>g.lineTo(px,py));g.lineTo(x+w,y+h);g.fillStyle=area;g.fill();
    g.beginPath();points.forEach(([px,py],i)=>i?g.lineTo(px,py):g.moveTo(px,py));g.strokeStyle='#e82d36';g.lineWidth=1.8;g.stroke();
    points.forEach(([px,py],i)=>{
      g.beginPath();g.arc(px,py,3.8,0,Math.PI*2);g.fillStyle='#fa9e91';g.fill();g.lineWidth=1;g.strokeStyle='white';g.stroke();
      if(labeled)centeredText(g,weekdays[i],px,y+h+17,12,500,'#696a73');
    });
  }
  function weeklyHome(){
    if(!readyArt)readyArt=preparation(375,812,g=>{
      g.drawImage(assets.get('weekly-ready.png'),0,0,375,812);
      paragraph(g,'Your weekly report is ready. See where you spent your time.',80,279,264,16,22);
      print(g,reportSummary,36,353,18,650);print(g,dateRange,36,377,14,450,'#68696d');
    });
    return readyArt;
  }
  function drawHome(g,view){
    const {day,change,readyAmount}=view;
    g.drawImage(homeArt(day),0,0,375,812);
    if(day<6&&change>0){
      g.save();g.globalAlpha=change;g.drawImage(homeArt(day+1),0,0,375,812);g.restore();
    }
    if(readyAmount){
      g.save();g.globalAlpha=readyAmount;g.drawImage(weeklyHome(),0,0,375,812);g.restore();
    }
  }
  function draw(g,view,resultArt){
    if(view.home<1){
      g.save();g.translate(-42*(1-view.home),0);drawHome(g,view);g.restore();
      const left=375*view.home;
      g.save();g.shadowColor='#25263040';g.shadowBlur=9;g.drawImage(resultArt,left,0,375,812);g.restore();
      return;
    }
    drawHome(g,view);
    if(view.readyAmount){
      g.save();g.globalAlpha=view.readyAmount;chart(g,39,410,297,86,false);g.restore();
    }
    if(view.tap>0&&view.tap<1){
      g.save();g.globalAlpha=Math.sin(Math.PI*view.tap);g.strokeStyle='white';g.lineWidth=2;g.beginPath();
      g.arc(189,554,8+21*view.tap,0,Math.PI*2);g.stroke();g.restore();
    }
  }
  function place(button,visible,pose,x,y,w,h){
    button.hidden=!visible;if(!visible)return;
    const a=new DOMPoint(x,y).matrixTransform(pose),b=new DOMPoint(x+w,y+h).matrixTransform(pose);
    Object.assign(button.style,{left:a.x+'px',top:a.y+'px',width:(b.x-a.x)+'px',height:(b.y-a.y)+'px'});
  }
  function controls(view,pose){
    place(openButton,view.readyAmount>.97&&view.detail<.05,pose,16,247,343,344);
    if(view.day>=5&&!frame.hasAttribute('src'))frame.src='report.html';
    const t=view.detail;
    frame.hidden=!t;
    syncCommunity(view.share,view.shareTap,view.finale>0);
    brand.render(view.share,view.finale,pose);
    if(!t)return;
    // The live release page grows from the bounds of the actual card, inside the same bezel.
    const w=mix(343,375,t),h=mix(344,812,t);
    const m=pose.translate(mix(16,0,t),mix(247,0,t)).scale(w/375,h/812);
    frame.style.transform=m.toString();
    frame.style.opacity=String(ease(0,.72,t));
    frame.style.borderRadius=mix(14,13,t)+'px';
    const canInteract=t>.98&&view.finale===0;
    frame.inert=!canInteract;
    frame.style.pointerEvents=canInteract?'auto':'none';
    frame.tabIndex=canInteract?0:-1;
    if(mounted&&view.inside!==lastInside){
      post({type:'report-scroll',progress:view.inside});lastInside=view.inside;
    }
  }
  return {prepare,ready,hide,goto,state,draw,controls,planCopy,reportCopy,communityCopy};
}
