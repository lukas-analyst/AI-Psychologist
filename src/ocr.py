import easyocr

def ocr_handwritten(image_path):
    """
    Použije EasyOCR k extrakci textu z obrázku (ručně psaný text).
    
    :param image_path: Cesta k obrázku.
    :return: Extrahovaný text.
    """
    reader = easyocr.Reader(['cs'], gpu=True)  # 'cs' pro češtinu, GPU vypnuto pro offline režim
    results = reader.readtext(image_path, detail=0)  # Extrahuje text bez detailů
    return "\n".join(results)

# Načti obrázek
image_path = 'ocr_input/bara01.jpg'
print("Obrázek načten.")

# Použij EasyOCR model
text = ocr_handwritten(image_path)
print("OCR zpracování dokončeno.")

# Ulož výsledky do souboru
with open('ocr_handwritten.log', 'w', encoding='utf-8') as log_file:
    log_file.write(text)
    print("Výsledky uloženy do 'ocr_handwritten.log'.")