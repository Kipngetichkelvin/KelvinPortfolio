# Kelvin Kipngetich Kiplangat — Developer Portfolio

A fast, responsive, single-page portfolio for **Kelvin Kipngetich Kiplangat**, a software
developer and web developer based in Kenya. The site presents his practical work, technical
skills and contact details in a clean, accessible, dark-themed interface.

Built with plain **HTML5, CSS3 and vanilla JavaScript** — no frameworks, no build step, no
dependencies. It runs from a static file host and is ready for GitHub Pages.

- **Live URL (GitHub Pages):** <https://kipngetichkelvin.github.io/KelvinPortfolio/>
- **GitHub profile:** <https://github.com/Kipngetichkelvin>
- **Email:** <mailto:kelvinkipngetich052@gmail.com>
- **Phone:** <tel:+254725970882> (+254 725 970 882)

---

## Overview

| Item | Detail |
| --- | --- |
| Owner | Kelvin Kipngetich Kiplangat |
| Headline | Software Developer \| Web Developer \| Technology Enthusiast |
| Hero headline | Building Practical Digital Solutions Through Code. |
| Type | Single-page static portfolio |
| Stack | HTML5, CSS3 (custom properties), vanilla JavaScript (IIFE, `defer`) |
| Build step | None |
| Deployment | Any static host; configured for GitHub Pages |
| Repository path | `/KelvinPortfolio/` |

---

## Page structure

The navigation and the page use the same order: **Home → Projects → Skills → About → Contact**.

| # | Section | Anchor | Contents |
| --- | --- | --- | --- |
| 1 | Hero | `#home` | Name, headline, short professional intro, portrait photo, "View My Projects" and "Contact Me" buttons, focus strip of core technologies |
| 2 | Projects | `#projects` | GreenHarvest Avocado Farm System (featured, links to GitHub) and Student Management System (Python, no public link) |
| 3 | Skills | `#skills` | Python, C, HTML, CSS, JavaScript, database management, networking, computer applications, software engineering fundamentals, problem-solving — grouped in three cards, text only, no ratings or percentages |
| 4 | About | `#about` | Development-focused introduction, how he approaches problems, commitment to continuous improvement, second photo, quick facts card |
| 5 | Contact | `#contact` | Email, phone, location, GitHub — each an actionable link — plus an accessible contact form |
| — | Footer | — | Brand, section links, social links (GitHub), dynamic copyright year, back-to-top control |

---

## File structure

```
KelvinPortfolio/
├── index.html                      # The whole page: head, header, 5 sections, footer
├── README.md                       # This file
├── css/
│   ├── style.css                   # Design tokens, layout, components, 3D surfaces (source of truth)
│   └── responsive.css              # Breakpoints: mobile drawer, touch fallback, reduced motion, print
├── js/
│   └── main.js                     # One IIFE: nav, scroll-spy, reveal, pointer tilt, email, form, year
└── images/
    ├── favicon.svg                 # Site icon (SVG, scales cleanly)
    ├── kelvin-portrait-studio.jpg  # Hero portrait — seated, full body, studio backdrop
    ├── kelvin-portrait-headshot.jpg # About portrait — head-and-shoulders, outdoor
    ├── WhatsApp Image 2026-10-22 at 1.21.31 AM.jpeg # Original source photo (untouched)
    ├── WhatsApp Image 2026-10-22 at 1.22.50 AM.jpeg # Original source photo (untouched)
    ├── my profile                  # Empty placeholder file (0 bytes)
    └── my profile 2                # Empty placeholder file (0 bytes)
```

### Notes on the image folder

- The two `kelvin-portrait-*.jpg` files are **URL-safe copies** made from the two original
  WhatsApp exports. The originals are still present and were not renamed, moved or modified.
  The copies exist because the original filenames contain spaces and mixed case, which are
  fragile in URLs and on GitHub Pages.
- `my profile` and `my profile 2` are **0-byte files** — they contain no image data and are not
  referenced anywhere. They can be deleted safely with
  `git rm "images/my profile" "images/my profile 2"` if you want to tidy the repository.
- No stock photography is used. Both portraits are genuine photographs of Kelvin.

### Where each photo appears

| Photo | Section | Element | Intrinsic size | Crop behaviour |
| --- | --- | --- | --- | --- |
| `images/kelvin-portrait-studio.jpg` | Hero (`#home`) | `.portrait-card` → `.portrait-frame` → `.portrait-photo` | `900 × 1125` (4:5) | `object-fit: cover`, `object-position: center 30%` — keeps the subject and the space above his head |
| `images/kelvin-portrait-headshot.jpg` | About (`#about`) | `.facts-card` → `.about-photo` → `img` | `800 × 800` (1:1) | `aspect-ratio: 1 / 1`, `object-fit: cover`, `object-position: center 35%` |

Both `<img>` elements carry explicit `width`/`height` attributes to reserve layout space and
prevent cumulative layout shift, plus descriptive `alt` text. The hero image uses
`loading="eager"` (it is above the fold); the About image uses `loading="lazy"`.

---

## Design system

All design decisions live as CSS custom properties at the top of `css/style.css`.

- **Colour:** deep navy surfaces (`#0a1017`, `#0d1622`, `#111c2c`, `#16233a`) with an emerald
  accent (`#37d399`) and a blue secondary accent (`#4c9bff`).
- **Typography:** `Sora` for display/headings, `Inter` for body text, loaded from Google Fonts
  with `preconnect`. Headings scale fluidly with `clamp()`.
- **Spacing and shape:** a single radius scale (`8px → 28px`), a `1140px` max content width,
  consistent gutters, and a fixed `72px` header height.
- **Motion:** a shared `--transition: 200ms ease` for hover/focus states, plus a subtle
  `IntersectionObserver`-driven reveal animation. Cards and the hero portrait also carry a
  CSS 3D layer (perspective tilt, `translateZ()` depth plates, layered shadows) described in
  [3D effects](#3d-effects). Reveal, float and tilt are all disabled under
  `prefers-reduced-motion: reduce`.

### Accessibility

- Semantic landmarks: `header`, `nav`, `main`, `section`, `aside`, `footer`.
- A "skip to content" link is the first focusable element.
- `aria-label`s on navs, the brand link and the back-to-top button; `aria-labelledby` on sections.
- Visible focus rings driven by the `--focus` token; nothing relies on colour alone.
- Form labels are real `<label>` elements; errors use `aria-invalid`, `aria-describedby` and a
  `role="status"` live region.
- Decorative SVGs and the project media panels use `aria-hidden="true"` and `focusable="false"`.
- External links announce that they open in a new tab via screen-reader-only text.

---

## JavaScript configuration (`js/main.js`)

Everything configurable sits in one `CONFIG` object at the top of the file:

```js
const CONFIG = {
  CONTACT_EMAIL: 'kelvinkipngetich052@gmail.com',
  FORM_ENDPOINT: '',
  GITHUB_PROFILE: 'https://github.com/Kipngetichkelvin',
  LINKEDIN_PROFILE: ''
};
```

| Key | Current value | Effect |
| --- | --- | --- |
| `CONTACT_EMAIL` | `kelvinkipngetich052@gmail.com` | Renders the email row as a live `mailto:` link and adds a **Copy email** button with feedback. When set, the address is also filled into the static markup in `index.html`, so it still works with JavaScript disabled. |
| `FORM_ENDPOINT` | `''` (empty) | While empty, the contact form falls back to composing a `mailto:` message. Set it to a form-service URL (Formspree, Getform, Basin, etc.) to submit over `fetch`/`POST` instead. |
| `GITHUB_PROFILE` | `https://github.com/Kipngetichkelvin` | Used by the footer/social link renderer. |
| `LINKEDIN_PROFILE` | `''` (empty) | When empty, no LinkedIn link is rendered. Fill it in to add one. |

Nothing sensitive is stored in the repository. No API keys, tokens or private endpoints are used.

### What `main.js` handles

1. **Mobile navigation** — opens/closes the drawer, manages `aria-expanded`, traps and returns
   focus, closes on Escape, on link click and on resize past the desktop breakpoint.
2. **Scroll-spy** — highlights the nav link matching the section currently in view.
3. **Header state** — adds a condensed/scrolled class to the sticky header.
4. **Reveal animations** — `IntersectionObserver`; if the observer or JS is unavailable, all
   `.reveal` elements are shown immediately (no invisible content).
5. **Email slot** — builds the `mailto:` link and a copy-to-clipboard button, with a
   `document.execCommand` fallback for older browsers.
6. **Social links** — renders only the profiles that have a non-empty URL.
7. **Contact form** — client-side validation, inline errors, a honeypot, and either an endpoint
   POST or the `mailto:` fallback.
8. **Pointer tilt** — `requestAnimationFrame`-throttled `pointermove` writes `--rx` / `--ry`
   (and `--mx` / `--my` for the project sheen) on the six `[data-tilt]` elements, gated behind
   `(hover: hover) and (pointer: fine)` and skipped when reduced motion is requested.
9. **Copyright year** — injected so it never goes stale.

---

## Contact form behaviour

The form is honest about what it does. It includes a working `<button>` with no promise of
server-side delivery unless you configure one.

### Validation rules

| Field | Required | Rule |
| --- | --- | --- |
| Name | Yes | Non-empty after trimming |
| Email | Yes | Matches a standard `local@domain.tld` pattern |
| Subject | No | Free text; falls back to a default subject |
| Message | Yes | Non-empty, minimum length |
| `company-site` | — | Honeypot, visually hidden from users, `tabindex="-1"`, `aria-hidden="true"` |

### Delivery tiers

1. **Endpoint configured** (`FORM_ENDPOINT` set) — the form POSTs as JSON and reports success or
   failure from the response.
2. **No endpoint, JavaScript enabled** — the form opens the visitor's mail client with the
   subject and message pre-filled (`mailto:`). The page says so in the delivery note under the
   button, so nobody is misled into thinking a message was sent when it was not.
3. **No endpoint, JavaScript disabled** — the visible email address in the Contact section is a
   plain `mailto:` link and the phone number is a `tel:` link, so both remain usable.

If the honeypot is filled, the submission is silently discarded.

---

## Running the site locally

### Option 1 — VS Code Live Server (simplest)

1. Install the **Live Server** extension.
2. Right-click `index.html` → **Open with Live Server**.
3. It opens on something like `http://127.0.0.1:5500/index.html`.

### Option 2 — Python built-in server

```bash
cd KelvinPortfolio
python -m http.server 8000
```

Then visit <http://localhost:8000/>.

### Option 3 — Node

```bash
npx serve .
```

### Option 4 — Double-clicking `index.html`

The page will render, because all asset paths are relative. A local server is still preferred:
one or two browser security rules around clipboard access behave differently on `file://`.

---

## Deploying to GitHub Pages

The site is already compatible: relative paths, `index.html` at the repository root, no server
code, no environment variables.

1. Commit and push the files to the `main` branch of the `KelvinPortfolio` repository.
2. In GitHub, open **Settings → Pages**.
3. Under **Build and deployment**, set **Source** to *Deploy from a branch*.
4. Choose branch **main** and folder **/ (root)**, then **Save**.
5. Wait for the Pages build to finish (usually under a minute).
6. Visit <https://kipngetichkelvin.github.io/KelvinPortfolio/>.

Absolute URLs inside the `<head>` (`og:url`, `og:image`, `twitter:image`, `canonical`) already
point at that Pages address. If you deploy to a **different** domain, update those four tags in
`index.html` — everything else uses relative paths and needs no change.

### Publishing checklist

- [ ] Both portraits load and are cropped sensibly.
- [ ] Nav links scroll to the right sections, in the order Home, Projects, Skills, About, Contact.
- [ ] The GreenHarvest button opens the correct repository in a new tab.
- [ ] Email and phone links open the mail client and dialler.
- [ ] The contact form either posts to your endpoint or opens a pre-filled email.
- [ ] Layout holds at ~360px, 768px, 1024px and 1440px wide with no horizontal scrolling.
- [ ] The page is usable with JavaScript disabled (links still work, content still visible).
- [ ] Copyright year in the footer shows the current year.

---

## Verification and testing

### Verified in this pass

- **Banned-content sweep** — `index.html`, `README.md`, `js/main.js`, `css/style.css` and
  `css/responsive.css` were searched for student, university, degree, graduation, attachment,
  internship and job-shadowing wording. No such references remain. The only match is the
  project title **"Student Management System"**, which is the actual name of Kelvin's Python
  project and is intentionally kept.
- **Asset paths** — every `src`/`href` that points at a local file resolves to a file that
  exists in the workspace: `css/style.css`, `css/responsive.css`, `js/main.js`,
  `images/favicon.svg`, `images/kelvin-portrait-studio.jpg`, `images/kelvin-portrait-headshot.jpg`.
- **Contact values** — email, phone, GitHub URL and repository URL were checked against the
  brief character by character.
- **Markup hygiene** — one `<h1>`, ordered heading levels below it, no duplicate `id`s, all form
  controls labelled, no inline event handlers, no `style` attributes.
- **CSS hygiene** — 14 sequential section banners in `style.css`; every selector in
  `responsive.css` matched to markup that still exists (dead navigation, timeline and
  opportunity rules were removed). All 109 classes used in `index.html` have a matching rule.
- **3D wiring** — `data-tilt` appears on exactly 6 elements (hero portrait, 2 project cards,
  3 skills cards); `initTilt()` is called from `boot()`; the `(hover: none)` and
  `prefers-reduced-motion` blocks were re-read to confirm the reduced-motion block comes last.
- **No console noise** — no missing files, no failing requests, no JavaScript errors were
  observed in static review; the only `console.warn` left sits behind a condition that can no
  longer be true now that `CONTACT_EMAIL` is set.

### What could not be tested here

This work was done without a browser session, so the following are reasoned from the code
rather than observed:

- Real rendering at each breakpoint (desktop, laptop, tablet, mobile) — the media queries were
  reviewed by hand.
- Real hover/tilt rendering in a browser. The 3D layer was verified by reading the CSS and JS,
  not by observing the animation; the exact feel of `MAX_TILT = 4.5deg` is untuned.
- The `@media (hover: none)` resting pose on an actual touch device.
- Whether `.portrait-card::before`, which extends slightly beyond the card, is visually clipped
  by the hero's `overflow: hidden` on very narrow screens.
- Clipboard copy behaviour on Safari/iOS and on `file://`.
- Real submission of the form to a third-party endpoint (none is configured).
- Screen-reader output on VoiceOver, NVDA and TalkBack.
- Colour-contrast ratios measured with a tool (the token values were chosen to exceed WCAG AA
  for body text on the dark surfaces).

A short manual pass in a browser, following the publishing checklist above, closes those gaps.

---

## Customising

- **Text and sections** — edit `index.html`. Section content is self-contained per `<section>`.
- **Colours, type, spacing** — edit the custom properties at the top of `css/style.css`; almost
  everything inherits from them.
- **Breakpoints** — edit `css/responsive.css`. It is organised from small screens upward.
- **Contact details** — update `CONFIG` in `js/main.js`. If you change the email, also update
  the static `mailto:` link in the Contact section of `index.html` so it stays correct when
  JavaScript is off.
- **Adding a project** — copy an existing `<article class="project-card reveal" data-tilt>`
  block inside `.project-grid` in `index.html`, then replace the badges, title, summaries,
  feature list, status note and tags. Keep `data-tilt` on the card, and keep
  `target="_blank" rel="noopener noreferrer"` on any external link.
- **Tuning the 3D** — change `MAX_TILT` in `initTilt()` (`js/main.js`) for stronger or weaker
  pointer tilt, and the `perspective` values in `css/style.css` (`1100px` hero, `1500px`
  projects, `1400px` skills) for more or less depth. Reducing `perspective` exaggerates the effect.
- **Replacing a portrait** — drop the new file into `images/`, point the `src` at it, update the
  `width`/`height` attributes to the real pixel dimensions and rewrite the `alt` text. Keep the
  filename lowercase with hyphens and no spaces.

---

## Commit and push

```bash
cd KelvinPortfolio
git status
git add index.html README.md css/style.css css/responsive.css js/main.js images/kelvin-portrait-studio.jpg images/kelvin-portrait-headshot.jpg
git commit -m "Add CSS 3D layer: floating hero portrait, tilting project and skills cards, touch and reduced-motion fallbacks"
git push origin main
```

If you also want to remove the two empty placeholder files from the repository:

```bash
git rm "images/my profile" "images/my profile 2"
git commit -m "Remove empty placeholder files from images"
git push origin main
```

---

## Licence

The website code (HTML, CSS, JavaScript) is free to reuse. The photographs in `images/` are
personal images of Kelvin Kipngetich Kiplangat and are **not** covered by that permission —
please do not redistribute them.
