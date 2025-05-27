/**
 * Hlavní serverový skript pro Google Apps Script Web App.
 * - Vrací HTML frontend nebo JSON data podle parametru.
 * - Obsahuje funkce pro získání dat a automatické zpracování po odeslání formuláře.
 */

var SPREADSHEET_ID = "1WWhXEHRJtcRkOb-PJcOFudCWeGwfzBOJCroZAFAoaus";

function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('Conners 3')
    .addItem('Spočítat body', 'countPoints')
    .addItem('Zpracovat celkové výsledky', 'processResultsMenu')
    .addItem('Zpracovat respondenty', 'exportRespondents')
    .addItem('Vypracuj profil dítěte', 'exportProfile')
    .addItem('Spusť všechny funkce', 'main')
    .addToUi();
}

// Vrací HTML stránku nebo JSON data podle parametru ?api=1
function doGet(e) {
  // Povolené listy
  var allowedSheets = ["Results", "Respondents", "Points", "Profile"];
  var sheetName = (e && e.parameter && e.parameter.sheet) ? e.parameter.sheet : "Results";
  if (allowedSheets.indexOf(sheetName) === -1) {
    return ContentService.createTextOutput(JSON.stringify({error: "Sheet not allowed"})).setMimeType(ContentService.MimeType.JSON);
  }
  var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  var sheet = ss.getSheetByName(sheetName);
  if (!sheet) {
    return ContentService.createTextOutput(JSON.stringify({error: "Sheet not found"})).setMimeType(ContentService.MimeType.JSON);
  }
  var data = sheet.getDataRange().getValues();
  var textData = data.map(row => row.map(cell =>
    cell instanceof Date
      ? Utilities.formatDate(cell, Session.getScriptTimeZone(), "dd.MM.yyyy")
      : (cell !== null && cell !== undefined ? String(cell) : "")
  ));
  return ContentService.createTextOutput(JSON.stringify(textData)).setMimeType(ContentService.MimeType.JSON);
}

// Trigger: po odeslání formuláře zpracuje odpovědi a uloží výsledky
function onFormSubmit(e) {
  countPoints();
  exportRespondents();
  exportProfile();
  main();
}

// Hlavní zpracování výsledků (volá processResults s configem)
function main() {
  processResults(config);
}

// Funkce pro menu - volá processResults s configem
function processResultsMenu() {
  processResults(config);
}