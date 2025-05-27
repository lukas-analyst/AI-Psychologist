import subprocess
import os

def load_file(file_name):
    """Načte obsah souboru."""
    try:
        script_dir = os.path.dirname(os.path.abspath(__file__))
        file_path = os.path.join(script_dir, file_name)
        with open(file_path, "r", encoding="utf-8") as file:
            return file.read()
    except FileNotFoundError:
        return f"Chyba: Soubor '{file_name}' nebyl nalezen. Ujistěte se, že existuje ve správném adresáři."

def create_prompt(input_text):
    """Vytvoří prompt kombinací technické role a šablony."""
    role_description = load_file("technical_prompt.txt")
    template = load_file("template.txt")
    if "Chyba" in role_description or "Chyba" in template:
        return role_description if "Chyba" in role_description else template

    full_prompt = f"{role_description}\n\n{template}\n\n### Vstupní text:\n{input_text}\n\n### Výstup:"
    return full_prompt

def run_model_with_prompt(input_text):
    """Spustí model s vytvořeným promptem."""
    prompt = create_prompt(input_text)
    if "Chyba" in prompt:
        return prompt  # Vrátí chybu, pokud se nepodařilo načíst soubory

    command = ["ollama", "run", "gemma3:12b", "--prompt", prompt]
    try:
        result = subprocess.run(command, capture_output=True, text=True, check=True)
        return result.stdout.strip()
    except subprocess.CalledProcessError as e:
        return f"Error running model: {e.stderr.strip()}"

def main():
    """Hlavní funkce pro interakci s uživatelem."""
    print("Vítejte! Toto je AI Psycholog.")
    print("Zadejte svůj text nebo napište 'konec' pro ukončení.")
    
    while True:
        user_input = input("Vy: ")
        if user_input.lower() == "konec":
            print("Děkujeme za použití AI Psychologa. Nashledanou!")
            break
        
        response = run_model_with_prompt(user_input)
        print("AI Psycholog:", response)

if __name__ == "__main__":
    main()