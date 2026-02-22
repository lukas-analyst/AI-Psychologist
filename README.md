# Psychologická klinika – Správa a vyhodnocení dotazníků

Tento repozitář obsahuje kompletní řešení pro správu, vyplňování a automatizované vyhodnocení psychologických dotazníků (např. CDI, Conners 3, SCL-90) v prostředí Google Sheets a webové aplikace.

## Struktura projektu

- **Online_Form/** – hlavní složka projektu
  - **WebApp/** – webová aplikace (HTML, CSS, JS) pro vyplňování a správu dotazníků
  - **Google Apps Script/** – serverové skripty pro Google Sheets (výpočet bodů, exporty, profily, sumarizace)
    - **Form CDI/**, **Form Conners3/**, **Form SCL90/** – skripty pro jednotlivé dotazníky
    - Každý dotazník obsahuje:
      - `code.js` – hlavní workflow
      - `config.js` – konfigurace kategorií a škál
      - `formCountPoints.js` – výpočet bodů z odpovědí
      - `formProcessResults(config).js` – sumarizace výsledků
      - `formProfile.js` – generování profilů a T-skórů
      - `formRespondents.js` – export respondentů
- **Parse data/** – pomocné Python skripty pro dávkové zpracování, slučování a analýzu dat

## Hlavní funkce

- Vyplňování dotazníků online (WebApp)
- Automatizované zpracování odpovědí a výpočet bodů (Google Apps Script)
- Vyhodnocení výsledků, T-skóry, profily
- Exporty a sumarizace dat
- Podpora více dotazníků (CDI, Conners 3, SCL-90)

## Použití

1. Nahrajte skripty do Google Apps Script projektu a propojte s Google Formulářem a Google Sheets.
2. WebApp lze nasadit jako samostatnou webovou aplikaci pro respondenty nebo administrátory.
3. Spouštějte funkce přes menu v Google Sheets, nebo nastavte automatické triggery.
4. Pro dávkové zpracování dat lze využít Python skripty ve složce `Parse data`.

## Požadavky

- Google účet s přístupem k Google Sheets a Google Apps Script
- (volitelně) Python 3 pro dávkové skripty

## Licence

Projekt je určen pro interní použití Psychologické kliniky. Pro jiné využití kontaktujte autora.

---

**Autor:** Lukáš Analyst
**Repozitář:** AI-Psychologist
