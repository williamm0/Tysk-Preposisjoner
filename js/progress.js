// ============================================================
// TYSKE PREPOSISJONER — Progress page
// ============================================================

document.addEventListener("DOMContentLoaded", () => {
  renderProgress();

  const resetBtn = document.getElementById("reset-btn");
  if (resetBtn) {
    resetBtn.addEventListener("click", () => {
      if (confirm("Er du sikker på at du vil slette all fremgangsdata? Dette kan ikke angres.")) {
        Progress.reset();
        renderProgress();
        showToast("Fremgangsdata slettet.");
      }
    });
  }
});

function renderProgress() {
  const d = Progress.get();

  // Stats
  const accuracy = d.totalAnswered > 0
    ? Math.round((d.totalCorrect / d.totalAnswered) * 100)
    : 0;

  const avgTest = d.testsScores.length > 0
    ? Math.round(d.testsScores.reduce((s, t) => s + Math.round(t.score/t.total*100), 0) / d.testsScores.length)
    : null;

  document.getElementById("stat-answered").textContent = d.totalAnswered;
  document.getElementById("stat-correct").textContent = d.totalCorrect;
  document.getElementById("stat-accuracy").textContent = d.totalAnswered > 0 ? accuracy + "%" : "–";
  document.getElementById("stat-tests").textContent = d.testsTaken;
  document.getElementById("stat-avg").textContent = avgTest !== null ? avgTest + "%" : "–";

  // Accuracy bar
  const barEl = document.getElementById("accuracy-bar");
  if (barEl) {
    barEl.style.width = accuracy + "%";
    barEl.style.background = accuracy >= 80 ? "var(--dat)" : accuracy >= 50 ? "var(--wex)" : "#DC2626";
  }

  // Last activity
  const lastEl = document.getElementById("last-activity");
  if (lastEl) {
    if (d.lastActivity) {
      const date = new Date(d.lastActivity);
      lastEl.textContent = date.toLocaleDateString("nb-NO", { weekday:"long", year:"numeric", month:"long", day:"numeric" });
    } else {
      lastEl.textContent = "Ingen aktivitet ennå";
    }
  }

  // Wrong answers
  const wrongContainer = document.getElementById("wrong-list");
  if (wrongContainer) {
    const entries = Object.entries(d.wrongAnswers).sort((a, b) => b[1].count - a[1].count);
    if (entries.length === 0) {
      wrongContainer.innerHTML = `<li style="padding:1rem;color:var(--text-3);text-align:center;">Ingen feil registrert ennå bra jobbet! 🎉</li>`;
    } else {
      wrongContainer.innerHTML = entries.slice(0, 20).map(([sentence, info]) => {
        const shortSentence = sentence.length > 70 ? sentence.slice(0,70)+"…" : sentence;
        return `
          <li>
            <span>${shortSentence}</span>
            <span class="wrong-pill">${info.count} feil</span>
          </li>
        `;
      }).join("");
    }
  }

  // Test history
  const histContainer = document.getElementById("test-history");
  if (histContainer) {
    if (d.testsScores.length === 0) {
      histContainer.innerHTML = `<p class="text-muted text-center" style="padding:1rem;">Du har ikke tatt noen prøver ennå.</p>`;
    } else {
      const scores = [...d.testsScores].reverse().slice(0, 10);
      histContainer.innerHTML = `
        <table class="prep-table">
          <thead><tr><th>Prøve</th><th>Resultat</th><th>Prosent</th><th>Dato</th></tr></thead>
          <tbody>
            ${scores.map((t, i) => {
              const pct = Math.round(t.score/t.total*100);
              const date = new Date(t.date).toLocaleDateString("nb-NO");
              const color = pct >= 80 ? "var(--dat)" : pct >= 50 ? "var(--wex)" : "#DC2626";
              return `<tr>
                <td>#${d.testsScores.length - i}</td>
                <td>${t.score}/${t.total}</td>
                <td style="font-weight:700;color:${color}">${pct}%</td>
                <td style="color:var(--text-2);font-size:.85rem">${date}</td>
              </tr>`;
            }).join("")}
          </tbody>
        </table>
      `;
    }
  }

  renderSuggestions(d.wrongAnswers);

  // Mini bar chart for last 10 tests
  const chartEl = document.getElementById("score-chart");
  if (chartEl && d.testsScores.length > 0) {
    const last10 = d.testsScores.slice(-10);
    chartEl.innerHTML = last10.map(t => {
      const pct = Math.round(t.score/t.total*100);
      const color = pct >= 80 ? "var(--dat)" : pct >= 50 ? "var(--wex)" : "#DC2626";
      return `
        <div style="display:flex;flex-direction:column;align-items:center;gap:.25rem;flex:1;">
          <span style="font-size:.7rem;font-weight:700;color:${color}">${pct}%</span>
          <div style="width:100%;background:var(--border);border-radius:4px;height:80px;display:flex;align-items:flex-end;overflow:hidden;">
            <div style="width:100%;height:${pct}%;background:${color};border-radius:4px;transition:height .3s;"></div>
          </div>
        </div>
      `;
    }).join("");
    chartEl.closest(".hidden")?.classList.remove("hidden");
  }
}

function renderSuggestions(wrongAnswers) {
  const el = document.getElementById("suggestions");
  if (!el) return;

  const akkPreps = ["durch","für","gegen","ohne","um"];
  const datPreps = ["aus","bei","mit","nach","seit","von","zu","außer","gegenüber","ab"];
  const wexPreps = ["an","auf","hinter","in","neben","über","unter","vor","zwischen"];

  const groups = [
    { key: "akk", label: "Akkusativ",      hint: akkPreps.join(", "),  color: "var(--akk)", preps: akkPreps, errors: 0 },
    { key: "dat", label: "Dativ",           hint: datPreps.join(", "),  color: "var(--dat)", preps: datPreps, errors: 0 },
    { key: "wex", label: "Wechselpräp.",   hint: wexPreps.join(", "),  color: "var(--wex)", preps: wexPreps, errors: 0 },
  ];

  Object.entries(wrongAnswers).forEach(([sentence, info]) => {
    const prep = (info.prep || "").toLowerCase();
    for (const g of groups) {
      if (g.preps.includes(prep)) { g.errors += info.count; break; }
    }
  });

  const sorted = groups.filter(g => g.errors > 0).sort((a, b) => b.errors - a.errors).slice(0, 3);

  if (sorted.length === 0) {
    el.innerHTML = `<p class="small muted">Ingen feil registrert ennå. Svar på noen oppgaver for å få forslag.</p>`;
    return;
  }

  el.innerHTML = sorted.map(g => `
    <a class="suggestion-card" href="practice.html" style="border-left-color:${g.color};">
      <span class="suggestion-label">${g.label}</span>
      <span class="suggestion-hint">${g.hint}</span>
      <span class="suggestion-count">${g.errors} feil</span>
    </a>
  `).join("");
}
