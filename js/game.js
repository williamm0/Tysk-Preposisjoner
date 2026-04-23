// ============================================================
// Spillsenter — 5 preposijonsspill
// ============================================================
(function () {
  "use strict";

  const C = document.getElementById("game-canvas");
  if (!C) return;
  const X = C.getContext("2d");
  const W = C.width;   // 640
  const H = C.height;  // 380

  function sfx(n)  { typeof AudioEngine    !== "undefined" && AudioEngine.play(n); }
  function uach(id){ typeof Achievements   !== "undefined" && Achievements.unlock(id); }
  function rAns(ok){ typeof Achievements   !== "undefined" && Achievements.recordAnswer(ok); }
  function getSetting(k,fb){ return typeof Settings!=="undefined" ? Settings.get(k) : fb; }

  // ── Input ────────────────────────────────────────────────────
  C.addEventListener("click", e => {
    const r = C.getBoundingClientRect();
    const x = (e.clientX-r.left)*(W/r.width);
    const y = (e.clientY-r.top)*(H/r.height);
    currentGame?.onClick?.(x,y);
  });
  const K = {};
  let tLeft=false,tRight=false;
  document.addEventListener("keydown", e => {
    K[e.code]=true;
    if(e.code==="Space") e.preventDefault();
    currentGame?.onKey?.(e.code);
  });
  document.addEventListener("keyup",e=>{ K[e.code]=false; });
  function wireHold(id,fn){ const el=document.getElementById(id); if(!el)return; el.addEventListener("touchstart",ev=>{ev.preventDefault();fn(true);},{passive:false}); el.addEventListener("touchend",()=>fn(false)); el.addEventListener("mousedown",()=>fn(true)); el.addEventListener("mouseup",()=>fn(false)); el.addEventListener("mouseleave",()=>fn(false)); }
  wireHold("ctrl-left",  v=>{tLeft=v;});
  wireHold("ctrl-right", v=>{tRight=v;});
  wireHold("catch-left", v=>{tLeft=v;});
  wireHold("catch-right",v=>{tRight=v;});
  const shootEl=document.getElementById("ctrl-shoot");
  if(shootEl){ shootEl.addEventListener("touchstart",ev=>{ev.preventDefault();currentGame?.onKey?.("Space");},{passive:false}); shootEl.addEventListener("click",()=>currentGame?.onKey?.("Space")); }

  // ── Stars ────────────────────────────────────────────────────
  const STARS=Array.from({length:90},()=>({x:Math.random()*W,y:Math.random()*H,r:Math.random()*1.3+0.2,spd:Math.random()*.2+.05,a:Math.random()*.5+.15}));
  function drawStars(){ for(const s of STARS){ s.y+=s.spd; if(s.y>H)s.y=0; X.fillStyle=`rgba(255,255,255,${s.a})`; X.beginPath(); X.arc(s.x,s.y,s.r,0,Math.PI*2); X.fill(); } }

  // ── Draw utils ───────────────────────────────────────────────
  let frameN=0;
  function rr(x,y,w,h,r){ X.beginPath(); X.moveTo(x+r,y); X.lineTo(x+w-r,y); X.quadraticCurveTo(x+w,y,x+w,y+r); X.lineTo(x+w,y+h-r); X.quadraticCurveTo(x+w,y+h,x+w-r,y+h); X.lineTo(x+r,y+h); X.quadraticCurveTo(x,y+h,x,y+h-r); X.lineTo(x,y+r); X.quadraticCurveTo(x,y,x+r,y); X.closePath(); }
  function pulseBtn(x,y,txt,c){ const p=.5+.5*Math.sin(frameN*.07); X.font="bold 15px system-ui,sans-serif"; X.textAlign="center"; const tw=X.measureText(txt).width+48; X.fillStyle=(c||"rgba(23,79,168,")+(.55+.35*p)+")"; rr(x-tw/2,y-22,tw,44,10); X.fill(); X.strokeStyle=`rgba(100,160,255,${.4+.5*p})`; X.lineWidth=2; X.stroke(); X.fillStyle="#FFF"; X.fillText(txt,x,y+6); }
  function pulseBtnPlain(x,y,txt,bg){ const p=.5+.5*Math.sin(frameN*.07); X.font="bold 15px system-ui,sans-serif"; X.textAlign="center"; const tw=X.measureText(txt).width+48; X.fillStyle=bg||"#174FA8"; X.globalAlpha=.8+.15*p; rr(x-tw/2,y-22,tw,44,10); X.fill(); X.globalAlpha=1; X.fillStyle="#FFF"; X.fillText(txt,x,y+6); }
  function drawBg(){ X.fillStyle="#09101C"; X.fillRect(0,0,W,H); drawStars(); }
  function hudBar(){ X.fillStyle="rgba(4,9,20,.82)"; X.fillRect(0,0,W,40); }
  let shakeF=0,shakeAmt=0;
  function doShake(a){ shakeAmt=a; shakeF=14; }
  function applyShake(){ if(shakeF<=0)return; const s=shakeAmt*(shakeF/14); X.translate((Math.random()-.5)*s,(Math.random()-.5)*s); shakeF--; }
  function parts_upd(a){ for(let i=a.length-1;i>=0;i--){ const p=a[i]; p.x+=p.vx; p.y+=p.vy; p.vy+=.13; if(--p.life<=0)a.splice(i,1); } }
  function parts_drw(a){ X.save(); for(const p of a){ X.globalAlpha=Math.max(0,p.life/50); X.fillStyle=p.col; X.beginPath(); X.arc(p.x,p.y,p.r,0,Math.PI*2); X.fill(); } X.globalAlpha=1; X.restore(); }
  function boom(a,x,y,col,n){ for(let i=0;i<n;i++){const ang=Math.random()*Math.PI*2,sp=Math.random()*5+1; a.push({x,y,vx:Math.cos(ang)*sp,vy:Math.sin(ang)*sp-2,r:Math.random()*3.5+1.5,col,life:28+Math.random()*22}); } }
  function drawGameOver(score,hi){ X.fillStyle="rgba(4,8,18,.92)"; X.fillRect(0,0,W,H); X.fillStyle="#FF6B6B"; X.font="bold 34px system-ui,sans-serif"; X.textAlign="center"; X.fillText("Spillet er over!",W/2,H/2-70); X.fillStyle="#C8DCF8"; X.font="20px system-ui,sans-serif"; X.fillText("Poeng: "+score,W/2,H/2-20); const isN=score>0&&score>=hi; X.fillStyle=isN?"#FFCC00":"#506070"; X.font=(isN?"bold ":"")+"14px system-ui,sans-serif"; X.fillText(isN?"✦ Ny rekord! "+hi+" poeng":"Rekord: "+hi+" poeng",W/2,H/2+18); pulseBtn(W/2,H/2+80,"ENTER / klikk for å prøve igjen"); }
  function drawWin(score,hi,t){ X.fillStyle="rgba(4,8,18,.92)"; X.fillRect(0,0,W,H); X.fillStyle="#4CAF50"; X.font="bold 34px system-ui,sans-serif"; X.textAlign="center"; X.fillText(t||"Bra!",W/2,H/2-70); X.fillStyle="#C8DCF8"; X.font="20px system-ui,sans-serif"; X.fillText("Poeng: "+score,W/2,H/2-20); const isN=score>0&&score>=hi; X.fillStyle=isN?"#FFCC00":"#506070"; X.font=(isN?"bold ":"")+"14px system-ui,sans-serif"; X.fillText(isN?"✦ Ny rekord! "+hi+" poeng":"Rekord: "+hi+" poeng",W/2,H/2+18); pulseBtn(W/2,H/2+80,"ENTER / klikk for å spille igjen"); }

  // ── Question pool ────────────────────────────────────────────
  function buildPool(focus){
    const arr=[]; const diffs=["easy","medium","hard"];
    for(const d of diffs){ for(const q of EXERCISES.multipleChoice[d]){ if(focus&&focus!=="all"&&q.case!==focus)continue; arr.push({text:q.sentence,opts:[...q.options],ans:q.answer,explain:q.explanation,cat:q.case||""}); } }
    for(const d of diffs){ for(const q of EXERCISES.articleChoice[d]){ arr.push({text:q.sentence,opts:[...q.options],ans:q.answer,explain:q.explanation,tip:q.caseTip||"",cat:"artikel"}); } }
    return shuffle(arr);
  }
  function setQCard(text,tip,exp){ const e=document.getElementById("question-text"),t=document.getElementById("question-tip"),x=document.getElementById("question-explain"); if(e)e.textContent=text||""; if(t)t.textContent=tip||""; if(x){x.textContent=exp||""; x.style.display=exp?"block":"none";} }
  function showEl(id){const e=document.getElementById(id);if(e)e.style.display="";}
  function hideEl(id){const e=document.getElementById(id);if(e)e.style.display="none";}
  function getHi(k){return parseInt(localStorage.getItem(k)||"0");}
  function setHi(k,v){if(v>getHi(k))localStorage.setItem(k,v);}

  // ── Hub ──────────────────────────────────────────────────────
  let currentGame=null;
  function showHub(){ if(currentGame?.stop)currentGame.stop(); currentGame=null; tLeft=false; tRight=false; hideEl("game-play"); showEl("game-hub"); hideEl("game-touch"); hideEl("game-catch-touch"); hideEl("game-input-wrap"); const qc=document.getElementById("game-qcard"); if(qc)qc.style.display=""; setQCard("","",""); const xb=document.getElementById("xray-btn"); if(xb)xb.style.display="none"; }
  function launchGame(id){ hideEl("game-hub"); showEl("game-play"); const names={invaders:"Grammatikkforsvar",lynquiz:"Lynquiz",kortmatch:"Kortmatch",ordregn:"Ordregn",skriveduell:"Skriveduell",sorter:"Preposisjonssorter",hangman:"Tyggegummi"}; const el=document.getElementById("game-title"); if(el)el.textContent=names[id]||""; const map={invaders:g1,lynquiz:g2,kortmatch:g3,ordregn:g4,skriveduell:g5,sorter:g6,hangman:g7}; currentGame=map[id]; if(typeof Achievements!=="undefined")Achievements.recordGame(id); currentGame?.start?.(); }
  document.getElementById("back-btn")?.addEventListener("click",showHub);
  document.querySelectorAll(".game-select-card").forEach(c=>c.addEventListener("click",()=>launchGame(c.dataset.game)));

  // ████████████████████████████████████████████████████████████
  // SPILL 1 — GRAMMATIKKFORSVAR (Space Invaders++)
  // ████████████████████████████████████████████████████████████
  const g1=(()=>{
    const EW=118,EH=42,EGAP=12,SY=68,PY=H-54,PSPD=3.8,BSPD=9,EBSPD=3.2;
    let score,hi,lives,level,combo,dx,dxDir;
    let enemies,bullets,eBullets,parts,pups,exhaust;
    let shields; // [{x,y,alive}]
    let freezeT=0,bonus2xT=0,shootCD=0,eBullT=0;
    let state; // "play"|"gameover"|"levelup"|"boss"
    let boss,bossHP,bossBT,bossBullets,bossDir;
    let qPool,curQ,px;
    let invLqStreak=0;

    function mkEnemies(){
      curQ=qPool[Math.floor(Math.random()*qPool.length)];
      setQCard(curQ.text,curQ.tip||"","");
      let opts=shuffle([...curQ.opts]).slice(0,4);
      if(!opts.includes(curQ.ans)) opts[Math.floor(Math.random()*4)]=curQ.ans;
      const total=4,tW=total*EW+(total-1)*EGAP,sx=(W-tW)/2;
      return opts.map((o,i)=>({x:sx+i*(EW+EGAP),y:SY,label:o,correct:o===curQ.ans,alive:true}));
    }

    function mkShields(){
      const out=[],sy=H-118,bsz=13;
      [W*.2,W*.5,W*.8].forEach(cx=>{
        for(let c=0;c<4;c++) for(let r=0;r<2;r++) out.push({x:cx-bsz*2+c*bsz,y:sy+r*bsz,alive:true});
      });
      return out;
    }

    function resetLevel(){
      enemies=mkEnemies(); dx=0.75+level*.2; dxDir=1;
      bullets=[]; eBullets=[]; parts=[]; pups=[]; exhaust=[];
      shootCD=0; eBullT=Math.max(55,180-level*14);
      if(level%5===0&&level>0){ state="boss"; startBoss(); } else { state="play"; boss=null; }
    }

    function startBoss(){
      curQ=qPool[Math.floor(Math.random()*qPool.length)];
      setQCard(curQ.text,curQ.tip||"","");
      bossHP=3; bossBT=100; bossDir=1; boss={x:W/2-90,y:SY}; bossBullets=[];
    }

    function start(){
      score=0; lives=3; level=1; combo=1; invLqStreak=0;
      hi=getHi("g1_hi"); freezeT=0; bonus2xT=0; px=W/2;
      shields=mkShields();
      qPool=buildPool(getSetting("studyFocus","all"));
      resetLevel();
      showEl("game-touch"); hideEl("game-catch-touch"); hideEl("game-input-wrap");
      const qc=document.getElementById("game-qcard"); if(qc)qc.style.display="";
    }

    function stop(){ hideEl("game-touch"); setQCard("","",""); }

    function update(){
      frameN++;
      if(state==="play")   _updPlay();
      else if(state==="boss") _updBoss();
      if(shootCD>0)shootCD--;
    }

    function _spawnExhaust(){
      const cols=["#4488FF","#88AAFF","#FFAA22"];
      exhaust.push({x:px+(Math.random()*10-5),y:PY+18,vx:(Math.random()-.5)*.7,vy:Math.random()*2+.8,r:Math.random()*2.5+.8,col:cols[Math.floor(Math.random()*3)],life:18+Math.random()*10});
      if(exhaust.length>50)exhaust.shift();
    }

    function _shieldHit(bx,by){ for(let i=shields.length-1;i>=0;i--){ const s=shields[i]; if(!s.alive)continue; if(Math.abs(bx-s.x)<10&&Math.abs(by-s.y)<10){s.alive=false;sfx("shieldHit");return true;} } return false; }

    function _updPlay(){
      if((K.ArrowLeft||K.KeyA||tLeft)&&px>28) px-=PSPD;
      if((K.ArrowRight||K.KeyD||tRight)&&px<W-28) px+=PSPD;
      if(frameN%2===0) _spawnExhaust();

      // Enemy move
      if(freezeT>0){ freezeT--; } else {
        let bounce=false;
        for(const e of enemies.filter(e=>e.alive)){ e.x+=dx*dxDir; if(e.x+EW>W-4||e.x<4)bounce=true; if(e.y+EH>PY-12){lives=0;state="gameover";sfx("gameOver");return;} }
        if(bounce){ dxDir=-dxDir; for(const e of enemies)e.y+=16; }
      }

      // Enemy bullets
      if(--eBullT<=0){
        const alive=enemies.filter(e=>e.alive);
        if(alive.length){ const t=alive[Math.floor(Math.random()*alive.length)]; eBullets.push({x:t.x+EW/2,y:t.y+EH}); sfx("warning"); }
        eBullT=Math.max(45,90+Math.floor(Math.random()*60)-level*6);
      }

      // Player bullets
      for(let i=bullets.length-1;i>=0;i--){
        const b=bullets[i]; b.y-=BSPD;
        if(b.y<0){bullets.splice(i,1);continue;}
        if(_shieldHit(b.x,b.y)){bullets.splice(i,1);continue;}
        let hit=false;
        for(let j=enemies.length-1;j>=0;j--){
          const e=enemies[j]; if(!e.alive)continue;
          if(b.x>e.x&&b.x<e.x+EW&&b.y>e.y&&b.y<e.y+EH){
            bullets.splice(i,1); e.alive=false; hit=true;
            if(e.correct){
              const pts=100*combo*(bonus2xT>0?2:1); score+=pts; combo++; invLqStreak++;
              sfx("correct"); boom(parts,e.x+EW/2,e.y+EH/2,"#4488FF",12); rAns(true);
              if(score>=1000)uach("inv_1000");
              if(Math.random()<.3){const ts=["bomb","freeze","2x"];pups.push({x:e.x+EW/2,y:e.y+EH/2,vy:1.6,type:ts[Math.floor(Math.random()*3)]});}
              enemies.forEach(e=>e.alive=false); sfx("levelUp"); level++;
              if(level>=5)uach("inv_level5"); state="levelup"; setTimeout(()=>resetLevel(),900);
            } else {
              lives--; combo=1; invLqStreak=0; sfx("wrong"); boom(parts,e.x+EW/2,e.y+EH/2,"#FF4444",8); doShake(5); rAns(false);
              if(lives<=0){state="gameover";sfx("gameOver");return;}
            }
            break;
          }
        }
      }

      // Enemy bullets
      for(let i=eBullets.length-1;i>=0;i--){
        const b=eBullets[i]; b.y+=EBSPD;
        if(b.y>H){eBullets.splice(i,1);continue;}
        if(_shieldHit(b.x,b.y)){eBullets.splice(i,1);continue;}
        if(Math.abs(b.x-px)<18&&Math.abs(b.y-PY)<18){eBullets.splice(i,1);lives--;combo=1;sfx("explosion");doShake(8);boom(parts,px,PY,"#FF8844",10);if(lives<=0){state="gameover";sfx("gameOver");}}
      }

      // Power-ups
      for(let i=pups.length-1;i>=0;i--){
        const pu=pups[i]; pu.y+=pu.vy;
        if(pu.y>H){pups.splice(i,1);continue;}
        if(Math.abs(pu.x-px)<30&&Math.abs(pu.y-PY)<26){
          sfx("powerUp"); boom(parts,pu.x,pu.y,"#FFD700",12);
          if(pu.type==="bomb"){ enemies.forEach(e=>{if(e.alive){e.alive=false;boom(parts,e.x+EW/2,e.y+EH/2,"#FFAA22",8);}}); score+=200; sfx("bigExplosion"); if(enemies.every(e=>!e.alive)){level++;if(level>=5)uach("inv_level5");state="levelup";setTimeout(()=>resetLevel(),1500);}
          } else if(pu.type==="freeze"){ freezeT=180;
          } else if(pu.type==="2x"){ bonus2xT=600; }
          pups.splice(i,1);
        }
      }

      if(bonus2xT>0)bonus2xT--;
      parts_upd(exhaust); parts_upd(parts);
    }

    function _updBoss(){
      if((K.ArrowLeft||K.KeyA||tLeft)&&px>28) px-=PSPD;
      if((K.ArrowRight||K.KeyD||tRight)&&px<W-28) px+=PSPD;
      if(frameN%2===0) _spawnExhaust();
      boss.x+=bossDir*2.2;
      if(boss.x+180>W-4||boss.x<4)bossDir=-bossDir;
      if(--bossBT<=0){
        // Spread shot: 3 bullets
        const cx=boss.x+90;
        bossBullets.push({x:cx-30,y:boss.y+60,vx:-.5,vy:EBSPD});
        bossBullets.push({x:cx,y:boss.y+60,vx:0,vy:EBSPD+.5});
        bossBullets.push({x:cx+30,y:boss.y+60,vx:.5,vy:EBSPD});
        sfx("warning"); bossBT=90+Math.floor(Math.random()*60);
      }
      for(let i=bossBullets.length-1;i>=0;i--){
        const b=bossBullets[i]; b.x+=b.vx; b.y+=b.vy;
        if(b.y>H){bossBullets.splice(i,1);continue;}
        if(_shieldHit(b.x,b.y)){bossBullets.splice(i,1);continue;}
        if(Math.abs(b.x-px)<18&&Math.abs(b.y-PY)<18){bossBullets.splice(i,1);lives--;sfx("explosion");doShake(8);boom(parts,px,PY,"#FF8844",10);if(lives<=0){state="gameover";sfx("gameOver");return;}}
      }
      for(let i=bullets.length-1;i>=0;i--){
        const b=bullets[i]; b.y-=BSPD;
        if(b.y<0){bullets.splice(i,1);continue;}
        if(b.x>boss.x&&b.x<boss.x+180&&b.y>boss.y&&b.y<boss.y+60){
          bullets.splice(i,1); bossHP--; sfx("bossHit"); doShake(6); boom(parts,b.x,boss.y+30,"#FF8800",16);
          score+=500*(bonus2xT>0?2:1);
          if(bossHP<=0){ sfx("bigExplosion"); boom(parts,boss.x+90,boss.y+30,"#FFDD00",30); uach("inv_boss"); level++; state="levelup"; setTimeout(()=>{shields=mkShields();resetLevel();},1800); }
        }
      }
      if(bonus2xT>0)bonus2xT--;
      parts_upd(exhaust); parts_upd(parts);
    }

    function draw(){
      X.save(); drawBg(); applyShake();
      // Exhaust
      parts_drw(exhaust);
      // Player
      X.fillStyle="#4499FF"; X.beginPath(); X.moveTo(px,PY-18); X.lineTo(px+14,PY+10); X.lineTo(px,PY+4); X.lineTo(px-14,PY+10); X.closePath(); X.fill();
      X.fillStyle="#88CCFF"; X.fillRect(px-3,PY-22,6,10);
      // Shields
      for(const s of shields){ if(!s.alive)continue; X.fillStyle="#1A7A3A"; X.fillRect(s.x-5,s.y-5,12,12); }
      // Enemies or boss
      if(state==="boss"||state==="gameover"&&boss){
        // Boss
        if(boss){
          const bx=boss.x,by=boss.y;
          X.fillStyle="#8B0000"; rr(bx,by,180,60,10); X.fill();
          X.strokeStyle="#FF4444"; X.lineWidth=2; X.stroke();
          // HP bar
          X.fillStyle="#333"; X.fillRect(bx,by-14,180,8);
          X.fillStyle="#FF4444"; X.fillRect(bx,by-14,180*(bossHP/3),8);
          X.fillStyle="#FFAAAA"; X.font="bold 13px system-ui,sans-serif"; X.textAlign="center"; X.fillText("SJEFs-FIENDE",bx+90,by+22);
          X.fillStyle="#FFD700"; X.font="bold 17px system-ui,sans-serif"; X.fillText(curQ?.ans||"",bx+90,by+46);
          // Boss bullets
          X.fillStyle="#FF8800";
          for(const b of bossBullets){ X.beginPath(); X.arc(b.x,b.y,5,0,Math.PI*2); X.fill(); }
        }
      } else {
        for(const e of enemies){
          if(!e.alive)continue;
          X.fillStyle="#1C3D7A";
          rr(e.x,e.y,EW,EH,6); X.fill();
          X.strokeStyle="#3A5A8A"; X.lineWidth=1.5; X.stroke();
          X.fillStyle="#C8DCF8"; X.font="bold 14px system-ui,sans-serif"; X.textAlign="center";
          X.fillText(e.label,e.x+EW/2,e.y+EH/2+5);
        }
      }
      // Player bullets
      X.fillStyle="#88FFAA";
      for(const b of bullets) X.fillRect(b.x-2,b.y-8,4,14);
      // Enemy bullets
      X.fillStyle="#FF5555";
      for(const b of eBullets){ X.beginPath(); X.arc(b.x,b.y,4,0,Math.PI*2); X.fill(); }
      // Power-ups
      for(const pu of pups){ const lbl=pu.type==="bomb"?"💣":pu.type==="freeze"?"❄":"⚡"; X.font="20px system-ui,sans-serif"; X.textAlign="center"; X.fillText(lbl,pu.x,pu.y+8); X.save(); X.shadowColor="#FFD700"; X.shadowBlur=10; X.beginPath(); X.arc(pu.x,pu.y,15,0,Math.PI*2); X.strokeStyle="#FFD700"; X.lineWidth=1.5; X.stroke(); X.restore(); }
      parts_drw(parts);
      // HUD
      hudBar();
      X.fillStyle="#C8DCF8"; X.font="bold 13px system-ui,sans-serif"; X.textAlign="left"; X.fillText("Poeng: "+score,12,26);
      for(let i=0;i<lives;i++){ X.fillStyle="#FF6B6B"; X.font="14px system-ui"; X.fillText("♥",110+i*20,27); }
      X.fillStyle="#C8DCF8"; X.font="13px system-ui,sans-serif"; X.textAlign="center"; X.fillText(state==="boss"?"👾 SJEF":"Nivå "+level,W/2,26);
      if(combo>1){ X.fillStyle="#FFD700"; X.textAlign="right"; X.fillText("x"+combo+" kombo",W-12,26); }
      if(bonus2xT>0){ X.fillStyle="#FFD700"; X.font="11px system-ui"; X.textAlign="center"; X.fillText("2x POENG ("+Math.ceil(bonus2xT/60)+"s)",W/2,H-12); }
      if(freezeT>0){ X.fillStyle="#88CCFF"; X.font="11px system-ui"; X.textAlign="center"; X.fillText("❄ FROSSEN ("+Math.ceil(freezeT/60)+"s)",W/2,H-28); }
      X.fillStyle="#506070"; X.font="11px system-ui"; X.textAlign="right"; X.fillText("Rek: "+getHi("g1_hi"),W-12,38);
      if(state==="levelup"){ X.fillStyle="rgba(4,8,18,.75)"; X.fillRect(0,0,W,H); X.fillStyle="#4CAF50"; X.font="bold 28px system-ui,sans-serif"; X.textAlign="center"; X.fillText("Nivå "+(level-1)+" fullført!",W/2,H/2-10); X.fillStyle="#C8DCF8"; X.font="16px system-ui"; X.fillText("Neste nivå starter snart...",W/2,H/2+28); }
      if(state==="gameover"){ const h=getHi("g1_hi"); setHi("g1_hi",score); drawGameOver(score,Math.max(h,score)); }
      X.restore();
    }

    function onKey(code){
      if(code==="Space"||code==="Enter"){
        if(state==="gameover"){start();return;}
        if(state!=="play"&&state!=="boss")return;
        if(shootCD>0)return;
        bullets.push({x:px,y:PY-22}); shootCD=18; sfx("shoot");
      }
    }
    function onClick(x,y){ if(state==="gameover")start(); }
    return {start,stop,update,draw,onKey,onClick};
  })();

  // ████████████████████████████████████████████████████████████
  // SPILL 2 — LYNQUIZ (Streak multiplier + arc timer + double-or-nothing)
  // ████████████████████████████████████████████████████████████
  const g2=(()=>{
    const TOTAL=20;
    let score,hi,streak,mult,wrong,pool,idx,tLeft2,state;
    let timerMax,timerLeft;
    let phase; // "question"|"feedback"|"double"|"done"
    let feedbackTmr,feedbackCorrect,correctIdx,chosenIdx;
    let doublesOffered=0,lqStreak=0;
    const OX=[80,370],OY=[148,258],OW=195,OH=72;

    function pickOpts(q){ return [{t:q.opts[0],i:0},{t:q.opts[1],i:1},{t:q.opts[2],i:2},{t:q.opts[3],i:3}]; }
    function getCorrectIdx(q,opts){ return opts.findIndex(o=>o.t===q.ans); }

    function loadQ(){
      if(idx>=pool.length){pool=shuffle(pool);idx=0;}
      const q=pool[idx];
      const opts=shuffle([{t:q.opts[0],i:0},{t:q.opts[1],i:1},{t:q.opts[2],i:2},{t:q.opts[3],i:3}]);
      curOpts=opts; curQ2=q; correctIdx=opts.findIndex(o=>o.t===q.ans);
      timerLeft=timerMax; phase="question"; feedbackTmr=0; chosenIdx=-1;
      setQCard("","","");
    }

    let curOpts=[],curQ2={};

    function start(){
      score=0; streak=0; mult=1; wrong=0; lqStreak=0; doublesOffered=0; idx=0;
      hi=getHi("g2_hi");
      timerMax=getSetting("lqTimerSeconds",null)||8;
      if(typeof Settings!=="undefined")timerMax=Settings.lqTimerSeconds?.()??8;
      pool=buildPool(getSetting("studyFocus","all"));
      pool=shuffle(pool); state="play"; phase="choose"; // category choose phase
      hideEl("game-touch"); hideEl("game-catch-touch"); hideEl("game-input-wrap");
      const qc=document.getElementById("game-qcard"); if(qc)qc.style.display="none";
    }

    function stop(){ const qc=document.getElementById("game-qcard"); if(qc)qc.style.display=""; }

    let _doubleMode=false,_doubleScore=0;

    function answer(i){
      if(phase!=="question")return;
      chosenIdx=i; feedbackCorrect=(i===correctIdx);
      if(_doubleMode){
        _doubleMode=false;
        if(feedbackCorrect){score=_doubleScore*2;uach("lq_double");sfx("correct");}else{score=0;sfx("wrong");}
        streak=0;mult=1;
      } else {
        if(feedbackCorrect){const pts=Math.ceil(50+timerLeft/timerMax*100)*mult;score+=pts;streak++;lqStreak++;mult=Math.min(4,1+Math.floor(streak/3));rAns(true);sfx("correct");if(lqStreak>=10)uach("lq_streak10");}
        else{streak=0;mult=1;lqStreak=0;wrong++;rAns(false);sfx("wrong");}
      }
      phase="feedback"; feedbackTmr=feedbackCorrect?45:95;
      idx++;
    }

    function update(){
      frameN++;
      if(state!=="play")return;
      if(phase==="choose")return;
      if(phase==="question"){ timerLeft=Math.max(0,timerLeft-1/60); if(timerLeft<=0){answer(999);} }
      if(phase==="feedback"){ if(--feedbackTmr<=0){ if(idx>=TOTAL){state="done";setHi("g2_hi",score);if(wrong===0)uach("lq_perfect");}else{ if(feedbackCorrect&&streak%5===0&&streak>0&&doublesOffered<2){ phase="double"; doublesOffered++; } else loadQ(); } } }
    }

    function draw(){
      X.save(); drawBg();
      if(state==="play"&&phase==="choose"){
        X.fillStyle="#C8DCF8"; X.font="bold 22px system-ui,sans-serif"; X.textAlign="center"; X.fillText("Velg kategori",W/2,72);
        X.fillStyle="#7090A8"; X.font="14px system-ui"; X.fillText("Hvilke preposisjoner vil du øve på?",W/2,102);
        // Layout: i=0→(160,160) i=1→(160,240) i=2→(480,160) i=3→(480,240)
        const cats=[{v:"all",l:"Alle preposisjoner"},{v:"akkusativ",l:"Akkusativ"},{v:"dativ",l:"Dativ"},{v:"wechsel",l:"Wechsel"}];
        cats.forEach((c,i)=>{ const cx=i<2?160:480,cy=i%2===0?160:240; X.fillStyle="#1C3D7A"; rr(cx-110,cy-26,220,52,10); X.fill(); X.strokeStyle="#3A6AAA"; X.lineWidth=1.5; X.stroke(); X.fillStyle="#C8DCF8"; X.font="bold 15px system-ui,sans-serif"; X.textAlign="center"; X.fillText(c.l,cx,cy+6); });
        // Sync: click checks (50,134),(50,214),(370,134),(370,214) matching above boxes
        X.fillStyle="#506070"; X.font="12px system-ui"; X.textAlign="center"; X.fillText("Klikk for å velge",W/2,330);
      } else if(state==="play"&&(phase==="question"||phase==="feedback")){
        // Arc timer
        const pct=timerLeft/timerMax;
        const tc=pct>.5?"#4CAF50":pct>.25?"#FFCC00":"#FF4444";
        X.strokeStyle="rgba(255,255,255,.1)"; X.lineWidth=8; X.beginPath(); X.arc(W-36,30,22,-.5*Math.PI,1.5*Math.PI); X.stroke();
        X.strokeStyle=tc; X.lineWidth=8; X.beginPath(); X.arc(W-36,30,22,-.5*Math.PI,-.5*Math.PI+Math.PI*2*pct); X.stroke();
        X.fillStyle=tc; X.font="bold 13px system-ui,sans-serif"; X.textAlign="center"; X.fillText(Math.ceil(timerLeft),W-36,35);
        // Question text
        const qtext=curQ2?.text||"";
        X.fillStyle="#EBEBEF"; X.font="bold 17px system-ui,sans-serif"; X.textAlign="center";
        // Word wrap
        const words=qtext.split(" "); let line=""; let lineY=H/2-48;
        for(const w of words){ const test=line+" "+w; if(X.measureText(test).width>560&&line){ X.fillText(line.trim(),W/2,lineY); line=" "+w; lineY+=24; }else line=test; }
        if(line)X.fillText(line.trim(),W/2,lineY);
        // 4 option boxes
        const cols2=[[80,370],[80,370]];
        const rows2=[148,258];
        curOpts.forEach((o,i)=>{
          const ox=cols2[i%2][0]+(i%2)*0,oy=rows2[Math.floor(i/2)];
          const cx=i<2?OX[0]+OW/2:OX[1]+OW/2,cy=i<2?OY[0]:OY[1];
          const isAns=i===correctIdx, isChosen=i===chosenIdx;
          let bg="#1C3D7A",border="#3A6AAA";
          if(phase==="feedback"){ if(isAns){bg="#1A6A2A";border="#4CAF50";} else if(isChosen){bg="#5A1A1A";border="#FF4444";} }
          X.fillStyle=bg; const bx=i%2===0?OX[0]:OX[1],by=i<2?OY[0]:OY[1]; rr(bx,by,OW,OH,10); X.fill();
          X.strokeStyle=border; X.lineWidth=1.5; X.stroke();
          X.fillStyle="#90A8C8"; X.font="bold 11px system-ui"; X.textAlign="left"; X.fillText((i+1)+"",bx+10,by+20);
          X.fillStyle="#EBEBEF"; X.font="bold 16px system-ui,sans-serif"; X.textAlign="center"; X.fillText(o.t,bx+OW/2,by+OH/2+6);
        });
        // Streak + multiplier
        hudBar();
        X.fillStyle="#C8DCF8"; X.font="bold 13px system-ui,sans-serif"; X.textAlign="left"; X.fillText("Poeng: "+score,12,26);
        X.fillStyle="#C8DCF8"; X.font="13px system-ui"; X.textAlign="center"; X.fillText("Spørsmål "+(Math.min(idx+1,TOTAL))+" / "+TOTAL,W/2,26);
        if(mult>1){ const p=.5+.5*Math.sin(frameN*.15); X.fillStyle=`rgba(255,${180+50*p},0,1)`; X.font="bold 13px system-ui"; X.textAlign="right"; X.fillText("×"+mult+" multiplier",W-70,26); }
        X.fillStyle="#506070"; X.font="11px system-ui"; X.textAlign="right"; X.fillText("Rek: "+getHi("g2_hi"),W-12,38);
        // Streak fire dots
        const dotY=H-18;
        for(let i=0;i<10;i++){ const lit=i<(streak%10); X.fillStyle=lit?"#FF8800":"rgba(255,255,255,.15)"; X.beginPath(); X.arc(W/2-90+i*20,dotY,5,0,Math.PI*2); X.fill(); }
        if(phase==="feedback"&&!feedbackCorrect&&curQ2?.explain){ X.fillStyle="rgba(4,8,18,.7)"; X.fillRect(0,H-52,W,52); X.fillStyle="#FFCC00"; X.font="13px system-ui"; X.textAlign="center"; X.fillText(curQ2.explain,W/2,H-18); }
      } else if(state==="play"&&phase==="double"){
        X.fillStyle="rgba(4,8,18,.92)"; X.fillRect(0,0,W,H);
        X.fillStyle="#FFD700"; X.font="bold 28px system-ui,sans-serif"; X.textAlign="center"; X.fillText("Dobbelt eller ingenting?",W/2,110);
        X.fillStyle="#C8DCF8"; X.font="18px system-ui"; X.fillText("Nåværende poeng: "+score,W/2,155);
        X.fillStyle="#7090A8"; X.font="14px system-ui"; X.fillText("Svar riktig på neste spørsmål: poengene dobles!",W/2,195);
        X.fillStyle="#7090A8"; X.font="13px system-ui"; X.fillText("Feil svar: alle poengene mistes.",W/2,220);
        pulseBtnPlain(W/2-100,290,"JA – Doble!","#15623A");
        pulseBtnPlain(W/2+100,290,"NEI – Behold","#174FA8");
      } else if(state==="done"){
        const pct2=wrong===0?100:Math.round((TOTAL-wrong)/TOTAL*100);
        drawWin(score,getHi("g2_hi"),"Quiz fullført! "+pct2+"% riktig");
      }
      X.restore();
    }

    function onClick(x,y){
      if(state==="play"&&phase==="choose"){
        // Buttons: i=0(160,160) i=1(160,240) i=2(480,160) i=3(480,240)
        const cats=["all","akkusativ","dativ","wechsel"];
        const coords=[[50,134,220,52],[50,214,220,52],[370,134,220,52],[370,214,220,52]];
        for(let i=0;i<4;i++){const [bx,by,bw,bh]=coords[i];if(x>bx&&x<bx+bw&&y>by&&y<by+bh){pool=buildPool(cats[i]==="all"?null:cats[i]);if(!pool.length)pool=buildPool(null);pool=shuffle(pool);loadQ();state="play";return;}}
      }
      if(state==="play"&&phase==="question"){
        curOpts.forEach((o,i)=>{ const bx=i%2===0?OX[0]:OX[1],by=i<2?OY[0]:OY[1]; if(x>bx&&x<bx+OW&&y>by&&y<by+OH)answer(i); });
      }
      if(state==="play"&&phase==="double"){
        if(x>W/2-200&&x<W/2&&y>268&&y<312){ // JA
          sfx("doubleOrN"); _doubleMode=true; _doubleScore=score; loadQ();
        } else if(x>W/2&&x<W/2+200&&y>268&&y<312){ // NEI
          loadQ();
        }
      }
      if(state==="done")start();
    }
    function onKey(code){
      if(state==="done"&&code==="Enter")start();
      if(state==="play"&&phase==="question"){ if(code==="Digit1"||code==="Numpad1")answer(0); if(code==="Digit2"||code==="Numpad2")answer(1); if(code==="Digit3"||code==="Numpad3")answer(2); if(code==="Digit4"||code==="Numpad4")answer(3); }
    }
    return {start,stop,update,draw,onKey,onClick};
  })();

  // ████████████████████████████████████████████████████████████
  // SPILL 3 — KORTMATCH (Memory + preview + flip + x-ray + stars)
  // ████████████████████████████████████████████████████████████
  const g3=(()=>{
    const PAIRS_ALL=[
      {de:"durch",no:"gjennom"},{de:"für",no:"for"},{de:"gegen",no:"mot"},
      {de:"ohne",no:"uten"},{de:"um",no:"rundt"},{de:"aus",no:"fra/ut av"},
      {de:"bei",no:"hos/ved"},{de:"mit",no:"med"},{de:"nach",no:"til"},
      {de:"seit",no:"siden"},{de:"von",no:"fra/av"},{de:"zu",no:"til (person)"},
      {de:"außer",no:"unntatt"},{de:"an",no:"ved/på"},{de:"auf",no:"på (horiz.)"},
      {de:"hinter",no:"bak"},{de:"in",no:"i/inn i"},{de:"neben",no:"ved siden av"},
      {de:"über",no:"over"},{de:"unter",no:"under"},{de:"vor",no:"foran"},{de:"zwischen",no:"mellom"},
    ];
    let cards=[],flipped=[],locked=false,score,moves,hi;
    let phase; // "select"|"preview"|"play"|"done"
    let previewTimer=0;
    let cols,rows,CW,CH,CG,startX,startY;
    let xrayUsed=false,xrayTimer=0;
    let matchedCombo=0,comboText="",comboAlpha=0;
    let difficulty="easy"; // easy=6pairs, medium=8, hard=10
    let stars=0;

    const DIFF_CFG={easy:{pairs:6,cols:4,rows:3},medium:{pairs:8,cols:4,rows:4},hard:{pairs:10,cols:5,rows:4}};

    function buildCards(diff){
      const cfg=DIFF_CFG[diff];
      const chosen=shuffle(PAIRS_ALL).slice(0,cfg.pairs);
      const arr=[];
      chosen.forEach((p,id)=>{
        arr.push({id,side:"de",label:p.de,pairId:id,matched:false,faceUp:false,flipAnim:0,flipDir:0});
        arr.push({id:id+100,side:"no",label:p.no,pairId:id,matched:false,faceUp:false,flipAnim:0,flipDir:0});
      });
      return shuffle(arr);
    }

    function calcLayout(diff){
      const cfg=DIFF_CFG[diff];
      cols=cfg.cols; rows=cfg.rows;
      CG=10; CW=Math.floor((W-40-CG*(cols-1))/cols); CH=Math.floor((H-80-CG*(rows-1))/rows);
      startX=(W-cols*CW-(cols-1)*CG)/2; startY=50;
    }

    function cardRect(i){ const c=i%cols,r=Math.floor(i/cols); return {x:startX+c*(CW+CG),y:startY+r*(CH+CG),w:CW,h:CH}; }

    function start(){
      phase="select"; score=0; moves=0; hi=getHi("g3_hi");
      xrayUsed=false; xrayTimer=0; matchedCombo=0; comboText=""; comboAlpha=0;
      hideEl("game-touch"); hideEl("game-catch-touch"); hideEl("game-input-wrap");
      const xb=document.getElementById("xray-btn"); if(xb)xb.style.display="none";
      const qc=document.getElementById("game-qcard"); if(qc)qc.style.display="none";
    }

    function stop(){
      const xb=document.getElementById("xray-btn"); if(xb)xb.style.display="none";
      const qc=document.getElementById("game-qcard"); if(qc)qc.style.display="";
    }

    function startGame(diff){
      difficulty=diff; calcLayout(diff);
      cards=buildCards(diff); flipped=[]; locked=false;
      phase="preview"; previewTimer=180; // 3 seconds at 60fps
      cards.forEach(c=>c.faceUp=true);
      const xb=document.getElementById("xray-btn"); if(xb){xb.style.display=""; xb.textContent="🔍 Røntgen";}
    }

    function update(){
      frameN++;
      if(phase==="preview"){ if(--previewTimer<=0){cards.forEach(c=>c.faceUp=false);phase="play";} }
      if(xrayTimer>0){ xrayTimer--; if(xrayTimer===0){cards.forEach(c=>{if(!c.matched)c.faceUp=false;});} }
      if(comboAlpha>0)comboAlpha-=.02;
      // Animate flipping cards
      for(const c of cards){ if(c.flipAnim>0){c.flipAnim=Math.max(0,c.flipAnim-.08);} }
    }

    function draw(){
      X.save(); drawBg();
      if(phase==="select"){
        X.fillStyle="#C8DCF8"; X.font="bold 22px system-ui,sans-serif"; X.textAlign="center"; X.fillText("Kortmatch",W/2,72);
        X.fillStyle="#7090A8"; X.font="14px system-ui"; X.fillText("Velg vanskelighetsgrad",W/2,102);
        const diffs=[{k:"easy",l:"Lett",sub:"4×3 – 6 par"},{k:"medium",l:"Middels",sub:"4×4 – 8 par"},{k:"hard",l:"Vanskelig",sub:"5×4 – 10 par"}];
        diffs.forEach((d,i)=>{ const cx=W/2,cy=170+i*70; X.fillStyle="#1C3D7A"; rr(cx-120,cy-28,240,56,10); X.fill(); X.strokeStyle="#3A6AAA"; X.lineWidth=1.5; X.stroke(); X.fillStyle="#C8DCF8"; X.font="bold 16px system-ui,sans-serif"; X.textAlign="center"; X.fillText(d.l,cx,cy+3); X.fillStyle="#7090A8"; X.font="12px system-ui"; X.fillText(d.sub,cx,cy+22); });
      } else if(phase==="preview"||phase==="play"||phase==="done"){
        // Cards
        cards.forEach((c,i)=>{
          const {x,y,w,h}=cardRect(i);
          const flipW=c.flipAnim>0?(1-2*Math.abs(c.flipAnim-.5))*w:w;
          const ox=x+(w-flipW)/2;
          if(c.matched){ X.fillStyle="#1A6A2A"; rr(ox,y,flipW,h,6); X.fill(); X.strokeStyle="#4CAF50"; X.lineWidth=1.5; X.stroke(); X.fillStyle="#88FF88"; X.font="bold "+Math.round(12*Math.min(1,flipW/w))+"px system-ui,sans-serif"; X.textAlign="center"; X.fillText(c.label,x+w/2,y+h/2+5); }
          else if(c.faceUp||xrayTimer>0){ X.fillStyle=flipped.includes(i)?"#1C3A7A":"#192840"; rr(ox,y,flipW,h,6); X.fill(); X.strokeStyle=flipped.includes(i)?"#5A8AFF":"#3A5A8A"; X.lineWidth=1.5; X.stroke(); if(flipW>w*.5){ X.fillStyle="#C8DCF8"; X.font="bold "+Math.round(13*Math.min(1,flipW/w))+"px system-ui,sans-serif"; X.textAlign="center"; X.fillText(c.label,x+w/2,y+h/2+5); } }
          else { X.fillStyle="#111820"; rr(x,y,w,h,6); X.fill(); X.strokeStyle="#2A3A4A"; X.lineWidth=1; X.stroke(); X.fillStyle="#2A4060"; X.font="18px system-ui"; X.textAlign="center"; X.fillText("?",x+w/2,y+h/2+6); }
        });
        // Preview countdown
        if(phase==="preview"){ X.fillStyle="rgba(4,8,18,.6)"; X.fillRect(0,H-46,W,46); X.fillStyle="#FFCC00"; X.font="bold 16px system-ui,sans-serif"; X.textAlign="center"; X.fillText("Husk kortene! Starter om "+Math.ceil(previewTimer/60)+" sek...",W/2,H-18); }
        // Combo text
        if(comboAlpha>0){ X.globalAlpha=comboAlpha; X.fillStyle="#FFD700"; X.font="bold 22px system-ui,sans-serif"; X.textAlign="center"; X.fillText(comboText,W/2,H/2-40); X.globalAlpha=1; }
        // HUD
        hudBar();
        X.fillStyle="#C8DCF8"; X.font="bold 13px system-ui,sans-serif"; X.textAlign="left"; X.fillText("Trekk: "+moves,12,26);
        const matched=cards.filter(c=>c.matched).length/2; const total=cards.length/2;
        X.fillStyle="#C8DCF8"; X.font="13px system-ui"; X.textAlign="center"; X.fillText("Par: "+matched+" / "+total,W/2,26);
        X.fillStyle="#506070"; X.font="11px system-ui"; X.textAlign="right"; X.fillText("Rek: "+getHi("g3_hi"),W-12,38);
        if(xrayTimer>0){ X.fillStyle="#FFCC00"; X.font="11px system-ui"; X.textAlign="right"; X.fillText("🔍 "+Math.ceil(xrayTimer/60)+"s",W-12,H-12); }
        if(phase==="done"){
          // Star rating
          const minMoves=cards.length/2;
          const efficiency=minMoves/moves;
          stars=efficiency>=1?3:efficiency>=.7?2:1;
          drawWin(score,getHi("g3_hi"),"Fullført! "+stars+" stjerner");
          // Draw stars
          for(let i=0;i<3;i++){ X.font="28px system-ui"; X.fillStyle=i<stars?"#FFD700":"rgba(255,255,255,.2)"; X.textAlign="center"; X.fillText("★",W/2-40+i*40,H/2+68); }
        }
      }
      X.restore();
    }

    function flipCard(i){
      const c=cards[i]; if(c.matched||c.faceUp||locked||flipped.length>=2)return;
      c.faceUp=true; c.flipAnim=1; flipped.push(i); sfx("flip");
      if(flipped.length===2){
        moves++;
        const a=cards[flipped[0]],b=cards[flipped[1]];
        if(a.pairId===b.pairId){ // match!
          a.matched=true; b.matched=true; sfx("match"); matchedCombo++; rAns(true);
          if(matchedCombo>=3){comboText="🔥 "+matchedCombo+"× kombo!";comboAlpha=1.5;sfx("combo");}
          flipped=[];
          const allDone=cards.every(c=>c.matched);
          if(allDone){ score=Math.max(0,500-moves*10); setHi("g3_hi",score); sfx("win"); phase="done"; if(moves<=cards.length/2)uach("mem_perfect"); const xb=document.getElementById("xray-btn"); if(xb)xb.style.display="none"; }
        } else {
          locked=true; matchedCombo=0; sfx("wrong"); rAns(false);
          setTimeout(()=>{ cards[flipped[0]].faceUp=false; cards[flipped[1]].faceUp=false; flipped=[]; locked=false; },900);
        }
      }
    }

    function onClick(x,y){
      if(phase==="select"){
        const diffs=["easy","medium","hard"];
        diffs.forEach((d,i)=>{ if(x>W/2-120&&x<W/2+120&&y>142+i*70&&y<198+i*70)startGame(d); });
      } else if(phase==="play"||phase==="preview"){
        if(phase==="play") cards.forEach((_,i)=>{ const {x:cx,y:cy,w,h}=cardRect(i); if(x>cx&&x<cx+w&&y>cy&&y<cy+h)flipCard(i); });
      } else if(phase==="done"){ start(); }
    }

    // X-ray button (DOM)
    const xBtn=document.getElementById("xray-btn");
    if(xBtn){ xBtn.addEventListener("click",()=>{ if(xrayUsed||phase!=="play")return; xrayUsed=true; uach("mem_xray"); cards.forEach(c=>{if(!c.matched)c.faceUp=true;}); xrayTimer=90; xBtn.textContent="🔍 Brukt"; xBtn.disabled=true; sfx("powerUp"); }); }

    function onKey(code){ if(phase==="done"&&code==="Enter")start(); }
    return {start,stop,update,draw,onKey,onClick};
  })();

  // ████████████████████████████████████████████████████████████
  // SPILL 4 — ORDREGN (Word Catcher + wind + power-ups + floaters)
  // ████████████████████████████████████████████████████████████
  const g4=(()=>{
    const BW=120,BH=28,BY=H-38;
    const BUBBLE_R=32;
    let score,hi,lives,combo,state,bx,bspd,pool;
    let bubbles=[],floaters=[],parts=[];
    let windDir=1,windStr=0.2,windTmr=0;
    let powerActive=null,powerTmr=0;
    let totalCaught=0;

    function mkBubble(){
      const q=pool[Math.floor(Math.random()*pool.length)];
      const isPow=Math.random()<.12;
      if(isPow){ const t=Math.random()<.33?"life":Math.random()<.5?"slow":"double"; return {x:Math.random()*(W-80)+40,y:-BUBBLE_R,vy:.9+combo*.08,wx:0,label:t==="life"?"♥":t==="slow"?"❄":"💎",isPow:true,powType:t,pairId:-1,correct:false}; }
      const opts=shuffle([...q.opts]).slice(0,4); if(!opts.includes(q.ans))opts[Math.floor(Math.random()*4)]=q.ans;
      return {x:Math.random()*(W-80)+40,y:-BUBBLE_R,vy:.75+combo*.09+Math.random()*.3,wx:0,label:q.ans,correct:true,q,pairId:Math.random()};
    }
    function addWrong(q){ const opts=shuffle([...q.opts]).filter(o=>o!==q.ans).slice(0,1); opts.forEach(o=>bubbles.push({x:Math.random()*(W-80)+40,y:-BUBBLE_R-Math.random()*60,vy:.5+combo*.06,wx:0,label:o,correct:false,q,pairId:Math.random()})); }
    function spawnQuestion(){ const q=pool[Math.floor(Math.random()*pool.length)]; bubbles.push({x:Math.random()*(W-80)+40,y:-BUBBLE_R,vy:.5+combo*.07+Math.random()*.2,wx:0,label:q.ans,correct:true,q,pairId:Math.random()}); addWrong(q); const cat=q.cat?q.cat.charAt(0).toUpperCase()+q.cat.slice(1):""; setQCard("Fang riktig preposisjon!",cat?"Kasus: "+cat:"",""); }

    function start(){
      score=0; lives=3; combo=0; bx=W/2-BW/2; bspd=3.5; state="play";
      hi=getHi("g4_hi"); bubbles=[]; floaters=[]; parts=[];
      windDir=1; windStr=.2; windTmr=200; powerActive=null; powerTmr=0;
      totalCaught=typeof Achievements!=="undefined"?Achievements.getCatchCount():0;
      pool=buildPool(getSetting("studyFocus","all"));
      hideEl("game-touch"); showEl("game-catch-touch"); hideEl("game-input-wrap");
      const qc=document.getElementById("game-qcard"); if(qc)qc.style.display="";
      spawnQuestion();
    }

    function stop(){ hideEl("game-catch-touch"); const qc=document.getElementById("game-qcard"); if(qc)qc.style.display=""; }

    function update(){
      frameN++;
      if(state!=="play")return;
      // Basket
      const bs=BW+(combo>=5?18:combo>=3?9:0);
      if((K.ArrowLeft||K.KeyA||tLeft)&&bx>10) bx-=bspd;
      if((K.ArrowRight||K.KeyD||tRight)&&bx<W-bs-10) bx+=bspd;
      // Wind
      if(--windTmr<=0){ windDir=-windDir; windStr=.1+Math.random()*.35; windTmr=200+Math.floor(Math.random()*200); }
      // Power timer
      if(powerTmr>0)powerTmr--;
      else powerActive=null;
      // Bubble move
      const spd=powerActive==="slow"?.35:1;
      for(let i=bubbles.length-1;i>=0;i--){
        const b=bubbles[i]; b.x+=windDir*windStr*spd; b.y+=b.vy*spd;
        if(b.x<BUBBLE_R)b.x=BUBBLE_R; if(b.x>W-BUBBLE_R)b.x=W-BUBBLE_R;
        // Catch check
        const bsz=BW+(combo>=5?18:combo>=3?9:0);
        if(b.y+BUBBLE_R>=BY&&b.x>bx-10&&b.x<bx+bsz+10){
          bubbles.splice(i,1);
          if(b.isPow){ sfx("catchPow"); boom(parts,b.x,BY,"#FFD700",15); if(b.powType==="life"&&lives<5){lives++;} else if(b.powType==="slow"){powerActive="slow";powerTmr=180;} else if(b.powType==="double"){powerActive="double";powerTmr=300;} }
          else if(b.correct){ const pts=100*(powerActive==="double"?2:1); score+=pts; combo++; sfx("correct"); boom(parts,b.x,BY,"#4488FF",10); floaters.push({x:b.x,y:BY-20,text:"+"+pts,vy:-2,alpha:1}); rAns(true); if(typeof Achievements!=="undefined"){Achievements.recordCatch();} if(combo>=5)sfx("combo"); }
          else { lives--; combo=0; sfx("wrong"); doShake(5); rAns(false); if(lives<=0){state="gameover";sfx("gameOver");setHi("g4_hi",score);return;} }
        }
        // Missed
        if(b.y>H+BUBBLE_R){ bubbles.splice(i,1); if(b.correct){lives--;combo=0;sfx("wrong");doShake(4);if(lives<=0){state="gameover";sfx("gameOver");setHi("g4_hi",score);return;}} }
      }
      // Spawn new bubbles
      if(bubbles.filter(b=>b.correct).length===0){ spawnQuestion(); }
      if(bubbles.length<4&&Math.random()<.03){ const q=pool[Math.floor(Math.random()*pool.length)]; bubbles.push({x:Math.random()*(W-80)+40,y:-BUBBLE_R,vy:.7+combo*.08,wx:0,label:q.opts[Math.floor(Math.random()*q.opts.length)],correct:false,pairId:Math.random()}); }
      // Floaters
      for(let i=floaters.length-1;i>=0;i--){ const f=floaters[i]; f.y+=f.vy; f.alpha-=.025; if(f.alpha<=0)floaters.splice(i,1); }
      parts_upd(parts);
    }

    function draw(){
      X.save(); drawBg(); applyShake();
      // Wind indicator
      const wi=windDir>0?"→ Vind":"← Vind";
      X.fillStyle="rgba(255,255,255,.2)"; X.font="11px system-ui"; X.textAlign=windDir>0?"left":"right";
      X.fillText(wi,windDir>0?8:W-8,H-8);
      // Basket
      const bsz=BW+(combo>=5?18:combo>=3?9:0);
      const bc=combo>=5?"#FFD700":combo>=3?"#88AAFF":"#4488FF";
      X.fillStyle=bc; rr(bx,BY,bsz,BH,5); X.fill();
      X.strokeStyle="#88CCFF"; X.lineWidth=1.5; X.stroke();
      // Power effect
      if(powerActive==="slow"){X.save();X.shadowColor="#88CCFF";X.shadowBlur=12;rr(bx,BY,bsz,BH,5);X.stroke();X.restore();}
      if(powerActive==="double"){X.save();X.shadowColor="#FFD700";X.shadowBlur=12;rr(bx,BY,bsz,BH,5);X.stroke();X.restore();}
      // Bubbles
      for(const b of bubbles){
        X.fillStyle=b.isPow?"rgba(255,215,0,.15)":"rgba(60,95,160,.22)";
        X.beginPath(); X.arc(b.x,b.y,BUBBLE_R,0,Math.PI*2); X.fill();
        X.strokeStyle=b.isPow?"#FFD700":"#5A88CC"; X.lineWidth=2; X.stroke();
        X.fillStyle="#EBEBEF"; X.font="bold 15px system-ui,sans-serif"; X.textAlign="center"; X.fillText(b.label,b.x,b.y+6);
      }
      // Floaters
      for(const f of floaters){ X.globalAlpha=f.alpha; X.fillStyle="#FFD700"; X.font="bold 16px system-ui,sans-serif"; X.textAlign="center"; X.fillText(f.text,f.x,f.y); }
      X.globalAlpha=1;
      parts_drw(parts);
      // HUD
      hudBar();
      X.fillStyle="#C8DCF8"; X.font="bold 13px system-ui,sans-serif"; X.textAlign="left"; X.fillText("Poeng: "+score,12,26);
      for(let i=0;i<lives;i++){X.fillStyle="#FF6B6B";X.font="14px system-ui";X.fillText("♥",110+i*20,27);}
      X.fillStyle="#C8DCF8"; X.font="13px system-ui"; X.textAlign="center"; X.fillText("Kombo: "+combo,W/2,26);
      X.fillStyle="#506070"; X.font="11px system-ui"; X.textAlign="right"; X.fillText("Rek: "+getHi("g4_hi"),W-12,38);
      if(powerActive==="slow"){X.fillStyle="#88CCFF";X.font="11px system-ui";X.textAlign="center";X.fillText("❄ SLOWMO ("+Math.ceil(powerTmr/60)+"s)",W/2,H-40);}
      if(powerActive==="double"){X.fillStyle="#FFD700";X.font="11px system-ui";X.textAlign="center";X.fillText("💎 2x POENG ("+Math.ceil(powerTmr/60)+"s)",W/2,H-56);}
      if(state==="gameover") drawGameOver(score,getHi("g4_hi"));
      X.restore();
    }

    function onClick(x,y){ if(state==="gameover")start(); }
    function onKey(code){ if(state==="gameover"&&code==="Enter")start(); }
    return {start,stop,update,draw,onKey,onClick};
  })();

  // ████████████████████████████████████████████████████████████
  // SPILL 5 — SKRIVEDUELL (Race track + CPU + WPM + accuracy)
  // ████████████████████████████████████████████████████████████
  const g5=(()=>{
    const TOTAL=12,TRY=H-80;
    let score,hi,pool,idx,state,startTime,qStartTime;
    let playerProg=0,cpuProg=0,cpuSpeed=0;
    let wrong=0,totalChars=0,wrongChars=0,wpm=0;
    let typed="",lastTyped="",typedTime=[];
    let phase; // "play"|"done"
    let endStats={};
    let inputEl=null;

    function calcWPM(){
      const elapsed=(Date.now()-startTime)/60000;
      if(elapsed<.01)return 0;
      return Math.round((totalChars/5)/elapsed);
    }

    function start(){
      score=0; wrong=0; totalChars=0; wrongChars=0; wpm=0;
      idx=0; playerProg=0; cpuProg=0; typed=""; typedTime=[];
      hi=getHi("g5_hi"); phase="choose";
      hideEl("game-touch"); hideEl("game-catch-touch"); hideEl("game-input-wrap");
      const qc=document.getElementById("game-qcard"); if(qc)qc.style.display="none";
    }

    function _startRace(focus){
      pool=shuffle(buildPool(focus));
      startTime=Date.now(); qStartTime=Date.now();
      cpuSpeed=1/TOTAL*.004;
      phase="play";
      showEl("game-input-wrap");
      const qc=document.getElementById("game-qcard"); if(qc)qc.style.display="";
      const qlbl=document.querySelector(".game-question-label"); if(qlbl)qlbl.textContent="Sett inn riktig preposisjon";
      if(pool[0])setQCard(pool[0].text,pool[0].tip||"","");
      inputEl=document.getElementById("game-input");
      if(inputEl){ inputEl.value=""; inputEl.focus(); inputEl.removeEventListener("input",_onInput); inputEl.addEventListener("input",_onInput); }
      const sb=document.getElementById("game-input-submit");
      if(sb){ sb.onclick=submit; }
    }

    function stop(){
      hideEl("game-input-wrap");
      const qc=document.getElementById("game-qcard"); if(qc)qc.style.display="";
      if(inputEl){ inputEl.removeEventListener("input",_onInput); inputEl=null; }
    }

    function _onInput(){ typed=inputEl?inputEl.value:""; }

    function submit(){
      if(idx>=TOTAL||phase!=="play")return;
      const q=pool[idx]; const ans=q.ans.toLowerCase().trim(); const guess=typed.toLowerCase().trim();
      totalChars+=ans.length;
      if(guess===ans){ score+=80; playerProg=Math.min(1,(idx+1)/TOTAL); sfx("correct"); rAns(true); } else { wrong++; wrongChars+=ans.length; sfx("wrong"); rAns(false); setQCard("Riktig svar: "+q.ans,"",""); setTimeout(()=>setQCard("","",""),1000); }
      idx++; typed=""; if(inputEl){inputEl.value="";}
      wpm=calcWPM();
      if(idx>=TOTAL){ _finish(); return; }
      const next=pool[idx]; setQCard(next.text,next.tip||"",""); qStartTime=Date.now();
    }

    function _finish(){
      const elapsed=(Date.now()-startTime)/1000;
      const acc=totalChars===0?100:Math.round((1-wrongChars/totalChars)*100);
      phase="done"; setHi("g5_hi",score);
      endStats={wpm:calcWPM(),acc,elapsed:Math.round(elapsed),correct:TOTAL-wrong};
      hideEl("game-input-wrap");
      if(playerProg>cpuProg) uach("type_beat");
      if(elapsed<90) uach("speedrun");
      sfx(playerProg>cpuProg?"win":"gameOver");
    }

    function update(){
      frameN++;
      if(phase==="choose"||phase!=="play")return;
      // CPU progress: accelerates as game goes on
      cpuSpeed=1/TOTAL*(0.003+idx*.0006);
      cpuProg=Math.min(1,cpuProg+cpuSpeed);
      wpm=calcWPM();
    }

    function draw(){
      X.save(); drawBg();
      if(phase==="choose"){
        X.fillStyle="#C8DCF8"; X.font="bold 22px system-ui,sans-serif"; X.textAlign="center"; X.fillText("Velg kategori",W/2,72);
        X.fillStyle="#7090A8"; X.font="14px system-ui"; X.fillText("Hvilke preposisjoner vil du skrive?",W/2,102);
        const cats=[{v:"all",l:"Alle preposisjoner"},{v:"akkusativ",l:"Akkusativ"},{v:"dativ",l:"Dativ"},{v:"wechsel",l:"Wechsel"}];
        cats.forEach((c,i)=>{ const cx=i<2?160:480,cy=i%2===0?160:240; X.fillStyle="#1C3D7A"; rr(cx-110,cy-26,220,52,10); X.fill(); X.strokeStyle="#3A6AAA"; X.lineWidth=1.5; X.stroke(); X.fillStyle="#C8DCF8"; X.font="bold 15px system-ui,sans-serif"; X.textAlign="center"; X.fillText(c.l,cx,cy+6); });
        X.fillStyle="#506070"; X.font="12px system-ui"; X.textAlign="center"; X.fillText("Klikk for å velge",W/2,330);
      } else if(phase==="play"||phase==="done"){
        // Race track
        const TW=W-80,TX=40,tracY=70,laneH=34;
        // Track background
        X.fillStyle="rgba(255,255,255,.06)"; rr(TX,tracY,TW,laneH*2+8,8); X.fill();
        X.strokeStyle="rgba(255,255,255,.15)"; X.lineWidth=1; X.stroke();
        // Lane divider
        X.strokeStyle="rgba(255,255,255,.08)"; X.lineWidth=1; X.setLineDash([8,8]); X.beginPath(); X.moveTo(TX,tracY+laneH+4); X.lineTo(TX+TW,tracY+laneH+4); X.stroke(); X.setLineDash([]);
        // Finish line
        X.strokeStyle="#FFD700"; X.lineWidth=2; X.beginPath(); X.moveTo(TX+TW,tracY); X.lineTo(TX+TW,tracY+laneH*2+8); X.stroke();
        // Labels
        X.fillStyle="#4488FF"; X.font="bold 11px system-ui"; X.textAlign="left"; X.fillText("DU",TX-30,tracY+laneH/2+5);
        X.fillStyle="#FF6666"; X.fillText("CPU",TX-32,tracY+laneH+8+laneH/2+5);
        // Player rocket
        const px2=TX+playerProg*TW;
        X.fillStyle="#4488FF"; X.font="22px system-ui"; X.textAlign="center"; X.fillText("🚀",px2,tracY+laneH/2+8);
        // CPU rocket
        const cx2=TX+cpuProg*TW;
        X.fillStyle="#FF6666"; X.fillText("🚀",cx2,tracY+laneH+8+laneH/2+8);
        // WPM + accuracy
        hudBar();
        X.fillStyle="#C8DCF8"; X.font="bold 13px system-ui,sans-serif"; X.textAlign="left"; X.fillText("Poeng: "+score,12,26);
        X.fillStyle="#C8DCF8"; X.font="13px system-ui"; X.textAlign="center"; X.fillText(idx+" / "+TOTAL+" spørsmål",W/2,26);
        X.fillStyle="#7090A8"; X.font="11px system-ui"; X.textAlign="right"; X.fillText("WPM: "+wpm+" | Nøyaktighet: "+(totalChars===0?100:Math.round((1-wrongChars/totalChars)*100))+"%",W-12,26);
        X.fillStyle="#506070"; X.font="11px system-ui"; X.textAlign="right"; X.fillText("Rek: "+getHi("g5_hi"),W-12,38);
        // Question is shown in DOM card below canvas
      }
      if(phase==="done"){
        X.fillStyle="rgba(4,8,18,.9)"; X.fillRect(0,0,W,H);
        const won=playerProg>=cpuProg;
        X.fillStyle=won?"#4CAF50":"#FF6B6B"; X.font="bold 30px system-ui,sans-serif"; X.textAlign="center";
        X.fillText(won?"Du vant! 🏁":"CPU vant!",W/2,75);
        X.fillStyle="#C8DCF8"; X.font="16px system-ui"; X.fillText("Poeng: "+score,W/2,112);
        // Stats panel
        const stats=[["Riktige",endStats.correct+" / "+TOTAL],["WPM",endStats.wpm],["Nøyaktighet",endStats.acc+"%"],["Tid",endStats.elapsed+"s"]];
        stats.forEach(([l,v],i)=>{const sx=i%2===0?W/2-140:W/2+10,sy=148+Math.floor(i/2)*66;X.fillStyle="#1C3060";rr(sx,sy,130,52,8);X.fill();X.strokeStyle="#3A5A8A";X.lineWidth=1;X.stroke();X.fillStyle="#7090A8";X.font="11px system-ui";X.textAlign="center";X.fillText(l,sx+65,sy+18);X.fillStyle="#EBEBEF";X.font="bold 18px system-ui";X.fillText(String(v),sx+65,sy+42);});
        const h=getHi("g5_hi"); const isN=score>0&&score>=h;
        X.fillStyle=isN?"#FFCC00":"#506070"; X.font=(isN?"bold ":"")+"13px system-ui"; X.textAlign="center"; X.fillText(isN?"✦ Ny rekord! "+h+" poeng":"Rekord: "+h+" poeng",W/2,285);
        pulseBtn(W/2,330,"ENTER / klikk for å spille igjen");
      }
      X.restore();
    }

    function onKey(code){ if(code==="Enter"){ if(phase==="play")submit(); else if(phase==="done")start(); } }
    function onClick(x,y){
      if(phase==="choose"){
        const cats=["all","akkusativ","dativ","wechsel"];
        const coords=[[50,134,220,52],[50,214,220,52],[370,134,220,52],[370,214,220,52]];
        for(let i=0;i<4;i++){const[bx,by,bw,bh]=coords[i];if(x>bx&&x<bx+bw&&y>by&&y<by+bh){_startRace(cats[i]==="all"?null:cats[i]);return;}}
      }
      if(phase==="done")start();
    }
    return {start,stop,update,draw,onKey,onClick};
  })();

  // ████████████████████████████████████████████████████████████
  // SPILL 6 — PREPOSISJONSSORTER (Kategorispill)
  // ████████████████████████████████████████████████████████████
  const g6=(()=>{
    const B=[
      {x:20,  y:H-70, w:180, h:55, label:"AKKUSATIV", cat:"akkusativ", col:"#174FA8"},
      {x:220, y:H-70, w:200, h:55, label:"DATIV",     cat:"dativ",     col:"#15623A"},
      {x:440, y:H-70, w:180, h:55, label:"WECHSEL",   cat:"wechsel",   col:"#8A5400"},
    ];
    const ALL=[
      {w:"durch",cat:"akkusativ"},{w:"für",cat:"akkusativ"},{w:"gegen",cat:"akkusativ"},{w:"ohne",cat:"akkusativ"},{w:"um",cat:"akkusativ"},
      {w:"aus",cat:"dativ"},{w:"bei",cat:"dativ"},{w:"mit",cat:"dativ"},{w:"nach",cat:"dativ"},{w:"seit",cat:"dativ"},
      {w:"von",cat:"dativ"},{w:"zu",cat:"dativ"},{w:"außer",cat:"dativ"},{w:"gegenüber",cat:"dativ"},{w:"ab",cat:"dativ"},
      {w:"an",cat:"wechsel"},{w:"auf",cat:"wechsel"},{w:"hinter",cat:"wechsel"},{w:"in",cat:"wechsel"},{w:"neben",cat:"wechsel"},
      {w:"über",cat:"wechsel"},{w:"unter",cat:"wechsel"},{w:"vor",cat:"wechsel"},{w:"zwischen",cat:"wechsel"},
    ];
    let score,hi,lives,pool,idx,cy,state;
    let parts2=[];

    function start(){
      score=0; lives=3; hi=getHi("g6_hi"); state="play"; idx=0;
      pool=shuffle([...ALL,...ALL,...ALL]).slice(0,20);
      cy=60; parts2=[]; setQCard("","",""); hideEl("game-touch"); hideEl("game-catch-touch"); hideEl("game-input-wrap");
      const qc=document.getElementById("game-qcard"); if(qc)qc.style.display="none";
    }

    function stop(){ const qc=document.getElementById("game-qcard"); if(qc)qc.style.display=""; }

    function update(){
      if(state!=="play")return;
      parts_upd(parts2);
      cy+=0.6;
      if(cy>H-80){ lives--; sfx("wrong"); rAns(false); nextWord(); if(lives<=0){state="gameover";sfx("gameOver");} }
    }

    function nextWord(){ idx++; cy=60; if(idx>=pool.length){state="win";sfx("levelUp");setHi("g6_hi",score);if(score===20)uach("sorter_perfect");} }

    function draw(){
      X.save(); drawBg(); applyShake();
      for(const b of B){
        X.fillStyle=b.col+"cc"; rr(b.x,b.y,b.w,b.h,8); X.fill();
        X.strokeStyle=b.col; X.lineWidth=2; X.stroke();
        X.fillStyle="#FFF"; X.font="bold 13px system-ui,sans-serif"; X.textAlign="center";
        X.fillText(b.label,b.x+b.w/2,b.y+b.h/2+5);
      }
      if(state==="play"&&pool[idx]){
        X.fillStyle="#FFF"; X.font="bold 28px system-ui,sans-serif"; X.textAlign="center";
        X.fillText(pool[idx].w,W/2,cy);
      }
      parts_drw(parts2);
      hudBar();
      X.fillStyle="#C8DCF8"; X.font="bold 13px system-ui"; X.textAlign="left"; X.fillText("Poeng: "+score,12,26);
      for(let i=0;i<lives;i++){ X.fillStyle="#FF6B6B"; X.font="14px system-ui"; X.fillText("♥",110+i*20,27); }
      X.fillStyle="#506070"; X.font="11px system-ui"; X.textAlign="right"; X.fillText("Rek: "+getHi("g6_hi"),W-12,26);
      X.fillStyle="#C8DCF8"; X.textAlign="center"; X.fillText((idx)+"/"+pool.length,W/2,26);
      if(state==="gameover") drawGameOver(score,Math.max(score,getHi("g6_hi")));
      if(state==="win") drawWin(score,Math.max(score,getHi("g6_hi")),"Bra sortert!");
      X.restore();
    }

    function onClick(x,y){
      if(state==="gameover"||state==="win"){start();return;}
      if(state!=="play")return;
      const cur=pool[idx]; if(!cur)return;
      for(const b of B){
        if(x>=b.x&&x<=b.x+b.w&&y>=b.y&&y<=b.y+b.h){
          if(b.cat===cur.cat){ score++; sfx("correct"); boom(parts2,W/2,cy,"#4CAF50",8); rAns(true); }
          else { lives--; sfx("wrong"); doShake(4); rAns(false); if(lives<=0){state="gameover";sfx("gameOver");return;} }
          nextWord(); return;
        }
      }
    }

    function onKey(c){ if((c==="Space"||c==="Enter")&&(state==="gameover"||state==="win"))start(); }
    return {start,stop,update,draw,onKey,onClick};
  })();

  // ████████████████████████████████████████████████████████████
  // SPILL 7 — TYGGEGUMMI (Hangman)
  // ████████████████████████████████████████████████████████████
  const g7=(()=>{
    const WORDS=["durch","für","gegen","ohne","um","aus","bei","mit","nach","seit","von","zu","außer","gegenüber","ab","an","auf","hinter","in","neben","über","unter","vor","zwischen"];
    let word,guessed,wrong,state;
    const LW=48,LH=36,LG=6,COLS=9;
    const SHOW_LETTERS="ABCDEFGHIJKLMNOPQRSTUVWXYZÄÖÜ".split("");
    function startX(){ return (W-(COLS*LW+(COLS-1)*LG))/2; }

    function start(){
      word=WORDS[Math.floor(Math.random()*WORDS.length)].toLowerCase();
      guessed=new Set(); wrong=0; state="play";
      setQCard("Gjett den tyske preposisjonen!","Klikk en bokstav for å gjette.","");
      hideEl("game-touch"); hideEl("game-catch-touch"); hideEl("game-input-wrap");
    }

    function stop(){ setQCard("","",""); }
    function update(){}

    function draw(){
      X.save(); drawBg(); applyShake();
      // Gallows
      const hx=W/2-140,hy=40;
      X.strokeStyle="#8899BB"; X.lineWidth=3;
      X.beginPath(); X.moveTo(hx,hy+200); X.lineTo(hx,hy); X.lineTo(hx+80,hy); X.lineTo(hx+80,hy+30); X.stroke();
      // Stick figure stages
      if(wrong>=1){X.beginPath();X.arc(hx+80,hy+50,20,0,Math.PI*2);X.strokeStyle="#FFAAAA";X.stroke();}
      if(wrong>=2){X.strokeStyle="#FFAAAA";X.beginPath();X.moveTo(hx+80,hy+70);X.lineTo(hx+80,hy+130);X.stroke();}
      if(wrong>=3){X.beginPath();X.moveTo(hx+80,hy+85);X.lineTo(hx+50,hy+110);X.stroke();}
      if(wrong>=4){X.beginPath();X.moveTo(hx+80,hy+85);X.lineTo(hx+110,hy+110);X.stroke();}
      if(wrong>=5){X.beginPath();X.moveTo(hx+80,hy+130);X.lineTo(hx+55,hy+170);X.stroke();}
      if(wrong>=6){X.beginPath();X.moveTo(hx+80,hy+130);X.lineTo(hx+105,hy+170);X.stroke();}
      // Word dashes
      const disp=word.split("").map(c=>guessed.has(c)?c.toUpperCase():"_").join("  ");
      X.fillStyle="#EBEBEF"; X.font="bold 30px monospace"; X.textAlign="center"; X.fillText(disp,W/2+40,H/2-20);
      // Letter buttons
      SHOW_LETTERS.forEach((l,i)=>{
        const col=i%COLS,row=Math.floor(i/COLS);
        const bx=startX()+col*(LW+LG),by=H-110+row*(LH+LG);
        const lc=l.toLowerCase();
        const used=guessed.has(lc);
        const inWord=word.includes(lc);
        X.fillStyle=used?(inWord?"#1A7A3A":"#7A1A1A"):"#2A3A5A";
        rr(bx,by,LW,LH,5); X.fill();
        X.fillStyle=used?"#888":"#C8DCF8"; X.font="bold 13px system-ui"; X.textAlign="center";
        X.fillText(l,bx+LW/2,by+LH/2+5);
      });
      // HUD
      hudBar();
      X.fillStyle="#C8DCF8"; X.font="bold 13px system-ui"; X.textAlign="left"; X.fillText("Feil: "+wrong+"/6",12,26);
      X.fillStyle="#506070"; X.textAlign="right"; X.fillText("Rek: "+getHi("g7_hi"),W-12,26);
      if(state==="win"){
        X.fillStyle="rgba(4,8,18,.88)"; X.fillRect(0,0,W,H);
        X.fillStyle="#4CAF50"; X.font="bold 28px system-ui"; X.textAlign="center"; X.fillText("Riktig! "+word.toUpperCase(),W/2,H/2-20);
        const sc=Math.max(1,7-wrong); setHi("g7_hi",sc); pulseBtn(W/2,H/2+50,"Spill igjen");
      }
      if(state==="gameover"){
        X.fillStyle="rgba(4,8,18,.88)"; X.fillRect(0,0,W,H);
        X.fillStyle="#FF6B6B"; X.font="bold 28px system-ui"; X.textAlign="center"; X.fillText("Spillet er over!",W/2,H/2-40);
        X.fillStyle="#C8DCF8"; X.font="20px system-ui"; X.fillText("Ordet var: "+word.toUpperCase(),W/2,H/2+10);
        pulseBtn(W/2,H/2+60,"Prøv igjen");
      }
      X.restore();
    }

    function onClick(x,y){
      if(state==="win"||state==="gameover"){start();return;}
      if(state!=="play")return;
      SHOW_LETTERS.forEach((l,i)=>{
        const col=i%COLS,row=Math.floor(i/COLS);
        const bx=startX()+col*(LW+LG),by=H-110+row*(LH+LG);
        if(x>=bx&&x<=bx+LW&&y>=by&&y<=by+LH){
          const lc=l.toLowerCase();
          if(guessed.has(lc))return;
          guessed.add(lc);
          if(!word.includes(lc)){ wrong++; sfx("wrong"); if(wrong>=6){state="gameover";sfx("gameOver");} }
          else { sfx("correct"); if(word.split("").every(c=>guessed.has(c))){state="win";sfx("levelUp");uach("hangman_win");} }
        }
      });
    }

    function onKey(){}
    return {start,stop,update,draw,onKey,onClick};
  })();

  // ── Main loop ─────────────────────────────────────────────────
  function loop(){ if(currentGame){currentGame.update();currentGame.draw();} requestAnimationFrame(loop); }
  requestAnimationFrame(loop);

})();
