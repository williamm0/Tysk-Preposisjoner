// ============================================================
// Tyske Preposisjoner — practice engine
// ============================================================

const LETTERS = ["A","B","C","D","E","F"];

let caseFilter = "alle";

let cur = {
  type: "multipleChoice", difficulty: "easy",
  questions: [], index: 0, correct: 0, streak: 0, sessionActive: false,
};

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("random-btn")?.addEventListener("click", startRandom);

  document.getElementById("case-filter")?.querySelectorAll(".seg-btn").forEach(b => {
    b.addEventListener("click", () => {
      document.getElementById("case-filter").querySelectorAll(".seg-btn").forEach(x => x.classList.remove("active"));
      b.classList.add("active");
      caseFilter = b.dataset.val;
    });
  });

  const urlKasus = new URLSearchParams(location.search).get("kasus");
  if (urlKasus && ["akkusativ","dativ","wechsel"].includes(urlKasus)) {
    caseFilter = urlKasus;
    document.querySelectorAll("#case-filter .seg-btn").forEach(b => {
      b.classList.toggle("active", b.dataset.val === urlKasus);
    });
  }

  showChooser();
});

function showChooser() {
  document.getElementById("exercise-chooser").classList.remove("hidden");
  document.getElementById("exercise-area").classList.add("hidden");
}
function hideChooser() {
  document.getElementById("exercise-chooser").classList.add("hidden");
  document.getElementById("exercise-area").classList.remove("hidden");
}

function startExercise(type, difficulty) {
  let pool = (type === "match")
    ? EXERCISES.matchPairs[difficulty] || []
    : (EXERCISES[type]?.[difficulty] || []);

  if (caseFilter !== "alle" && type !== "match") {
    pool = pool.filter(q => {
      if (q.case) return q.case === caseFilter;
      return true;
    });
  }

  if (!pool.length) { showToast("Ingen oppgaver for dette kasusvalget. Prøv et annet filter."); return; }
  cur = { type, difficulty, questions: shuffle(pool), index: 0, correct: 0, streak: 0, sessionActive: true };
  hideChooser();
  renderQuestion();
}

function startRandom() {
  const types = ["multipleChoice","fillInBlank","chooseCase","trueOrFalse","writeIn","articleChoice","articleWrite"];
  const diffs  = ["easy","medium","hard"];
  startExercise(
    types[Math.floor(Math.random() * types.length)],
    diffs[Math.floor(Math.random() * diffs.length)]
  );
}

// ── Shell ─────────────────────────────────────────────────

function renderQuestion() {
  const { type, questions, index } = cur;
  const typeLabel = {
    multipleChoice: "Flervalg", fillInBlank: "Fyll inn",
    chooseCase: "Velg kasus", trueOrFalse: "Sant eller usant",
    writeIn: "Skriv inn", match: "Koble sammen",
    articleChoice: "Artikkelbøying (flervalg)",
    articleWrite:  "Artikkelbøying (skriv inn)",
  }[type] || "Øving";

  const shown = Math.min(questions.length, 20);
  const dots = Array.from({ length: shown }, (_, i) => {
    const cls = i < index ? "progress-dot done" : i === index ? "progress-dot current" : "progress-dot";
    return `<span class="${cls}"></span>`;
  }).join("");

  document.getElementById("exercise-area").innerHTML = `
    <div class="ex-panel">
      <div class="ex-meta">
        <span class="ex-meta-label">${typeLabel} &middot; ${index + 1}&thinsp;/&thinsp;${questions.length}</span>
        <div style="display:flex;align-items:center;gap:.75rem;">
          ${(typeof Settings !== "undefined" && Settings.get("showStreak") && cur.streak >= 2)
            ? `<span class="streak-badge">🔥 ${cur.streak}</span>` : ""}
          <div class="progress-dots">${dots}</div>
          <button class="btn btn-sm btn-secondary" onclick="showChooser()">Bytt</button>
        </div>
      </div>
      <div id="q-body"></div>
      <div class="feedback" id="feedback"></div>
      <div class="ex-actions" id="ex-actions">
        <button class="btn btn-primary" onclick="nextQuestion()">
          ${index + 1 >= questions.length ? "Se resultat" : "Neste"} &rarr;
        </button>
      </div>
    </div>`;

  const body = document.getElementById("q-body");
  if      (type === "multipleChoice")  renderMC(questions[index], body);
  else if (type === "fillInBlank")     renderFill(questions[index], body);
  else if (type === "chooseCase")      renderCase(questions[index], body);
  else if (type === "trueOrFalse")     renderTF(questions[index], body);
  else if (type === "writeIn")         renderWrite(questions[index], body);
  else if (type === "match")           renderMatch(questions[index], body);
  else if (type === "articleChoice")   renderArticleChoice(questions[index], body);
  else if (type === "articleWrite")    renderArticleWrite(questions[index], body);
}

// ── Multiple choice ────────────────────────────────────────

function renderMC(q, c) {
  const s = q.sentence.replace("___", '<span class="blank">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>');
  const opts = shuffle(q.options);
  c.innerHTML = `
    <p class="ex-question">${s}</p>
    <div class="options-list">
      ${opts.map((o, i) => `
        <button class="option-btn" onclick="checkMC(this,'${o}')">
          <span class="opt-key">${LETTERS[i]}</span><span>${o}</span>
        </button>`).join("")}
    </div>`;
}
function checkMC(btn, chosen) {
  const q = cur.questions[cur.index];
  const ok = chosen === q.answer;
  document.querySelectorAll(".option-btn").forEach(b => {
    b.disabled = true;
    if (b.querySelector("span:last-child").textContent === q.answer) b.classList.add("correct");
  });
  if (!ok) btn.classList.add("wrong");
  reveal(ok, q.explanation, q.sentence, q.answer);
}

// ── Fill in blank ──────────────────────────────────────────

function renderFill(q, c) {
  const s = q.sentence.replace("___", '<span class="blank">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>');
  c.innerHTML = `
    <p class="ex-question">${s}</p>
    <p class="hint-line">Hint: ${q.hint}</p>
    <div class="fill-wrap">
      <input class="fill-input" id="fill-inp" type="text" placeholder="Skriv preposisjonen&hellip;" autocomplete="off" spellcheck="false" />
    </div>
    <button class="btn btn-primary" id="fill-btn" onclick="checkFill()">Sjekk svar</button>`;
  const inp = document.getElementById("fill-inp");
  inp.addEventListener("keydown", e => { if (e.key === "Enter") checkFill(); });
  setTimeout(() => inp.focus(), 40);
}
function checkFill() {
  const q = cur.questions[cur.index];
  const inp = document.getElementById("fill-inp");
  if (!inp.value.trim()) return;
  const ok = inp.value.trim().toLowerCase() === q.answer.toLowerCase();
  inp.classList.add(ok ? "correct" : "wrong"); inp.disabled = true;
  document.getElementById("fill-btn").disabled = true;
  if (ok && typeof Achievements !== "undefined") Achievements.recordFillCorrect();
  reveal(ok, ok ? q.explanation : `${q.explanation} . Riktig svar: <strong>${q.answer}</strong>`, q.sentence, q.answer);
}

// ── Choose case ────────────────────────────────────────────

function renderCase(q, c) {
  c.innerHTML = `
    <p class="ex-sub">Hvilken kasus krever <strong>${q.prep}</strong> i denne setningen?</p>
    <p class="ex-question">&ldquo;${q.sentence}&rdquo;</p>
    <div class="options-list options-2col">
      ${q.options.map((o, i) => `
        <button class="option-btn" onclick="checkCase(this,'${o}')">
          <span class="opt-key">${LETTERS[i]}</span>
          <span>${o.charAt(0).toUpperCase()+o.slice(1)}</span>
        </button>`).join("")}
    </div>`;
}
function checkCase(btn, chosen) {
  const q = cur.questions[cur.index];
  const ok = chosen === q.answer;
  document.querySelectorAll(".option-btn").forEach(b => {
    b.disabled = true;
    if (b.querySelector("span:last-child").textContent.toLowerCase() === q.answer) b.classList.add("correct");
  });
  if (!ok) btn.classList.add("wrong");
  const extra = q.keyword ? ` (<em>${q.keyword}</em>)` : "";
  reveal(ok, q.explanation + extra, q.sentence, q.answer);
}

// ── True/False ─────────────────────────────────────────────

function renderTF(q, c) {
  c.innerHTML = `
    <p class="ex-sub">Er denne påstanden riktig?</p>
    <p class="ex-question">&ldquo;${q.claim}&rdquo;</p>
    <div class="tf-row">
      <button class="tf-btn" onclick="checkTF(this,true)">Sant</button>
      <button class="tf-btn" onclick="checkTF(this,false)">Usant</button>
    </div>`;
}
function checkTF(btn, chosen) {
  const q = cur.questions[cur.index];
  const ok = chosen === q.answer;
  document.querySelectorAll(".tf-btn").forEach(b => {
    b.disabled = true;
    const right = (b.textContent.trim()==="Sant" && q.answer)||(b.textContent.trim()==="Usant" && !q.answer);
    if (right) b.classList.add("correct");
  });
  if (!ok) btn.classList.add("wrong");
  reveal(ok, q.explanation, q.claim, q.answer ? "Sant" : "Usant");
}

// ── Write in ───────────────────────────────────────────────

function renderWrite(q, c) {
  const s = q.sentence.replace("___", '<span class="blank">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>');
  c.innerHTML = `
    <p class="ex-question">${s}</p>
    <p class="hint-line">Hint: ${q.hint}</p>
    <div class="fill-wrap">
      <input class="fill-input" id="write-inp" type="text" placeholder="Skriv preposisjonen&hellip;" autocomplete="off" spellcheck="false" />
    </div>
    <button class="btn btn-primary" id="write-btn" onclick="checkWrite()">Sjekk svar</button>`;
  const inp = document.getElementById("write-inp");
  inp.addEventListener("keydown", e => { if (e.key === "Enter") checkWrite(); });
  setTimeout(() => inp.focus(), 40);
}
function checkWrite() {
  const q = cur.questions[cur.index];
  const inp = document.getElementById("write-inp");
  if (!inp.value.trim()) return;
  const ok = inp.value.trim().toLowerCase() === q.answer.toLowerCase();
  inp.classList.add(ok ? "correct" : "wrong"); inp.disabled = true;
  document.getElementById("write-btn").disabled = true;
  reveal(ok, ok ? "Riktig!" : `Riktig svar: <strong>${q.answer}</strong>`, q.sentence, q.answer);
}

// ── Match ──────────────────────────────────────────────────

function renderMatch(q, c) {
  const pairs = shuffle(q.pairs);
  const meanings = shuffle(pairs.map(p => p.meaning));
  c.innerHTML = `
    <p class="ex-sub">Klikk en preposisjon, deretter dens norske betydning.</p>
    <div class="match-grid">
      <div class="match-col" id="match-preps">
        ${pairs.map(p => `<div class="match-item" data-prep="${p.prep}" onclick="selectMatch(this,'prep')">${p.prep}</div>`).join("")}
      </div>
      <div class="match-col" id="match-meanings">
        ${meanings.map(m => `<div class="match-item" data-meaning="${m}" onclick="selectMatch(this,'meaning')">${m}</div>`).join("")}
      </div>
    </div>
    <p class="small muted" id="match-msg"></p>`;
  c._state = { pairs, sel: null, matched: 0 };
}
function selectMatch(el, side) {
  const c = document.getElementById("q-body");
  const s = c._state;
  if (!s || el.classList.contains("matched")) return;
  if (side === "prep") {
    document.querySelectorAll("#match-preps .match-item").forEach(e => e.classList.remove("selected"));
    el.classList.add("selected"); s.sel = el;
  } else if (side === "meaning" && s.sel) {
    const pair = s.pairs.find(p => p.prep === s.sel.dataset.prep);
    if (pair && pair.meaning === el.dataset.meaning) {
      s.sel.classList.remove("selected"); s.sel.classList.add("matched");
      el.classList.add("matched"); s.sel = null; s.matched++;
      if (s.matched === s.pairs.length) {
        document.getElementById("match-msg").textContent = "Alle matchet korrekt.";
        reveal(true, "Alle preposisjoner riktig matchet.", "match", "all");
      }
    } else {
      const selEl = s.sel; s.sel = null;
      [el, selEl].forEach(e => { e.classList.add("wrong-match"); e.classList.remove("selected"); });
      setTimeout(() => [el, selEl].forEach(e => e.classList.remove("wrong-match")), 550);
      Progress.recordAnswer("match", "?", false);
    }
  }
}

// ── Article helpers ────────────────────────────────────────

function getPrepNo(prep) {
  for (const group of Object.values(PREPOSITIONS)) {
    const found = group.prepositions.find(p => p.de === prep);
    if (found) return found.no;
  }
  return null;
}

function inlineArticleTable() {
  return `
    <div class="art-ref-inline">
      <p class="art-ref-label">Artikkelskjema</p>
      <table class="art-ref-tbl">
        <thead><tr>
          <th></th><th>Mask.</th><th>Fem.</th><th>Nøyt.</th><th>Pl.</th>
        </tr></thead>
        <tbody>
          <tr>
            <td class="art-k">Nom.</td>
            <td>der</td><td>die</td><td>das</td><td>die</td>
          </tr>
          <tr>
            <td class="art-k">Akk.</td>
            <td class="art-akk">den</td><td>die</td><td>das</td><td>die</td>
          </tr>
          <tr>
            <td class="art-k">Dat.</td>
            <td class="art-dat">dem</td><td class="art-dat">der</td><td class="art-dat">dem</td><td class="art-dat">den</td>
          </tr>
        </tbody>
      </table>
    </div>`;
}

// ── Article choice (new) ───────────────────────────────────

function renderArticleChoice(q, c) {
  const s = q.sentence.replace("___", '<span class="blank">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>');
  const caseTip = q.caseTip
    ? `<p class="hint-line" style="margin-bottom:.35rem;">${q.caseTip}</p>`
    : "";
  const prepNo = getPrepNo(q.prep);
  const prepLine = prepNo
    ? `<p class="hint-line" style="margin-bottom:.25rem;"><strong>${q.prep}</strong> = ${prepNo}</p>`
    : "";
  c.innerHTML = `
    <p class="ex-sub" style="margin-bottom:.5rem;">Fyll inn riktig <strong>bestemt artikkel</strong>.</p>
    ${prepLine}
    <p class="hint-line" style="margin-bottom:.35rem;">${q.note}</p>
    ${caseTip}
    ${inlineArticleTable()}
    <p class="ex-question">${s}</p>
    <div class="options-list">
      ${q.options.map((o, i) => `
        <button class="option-btn" onclick="checkArticleChoice(this,'${o}')">
          <span class="opt-key">${LETTERS[i]}</span><span>${o}</span>
        </button>`).join("")}
    </div>`;
}
function checkArticleChoice(btn, chosen) {
  const q = cur.questions[cur.index];
  const ok = chosen === q.answer;
  document.querySelectorAll(".option-btn").forEach(b => {
    b.disabled = true;
    if (b.querySelector("span:last-child").textContent === q.answer) b.classList.add("correct");
  });
  if (!ok) btn.classList.add("wrong");
  reveal(ok, q.explanation, q.sentence, q.answer);
}

// ── Article write (new) ────────────────────────────────────

function renderArticleWrite(q, c) {
  const s = q.sentence.replace("___", '<span class="blank">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>');
  const caseTip = q.caseTip
    ? `<p class="hint-line" style="margin-bottom:.35rem;">${q.caseTip}</p>`
    : "";
  c.innerHTML = `
    <p class="ex-sub" style="margin-bottom:.5rem;">Skriv riktig <strong>bestemt artikkel</strong>.</p>
    <p class="hint-line" style="margin-bottom:.35rem;">Hint: ${q.hint}</p>
    ${caseTip}
    ${inlineArticleTable()}
    <p class="ex-question">${s}</p>
    <div class="fill-wrap">
      <input class="fill-input" id="art-inp" type="text" placeholder="der / die / das / den / dem&hellip;" autocomplete="off" spellcheck="false" style="max-width:200px;" />
    </div>
    <button class="btn btn-primary" id="art-btn" onclick="checkArticleWrite()">Sjekk svar</button>`;
  const inp = document.getElementById("art-inp");
  inp.addEventListener("keydown", e => { if (e.key === "Enter") checkArticleWrite(); });
  setTimeout(() => inp.focus(), 40);
}
function checkArticleWrite() {
  const q = cur.questions[cur.index];
  const inp = document.getElementById("art-inp");
  if (!inp.value.trim()) return;
  const ok = inp.value.trim().toLowerCase() === q.answer.toLowerCase();
  inp.classList.add(ok ? "correct" : "wrong"); inp.disabled = true;
  document.getElementById("art-btn").disabled = true;
  reveal(ok, ok ? q.explanation : `Riktig svar: <strong>${q.answer}</strong> . ${q.explanation}`, q.sentence, q.answer);
}

// ── Shared ─────────────────────────────────────────────────

function reveal(ok, explanation, sentence, answer, rec = true) {
  if (rec) {
    cur.correct += ok ? 1 : 0;
    cur.streak   = ok ? cur.streak + 1 : 0;
    Progress.recordAnswer(sentence, answer, ok);
  }
  if (rec && typeof Achievements !== "undefined") Achievements.recordAnswer(ok);
  const showExp = (typeof Settings === "undefined") || Settings.get("showExplanation") !== false;
  const fb = document.getElementById("feedback");
  fb.className = "feedback show";
  fb.innerHTML = `
    <div class="feedback-status ${ok ? "ok" : "err"}">
      <span class="feedback-icon ${ok ? "ok" : "err"}">${ok ? "&#10003;" : "&#10007;"}</span>
      ${ok ? "Riktig" : "Feil"}
    </div>
    ${(showExp && explanation) ? `<p class="feedback-exp">${explanation}</p>` : ""}`;
  document.getElementById("ex-actions").className = "ex-actions show";

  if (rec && ok && typeof Settings !== "undefined" && Settings.get("autoNext")) {
    setTimeout(() => {
      const btn = document.querySelector("#ex-actions .btn-primary");
      if (btn) btn.click();
    }, 1500);
  }
}

function nextQuestion() {
  cur.index++;
  if (cur.index >= cur.questions.length) showResults();
  else renderQuestion();
}

// ── Results ────────────────────────────────────────────────

function showResults() {
  const { correct, questions, type, difficulty } = cur;
  const total = questions.length;
  const pct = Math.round((correct / total) * 100);
  const ring = pct >= 80 ? "ok" : pct >= 50 ? "mid" : "low";
  const msg = pct >= 80 ? "Godt jobbet." : pct >= 50 ? "Bra innsats." : "Øv litt mer.";
  const diffLabel = { easy:"Lett", medium:"Middels", hard:"Vanskelig" }[difficulty];
  const typeLabel = {
    multipleChoice:"Flervalg", fillInBlank:"Fyll inn", chooseCase:"Velg kasus",
    trueOrFalse:"Sant/usant", writeIn:"Skriv inn", match:"Koble",
    articleChoice:"Artikkelbøying (flervalg)", articleWrite:"Artikkelbøying (skriv inn)",
  }[type];

  document.getElementById("exercise-area").innerHTML = `
    <div class="ex-panel text-center">
      <p class="small muted" style="margin-bottom:1.5rem;">${typeLabel} &middot; ${diffLabel}</p>
      <div class="score-ring ${ring}">
        <span class="score-num">${correct}/${total}</span>
        <span class="score-pct">${pct}%</span>
      </div>
      <p style="font-size:1.05rem;font-weight:700;margin-bottom:.35rem;">${msg}</p>
      <p class="muted small" style="margin-bottom:1.75rem;">${correct} av ${total} riktig</p>
      <div class="btn-row" style="justify-content:center;">
        <button class="btn btn-primary" onclick="startExercise('${type}','${difficulty}')">Prøv igjen</button>
        <button class="btn btn-secondary" onclick="showChooser()">Bytt &oslash;ving</button>
        <a class="btn btn-secondary" href="progress.html">Fremgang</a>
      </div>
    </div>`;
}
