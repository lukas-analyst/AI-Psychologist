# Parse data

Python skripty pro převod a přípravu dat (zejména T-skóry) z textových tabulek do CSV.

## Složky a soubory

- **Input/** – vstupní TXT tabulky (exporty z norem)
- **Output/** – výstupní CSV pro jednotlivé kategorie (pro starší dotazníky)
- **Output_CDI/** – výstupní CSV pro CDI (nový formát)
- **parseProfile.py** – převod tabulek do CSV (pro starší dotazníky)
- **parseProfile_CDI.py** – převod tabulek do CSV (pro CDI)
- **mergeCsv.py** – sloučení všech CSV do jednoho souboru (Tskore_all.csv)
- **Tskore_all.csv** – souhrnný CSV soubor všech T-skórů

## Použití

1. Upravte/vložte vstupní TXT soubory do složky `Input/`.
2. Spusťte příslušný skript (`parseProfile.py` nebo `parseProfile_CDI.py`).
3. Výstupní CSV najdete ve složce `Output/` nebo `Output_CDI/`.
4. Pro sloučení všech CSV spusťte `mergeCsv.py`.

---

## Požadavky

- Python 3.x

---