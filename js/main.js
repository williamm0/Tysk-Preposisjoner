// ============================================================
// Tyske Preposisjoner — shared utilities
// ============================================================

const NAV_ITEMS = [
  { href: "index.html",        label: "Hjem" },
  { href: "learn.html",        label: "Lær" },
  { href: "practice.html",     label: "Øv" },
  { href: "test.html",         label: "Prøve" },
  { href: "progress.html",     label: "Fremgang" },
  { href: "game.html",         label: "Spill" },
  { href: "flashkort.html",    label: "Flashkort" },
  { href: "ordliste.html",     label: "Ordliste" },
  { href: "achievements.html", label: "Prestasjoner" },
  { href: "boyving.html",      label: "B\u00f8ying" },
  { href: "settings.html",     label: "Innstillinger" },
];

function injectNav() {
  const current = location.pathname.split("/").pop() || "index.html";
  const linksHtml = NAV_ITEMS.map(item =>
    `<li><a href="${item.href}" class="${current === item.href ? "active" : ""}">${item.label}</a></li>`
  ).join("");

  const nav = document.createElement("nav");
  nav.id = "nav";
  nav.innerHTML = `
    <a class="nav-brand" href="index.html">
      <span class="nav-flag">
        <span class="f1"></span><span class="f2"></span><span class="f3"></span>
      </span>
      Tyske Preposisjoner
    </a>
    <ul class="nav-links" id="nav-links">${linksHtml}</ul>
    <button id="theme-btn" aria-label="Bytt tema">
      <span id="theme-label">Mørk</span><span id="theme-icon"></span>
    </button>
    <button id="hamburger" aria-label="Meny">&#9776;</button>
  `;
  document.body.prepend(nav);

  document.getElementById("theme-btn").addEventListener("click", toggleTheme);
  document.getElementById("hamburger").addEventListener("click", () => {
    document.getElementById("nav-links").classList.toggle("open");
  });
}

// ── Theme ──────────────────────────────────────────────────

function applyTheme(t) {
  document.documentElement.setAttribute("data-theme", t);
  const lbl = document.getElementById("theme-label");
  if (lbl) lbl.textContent = t === "dark" ? "Lys" : "Mørk";
}

function toggleTheme() {
  const cur = document.documentElement.getAttribute("data-theme") || "light";
  const next = cur === "dark" ? "light" : "dark";
  applyTheme(next);
  LS.set("theme", next);
}

function loadTheme() { applyTheme(LS.get("theme") || "light"); }

// ── LocalStorage ───────────────────────────────────────────

const LS = {
  get(k) { try { return JSON.parse(localStorage.getItem("tp_" + k)); } catch { return null; } },
  set(k, v) { try { localStorage.setItem("tp_" + k, JSON.stringify(v)); } catch {} },
  remove(k) { try { localStorage.removeItem("tp_" + k); } catch {} },
};

// ── Progress ───────────────────────────────────────────────

const Progress = {
  get() {
    return LS.get("progress") || {
      totalAnswered: 0,
      totalCorrect: 0,
      testsTaken: 0,
      testsScores: [],
      wrongAnswers: {},
      lastActivity: null,
    };
  },
  save(d) { LS.set("progress", d); },
  recordAnswer(sentence, prep, correct) {
    const d = this.get();
    d.totalAnswered++;
    if (correct) {
      d.totalCorrect++;
    } else {
      if (!d.wrongAnswers[sentence]) d.wrongAnswers[sentence] = { count: 0, prep };
      d.wrongAnswers[sentence].count++;
    }
    d.lastActivity = new Date().toISOString();
    this.save(d);
  },
  recordTest(score, total) {
    const d = this.get();
    d.testsTaken++;
    d.testsScores.push({ score, total, date: new Date().toISOString() });
    if (d.testsScores.length > 20) d.testsScores = d.testsScores.slice(-20);
    d.lastActivity = new Date().toISOString();
    this.save(d);
  },
  reset() { LS.remove("progress"); },
};

// ── Utilities ──────────────────────────────────────────────

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

let _toastTimer;
function showToast(msg) {
  let el = document.getElementById("toast");
  if (!el) { el = document.createElement("div"); el.id = "toast"; document.body.appendChild(el); }
  el.textContent = msg;
  el.classList.add("show");
  clearTimeout(_toastTimer);
  _toastTimer = setTimeout(() => el.classList.remove("show"), 2400);
}

// ── Tabs ───────────────────────────────────────────────────

function initTabs(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;
  const btns = container.querySelectorAll(".tab-btn");
  const panels = container.querySelectorAll(".tab-panel");

  btns.forEach(btn => {
    btn.addEventListener("click", () => {
      const t = btn.dataset.tab;
      btns.forEach(b => b.classList.remove("active"));
      panels.forEach(p => p.classList.remove("active"));
      btn.classList.add("active");
      container.querySelector(`.tab-panel[data-tab="${t}"]`)?.classList.add("active");
    });
  });
  if (btns[0]) btns[0].click();
}

// ── Sticky note ────────────────────────────────────────────

const NOTE_COLOR_MAP = {
  yellow: { bg:"#FFFBE6", bd:"#E8CC30", text:"#2A2000", title:"#7A6200" },
  blue:   { bg:"#EFF6FF", bd:"#93C5FD", text:"#0C2340", title:"#1E40AF" },
  green:  { bg:"#F0FDF4", bd:"#86EFAC", text:"#052E10", title:"#15803D" },
  pink:   { bg:"#FFF1F2", bd:"#FDA4AF", text:"#3B0010", title:"#BE123C" },
  purple: { bg:"#F5F3FF", bd:"#C4B5FD", text:"#1E0050", title:"#6D28D9" },
};

function applyNoteColor(color) {
  const c = NOTE_COLOR_MAP[color] || NOTE_COLOR_MAP.yellow;
  const n = document.getElementById("sticky-note");
  if (!n) return;
  n.style.background  = c.bg;
  n.style.borderColor = c.bd;
  const hdr = document.getElementById("sticky-header");
  if (hdr) hdr.style.borderBottomColor = c.bd;
  const body = document.getElementById("sticky-body");
  if (body) body.style.color = c.text;
  const title = document.getElementById("sticky-title");
  if (title) title.style.color = c.title;
  const tgl = document.getElementById("sticky-toggle");
  if (tgl) tgl.style.color = c.title;
}

function launchConfetti() {
  if (typeof Settings !== "undefined" && Settings.get("confettiEnabled") === false) return;
  const colors = ["#1A1A1C","#1A1A1C","#CC0000","#CC0000","#FFCC00","#FFCC00","#FFDD33"];
  for (let i = 0; i < 90; i++) {
    const p = document.createElement("div");
    const size = 6 + Math.random() * 8;
    p.style.cssText = `
      position:fixed;top:-12px;pointer-events:none;z-index:9999;
      left:${Math.random() * 100}vw;
      width:${size}px;height:${size}px;
      background:${colors[Math.floor(Math.random() * colors.length)]};
      border-radius:${Math.random() > 0.45 ? "50%" : "2px"};
      animation:confetti-fall ${1.4 + Math.random() * 1.8}s linear ${Math.random() * 0.4}s forwards;
    `;
    document.body.appendChild(p);
    p.addEventListener("animationend", () => p.remove());
  }
}

function injectStickyNote() {
  const saved = LS.get("stickyNote")      || "";
  const isMin = LS.get("stickyMinimized") || false;
  const pos   = LS.get("stickyPos");

  const el = document.createElement("div");
  el.id = "sticky-note";
  if (isMin) el.classList.add("minimized");

  if (pos) {
    el.style.left   = pos.left;
    el.style.top    = pos.top;
    el.style.bottom = "auto";
  }

  el.innerHTML = `
    <div id="sticky-header">
      <span id="sticky-title">Notater</span>
      <button id="sticky-toggle" aria-label="${isMin ? "Utvid" : "Minimer"}">${isMin ? "+" : "−"}</button>
    </div>
    <textarea id="sticky-body" placeholder="Skriv notater her...">${saved}</textarea>
  `;
  document.body.appendChild(el);

  const body   = document.getElementById("sticky-body");
  const toggle = document.getElementById("sticky-toggle");
  const header = document.getElementById("sticky-header");

  // Draggable
  let startX, startY, startL, startT;
  header.style.cursor = "grab";

  header.addEventListener("mousedown", e => {
    if (e.target === toggle) return;
    e.preventDefault();
    startX = e.clientX; startY = e.clientY;
    const r = el.getBoundingClientRect();
    startL = r.left; startT = r.top;
    header.style.cursor = "grabbing";

    const onMove = e => {
      let l = Math.max(0, Math.min(window.innerWidth  - el.offsetWidth,  startL + e.clientX - startX));
      let t = Math.max(0, Math.min(window.innerHeight - el.offsetHeight, startT + e.clientY - startY));
      el.style.left = l + "px"; el.style.top = t + "px"; el.style.bottom = "auto";
    };
    const onUp = () => {
      header.style.cursor = "grab";
      LS.set("stickyPos", { left: el.style.left, top: el.style.top });
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseup",   onUp);
    };
    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup",   onUp);
  });

  header.addEventListener("touchstart", e => {
    if (e.target === toggle) return;
    const t0 = e.touches[0];
    startX = t0.clientX; startY = t0.clientY;
    const r = el.getBoundingClientRect();
    startL = r.left; startT = r.top;
    const onMove = e => {
      const t = e.touches[0];
      let l = Math.max(0, Math.min(window.innerWidth  - el.offsetWidth,  startL + t.clientX - startX));
      let tp = Math.max(0, Math.min(window.innerHeight - el.offsetHeight, startT + t.clientY - startY));
      el.style.left = l + "px"; el.style.top = tp + "px"; el.style.bottom = "auto";
    };
    const onEnd = () => {
      LS.set("stickyPos", { left: el.style.left, top: el.style.top });
      document.removeEventListener("touchmove", onMove);
      document.removeEventListener("touchend",  onEnd);
    };
    document.addEventListener("touchmove", onMove, { passive: false });
    document.addEventListener("touchend",  onEnd);
  }, { passive: true });

  // Confetti easter egg — fires each time a new "confetti" is completed
  const countWord = (str, w) => (str.toLowerCase().match(new RegExp(w, "g")) || []).length;
  let prevVal = saved;
  body.addEventListener("input", () => {
    const val = body.value;
    LS.set("stickyNote", val);
    if (countWord(val, "confetti") > countWord(prevVal, "confetti")) launchConfetti();
    prevVal = val;
  });

  toggle.addEventListener("click", () => {
    const nowMin = el.classList.toggle("minimized");
    toggle.textContent = nowMin ? "+" : "−";
    toggle.setAttribute("aria-label", nowMin ? "Utvid" : "Minimer");
    LS.set("stickyMinimized", nowMin);
  });

  // Apply saved note color
  const savedColor = (typeof Settings !== "undefined") ? Settings.get("noteColor") : null;
  if (savedColor) applyNoteColor(savedColor);
}

// ── Quick-reference floating button ───────────────────────

function injectQuickRef() {
  const btn = document.createElement("button");
  btn.id = "qr-btn";
  btn.setAttribute("aria-label", "Artikkelskjema");
  btn.textContent = "📋";
  btn.style.cssText = `
    position:fixed;bottom:1.5rem;right:1.5rem;z-index:500;
    width:46px;height:46px;border-radius:50%;border:1.5px solid var(--border);
    background:var(--surface);color:var(--text);font-size:1.2rem;cursor:pointer;
    box-shadow:var(--sh);transition:transform .15s,box-shadow .15s;
    display:flex;align-items:center;justify-content:center;
  `;
  btn.addEventListener("mouseenter", () => { btn.style.transform = "scale(1.1)"; btn.style.boxShadow = "var(--sh-sm)"; });
  btn.addEventListener("mouseleave", () => { btn.style.transform = ""; btn.style.boxShadow = "var(--sh)"; });

  const panel = document.createElement("div");
  panel.id = "qr-panel";
  panel.style.cssText = `
    position:fixed;bottom:5rem;right:1.5rem;z-index:499;
    background:var(--surface);border:1.5px solid var(--border);border-radius:var(--r);
    padding:1rem 1.25rem;box-shadow:var(--sh);width:min(340px,90vw);
    display:none;font-size:.8125rem;
  `;
  panel.innerHTML = `
    <p style="font-size:.7rem;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:var(--text3);margin-bottom:.75rem;">Artikkelskjema</p>
    <table style="width:100%;border-collapse:collapse;font-size:.8125rem;">
      <thead><tr>
        <th style="text-align:left;padding:.3rem .5rem;font-size:.7rem;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:var(--text3);border-bottom:1px solid var(--border);">Kasus</th>
        <th style="padding:.3rem .5rem;font-size:.7rem;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:var(--text3);border-bottom:1px solid var(--border);">Mask.</th>
        <th style="padding:.3rem .5rem;font-size:.7rem;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:var(--text3);border-bottom:1px solid var(--border);">Fem.</th>
        <th style="padding:.3rem .5rem;font-size:.7rem;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:var(--text3);border-bottom:1px solid var(--border);">Nøyt.</th>
        <th style="padding:.3rem .5rem;font-size:.7rem;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:var(--text3);border-bottom:1px solid var(--border);">Pl.</th>
      </tr></thead>
      <tbody>
        <tr><td style="padding:.35rem .5rem;font-weight:600;color:var(--text3);border-bottom:1px solid var(--border2);">Nom.</td><td style="padding:.35rem .5rem;text-align:center;border-bottom:1px solid var(--border2);">der</td><td style="padding:.35rem .5rem;text-align:center;border-bottom:1px solid var(--border2);">die</td><td style="padding:.35rem .5rem;text-align:center;border-bottom:1px solid var(--border2);">das</td><td style="padding:.35rem .5rem;text-align:center;border-bottom:1px solid var(--border2);">die</td></tr>
        <tr><td style="padding:.35rem .5rem;font-weight:600;color:var(--text3);border-bottom:1px solid var(--border2);">Akk.</td><td style="padding:.35rem .5rem;text-align:center;font-weight:800;color:var(--akk);border-bottom:1px solid var(--border2);">den</td><td style="padding:.35rem .5rem;text-align:center;border-bottom:1px solid var(--border2);">die</td><td style="padding:.35rem .5rem;text-align:center;border-bottom:1px solid var(--border2);">das</td><td style="padding:.35rem .5rem;text-align:center;border-bottom:1px solid var(--border2);">die</td></tr>
        <tr><td style="padding:.35rem .5rem;font-weight:600;color:var(--text3);">Dat.</td><td style="padding:.35rem .5rem;text-align:center;font-weight:800;color:var(--dat);">dem</td><td style="padding:.35rem .5rem;text-align:center;font-weight:800;color:var(--dat);">der</td><td style="padding:.35rem .5rem;text-align:center;font-weight:800;color:var(--dat);">dem</td><td style="padding:.35rem .5rem;text-align:center;font-weight:800;color:var(--dat);">den</td></tr>
      </tbody>
    </table>
    <div style="margin-top:.75rem;padding-top:.65rem;border-top:1px solid var(--border2);font-size:.75rem;color:var(--text3);line-height:1.6;">
      <strong style="color:var(--text2);">Kontr.:</strong> beim &middot; vom &middot; zum &middot; zur &middot; im &middot; am &middot; ins &middot; ans
    </div>
  `;

  document.body.appendChild(panel);
  document.body.appendChild(btn);

  let open = false;
  btn.addEventListener("click", () => {
    open = !open;
    panel.style.display = open ? "block" : "none";
    btn.style.background = open ? "var(--surface2)" : "var(--surface)";
  });
  document.addEventListener("click", e => {
    if (open && !panel.contains(e.target) && e.target !== btn) {
      open = false;
      panel.style.display = "none";
      btn.style.background = "var(--surface)";
    }
  });
}

// ── Boot ───────────────────────────────────────────────────

document.addEventListener("DOMContentLoaded", () => {
  injectNav();
  injectQuickRef();
  injectStickyNote();
  if (typeof Settings !== "undefined") {
    Settings.load();
  } else {
    loadTheme();
  }
  if (typeof Achievements !== "undefined") Achievements.checkNightOwl();
});
