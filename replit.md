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
Split-panel design (graduated from V1 – Information Hierarchy mockup):
- **Left sidebar** (dark slate #0f172a, 300px): Logo, metadata fields (Paper ID, Study ID, Coder Name), Optional Notes textarea, progress timeline showing answered/current/upcoming questions, dataset entry count footer
- **Right main area** (white): Sticky top bar with Save & Start New / Export CSV buttons; centered question area with question badge, large bold question text, card-style answer option buttons with radio indicators; sticky bottom bar with Back and Continue buttons

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
