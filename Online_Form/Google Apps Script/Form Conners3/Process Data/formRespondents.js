/**
 * Vezme prvních 7 sloupců z listu "Odpovědi", vytvoří ID a uloží je na nový list "Respondents"
 * Výstupní formát: [ID, Name, Age, age_calculated, datetime, Gender, birth_date, age_submitted, school_grade, parent_name]
 */
function exportRespondents() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheetOdpovedi = ss.getSheetByName('Odpovědi');
  if (!sheetOdpovedi) throw new Error('List "Odpovědi" neexistuje!');
  var data = sheetOdpovedi.getDataRange().getValues();

  // Připrav data pro nový list s novými názvy sloupců
  var header = [
    "ID", 
    "name", 
    "age_today", 
    "age_calculated",
    "datetime", 
    "gender", 
    "birth_date", 
    "age_submitted", 
    "school_grade", 
    "parent_name"
  ];
  var result = [header];

  for (var i = 1; i < data.length; i++) {
    var row = data[i];
    var timestamp = row[0];
    var gender = row[2];
    var id = createRespondentId(timestamp, gender);
    var name = row[1];

    // Převod časové značky na datum ve formátu dd.mm.yyyy
    var dateStr = "";
    var formDate = null;
    if (timestamp instanceof Date) {
      dateStr = Utilities.formatDate(timestamp, Session.getScriptTimeZone(), "dd.MM.yyyy");
      formDate = timestamp;
    } else if (typeof timestamp === "string" && timestamp) {
      var parsed = new Date(timestamp);
      if (!isNaN(parsed.getTime())) {
        dateStr = Utilities.formatDate(parsed, Session.getScriptTimeZone(), "dd.MM.yyyy");
        formDate = parsed;
      } else {
        dateStr = timestamp; // fallback, pokud není převod možný
      }
    }

    // Výpočet věku ke dnešku
    var birth = row[3];
    var age_today = "";
    if (birth instanceof Date) {
      var today = new Date();
      age_today = today.getFullYear() - birth.getFullYear();
      var m = today.getMonth() - birth.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
        age_today--;
      }
    } else if (typeof birth === "string" && birth) {
      var parsedBirth = new Date(birth);
      if (!isNaN(parsedBirth.getTime())) {
        var today = new Date();
        age = today.getFullYear() - parsedBirth.getFullYear();
        var m = today.getMonth() - parsedBirth.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < parsedBirth.getDate())) {
          age--;
        }
      }
    }

    // Výpočet věku k datu odeslání formuláře (age_calculated)
    var age_calculated = "";
    if (birth instanceof Date && formDate instanceof Date) {
      age_calculated = formDate.getFullYear() - birth.getFullYear();
      var m = formDate.getMonth() - birth.getMonth();
      if (m < 0 || (m === 0 && formDate.getDate() < birth.getDate())) {
        age_calculated--;
      }
    } else if (typeof birth === "string" && birth && formDate instanceof Date) {
      var parsedBirth = new Date(birth);
      if (!isNaN(parsedBirth.getTime())) {
        age_calculated = formDate.getFullYear() - parsedBirth.getFullYear();
        var m = formDate.getMonth() - parsedBirth.getMonth();
        if (m < 0 || (m === 0 && formDate.getDate() < parsedBirth.getDate())) {
          age_calculated--;
        }
      }
    }

    // Sestav nový řádek s upravenými názvy sloupců
    var newRow = [
      id,                // ID
      name,              // name
      age_today,         // age (vypočtený ke dnešku)
      age_calculated,    // age_calculated (vypočtený k datu odeslání formuláře)
      dateStr,           // datetime
      row[2],            // gender (pohlaví)
      row[3],            // birth_date (datum narození dítěte)
      row[4],            // age_submitted (Věk - zadaný ve formuláři)
      row[5],            // school_grade (Třída)
      row[6]             // parent_name (Jméno rodiče)
    ];
    result.push(newRow);
  }

  // Vytvoř nebo vyčisti list "Respondents"
  var sheetRespondents = ss.getSheetByName('Respondents');
  if (!sheetRespondents) {
    sheetRespondents = ss.insertSheet('Respondents');
  } else {
    sheetRespondents.clearContents();
  }

  // Zapiš data
  sheetRespondents.getRange(1, 1, result.length, result[0].length).setValues(result);
}