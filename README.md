# Exam Revision Hub

A private, local-only exam-revision website for a small study group — 5 subjects, 31 chapters, 249 topics.
No backend, no login, no deployment. Progress is stored only in your browser (localStorage).

## Run

```bash
npm install
npm run dev        # http://localhost:5173
```

Other commands:

```bash
npm run build      # production build into dist/ (works offline; view with `npm run preview`)
npm test           # 23 tests: data integrity, search, store, validators, page rendering (all 249 topics)
npm run validate   # syllabus + content validators
npm run status     # rewrites CONTENT_PROGRESS.md / TASKS.md / PROJECT_STATE.md from real data
```

## Features
Home dashboard (continue, recent, bookmarks, subject progress, quick revision) · Subject → Chapter → Topic pages · full revision lesson per topic ·
Rapid Revision per subject · Chapter Revision per chapter · Exam Mode (saved) · global search · bookmarks · completion tracking ·
knowledge checks with Correct / Wrong / Score (saved) · comparison tables · text diagrams · collapsible answers.

## Layout
```
src/data/syllabus/   syllabus structure (subjects.json + ai/aws/daa/epj/toc.json)   <- from your syllabus screenshots
src/data/content/    lesson content keyed by topic id (one file per subject)
src/lib/             data loader, localStorage store, search
src/*.jsx            UI
scripts/             validators + status tools
tests/               vitest tests
tools/               Python generators used to author content (not needed to run the app)
SYLLABUS.md  CONTENT_PROGRESS.md  PROJECT_STATE.md  TASKS.md
```

## Honesty notes
* Content status is **GENERATED**, not VALIDATED. The validator checks structure and coverage (every topic has every required field, ids unique, MCQ answers match their options). **It cannot check academic correctness.** Review lessons against your class notes before relying on them.
* Double-check against your teacher's notes: AI Ch7 "Perception-Qualitative Analysis" (interpreted as perceptron analysis) and "Two case studies on expert systems" (MYCIN and DENDRAL chosen; the syllabus names none); AWS prices/limits that can change; EPJ code uses `javax.servlet` (Tomcat 9) - Tomcat 10+/Jakarta needs `jakarta.servlet`.
