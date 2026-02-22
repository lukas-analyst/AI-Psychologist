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
  Logger.log('--- Spouštím processResults ---');
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheetData = ss.getSheetByName(config.dataSheet);
  var sheetResults = ss.getSheetByName(config.resultSheet) || ss.insertSheet(config.resultSheet);

  // Načti všechna data najednou
  var data = sheetData.getDataRange().getValues();
  Logger.log('Načteno data: ' + JSON.stringify(data));
  var header = data[0];
  Logger.log('Načteno header: ' + JSON.stringify(header));

  // Mapování čísla otázky na index ve sloupcích
  var questionNumToCol = {};
  for (var i = 2; i < header.length; i++) { // Začínáme od indexu 2 (po ID a Respondent)
    var qNum = parseInt(header[i], 10);
    if (!isNaN(qNum)) questionNumToCol[qNum] = i;
  }
  Logger.log('questionNumToCol: ' + JSON.stringify(questionNumToCol));

  // --- MAPA JIŽ ZPRACOVANÝCH RESPONDENTŮ (aby se nezpracovávali znovu) ---
  var alreadyProcessed = {};
  if (sheetResults.getLastRow() > 1) {
    var processedData = sheetResults.getRange(2, 1, sheetResults.getLastRow() - 1, 1).getValues();
    for (var p = 0; p < processedData.length; p++) {
      alreadyProcessed[processedData[p][0]] = true;
    }
    Logger.log('alreadyProcessed: ' + JSON.stringify(alreadyProcessed));
  }

  // Výsledky pro všechny respondenty
  var results = [];
  Logger.log('Připravuji výpočet výsledků...');


  // Připrav hlavičku výsledků
  var resultHeader = ['ID', 'Respondent'];
  var catKeys = [];
  if (config.categories) {
    catKeys = Object.keys(config.categories);
    catKeys.forEach(function(cat) {
      resultHeader.push('S_' + cat);
    });
    catKeys.forEach(function(cat) {
      resultHeader.push('G_' + cat);
    });
    catKeys.forEach(function(cat) {
      resultHeader.push('P_' + cat);
    });
  }
  resultHeader.push('DOPLNEK');
  resultHeader.push('P_DOPLNEK');
  resultHeader.push('GS');
  resultHeader.push('GSI');
  resultHeader.push('PST');
  resultHeader.push('PSDI');
  results.push(resultHeader);
  Logger.log('resultHeader: ' + JSON.stringify(resultHeader));

  // --- VÝPOČET PRO KAŽDÉHO RESPONDENTA ---
  for (var i = 1; i < data.length; i++) {
    var row = data[i];
    var respondentId = row[0];      // ID respondenta (z Points, sloupec 0)
    var respondentName = row[1];    // Jméno respondenta (z Points, sloupec 1)
    Logger.log('Zpracovávám respondenta ID: ' + respondentId);

    // Pokud už byl respondent zpracován, přeskoč ho
    if (alreadyProcessed[respondentId]) {
      Logger.log('Respondent již zpracován, přeskočeno: ' + respondentId);
      continue;
    }

    var resultRow = [respondentId, respondentName];

    // --- KATEGORIE/ŠKÁLY ---
    var catSums = [];
    var catAboveZero = [];
    if (config.categories) {
      catKeys.forEach(function(cat) {
        var sum = 0;
        var aboveZero = 0;
        var aboveZeroValues = [];
        var allValues = [];
        config.categories[cat].forEach(function(qNum) {
          var idx = questionNumToCol[qNum];
          var val = (idx !== undefined) ? parseInt(row[idx], 10) : 0;
          sum += isNaN(val) ? 0 : val;
          allValues.push({qNum: qNum, value: val});
          if (!isNaN(val) && val > 0) {
            aboveZero++;
            aboveZeroValues.push({cat: cat, qNum: qNum, value: val});
          }
        });
        if (aboveZeroValues.length > 0) {
          Logger.log('Respondent: ' + respondentName + ', kategorie ' + cat + ' - hodnoty > 0: ' + JSON.stringify(aboveZeroValues) + ', P: ' + aboveZero);
        }
        Logger.log('Respondent: ' + respondentName + ', kategorie ' + cat + ' - hodnoty pro G: ' + JSON.stringify(allValues) + ', G: ' + (allValues.length > 0 ? Number((sum / allValues.length).toFixed(2)) : 0));
        resultRow.push(sum);
        catSums.push({cat: cat, sum: sum, count: config.categories[cat].length});
        catAboveZero.push(aboveZero);
      });

      // --- PRŮMĚR (G_) ---
      catSums.forEach(function(obj) {
        var avg = obj.count > 0 ? (obj.sum / obj.count) : 0;
        resultRow.push(Number(avg.toFixed(2)));
      });

      // --- POČET > 0 (P_) ---
      catAboveZero.forEach(function(val) {
        resultRow.push(val);
      });
    }

    // --- DOPLNEK ---
    var doplnekOtazky = [19, 44, 59, 60, 64, 66, 89];
    var doplnekSum = 0;
    var doplnekAboveZero = 0;
    var doplnekAboveZeroValues = [];
    var doplnekAllValues = [];
    doplnekOtazky.forEach(function(qNum) {
      var idx = questionNumToCol[qNum];
      var val = (idx !== undefined) ? parseInt(row[idx], 10) : 0;
      doplnekSum += isNaN(val) ? 0 : val;
      doplnekAllValues.push({qNum: qNum, value: val});
      if (!isNaN(val) && val > 0) {
        doplnekAboveZero++;
        doplnekAboveZeroValues.push({qNum: qNum, value: val});
      }
    });
    if (doplnekAboveZeroValues.length > 0) {
      Logger.log('Respondent: ' + respondentName + ', DOPLNEK - hodnoty > 0: ' + JSON.stringify(doplnekAboveZeroValues) + ', P_DOPLNEK: ' + doplnekAboveZero);
    }
    Logger.log('Respondent: ' + respondentName + ', DOPLNEK - hodnoty pro G: ' + JSON.stringify(doplnekAllValues) + ', G_DOPLNEK: ' + (doplnekAllValues.length > 0 ? Number((doplnekSum / doplnekAllValues.length).toFixed(2)) : 0));
    resultRow.push(doplnekSum);
    resultRow.push(doplnekAboveZero);

    // --- GS: součet všech S_ a DOPLNEK ---
    var gsSum = 0;
    // S_ hodnoty jsou v resultRow na pozicích 2 až 2+catKeys.length-1
    for (var k = 0; k < catKeys.length; k++) {
      gsSum += resultRow[2 + k];
    }
    gsSum += doplnekSum;

    resultRow.push(gsSum);
    // --- GSI: GS / 90 ---
    var gsi = 90 > 0 ? (gsSum / 90) : 0;
    resultRow.push(Number(gsi.toFixed(3)));

    // --- PST: součet všech P_ včetně P_DOPLNEK ---
    // P_ začínají na pozici 2+catKeys.length*2, délka catKeys, pak P_DOPLNEK
    var pStart = 2 + catKeys.length * 2;
    var pEnd = pStart + catKeys.length;
    var pst = 0;
    for (var p = pStart; p < pEnd; p++) {
      pst += resultRow[p];
    }
    pst += doplnekAboveZero;
    resultRow.push(pst);

    // --- PSDI: GS / PST ---
    var psdi = pst > 0 ? (gsSum / pst) : 0;
    resultRow.push(Number(psdi.toFixed(3)));

    Logger.log('Přidávám resultRow: ' + JSON.stringify(resultRow));
    results.push(resultRow);
  }

  // --- ZÁPIS VÝSLEDKŮ ---
  if (sheetResults.getLastRow() > 1 && results.length > 1) {
    Logger.log('Přidávám nové respondenty do Results: ' + (results.length - 1));
    // Přidat pouze nové respondenty (bez hlavičky)
    sheetResults.getRange(sheetResults.getLastRow() + 1, 1, results.length - 1, results[0].length).setValues(results.slice(1));
  } else {
    Logger.log('První zápis nebo prázdný list, zapisuji všechny výsledky.');
    // První zápis nebo prázdný list
    sheetResults.getRange(1, 1, results.length, results[0].length).setValues(results);
  }
  Logger.log('--- processResults dokončen ---');
}