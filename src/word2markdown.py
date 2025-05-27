from docx import Document

def docx_to_markdown(docx_file, markdown_file):
    """
    Převádí soubor .docx na Markdown.
    
    :param docx_file: Cesta k .docx souboru.
    :param markdown_file: Cesta k výstupnímu Markdown souboru.
    """
    # Načtení .docx souboru
    document = Document(docx_file)
    markdown_lines = []

    # Iterace přes odstavce v dokumentu
    for paragraph in document.paragraphs:
        text = paragraph.text.strip()
        if not text:
            continue  # Přeskočí prázdné odstavce

        # Přidání nadpisů podle stylu
        if paragraph.style.name.startswith("Heading"):
            level = int(paragraph.style.name.split()[-1])  # Získá úroveň nadpisu
            markdown_lines.append(f"{'#' * level} {text}")
        else:
            markdown_lines.append(text)

    # Uložení do Markdown souboru
    with open(markdown_file, "w", encoding="utf-8") as md_file:
        md_file.write("\n\n".join(markdown_lines))

    print(f"Převod dokončen. Markdown uložen do: {markdown_file}")

# Použití
if __name__ == "__main__":
    input_docx = "template_original/bara.docx"  # Cesta k vašemu .docx souboru
    output_md = "template_output/bara.md"     # Cesta k výstupnímu Markdown souboru
    docx_to_markdown(input_docx, output_md)