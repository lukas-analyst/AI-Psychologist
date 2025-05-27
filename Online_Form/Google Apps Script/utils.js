/**
 * Vytvoří unikátní ID na základě timestampu a pohlaví.
 * @param {string} timestamp - Datum a čas (např. "20.5.2025 10:15:00")
 * @param {string} gender - Pohlaví ("Muž" nebo "Žena")
 * @returns {string} - ID ve formátu <cislo>M nebo <cislo>Z
 */
function createRespondentId(timestamp, gender) {
  var idNum = '';
  if (timestamp) {
    var dateObj = new Date(timestamp);
    if (!isNaN(dateObj.getTime())) {
      idNum = dateObj.getTime();
    } else {
      // fallback pro český formát datumu
      var parts = timestamp.split(' ');
      var d = parts[0].split('.');
      var t = (parts[1] || '00:00:00').split(':');
      var dt = new Date(
        Number(d[2]), Number(d[1]) - 1, Number(d[0]),
        Number(t[0]), Number(t[1]), Number(t[2])
      );
      idNum = !isNaN(dt.getTime()) ? dt.getTime() : timestamp;
    }
  }
  var genderLetter = '';
  if (gender) {
    genderLetter = gender.trim().toLowerCase().startsWith('m') ? 'M'
                 : gender.trim().toLowerCase().startsWith('ž') ? 'Z'
                 : '';
  }
  return idNum + genderLetter;
}

function getRespondentsData() {
  var ss = SpreadsheetApp.openById("1WWhXEHRJtcRkOb-PJcOFudCWeGwfzBOJCroZAFAoaus");
  var sheet = ss.getSheetByName('Respondents');
  var data = sheet.getDataRange().getValues();
  var textData = data.map(row => row.map(cell =>
    cell instanceof Date
      ? Utilities.formatDate(cell, Session.getScriptTimeZone(), "dd.MM.yyyy")
      : (cell !== null && cell !== undefined ? String(cell) : "")
  ));
  Logger.log("Respondents data (text): " + JSON.stringify(textData));
  return textData;
}
function getResultsData() {
  var ss = SpreadsheetApp.openById("1WWhXEHRJtcRkOb-PJcOFudCWeGwfzBOJCroZAFAoaus");
  var sheet = ss.getSheetByName('Results');
  var data = sheet.getDataRange().getValues();
  var textData = data.map(row => row.map(cell =>
    cell instanceof Date
      ? Utilities.formatDate(cell, Session.getScriptTimeZone(), "dd.MM.yyyy")
      : (cell !== null && cell !== undefined ? String(cell) : "")
  ));
  Logger.log("Results data (text): " + JSON.stringify(textData));
  return textData;
}
function getPointsData() {
  var ss = SpreadsheetApp.openById("1WWhXEHRJtcRkOb-PJcOFudCWeGwfzBOJCroZAFAoaus");
  var sheet = ss.getSheetByName('Points');
  var data = sheet.getDataRange().getValues();
  var textData = data.map(row => row.map(cell =>
    cell instanceof Date
      ? Utilities.formatDate(cell, Session.getScriptTimeZone(), "dd.MM.yyyy")
      : (cell !== null && cell !== undefined ? String(cell) : "")
  ));
  Logger.log("Points data (text): " + JSON.stringify(textData));
  return textData;
}
function getProfileData() {
  var ss = SpreadsheetApp.openById("1WWhXEHRJtcRkOb-PJcOFudCWeGwfzBOJCroZAFAoaus");
  var sheet = ss.getSheetByName('Profile');
  var data = sheet.getDataRange().getValues();
  var textData = data.map(row => row.map(cell =>
    cell instanceof Date
      ? Utilities.formatDate(cell, Session.getScriptTimeZone(), "dd.MM.yyyy")
      : (cell !== null && cell !== undefined ? String(cell) : "")
  ));
  Logger.log("Profile data (text): " + JSON.stringify(textData));
  return textData;
}