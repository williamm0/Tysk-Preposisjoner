// ============================================================
// Tyske Preposisjoner — test mode
// ============================================================

const TEST_LETTERS = ["A","B","C","D"];

let ts = {
  questions: [], index: 0, correct: 0,
  answers: [], timer: null, timeLeft: 0, timerEnabled: false,
};

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("start-test-btn")?.addEventListener("click", startTest);
});

// ── Setup ──────────────────────────────────────────────────

function startTest() {
  const count = parseInt(document.getElementById("q-count")?.value) || 10;
  const diff  = document.getElementById("q-diff")?.value || "alle";
  const timerOn = document.getElementById("timer-toggle")?.checked || false;
  const minutes = parseInt(document.getElementById("timer-minutes")?.value) || 5;

  ts = {
    questions: getTestPool(count, diff),
    index: 0, correct: 0, answers: [],
    timer: null,
    timeLeft: timerOn ? minutes * 60 : 0,
    timerEnabled: timerOn,
  };

  document.getElementById("test-setup").classList.add("hidden");
  document.getElementById("test-area").classList.remove("hidden");

  if (timerOn) startTimer();
  renderTestQ();
}

// ── Timer ──────────────────────────────────────────────────

function startTimer() {
  updateTimerEl();
  ts.timer = setInterval(() => {
    ts.timeLeft--;
    updateTimerEl();
    if (ts.timeLeft <= 0) { clearInterval(ts.timer); finishTest(); }
  }, 1000);
}

function updateTimerEl() {
  const el = document.getElementById("timer-el");
  if (!el) return;
  const m = Math.floor(ts.timeLeft / 60);
  const s = ts.timeLeft % 60;
  el.textContent = `${m}:${s.toString().padStart(2, "0")}`;
  el.classList.toggle("warn", ts.timeLeft <= 60);
}

// ── Render question ────────────────────────────────────────

function renderTestQ() {
  const { questions, index } = ts;
  const q = questions[index];
  const shown = Math.min(questions.length, 20);
  const dots = Array.from({ length: shown }, (_, i) => {
    const cls = i < index ? "progress-dot done" : i === index ? "progress-dot current" : "progress-dot";
    return `<span class="${cls}"></span>`;
  }).join("");

  const timerHtml = ts.timerEnabled
    ? `<span class="timer" id="timer-el">--:--</span>`
    : "";

  document.getElementById("test-area").innerHTML = `
    <div class="ex-panel">
      <div class="ex-meta">
        <span class="ex-meta-label">Prøve &middot; ${index + 1}&thinsp;/&thinsp;${questions.length}</span>
        <div style="display:flex;align-items:center;gap:.75rem;">
          ${timerHtml}
          <div class="progress-dots">${dots}</div>
        </div>
      </div>
      <div id="test-q"></div>
      <div class="feedback" id="test-fb"></div>
      <div class="ex-actions" id="test-actions">
        <button class="btn btn-primary" onclick="testNext()">
          ${index + 1 >= questions.length ? "Se resultat" : "Neste"} &rarr;
        </button>
      </div>
    </div>
  `;

  renderTestItem(q, document.getElementById("test-q"));
}

// ── Render item by type ────────────────────────────────────

function renderTestItem(q, c) {
  if      (q.type === "mc")   renderTMC(q, c);
  else if (q.type === "case") renderTCase(q, c);
  else if (q.type === "tf")   renderTTF(q, c);
  else if (q.type === "fill") renderTFill(q, c);
  else renderTMC(q, c);
}

function renderTMC(q, c) {
  const sentence = q.sentence.replace("___", '<span class="blank">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>');
  const opts = shuffle(q.options);
  c.innerHTML = `
    <p class="ex-sub" style="margin-bottom:.5rem;">Velg riktig preposisjon.</p>
    <p class="ex-question">${sentence}</p>
    <div class="options-list">
      ${opts.map((o, i) => `
        <button class="option-btn" onclick="checkTMC(this,'${o}')">
          <span class="opt-key">${TEST_LETTERS[i]}</span>
          <span>${o}</span>
        </button>`).join("")}
    </div>`;
}

function checkTMC(btn, chosen) {
  const q = ts.questions[ts.index];
  const ok = chosen === q.answer;
  document.querySelectorAll(".option-btn").forEach(b => {
    b.disabled = true;
    if (b.querySelector("span:last-child").textContent === q.answer) b.classList.add("correct");
  });
  if (!ok) btn.classList.add("wrong");
  recordTestAnswer(q, chosen, ok);
}

function renderTCase(q, c) {
  c.innerHTML = `
    <p class="ex-sub">Hvilken kasus krever <strong>${q.prep}</strong> i denne setningen?</p>
    <p class="ex-question">&ldquo;${q.sentence}&rdquo;</p>
    <div class="options-list options-2col">
      ${q.options.map((o, i) => `
        <button class="option-btn" onclick="checkTCase(this,'${o}')">
          <span class="opt-key">${TEST_LETTERS[i]}</span>
          <span>${o.charAt(0).toUpperCase() + o.slice(1)}</span>
        </button>`).join("")}
    </div>`;
}

function checkTCase(btn, chosen) {
  const q = ts.questions[ts.index];
  const ok = chosen === q.answer;
  document.querySelectorAll(".option-btn").forEach(b => {
    b.disabled = true;
    if (b.querySelector("span:last-child").textContent.toLowerCase() === q.answer) b.classList.add("correct");
  });
  if (!ok) btn.classList.add("wrong");
  recordTestAnswer(q, chosen, ok);
}

function renderTTF(q, c) {
  c.innerHTML = `
    <p class="ex-sub">Er denne p&aring;standen riktig?</p>
    <p class="ex-question">&ldquo;${q.claim}&rdquo;</p>
    <div class="tf-row">
      <button class="tf-btn" onclick="checkTTF(this,true)">Sant</button>
      <button class="tf-btn" onclick="checkTTF(this,false)">Usant</button>
    </div>`;
}

function checkTTF(btn, chosen) {
  const q = ts.questions[ts.index];
  const ok = chosen === q.answer;
  document.querySelectorAll(".tf-btn").forEach(b => {
    b.disabled = true;
    const right = (b.textContent.trim() === "Sant" && q.answer) ||
                  (b.textContent.trim() === "Usant" && !q.answer);
    if (right) b.classList.add("correct");
  });
  if (!ok) btn.classList.add("wrong");
  recordTestAnswer(q, chosen ? "Sant" : "Usant", ok);
}

function renderTFill(q, c) {
  const sentence = q.sentence.replace("___", '<span class="blank">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>');
  c.innerHTML = `
    <p class="ex-sub">Fyll inn riktig preposisjon.</p>
    <p class="ex-question">${sentence}</p>
    <p class="hint-line">Hint: ${q.hint}</p>
    <div class="fill-wrap">
      <input class="fill-input" id="tf-inp" type="text" placeholder="Skriv preposisjonen&hellip;" autocomplete="off" spellcheck="false" />
    </div>
    <button class="btn btn-primary" id="tf-btn" onclick="checkTFill()">Sjekk</button>`;
  const inp = document.getElementById("tf-inp");
  inp.addEventListener("keydown", e => { if (e.key === "Enter") checkTFill(); });
  setTimeout(() => inp.focus(), 40);
}

function checkTFill() {
  const q = ts.questions[ts.index];
  const inp = document.getElementById("tf-inp");
  if (!inp.value.trim()) return;
  const ok = inp.value.trim().toLowerCase() === q.answer.toLowerCase();
  inp.classList.add(ok ? "correct" : "wrong");
  inp.disabled = true;
  document.getElementById("tf-btn").disabled = true;
  recordTestAnswer(q, inp.value.trim(), ok);
}

// ── Record ─────────────────────────────────────────────────

function recordTestAnswer(q, userAnswer, ok) {
  if (ok) ts.correct++;
  ts.answers.push({ q, userAnswer, ok });

  const fb = document.getElementById("test-fb");
  const iconClass = ok ? "ok" : "err";
  const checkChar = ok ? "&#10003;" : "&#10007;";
  fb.className = "feedback show";
  fb.innerHTML = `
    <div class="feedback-status ${iconClass}">
      <span class="feedback-icon ${iconClass}">${checkChar}</span>
      ${ok ? "Riktig" : "Feil"}
    </div>
    ${q.explanation ? `<p class="feedback-exp">${q.explanation}</p>` : ""}
  `;
  document.getElementById("test-actions").className = "ex-actions show";

  Progress.recordAnswer(q.sentence || q.claim || "", q.answer, ok);
}

function testNext() {
  ts.index++;
  if (ts.index >= ts.questions.length) {
    if (ts.timer) clearInterval(ts.timer);
    finishTest();
  } else {
    renderTestQ();
  }
}

// ── Results ────────────────────────────────────────────────

function finishTest() {
  const { correct, questions, answers } = ts;
  const total = questions.length;
  const pct = Math.round((correct / total) * 100);
  const ring = pct >= 80 ? "ok" : pct >= 50 ? "mid" : "low";
  const grade = pct >= 90 ? "6" : pct >= 75 ? "5" : pct >= 60 ? "4" : pct >= 45 ? "3" : pct >= 30 ? "2" : "1";
  const msg = pct >= 80 ? "Godt jobbet." : pct >= 50 ? "Bra innsats, fortsett &aring; &oslash;ve." : "G&aring; gjennom teorien og prøv igjen.";

  Progress.recordTest(correct, total);
  if (typeof Achievements !== "undefined") Achievements.recordTest(correct, total);

  const GRADE_THRESHOLDS = [
    { grade: 6, pct: 90 }, { grade: 5, pct: 75 },
    { grade: 4, pct: 60 }, { grade: 3, pct: 45 }, { grade: 2, pct: 30 },
  ];
  const targetGrade = (typeof Settings !== "undefined") ? (Settings.get("targetGrade") || 5) : 5;
  const targetThreshold = GRADE_THRESHOLDS.find(t => t.grade === Number(targetGrade));
  let targetHtml = "";
  if (targetThreshold && pct < targetThreshold.pct) {
    targetHtml = `<p class="small muted" style="margin-bottom:1.5rem;">Du trenger ${targetThreshold.pct}% for karakter ${targetGrade}.</p>`;
  }

  const reviewHtml = answers.map((a, i) => {
    const sentence = (a.q.sentence || a.q.claim || "").replace("___", `<u>${a.q.answer}</u>`);
    const short = sentence.length > 90 ? sentence.slice(0, 90) + "&hellip;" : sentence;
    const answerLine = a.ok
      ? `Svar: <strong>${a.userAnswer}</strong>`
      : `Ditt svar: <strong>${a.userAnswer}</strong> . Riktig: <strong>${a.q.answer}</strong>`;
    return `
      <div class="review-item ${a.ok ? "ok" : "err"}">
        <div class="rv-q">${i + 1}. ${short}</div>
        <div class="rv-a">${answerLine}${a.q.explanation ? ". " + a.q.explanation : ""}</div>
      </div>`;
  }).join("");

  document.getElementById("test-area").innerHTML = `
    <div class="ex-panel">
      <div class="text-center" style="margin-bottom:2rem;">
        <p style="font-size:.75rem;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:var(--text3);margin-bottom:1.25rem;">Pr&oslash;veresultat</p>
        <div class="score-ring ${ring}">
          <span class="score-num">${correct}/${total}</span>
          <span class="score-pct">${pct}%</span>
        </div>
        <p style="font-size:1.5rem;font-weight:800;letter-spacing:-.02em;margin-bottom:.25rem;">Karakter ${grade}</p>
        <p class="muted" style="margin-bottom:.5rem;">${msg}</p>
        ${targetHtml}
        <div class="btn-row" style="justify-content:center;">
          <button class="btn btn-primary" onclick="resetTest()">Ta prøven igjen</button>
          <a class="btn btn-secondary" href="practice.html">Øv mer</a>
          <a class="btn btn-secondary" href="progress.html">Fremgang</a>
        </div>
      </div>
      <div class="divider"></div>
      <p style="font-size:.75rem;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:var(--text3);margin-bottom:1rem;">Gjennomgang</p>
      ${reviewHtml}
    </div>
  `;
}

function resetTest() {
  if (ts.timer) clearInterval(ts.timer);
  document.getElementById("test-setup").classList.remove("hidden");
  document.getElementById("test-area").classList.add("hidden");
  document.getElementById("test-area").innerHTML = "";
}
