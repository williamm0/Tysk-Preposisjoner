// ============================================================
// Tyske Preposisjoner — data
// ============================================================

// ── Prepositions ────────────────────────────────────────────

const PREPOSITIONS = {
  akkusativ: {
    id: "akkusativ",
    name: "Akkusativ",
    color: "#174FA8",
    description: "Styrer alltid akkusativ kasus.",
    tip: "5 akkusativ-preposisjoner: durch &middot; für &middot; gegen &middot; ohne &middot; um",
    prepositions: [
      { de: "durch", no: "gjennom", examples: ["Er geht durch den Park.", "Das Licht scheint durch das Fenster."], note: "Bevegelse gjennom noe" },
      { de: "für",   no: "for",     examples: ["Das Geschenk ist für dich.", "Ich lerne für die Prüfung."], note: "Til fordel for noen/noe" },
      { de: "gegen", no: "mot",     examples: ["Wir spielen gegen das andere Team.", "Er lehnt gegen die Wand."], note: "Retning mot eller motstand" },
      { de: "ohne",  no: "uten",    examples: ["Ich trinke Kaffee ohne Zucker.", "Sie geht ohne ihren Bruder."], note: "Fravær av noe" },
      { de: "um",    no: "rundt / klokken", examples: ["Wir gehen um den See.", "Um drei Uhr komme ich."], note: "Rundt noe, eller klokkeslett" },
    ]
  },
  dativ: {
    id: "dativ",
    name: "Dativ",
    color: "#15623A",
    description: "Styrer alltid dativ kasus.",
    tip: "<strong>ABMNSZ</strong>: Aus · Bei · Mit · Nach · Seit · Von · Zu · Außer · Gegenüber · Ab",
    prepositions: [
      { de: "aus",         no: "fra / ut av",     examples: ["Er kommt aus Deutschland.", "Sie trinkt aus der Flasche."], note: "Opprinnelse eller ut av noe" },
      { de: "bei",         no: "hos / ved",       examples: ["Ich wohne bei meiner Tante.", "Er arbeitet bei einer Firma."], note: "Tilstedeværelse hos noen" },
      { de: "mit",         no: "med",             examples: ["Ich fahre mit dem Bus.", "Sie kommt mit ihrem Freund."], note: "Sammen med, eller transportmiddel" },
      { de: "nach",        no: "etter / til (steder uten artikkel)", examples: ["Ich fahre nach Berlin.", "Nach der Schule gehe ich heim."], note: "Til stedsnavn uten artikkel, eller etter i tid" },
      { de: "seit",        no: "siden / i (noe som pågår)", examples: ["Ich lerne seit drei Jahren Deutsch.", "Seit gestern bin ich krank."], note: "Noe som startet i fortiden og fortsatt pågår" },
      { de: "von",         no: "fra / av",        examples: ["Das Buch ist von meiner Lehrerin.", "Ich komme von der Schule."], note: "Opprinnelse, eierskap, eller 'av'" },
      { de: "zu",          no: "til (personer og steder m/art.)", examples: ["Ich gehe zu meiner Freundin.", "Wir fahren zum Bahnhof."], note: "Til personer eller spesifikke steder" },
      { de: "außer",       no: "unntatt / foruten", examples: ["Alle außer mir waren da.", "Außer dem Hund war niemand zu Hause."], note: "Unntatt noen/noe" },
      { de: "gegenüber",   no: "overfor",         examples: ["Das Café liegt gegenüber dem Bahnhof.", "Er sitzt mir gegenüber."], note: "Rett overfor. Kan komme foran eller etter substantivet" },
      { de: "ab",          no: "fra (tidspunkt/sted)", examples: ["Ab morgen lerne ich mehr.", "Der Zug fährt ab dem Hauptbahnhof."], note: "Fra et bestemt tidspunkt eller sted" },
    ]
  },
  wechsel: {
    id: "wechsel",
    name: "Wechsel",
    color: "#8A5400",
    description: "Tar akkusativ ved bevegelse (Wohin?), dativ ved sted/ro (Wo?).",
    tip: "Wohin? (Bevegelse) → Akkusativ &nbsp;|&nbsp; Wo? (Sted/ro) → Dativ",
    prepositions: [
      { de: "an",      no: "ved / på (vertikal flate)", examples: ["Das Bild hängt an der Wand. (Dat.)", "Ich hänge das Bild an die Wand. (Akk.)"], note: "Vertikal flate eller kant" },
      { de: "auf",     no: "på (horisontal flate)",     examples: ["Das Buch liegt auf dem Tisch. (Dat.)", "Ich lege das Buch auf den Tisch. (Akk.)"], note: "Horisontal flate" },
      { de: "hinter",  no: "bak",                       examples: ["Der Hund sitzt hinter dem Sofa. (Dat.)", "Der Hund läuft hinter das Sofa. (Akk.)"], note: "Bak noe" },
      { de: "in",      no: "i / inn i",                 examples: ["Ich bin in der Schule. (Dat.)", "Ich gehe in die Schule. (Akk.)"], note: "Inne i (Dat.) eller inn i (Akk.)" },
      { de: "neben",   no: "ved siden av",              examples: ["Er sitzt neben mir. (Dat.)", "Er stellt sich neben mich. (Akk.)"], note: "Ved siden av noe" },
      { de: "über",    no: "over",                      examples: ["Die Lampe hängt über dem Tisch. (Dat.)", "Er hängt die Lampe über den Tisch. (Akk.)"], note: "Over noe" },
      { de: "unter",   no: "under",                     examples: ["Die Katze liegt unter dem Bett. (Dat.)", "Die Katze kriecht unter das Bett. (Akk.)"], note: "Under noe" },
      { de: "vor",     no: "foran",                     examples: ["Ich stehe vor dem Haus. (Dat.)", "Ich stelle mich vor das Haus. (Akk.)"], note: "Foran noe. 'vor' i tid bruker alltid dativ" },
      { de: "zwischen",no: "mellom",                    examples: ["Das Heft liegt zwischen den Büchern. (Dat.)", "Er legt das Heft zwischen die Bücher. (Akk.)"], note: "Mellom to ting" },
    ]
  }
};

// ── Article table ────────────────────────────────────────────

const ARTICLE_TABLE = {
  rows: [
    { kasus: "Nominativ", mask: "der", fem: "die", nøyt: "das", pl: "die", changed: [] },
    { kasus: "Akkusativ", mask: "den", fem: "die", nøyt: "das", pl: "die", changed: ["mask"] },
    { kasus: "Dativ",     mask: "dem", fem: "der", nøyt: "dem", pl: "den", changed: ["mask","fem","nøyt","pl"] },
  ]
};

// ── Exercises ────────────────────────────────────────────────

const EXERCISES = {

  // ── 1. Multiple choice ──────────────────────────────────────
  multipleChoice: {
    easy: [
      { sentence: "Ich gehe ___ den Park.", answer: "durch", options: ["durch","für","ohne","seit"], explanation: "'Durch' betyr 'gjennom' og tar alltid akkusativ.", case: "akkusativ" },
      { sentence: "Das Geschenk ist ___ dich.", answer: "für", options: ["für","gegen","mit","von"], explanation: "'Für' betyr 'for' og tar alltid akkusativ.", case: "akkusativ" },
      { sentence: "Ich trinke Kaffee ___ Zucker.", answer: "ohne", options: ["ohne","mit","bei","aus"], explanation: "'Ohne' betyr 'uten' og tar alltid akkusativ.", case: "akkusativ" },
      { sentence: "Er kommt ___ Deutschland.", answer: "aus", options: ["aus","von","nach","zu"], explanation: "'Aus' brukes for land man kommer fra og tar dativ.", case: "dativ" },
      { sentence: "Ich fahre ___ dem Bus.", answer: "mit", options: ["mit","bei","durch","von"], explanation: "'Mit' brukes med transportmidler og tar dativ.", case: "dativ" },
      { sentence: "Sie wohnt ___ ihrer Oma.", answer: "bei", options: ["bei","zu","aus","mit"], explanation: "'Bei' betyr 'hos' og tar dativ.", case: "dativ" },
      { sentence: "Wir spielen ___ das andere Team.", answer: "gegen", options: ["gegen","für","ohne","um"], explanation: "'Gegen' betyr 'mot' og tar alltid akkusativ.", case: "akkusativ" },
      { sentence: "Ich fahre ___ Berlin.", answer: "nach", options: ["nach","zu","in","auf"], explanation: "'Nach' brukes med stedsnavn uten artikkel og tar dativ.", case: "dativ" },
      { sentence: "Das Buch liegt ___ dem Tisch.", answer: "auf", options: ["auf","über","an","in"], explanation: "'Auf' + Dativ = sted/ro. Boken ligger på bordet.", case: "dativ" },
      { sentence: "Ich lerne ___ drei Jahren Deutsch.", answer: "seit", options: ["seit","vor","nach","ab"], explanation: "'Seit' brukes for noe som startet i fortiden og fortsatt pågår. Tar dativ.", case: "dativ" },
      { sentence: "Ich gehe ___ meiner Freundin.", answer: "zu", options: ["zu","nach","bei","von"], explanation: "'Zu' brukes til personer og spesifikke steder. Tar dativ.", case: "dativ" },
      { sentence: "Er läuft ___ das Zimmer.", answer: "durch", options: ["durch","in","über","an"], explanation: "'Durch' = gjennom, akkusativ.", case: "akkusativ" },
      // NEW easy questions
      { sentence: "Er sitzt ___ dem Bahnhof. (overfor)", answer: "gegenüber", options: ["gegenüber","neben","hinter","vor"], explanation: "'Gegenüber' betyr 'overfor' og tar alltid dativ.", case: "dativ" },
      { sentence: "___ Montag haben wir keine Schule. (fra og med)", answer: "Ab", options: ["Ab","Seit","Nach","Von"], explanation: "'Ab' betyr 'fra (et tidspunkt)' og tar dativ.", case: "dativ" },
      { sentence: "Alle ___ ihm applaudierten. (unntatt)", answer: "außer", options: ["außer","ohne","gegen","neben"], explanation: "'Außer' betyr 'unntatt' og tar alltid dativ.", case: "dativ" },
      { sentence: "Wir gehen ___ die Kirche. (rundt)", answer: "um", options: ["um","durch","gegen","über"], explanation: "'Um' betyr 'rundt' og tar alltid akkusativ.", case: "akkusativ" },
      { sentence: "Das Buch ist ___ die Prüfung. (for/til)", answer: "für", options: ["für","von","zu","bei"], explanation: "'Für' betyr 'for' og tar alltid akkusativ.", case: "akkusativ" },
    ],
    medium: [
      { sentence: "Die Katze liegt ___ dem Bett.", answer: "unter", options: ["unter","über","neben","hinter"], explanation: "'Unter' = under. Katten er på et sted (ro) → Dativ.", case: "dativ" },
      { sentence: "Ich hänge das Bild ___ die Wand.", answer: "an", options: ["an","auf","über","vor"], explanation: "'An' + Akkusativ = bevegelse til vertikal flate. Vi henger bildet opp.", case: "akkusativ" },
      { sentence: "Er sitzt ___ mir.", answer: "gegenüber", options: ["gegenüber","neben","zwischen","hinter"], explanation: "'Gegenüber' = overfor, tar dativ.", case: "dativ" },
      { sentence: "Stell das Fahrrad ___ das Haus.", answer: "vor", options: ["vor","hinter","neben","an"], explanation: "'Vor' + Akkusativ = bevegelse, vi plasserer sykkelen foran huset.", case: "akkusativ" },
      { sentence: "Das Fahrrad steht ___ dem Haus.", answer: "vor", options: ["vor","hinter","neben","an"], explanation: "'Vor' + Dativ = sykkelen er foran huset (ro).", case: "dativ" },
      { sentence: "Ich kaufe Blumen ___ meine Mutter.", answer: "für", options: ["für","von","mit","bei"], explanation: "'Für' = for, tar akkusativ.", case: "akkusativ" },
      { sentence: "___ morgen lerne ich jeden Tag.", answer: "Ab", options: ["Ab","Seit","Nach","Bis"], explanation: "'Ab' = fra (et fremtidig tidspunkt), tar dativ.", case: "dativ" },
      { sentence: "Das Kind läuft ___ den See.", answer: "um", options: ["um","durch","gegen","über"], explanation: "'Um' = rundt, tar akkusativ.", case: "akkusativ" },
      { sentence: "Das Bild hängt ___ der Wand.", answer: "an", options: ["an","auf","über","vor"], explanation: "'An' + Dativ = bildet henger på veggen (ro).", case: "dativ" },
      { sentence: "Er geht ___ das Haus.", answer: "hinter", options: ["hinter","neben","vor","in"], explanation: "'Hinter' + Akkusativ = han går bak huset (bevegelse).", case: "akkusativ" },
      { sentence: "Er wartet ___ dem Haus.", answer: "hinter", options: ["hinter","neben","vor","in"], explanation: "'Hinter' + Dativ = han venter bak huset (ro).", case: "dativ" },
      { sentence: "Ich stelle mich ___ dich.", answer: "neben", options: ["neben","zwischen","vor","hinter"], explanation: "'Neben' + Akkusativ = jeg plasserer meg ved siden av deg (bevegelse).", case: "akkusativ" },
      // NEW medium questions
      { sentence: "Wir fahren ___ dem Zug nach München.", answer: "mit", options: ["mit","bei","durch","von"], explanation: "'Mit' brukes med transportmiddel og tar dativ.", case: "dativ" },
      { sentence: "Er stellt die Stühle ___ den Tisch. (rundt)", answer: "um", options: ["um","neben","vor","hinter"], explanation: "'Um' + Akkusativ = rundt (bevegelse/plassering).", case: "akkusativ" },
      { sentence: "Sie fährt ___ der Arbeit nach Hause.", answer: "von", options: ["von","aus","bei","nach"], explanation: "'Von' betyr 'fra' og tar alltid dativ.", case: "dativ" },
      { sentence: "Ich kaufe das ___ einen Euro. (for – pris)", answer: "für", options: ["für","gegen","ohne","um"], explanation: "'Für' brukes om pris og tar akkusativ.", case: "akkusativ" },
      { sentence: "Er schreibt ___ dem Bleistift. (med)", answer: "mit", options: ["mit","bei","durch","von"], explanation: "'Mit' brukes om verktøy/hjelpemiddel og tar dativ.", case: "dativ" },
    ],
    hard: [
      { sentence: "Er stellt das Buch ___ die anderen Bücher.", answer: "zwischen", options: ["zwischen","neben","hinter","vor"], explanation: "'Zwischen' + Akkusativ = han setter boken mellom bøkene (bevegelse).", case: "akkusativ" },
      { sentence: "Das Buch steht ___ den anderen Büchern.", answer: "zwischen", options: ["zwischen","neben","hinter","vor"], explanation: "'Zwischen' + Dativ = boken er mellom bøkene (ro).", case: "dativ" },
      { sentence: "Er trat ___ den Raum.", answer: "in", options: ["in","an","auf","über"], explanation: "'In' + Akkusativ = bevegelse inn i rommet.", case: "akkusativ" },
      { sentence: "Er arbeitet ___ seiner Vaters Firma.", answer: "bei", options: ["bei","in","an","für"], explanation: "'Bei einer Firma arbeiten' = jobbe i/for et firma, tar dativ.", case: "dativ" },
      { sentence: "Ich komme ___ einer Stunde.", answer: "in", options: ["in","nach","vor","bei"], explanation: "'In einer Stunde' = om en time. Tidsuttrykk med 'in' → Dativ.", case: "dativ" },
      { sentence: "Sie setzt sich ___ den Tisch und den Stuhl.", answer: "zwischen", options: ["zwischen","neben","vor","hinter"], explanation: "'Zwischen' + Akkusativ = hun setter seg mellom bordet og stolen (bevegelse).", case: "akkusativ" },
      // NEW hard questions
      { sentence: "Wir treffen uns ___ dem Eingang. (overfor)", answer: "gegenüber", options: ["gegenüber","neben","vor","hinter"], explanation: "'Gegenüber' = overfor, tar alltid dativ.", case: "dativ" },
      { sentence: "Er lehnt das Fahrrad ___ die Wand. (mot)", answer: "gegen", options: ["gegen","an","auf","vor"], explanation: "'Gegen' + Akkusativ = mot (alltid akkusativ). Merk: 'an die Wand' er også mulig for 'lene mot veggen', men 'gegen' understreker kontakten.", case: "akkusativ" },
      { sentence: "Sie kauft das Ticket ___ zehn Euro. (for – pris)", answer: "für", options: ["für","gegen","um","durch"], explanation: "'Für' brukes om pris/verdi og tar alltid akkusativ.", case: "akkusativ" },
      { sentence: "___ nächstem Dienstag habe ich Urlaub. (fra og med)", answer: "Ab", options: ["Ab","Seit","Nach","Von"], explanation: "'Ab' = fra (fremtidig tidspunkt), tar dativ. 'Nächstem Dienstag' er dativ maskulin.", case: "dativ" },
      { sentence: "Er arbeitet ___ fünf Jahren hier. (i – noe som pågår)", answer: "seit", options: ["seit","vor","ab","nach"], explanation: "'Seit' brukes om noe som startet i fortiden og fortsatt pågår, tar dativ.", case: "dativ" },
      { sentence: "Das Wasser fließt ___ die Felsen. (over – bevegelse)", answer: "über", options: ["über","an","auf","durch"], explanation: "'Über' + Akkusativ = bevegelse over noe.", case: "akkusativ" },
    ],
  },

  // ── 2. Fill in blank ────────────────────────────────────────
  fillInBlank: {
    easy: [
      { sentence: "Das ist ___ dich. (for)", answer: "für", hint: "Akkusativ-preposisjon", explanation: "'Für' = for, tar akkusativ." },
      { sentence: "Er kommt ___ Deutschland. (fra)", answer: "aus", hint: "Dativ-preposisjon", explanation: "'Aus' = fra (opprinnelse), tar dativ." },
      { sentence: "Ich fahre ___ dem Bus. (med)", answer: "mit", hint: "Dativ-preposisjon", explanation: "'Mit' = med, tar dativ." },
      { sentence: "Ich gehe ___ ihn. (uten)", answer: "ohne", hint: "Akkusativ-preposisjon", explanation: "'Ohne' = uten, tar akkusativ." },
      { sentence: "Wir spielen ___ den Regen. (mot)", answer: "gegen", hint: "Akkusativ-preposisjon", explanation: "'Gegen' = mot, tar akkusativ." },
      { sentence: "___ morgen bin ich weg. (fra og med)", answer: "Ab", hint: "Dativ-preposisjon", explanation: "'Ab' = fra (et tidspunkt), tar dativ." },
      { sentence: "Das Buch liegt ___ dem Tisch. (på)", answer: "auf", hint: "Wechsel – er det ro eller bevegelse?", explanation: "'Auf' + Dativ = sted/ro. Boken ligger på bordet." },
      { sentence: "Ich gehe ___ der Schule. (til)", answer: "zu", hint: "Dativ-preposisjon til spesifikke steder", explanation: "'Zu' = til (spesifikke steder), tar dativ." },
      { sentence: "Alle ___ mir lachen. (unntatt)", answer: "außer", hint: "Dativ-preposisjon", explanation: "'Außer' = unntatt, tar dativ." },
      { sentence: "Ich lerne ___ die Prüfung. (for/til)", answer: "für", hint: "Akkusativ-preposisjon", explanation: "'Für' = for, tar akkusativ." },
    ],
    medium: [
      { sentence: "Das Bild hängt ___ der Wand. (på – ingen bevegelse)", answer: "an", hint: "Vertikal flate, ingen bevegelse → Dativ", explanation: "'An' + Dativ = bildet henger på veggen (ro)." },
      { sentence: "Ich hänge das Bild ___ die Wand. (på – bevegelse)", answer: "an", hint: "Vertikal flate, bevegelse → Akkusativ", explanation: "'An' + Akkusativ = vi henger noe opp (bevegelse)." },
      { sentence: "___ drei Jahren war ich in Berlin. (for ... siden)", answer: "Vor", hint: "Wechsel i tidsuttrykk → alltid Dativ", explanation: "'Vor' i tidsuttrykk = for ... siden, tar dativ." },
      { sentence: "Er sitzt ___ dem Sofa und dem Tisch. (mellom – ro)", answer: "zwischen", hint: "Wechsel, sted/ro → Dativ", explanation: "'Zwischen' + Dativ = han sitter mellom (sted/ro)." },
      { sentence: "Ich lege das Heft ___ die Bücher. (mellom – bevegelse)", answer: "zwischen", hint: "Wechsel, bevegelse → Akkusativ", explanation: "'Zwischen' + Akkusativ = jeg legger heftet mellom bøkene." },
      { sentence: "Das Café liegt ___ dem Bahnhof. (overfor)", answer: "gegenüber", hint: "Dativ-preposisjon", explanation: "'Gegenüber' = overfor, tar dativ." },
      { sentence: "Ich komme ___ der Schule. (fra)", answer: "von", hint: "Dativ-preposisjon", explanation: "'Von' = fra, tar dativ." },
      { sentence: "Er geht ___ das Haus. (bak – bevegelse)", answer: "hinter", hint: "Wechsel, bevegelse → Akkusativ", explanation: "'Hinter' + Akkusativ = han går bak huset (bevegelse)." },
      { sentence: "Er steht ___ dem Haus. (bak – ro)", answer: "hinter", hint: "Wechsel, ro → Dativ", explanation: "'Hinter' + Dativ = han står bak huset (ro)." },
      // NEW medium questions
      { sentence: "Das Kind läuft ___ den Vater. (mot – bevegelse)", answer: "auf", hint: "Wechsel, bevegelse mot person → Akkusativ ('auf jmdn. zulaufen')", explanation: "'Auf jemanden zulaufen' = løpe mot noen (bevegelse) → Akkusativ. Merk idiomatisk bruk av 'auf'." },
      { sentence: "Er hängt seinen Mantel ___ die Tür. (bak – bevegelse)", answer: "hinter", hint: "Wechsel, bevegelse → Akkusativ", explanation: "'Hinter' + Akkusativ = han henger jakken bak døren (bevegelse)." },
      { sentence: "Der Hund schläft ___ dem Sofa. (under – ro)", answer: "unter", hint: "Wechsel, ro → Dativ", explanation: "'Unter' + Dativ = hunden sover under sofaen (ro)." },
      { sentence: "Ich lege die Jacke ___ das Bett. (på – bevegelse)", answer: "auf", hint: "Wechsel, horisontal flate, bevegelse → Akkusativ", explanation: "'Auf' + Akkusativ = jeg legger jakken på sengen (bevegelse)." },
      { sentence: "Sie stellt sich ___ das Fenster. (ved – bevegelse mot vertikal flate)", answer: "an", hint: "Wechsel, vertikal flate, bevegelse → Akkusativ", explanation: "'An' + Akkusativ = hun stiller seg ved vinduet (bevegelse)." },
    ],
    hard: [
      { sentence: "Sie stand ___ dem Fenster und schaute hinaus. (ved)", answer: "an",hint: "Wechsel, vertikal flate, sted/ro → Dativ", explanation: "'An' + Dativ = hun sto ved vinduet (ro)." },
      { sentence: "Er trat ___ den Raum. (inn i)", answer: "in", hint: "Wechsel, bevegelse → Akkusativ", explanation: "'In' + Akkusativ = bevegelse inn i rommet." },
      { sentence: "Das Auto steht ___ dem Haus. (foran – ro)", answer: "vor", hint: "Wechsel, ro → Dativ", explanation: "'Vor' + Dativ = bilen er foran huset (ro)." },
      { sentence: "Das Auto fährt ___ das Haus. (foran – bevegelse)", answer: "vor", hint: "Wechsel, bevegelse → Akkusativ", explanation: "'Vor' + Akkusativ = bilen kjører foran huset (bevegelse)." },
      { sentence: "Die Lampe hängt ___ dem Tisch. (over – ro)", answer: "über", hint: "Wechsel, ro → Dativ", explanation: "'Über' + Dativ = lampen henger over bordet (ro)." },
      { sentence: "Er hänger lampen ___ den Tisch. (over – bevegelse)", answer: "über", hint: "Wechsel, bevegelse → Akkusativ", explanation: "'Über' + Akkusativ = han henger lampen over bordet (bevegelse)." },
      // NEW hard questions
      { sentence: "Er schiebt den Schrank ___ die Wand. (mot – inn mot vertikal flate)", answer: "an", hint: "Wechsel, vertikal flate, bevegelse → Akkusativ", explanation: "'An' + Akkusativ = han skyver skapet inn mot veggen (bevegelse)." },
      { sentence: "Der Schrank steht ___ der Wand. (inntil – ro)", answer: "an", hint: "Wechsel, vertikal flate, ro → Dativ", explanation: "'An' + Dativ = skapet står inntil veggen (ro)." },
      { sentence: "Sie legt sich ___ das Bett. (på – bevegelse, legger seg)", answer: "auf", hint: "Wechsel, horisontal flate, bevegelse → Akkusativ", explanation: "'Auf' + Akkusativ = hun legger seg på sengen (bevegelse)." },
      { sentence: "Sie liegt ___ dem Bett. (på – ro)", answer: "auf", hint: "Wechsel, horisontal flate, ro → Dativ", explanation: "'Auf' + Dativ = hun ligger på sengen (ro)." },
      { sentence: "Das Flugzeug fliegt ___ den Wolken. (over – bevegelse)", answer: "über", hint: "Wechsel, bevegelse → Akkusativ", explanation: "'Über' + Akkusativ = flyet flyr over skyene (bevegelse)." },
      { sentence: "Das Flugzeug fliegt ___ den Wolken. (over – vedvarende posisjon, ro)", answer: "über", hint: "Wechsel, ro → Dativ. NB: 'über den Wolken' (Dat.) når det er en posisjon.", explanation: "'Über' + Dativ = flyet er oppe over skyene (sted/ro). Merk: samme preposisjon, men kasus avslører om det er bevegelse eller ro." },
    ],
  },

  // ── 3. Choose case (Wechsel only) ───────────────────────────
  chooseCase: {
    easy: [
      { sentence: "Ich gehe in die Schule.", prep: "in", answer: "akkusativ", options: ["akkusativ","dativ"], explanation: "'In' + Akkusativ = bevegelse inn i. Die → die (uforandret).", keyword: "Wohin? (bevegelse)" },
      { sentence: "Ich bin in der Schule.", prep: "in", answer: "dativ", options: ["akkusativ","dativ"], explanation: "'In' + Dativ = sted/ro. Der Schule → Dativ (die → der).", keyword: "Wo? (ro/sted)" },
      { sentence: "Das Buch liegt auf dem Tisch.", prep: "auf", answer: "dativ", options: ["akkusativ","dativ"], explanation: "'Auf' + Dativ = sted. Boken ligger på bordet (ro).", keyword: "Wo? (ro/sted)" },
      { sentence: "Ich lege das Buch auf den Tisch.", prep: "auf", answer: "akkusativ", options: ["akkusativ","dativ"], explanation: "'Auf' + Akkusativ = bevegelse. Jeg legger boken på bordet.", keyword: "Wohin? (bevegelse)" },
      { sentence: "Die Katze liegt unter dem Bett.", prep: "unter", answer: "dativ", options: ["akkusativ","dativ"], explanation: "'Unter' + Dativ = katten er under sengen (ro).", keyword: "Wo? (ro/sted)" },
      { sentence: "Die Katze kriecht unter das Bett.", prep: "unter", answer: "akkusativ", options: ["akkusativ","dativ"], explanation: "'Unter' + Akkusativ = katten kryper under sengen (bevegelse).", keyword: "Wohin? (bevegelse)" },
      { sentence: "Er stellt die Vase vor das Fenster.", prep: "vor", answer: "akkusativ", options: ["akkusativ","dativ"], explanation: "'Vor' + Akkusativ = han setter vasen foran vinduet (bevegelse).", keyword: "Wohin? (bevegelse)" },
      { sentence: "Die Vase steht vor dem Fenster.", prep: "vor", answer: "dativ", options: ["akkusativ","dativ"], explanation: "'Vor' + Dativ = vasen er foran vinduet (ro).", keyword: "Wo? (ro/sted)" },
    ],
    medium: [
      { sentence: "Er hängt das Bild an die Wand.", prep: "an", answer: "akkusativ", options: ["akkusativ","dativ"], explanation: "'An' + Akkusativ = han henger bildet opp (bevegelse).", keyword: "Wohin? (bevegelse)" },
      { sentence: "Das Bild hängt an der Wand.", prep: "an", answer: "dativ", options: ["akkusativ","dativ"], explanation: "'An' + Dativ = bildet henger på veggen (ro).", keyword: "Wo? (ro/sted)" },
      { sentence: "Sie geht hinter das Haus.", prep: "hinter", answer: "akkusativ", options: ["akkusativ","dativ"], explanation: "'Hinter' + Akkusativ = hun går bak huset (bevegelse).", keyword: "Wohin? (bevegelse)" },
      { sentence: "Er wartet hinter dem Haus.", prep: "hinter", answer: "dativ", options: ["akkusativ","dativ"], explanation: "'Hinter' + Dativ = han venter bak huset (ro).", keyword: "Wo? (ro/sted)" },
      { sentence: "Ich stelle mich neben dich.", prep: "neben", answer: "akkusativ", options: ["akkusativ","dativ"], explanation: "'Neben' + Akkusativ = jeg plasserer meg ved siden av deg (bevegelse).", keyword: "Wohin? (bevegelse)" },
      { sentence: "Er sitzt neben mir.", prep: "neben", answer: "dativ", options: ["akkusativ","dativ"], explanation: "'Neben' + Dativ = han sitter ved siden av meg (ro).", keyword: "Wo? (ro/sted)" },
      { sentence: "Sie legt das Heft zwischen die Bücher.", prep: "zwischen", answer: "akkusativ", options: ["akkusativ","dativ"], explanation: "'Zwischen' + Akkusativ = hun legger heftet mellom bøkene (bevegelse).", keyword: "Wohin? (bevegelse)" },
      { sentence: "Das Heft liegt zwischen den Büchern.", prep: "zwischen", answer: "dativ", options: ["akkusativ","dativ"], explanation: "'Zwischen' + Dativ = heftet er mellom bøkene (ro).", keyword: "Wo? (ro/sted)" },
    ],
    hard: [
      { sentence: "Er hängt die Lampe über den Tisch.", prep: "über", answer: "akkusativ", options: ["akkusativ","dativ"], explanation: "'Über' + Akkusativ = han henger lampen over bordet (bevegelse).", keyword: "Wohin? (bevegelse)" },
      { sentence: "Die Lampe hängt über dem Tisch.", prep: "über", answer: "dativ", options: ["akkusativ","dativ"], explanation: "'Über' + Dativ = lampen henger over bordet (ro).", keyword: "Wo? (ro/sted)" },
      { sentence: "Vor drei Jahren lebte ich in Wien.", prep: "vor", answer: "dativ", options: ["akkusativ","dativ"], explanation: "'Vor' i tidsuttrykk tar alltid Dativ. 'Vor drei Jahren' = for tre år siden.", keyword: "Tidsuttrykk → alltid Dativ" },
      { sentence: "Er fährt in die Berge.", prep: "in", answer: "akkusativ", options: ["akkusativ","dativ"], explanation: "'In' + Akkusativ = han kjører til fjellene (bevegelse mot).", keyword: "Wohin? (bevegelse)" },
      { sentence: "Sie wohnt in den Bergen.", prep: "in", answer: "dativ", options: ["akkusativ","dativ"], explanation: "'In' + Dativ = hun bor i fjellene (ro).", keyword: "Wo? (ro/sted)" },
      { sentence: "Er geht an den Strand.", prep: "an", answer: "akkusativ", options: ["akkusativ","dativ"], explanation: "'An' + Akkusativ = han går til stranden (bevegelse mot kanten).", keyword: "Wohin? (bevegelse)" },
      { sentence: "Er liegt am Strand.", prep: "an", answer: "dativ", options: ["akkusativ","dativ"], explanation: "'An' + Dativ. 'am' = an + dem. Han ligger ved stranden (ro).", keyword: "Wo? (ro/sted)" },
      { sentence: "Das Mädchen springt über das Seil.", prep: "über", answer: "akkusativ", options: ["akkusativ","dativ"], explanation: "'Über' + Akkusativ = jenten hopper over tauet (bevegelse over).", keyword: "Wohin? (bevegelse)" },
      // NEW hard questions
      { sentence: "Er schiebt den Stuhl unter den Tisch.", prep: "unter", answer: "akkusativ", options: ["akkusativ","dativ"], explanation: "'Unter' + Akkusativ = han skyver stolen under bordet (bevegelse).", keyword: "Wohin? (bevegelse)" },
      { sentence: "Der Stuhl steht unter dem Tisch.", prep: "unter", answer: "dativ", options: ["akkusativ","dativ"], explanation: "'Unter' + Dativ = stolen er under bordet (ro).", keyword: "Wo? (ro/sted)" },
      { sentence: "Sie hängt den Mantel hinter die Tür.", prep: "hinter", answer: "akkusativ", options: ["akkusativ","dativ"], explanation: "'Hinter' + Akkusativ = hun henger jakken bak døren (bevegelse).", keyword: "Wohin? (bevegelse)" },
      { sentence: "Der Mantel hängt hinter der Tür.", prep: "hinter", answer: "dativ", options: ["akkusativ","dativ"], explanation: "'Hinter' + Dativ = jakken henger bak døren (ro).", keyword: "Wo? (ro/sted)" },
      { sentence: "Das Kind klettert auf den Baum.", prep: "auf", answer: "akkusativ", options: ["akkusativ","dativ"], explanation: "'Auf' + Akkusativ = barnet klatrer opp i treet (bevegelse).", keyword: "Wohin? (bevegelse)" },
      { sentence: "Das Kind sitzt auf dem Baum.", prep: "auf", answer: "dativ", options: ["akkusativ","dativ"], explanation: "'Auf' + Dativ = barnet sitter i treet (ro).", keyword: "Wo? (ro/sted)" },
      { sentence: "Er stellt die Flasche neben das Glas.", prep: "neben", answer: "akkusativ", options: ["akkusativ","dativ"], explanation: "'Neben' + Akkusativ = han setter flasken ved siden av glasset (bevegelse).", keyword: "Wohin? (bevegelse)" },
      { sentence: "Die Flasche steht neben dem Glas.", prep: "neben", answer: "dativ", options: ["akkusativ","dativ"], explanation: "'Neben' + Dativ = flasken er ved siden av glasset (ro).", keyword: "Wo? (ro/sted)" },
    ],
  },

  // ── 4. True or false ────────────────────────────────────────
  trueOrFalse: {
    easy: [
      { claim: "'Für' kan brukes for å si 'gjennom parken'.", answer: false, explanation: "'Für' betyr 'for', ikke 'gjennom'. Riktig preposisjon er 'durch'." },
      { claim: "Setningen 'Das ist für dich.' er grammatisk riktig.", answer: true, explanation: "Korrekt. 'Für' tar akkusativ. 'Dich' er akkusativ av 'du'." },
      { claim: "'Aus' tar dativ kasus.", answer: true, explanation: "Korrekt. 'Aus' er en dativ-preposisjon." },
      { claim: "Setningen 'Ich fahre mit den Bus.' er grammatisk riktig.", answer: false, explanation: "'Mit' tar dativ. 'Bus' (maskulin) → dativ = 'dem Bus', ikke 'den Bus'." },
      { claim: "'Nach' brukes til å si 'til' stedsnavn uten artikkel.", answer: true, explanation: "Korrekt. 'Nach Berlin', 'nach Deutschland', 'nach Hause'." },
      { claim: "'Ich lerne für drei Jahren Deutsch.' er riktig for noe som pågår.", answer: false, explanation: "Nei. For noe som startet i fortiden og pågår nå, brukes 'seit', ikke 'für'." },
      { claim: "Setningen 'Das Buch liegt auf dem Tisch.' er grammatisk riktig.", answer: true, explanation: "Korrekt. 'Auf' + Dativ = sted/ro." },
      { claim: "'Gegenüber' tar akkusativ kasus.", answer: false, explanation: "'Gegenüber' tar alltid dativ." },
    ],
    medium: [
      { claim: "Setningen 'Ich hänge das Bild an der Wand.' er riktig for 'jeg henger opp bildet'.", answer: false, explanation: "Feil. Å henge opp (bevegelse) bruker akkusativ: 'an die Wand'. 'An der Wand' = bildet henger allerede der (ro)." },
      { claim: "Die Katze sitzt unter dem Bett.' — 'Unter' tar dativ her.", answer: true, explanation: "Korrekt. Katten sitter (ro) under sengen → Dativ." },
      { claim: "'Vor' i tidsuttrykk som 'vor drei Jahren' tar akkusativ.", answer: false, explanation: "Feil. 'Vor' i tidsuttrykk tar alltid Dativ." },
      { claim: "Setningen 'Ich gehe zu Berlin.' er riktig for å si 'til Berlin'.", answer: false, explanation: "Feil. 'Zu' brukes til personer og spesifikke steder med artikkel. For stedsnavn uten artikkel bruker vi 'nach': 'nach Berlin'." },
      { claim: "Setningen 'Er wohnt bei seiner Großmutter.' er grammatisk riktig.", answer: true, explanation: "Korrekt. 'Bei' tar dativ. 'Seiner Großmutter' er dativ." },
      { claim: "'Zwischen' kan ta både akkusativ og dativ avhengig av kontekst.", answer: true, explanation: "Korrekt. 'Zwischen' er en Wechselpräposition. Bevegelse → Akkusativ, sted/ro → Dativ." },
      { claim: "'In' tar alltid akkusativ.", answer: false, explanation: "Feil. 'In' er en Wechselpräposition. 'In die Schule' (Akk, bevegelse), men 'in der Schule' (Dat, sted)." },
      { claim: "Maskulin bestemt artikkel i akkusativ er 'den'.", answer: true, explanation: "Korrekt. Der (nominativ) → den (akkusativ), kun maskulin forandrer seg i akkusativ." },
    ],
    hard: [
      { claim: "Feminin bestemt artikkel er 'die' i både nominativ og akkusativ.", answer: true, explanation: "Korrekt. Feminin forandrer seg ikke i akkusativ: die → die." },
      { claim: "Maskulin bestemt artikkel i dativ er 'dem'.", answer: true, explanation: "Korrekt. Der (nominativ) → dem (dativ)." },
      { claim: "Feminin bestemt artikkel i dativ er 'die'.", answer: false, explanation: "Feil. Feminin i dativ er 'der', ikke 'die'. Die (nominativ/akkusativ) → der (dativ)." },
      { claim: "Nøytrum bestemt artikkel er 'das' i både nominativ og akkusativ.", answer: true, explanation: "Korrekt. Nøytrum forandrer seg ikke i akkusativ: das → das." },
      { claim: "Setningen 'Ich fahre mit der Bus.' er grammatisk riktig.", answer: false, explanation: "Feil. 'Mit' tar dativ. Maskulin i dativ = 'dem'. Riktig: 'mit dem Bus'." },
      { claim: "Setningen 'Er hängt das Bild an die Wand.' er riktig for å henge opp et bilde.", answer: true, explanation: "Korrekt. 'An' + Akkusativ = bevegelse. 'Die Wand' er feminin, og feminin i akkusativ = die." },
      { claim: "Setningen 'Das Buch liegt auf den Tisch.' er grammatisk riktig.", answer: false, explanation: "Feil. Boken ligger (ro) → Dativ. Maskulin dativ = 'dem'. Riktig: 'auf dem Tisch'." },
      { claim: "'Ab nächstem Montag habe ich Urlaub.' er grammatisk riktig.", answer: true, explanation: "Korrekt. 'Ab' tar dativ. 'Nächstem Montag' er dativ maskulin." },
      // NEW hard questions
      { claim: "Kontraksjonen 'beim' er sammensatt av 'bei' + 'dem'.", answer: true, explanation: "Korrekt. 'Bei' + 'dem' = 'beim'. Eksempel: 'beim Arzt' = hos legen." },
      { claim: "Kontraksjonen 'zum' er sammensatt av 'zu' + 'der'.", answer: false, explanation: "Feil. 'Zum' er 'zu' + 'dem' (maskulin/nøytrum dativ). 'Zur' er 'zu' + 'der' (feminin dativ)." },
      { claim: "Setningen 'Ich gehe zur Schule.' er grammatisk riktig.", answer: true, explanation: "Korrekt. 'Zur' = 'zu' + 'der'. 'Schule' er feminin → dativ feminin = 'der'. 'Zur Schule' er riktig." },
      { claim: "'Ab' kan brukes om fremtidige tidspunkter, for eksempel 'ab nächster Woche'.", answer: true, explanation: "Korrekt. 'Ab' betyr 'fra og med' og brukes om fremtidige tidspunkter. Det tar alltid dativ." },
      { claim: "Setningen 'Er stellt das Buch zwischen den Büchern.' er grammatisk riktig.", answer: false, explanation: "Feil. 'Stellen' (plassere) indikerer bevegelse → 'zwischen' + Akkusativ. Riktig: 'zwischen die Bücher'." },
      { claim: "Setningen 'Das Café liegt gegenüber dem Bahnhof.' er grammatisk riktig.", answer: true, explanation: "Korrekt. 'Gegenüber' tar dativ. 'Dem Bahnhof' er dativ maskulin." },
      { claim: "Nøytrum bestemt artikkel i dativ er 'dem'.", answer: true, explanation: "Korrekt. Nøytrum i dativ = 'dem'. Eksempel: 'in dem Zimmer' (forkortet: 'im Zimmer')." },
      { claim: "Setningen 'Die Katze springt auf das Bett.' er grammatisk feil.", answer: false, explanation: "Setningen er faktisk riktig. 'Auf' + Akkusativ = bevegelse (katten hopper opp på sengen). Det er ikke en feil." },
      { claim: "Kontraksjonen 'im' er sammensatt av 'in' + 'dem'.", answer: true, explanation: "Korrekt. 'Im' = 'in' + 'dem'. Brukes ved ro/sted (Dativ). Eksempel: 'im Zimmer' = i rommet." },
      { claim: "'Außer' kan ta akkusativ i noen tilfeller.", answer: false, explanation: "Feil. 'Außer' tar alltid dativ, uten unntak." },
    ],
  },

  // ── 5. Write in ─────────────────────────────────────────────
  writeIn: {
    easy: [
      { sentence: "Das ist ___ mich. (for)", answer: "für", hint: "F..." },
      { sentence: "Er kommt ___ der Schweiz. (fra)", answer: "aus", hint: "A..." },
      { sentence: "Ich gehe ___ die Schule. (inn i / til)", answer: "in", hint: "I..." },
      { sentence: "Ich fahre ___ Berlin. (til)", answer: "nach", hint: "N..." },
      { sentence: "Wir gehen ___ den See. (rundt)", answer: "um", hint: "U..." },
      { sentence: "Er geht ___ den Park. (gjennom)", answer: "durch", hint: "D..." },
      { sentence: "Ich wohne ___ meinen Eltern. (hos)", answer: "bei", hint: "B..." },
      { sentence: "Das Buch liegt ___ dem Tisch. (på)", answer: "auf", hint: "A..." },
    ],
    medium: [
      { sentence: "___ drei Jahren wohnte ich in Hamburg. (for ... siden)", answer: "Vor", hint: "V..." },
      { sentence: "Das Bild hängt ___ der Wand. (på – ro)", answer: "an", hint: "A..." },
      { sentence: "Ich stelle die Tasche ___ den Tisch. (under – bevegelse)", answer: "unter", hint: "U..." },
      { sentence: "Die Tasche liegt ___ dem Tisch. (under – ro)", answer: "unter", hint: "U..." },
      { sentence: "Er kommt ___ dem Bahnhof. (fra)", answer: "von", hint: "V..." },
      { sentence: "Sie setzt sich ___ mich. (ved siden av)", answer: "neben", hint: "N..." },
      { sentence: "Er geht ___ das Tor. (gjennom)", answer: "durch", hint: "D..." },
      { sentence: "Ich fahre ___ dem Fahrrad. (med)", answer: "mit", hint: "M..." },
      // NEW medium questions
      { sentence: "Das Kind springt ___ das Sofa. (på – bevegelse)", answer: "auf", hint: "A..." },
      { sentence: "Er schiebt den Schrank ___ die Wand. (inn mot – bevegelse)", answer: "an", hint: "A..." },
      { sentence: "Wir fahren ___ dem Zug. (med)", answer: "mit", hint: "M..." },
      { sentence: "Sie steht ___ dem Eingang. (overfor)", answer: "gegenüber", hint: "G..." },
    ],
    hard: [
      { sentence: "Sie stand ___ dem Fenster. (ved – ro)", answer: "an",hint: "A..." },
      { sentence: "Er trat ___ den Raum. (inn i)", answer: "in", hint: "I..." },
      { sentence: "Das Auto steht ___ dem Haus. (foran – ro)", answer: "vor", hint: "V..." },
      { sentence: "Die Lampe hängt ___ dem Tisch. (over – ro)", answer: "über", hint: "Ü..." },
      { sentence: "Er hängt die Lampe ___ den Tisch. (over – bevegelse)", answer: "über", hint: "Ü..." },
      // NEW hard questions
      { sentence: "Er legt das Buch ___ die Bücher. (mellom – bevegelse)", answer: "zwischen", hint: "Z..." },
      { sentence: "Das Heft liegt ___ den Büchern. (mellom – ro)", answer: "zwischen", hint: "Z..." },
      { sentence: "Sie hängt den Mantel ___ die Tür. (bak – bevegelse)", answer: "hinter", hint: "H..." },
      { sentence: "Der Mantel hängt ___ der Tür. (bak – ro)", answer: "hinter", hint: "H..." },
      { sentence: "Der Hund läuft ___ das Sofa. (under – bevegelse)", answer: "unter", hint: "U..." },
      { sentence: "Er stellt den Stuhl ___ das Regal. (ved siden av – bevegelse)", answer: "neben", hint: "N..." },
      { sentence: "Das Flugzeug fliegt ___ die Stadt. (over – bevegelse)", answer: "über", hint: "Ü..." },
      { sentence: "___ diesem Sommer fahre ich nach Norwegen. (fra og med)", answer: "Ab", hint: "A..." },
    ],
  },

  // ── 6. Match ────────────────────────────────────────────────
  matchPairs: {
    easy: [
      { pairs: [
        { prep: "durch", meaning: "gjennom" },
        { prep: "für",   meaning: "for" },
        { prep: "ohne",  meaning: "uten" },
        { prep: "gegen", meaning: "mot" },
        { prep: "um",    meaning: "rundt / klokken" },
        { prep: "mit",   meaning: "med" },
      ]},
      // NEW easy pair set
      { pairs: [
        { prep: "aus",   meaning: "fra (opprinnelse)" },
        { prep: "bei",   meaning: "hos / ved" },
        { prep: "nach",  meaning: "til (stedsnavn u/art.)" },
        { prep: "zu",    meaning: "til (person/sted m/art.)" },
        { prep: "von",   meaning: "fra / av" },
        { prep: "seit",  meaning: "siden (noe som pågår)" },
      ]},
    ],
    medium: [
      { pairs: [
        { prep: "aus",   meaning: "fra (opprinnelse)" },
        { prep: "bei",   meaning: "hos / ved" },
        { prep: "nach",  meaning: "til (stedsnavn u/art.)" },
        { prep: "seit",  meaning: "siden (noe som pågår)" },
        { prep: "von",   meaning: "fra / av" },
        { prep: "zu",    meaning: "til (person/sted m/art.)" },
        { prep: "außer", meaning: "unntatt / foruten" },
        { prep: "ab",    meaning: "fra (fremtidig tidspkt.)" },
      ]},
      // NEW medium pair set — contractions
      { pairs: [
        { prep: "beim",  meaning: "bei + dem (hos den/det)" },
        { prep: "zum",   meaning: "zu + dem (til den/det)" },
        { prep: "zur",   meaning: "zu + der (til den – fem.)" },
        { prep: "vom",   meaning: "von + dem (fra den/det)" },
        { prep: "im",    meaning: "in + dem (i den/det)" },
        { prep: "am",    meaning: "an + dem (ved den/det)" },
        { prep: "ans",   meaning: "an + das (til det – nøyt.)" },
        { prep: "ins",   meaning: "in + das (inn i det – nøyt.)" },
      ]},
    ],
    hard: [
      { pairs: [
        { prep: "an",      meaning: "ved / på (vertikal)" },
        { prep: "auf",     meaning: "på (horisontal)" },
        { prep: "hinter",  meaning: "bak" },
        { prep: "in",      meaning: "i / inn i" },
        { prep: "über",    meaning: "over" },
        { prep: "unter",   meaning: "under" },
        { prep: "vor",     meaning: "foran" },
        { prep: "zwischen",meaning: "mellom" },
      ]},
      // NEW hard pair set — Wechsel with case cue
      { pairs: [
        { prep: "an die Wand",    meaning: "Wohin? → Akkusativ (bevegelse)" },
        { prep: "an der Wand",    meaning: "Wo? → Dativ (ro)" },
        { prep: "auf den Tisch",  meaning: "Wohin? → Akkusativ (bevegelse)" },
        { prep: "auf dem Tisch",  meaning: "Wo? → Dativ (ro)" },
        { prep: "in die Schule",  meaning: "Wohin? → Akkusativ (bevegelse)" },
        { prep: "in der Schule",  meaning: "Wo? → Dativ (ro)" },
        { prep: "unter das Bett", meaning: "Wohin? → Akkusativ (bevegelse)" },
        { prep: "unter dem Bett", meaning: "Wo? → Dativ (ro)" },
      ]},
    ],
  },

  // ── 7. Article choice ────────────────────────────────────────
  //  Lett   = akkusativ-preposisjoner (kasus alltid klart)
  //  Middels = dativ-preposisjoner (kasus alltid klart)
  //  Vanskelig = Wechsel (must determine Wo?/Wohin? first)
  articleChoice: {
    easy: [
      { sentence: "Ich kaufe ein Geschenk für ___ Vater.", note: "der Vater – maskulin", prep: "für", answer: "den", options: ["den","dem","der","das"], explanation: "'Für' tar alltid akkusativ. Maskulin i akkusativ = den." },
      { sentence: "Wir fahren durch ___ Tunnel.", note: "der Tunnel – maskulin", prep: "durch", answer: "den", options: ["den","dem","der","das"], explanation: "'Durch' tar alltid akkusativ. Maskulin i akkusativ = den." },
      { sentence: "Er ist gegen ___ Plan.", note: "der Plan – maskulin", prep: "gegen", answer: "den", options: ["den","dem","der","das"], explanation: "'Gegen' tar alltid akkusativ. Maskulin i akkusativ = den." },
      { sentence: "Das Geschenk ist für ___ Mutter.", note: "die Mutter – feminin", prep: "für", answer: "die", options: ["die","der","dem","den"], explanation: "'Für' tar akkusativ. Feminin i akkusativ = die (uforandret)." },
      { sentence: "Er geht ohne ___ Schwester.", note: "die Schwester – feminin", prep: "ohne", answer: "die", options: ["die","der","dem","den"], explanation: "'Ohne' tar akkusativ. Feminin i akkusativ = die (uforandret)." },
      { sentence: "Das ist für ___ Kind.", note: "das Kind – nøytrum", prep: "für", answer: "das", options: ["das","den","dem","der"], explanation: "'Für' tar akkusativ. Nøytrum i akkusativ = das (uforandret)." },
      { sentence: "Wir laufen um ___ See.", note: "der See – maskulin", prep: "um", answer: "den", options: ["den","dem","der","das"], explanation: "'Um' tar akkusativ. Maskulin i akkusativ = den." },
      { sentence: "Er fährt durch ___ Stadt.", note: "die Stadt – feminin", prep: "durch", answer: "die", options: ["die","der","dem","den"], explanation: "'Durch' tar akkusativ. Feminin i akkusativ = die (uforandret)." },
      { sentence: "Wir laufen um ___ Haus.", note: "das Haus – nøytrum", prep: "um", answer: "das", options: ["das","den","dem","der"], explanation: "'Um' tar akkusativ. Nøytrum i akkusativ = das (uforandret)." },
      { sentence: "Das Paket ist für ___ Lehrerin.", note: "die Lehrerin – feminin", prep: "für", answer: "die", options: ["die","der","dem","den"], explanation: "'Für' tar akkusativ. Feminin i akkusativ = die (uforandret)." },
      { sentence: "Er kämpft gegen ___ Wind.", note: "der Wind – maskulin", prep: "gegen", answer: "den", options: ["den","dem","der","das"], explanation: "'Gegen' tar akkusativ. Maskulin i akkusativ = den." },
      { sentence: "Wir gehen durch ___ Tor.", note: "das Tor – nøytrum", prep: "durch", answer: "das", options: ["das","den","dem","der"], explanation: "'Durch' tar akkusativ. Nøytrum i akkusativ = das (uforandret)." },
    ],
    medium: [
      { sentence: "Ich fahre mit ___ Zug.", note: "der Zug – maskulin", prep: "mit", answer: "dem", options: ["dem","den","der","die"], explanation: "'Mit' tar dativ. Maskulin i dativ = dem." },
      { sentence: "Er kommt aus ___ Stadt.", note: "die Stadt – feminin", prep: "aus", answer: "der", options: ["der","die","dem","den"], explanation: "'Aus' tar dativ. Feminin i dativ = der." },
      { sentence: "Sie wohnt bei ___ Oma.", note: "die Oma – feminin", prep: "bei", answer: "der", options: ["der","die","dem","den"], explanation: "'Bei' tar dativ. Feminin i dativ = der." },
      { sentence: "Wir gehen zu ___ Supermarkt.", note: "der Supermarkt – maskulin", prep: "zu", answer: "dem", options: ["dem","den","der","die"], explanation: "'Zu' tar dativ. Maskulin i dativ = dem." },
      { sentence: "Ich komme aus ___ Museum.", note: "das Museum – nøytrum", prep: "aus", answer: "dem", options: ["dem","das","der","den"], explanation: "'Aus' tar dativ. Nøytrum i dativ = dem." },
      { sentence: "Er sitzt gegenüber ___ Fenster.", note: "das Fenster – nøytrum", prep: "gegenüber", answer: "dem", options: ["dem","das","der","den"], explanation: "'Gegenüber' tar dativ. Nøytrum i dativ = dem." },
      { sentence: "Ich gehe zu ___ Arzt.", note: "der Arzt – maskulin", prep: "zu", answer: "dem", options: ["dem","den","der","die"], explanation: "'Zu' tar dativ. Maskulin i dativ = dem." },
      { sentence: "Ich fahre mit ___ U-Bahn.", note: "die U-Bahn – feminin", prep: "mit", answer: "der", options: ["der","die","dem","den"], explanation: "'Mit' tar dativ. Feminin i dativ = der." },
      { sentence: "Er ist seit ___ Unfall krank.", note: "der Unfall – maskulin", prep: "seit", answer: "dem", options: ["dem","den","der","die"], explanation: "'Seit' tar dativ. Maskulin i dativ = dem." },
      { sentence: "Ich gehe zu ___ Bibliothek.", note: "die Bibliothek – feminin", prep: "zu", answer: "der", options: ["der","die","dem","den"], explanation: "'Zu' tar dativ. Feminin i dativ = der." },
      { sentence: "Das Heft ist von ___ Mädchen.", note: "das Mädchen – nøytrum", prep: "von", answer: "dem", options: ["dem","das","der","den"], explanation: "'Von' tar dativ. Nøytrum i dativ = dem." },
      { sentence: "Er kommt von ___ Schule.", note: "die Schule – feminin", prep: "von", answer: "der", options: ["der","die","dem","den"], explanation: "'Von' tar dativ. Feminin i dativ = der." },
    ],
    hard: [
      { sentence: "Das Buch liegt auf ___ Tisch.", note: "der Tisch – maskulin, Wo?", prep: "auf", answer: "dem", options: ["dem","den","der","die"], explanation: "'Auf' + Dativ (Wo? = ro). Maskulin i dativ = dem.", caseTip: "Boken ligger → ro → Dativ" },
      { sentence: "Er legt das Buch auf ___ Tisch.", note: "der Tisch – maskulin, Wohin?", prep: "auf", answer: "den", options: ["den","dem","der","die"], explanation: "'Auf' + Akkusativ (Wohin? = bevegelse). Maskulin i akkusativ = den.", caseTip: "Han legger → bevegelse → Akkusativ" },
      { sentence: "Die Lampe hängt über ___ Tisch.", note: "der Tisch – maskulin, Wo?", prep: "über", answer: "dem", options: ["dem","den","der","die"], explanation: "'Über' + Dativ (Wo? = ro). Maskulin i dativ = dem.", caseTip: "Lampen henger (ro) → Dativ" },
      { sentence: "Er hängt die Lampe über ___ Tisch.", note: "der Tisch – maskulin, Wohin?", prep: "über", answer: "den", options: ["den","dem","der","die"], explanation: "'Über' + Akkusativ (Wohin? = bevegelse). Maskulin i akkusativ = den.", caseTip: "Han henger opp → bevegelse → Akkusativ" },
      { sentence: "Die Katze sitzt unter ___ Bett.", note: "das Bett – nøytrum, Wo?", prep: "unter", answer: "dem", options: ["dem","das","der","den"], explanation: "'Unter' + Dativ (Wo? = ro). Nøytrum i dativ = dem.", caseTip: "Katten sitter (ro) → Dativ" },
      { sentence: "Die Katze kriecht unter ___ Bett.", note: "das Bett – nøytrum, Wohin?", prep: "unter", answer: "das", options: ["das","dem","der","den"], explanation: "'Unter' + Akkusativ (Wohin? = bevegelse). Nøytrum i akkusativ = das.", caseTip: "Katten kryper → bevegelse → Akkusativ" },
      { sentence: "Das Bild hängt an ___ Wand.", note: "die Wand – feminin, Wo?", prep: "an", answer: "der", options: ["der","die","dem","den"], explanation: "'An' + Dativ (Wo? = ro). Feminin i dativ = der.", caseTip: "Bildet henger (ro) → Dativ" },
      { sentence: "Er hängt das Bild an ___ Wand.", note: "die Wand – feminin, Wohin?", prep: "an", answer: "die", options: ["die","der","dem","den"], explanation: "'An' + Akkusativ (Wohin? = bevegelse). Feminin i akkusativ = die.", caseTip: "Han henger opp → bevegelse → Akkusativ" },
      { sentence: "Er steht vor ___ Tür.", note: "die Tür – feminin, Wo?", prep: "vor", answer: "der", options: ["der","die","dem","den"], explanation: "'Vor' + Dativ (Wo? = ro). Feminin i dativ = der.", caseTip: "Han står (ro) → Dativ" },
      { sentence: "Er geht vor ___ Tür.", note: "die Tür – feminin, Wohin?", prep: "vor", answer: "die", options: ["die","der","dem","den"], explanation: "'Vor' + Akkusativ (Wohin? = bevegelse). Feminin i akkusativ = die.", caseTip: "Han går → bevegelse → Akkusativ" },
      { sentence: "Er sitzt in ___ Schule.", note: "die Schule – feminin, Wo?", prep: "in", answer: "der", options: ["der","die","dem","den"], explanation: "'In' + Dativ (Wo? = ro). Feminin i dativ = der.", caseTip: "Han sitter (ro) → Dativ" },
      { sentence: "Er geht in ___ Schule.", note: "die Schule – feminin, Wohin?", prep: "in", answer: "die", options: ["die","der","dem","den"], explanation: "'In' + Akkusativ (Wohin? = bevegelse). Feminin i akkusativ = die.", caseTip: "Han går (inn i) → bevegelse → Akkusativ" },
      // NEW hard questions
      { sentence: "Er legt das Heft zwischen ___ Bücher.", note: "die Bücher – flertall, Wohin?", prep: "zwischen", answer: "die", options: ["die","den","der","das"], explanation: "'Zwischen' + Akkusativ (Wohin? = bevegelse). Flertall i akkusativ = die.", caseTip: "Han legger → bevegelse → Akkusativ" },
      { sentence: "Das Heft liegt zwischen ___ Büchern.", note: "die Bücher – flertall, Wo?", prep: "zwischen", answer: "den", options: ["den","die","der","das"], explanation: "'Zwischen' + Dativ (Wo? = ro). Flertall i dativ = den.", caseTip: "Heftet ligger (ro) → Dativ. Flertall dativ = den." },
      { sentence: "Er stellt den Stuhl hinter ___ Tisch.", note: "der Tisch – maskulin, Wohin?", prep: "hinter", answer: "den", options: ["den","dem","der","die"], explanation: "'Hinter' + Akkusativ (Wohin? = bevegelse). Maskulin i akkusativ = den.", caseTip: "Han stiller → bevegelse → Akkusativ" },
      { sentence: "Der Stuhl steht hinter ___ Tisch.", note: "der Tisch – maskulin, Wo?", prep: "hinter", answer: "dem", options: ["dem","den","der","die"], explanation: "'Hinter' + Dativ (Wo? = ro). Maskulin i dativ = dem.", caseTip: "Stolen er (ro) → Dativ" },
      { sentence: "Das Kind klettert auf ___ Baum.", note: "der Baum – maskulin, Wohin?", prep: "auf", answer: "den", options: ["den","dem","der","die"], explanation: "'Auf' + Akkusativ (Wohin? = bevegelse). Maskulin i akkusativ = den.", caseTip: "Barnet klatrer → bevegelse → Akkusativ" },
      { sentence: "Das Kind sitzt auf ___ Baum.", note: "der Baum – maskulin, Wo?", prep: "auf", answer: "dem", options: ["dem","den","der","die"], explanation: "'Auf' + Dativ (Wo? = ro). Maskulin i dativ = dem.", caseTip: "Barnet sitter (ro) → Dativ" },
      { sentence: "Er schiebt den Schrank neben ___ Tür.", note: "die Tür – feminin, Wohin?", prep: "neben", answer: "die", options: ["die","der","dem","den"], explanation: "'Neben' + Akkusativ (Wohin? = bevegelse). Feminin i akkusativ = die.", caseTip: "Han skyver → bevegelse → Akkusativ" },
      { sentence: "Der Schrank steht neben ___ Tür.", note: "die Tür – feminin, Wo?", prep: "neben", answer: "der", options: ["der","die","dem","den"], explanation: "'Neben' + Dativ (Wo? = ro). Feminin i dativ = der.", caseTip: "Skapet er (ro) → Dativ" },
      { sentence: "Er fährt in ___ Berge.", note: "die Berge – flertall, Wohin?", prep: "in", answer: "die", options: ["die","den","der","das"], explanation: "'In' + Akkusativ (Wohin? = bevegelse). Flertall i akkusativ = die.", caseTip: "Han kjører → bevegelse → Akkusativ" },
      { sentence: "Er wohnt in ___ Bergen.", note: "die Berge – flertall, Wo?", prep: "in", answer: "den", options: ["den","die","der","das"], explanation: "'In' + Dativ (Wo? = ro). Flertall i dativ = den.", caseTip: "Han bor (ro) → Dativ. Flertall dativ = den." },
    ],
  },

  // ── 8. Article write ─────────────────────────────────────────
  articleWrite: {
    easy: [
      { sentence: "Das ist für ___ Vater. (der Vater – maskulin)", answer: "den", hint: "Akkusativ, maskulin", explanation: "'Für' tar akkusativ. Maskulin i akkusativ = den." },
      { sentence: "Wir fahren durch ___ Tunnel. (der Tunnel – maskulin)", answer: "den", hint: "Akkusativ, maskulin", explanation: "'Durch' tar akkusativ. Maskulin i akkusativ = den." },
      { sentence: "Das ist für ___ Mutter. (die Mutter – feminin)", answer: "die", hint: "Akkusativ, feminin", explanation: "'Für' tar akkusativ. Feminin i akkusativ = die." },
      { sentence: "Er geht ohne ___ Bruder. (der Bruder – maskulin)", answer: "den", hint: "Akkusativ, maskulin", explanation: "'Ohne' tar akkusativ. Maskulin i akkusativ = den." },
      { sentence: "Das ist für ___ Kind. (das Kind – nøytrum)", answer: "das", hint: "Akkusativ, nøytrum", explanation: "'Für' tar akkusativ. Nøytrum i akkusativ = das." },
      { sentence: "Er läuft durch ___ Wald. (der Wald – maskulin)", answer: "den", hint: "Akkusativ, maskulin", explanation: "'Durch' tar akkusativ. Maskulin i akkusativ = den." },
      { sentence: "Sie kämpft gegen ___ Wind. (der Wind – maskulin)", answer: "den", hint: "Akkusativ, maskulin", explanation: "'Gegen' tar akkusativ. Maskulin i akkusativ = den." },
      { sentence: "Das ist für ___ Lehrerin. (die Lehrerin – feminin)", answer: "die", hint: "Akkusativ, feminin", explanation: "'Für' tar akkusativ. Feminin i akkusativ = die." },
    ],
    medium: [
      { sentence: "Ich fahre mit ___ Zug. (der Zug – maskulin)", answer: "dem", hint: "Dativ, maskulin", explanation: "'Mit' tar dativ. Maskulin i dativ = dem." },
      { sentence: "Sie wohnt bei ___ Oma. (die Oma – feminin)", answer: "der", hint: "Dativ, feminin", explanation: "'Bei' tar dativ. Feminin i dativ = der." },
      { sentence: "Wir gehen zu ___ Supermarkt. (der Supermarkt – maskulin)", answer: "dem", hint: "Dativ, maskulin", explanation: "'Zu' tar dativ. Maskulin i dativ = dem." },
      { sentence: "Er kommt aus ___ Museum. (das Museum – nøytrum)", answer: "dem", hint: "Dativ, nøytrum", explanation: "'Aus' tar dativ. Nøytrum i dativ = dem." },
      { sentence: "Ich fahre mit ___ U-Bahn. (die U-Bahn – feminin)", answer: "der", hint: "Dativ, feminin", explanation: "'Mit' tar dativ. Feminin i dativ = der." },
      { sentence: "Er ist seit ___ Unfall krank. (der Unfall – maskulin)", answer: "dem", hint: "Dativ, maskulin", explanation: "'Seit' tar dativ. Maskulin i dativ = dem." },
      { sentence: "Ich gehe zu ___ Bibliothek. (die Bibliothek – feminin)", answer: "der", hint: "Dativ, feminin", explanation: "'Zu' tar dativ. Feminin i dativ = der." },
      { sentence: "Das Heft ist von ___ Mädchen. (das Mädchen – nøytrum)", answer: "dem", hint: "Dativ, nøytrum", explanation: "'Von' tar dativ. Nøytrum i dativ = dem." },
    ],
    hard: [
      { sentence: "Das Buch liegt auf ___ Tisch. (der Tisch – maskulin, Wo?)", answer: "dem", hint: "Wo? → Dativ, maskulin", explanation: "Ro → Dativ. Maskulin i dativ = dem." },
      { sentence: "Er legt das Buch auf ___ Tisch. (der Tisch – maskulin, Wohin?)", answer: "den", hint: "Wohin? → Akkusativ, maskulin", explanation: "Bevegelse → Akkusativ. Maskulin i akkusativ = den." },
      { sentence: "Die Katze sitzt unter ___ Bett. (das Bett – nøytrum, Wo?)", answer: "dem", hint: "Wo? → Dativ, nøytrum", explanation: "Ro → Dativ. Nøytrum i dativ = dem." },
      { sentence: "Die Katze kriecht unter ___ Bett. (das Bett – nøytrum, Wohin?)", answer: "das", hint: "Wohin? → Akkusativ, nøytrum", explanation: "Bevegelse → Akkusativ. Nøytrum i akkusativ = das." },
      { sentence: "Das Bild hängt an ___ Wand. (die Wand – feminin, Wo?)", answer: "der", hint: "Wo? → Dativ, feminin", explanation: "Ro → Dativ. Feminin i dativ = der." },
      { sentence: "Er hängt das Bild an ___ Wand. (die Wand – feminin, Wohin?)", answer: "die", hint: "Wohin? → Akkusativ, feminin", explanation: "Bevegelse → Akkusativ. Feminin i akkusativ = die." },
      { sentence: "Er sitzt in ___ Schule. (die Schule – feminin, Wo?)", answer: "der", hint: "Wo? → Dativ, feminin", explanation: "Ro → Dativ. Feminin i dativ = der." },
      { sentence: "Er geht in ___ Schule. (die Schule – feminin, Wohin?)", answer: "die", hint: "Wohin? → Akkusativ, feminin", explanation: "Bevegelse → Akkusativ. Feminin i akkusativ = die." },
      // NEW hard questions
      { sentence: "Er stellt den Stuhl hinter ___ Tisch. (der Tisch – maskulin, Wohin?)", answer: "den", hint: "Wohin? → Akkusativ, maskulin", explanation: "Bevegelse → Akkusativ. Maskulin i akkusativ = den." },
      { sentence: "Der Stuhl steht hinter ___ Tisch. (der Tisch – maskulin, Wo?)", answer: "dem", hint: "Wo? → Dativ, maskulin", explanation: "Ro → Dativ. Maskulin i dativ = dem." },
      { sentence: "Das Kind klettert auf ___ Baum. (der Baum – maskulin, Wohin?)", answer: "den", hint: "Wohin? → Akkusativ, maskulin", explanation: "Bevegelse → Akkusativ. Maskulin i akkusativ = den." },
      { sentence: "Das Kind sitzt auf ___ Baum. (der Baum – maskulin, Wo?)", answer: "dem", hint: "Wo? → Dativ, maskulin", explanation: "Ro → Dativ. Maskulin i dativ = dem." },
      { sentence: "Er legt das Heft zwischen ___ Bücher. (die Bücher – flertall, Wohin?)", answer: "die", hint: "Wohin? → Akkusativ, flertall", explanation: "Bevegelse → Akkusativ. Flertall i akkusativ = die." },
      { sentence: "Das Heft liegt zwischen ___ Büchern. (die Bücher – flertall, Wo?)", answer: "den", hint: "Wo? → Dativ, flertall", explanation: "Ro → Dativ. Flertall i dativ = den." },
      { sentence: "Die Lampe hängt über ___ Esstisch. (der Esstisch – maskulin, Wo?)", answer: "dem", hint: "Wo? → Dativ, maskulin", explanation: "Ro → Dativ. Maskulin i dativ = dem." },
      { sentence: "Er hängt die Lampe über ___ Esstisch. (der Esstisch – maskulin, Wohin?)", answer: "den", hint: "Wohin? → Akkusativ, maskulin", explanation: "Bevegelse → Akkusativ. Maskulin i akkusativ = den." },
    ],
  },
};

// ── Test pool ─────────────────────────────────────────────────

function getTestPool(count = 15, difficulty = "alle") {
  const diffs = difficulty === "alle" ? ["easy","medium","hard"]
    : difficulty === "easy"   ? ["easy"]
    : difficulty === "medium" ? ["easy","medium"]
    : ["easy","medium","hard"];

  const add = (arr, type, d) => arr.map(q => ({...q, type, difficulty: d}));
  const sources = [];
  for (const d of diffs) {
    if (EXERCISES.multipleChoice[d]) sources.push(...add(EXERCISES.multipleChoice[d], "mc", d));
    if (EXERCISES.chooseCase[d])     sources.push(...add(EXERCISES.chooseCase[d],     "case", d));
    if (EXERCISES.trueOrFalse[d])    sources.push(...add(EXERCISES.trueOrFalse[d],    "tf", d));
    if (EXERCISES.fillInBlank[d])    sources.push(...add(EXERCISES.fillInBlank[d],    "fill", d));
    if (EXERCISES.articleChoice[d])  sources.push(...add(EXERCISES.articleChoice[d],  "articlemc", d));
  }
  return sources.sort(() => Math.random() - 0.5).slice(0, Math.min(count, sources.length));
}
