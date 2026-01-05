function exportProfile() {
  Logger.log('--- Spouštím exportProfile ---');
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheetResults = ss.getSheetByName('Results');
  var sheetRespondents = ss.getSheetByName('Respondents');
  var sheetTskore = ss.getSheetByName('Tskore');
  var sheetProfile = ss.getSheetByName('Profile') || ss.insertSheet('Profile');

  var resultsData = sheetResults.getDataRange().getValues();
  Logger.log('Načteno resultsData: ' + JSON.stringify(resultsData));
  var respondentsData = sheetRespondents.getDataRange().getValues();
  Logger.log('Načteno respondentsData: ' + JSON.stringify(respondentsData));
  var tskoreData = sheetTskore.getDataRange().getValues();
  Logger.log('Načteno tskoreData: ' + JSON.stringify(tskoreData));

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
  Logger.log('Vytvořen respondentMap: ' + JSON.stringify(respondentMap));

  // Kategorie a indexy
  var header = resultsData[0];
  var catOrder = ['AGR', 'ANX', 'DEP', 'PAR', 'FOB', 'PSY', 'SOM', 'INT', 'OBS'];
  var catIndexes = catOrder.map(cat => header.indexOf('S_' + cat));
  Logger.log('catIndexes: ' + JSON.stringify(catIndexes));

  // Hlavička pro Profile
  var profileHeader = ['ID', 'name', 'gender', 'age'].concat(catOrder.map(cat => 'S_' + cat + '_T'));
  var profileRows = [profileHeader];
  Logger.log('profileHeader: ' + JSON.stringify(profileHeader));

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
    Logger.log('Zpracovávám respondenta ID: ' + id);
    // Zkus najít respondenta podle ID i podle ID+pohlaví (pro případ neshody)
    var respondent = respondentMap[id] || respondentMap[id + "Z"] || respondentMap[id + "M"];
    if (!respondent) {
      Logger.log('Respondent nenalezen v respondentMap: ' + id);
      continue;
    }

    var gender = respondent.gender;
    var age = respondent.age;

    var profileRow = [id, respondent.name, gender, age];

    // Výpočet T-skórů je dočasně zakomentován
    for (var c = 0; c < catOrder.length; c++) {
      var cat = catOrder[c];
      var idx = catIndexes[c];
      var points = Number(row[idx]);
      var tScore = "0";
      //if (!isNaN(points)) {
      //  tScore = findTScore(gender, age, cat, points);
      //}
      profileRow.push(tScore);
    }
    Logger.log('Přidávám profileRow: ' + JSON.stringify(profileRow));
    profileRows.push(profileRow);
  }

  // Zapiš do Profile
  Logger.log('Zápis do sheetProfile, počet řádků: ' + profileRows.length);
  //sheetProfile.clearContents();
  sheetProfile.getRange(1, 1, profileRows.length, profileRows[0].length).setValues(profileRows);
  Logger.log('--- exportProfile dokončen ---');
}