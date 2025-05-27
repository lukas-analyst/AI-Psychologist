/**
 * Konfigurační objekt pro univerzální zpracování dotazníku.
 * - Nastavuje názvy listů, kategorie, screening, kritéria DSM-5, indexy a páry pro konzistenci.
 * - Všechny číselné hodnoty otázek odpovídají číslování v dotazníku.
 */
var config = {
  // Listy v Google Sheets
  dataSheet: "Points",         // List s bodovým ohodnocením odpovědí (výstup z countPoints)
  respondentSheet: "Odpovědi", // List s původními odpověďmi a datem narození
  resultSheet: "Results",      // List pro finální výsledky

  // Kategorie a jejich otázky (číslování odpovídá dotazníku)
  categories: {
    A: [1, 6, 8, 10, 11, 13],                  // Tab 5 - Špatná nálada
    B: [5, 12, 26, 27],                        // Tab 6 - Interpersonální potíže
    C: [3, 15, 23, 24],                        // Tab 7 - Nevýkonnost
    D: [4, 16, 17, 18, 19, 20, 21, 22],        // Tab 8 - Anhedonie
    E: [2, 7, 9, 14, 25],                      // Tab 9 - Negativní sebehodnocení
    F: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27] // Celkové skóre
  }
};