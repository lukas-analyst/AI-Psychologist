/**
 * Hlavní univerzální funkce pro zpracování výsledků dotazníku dle zadané konfigurace.
 * Všechny výsledky jsou zapsány na jeden list 'Results'.
 * 
 * - Jméno respondenta se bere z listu 'Points', sloupec A - Respondent (index 0).
 * - Věk respondenta se bere z listu 'Odpovědi', sloupec D - Datum narození (index 3).
 * - Data z 'Odpovědi' se načítají pouze jednou a ukládají do mapy pro rychlý přístup.
 * - Pokud už byl respondent zpracován (je v listu Results), jeho odpovědi se znovu nezpracovávají.
 * - Výsledky se zapisují hromadně jedním voláním setValues.
 * 
 * @param {Object} config - Konfigurační objekt pro daný dotazník.
 */
function processResults(config) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheetData = ss.getSheetByName(config.dataSheet);
  var respondentData = ss.getSheetByName(config.respondentSheet);
  var sheetResults = ss.getSheetByName(config.resultSheet) || ss.insertSheet(config.resultSheet);

  // Načti všechna data najednou
  var data = sheetData.getDataRange().getValues();
  var header = data[0];
  var respondentCol = 0;

  // Mapování čísla otázky na index ve sloupcích
  var questionNumToCol = {};
  for (var i = 1; i < header.length; i++) {
    var qNum = parseInt(header[i], 10);
    if (!isNaN(qNum)) questionNumToCol[qNum] = i;
  }

  // --- MAPA RESPONDENTŮ Z 'Odpovědi' PRO RYCHLÝ PŘÍSTUP K DATU NAROZENÍ ---
  var respondentMap = {};
  if (respondentData) {
    var odpovediData = respondentData.getDataRange().getValues();
    for (var r = 1; r < odpovediData.length; r++) {
      respondentMap[odpovediData[r][0]] = odpovediData[r];
    }
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

  // --- KATEGORIE ---
  if (config.categories) {
    Object.keys(config.categories).forEach(function(cat) {
      resultHeader.push('CAT_' + cat);
    });
  }

  // --- SCREENING ---
  if (config.screeningQuestions) {
    config.screeningQuestions.forEach(function(_, i) {
      resultHeader.push('Screening_' + (i + 1));
    });
  }

  // --- KRITÉRIA DSM-5 ---
  if (config.criteria) {
    Object.keys(config.criteria).forEach(function(crit) {
      resultHeader.push('CRIT_' + crit);
    });
    resultHeader.push('DSM5_A1');
    resultHeader.push('DSM5_A2');
    resultHeader.push('ADHD_combi');
    resultHeader.push('Porucha_chovani');
    resultHeader.push('Porucha_opozicniho_vzdoru');
  }

  // --- INDEX ---
  if (config.remapRules) {
    Object.keys(config.remapRules).forEach(function(q) {
      resultHeader.push('IndexQ' + q);
    });
    resultHeader.push('Index_sum');
    resultHeader.push('ADHD_prob');
  }

  // --- INKONZISTENCE ---
  if (config.consistencyPairs) {
    config.consistencyPairs.forEach(function(pair) {
      resultHeader.push('KONZ_' + pair.label);
    });
    resultHeader.push('Inconsistency_A');
    resultHeader.push('Inconsistency_B');
    resultHeader.push('Inconsistency');
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

    // --- SCREENING ---
    if (config.screeningQuestions) {
      config.screeningQuestions.forEach(function(q) {
        var idx = questionNumToCol[q];
        var val = (idx !== undefined) ? parseInt(row[idx], 10) : 0;
        resultRow.push(isNaN(val) ? 0 : val);
      });
    }

    // --- KRITÉRIA ---
    if (config.criteria) {
      var critTotalA1 = 0; // ADHD s převahou nepozornosti
      var critTotalA2 = 0; // ADHD s převahou hyperaktivity a impulzivity 
      var critTotalA3 = 0; // Porucha chování
      var critTotalA4 = 0; // Porucha opozičního vzdoru

      Object.keys(config.criteria).forEach(function(crit) {
        var critDef = config.criteria[crit];
        var ok = false;
        if (Array.isArray(critDef.q)) {
          var vals = critDef.q.map(function(qNum) {
            var idx = questionNumToCol[qNum];
            return (idx !== undefined) ? parseInt(row[idx], 10) : 0;
          });
          ok = critDef.cond.apply(null, vals);
        } else {
          var idx = questionNumToCol[critDef.q];
          var val = (idx !== undefined) ? parseInt(row[idx], 10) : 0;
          ok = critDef.cond(val);
        }
        resultRow.push(ok ? 1 : 0);    

        // Rozlišení A1x/A2x/A3x/A4x kritérií
        if (crit.startsWith('A1')) {
          if (ok) critTotalA1++;
        }
        if (crit.startsWith('A2')) {
          if (ok) critTotalA2++;
        }
        if (crit.startsWith('A3')) {
          if (ok) critTotalA3++;
        }
        if (crit.startsWith('A4')) {
          if (ok) critTotalA4++;
        }
      });

      // --- VĚK RESPONDENTA Z MAPY ---
      var vek = null;
      var odpovediRow = respondentMap[respondentId];
      if (odpovediRow && odpovediRow[3]) {
        var narozeni = new Date(odpovediRow[3]);
        if (!isNaN(narozeni.getTime())) {
          var dnes = new Date();
          vek = dnes.getFullYear() - narozeni.getFullYear();
          var m = dnes.getMonth() - narozeni.getMonth();
          if (m < 0 || (m === 0 && dnes.getDate() < narozeni.getDate())) {
            vek--;
          }
        }
      }

      // --- VÝSLEDKY DSM-5 ---
      // A1 - ADHD s převahou nepozornosti
      var DSM_A1 = 'NE';
      if (vek !== null) {
        if ((vek <= 16 && critTotalA1 >= 6) || (vek >= 17 && critTotalA1 >= 5)) DSM_A1 = 'ANO';
      }
      resultRow.push(DSM_A1);

      // A2 - ADHD s převahou hyperaktivity a impulzivity
      var DSM_A2 = 'NE';
      if (vek !== null) {
        if ((vek <= 16 && critTotalA2 >= 6) || (vek >= 17 && critTotalA2 >= 5)) DSM_A2 = 'ANO';
      }
      resultRow.push(DSM_A2);

      // ADHD kombinovaný typ
      var ADHD_combi = (DSM_A1 === 'ANO' && DSM_A2 === 'ANO') ? 'ANO' : 'NE';
      resultRow.push(ADHD_combi);

      // A3 - Porucha chování
      var poruchaChovani = critTotalA3 >= 3 ? 'ANO' : 'NE';
      resultRow.push(poruchaChovani);

      // A4 - Porucha opozičního vzdoru
      var poruchaOpozice = critTotalA4 >= 4 ? 'ANO' : 'NE';
      resultRow.push(poruchaOpozice);
    }

    // --- ADHD INDEX ---
    if (config.remapRules) {
      var indexSum = 0;
      Object.keys(config.remapRules).forEach(function(q) {
        var idx = questionNumToCol[q];
        var val = (idx !== undefined) ? parseInt(row[idx], 10) : 0;
        var remapped = config.remapRules[q](isNaN(val) ? 0 : val);
        resultRow.push(remapped);
        indexSum += remapped;
      });
      resultRow.push(indexSum);

      // Stanovení pravděpodobnosti ADHD podle indexu
      var adhdProbMap = [
        11, 29, 41, 51, 56, 64, 71, 77, 82, 87, 91, 94, 97, 98, 99, 99, 99, 99, 99, 99, 99
      ];
      var adhdProb = indexSum >= 0 && indexSum <= 20 ? adhdProbMap[indexSum] : (indexSum > 20 ? 99 : 11);
      resultRow.push(adhdProb);
    }

    // --- INKONZISTENCE ---
    if (config.consistencyPairs) {
      var konzSum = 0; // A
      var konzCount2or3 = 0; // B
      config.consistencyPairs.forEach(function(pair) {
        var idx1 = questionNumToCol[pair.q1];
        var idx2 = questionNumToCol[pair.q2];
        var val1 = (idx1 !== undefined) ? parseInt(row[idx1], 10) : 0;
        var val2 = (idx2 !== undefined) ? parseInt(row[idx2], 10) : 0;
        var diff = Math.abs((isNaN(val1) ? 0 : val1) - (isNaN(val2) ? 0 : val2));
        resultRow.push(diff);
        konzSum += diff;
        if (diff === 2 || diff === 3) konzCount2or3++;
      });
      resultRow.push(konzSum);
      resultRow.push(konzCount2or3);

      // Možný inkonzistentní styl odpovědí
      var inconsistencyValue = (konzSum >= 7 && konzCount2or3 >= 2) ? 'ANO' : 'NE';
      resultRow.push(inconsistencyValue);
    }

    results.push(resultRow);
  }

  // --- ZÁPIS VÝSLEDKŮ ---
  // Pokud už v listu Results jsou nějaké výsledky, přidáme nové respondenty pod existující data
  if (sheetResults.getLastRow() > 1 && results.length > 1) {
    // Přidat pouze nové respondenty (bez hlavičky)
    sheetResults.getRange(sheetResults.getLastRow() + 1, 1, results.length - 1, results[0].length).setValues(results.slice(1));
  } else {
    // První zápis nebo prázdný list
    sheetResults.clear();
    sheetResults.getRange(1, 1, results.length, results[0].length).setValues(results);
  }
}

/*
Vysvětlení:
- Skript načte všechna potřebná data najednou a vytváří mapy pro rychlý přístup.
- Věk respondenta se počítá pouze jednou z listu 'Odpovědi'.
- Pokud už byl respondent zpracován, jeho odpovědi se znovu nezpracovávají.
- Vše je připraveno pro automatické spouštění po odeslání formuláře.
*/