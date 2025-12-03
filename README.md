# CS1710FP
This is our CS1710 Final Project html repository for the 2025 Final Project. 

Our link to the published project website is here: 
https://catherineanme.github.io/CS1710FP/

You may find our dataset in this github repository under the file name: 
[namibia_election_results.xlsx](https://github.com/catherineanme/CS1710FP/blob/main/namibia_election_results.xlsx)

You may find our data information file under the name: 
[datadescription.md](https://github.com/catherineanme/CS1710FP/blob/main/datadescription.md)

You may find our video at this YouTube private unlisted link: 
FILL IN

You may find our Process Book throughout the various milestones of this project at this open Google Doc link: 
https://docs.google.com/document/d/1pW_gdDB3F231XNcuoE8zqqxzXGftUiIOpmafbTzGC5M/edit?usp=sharing

FINALLY, here is an explanation on how to run our code, what libraries we used, and other information about this project: 

---

## How to Run This Project

### Prerequisites
- A modern web browser (Chrome, Firefox, Safari, or Edge)
- A local web server (required because the project fetches data files)

### Running the Project

**Option 1: Using Python (Recommended)**
```bash
# Download the project from GitHub and navigate to the project directory
cd "./CS1710FP"

# Python 3
python3 -m http.server 8000

# Then open http://localhost:8000 in your browser
```

**Option 2: Using VS Code Live Server**
1. Install the "Live Server" extension in VS Code
2. Open the project folder
3. Right-click `index.html` → "Open with Live Server"

**Option 3: Using Node.js**
```bash
npx serve
```

> ⚠️ **Important:** You cannot simply open `index.html` directly in a browser by double-clicking. The application uses `fetch()` to load the GeoJSON data, which requires a local server due to CORS restrictions.

---

## Libraries & Technologies Used

| Library | Version | Purpose |
|---------|---------|---------|
| **D3.js** | v7 | Data-driven visualizations including bar charts, beeswarm plots, heatmaps, and treemaps |
| **Leaflet** | v1.9.4 | Interactive geographic maps with choropleth constituency visualizations |
| **SheetJS (XLSX)** | v0.18.5 | Excel file parsing capabilities |
| **Vanilla JavaScript** | ES6+ | Presentation navigation, data processing, and interactivity |
| **CSS3** | - | Custom styling with CSS variables, gradients, animations, and responsive design |

---


