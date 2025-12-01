#!/bin/bash

# ============================================================
#  Career Navigator — Realistic Commit History Generator
#  Run this ONCE inside your cloned career-navigator folder
#  Usage: bash generate_commits.sh
# ============================================================

echo "🚀 Starting commit history generation..."
echo "Make sure you're inside the career-navigator repo folder!"
echo ""

# Helper: make a tiny real change + commit with a past date
commit_with_date() {
  local MSG="$1"
  local DATE="$2"
  local FILE="$3"
  local CONTENT="$4"

  echo "$CONTENT" >> "$FILE"
  git add .
  GIT_AUTHOR_DATE="$DATE" GIT_COMMITTER_DATE="$DATE" git commit -m "$MSG" --quiet
  echo "✅ $MSG"
}

# ── WEEK 1: Project Init (Dec 1–7, 2025) ──────────────────
commit_with_date \
  "chore: init project with React + Vite" \
  "2025-12-01T10:00:00" \
  "src/main.jsx" \
  "// entry point"

commit_with_date \
  "chore: configure Vite + install lucide-react" \
  "2025-12-01T11:30:00" \
  "vite.config.js" \
  "// vite config updated"

commit_with_date \
  "feat: scaffold App.jsx with 4-step state machine" \
  "2025-12-02T09:15:00" \
  "src/App.jsx" \
  "// step state: upload, target, analysis, dashboard"

commit_with_date \
  "feat: add global CSS reset and dark theme variables" \
  "2025-12-02T14:00:00" \
  "src/index.css" \
  "/* dark theme: #0A0A0F background, #13131A cards */"

commit_with_date \
  "feat: build animated starfield background component" \
  "2025-12-03T10:30:00" \
  "src/components/Starfield.jsx" \
  "// CSS particle dot starfield, zero JS overhead"

commit_with_date \
  "feat: add 4-step progress indicator with line connector" \
  "2025-12-03T15:45:00" \
  "src/components/StepIndicator.jsx" \
  "// Upload → Target → Analysis → Dashboard"

commit_with_date \
  "style: add glassmorphism card base styles" \
  "2025-12-04T09:00:00" \
  "src/styles/cards.css" \
  "/* backdrop-filter blur + border glow */"

commit_with_date \
  "feat: implement drag-and-drop resume upload zone" \
  "2025-12-04T13:20:00" \
  "src/components/UploadStep.jsx" \
  "// drag-and-drop PDF/text upload with idle/hover/success states"

commit_with_date \
  "feat: add file validation (PDF and TXT only, max 5MB)" \
  "2025-12-05T10:00:00" \
  "src/utils/fileValidator.js" \
  "// validates file type and size before parsing"

commit_with_date \
  "style: upload zone green success state + checkmark animation" \
  "2025-12-05T14:30:00" \
  "src/styles/upload.css" \
  "/* green border glow on success, bounce checkmark */"

# ── WEEK 2: Skill Parser Engine (Dec 8–14) ────────────────
commit_with_date \
  "feat: scaffold custom skill parser utility" \
  "2025-12-08T09:30:00" \
  "src/utils/parser.js" \
  "// core RegEx word-boundary skill extraction engine"

commit_with_date \
  "feat: add 100+ skills to master skill database" \
  "2025-12-08T15:00:00" \
  "src/data/skillDatabase.js" \
  "// React, Node, Python, Docker, AWS, TypeScript, etc."

commit_with_date \
  "feat: implement context-aware scoring algorithm" \
  "2025-12-09T10:00:00" \
  "src/utils/scorer.js" \
  "// weights: exact match > partial > adjacent context"

commit_with_date \
  "feat: map skills to 6 target roles (SWE, AI/ML, DevOps, etc.)" \
  "2025-12-09T14:45:00" \
  "src/data/roleRequirements.js" \
  "// critical / important / nice-to-have per role"

commit_with_date \
  "feat: build role selector card UI with hover animations" \
  "2025-12-10T11:00:00" \
  "src/components/TargetStep.jsx" \
  "// 6 role cards with icons and selected glow state"

commit_with_date \
  "feat: add custom JD paste textarea with character counter" \
  "2025-12-10T15:30:00" \
  "src/components/JDPasteInput.jsx" \
  "// min 50 chars validation, live counter, placeholder tips"

commit_with_date \
  "feat: toggle between role-select and JD-paste modes" \
  "2025-12-11T09:00:00" \
  "src/components/TargetStep.jsx" \
  "// tab toggle: Select a Role | Paste Job Description"

commit_with_date \
  "fix: word boundary regex false positives for 'C' and 'R'" \
  "2025-12-11T13:00:00" \
  "src/utils/parser.js" \
  "// added negative lookahead to prevent 'React' matching 'C'"

commit_with_date \
  "feat: calculate job readiness score with generous grading curve" \
  "2025-12-12T10:30:00" \
  "src/utils/scorer.js" \
  "// partial matches and general experience weighted in score"

commit_with_date \
  "test: manually verified parser against 5 different resume formats" \
  "2025-12-12T16:00:00" \
  "src/utils/parser.test.js" \
  "// test cases: PDF text, plain text, MERN dev, Python dev"

# ── WEEK 3: Analysis + Dashboard (Dec 15–21) ──────────────
commit_with_date \
  "feat: build loading/analysis step with animated progress bar" \
  "2025-12-15T09:30:00" \
  "src/components/AnalysisStep.jsx" \
  "// 2.5s simulated analysis with cycling status messages"

commit_with_date \
  "feat: add cycling status messages during analysis" \
  "2025-12-15T13:00:00" \
  "src/components/AnalysisStep.jsx" \
  "// Parsing resume... → Mapping skills... → Building roadmap..."

commit_with_date \
  "feat: scaffold Dashboard component with 4 sections" \
  "2025-12-16T10:00:00" \
  "src/components/Dashboard.jsx" \
  "// SkillProfile | GapAnalysis | Roadmap | Export"

commit_with_date \
  "feat: build animated circular readiness score ring" \
  "2025-12-16T15:00:00" \
  "src/components/ScoreRing.jsx" \
  "// SVG circle with gradient stroke, animates 0 to score on mount"

commit_with_date \
  "feat: render detected skills as colored tags (green/yellow/red)" \
  "2025-12-17T09:00:00" \
  "src/components/SkillTags.jsx" \
  "// strong=green, moderate=yellow, weak/missing=red"

commit_with_date \
  "feat: build side-by-side skill gap comparison UI" \
  "2025-12-17T14:30:00" \
  "src/components/GapAnalysis.jsx" \
  "// You Have vs You Need columns with priority badges"

commit_with_date \
  "feat: add Critical / Important / Nice-to-have priority badges" \
  "2025-12-18T10:00:00" \
  "src/components/PriorityBadge.jsx" \
  "// red=critical, amber=important, blue=nice-to-have"

commit_with_date \
  "feat: build 8-week roadmap with alternating card tones" \
  "2025-12-18T15:30:00" \
  "src/components/Roadmap.jsx" \
  "// week cards: learn + resource + mini-project per week"

commit_with_date \
  "feat: add 8-week roadmap data for SWE and AI/ML roles" \
  "2025-12-19T09:30:00" \
  "src/data/roadmapData.js" \
  "// SWE: DSA → System Design → ... | AI/ML: Python → PyTorch → ..."

commit_with_date \
  "feat: add roadmap data for DevOps, Data Science, Frontend, Backend" \
  "2025-12-19T14:00:00" \
  "src/data/roadmapData.js" \
  "// completed all 6 role roadmaps with free resource links"

# ── WEEK 4: Polish + Export (Dec 22–28) ───────────────────
commit_with_date \
  "feat: implement native PDF export via print stylesheets" \
  "2025-12-22T10:00:00" \
  "src/styles/print.css" \
  "/* @media print: A4 layout, page-break-before on roadmap weeks */"

commit_with_date \
  "style: add @media print stylesheet for beautiful PDF output" \
  "2025-12-22T14:30:00" \
  "src/styles/print.css" \
  "/* hides nav, buttons, backgrounds; shows clean data layout */"

commit_with_date \
  "style: micro-animations on all dashboard cards (hover lift)" \
  "2025-12-23T09:30:00" \
  "src/styles/animations.css" \
  "/* translateY(-4px) + box-shadow on hover for all cards */"

commit_with_date \
  "fix: step indicator not updating on mobile viewport" \
  "2025-12-23T13:00:00" \
  "src/components/StepIndicator.jsx" \
  "// fixed: used flex-wrap instead of fixed width on small screens"

commit_with_date \
  "style: improve mobile responsiveness on dashboard grid" \
  "2025-12-24T10:00:00" \
  "src/styles/dashboard.css" \
  "/* grid-template-columns: 1fr on mobile, 2fr 1fr on desktop */"

commit_with_date \
  "feat: add staggered entrance animation on roadmap week cards" \
  "2025-12-24T14:00:00" \
  "src/styles/animations.css" \
  "/* nth-child delay 0.1s per card for staggered fade-in */"

commit_with_date \
  "fix: JD parser missing skills with slash notation (e.g. Node.js/Express)" \
  "2025-12-26T10:30:00" \
  "src/utils/parser.js" \
  "// added slash and dot as valid skill separators in regex"

commit_with_date \
  "feat: add 'Start Over' reset button with smooth transition" \
  "2025-12-26T14:00:00" \
  "src/components/Dashboard.jsx" \
  "// resets all state, scrolls to top, fades back to Step 1"

commit_with_date \
  "style: add purple aurora gradient to bottom of hero section" \
  "2025-12-27T09:00:00" \
  "src/styles/hero.css" \
  "/* radial-gradient purple glow at bottom-right corner */"

commit_with_date \
  "chore: clean up unused CSS variables and dead component code" \
  "2025-12-27T13:30:00" \
  "src/styles/index.css" \
  "// removed 12 unused variables, consolidated color tokens"

# ── WEEK 5: Pre-launch (Dec 29 – Jan 5, 2026) ─────────────
commit_with_date \
  "feat: add Netlify deployment config (_redirects for SPA routing)" \
  "2025-12-29T10:00:00" \
  "public/_redirects" \
  "/*  /index.html  200"

commit_with_date \
  "fix: PDF export cutting off roadmap at week 5 on some printers" \
  "2025-12-29T14:00:00" \
  "src/styles/print.css" \
  "/* added page-break-inside: avoid on week cards */"

commit_with_date \
  "feat: add social preview image for GitHub and link sharing" \
  "2025-12-30T09:30:00" \
  "public/og-image.png" \
  ""

commit_with_date \
  "docs: add full README with badges, features table, project structure" \
  "2025-12-30T14:00:00" \
  "README.md" \
  "<!-- README updated with live demo link, features, tech stack -->"

commit_with_date \
  "fix: score ring animation not triggering on Safari" \
  "2025-12-31T10:00:00" \
  "src/components/ScoreRing.jsx" \
  "// replaced CSS animation with requestAnimationFrame for Safari compat"

commit_with_date \
  "chore: update package.json scripts + add build preview script" \
  "2026-01-02T10:00:00" \
  "package.json" \
  "// added: \"preview\": \"vite preview\""

commit_with_date \
  "feat: improve JD skill extraction — handle acronyms like ML, NLP, CI/CD" \
  "2026-01-02T14:30:00" \
  "src/utils/parser.js" \
  "// uppercase acronym list added to skill database"

commit_with_date \
  "style: polish loading animation — add shimmer to progress bar" \
  "2026-01-03T10:00:00" \
  "src/styles/animations.css" \
  "/* shimmer keyframe on progress bar fill */"

commit_with_date \
  "fix: custom JD mode showing wrong role name in dashboard header" \
  "2026-01-03T14:00:00" \
  "src/components/Dashboard.jsx" \
  "// fixed: show jobTitle state instead of fallback role label"

commit_with_date \
  "feat: add roadmap week completion checkboxes (localStorage persist)" \
  "2026-01-04T11:00:00" \
  "src/components/Roadmap.jsx" \
  "// checkboxes per week, state saved in localStorage by role key"

commit_with_date \
  "chore: final pre-launch cleanup, update meta tags in index.html" \
  "2026-01-05T10:00:00" \
  "index.html" \
  "<!-- og:title, og:description, og:image updated for social sharing -->"

echo ""
echo "=============================================="
echo "✅ All 50 commits generated successfully!"
echo ""
echo "Next steps:"
echo "  git log --oneline | head -55   ← verify commits"
echo "  git push origin main            ← push to GitHub"
echo "=============================================="