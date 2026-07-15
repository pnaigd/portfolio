# My Dynamic Portfolio — Prian Andrei D. Gallardo

A responsive, JSON-driven personal portfolio website built as the final project for **Web Development 1**. The page is fully rendered by JavaScript from a single `data.json` file — adding a new project, skill, or education entry to the JSON automatically produces a new card on the page, with no HTML edits required.

---

## Live Preview

You can preview the site by opening `index.html` directly in a browser, or by serving the folder over HTTP (recommended, since `fetch()` requires an HTTP origin in most browsers):

```bash
# From the project root, any one of:
python3 -m http.server 8000
# then visit http://localhost:8000
```

If deployed to GitHub Pages or Vercel, no build step is needed — every file in this folder is static.

---

## Project Structure

The folder layout follows the conventions required by the project brief (`index.html`, `/css`, `/js`, `/assets`, `data.json`):

```
.
├── index.html              # Page shell + semantic structure (no hardcoded repeatable content)
├── data.json               # The single source of truth for all repeatable content
├── css/
│   └── style.css           # All styling, responsive breakpoints, mobile-first
├── js/
│   └── script.js           # Fetches data.json, renders every section, handles UI behavior
├── assets/
│   └── images/
│       ├── profile.svg     # Profile avatar (Home section)
│       ├── project-1.svg   # Task Slayer thumbnail
│       ├── project-2.svg   # UN.BOUND Design System thumbnail
│       ├── project-3.svg   # BuildWeb Landing Page thumbnail
│       └── project-4.svg   # This Portfolio thumbnail
└── README.md               # This file
```

---

## Required Sections

All sections required by the brief are present, and every one of them is rendered dynamically from `data.json`:

| # | Section | What's inside |
|---|---------|---------------|
| 1 | **Home / Introduction** | Profile photo, name, role, intro tagline, two CTAs, and a "code window" that prints the same hero data as a JSON snippet (signature visual). |
| 2 | **About Me** | Background, interests (as tag chips), why BSIT, and career goals — each in its own card. |
| 3 | **Skills** | Technical skills as cards with a level label and a colored progress bar (Beginner / Learning / Comfortable). Soft skills as pill tags. |
| 4 | **Projects** | 4 projects, each with a thumbnail image, category, title, description, tech tags, and a "View Project" link. |
| 5 | **Education** | Vertical timeline with period, school, program, year level, and a short experience blurb. |
| 6 | **Contact** | Email + social links, and a front-end-only contact form with inline validation and a status message. |

---

## Technical Requirements Coverage

### Responsiveness (Section 5.1)

- **Mobile-first** CSS: the default styles target small screens, with `min-width` media queries layering in tablet and desktop layouts.
- **Three breakpoints** are explicitly handled:
  - **Mobile** (~375–480px): single-column layouts, hamburger menu, stacked hero.
  - **Tablet** (~768px): 2-column About, 2-column Projects, horizontal nav.
  - **Desktop** (~1100px+): 6-column Skills grid, 2-column hero with the code window, 2-column Contact.
- **Relative units** everywhere: `rem`, `em`, `%`, `fr`, `vw` via `clamp()` for fluid typography.
- **Navigation adapts**: a hamburger menu on mobile, an inline nav bar on ≥768px, with active-section highlighting driven by `IntersectionObserver`.
- **Images scale**: `max-width: 100%` globally, `aspect-ratio` on project thumbnails to prevent layout shift.

### Dynamic Content / JSON Integration (Section 5.2)

- **All repeatable content** lives in `data.json`: navigation, personal info, about, skills, projects, education, contact.
- **No hardcoded repeatable HTML** — the HTML is just a shell with empty containers (`#projects-grid`, `#technical-skills`, `#education-timeline`, etc.) that JavaScript fills in.
- Loaded with the Fetch API: `fetch('data.json')` → `response.json()` → render functions.
- Adding a new project (or skill, or education entry) to `data.json` automatically produces a new card on the page — no HTML changes required.
- Graceful failure: if `data.json` fails to load, a user-facing message appears instead of a blank page.

### Code Quality (Section 5.3)

- **Semantic HTML5**: `header`, `nav`, `main`, `section`, `article`, `footer`, `form`, `label`.
- **Organized files**: `index.html` at root, `css/`, `js/`, `assets/images/`, `data.json`.
- **Commented CSS and JS**: every section is labeled, every non-obvious function has a JSDoc block explaining what it does and why.
- **Naming conventions**: BEM-ish class names, camelCase JS functions, kebab-case CSS classes.
- **Accessibility**: `aria-label` on the nav toggle, `aria-expanded` reflecting menu state, `aria-live` on the form status, `alt` text on every image, visible keyboard focus styles, `prefers-reduced-motion` honored.

---

## JSON Schema

The current `data.json` is a reasonable placeholder schema. It will be reviewed and refined in the WebDev 2 course; the structure today is intentionally simple and flat so it's easy to extend:

```jsonc
{
  "navigation": [{ "label": "...", "target": "sectionId" }],
  "personal":   { "fullName": "...", "role": "...", "photo": "...", "introduction": "..." },
  "about":      { "biography": "...", "background": "...", "interests": ["..."], "whyBSIT": "...", "careerGoals": "..." },
  "skills":     { "technical": [{ "name": "...", "level": "Learning|Beginner|Comfortable" }], "soft": ["..."] },
  "projects":   [{ "title": "...", "description": "...", "technologies": ["..."], "category": "...", "image": "...", "link": "..." }],
  "education":  [{ "school": "...", "program": "...", "yearLevel": "...", "period": "...", "experience": "..." }],
  "contact":    { "email": "...", "social": [{ "platform": "...", "url": "..." }] }
}
```

---

## How to Extend

- **Add a project**: append an object to the `projects` array in `data.json`. A new card appears automatically.
- **Add a skill**: append to `skills.technical` (use one of the recognized `level` values to get the right bar color) or `skills.soft`.
- **Add an education entry**: append to the `education` array. The timeline grows automatically.
- **Swap the profile photo**: replace `assets/images/profile.svg` (or point `personal.photo` at a different file).
- **Swap project thumbnails**: replace the files in `assets/images/`, or update the `image` field per project.

---

## Browser Support

Tested in current versions of Chrome, Firefox, and Safari. Uses standard, well-supported features only: Fetch API, `IntersectionObserver`, CSS Grid, Flexbox, `clamp()`, `aspect-ratio`, and CSS custom properties.

---

## Project Phases (per brief)

1. **Design** — color palette, typography, and per-section content drafted before code.
2. **Static Build** — full HTML/CSS built and made responsive (this is essentially what the shell in `index.html` + `css/style.css` represents).
3. **JSON Integration** — repeatable content moved into `data.json`; JS render functions written.
4. **Polish & Testing** — cross-device testing, accessibility pass, code cleanup, comments added.
5. **Submission** — this folder, this README, and a short walkthrough/demo.

---

## Notes

- The contact form is intentionally non-functional (no backend yet, per the brief). Submitting it shows a friendly status message and resets the fields.
- The "code window" in the hero is a deliberate signature element: it prints the same `name`/`role` data the page is rendering, reinforcing the JSON-driven concept of the site itself.
- Profile and project images are lightweight inline SVGs. They keep the folder tiny, scale crisply on retina screens, and match the dark theme — swap them for real photos or screenshots when ready.

---

&copy; Prian Andrei D. Gallardo
