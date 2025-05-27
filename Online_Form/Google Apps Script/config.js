/**
 * Konfigurační objekt pro univerzální zpracování dotazníku.
 * - Nastavuje názvy listů, kategorie, screening, kritéria DSM-5, indexy a páry pro konzistenci.
 * - Všechny číselné hodnoty otázek odpovídají číslování v dotazníku.
 */
var config = {
  // Listy v Google Sheets
  dataSheet: "Points",         // List s bodovým ohodnocením odpovědí (výstup z countPoints)
  respondentSheet: "Odpovědi", // List s původními odpověďmi a datem narození
  resultSheet: "Results",    // List pro finální výsledky

  // Kategorie a jejich otázky
  categories: {
    IN:  [].concat([12, 23, 28, 44, 47, 49], [67, 77, 88, 95]),
    HY:  [].concat([19, 43, 45, 50, 52, 54, 55, 61], [69, 71, 93, 98, 99, 104]),
    LP:  [].concat([5, 7, 9, 15, 36, 51, 53, 60], [87]),
    EF:  [].concat([34, 37, 63], [72, 75, 79, 84, 90, 97]),
    AG:  [].concat([16, 22, 27, 30, 39, 46, 48, 57, 58], [65, 83, 86, 94, 102]),
    PR:  [].concat([10, 13, 24, 62], [64, 92]),
    GI:  [].concat([19, 25, 29, 34, 40, 50], [67, 81, 85, 99]),
    AN:  [].concat([2, 28, 35, 47], [68, 79, 84, 95, 97, 101]),
    AH:  [].concat([3, 43, 45, 54, 61], [69, 71, 93, 98, 99, 104]),
    CD:  [].concat([6, 11, 16, 27, 30, 39, 41, 56, 58], [65, 76, 78, 89, 91, 96]),
    OD:  [].concat([14, 21, 48, 57, 59], [73, 94, 102]),
    PI:  [].concat([31, 33, 38], [74, 80, 105]),
    NI:  [].concat([1, 8, 18, 26, 32, 42], [])
  },

  // Screeningové otázky
  screeningQuestions: [
    // Úzkost
    4, 20, 70, 100,
    // Deprese
    17, 66, 82, 103,
    // Kritické položky
    11, 27, 41, 78, 89, 96
  ],

  // Kritéria DSM-5 (každé kritérium má otázku a podmínku splnění)
  criteria: {
    // ADHD s převahou nepozornosti
    A1a: { q: 47, cond: function(val) { return val >= 2; } },
    A1b: { q: 95, cond: function(val) { return val >= 2; } },
    A1c: { q: 35, cond: function(val) { return val >= 2; } },
    A1d: { q: [68, 79], cond: function(val1, val2) { return val1 > 1 && val2 > 1; } },
    A1e: { q: 84, cond: function(val) { return val >= 2; } },
    A1f: { q: 28, cond: function(val) { return val === 3; } },
    A1g: { q: 97, cond: function(val) { return val >= 2; } },
    A1h: { q: 101, cond: function(val) { return val >= 2; } },
    A1i: { q: 2, cond: function(val) { return val >= 2; } },
    // ADHD s převahou hyperaktivity a impulzivity
    A2a: { q: 98, cond: function(val) { return val >= 2; } },
    A2b: { q: 93, cond: function(val) { return val >= 2; } },
    A2c: { q: [69, 99], cond: function(val1, val2) { return (val1 + val2) > 1; } },
    A2d: { q: 71, cond: function(val) { return val >= 2; } },
    A2e: { q: [54, 45], cond: function(val1, val2) { return (val1 + val2) > 1; } },
    A2f: { q: 3, cond: function(val) { return val >= 2; } },
    A2g: { q: 43, cond: function(val) { return val >= 2; } },
    A2h: { q: 61, cond: function(val) { return val >= 2; } },
    A2i: { q: 104, cond: function(val) { return val >= 2; } },
    // Porucha chování
    A3a: { q: 16, cond: function(val) { return val >= 2; } },
    A3b: { q: 30, cond: function(val) { return val >= 2; } },
    A3c: { q: 27, cond: function(val) { return val >= 1; } },
    A3d: { q: 39, cond: function(val) { return val >= 1; } },
    A3e: { q: 41, cond: function(val) { return val >= 1; } },
    A3f: { q: 96, cond: function(val) { return val >= 1; } },
    A3g: { q: 11, cond: function(val) { return val >= 1; } },
    A3h: { q: 78, cond: function(val) { return val >= 1; } },
    A3i: { q: 65, cond: function(val) { return val >= 1; } },
    A3j: { q: 89, cond: function(val) { return val >= 1; } },
    A3k: { q: 56, cond: function(val) { return val >= 2; } },
    A3l: { q: 58, cond: function(val) { return val >= 1; } },
    A3m: { q: 91, cond: function(val) { return val >= 2; } },
    A3n: { q: 76, cond: function(val) { return val >= 1; } },
    A3o: { q: 6,  cond: function(val) { return val >= 2; } },
    // Porucha opozičního vzdoru
    A4a: { q: 14,  cond: function(val) { return val >= 2; } },
    A4b: { q: 73,  cond: function(val) { return val >= 2; } },
    A4c: { q: 48,  cond: function(val) { return val >= 2; } },
    A4d: { q: 102, cond: function(val) { return val >= 2; } },
    A4e: { q: 94,  cond: function(val) { return val >= 2; } },
    A4f: { q: 59,  cond: function(val) { return val >= 2; } },
    A4g: { q: 21,  cond: function(val) { return val >= 2; } },
    A4h: { q: 57,  cond: function(val) { return val >= 2; } }
  },

  // Přemapování pro ADHD Index (každá otázka má vlastní funkci)
  remapRules: {
    19:  function(val) { if (val === 2) return 1; if (val === 3) return 2; return 0; },
    35:  function(val) { if (val === 2 || val === 3) return 2; return 0; },
    47:  function(val) { if (val === 2) return 1; if (val === 3) return 2; return 0; },
    67:  function(val) { if (val === 2) return 1; if (val === 3) return 2; return 0; },
    84:  function(val) { if (val === 2) return 1; if (val === 3) return 2; return 0; },
    88:  function(val) { if (val === 2 || val === 3) return 2; return 0; },
    98:  function(val) { if (val === 2 || val === 3) return 2; return 0; },
    99:  function(val) { if (val === 2) return 1; if (val === 3) return 2; return 0; },
    101: function(val) { if (val === 2) return 1; if (val === 3) return 2; return 0; },
    104: function(val) { if (val === 2) return 1; if (val === 3) return 2; return 0; }
  },

  // Páry pro kontrolu konzistence odpovědí
  consistencyPairs: [
    {label: 'A', q1: 44, q2: 67},
    {label: 'B', q1: 12, q2: 23},
    {label: 'C', q1: 36, q2: 60},
    {label: 'D', q1: 14, q2: 81},
    {label: 'E', q1: 19, q2: 98},
    {label: 'F', q1: 45, q2: 99},
    {label: 'G', q1: 94, q2: 102},
    {label: 'H', q1: 75, q2: 79},
    {label: 'I', q1: 13, q2: 92},
    {label: 'J', q1: 39, q2: 83}
  ]
};