// ============================================================
// Lydmotor — Web Audio API, ingen lydfiler nødvendig
// ============================================================

const AudioEngine = (() => {
  "use strict";
  let ctx = null, masterGain = null;
  let _enabled = true, _vol = 0.55;

  function _init() {
    if (ctx) return;
    try {
      ctx = new (window.AudioContext || window.webkitAudioContext)();
      masterGain = ctx.createGain();
      masterGain.gain.value = _vol;
      masterGain.connect(ctx.destination);
    } catch (_) { _enabled = false; }
  }

  function _resume() {
    if (ctx && ctx.state === "suspended") ctx.resume().catch(() => {});
  }

  function _tone(freq, type, dur, vol, startDelay) {
    if (!_enabled || !ctx) return;
    try {
      _resume();
      const t = ctx.currentTime + (startDelay || 0);
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = type || "sine";
      o.frequency.value = freq;
      g.gain.setValueAtTime(vol || 0.35, t);
      g.gain.exponentialRampToValueAtTime(0.0001, t + (dur || 0.25));
      o.connect(g); g.connect(masterGain);
      o.start(t); o.stop(t + (dur || 0.25));
    } catch (_) {}
  }

  function _noise(dur, vol) {
    if (!_enabled || !ctx) return;
    try {
      _resume();
      const rate = ctx.sampleRate;
      const buf  = ctx.createBuffer(1, rate * dur, rate);
      const data = buf.getChannelData(0);
      for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1);
      const src = ctx.createBufferSource();
      const g   = ctx.createGain();
      src.buffer = buf;
      g.gain.setValueAtTime(vol || 0.18, ctx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + dur);
      src.connect(g); g.connect(masterGain);
      src.start(); src.stop(ctx.currentTime + dur);
    } catch (_) {}
  }

  const SFX = {
    correct()     { _tone(523,"sine",.09,.4); _tone(659,"sine",.09,.3,.07); _tone(784,"sine",.18,.25,.14); },
    wrong()       { _tone(220,"sawtooth",.09,.4); _tone(175,"sawtooth",.12,.3,.09); },
    levelUp()     { [523,659,784,1047].forEach((f,i) => _tone(f,"sine",.15,.3,i*.08)); },
    gameOver()    { [360,280,220,175].forEach((f,i) => _tone(f,"sawtooth",.2,.28,i*.13)); },
    shoot()       { _tone(900,"square",.04,.12); _tone(600,"square",.04,.08,.03); },
    explosion()   { _noise(.12,.4); _tone(110,"sawtooth",.1,.3); },
    bigExplosion(){ _noise(.2,.55); _tone(80,"sawtooth",.18,.45); _tone(160,"sawtooth",.12,.3,.05); },
    pop()         { _tone(680,"sine",.07,.3); },
    powerUp()     { [380,500,660,840,1060,1300].forEach((f,i) => _tone(f,"sine",.1,.22,i*.04)); },
    flip()        { _tone(360,"triangle",.08,.28); },
    match()       { _tone(523,"sine",.08,.32); _tone(784,"sine",.16,.3,.09); },
    tick()        { _tone(1100,"square",.022,.18); },
    win()         { [523,659,784,523,659,784,1047].forEach((f,i) => _tone(f,"sine",.2,.35,i*.09)); },
    bossHit()     { _noise(.09,.32); _tone(180,"sawtooth",.16,.45); },
    shieldHit()   { _tone(300,"triangle",.1,.38); _tone(240,"triangle",.09,.28,.06); },
    achievement() { [440,554,659,880].forEach((f,i) => _tone(f,"sine",.22,.38,i*.09)); },
    doubleOrN()   { [600,800,1000,800,600,800,1000,1200].forEach((f,i) => _tone(f,"triangle",.1,.28,i*.06)); },
    catchPow()    { _tone(880,"sine",.12,.38); _tone(1100,"sine",.12,.35,.08); _tone(1320,"sine",.15,.32,.16); },
    warning()     { _tone(440,"square",.06,.28); _tone(550,"square",.06,.22,.08); },
    combo()       { [392,494,587,740].forEach((f,i) => _tone(f,"sine",.12,.28,i*.06)); },
  };

  return {
    play(name) { if (!_enabled) return; _init(); SFX[name]?.(); },
    setEnabled(v) { _enabled = !!v; },
    setVolume(v)  { _vol = Math.max(0, Math.min(1, v)); if (masterGain) masterGain.gain.value = _vol; },
    get enabled() { return _enabled; },
    get volume()  { return _vol; },
    init: _init,
  };
})();
