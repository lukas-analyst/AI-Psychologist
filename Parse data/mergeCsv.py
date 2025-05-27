import csv
import os
from glob import glob

OUTPUT_DIR = "./Parse data/Output/"
OUTPUT_FILE = "./Parse data/Tskore_all.csv"

all_rows = []
header = None

# Najdi všechny csv soubory ve složce Output
for file in glob(os.path.join(OUTPUT_DIR, "*.csv")):
    with open(file, encoding="utf-8") as f:
        reader = csv.reader(f)
        file_header = next(reader)
        if header is None:
            header = file_header
        for row in reader:
            all_rows.append(tuple(row))  # tuple kvůli set()

# Odstranění duplicit
all_rows = list(set(all_rows))
all_rows.sort(key=lambda x: (x[0], int(x[1]), x[2], int(x[3]), int(x[4])))

with open(OUTPUT_FILE, "w", newline="", encoding="utf-8") as f:
    writer = csv.writer(f)
    writer.writerow(header)
    writer.writerows(all_rows)

print(f"Hotovo! Výstupní soubor: {OUTPUT_FILE}")