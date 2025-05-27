function exportProfile() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheetResults = ss.getSheetByName('Results');
  var sheetRespondents = ss.getSheetByName('Respondents');
  var sheetTskore = ss.getSheetByName('Tskore');
  var sheetProfile = ss.getSheetByName('Profile') || ss.insertSheet('Profile');

  var resultsData = sheetResults.getDataRange().getValues();
  var respondentsData = sheetRespondents.getDataRange().getValues();
  var tskoreData = sheetTskore.getDataRange().getValues();

  // Mapování respondentů podle ID
  var respondentMap = {};
  for (var i = 1; i < respondentsData.length; i++) {
    var row = respondentsData[i];
    respondentMap[row[0]] = {
      name: row[1],
      gender: row[5],
      age: Number(row[3])
    };
  }

  // Kategorie a indexy
  var header = resultsData[0];
  var catOrder = ['A', 'B', 'C', 'D', 'E', 'F'];
  var catIndexes = catOrder.map(cat => header.indexOf('CAT_' + cat));

  // Hlavička pro Profile
  var profileHeader = ['ID', 'name', 'gender', 'age'].concat(catOrder.map(cat => 'CAT_' + cat + '_T'));
  var profileRows = [profileHeader];

  // Pomocná funkce pro lookup T-skóre
  function findTScore(gender, age, cat, points) {
    gender = gender && gender.trim().toLowerCase().startsWith('m') ? 'm' : 'z';
    for (var i = 1; i < tskoreData.length; i++) {
      var row = tskoreData[i];
      if (
        row[0].toLowerCase() == gender &&
        Number(row[1]) == age &&
        row[2] == cat &&
        Number(row[3]) == points
      ) {
        return row[4];
      }
    }
    return "";
  }

  // Pro každý řádek v Results
  for (var i = 1; i < resultsData.length; i++) {
    var row = resultsData[i];
    var id = row[0];
    // Zkus najít respondenta podle ID i podle ID+pohlaví (pro případ neshody)
    var respondent = respondentMap[id] || respondentMap[id + "Z"] || respondentMap[id + "M"];
    if (!respondent) continue;

    var gender = respondent.gender;
    var age = respondent.age;
    if (isNaN(age) || age < 6 || age > 18) continue;

    var profileRow = [id, respondent.name, gender, age];

    // Pro každou kategorii najdi body (points) a převed na T-skóre
    for (var c = 0; c < catOrder.length; c++) {
      var cat = catOrder[c];
      var idx = catIndexes[c];
      var points = Number(row[idx]);
      var tScore = "";
      if (!isNaN(points)) {
        tScore = findTScore(gender, age, cat, points);
      }
      profileRow.push(tScore);
    }
    profileRows.push(profileRow);
  }

  // Zapiš do Profile
  sheetProfile.clearContents();
  sheetProfile.getRange(1, 1, profileRows.length, profileRows[0].length).setValues(profileRows);
}