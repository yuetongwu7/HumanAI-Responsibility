# HumanAI-Responsibility

## Project Overview
A research tool for categorizing and recording data about studies involving AI and human attribution. Researchers ("coders") use this tool to answer structured questions about studies and export their responses as CSV.

## Tech Stack
- **Frontend:** Pure HTML5, CSS3, and Vanilla JavaScript (single `index.html` file)
- **Storage:** Browser `localStorage` (key: `aiCodingDataset`)
- **Data Export:** CSV download via Blob/URL.createObjectURL
- **Server (dev):** Python's built-in HTTP server on port 5000
- **Font:** Inter (Google Fonts)

## Layout
Split-panel design:
- **Left sidebar** (dark slate): Study metadata fields (Paper ID, Study ID, Coder Name), progress bar, live answers-so-far list, Save & Export actions
- **Right main area** (white): Question badge (Q1/N), question text, answer option buttons or text input

## Project Layout
```
index.html    - Entire application (UI, styles, logic) — Split Panel design
README.md     - Project title
.replit       - Replit environment config
artifacts/mockup-sandbox/  - UI prototype sandbox (React + Vite + Tailwind)
  src/components/mockups/coding-tool/
    SplitPanel.tsx      - Graduated design (now in production as index.html)
    FocusedWizard.tsx   - Alternative layout variant
    DenseTriage.tsx     - Alternative layout variant
```

## Running Locally
The workflow "Start application" serves the static site using:
```
python3 -m http.server 5000
```

## Questionnaire Logic
9 conditional questions (Yes/No/Unsure + specialized options). Selecting "No" on any Yes/No question jumps to review. Conditional questions shown/hidden based on prior answers. Answers persisted to localStorage.

## Deployment
Configured as a **static** deployment with `publicDir: "."`.
