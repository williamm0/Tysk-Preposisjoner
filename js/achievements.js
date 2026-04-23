// ============================================================
// Prestasjonssystem
// ============================================================

const Achievements = (() => {
  "use strict";

  const ALL = [
    { id:"first_correct",  icon:"★",  label:"Første steg",          desc:"Svar riktig for aller første gang" },
    { id:"streak_5",       icon:"🔥", label:"Varm",                 desc:"5 riktige svar på rad" },
    { id:"streak_10",      icon:"💥", label:"Ustoppelig",           desc:"10 riktige svar på rad" },
    { id:"inv_1000",       icon:"🚀", label:"Skytekonge",           desc:"Scorer 1000 poeng i Grammatikkforsvar" },
    { id:"inv_level5",     icon:"⚔",  label:"Forsvarer",            desc:"Når nivå 5 i Grammatikkforsvar" },
    { id:"inv_boss",       icon:"👾", label:"Sjefsmorder",          desc:"Dreper sjefen i Grammatikkforsvar" },
    { id:"lq_perfect",     icon:"⚡", label:"Lynrask",              desc:"Fullfører Lynquiz uten ett feil svar" },
    { id:"lq_streak10",    icon:"🎯", label:"Streak-mester",        desc:"10 riktige på rad i Lynquiz" },
    { id:"lq_double",      icon:"💰", label:"Dobling",              desc:"Vinner en Dobbelt eller ingenting-runde" },
    { id:"mem_perfect",    icon:"🧠", label:"Huskemaster",          desc:"Fullfører Kortmatch uten ekstra trekk" },
    { id:"mem_xray",       icon:"🔍", label:"Røntgensyn",           desc:"Bruker røntgen-funksjonen i Kortmatch" },
    { id:"catch_50",       icon:"🫙", label:"Fanger",               desc:"Totalt 50 bobler fanget i Ordregn" },
    { id:"type_beat",      icon:"🏁", label:"Vinneren",             desc:"Slår CPU-en i Skriveduell" },
    { id:"all_games",      icon:"🏆", label:"Allrounder",           desc:"Spiller alle 5 spill minst én gang" },
    { id:"night_owl",      icon:"🦉", label:"Natteravn",            desc:"Bruker nettsiden etter kl. 22:00" },
    { id:"hard_100",       icon:"👑", label:"Preposisjonsekspert",  desc:"Fullfører en prøve med 100% på Vanskelig" },
    { id:"speedrun",       icon:"⏱",  label:"Speedrunner",          desc:"Fullfører Skriveduell på under 90 sekunder" },
    { id:"first_test",     icon:"📝", label:"Første prøve",         desc:"Tar sin første prøve" },
    { id:"test_5",         icon:"📚", label:"Prøvemester",          desc:"Tar 5 prøver" },
    { id:"perfect_test",   icon:"💯", label:"Perfekt prøve",        desc:"100% på en prøve (uansett vanskelighetsgrad)" },
    { id:"fill_expert",    icon:"✏️", label:"Fyll inn-ekspert",     desc:"Svarer 20 fyll-inn-blanke riktige" },
    { id:"flash_fan",      icon:"🃏", label:"Flashkort-fan",        desc:"Blar gjennom 30 flashkort" },
    { id:"all_known",      icon:"🌟", label:"Alle kjent",           desc:"Markerer alle flashkort som kjente" },
    { id:"study_50",       icon:"📖", label:"Studieøkt",            desc:"Svarer 50 spørsmål totalt" },
    { id:"dedicated_200",  icon:"🎓", label:"Dedikert",             desc:"Svarer 200 spørsmål totalt" },
    { id:"streak_20",      icon:"🔥", label:"Korrekt-streak 20",    desc:"20 riktige svar på rad" },
    { id:"visit_ordliste", icon:"📋", label:"Ordliste-besøk",       desc:"Besøker ordliste-siden" },
  ];

  let _unlocked      = {};
  let _gamesPlayed   = new Set();
  let _catchCount    = 0;
  let _streak        = 0;
  let _fillCorrect   = 0;
  let _flashBrowsed  = 0;

  function _load() {
    try {
      const d = JSON.parse(localStorage.getItem("tp_achievements") || "{}");
      _unlocked     = d.unlocked     || {};
      _gamesPlayed  = new Set(d.gamesPlayed || []);
      _catchCount   = d.catchCount   || 0;
      _streak       = d.streak       || 0;
      _fillCorrect  = d.fillCorrect  || 0;
      _flashBrowsed = d.flashBrowsed || 0;
    } catch (_) {}
  }

  function _save() {
    try {
      localStorage.setItem("tp_achievements", JSON.stringify({
        unlocked: _unlocked, gamesPlayed: [..._gamesPlayed],
        catchCount: _catchCount, streak: _streak,
        fillCorrect: _fillCorrect, flashBrowsed: _flashBrowsed,
      }));
    } catch (_) {}
  }

  function _toast(ach) {
    if (typeof AudioEngine !== "undefined") AudioEngine.play("achievement");
    const el = document.createElement("div");
    el.className = "ach-toast";
    el.innerHTML = `
      <span class="ach-toast-icon">${ach.icon}</span>
      <div>
        <div class="ach-toast-title">Prestasjon låst opp</div>
        <div class="ach-toast-name">${ach.label}</div>
      </div>`;
    document.body.appendChild(el);
    requestAnimationFrame(() => requestAnimationFrame(() => el.classList.add("show")));
    setTimeout(() => { el.classList.remove("show"); setTimeout(() => el.remove(), 420); }, 3800);
  }

  function unlock(id) {
    if (_unlocked[id]) return false;
    const ach = ALL.find(a => a.id === id);
    if (!ach) return false;
    _unlocked[id] = Date.now();
    _save();
    _toast(ach);
    return true;
  }

  function isUnlocked(id) { return !!_unlocked[id]; }

  function recordAnswer(correct) {
    if (correct) {
      _streak++;
      unlock("first_correct");
      if (_streak >= 5)  unlock("streak_5");
      if (_streak >= 10) unlock("streak_10");
      if (_streak >= 20) unlock("streak_20");
    } else {
      _streak = 0;
    }
    if (typeof Progress !== "undefined") {
      const d = Progress.get();
      if (d.totalAnswered >= 50)  unlock("study_50");
      if (d.totalAnswered >= 200) unlock("dedicated_200");
    }
    _save();
  }

  function recordGame(id) {
    _gamesPlayed.add(id);
    _save();
    if (_gamesPlayed.size >= 5) unlock("all_games");
  }

  function recordCatch() {
    _catchCount++;
    _save();
    if (_catchCount >= 50) unlock("catch_50");
  }

  function checkNightOwl() {
    const h = new Date().getHours();
    if (h >= 22 || h < 4) unlock("night_owl");
  }

  function recordTest(score, total) {
    if (typeof Progress !== "undefined") {
      const d = Progress.get();
      if (d.testsTaken >= 1) unlock("first_test");
      if (d.testsTaken >= 5) unlock("test_5");
    }
    const pct = total > 0 ? Math.round((score / total) * 100) : 0;
    if (pct === 100) unlock("perfect_test");
  }

  function recordFillCorrect() {
    _fillCorrect++;
    _save();
    if (_fillCorrect >= 20) unlock("fill_expert");
  }

  function recordFlashBrowse(totalKnown, deckSize) {
    _flashBrowsed++;
    _save();
    if (_flashBrowsed >= 30) unlock("flash_fan");
    if (deckSize > 0 && totalKnown >= deckSize) unlock("all_known");
  }

  function checkOrdlisteVisit() {
    unlock("visit_ordliste");
  }

  _load();

  return {
    unlock, isUnlocked, recordAnswer, recordGame, recordCatch, checkNightOwl,
    recordTest, recordFillCorrect, recordFlashBrowse, checkOrdlisteVisit,
    getAll()        { return ALL; },
    getUnlocked()   { return _unlocked; },
    getStreak()     { return _streak; },
    getCatchCount() { return _catchCount; },
    getGamesPlayed(){ return _gamesPlayed; },
  };
})();
