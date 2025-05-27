/**
 * Hlavní univerzální funkce pro zpracování výsledků dotazníku dle zadané konfigurace.
 * Všechny výsledky jsou zapsány na jeden list 'Results'.
 * 
 * - Jméno respondenta se bere z listu 'Points', sloupec B (index 1).
 * - Výsledky se zapisují hromadně jedním voláním setValues.
 * - Pokud už byl respondent zpracován (je v listu Results), jeho odpovědi se znovu nezpracovávají.
 * 
 * @param {Object} config - Konfigurační objekt pro daný dotazník.
 */
function processResults(config) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheetData = ss.getSheetByName(config.dataSheet);
  var sheetResults = ss.getSheetByName(config.resultSheet) || ss.insertSheet(config.resultSheet);

  // Načti všechna data najednou
  var data = sheetData.getDataRange().getValues();
  var header = data[0];

  // Mapování čísla otázky na index ve sloupcích
  var questionNumToCol = {};
  for (var i = 2; i < header.length; i++) { // Začínáme od indexu 2 (po ID a Respondent)
    var qNum = parseInt(header[i], 10);
    if (!isNaN(qNum)) questionNumToCol[qNum] = i;
  }

  // --- MAPA JIŽ ZPRACOVANÝCH RESPONDENTŮ (aby se nezpracovávali znovu) ---
  var alreadyProcessed = {};
  if (sheetResults.getLastRow() > 1) {
    var processedData = sheetResults.getRange(2, 1, sheetResults.getLastRow() - 1, 1).getValues();
    for (var p = 0; p < processedData.length; p++) {
      alreadyProcessed[processedData[p][0]] = true;
    }
  }

  // Výsledky pro všechny respondenty
  var results = [];

  // Připrav hlavičku výsledků
  var resultHeader = ['ID', 'Respondent'];
  if (config.categories) {
    Object.keys(config.categories).forEach(function(cat) {
      resultHeader.push('CAT_' + cat);
    });
  }
  results.push(resultHeader);

  // --- VÝPOČET PRO KAŽDÉHO RESPONDENTA ---
  for (var i = 1; i < data.length; i++) {
    var row = data[i];
    var respondentId = row[0];      // ID respondenta (z Points, sloupec 0)
    var respondentName = row[1];    // Jméno respondenta (z Points, sloupec 1)

    // Pokud už byl respondent zpracován, přeskoč ho
    if (alreadyProcessed[respondentId]) continue;

    var resultRow = [respondentId, respondentName];

    // --- KATEGORIE ---
    if (config.categories) {
      Object.keys(config.categories).forEach(function(cat) {
        var sum = 0;
        config.categories[cat].forEach(function(qNum) {
          var idx = questionNumToCol[qNum];
          var val = (idx !== undefined) ? parseInt(row[idx], 10) : 0;
          sum += isNaN(val) ? 0 : val;
        });
        resultRow.push(sum);
      });
    }

    results.push(resultRow);
  }

  // --- ZÁPIS VÝSLEDKŮ ---
  if (sheetResults.getLastRow() > 1 && results.length > 1) {
    // Přidat pouze nové respondenty (bez hlavičky)
    sheetResults.getRange(sheetResults.getLastRow() + 1, 1, results.length - 1, results[0].length).setValues(results.slice(1));
  } else {
    // První zápis nebo prázdný list
    sheetResults.clear();
    sheetResults.getRange(1, 1, results.length, results[0].length).setValues(results);
  }
}