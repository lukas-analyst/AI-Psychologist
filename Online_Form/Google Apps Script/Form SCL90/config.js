/**
 * Konfigurační objekt pro univerzální zpracování dotazníku.
 * - Nastavuje názvy listů a škály.
 * - Všechny číselné hodnoty otázek odpovídají číslování v dotazníku.
 */
var config = {
  // Listy v Google Sheets
  dataSheet: "Points",         // List s bodovým ohodnocením odpovědí (výstup z countPoints)
  respondentSheet: "Odpovědi", // List s původními odpověďmi a datem narození
  resultSheet: "Results",    // List pro finální výsledky

  // Kategorie a jejich otázky
  categories: {
    AGR:  [].concat([11, 24, 63, 67, 74, 81]),
    ANX:  [].concat([2, 17, 23, 33, 39, 57, 72, 78, 80, 86]),
    DEP:  [].concat([5, 14, 15, 20, 22, 26, 29, 30, 31, 32, 54, 71, 79]),
    PAR:  [].concat([8, 18, 43, 68, 76, 83]),
    FOB:  [].concat([13, 25, 47, 50, 70, 75, 82]),
    PSY:  [].concat([7 ,16 ,35 ,62 ,77 ,84 ,85 ,87 ,88 ,90]),
    SOM:  [].concat([1 ,4 ,12 ,27 ,40 ,42 ,48 ,49 ,52 ,53 ,56 ,58]),
    INT:  [].concat([6 ,21 ,34 ,36 ,37 ,41 ,61 ,69 ,73]),
    OBS:  [].concat([3 ,9 ,10 ,28 ,38 ,45 ,46 ,51 ,55 ,65])
  }
};