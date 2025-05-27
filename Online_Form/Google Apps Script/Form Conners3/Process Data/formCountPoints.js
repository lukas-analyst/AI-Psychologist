/**
 * Funkce countPoints:
 * - Pro každého nového respondenta v listu 'Odpovědi' spočítá bodové ohodnocení odpovědí.
 * - Výsledky ukládá do listu 'Points' (každý respondent pouze jednou).
 * - Zpracovává pouze respondenty, kteří ještě nejsou v listu 'Points'.
 * - Zápis je efektivní: nové řádky se přidávají hromadně.
 */
function countPoints() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheetOtazky = ss.getSheetByName('Otázky');
  var sheetOdpovedi = ss.getSheetByName('Odpovědi');
  var sheetPoints = ss.getSheetByName('Points') || ss.insertSheet('Points');

  var answerMap = {
    'není vůbec pravdivé (nikdy, výjimečně)': 0,
    'jen částečně pravdivé (občas, příležitostně)': 1,
    'docela pravdivé (často)': 2,
    'velice pravdivé (velmi často)': 3
  };

  var otazkyData = sheetOtazky.getDataRange().getValues();
  var questionMap = {};
  for (var i = 1; i < otazkyData.length; i++) {
    questionMap[otazkyData[i][1]] = [
      otazkyData[i][2], otazkyData[i][3], otazkyData[i][4], otazkyData[i][5]
    ];
  }

  var odpovediData = sheetOdpovedi.getDataRange().getValues();
  var odpovediHeader = odpovediData[0];
  var firstQ = 7;
  var lastQ = odpovediHeader.length - 3;

  // Načti již zpracované ID z 'Points'
  var processedMap = {};
  if (sheetPoints.getLastRow() > 1) {
    var processedData = sheetPoints.getRange(2, 1, sheetPoints.getLastRow() - 1, 1).getValues();
    for (var p = 0; p < processedData.length; p++) {
      processedMap[processedData[p][0]] = true;
    }
  }

  var results = [];
  // Připrav hlavičku pouze pokud je list prázdný
  if (sheetPoints.getLastRow() < 1) {
    var header = ['ID', 'Respondent'];
    for (var i = firstQ; i < lastQ; i++) header.push(i - firstQ + 1);
    header.push('total');
    results.push(header);
  }

  // Zpracuj pouze nové respondenty (podle ID = createRespondentId)
  for (var i = 1; i < odpovediData.length; i++) {
    var timestamp = odpovediData[i][0]; // sloupec A
    var gender = odpovediData[i][2];    // sloupec C
    var id = createRespondentId(timestamp, gender); // použij utilitu
    var respondent = odpovediData[i][1];
    if (!id || processedMap[id]) continue; // přeskoč již zpracované
    var rowPoints = [id, respondent], total = 0;
    for (var j = firstQ; j < lastQ; j++) {
      var questionText = odpovediHeader[j];
      var answerText = odpovediData[i][j];
      var answerIdx = answerMap[answerText];
      var qPoints = questionMap[questionText] || [0, 0, 0, 0];
      var pts = (answerIdx >= 0 && answerIdx <= 3) ? qPoints[answerIdx] : 0;
      rowPoints.push(pts);
      total += pts;
    }
    rowPoints.push(total);
    results.push(rowPoints);
  }

  // Přidej pouze nové řádky (bez mazání starých)
  if (results.length > 0) {
    sheetPoints.getRange(sheetPoints.getLastRow() + 1, 1, results.length, results[0].length).setValues(results);
  }
}