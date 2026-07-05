# FoodLens Zehar 🔎 👵 👨‍⚕️

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FAnilkumawat01%2Ffoodlens-zehar)

FoodLens Zehar is an offline-first, highly interactive, and gamified wellness application designed to expose the chemical, ultra-processing, and nutritional realities of packaged Indian snacks. By utilizing humorous, dramatic "roasting" personas, it translates complex ingredients and E-number chemical additives into straightforward, digestible warnings.

---

## 🚀 Key Features

*   **Offline-First Lookup & Scan:** Instantly fetch nutritional details, ingredients, and roasts for popular preset products without requiring network connectivity.
*   **Camera Barcode Scanner:** Real-time barcode decoding from live video feeds using `@ericblade/quagga2`.
*   **Multilingual Persona Roasts:** Get feedback on snacks from five distinct character voices in either English or Hinglish:
    *   👵 **Indian Mom:** Standard Indian maternal guilt-tripping.
    *   👨‍⚕️ **Dramatic Doctor:** Hyperbolic warnings about internal systems going on strike.
    *   🎤 **Stand-up Comedian:** Satirical breakdowns of corporate ingredients.
    *   🤓 **Professor:** Academic explanations of chemical structures and lipid matrices.
    *   📣 **News Anchor:** Sensationalized breaking news reporting directly from your gut.
*   **Chemical Additives Decoder:** Clickable E-number additive chips (like E621, E150d, E338) that translate chemical names and list safety levels (*Avoid, Moderate, Safe*) locally.
*   **Custom Scan Fallbacks:** Scan custom barcodes or search custom items. If the remote database is offline, the app handles it gracefully using structured fallback details.
*   **Gemini AI Live Mode:** Plug in a Gemini Developer API Key in the Settings tab to run live AI analysis on custom items and generate dynamic roasts based on your physical health profile (e.g. fitness, diabetic, hypertensive).
*   **Shareable Toxicity Cards:** Generates a visually stunning, story-sized summary card of the snack roast and saves it as a PNG or copies it to your clipboard using `html2canvas` for quick social media sharing.

---

## 🛠️ Technology Stack

*   **Frontend Core:** React 19, JavaScript (ES6+), HTML5
*   **Styling & Theme:** Vanilla CSS3 (Custom Glassmorphic Dark UI Theme)
*   **Local Barcode Processing:** `@ericblade/quagga2`
*   **AI Integration:** Gemini API via `@google/generative-ai`
*   **Image Exporter:** `html2canvas`
*   **Icon Library:** `lucide-react`
*   **Build Tool & Dev Server:** Vite 8

---

## 📂 Project Directory Structure

```
capstone-project/
├── public/                  # Static assets and icons
├── src/
│   ├── assets/              # Graphics and local images
│   ├── components/          # React components
│   │   ├── Scanner.jsx      # Barcode scanning, search interface & presets
│   │   ├── ResultView.jsx   # Result charts, roasts, and E-number decoder
│   │   ├── HistoryView.jsx  # Ledger tracking scanned product history
│   │   ├── ProfileView.jsx  # Health profile manager (diabetic, fitness, etc.)
│   │   └── SettingsView.jsx # Live AI Mode configurations (API key setup)
│   ├── utils/               # Utility modules
│   │   ├── geminiApi.js     # Live Gemini AI API integration calls
│   │   ├── mockData.js      # Local Indian snack database & preset roasts
│   │   └── openFoodFacts.js # Open Food Facts REST API client
│   ├── App.jsx              # Core application router and state coordinator
│   ├── App.css              # Device wrappers & layout styles
│   ├── index.css            # Base typography & CSS custom variables design system
│   └── main.jsx             # React DOM application mount point
├── index.html               # Main entry HTML file
├── package.json             # Manifest file with dependencies and run scripts
├── vercel.json              # Serverless routing and API proxies
└── vite.config.js           # Vite dev server and proxy definitions
```

---

## ⚡ Quick Start Guide

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed (version 18+ recommended).

### 1. Clone & Install Dependencies
```bash
git clone <repository-url>
cd capstone-project
npm install
```

### 2. Run the Development Server
```bash
# On Windows PowerShell, to bypass execution policy blocks, run via cmd:
cmd /c npm run dev
# Or run standard script on other shells:
npm run dev
```
Open (https://capstone-p7sgiw4vc-anil01.vercel.app/) in your web browser.

### 3. Build for Production
To generate a production-ready, highly optimized static build in the `dist` folder:
```bash
npm run build
```

---

## 🔒 Offline & Privacy Architecture

FoodLens Zehar does not transmit your personal physical health profiles or scanned preset snacks to any server. 

```
[User Profile / Presets] ────> Saved in LocalStorage (On-Device Only)
[Barcode Presets] ─────────> Checked against local mockData.js (No API Calls)
[E-Number Additives] ──────> Read from local dictionary (No API Calls)
```

For custom items (where the barcode is not in the preset list):
- If **API Key is absent:** App generates a comedic generic roast locally.
- If **API Key is present:** App queries Gemini API directly from the client's browser using the provided developer key.

---

## 📄 License
This project is licensed under the MIT License - see the LICENSE file for details.
