# AI Psychologist Project

## Overview
This project implements an AI psychologist that interacts with users and processes data. It utilizes a local AI model to provide responses and insights.

## Project Structure
```
ai-psychologist
├── src
│   ├── talk_ai.py        # Contains the core structure for the AI psychologist.
│   └── run_model.py      # Script to run the AI model using the command `ollama run gemma3:12b`.
├── requirements.txt      # Lists the dependencies required for the project.
└── README.md             # Documentation for the project.
```

## Installation
To set up the project, follow these steps:

1. Clone the repository:
   ```
   git clone <repository-url>
   cd ai-psychologist
   ```

2. Install the required dependencies:
   ```
   pip install -r requirements.txt
   ```

## Usage
To run the AI model, execute the following command in the terminal:
```
python src/run_model.py
```

This will start the AI model and allow for interaction.

## Contributing
Contributions are welcome! Please submit a pull request or open an issue for any suggestions or improvements.

## License
This project is licensed under the MIT License. See the LICENSE file for details.