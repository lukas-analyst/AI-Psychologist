import csv
import os

# Seznamy pro iteraci
POHLAVI_LIST = ["M", "Z"]
KATEGORIE_LIST = ["IN", "HY", "LP", "EF", "AG", "PR", "GI", "AN", "AH", "CD", "OD"]
VEKOVE_SKUPINY = ["6_11", "12_18"]

INPUT_DIR = "./Parse data/Input/"
OUTPUT_DIR = "./Parse data/Output/"

def parse_body(cell):
    if not cell or cell == "•":
        return []
    result = []
    for part in cell.split(","):
        part = part.strip()
        if "+" in part:
            base = int(part.replace("+", ""))
            result.extend(range(base, 41))
        elif "-" in part:
            start, end = map(int, part.split("-"))
            result.extend(range(start, end + 1))
        elif part.isdigit():
            result.append(int(part))
    return result

for pohlavi in POHLAVI_LIST:
    for kategorie in KATEGORIE_LIST:
        for vek_skup in VEKOVE_SKUPINY:
            input_file = f"{INPUT_DIR}{pohlavi}_{kategorie}_{vek_skup}.txt"
            output_file = f"{OUTPUT_DIR}{pohlavi}_{kategorie}_{vek_skup}.csv"
            if not os.path.exists(input_file):
                print(f"Soubor {input_file} neexistuje, přeskočeno.")
                continue

            # Určení rozsahu věků podle skupiny
            if vek_skup == "6_11":
                VEKY = list(range(6, 12))
            elif vek_skup == "12_18":
                VEKY = list(range(12, 18))
            else:
                print(f"Neznámá věková skupina {vek_skup}, přeskočeno.")
                continue

            with open(input_file, encoding="utf-8") as f:
                lines = [line.strip() for line in f if line.strip()]

            header = lines[0].split("\t")
            vek_idx = {i: int(v) for i, v in enumerate(header[1:], 1)}

            rows = []
            for line in lines[1:]:
                parts = line.split("\t")
                tscore = int(parts[0])
                for col_idx, cell in enumerate(parts[1:], 1):
                    vek = vek_idx[col_idx]
                    for body in parse_body(cell):
                        rows.append([pohlavi.lower(), vek, kategorie, body, tscore])

            # Pro věkovou skupinu 12_18 přidej pro věk 18 stejné řádky jako pro 17
            if vek_skup == "12_18":
                rows_17 = [row for row in rows if row[1] == 17]
                for row in rows_17:
                    row_18 = row.copy()
                    row_18[1] = 18
                    rows.append(row_18)

            # Odstranění duplicit
            rows = list({(p,v,k,b): [p,v,k,b,t] for p,v,k,b,t in rows}.values())
            rows.sort(key=lambda x: (int(x[1]), int(x[3]), int(x[4])))

            os.makedirs(os.path.dirname(output_file), exist_ok=True)
            with open(output_file, "w", newline="", encoding="utf-8") as f:
                writer = csv.writer(f)
                writer.writerow(["Pohlaví", "Věk", "Kategorie", "Body", "T-skór"])
                writer.writerows(rows)

            print(f"Hotovo: {output_file}")