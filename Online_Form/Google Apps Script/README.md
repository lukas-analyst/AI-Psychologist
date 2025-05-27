# Google Apps Script

Serverové skripty pro zpracování dotazníků v Google Sheets.

## Složky

- **Form CDI/** – skripty pro dotazník CDI (počítání bodů, export, profil, atd.)
- **Form Conners3/** – skripty pro dotazník Conners 3

## Hlavní skripty

- `code.js` – hlavní serverový skript (spouští workflow)
- `config.js` – konfigurace kategorií a zpracování
- `formCountPoints.js` – výpočet bodů z odpovědí
- `formProcessResults(config).js` – sumarizace výsledků
- `formRespondents.js` – export respondentů
- `formProfile.js` – generování profilů a T-skórů

## Použití

1. Nahrajte do Google Apps Script projektu.
2. Propojte s Google Sheets a Google Formulářem.
3. Spouštějte přes menu nebo trigger.

---