# Career Navigator — Skill Gap Analysis & Learning Roadmap

Career Navigator is a smart, modern web application designed to help job seekers bridge the gap between their current skills and their dream roles. By instantly analyzing your resume against target job descriptions, the application identifies precise skill gaps and generates a personalized, week-by-week learning roadmap with highly curated resources and mini-projects.

## 🚀 Features

- **Instant Skill Extraction:** Paste your resume and let the smart local engine instantly extract your technical skills, programming languages, tools, and frameworks.
- **Role & JD Targeting:** Select from pre-defined popular tech roles (Software Engineer, AI/ML, DevOps, etc.) or paste a custom LinkedIn/Indeed Job Description for an exact match.
- **Precision Gap Analysis:** Compares your exact resume skills against the target role's critical, important, and nice-to-have requirements to identify precise gaps.
- **Generous Readiness Score:** Uses an encouraging grading curve to calculate how "Job Ready" you are, taking into account partial knowledge and general technical experience.
- **Personalized Roadmap:** Automatically generates a comprehensive week-by-week learning roadmap tailored exactly to the skills you are missing, complete with learning goals, free resources, and mini-projects.
- **Beautiful Export:** Export your complete career analysis and roadmap into a beautiful, crisp, native PDF document to keep on your local machine or print out.
- **100% Local Processing:** The text analysis and parsing engine runs entirely in your browser using a massive internal skill database. No external APIs or cloud dependencies required!

## 🛠️ Tech Stack

- **Frontend Framework:** React + Vite
- **Styling:** Custom CSS with Modern UI (Glassmorphism, CSS Gradients, Micro-animations)
- **Icons:** Lucide React
- **Parsing Engine:** Custom word-boundary RegEx + Context-aware scoring algorithm

## 💻 Running Locally

1. **Clone the repository:**
   ```bash
   git clone https://github.com/YourUsername/ai-career-navigator.git
   cd ai-career-navigator
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5173`

## 🎨 UI & UX Design

This project emphasizes a premium, highly-polished user experience:
- **Responsive Dashboard:** Scales beautifully from massive monitors down to mobile screens.
- **Dark Mode Aesthetics:** Deep navy/purple backgrounds (`#13131A`) paired with vibrant neon accents and soft glassmorphic cards.
- **Print Stylesheets (`@media print`):** A custom print layout specifically designed to render beautiful, A4-paginated PDF exports without layout breakage.

## 📝 License

This project is open-source and available under the MIT License.
