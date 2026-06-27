<div align="center">

<img src="public/logo.png" alt="Career Navigator Logo" width="80" height="80" />

# 🧭 AI Career Navigator

### Skill Gap Analysis & Personalized Learning Roadmap Generator

[![Live Demo](https://img.shields.io/badge/🚀_Live_Demo-career--navigator--app.netlify.app-6366f1?style=for-the-badge)](https://career-navigator-app.netlify.app)
[![GitHub](https://img.shields.io/badge/GitHub-Aditya--dxt%2Fcareer--navigator-181717?style=for-the-badge&logo=github)](https://github.com/Aditya-dxt/career-navigator)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-5-646CFF?style=for-the-badge&logo=vite)](https://vitejs.dev)
[![Netlify](https://img.shields.io/badge/Deployed_on-Netlify-00C7B7?style=for-the-badge&logo=netlify)](https://career-navigator-app.netlify.app)

**Upload your resume. Paste any LinkedIn/Indeed JD. Get your exact skill gaps + a week-by-week roadmap — instantly, 100% in your browser.**

![Demo Preview](public/demo.gif)

</div>

---

## ✨ What It Does

Most students know their resume is weak. They don't know *exactly why* or *what to fix first*.

**AI Career Navigator** solves this by:
1. Parsing your resume for every technical skill you have
2. Comparing it against your target role (predefined or a **custom pasted JD** from any job posting)
3. Identifying your exact gaps — ranked by priority (Critical / Important / Nice-to-have)
4. Generating a **personalized, week-by-week 8-week learning roadmap** with free resources and mini-projects tailored to *your* specific gaps

Zero cloud dependency. Zero API costs. Runs entirely in your browser.

---

## 🚀 Live Demo

> **[career-navigator-app.netlify.app](https://career-navigator-app.netlify.app)**

Try it with your own resume + paste any JD from LinkedIn or Internshala!

---

## 🎯 Features

| Feature | Description |
|---|---|
| 📄 **Resume Upload** | Drag-and-drop PDF/text resume upload with animated success state |
| 🎯 **Role Selector** | 6 pre-defined tech roles — SWE, AI/ML, DevOps, Data Science, Frontend, Backend |
| 📋 **Custom JD Paste** | Paste *any* LinkedIn / Indeed / Internshala job description for exact matching |
| 🧠 **Skill Extraction** | Custom word-boundary RegEx engine extracts 100+ skills from your resume text |
| 📊 **Gap Analysis** | Side-by-side skill comparison with Critical / Important / Nice-to-have priority tiers |
| 🏆 **Readiness Score** | Animated circular progress ring showing your % job readiness for the target role |
| 🗺️ **8-Week Roadmap** | Personalized week-by-week plan: what to learn, how to learn it, free resources, mini-projects |
| 📤 **PDF Export** | Native, beautiful A4-paginated PDF export via custom print stylesheets |
| 💻 **100% Client-Side** | Custom NLP engine runs entirely in your browser — no API, no backend, no cost |

---

## 🖥️ App Flow

```
Step 1: Upload Resume    →    Step 2: Choose Target    →    Step 3: AI Analysis    →    Step 4: Dashboard
  (PDF or Text)               (Role or Custom JD)           (Skill Parsing)           (Gaps + Roadmap)
```

The 4-step progress flow with smooth transitions takes you from resume to actionable roadmap in under 30 seconds.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | React 18 + Vite 5 |
| **Styling** | Custom CSS — Glassmorphism, CSS Gradients, Keyframe Animations |
| **Icons** | Lucide React |
| **Parsing Engine** | Custom word-boundary RegEx + context-aware scoring algorithm |
| **PDF Export** | Native browser print API with `@media print` stylesheets |
| **Deployment** | Netlify (CI/CD from GitHub main branch) |

### Why No AI API?
A deliberate architectural decision. Using a custom parsing engine means:
- **Zero cost** for every user, forever
- **Instant results** — no network round-trip latency
- **Full privacy** — your resume never leaves your browser
- **No rate limits** or API key management

---

## 💻 Running Locally

```bash
# 1. Clone the repository
git clone https://github.com/Aditya-dxt/career-navigator.git
cd career-navigator

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev

# 4. Open in browser
# Navigate to http://localhost:5173
```

### Build for Production
```bash
npm run build
# Output in /dist — ready to deploy on Netlify, Vercel, or GitHub Pages
```

---

## 📁 Project Structure

```
career-navigator/
├── public/
│   ├── demo.gif              # Demo animation for README
│   └── logo.png              # App logo
├── src/
│   ├── components/
│   │   ├── UploadStep.jsx    # Step 1 — Resume drag-and-drop upload
│   │   ├── TargetStep.jsx    # Step 2 — Role selector + JD paste
│   │   ├── AnalysisStep.jsx  # Step 3 — Loading + skill parsing
│   │   └── Dashboard.jsx     # Step 4 — Results, gaps, roadmap, export
│   ├── data/
│   │   ├── skillDatabase.js  # 100+ skills mapped to roles
│   │   └── roadmapData.js    # Week-by-week roadmap templates
│   ├── utils/
│   │   └── parser.js         # Core RegEx + scoring engine
│   ├── App.jsx               # Root component + step state management
│   └── main.jsx              # Entry point
├── index.html
├── vite.config.js
├── package.json
└── README.md
```

---

## 🎨 UI Design Decisions

- **Dark-first aesthetic** — Deep `#0A0A0F` background, `#13131A` cards, purple/blue gradients
- **Glassmorphism cards** — `backdrop-filter: blur()` with subtle border glow
- **Animated starfield background** — CSS particle dots, zero JS overhead
- **Micro-animations** — Every interaction has hover lifts, pulse effects, and smooth transitions
- **Mobile responsive** — Full layout reflow for screens from 320px to 4K
- **Print-optimized PDF** — `@media print` stylesheet with A4 page breaks and clean layout

---

## 🗺️ Roadmap — Upcoming Features

- [ ] **Shareable results card** — Generate a LinkedIn-shareable image of your readiness score
- [ ] **Streak tracker** — Mark weeks as complete, track your learning progress
- [ ] **Company-specific JD presets** — Google, Microsoft, Flipkart JD templates
- [ ] **Multi-resume comparison** — Compare two versions of your resume against the same JD
- [ ] **AI explanation mode** — Connect Claude/OpenAI API to explain *why* each gap matters

---

## 🙋 About the Developer

**Aditya Dixit** — 3rd Year B.Tech CSE @ PSIT Kanpur | Full Stack & AI Developer

I built this because I was tired of vague resume advice. I wanted a tool that tells you *exactly* what's missing and *exactly* what to do next.

[![Portfolio](https://img.shields.io/badge/Portfolio-aditya--dixit.vercel.app-6366f1?style=flat-square)](https://aditya-dixit.vercel.app)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-aditya--dixit-0077B5?style=flat-square&logo=linkedin)](https://linkedin.com/in/aditya-dixit-085862333)
[![GitHub](https://img.shields.io/badge/GitHub-Aditya--dxt-181717?style=flat-square&logo=github)](https://github.com/Aditya-dxt)
[![Instagram](https://img.shields.io/badge/Instagram-@codeewithadityaa-E4405F?style=flat-square&logo=instagram)](https://instagram.com/codeewithadityaa)

---

## 📄 License

MIT License — free to use, fork, and build on.

---

<div align="center">

**If this helped you, drop a ⭐ on the repo — it means a lot!**

*Built with ❤️ by [Aditya Dixit](https://aditya-dixit.vercel.app)*

</div>
