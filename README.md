# Kelvin Kipngetich Kiplangat — Personal Portfolio

A static, responsive personal portfolio website for **Kelvin Kipngetich Kiplangat**, a Computer Science
student at the University of Embu, Kenya. The site presents an introduction, technical skills, two
academic/personal projects, education, the kinds of opportunities being sought, and a validated contact
form.

Built with **HTML5, CSS3 and vanilla JavaScript** only — no frameworks, no build step, no dependencies.

---

## Table of contents

1. [Overview](#overview)
2. [Features](#features)
3. [File structure](#file-structure)
4. [Running the site locally](#running-the-site-locally)
5. [Configuration](#configuration)
6. [How the contact form behaves](#how-the-contact-form-behaves)
7. [Replacing placeholder media](#replacing-placeholder-media)
8. [Adding a third project](#adding-a-third-project)
9. [Honesty notes / current limitations](#honesty-notes--current-limitations)
10. [Deployment (GitHub Pages)](#deployment-github-pages)
11. [Testing summary](#testing-summary)

---

## Overview

| Item | Detail |
| --- | --- |
| Owner | Kelvin Kipngetich Kiplangat |
| Course | BSc Computer Science, University of Embu (expected graduation 2027) |
| Purpose | Portfolio for industrial attachment, internships, job shadowing and entry-level / remote tech roles |
| Type | Single-page static site with anchor navigation |
| Tech | HTML5, CSS3, vanilla JavaScript |
| Backend | None — see [Configuration](#configuration) |
| Hosting target | Any static host, including GitHub Pages |

Sections in page order:

1. **Home** (hero)
2. **About Me**
3. **Technical Skills**
4. **Featured Projects**
5. **Education**
6. **Career Opportunities** (`#opportunities` — deliberately absent from the nav bar to keep the nav
   focused on the six main sections)
7. **Contact**
8. **Footer**

---

## Features

- **Responsive layout** across phones, tablets, laptops and large desktops — fluid `clamp()` typography and
  a breakpoint ladder at 600, 760, 900, 980, 1100 and 420 px.
- **Mobile navigation drawer** with `aria-expanded` / `aria-controls`, Escape-to-close, click-outside-to-close,
  focus return to the toggle, and automatic teardown at desktop widths (≥ 900 px).
- **Sticky header** that condenses on scroll, plus **scroll spy** that marks the current section with
  `aria-current="location"`.
- **Smooth scrolling** to anchor targets with a sticky-header offset (disabled when the visitor prefers
  reduced motion).
- **Scroll-reveal animations** via `IntersectionObserver`, progressively enhanced — content is fully
  visible if JavaScript is unavailable or the visitor prefers reduced motion.
- **Accessible contact form** with inline per-field errors, `aria-invalid`, an `aria-live` status region and
  a visible spam honeypot.
- **Config-driven contact details** so no email address, LinkedIn profile or repository URL is hard-coded
  unless it is real and verified.
- **Copy-to-clipboard** button for the email address (Clipboard API with a `document.execCommand` fallback).
- **Keyboard-friendly** throughout: skip link, visible `:focus-visible` outlines, text-only (not colour-only)
  skill levels.
- **SVG favicon** and Open Graph / Twitter card metadata.

---

## File structure

```
KelvinPortfolio/
├── index.html            # All page markup and content
├── README.md             # This file
├── css/
│   ├── style.css         # Design tokens, base styles and components (single-column baseline)
│   └── responsive.css    # Mobile nav drawer, grids and all multi-column breakpoints
├── js/
│   └── main.js           # Navigation, scroll spy, reveal, contact form, config
└── images/
    └── favicon.svg       # "KK" initials favicon (also used as the social preview image)
```

`style.css` holds the design system and every component in its mobile-first, single-column form.
`responsive.css` holds **all** layout changes for wider viewports, including the mobile drawer — so if you
are hunting for a grid or the burger menu, look there.

---

## Running the site locally

### Option A — VS Code Live Server (recommended)

1. Install the **Live Server** extension in VS Code (publisher: Ritwick Dey).
2. Open the `KelvinPortfolio` folder in VS Code.
3. Right-click [`index.html`](index.html:1) → **Open with Live Server**.
4. The browser opens at `http://127.0.0.1:5500/` (port may vary) and reloads on save.

### Option B — Python's built-in server

```bash
cd KelvinPortfolio
python -m http.server 8000
```

Then visit `http://localhost:8000/`.

### Option C — open the file directly

Double-clicking [`index.html`](index.html:1) works for layout, styling and most scripts. Google Fonts load
over the network, and clipboard access may be restricted on `file://`, so a local server is preferable.

---

## Configuration

All runtime configuration lives in one place: the `CONFIG` object at the top of [`js/main.js`](js/main.js:38).

```js
const CONFIG = {
  CONTACT_EMAIL: '',                                        // js/main.js:39
  FORM_ENDPOINT: '',                                        // js/main.js:40
  GITHUB_PROFILE: 'https://github.com/Kipngetichkelvin',    // js/main.js:41
  LINKEDIN_PROFILE: ''                                      // js/main.js:42
};
```

### `CONTACT_EMAIL` — your real email address

Leave it as `''` until you are ready to publish an address. When empty, the Contact section shows a
"not configured yet — see README.md" hint instead of inventing one, and the form cannot fall back to
`mailto:`.

When you set it, two things change:

- the address is displayed in the Contact list with a **copy** button, and
- it becomes the recipient of the `mailto:` fallback described below.

### `FORM_ENDPOINT` — a form-delivery service URL

The site has no backend. To receive submissions without an email client, create a free form endpoint (for
example [Formspree](https://formspree.io/) or a similar service) and paste the endpoint URL here:

```js
FORM_ENDPOINT: 'https://formspree.io/f/xxxxxxxx'
```

When this is set, the form `POST`s the submission with `fetch()` and shows a success or error message.
Leave it empty to use the `mailto:` fallback instead.

> Never place API keys, passwords or other secrets in this file. Anything in a static site is public.
> A form endpoint URL is designed to be public; a private API key is not.

### `GITHUB_PROFILE` / `LINKEDIN_PROFILE`

`GITHUB_PROFILE` is set and appears in the Contact section and the footer. `LINKEDIN_PROFILE` is empty —
only add it once the profile genuinely exists and you want it visible. When it is set, the footer gains an
extra social link automatically; when it is empty, nothing is shown.

---

## How the contact form behaves

The form in [`index.html`](index.html:598) is validated client-side by [`initContactForm()`](js/main.js:395):

| Field | Rule |
| --- | --- |
| Full name | Required, at least 2 characters |
| Email | Required, must match a standard address pattern |
| Subject | Optional |
| Message | Required, at least 15 characters |

Delivery then follows three tiers, in order:

1. **`FORM_ENDPOINT` set** → submission is `POST`ed to the endpoint with `fetch()`. The button is disabled
   while pending and the result is announced in the live status region.
2. **`FORM_ENDPOINT` empty, `CONTACT_EMAIL` set** → the form builds a `mailto:` link and opens the visitor's
   email client with the message pre-filled.
3. **Both empty** → an honest informational message explains that message delivery has not been configured
   yet and points the visitor to GitHub.

The honeypot field (`#company-site`, hidden from view and from screen readers, `tabindex="-1"`) silently
short-circuits bots. **The form never claims to have sent an email when it has not.**

---

## Replacing placeholder media

The site intentionally ships **no stock photography and no fake portrait**. Everything visual is either CSS
or text, and every placeholder is labelled so it is obvious what to replace.

| Placeholder | Where | How to replace |
| --- | --- | --- |
| `KK` initials avatar | `.avatar-card` in [`index.html`](index.html:100) | Add a real photo to `images/`, then swap the avatar block for an `<img>` with meaningful `alt` text |
| `{ }`, `DB`, `↑` skill icons | [`index.html`](index.html:226) and the sibling cards | Replace the text glyph with an inline SVG icon, or keep them as-is |
| `@`, `GH`, `◎` contact icons | [`index.html`](index.html:557) and siblings | Same as above |
| `.project-media` blocks | [`index.html`](index.html:296) and [`index.html`](index.html:353) | Add screenshots to `images/` and swap the decorative block for an `<img>`; remember to update the `aria-label` wording to describe the real screenshot |

The `.project-media` elements currently use `role="img"` with a descriptive `aria-label` so screen readers
receive a sensible description of a decorative graphic. If you insert a real screenshot, use a real `<img>`
with an `alt` attribute instead.

---

## Adding a third project

A commented-out template card is ready to use at [`index.html`](index.html:415). Duplicate that block,
fill in the real details, and uncomment it. Keep the same class names so styling applies:

```
project-card → project-media → project-body
  → badge-row, project-title, project-summary, project-features
  → tag-row, project-actions
```

Rules to keep the page honest:

- Describe only features that exist in the code.
- Link a repository **only** when the URL is verified.
- If something is planned rather than built, say so in a `.project-note`, as the two existing cards do.

The **Python Student Management System** card currently has no repository link, because no verified URL was
available when the site was built. Once you have published the repository, replace the
`.project-link-note` paragraph in that card with the button in the commented block directly below it.

---

## Honesty notes / current limitations

This site was built to represent Kelvin's background accurately. Please keep it that way when editing.

- **No employment history, certifications, awards or achievements** are claimed anywhere on the page — only
  education, skills and academic/personal projects that were described.
- **No expert-level claims.** Skills are grouped plainly; the "growing" card is explicitly marked as
  in-progress rather than presented as mastery.
- **GreenHarvest Avocado Farm System** is described from its documented scope, and the card carries an
  implementation-status note because the repository could not be inspected while the site was built. Verify
  the feature list against the real code and prune anything not implemented (payments, third-party APIs,
  authentication, database persistence) before publishing.
- **Python Student Management System** is described in terms of its intended core operations
  (add, view, search, update, delete) without a repository link.
- **No real portrait photo** is used; the initials avatar is a deliberate placeholder.
- **No email address or LinkedIn profile is invented.** Both are empty in `CONFIG` until you supply real ones.
- **No backend, no analytics, no cookies, no tracking.**
- **Nothing is pushed to GitHub by this project.** Deployment is a manual step you perform.

---

## Deployment (GitHub Pages)

The site is fully static and uses only relative asset paths (`css/style.css`, `css/responsive.css`,
`js/main.js`, `images/favicon.svg`), so it works from a project subpath as well as a domain root. There are
no `localhost` URLs in the shipped files.

1. Create a **new, separate** repository for the portfolio, e.g. `KelvinPortfolio`.
2. Confirm the owner name in `GITHUB_PROFILE` matches the account you will publish from.
3. Commit and push the files.
4. In the repository, open **Settings → Pages**.
5. Under **Build and deployment**, set **Source** to *Deploy from a branch*.
6. Choose the branch (`main`) and the folder (`/ (root)`), then save.
7. GitHub publishes at `https://<username>.github.io/KelvinPortfolio/` after a minute or two.

### Publishing checklist

- [ ] `CONTACT_EMAIL` set to a real address (or left empty deliberately)
- [ ] `FORM_ENDPOINT` set if you want submissions delivered without an email client
- [ ] `LINKEDIN_PROFILE` set only if the profile exists
- [ ] Project links verified and opening in a new tab
- [ ] Project notes match the actual state of each repository
- [ ] Placeholder screenshots replaced, or left as labelled placeholders
- [ ] Tested on a phone-width viewport after deploying

> Nothing has been published, pushed or deleted. Deployment is yours to run when you are ready.

---

## Testing summary

### Verified working

- All asset references resolve: [`css/style.css`](css/style.css:1), [`css/responsive.css`](css/responsive.css:1),
  [`js/main.js`](js/main.js:1) (loaded with `defer`) and [`images/favicon.svg`](images/favicon.svg:1).
- All six nav links and the footer quick links point at IDs that exist: `#home`, `#about`, `#skills`,
  `#projects`, `#education`, `#contact`.
- The mobile drawer, scroll spy, reveal animations, back-to-top button, copy-to-clipboard and current-year
  footer all have matching CSS and JS hooks.
- The contact form's field IDs, error regions and `aria-describedby` references line up with the JavaScript
  field map.
- Malformed tags that had slipped into the markup were corrected; the document contains no stray `</>`
  sequences.

### Requires your configuration

- Email address display and `mailto:` delivery — needs `CONTACT_EMAIL`.
- Real form delivery — needs `FORM_ENDPOINT` or a working mail client.
- LinkedIn social link — needs `LINKEDIN_PROFILE`.
- Python project repository button — needs a verified repository URL.
- Real portrait and screenshots — see [Replacing placeholder media](#replacing-placeholder-media).

### Could not be tested here

- **Visual rendering in a real browser** — this environment has no browser, so layout, fonts and animation
  timing were verified by reading the CSS, not by looking at the page. Please open the site once in Chrome,
  Firefox and a phone viewport before publishing.
- **Cross-device breakpoint behaviour** at exactly 600/760/900/980/1100 px.
- **Live form submission** to a real endpoint (no endpoint existed to test against).
- **Clipboard behaviour** on `file://` and on older browsers.
- **The two project repositories' contents** — see the honesty notes above.

### Suggested manual pass

1. Run Live Server and check the console for errors.
2. Narrow the window from desktop to 360 px; confirm the burger menu opens, closes on Escape and on
   link click.
3. Tab through the page; confirm a visible focus ring on every link, button and form field.
4. Submit the empty form; confirm three inline errors and the message-field error all appear.
5. Fill in valid details; confirm the status message matches your configuration tier.
6. Enable "reduce motion" in your OS and reload; confirm content is visible without animation.

---

## Licence and content

All written content describes Kelvin Kipngetich Kiplangat's own background. The code is his to reuse and
modify. If you fork the design for someone else, replace every piece of personal content — including the
`CONFIG` values, the initials avatar, the meta description and the structured facts in the About section.
