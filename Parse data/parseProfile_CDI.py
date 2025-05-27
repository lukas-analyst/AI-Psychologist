import csv
import os
import re

# Konfigurace
POHLAVI_LIST = ["M", "Z"]
VEKOVE_SKUPINY = ["7_12", "13_17"]
INPUT_DIR = "./Parse data/Input/"
OUTPUT_DIR = "./Parse data/Output_CDI/"

def parse_filename(filename):
    """
    Vrátí pohlaví, kategorii a věkovou skupinu z názvu souboru.
    Např. CDI_M_A_7_12.txt -> ('M', 'A', '7_12')
    """
    m = re.match(r"CDI_([MZ])_([A-F])_(\d+_\d+)\.txt", filename)
    if m:
        return m.group(1), m.group(2), m.group(3)
    return None, None, None

def veky_pro_skupinu(vek_skup):
    start, end = map(int, vek_skup.split("_"))
    return list(range(start, end + 1))

def process_file(filepath, pohlavi, kategorie, vek_skup):
    rows = []
    veky = veky_pro_skupinu(vek_skup)
    with open(filepath, encoding="utf-8") as f:
        lines = [line.strip() for line in f if line.strip()]
    if not lines or len(lines) < 2:
        return rows
    # Očekáváme hlavičku: S   T
    for line in lines[1:]:
        parts = re.split(r"\s+", line)
        if len(parts) < 2:
            continue
        body = int(parts[0])
        tscore = int(parts[1])
        for vek in veky:
            rows.append([pohlavi, vek, kategorie, body, tscore])
    return rows

def main():
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    all_rows = []
    for filename in os.listdir(INPUT_DIR):
        if not filename.startswith("CDI_") or not filename.endswith(".txt"):
            continue
        pohlavi, kategorie, vek_skup = parse_filename(filename)
        if not all([pohlavi, kategorie, vek_skup]):
            print(f"Přeskakuji neznámý soubor: {filename}")
            continue
        filepath = os.path.join(INPUT_DIR, filename)
        rows = process_file(filepath, pohlavi, kategorie, vek_skup)
        if not rows:
            print(f"Soubor {filename} je prázdný nebo nevalidní.")
            continue
        # Zápis pro každý soubor zvlášť
        output_file = os.path.join(OUTPUT_DIR, f"CDI_{pohlavi}_{kategorie}_{vek_skup}.csv")
        with open(output_file, "w", newline="", encoding="utf-8") as f:
            writer = csv.writer(f)
            writer.writerow(["Pohlaví", "Věk", "Kategorie", "Body", "T-skór"])
            writer.writerows(rows)
        print(f"Hotovo: {output_file}")
        all_rows.extend(rows)
    # Volitelně: vše do jednoho souboru
    output_all = os.path.join(OUTPUT_DIR, "CDI_ALL.csv")
    with open(output_all, "w", newline="", encoding="utf-8") as f:
        writer = csv.writer(f)
        writer.writerow(["Pohlaví", "Věk", "Kategorie", "Body", "T-skór"])
        writer.writerows(all_rows)
    print(f"Hotovo: {output_all}")

if __name__ == "__main__":
    main()