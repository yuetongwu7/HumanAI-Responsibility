# HumanAI-Responsibility

## Project Overview
A research tool for categorizing and recording data about studies involving AI and human attribution. Researchers ("coders") use this tool to answer structured questions about studies and export their responses as CSV.

## Tech Stack
- **Frontend:** Pure HTML5, CSS3, and Vanilla JavaScript (single `index.html` file)
- **Storage:** Browser `localStorage` (key: `aiCodingDataset`)
- **Data Export:** CSV download via Blob/URL.createObjectURL
- **Server (dev):** Python's built-in HTTP server on port 5000

## Project Layout
```
index.html    - Entire application (UI, styles, logic)
README.md     - Project title
.replit       - Replit environment config
```

## Running Locally
The workflow "Start application" serves the static site using:
```
python3 -m http.server 5000
```

## Deployment
Configured as a **static** deployment with `publicDir: "."`.
