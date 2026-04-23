// ============================================================
// Innstillinger
// ============================================================

const Settings = (() => {
  "use strict";

  const DEFAULTS = {
    theme:           "light",
    sound:           true,
    volume:          0.55,
    animations:      "full",
    showHints:       true,
    studyFocus:      "all",
    lqTimerSpeed:    "normal",
    difficulty:      "medium",
    targetGrade:     "5",
    showExplanation: true,
    dyslexiaFont:    false,
    textSize:        "normal",
    autoNext:        false,
    caseFocus:       "all",
    compactView:     false,
    highContrast:    false,
    confettiEnabled: true,
    defaultQCount:   "10",
    defaultDiff:     "easy",
    showStreak:      true,
    alwaysShowAnswer: false,
    flashDir:        "de-no",
    shuffleFlash:    true,
    showFlashEx:     true,
    noteColor:       "yellow",
  };

  let _s = { ...DEFAULTS };

  function load() {
    try {
      const saved = JSON.parse(localStorage.getItem("tp_settings") || "{}");
      _s = { ...DEFAULTS, ...saved };
    } catch (_) {}
    _apply();
  }

  function _apply() {
    let t = _s.theme;
    if (t === "system") {
      t = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    }
    document.documentElement.setAttribute("data-theme", t);
    document.documentElement.setAttribute("data-dyslexia",  _s.dyslexiaFont  ? "true"  : "false");
    document.documentElement.setAttribute("data-textsize",  _s.textSize   || "normal");
    document.documentElement.setAttribute("data-compact",   _s.compactView  ? "true"  : "false");
    document.documentElement.setAttribute("data-contrast",  _s.highContrast ? "high"  : "normal");

    if (typeof AudioEngine !== "undefined") {
      AudioEngine.setEnabled(_s.sound);
      AudioEngine.setVolume(_s.volume);
    }
  }

  function save() {
    try { localStorage.setItem("tp_settings", JSON.stringify(_s)); } catch (_) {}
    _apply();
  }

  function get(key)        { return _s[key]; }
  function set(key, value) { _s[key] = value; save(); }
  function getAll()        { return { ..._s }; }

  function reset() { _s = { ...DEFAULTS }; save(); }

  function lqTimerSeconds() {
    return { slow: 12, normal: 8, fast: 5 }[_s.lqTimerSpeed] ?? 8;
  }

  // If theme changes externally (system preference), re-apply
  window.matchMedia?.("(prefers-color-scheme: dark)")
    .addEventListener?.("change", () => { if (_s.theme === "system") _apply(); });

  return { load, get, set, getAll, reset, lqTimerSeconds };
})();
