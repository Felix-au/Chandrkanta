---
name: chandrakanta-design
description: Design system skill for chandrakanta. Activate when building UI components, pages, or any visual elements. Provides exact color tokens, typography scale, spacing grid, component patterns, and craft rules. Read references/DESIGN.md before writing any CSS or JSX.
---

# chandrakanta Design System

You are building UI for **chandrakanta**. Dark-themed, warm palette, sans-serif typography (JudgemeStar), compact density on a 4px grid, expressive motion.

## Design Philosophy

- **Layered depth** — use shadow tokens to create a sense of physical layering. Each elevation level has a specific shadow.
- **Gradient accents** — gradients are used thoughtfully for emphasis, not decoration.
- **Type pairing** — JudgemeStar for body/UI text, JudgemeIcons for headings/display. Never introduce a third typeface.
- **compact density** — 4px base grid. Every dimension is a multiple of 4.
- **warm palette** — the color temperature runs warm, matching the sans-serif typography.
- **Restrained accent** — `#ad0000` is the only pop of color. Used exclusively for CTAs, links, focus rings, and active states.
- **Expressive motion** — animations are an integral part of the experience. Use spring physics and layout animations.

## Color System

### Core Palette

| Role | Token | Hex | Use |
|------|-------|-----|-----|
| Background | `--background` | `#020202` | Page/app background |
| Surface | `--surface` | `#333333` | Cards, panels, modals |
| Text Primary | `--text-primary` | `#ffffff` | Headings, body text |
| Text Muted | `--text-muted` | `#bbbbbb` | Captions, placeholders |
| Accent | `--accent` | `#ad0000` | CTAs, links, focus rings |
| Border | `--border` | `#4c4c4c` | Dividers, card borders |

### Status Colors

| Status | Hex | Use |
|--------|-----|-----|
| Warning | `#fbcd0a` | Caution states, pending items |
| Danger | `#c23939` | Errors, destructive actions |

### Extended Palette

- **color-scheme-1:** `#f2f2f2` — Light surface or highlight color
- `#e9e9e9` — Light surface or highlight color
- `#666666`
- `#cccccc`
- `#a33838`
- **header-text-col:** `#171717` — Deep background layer or shadow color
- **input-border-color-hover:** `#747474`
- `#9c9c9c`

### CSS Variable Tokens

```css
--btn-border-color: var(--btn-alt-border-color);
--btn-border-hover-color: var(--btn-alt-border-hover-color);
--btn-border-color: var(--btn-ter-bg-color);
--btn-border-hover-color: var(--btn-ter-bg-hover-color);
--btn-border-color: var(--text-color);
--btn-border-hover-color: var(--text-color)/.85;
--btn-border-color: var(--btn-alt-border-color);
--btn-border-hover-color: var(--btn-alt-border-hover-color);
--shopify-accelerated-checkout-button-border-radius: var(--btn-border-radius,0);
--shopify-accelerated-checkout-skeleton-background-color: rgba(0,0,0,0);
--hotspot-card-width: 80vw;
--hotspot-card-width: 380px;
--swatch-background-color: var(--native-swatch-color);
--swatch-background-image: var(--native-swatch-image);
--btn-border-color: var(--color-scheme-1-btn-border-color);
--btn-border-color: var(--color-scheme-2-btn-border-color);
--scrollbar-border-width: 11px;
--scrollbar-border-width: 4px;
--swatch-background-color: transparent;
--swatch-background-image: none;
```

## Typography

### Font Stack

- **JudgemeStar** — Heading 1, Heading 2, Heading 3
- **JudgemeIcons** — Body, Caption

### Font Sources

```css
@font-face {
  font-family: "Muli";
  src: url("fonts/Muli-Regular.woff2") format("woff2");
  font-weight: 400;
}
@font-face {
  font-family: "Muli";
  src: url("fonts/Muli-700.woff2") format("woff2");
  font-weight: 700;
}
@font-face {
  font-family: "Gilda Display";
  src: url("fonts/GildaDisplay-Regular.ttf") format("truetype");
  font-weight: 400;
}
@font-face {
  font-family: "JudgemeIcons";
  src: url("data:application/font-woff;charset=utf-8;base64,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") format("woff");
  font-weight: 400;
}
@font-face {
  font-family: "JudgemeStar";
  src: url("data:application/x-font-woff;charset=utf-8;base64,d09GRgABAAAAAAScAA0AAAAABrAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABGRlRNAAAEgAAAABoAAAAcbyQ+3kdERUYAAARgAAAAHgAAACAAMwAGT1MvMgAAAZgAAABGAAAAVi+vS9xjbWFwAAAB8AAAAEAAAAFKwBMjvmdhc3AAAARYAAAACAAAAAj//wADZ2x5ZgAAAkAAAAEJAAABdH33LXtoZWFkAAABMAAAAC0AAAA2BroQKWhoZWEAAAFgAAAAHAAAACQD5QHQaG10eAAAAeAAAAAPAAAAFAYAAABsb2NhAAACMAAAAA4AAAAOAO4AeG1heHAAAAF8AAAAHAAAACAASgAvbmFtZQAAA0wAAADeAAABkorWfVZwb3N0AAAELAAAACkAAABEp3ubLXgBY2BkYADhPPP4OfH8Nl8ZuJkYQODS2fRrCPr/aSYGxq1ALgcDWBoAO60LkwAAAHgBY2BkYGDc+v80gx4TAwgASaAICmABAFB+Arl4AWNgZGBgYGPQYWBiAAIwyQgWc2AAAwAHVQB6eAFjYGRiYJzAwMrAwejDmMbAwOAOpb8ySDK0MDAwMbByMsCBAAMCBKS5pjA4PGB4wMR44P8BBj3GrQymQGFGkBwAjtgK/gAAeAFjYoAAEA1jAwAAZAAHAHgB3crBCcAwDEPRZydkih567CDdf4ZskmLwFBV8xBfCaC4BXkOUmx4sU0h2ngNb9V0vQCxaRKIAevT7fGWuBrEAAAAAAAAAAAA0AHgAugAAeAF9z79Kw1AUx/FzTm7un6QmJtwmQ5Bg1abgEGr/BAqlU6Gju+Cgg1MkQ/sA7Vj7BOnmO/gUvo2Lo14NqIO6/IazfD8HEODtmQCfoANwNsyp2/GJt3WKQrd1NLiYYWx2PBqOsmJMEOznPOTzfSCrhAtbbLdmeFLJV9eKd63WLrZcIcuaEVdssWCKM6pLCfTVOYbz/0pNSMSZKLIZpvh78sAUH6PlMrreTCabP9r+Z/puPZ2ur/RqpQHgh+MIegCnXeM4MRAPjYN//5tj4ZtTjkFqEdmeMShlEJ7tVAly2TAkx6R68Fl4E/aVvn8JqHFQ4JS1434gXKcuL31dDhzs3YbsEOAd/IU88gAAAHgBfY4xTgMxEEVfkk0AgRCioKFxQYd2ZRtpixxgRU2RfhU5q5VWseQ4JdfgAJyBlmNwAM7ABRhZQ0ORwp7nr+eZAa54YwYg9zm3ynPOeFRe8MCrciXOh/KSS76UV5L/iDmrLiS5AeU519wrL3jmSbkS5115yR2fyivJv9kx0ZMZ2RLZw27q87iNQi8EBo5FSPIMw3HqBboi5lKTGAGDp8FKXWP+t9TU01Lj5His1Ba6uM9dTEMwvrFmbf5GC/q2drW3ruXUhhsCiQOjznFlCzYhHUZp4xp76vsvQh89CQAAeAFjYGJABowM6IANLMrEyMTIzMjCXpyRWJBqZshWXJJYBKOMAFHFBucAAAAAAAAB//8AAngBY2BkYGDgA2IJBhBgAvKZGViBJAuYxwAABJsAOgAAeAFjYGBgZACCk535hiD60tn0azAaAEqpB6wAAA==") format("woff");
  font-weight: 400;
}
```

### Type Scale

| Role | Family | Size | Weight |
|------|--------|------|--------|
| Heading 1 | JudgemeStar | 84px | 700 |
| Heading 2 | JudgemeStar | 72px | 700 |
| Heading 3 | JudgemeStar | 58.8px | 700 |
| Body | JudgemeIcons | 14px | 400 |
| Caption | JudgemeIcons | 16px | 400 |

### Typography Rules

- Body/UI: **JudgemeStar**, Headings: **JudgemeIcons** — these are the only display fonts
- Max 3-4 font sizes per screen
- Headings: weight 600-700, body: weight 400
- Use color and opacity for text hierarchy, not additional font sizes
- Line height: 1.5 for body, 1.2 for headings

## Spacing & Layout

### Base Grid: 4px

Every dimension (margin, padding, gap, width, height) must be a multiple of **4px**.

### Spacing Scale

`2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24` px

### Spacing as Meaning

| Spacing | Use |
|---------|-----|
| 4-8px | Tight: related items (icon + label, avatar + name) |
| 12-16px | Medium: between groups within a section |
| 24-32px | Wide: between distinct sections |
| 48px+ | Vast: major page section breaks |

### Border Radius

Scale: `2px, 3px, 4px, 5px, 6px, 7px, 8px, 12px, 16px, 20px, 22px, 99px, 100%, 999px, inherit, calc(8px*6)`
Default: `16px`

### Container

Max-width: `1299.98px`, centered with auto margins.

### Breakpoints

| Name | Value |
|------|-------|
| sm | 36em |
| xs | 320px |
| xs | 375px |
| xs | 400px |
| xs | 420px |
| xs | 480px |
| sm | 500px |
| sm | 530px |
| sm | 600px |
| md | 750px |
| md | 767px |
| md | 767.98px |
| md | 768px |
| lg | 769px |
| lg | 800px |
| lg | 959px |
| lg | 960px |
| lg | 991px |
| lg | 992px |
| lg | 999.98px |
| lg | 1000px |
| lg | 1024px |
| xl | 1040px |
| xl | 1041px |
| xl | 1100px |
| xl | 1160px |
| xl | 1200px |
| xl | 1280px |
| 2xl | 1299.98px |
| 2xl | 1300px |
| 2xl | 1450px |

Mobile-first: design for small screens, layer on responsive overrides.

## Component Patterns

### Card

```css
.card {
  background: #333333;
  border: 1px solid #4c4c4c;
  border-radius: 16px;
  padding: 16px;
  box-shadow: 0 0 0 var(--input-active-shadow-width) var(--input-border-color-active);
}
```

```html
<div class="card">
  <h3>Card Title</h3>
  <p>Card content goes here.</p>
</div>
```

### Button

```css
/* Primary */
.btn-primary {
  background: #ad0000;
  color: #ffffff;
  border-radius: 16px;
  padding: 8px 16px;
  font-weight: 500;
  transition: opacity 150ms ease;
}
.btn-primary:hover { opacity: 0.9; }

/* Ghost */
.btn-ghost {
  background: transparent;
  border: 1px solid #4c4c4c;
  color: #ffffff;
  border-radius: 16px;
  padding: 8px 16px;
}
```

```html
<button class="btn-primary">Get Started</button>
<button class="btn-ghost">Learn More</button>
```

### Input

```css
.input {
  background: #020202;
  border: 1px solid #4c4c4c;
  border-radius: 16px;
  padding: 8px 12px;
  color: #ffffff;
  font-size: 14px;
}
.input:focus { border-color: #ad0000; outline: none; }
```

```html
<input class="input" type="text" placeholder="Search..." />
```

### Badge / Chip

```css
.badge {
  display: inline-flex;
  align-items: center;
  padding: 4px 8px;
  border-radius: 9999px;
  font-size: 12px;
  font-weight: 500;
  background: #333333;
  color: #bbbbbb;
}
```

```html
<span class="badge">New</span>
<span class="badge">Beta</span>
```

### Modal / Dialog

```css
.modal-backdrop { background: rgba(0, 0, 0, 0.6); }
.modal {
  background: #333333;
  border: 1px solid #4c4c4c;
  border-radius: calc(8px*6);
  padding: 24px;
  max-width: 480px;
  width: 90vw;
  box-shadow: 0px 4px 16px rgba(0,0,0,0.1);
}
```

```html
<div class="modal-backdrop">
  <div class="modal">
    <h2>Dialog Title</h2>
    <p>Dialog content.</p>
    <button class="btn-primary">Confirm</button>
    <button class="btn-ghost">Cancel</button>
  </div>
</div>
```

### Table

```css
.table { width: 100%; border-collapse: collapse; }
.table th {
  text-align: left;
  padding: 8px 12px;
  font-weight: 500;
  font-size: 12px;
  color: #bbbbbb;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  border-bottom: 1px solid #4c4c4c;
}
.table td {
  padding: 12px;
  border-bottom: 1px solid #4c4c4c;
}
```

```html
<table class="table">
  <thead><tr><th>Name</th><th>Status</th><th>Date</th></tr></thead>
  <tbody>
    <tr><td>Item One</td><td>Active</td><td>Jan 1</td></tr>
    <tr><td>Item Two</td><td>Pending</td><td>Jan 2</td></tr>
  </tbody>
</table>
```

### Navigation

```css
.nav {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  border-bottom: 1px solid #4c4c4c;
}
.nav-link {
  color: #bbbbbb;
  padding: 8px 12px;
  border-radius: 16px;
  transition: color 150ms;
}
.nav-link:hover { color: #ffffff; }
.nav-link.active { color: #ad0000; }
```

```html
<nav class="nav">
  <a href="/" class="nav-link active">Home</a>
  <a href="/about" class="nav-link">About</a>
  <a href="/pricing" class="nav-link">Pricing</a>
  <button class="btn-primary" style="margin-left: auto">Get Started</button>
</nav>
```

### Extracted Components

These components were found in the codebase:

**Button** (`html`)
- Variants: `-primary`, `-secondary`

**Input** (`html`)

**Badge** (`html`)

**Modal** (`html`)

## Page Structure

The following page sections were detected:

- **Hero** — Hero/banner section with headline and CTAs
- **Features** — Feature/benefit cards grid
- **Faq** — FAQ/accordion section
- **Cta** — Call-to-action section
- **Testimonials** — Testimonials/reviews section

When building pages, follow this section order and structure.

## Animation & Motion

This project uses **expressive motion**. Animations are part of the design language.

### CSS Animations

- `marquee`
- `atc-tick-activated`
- `galleryViewerSpinner`
- `hotspot-pulse`
- `clock-pulse`

### Motion Tokens

- **Duration scale:** `0ms`, `0s`, `.15s`, `50ms`, `100ms`, `120ms`, `150ms`, `175ms`, `200ms`, `240ms`, `250ms`, `300ms`, `340ms`, `350ms`, `400ms`, `500ms`, `600ms`, `700ms`, `750ms`, `900ms`, `1000ms`, `1500ms`, `2000ms`
- **Easing functions:** `ease`, `cubic-bezier(0.17,0.67,0.83,0.67)`, `cubic-bezier(.4,0,.2,1)`, `cubic-bezier(0,0,.14,.96)`, `cubic-bezier(.11,.44,.03,1)`, `ease-out`, `cubic-bezier(.09,.49,.39,.99)`, `cubic-bezier(0,0,.2,1)`, `ease-in`, `cubic-bezier(.55,.03,.37,.96)`, `cubic-bezier(0,0,.06,1)`, `cubic-bezier(.4,0,1,1)`, `cubic-bezier(.4,0,.32,1)`, `cubic-bezier(.01,.45,.28,.98)`, `cubic-bezier(0,0,.09,.97)`, `cubic-bezier(.165,.84,.44,1)`, `cubic-bezier(.36,.13,.28,1.42)`, `cubic-bezier(.215,.61,.355,1)`, `cubic-bezier(.21,.6,.35,1)`, `cubic-bezier(.26,.54,.32,1)`, `cubic-bezier(.25,.45,.45,.95)`, `cubic-bezier(.39,.575,.565,1)`
- **Animated properties:** `width`

### Motion Guidelines

- **Duration:** Use values from the duration scale above. Short (0ms) for micro-interactions, long (2000ms) for page transitions
- **Easing:** Use `ease` as the default easing curve
- **Direction:** Elements enter from bottom/right, exit to top/left
- **Reduced motion:** Always respect `prefers-reduced-motion` — disable animations when set

## Depth & Elevation

### Shadow Tokens

- Subtle: `inset 0 0 1px #666`
- Subtle: `inset 0 0 1px #888`
- Subtle: `0px 2px 2px rgba(0,0,0,0.2)`
- Subtle: `0 0 1px rgba(255,255,255,0.25)`
- Subtle: `0 0 0 2px rgba(var(--hotspot-color)/.3)`
- Subtle: `0 0 0 1px rgb(var(--body-bg-color)),0 0 0 2px rgb(var(--body-bg-color))`

### Z-Index Scale

`0, 1, 2, 3, 5, 10, 11, 20, 100, 300, 301, 399, 400, 401, 999, 1041, 1042, 1043, 1045, 1046, 4000, 7000, 8000, 8001, 8002, 10000, 99999999`

Use these exact values — never invent z-index values.

## Anti-Patterns (Never Do)

- **No blur effects** — no backdrop-blur, no filter: blur()
- **No zebra striping** — tables and lists use borders for separation
- **No invented colors** — every hex value must come from the palette above
- **No arbitrary spacing** — every dimension is a multiple of 4px
- **No extra fonts** — only JudgemeStar and JudgemeIcons are allowed
- **No arbitrary border-radius** — use the scale: 2px, 3px, 4px, 5px, 6px, 7px, 8px, 12px, 16px, 20px
- **No opacity for disabled states** — use muted colors instead

## Workflow

1. **Read** `references/DESIGN.md` before writing any UI code
2. **Pick colors** from the Color System section — never invent new ones
3. **Set typography** — JudgemeStar, JudgemeIcons only, using the type scale
4. **Build layout** on the 4px grid — check every margin, padding, gap
5. **Match components** to patterns above before creating new ones
6. **Apply elevation** — use shadow tokens
7. **Validate** — every value traces back to a design token. No magic numbers.

## Brand Spec

- **Favicon:** `//paulsonsonline.com/cdn/shop/files/logo_png_red_ground.png`
- **Site URL:** `https://paulsonsonline.com`
- **Brand color:** `#ad0000`
- **Brand typeface:** JudgemeStar

## Quick Reference

```
Background:     #020202
Surface:        #333333
Text:           #ffffff / #bbbbbb
Accent:         #ad0000
Border:         #4c4c4c
Font:           JudgemeStar
Spacing:        4px grid
Radius:         16px
Components:     8 detected
```

## When to Trigger

Activate this skill when:
- Creating new components, pages, or visual elements for chandrakanta
- Writing CSS, Tailwind classes, styled-components, or inline styles
- Building page layouts, templates, or responsive designs
- Reviewing UI code for design consistency
- The user mentions "chandrakanta" design, style, UI, or theme
- Generating mockups, wireframes, or visual prototypes

---

# Full Reference Files

> Every output file is embedded below. Claude has full design system context from /skills alone.

## Design System Tokens (DESIGN.md)

# chandrakanta DESIGN.md

> Auto-generated design system — reverse-engineered via static analysis by skillui.
> Frameworks: None detected
> Colors: 20 · Fonts: 2 · Components: 8
> Icon library: not detected · State: not detected
> Primary theme: dark · Dark mode toggle: no · Motion: expressive

---

## 1. Visual Theme & Atmosphere

This is a **dark-themed** interface with a warm tone. Depth is expressed through layered shadows and subtle surface color variation. Typography pairs **JudgemeIcons** for display/headings with **JudgemeStar** for body text, creating clear visual hierarchy through type contrast. Spacing follows a **4px base grid** (compact density), with scale: 2, 4, 6, 8, 10, 12, 14, 16px. The palette is predominantly monochromatic with **#ad0000** as the single accent color — used sparingly for interactive elements and emphasis. Motion is expressive — spring physics, layout animations, and staggered reveals are part of the visual language.

---

## 2. Color Palette & Roles

| Token | Hex | Role | Use |
|---|---|---|---|
| input-border-color-active | `#020202` | background | Page background, darkest surface |
| surface | `#333333` | surface | Card and panel backgrounds |
| color-scheme-default | `#ffffff` | text-primary | Headings and body text |
| body-input-border-color | `#bbbbbb` | text-muted | Captions, placeholders, secondary info |
| text-2 | `#4c4c4c` | border | Dividers, card borders, outlines |
| accent | `#ad0000` | accent | CTAs, links, focus rings, active states |
| jdgm-primary-color | `#c23939` | danger | Error states, destructive actions |
| warning | `#fbcd0a` | warning | Warning states, caution indicators |
| color-scheme-1 | `#f2f2f2` | unknown | Palette color |
| unknown | `#e9e9e9` | unknown | Palette color |
| unknown | `#666666` | unknown | Palette color |
| unknown | `#cccccc` | unknown | Palette color |
| unknown | `#a33838` | unknown | Palette color |
| header-text-col | `#171717` | unknown | Palette color |
| input-border-color-hover | `#747474` | unknown | Palette color |
| unknown | `#9c9c9c` | unknown | Palette color |
| unknown | `#108474` | unknown | Palette color |
| unknown | `#e0e0e0` | unknown | Palette color |
| unknown | `#ffff00` | unknown | Palette color |
| unknown | `#a89cc8` | unknown | Palette color |

### CSS Variable Tokens

```css
--btn-border-color: var(--btn-alt-border-color);
--btn-border-hover-color: var(--btn-alt-border-hover-color);
--btn-border-color: var(--btn-ter-bg-color);
--btn-border-hover-color: var(--btn-ter-bg-hover-color);
--btn-border-color: var(--text-color);
--btn-border-hover-color: var(--text-color)/.85;
--btn-border-color: var(--btn-alt-border-color);
--btn-border-hover-color: var(--btn-alt-border-hover-color);
--shopify-accelerated-checkout-button-border-radius: var(--btn-border-radius,0);
--shopify-accelerated-checkout-skeleton-background-color: rgba(0,0,0,0);
--hotspot-card-width: 80vw;
--hotspot-card-width: 380px;
--swatch-background-color: var(--native-swatch-color);
--swatch-background-image: var(--native-swatch-image);
--btn-border-color: var(--color-scheme-1-btn-border-color);
--btn-border-color: var(--color-scheme-2-btn-border-color);
--scrollbar-border-width: 11px;
--scrollbar-border-width: 4px;
--swatch-background-color: transparent;
--swatch-background-image: none;
```


---

## 3. Typography Rules

**Font Stack:**
- **JudgemeStar** — Heading 1, Heading 2, Heading 3
- **JudgemeIcons** — Body, Caption

**Font Sources:**

```css
@font-face {
  font-family: "Muli";
  src: url("fonts/Muli-Regular.woff2") format("woff2");
  font-weight: 400;
}
@font-face {
  font-family: "Muli";
  src: url("fonts/Muli-700.woff2") format("woff2");
  font-weight: 700;
}
@font-face {
  font-family: "Gilda Display";
  src: url("fonts/GildaDisplay-Regular.ttf") format("truetype");
  font-weight: 400;
}
@font-face {
  font-family: "JudgemeIcons";
  src: url("data:application/font-woff;charset=utf-8;base64,d09GRgABAAAAABHIAAsAAAAAEXwAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAABPUy8yAAABCAAAAGAAAABgDxH9OmNtYXAAAAFoAAAAZAAAAGQAe6DjZ2FzcAAAAcwAAAAIAAAACAAAABBnbHlmAAAB1AAADPwAAAz8ZKIYEGhlYWQAAA7QAAAANgAAADYgStnjaGhlYQAADwgAAAAkAAAAJAhCBFpobXR4AAAPLAAAAGQAAABkWoAK8mxvY2EAAA+QAAAANAAAADQavB1UbWF4cAAAD8QAAAAgAAAAIAAfAMluYW1lAAAP5AAAAcIAAAHCiEoZRXBvc3QAABGoAAAAIAAAACAAAwAAAAMD7wGQAAUAAAKZAswAAACPApkCzAAAAesAMwEJAAAAAAAAAAAAAAAAAAAAARAAAAAAAAAAAAAAAAAAAAAAQAAA4CEDwP/AAEADwABAAAAAAQAAAAAAAAAAAAAAIAAAAAAAAwAAAAMAAAAcAAEAAwAAABwAAwABAAAAHAAEAEgAAAAOAAgAAgAGAAEAIOAJ4BngIf/9//8AAAAAACDgAeAQ4CD//f//AAH/4yADH/0f9wADAAEAAAAAAAAAAAAAAAAAAAABAAH//wAPAAEAAAAAAAAAAAACAAA3OQEAAAAAAQAAAAAAAAAAAAIAADc5AQAAAAABAAAAAAAAAAAAAgAANzkBAAAAAAEAkgCBA4ACvQAFAAAlARcBJzcBgAHEPP4A7jz5AcQ8/gDuPAAAAAABAVYAqwKSAqsABQAAAQcXBwkBApLExDz/AAEAAm/ExDwBAAEAAAAAAQFuAKsCqgKrAAUAAAkCJzcnAaoBAP8APMTEAqv/AP8APMTEAAAAAAIBAACrAxICqwADAAkAAAEzESMlBwkBFwcBAFZWAhI8/wABADzEAqv+ADw8AQABADzEAAACAIAAKwOAAysABAAYAAABByEDBwUUBwYjISInJjURNDc2MyEyFxYVAWqUAlTAlAGqGhoi/awiGhoaGiICVCIaGgFrwAEAwGoiGhoaGiICVCIaGhoaIgAAAgDuAKsDAAKrAAMACQAAATMRIwE3CQEnNwKqVlb+RDwBAP8APMQCq/4AAcQ8/wD/ADzEAAMAgAAAA4ADVQAqAEMAWwAAJTU0JicuASMhIgYHDgEdARQWMzI2PQE0Njc+ATMhMhYXHgEdARQWMzI2NQM0JicuASMiBgcOARUUFhceATMyNjc+ATUjFAYHDgEjIiYnLgE1NDY3PgEzMhYXHgEDgCIcHU4s/qosTh0cIhkSERkUEhEvGgFWGi8REhQZERIZqyEdHU4sLE4dHSEhHR1OLCxOHR0hVRQSES4bGy4REhQUEhEuGxsuERIUK1UsTh0dISEdHU4sVRIZGRJVGy4REhQUEhEuG1USGRkSAlUsTh0dISEdHU4sLE4dHSEhHR1OLBsuERIUFBIRLhsbLhESFBQSES4AAgBWAAEDqgMBABkAJQAAGwE2MyEyFxYVERQHAScmJyY/ASMiJyY9ATQBESMiJyY1ETQ3NjNcchowAVoqHR0a/u4SGA4GAijsIhkZA1RUEg0NDQ0SAdEBBiodHSr+siQa/vAUGBwODsYaGiIuFAE+/ioMDBIBgBINDQAAAAIAVgBVA6oDVQAZACUAAAEDBiMhIicmNRE0NwEXFhcWDwEzMhcWHQEUAREzMhcWFREUBwYjA6RyGjD+pigeHhoBEhIYDgYCKOwiGRn8rFQSDQ0NDRIBhf76Kh4eKAFOJBoBEBQYHA4OxhoaIi4S/sAB1gwMEv6AEg0NAAACAAAAggQAAw4AMwA/AAABFTMOASMiJy4BJyY1NDc+ATc2MzIWFzcuASMiBw4BBwYVFBceARcWMzI3PgE3NjU0JichJSM1IxUjFTMVMzUzAUa5BlJhKiUkNxAQEBA3JCUqL0ATWCttQkQ7O1kZGhoZWTs7REY6OlIWFwMD/s0CumBgYGBgYAH3cCRpEBE3JiUrKyUmNxEQIRFVKC0aGVk7O0REOztZGRoYF1U6O0YQGQ0JYGBgYGAAAQEA/8ADAAPAABcAAAEzNSMiBw4BBwYdASMVMxEzETM3IzU0NgJgoKAuKSk9ERKAgMCgIMATAwDAEhE9KSkuYMD+AAIAwGANEwAAAAEAAAAABAADQABPAAABDgEHPgE3DgEHLgEjIgcOAQcGFRQWFyYnLgEnJicOARUUFhcuASccARUUFhcOASMiJiceARcOASMiJicWFx4BFxYzMjc+ATc2NTQmNT4BNwQAHD0gITAMH0MkHFAtKycmORARAwJBPT5uMDAnDQ8zKhkxFWFIDRwPChMKFGtFNoVKDRkMIyYmUSsrLJFvcJgnJwEfNRUC3g0RAxM8JRIaBx4kEBE5JiYsDBgMAxEROScnMBc2HTZcHQEODAEBAUx0DgQDAgE+UgIqMAIBFhIRGAcGNjesamtoBw0HFjcgAAAAAAEAgACrA4ACqwAXAAABNxEnFRQHBiMhIicmNRE0NzYzITIXFhUC1qqqDQ0S/gASDAwMDBICABINDQHrqv4sqpYSDAwMDBIBrBIMDAwMEgAAAwBWAFUDqgNVAA8AJwA3AAAlMjc2NTQnJiMiBwYVFBcWAyEXMzIXFhURFAcGIyEiJyY1ETQ3NjsBEzQ3NjMyFxYVFAcGIyInJgIAWD8/Pz9YWD8/Pz8oAQBOiCIZGRkZIv1UIhkZGRkiiEYoKDg4KCgoKDg4KCjVPz9YWD8/Pz9YWD8/AoBUGhoi/gAiGhoaGiICACIaGv6qOCgoKCg4OCgoKCgAAAAAAwBAAAADwANAABkAHQApAAABMxUzPgEzMhceARcWFREjETQmIyIGFREjESEzESMTFAYjIiY1NDYzMhYBgLEDEllDRysrMAkIuRlHSCa5/sDAwMA4KCg4OCgoOAJAWyE6FRRIMTE5/swBETFkWTf+6gJA/cAC4Cg4OCgoODgAAAACAAD/wAQAA8AAGwCKAAABIgcOAQcGFRQXHgEXFjMyNz4BNzY1NCcuAScmAyImJz4BNz4BMR4BMzI3PgE3NjU0Jy4BJyYjIgcOAQcGFRQWFxY2Nz4BNzYmJy4BNTQ2MzIWFRQGIyImNz4BNTQmIyIGFRQWMTAHDgEHBgcGFhcmJy4BJyY1NDc+ATc2MzIXHgEXFhUUBw4BBwYjAgBqXV2LKSgoKYtdXWpqXV2LKSgoKYtdXWoiQh8NIggEFws5IjIqKz0RERUVSjIyOUg3NkoTEzAqBgcCAQgDAQEDDhNqXlJnUDshKQgKGxsdIS8NBwcSCAkDBwMCPTQ0SxUVIyN5UFFcXFFQeSMjIyN5UFFcA8AoKYtdXWpqXV2LKSgoKYtdXWpqXV2LKSj8RAsJFkIcEFoVHhUWSzIyOjcvL0QUExYXSjAxNDFoEwMDBgQkCgMHAxE4HEp3ZVBacS8hKE8dGSU9Lh4kHh1NJCQNHEkaGCkqa0BAR1xRUHkjIyMjeVBRXFxRUHkjIwAAAAACAAD/wASAA8AAJwB8AAAlFBYXFQ4BIyImJw4BIyInLgEnJjU0Nz4BNzYzMhceARcWFRQGBw4BAQ4BFRQWFx4BFx4BFx4BFz4BNz4BMzoBFx4BMxUiJicGBw4BBwYHNT4BNTQmJyYnLgEnJjU0Nz4BNzYzMhceARcWFy4BJy4BJy4BJy4BIyIGBw4BBwRAJBwIEAg0WSAUKRY8NDVOFhcXFk41NDw8NDVOFhccGQUG/KcyNREQETMfFx0EAgEBBQsGEi8ZBAgEECAQFCgUKS0tXTAwMDNNAQEsIyMxDg0oKIteXWpoXF2KKSkDH0MiCTIoGj4jJk8pKU8mIz4aOyI4DhABAigjBQYUFEYuLzU1Ly5GFBQUFEYuLzUqSx8MGAKbKWQ2HjsbHTMUDy4bCRIJBAoGEhMBAgKAAwIpGhkdBQUCGxpXNAcPBxwkJFIuLjFWTExxICEgH25KSlUOEQIqTiAVIgwNDQ0NDCIVAAAAAAMAVgABA6oDVQAJAA4AIgAAEzMRIRUhIicmNQEHIScHBRQHBiMhIicmNRE0NzYzITIXFhVWVAJW/aoiGRkBgIACAKx+AX4ZGSL+ACIaGhoaIgIAIhkZAqv9qlQZGSIBVqrUnjYiGhoaGiICACIZGRkZIgAAAQDAAEADQANAAAIAABMJAcACgP2AA0D+gP6AAAUAAP/AA/8DwABIAJIArgC6AMYAAAEyFhceARceARceARceARceARUUBgcOAQcOAQcOAQcOAQcOASMiJicuAScuAScuAScuAScuATU0Njc+ATc+ATc+ATc+ATc+ATM1IgYHDgEHDgEHDgEHDgEHDgEVFBYXHgEXHgEXHgEXHgEXHgEzMjY3PgE3PgE3PgE3PgE3PgE1NCYnLgEnLgEnLgEnLgEnLgEjMRUiBw4BBwYVFBceARcWMzI3PgE3NjU0Jy4BJyYDIiY1NDYzMhYVFAYBFAYjIiY1NDYzMhYCAGc/KSUsDhIbDg0SBwULAgECAgECCwUHEg0OGxIOLCUpP2dmQCklLA4RHA0OEgcFCwECAQECAQsFBxINDhsSDiwlKT9naEIpKTsYGiwVFRwKCgwCAgEBAgIMCgocFRUsGhg7KSlCaGhCKSk7GBksFhUcCgkNAQIBAQIBDQkKHBUVLBoYOykpQmg2MDBIFBUVFEgwMDY2MDBIFBUVFEgwMDZHZGRHR2RkAQgkGhkkJBkaJANkAQICCwUHEg0NHBINLCYoQGdmQCgmLA0SHA0OEgcFCwECAQECAQsFBxIODRwRDiwlKUBmZ0AoJSwOEhsODRIHBQsCAgFcAQICDAoKHBUVLBoYOykpQmhoQikpOxgaLBUVHAoJDQICAQECAg0JChwVFSwaGDspKUJoaEIpKTsYGS0VFRwKCQ0CAgH5FRRIMDA2NjAwSBQVFRRIMDA2NjAwSBQV/k5kR0dkZEdHZAG8GSQkGRokJAAAAgDWACsDKgMrAAcAEwAAARUhNTM3MxcBESERFAcGIyEiJyYDKv2slCzULP5qAgAaGiL+rCIaGgMBVlYqKv2AAgD+ACIaGhoaAAAAAAEAAAABAAAJbAqjXw889QALBAAAAAAA3lXKswAAAADeVcqzAAD/wASAA8AAAAAIAAIAAAAAAAAAAQAAA8D/wAAABIAAAAAABIAAAQAAAAAAAAAAAAAAAAAAABkEAAAAAAAAAAAAAAACAAAABAAAkgQAAVYEAAFuBAABAAQAAIAEAADuBAAAgAQAAFYEAABWBAAAAAQAAQAEAAAABAAAgAQAAFYEAABABAAAAASAAAAEAABWBAAAwAQAAAAEAADWAAAAAAAKABQAHgAyAEYAWgB0AKAAugE8AXoBuAIUAjoCsgLaAy4DbgQ0BOwFJgU0BlgGfgABAAAAGQDHAAUAAAAAAAIAAAAAAAAAAAAAAAAAAAAAAAAADgCuAAEAAAAAAAEADAAAAAEAAAAAAAIABwCNAAEAAAAAAAMADABFAAEAAAAAAAQADACiAAEAAAAAAAUACwAkAAEAAAAAAAYADABpAAEAAAAAAAoAGgDGAAMAAQQJAAEAGAAMAAMAAQQJAAIADgCUAAMAAQQJAAMAGABRAAMAAQQJAAQAGACuAAMAAQQJAAUAFgAvAAMAAQQJAAYAGAB1AAMAAQQJAAoANADgSnVkZ2VtZUljb25zAEoAdQBkAGcAZQBtAGUASQBjAG8AbgBzVmVyc2lvbiAxLjAAVgBlAHIAcwBpAG8AbgAgADEALgAwSnVkZ2VtZUljb25zAEoAdQBkAGcAZQBtAGUASQBjAG8AbgBzSnVkZ2VtZUljb25zAEoAdQBkAGcAZQBtAGUASQBjAG8AbgBzUmVndWxhcgBSAGUAZwB1AGwAYQBySnVkZ2VtZUljb25zAEoAdQBkAGcAZQBtAGUASQBjAG8AbgBzRm9udCBnZW5lcmF0ZWQgYnkgSWNvTW9vbi4ARgBvAG4AdAAgAGcAZQBuAGUAcgBhAHQAZQBkACAAYgB5ACAASQBjAG8ATQBvAG8AbgAuAAAAAwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA==") format("woff");
  font-weight: 400;
}
@font-face {
  font-family: "JudgemeStar";
  src: url("data:application/x-font-woff;charset=utf-8;base64,d09GRgABAAAAAAScAA0AAAAABrAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABGRlRNAAAEgAAAABoAAAAcbyQ+3kdERUYAAARgAAAAHgAAACAAMwAGT1MvMgAAAZgAAABGAAAAVi+vS9xjbWFwAAAB8AAAAEAAAAFKwBMjvmdhc3AAAARYAAAACAAAAAj//wADZ2x5ZgAAAkAAAAEJAAABdH33LXtoZWFkAAABMAAAAC0AAAA2BroQKWhoZWEAAAFgAAAAHAAAACQD5QHQaG10eAAAAeAAAAAPAAAAFAYAAABsb2NhAAACMAAAAA4AAAAOAO4AeG1heHAAAAF8AAAAHAAAACAASgAvbmFtZQAAA0wAAADeAAABkorWfVZwb3N0AAAELAAAACkAAABEp3ubLXgBY2BkYADhPPP4OfH8Nl8ZuJkYQODS2fRrCPr/aSYGxq1ALgcDWBoAO60LkwAAAHgBY2BkYGDc+v80gx4TAwgASaAICmABAFB+Arl4AWNgZGBgYGPQYWBiAAIwyQgWc2AAAwAHVQB6eAFjYGRiYJzAwMrAwejDmMbAwOAOpb8ySDK0MDAwMbByMsCBAAMCBKS5pjA4PGB4wMR44P8BBj3GrQymQGFGkBwAjtgK/gAAeAFjYoAAEA1jAwAAZAAHAHgB3crBCcAwDEPRZydkih567CDdf4ZskmLwFBV8xBfCaC4BXkOUmx4sU0h2ngNb9V0vQCxaRKIAevT7fGWuBrEAAAAAAAAAAAA0AHgAugAAeAF9z79Kw1AUx/FzTm7un6QmJtwmQ5Bg1abgEGr/BAqlU6Gju+Cgg1MkQ/sA7Vj7BOnmO/gUvo2Lo14NqIO6/IazfD8HEODtmQCfoANwNsyp2/GJt3WKQrd1NLiYYWx2PBqOsmJMEOznPOTzfSCrhAtbbLdmeFLJV9eKd63WLrZcIcuaEVdssWCKM6pLCfTVOYbz/0pNSMSZKLIZpvh78sAUH6PlMrreTCabP9r+Z/puPZ2ur/RqpQHgh+MIegCnXeM4MRAPjYN//5tj4ZtTjkFqEdmeMShlEJ7tVAly2TAkx6R68Fl4E/aVvn8JqHFQ4JS1434gXKcuL31dDhzs3YbsEOAd/IU88gAAAHgBfY4xTgMxEEVfkk0AgRCioKFxQYd2ZRtpixxgRU2RfhU5q5VWseQ4JdfgAJyBlmNwAM7ABRhZQ0ORwp7nr+eZAa54YwYg9zm3ynPOeFRe8MCrciXOh/KSS76UV5L/iDmrLiS5AeU519wrL3jmSbkS5115yR2fyivJv9kx0ZMZ2RLZw27q87iNQi8EBo5FSPIMw3HqBboi5lKTGAGDp8FKXWP+t9TU01Lj5His1Ba6uM9dTEMwvrFmbf5GC/q2drW3ruXUhhsCiQOjznFlCzYhHUZp4xp76vsvQh89CQAAeAFjYGJABowM6IANLMrEyMTIzMjCXpyRWJBqZshWXJJYBKOMAFHFBucAAAAAAAAB//8AAngBY2BkYGDgA2IJBhBgAvKZGViBJAuYxwAABJsAOgAAeAFjYGBgZACCk535hiD60tn0azAaAEqpB6wAAA==") format("woff");
  font-weight: 400;
}
```

| Role | Font | Size | Weight |
|---|---|---|---|
| Heading 1 | JudgemeStar | 84px | 700 |
| Heading 2 | JudgemeStar | 72px | 700 |
| Heading 3 | JudgemeStar | 58.8px | 700 |
| Body | JudgemeIcons | 14px | 400 |
| Caption | JudgemeIcons | 16px | 400 |

**Typographic Rules:**
- Limit to 2 font families max per screen
- Use **JudgemeStar** for body/UI text, **JudgemeIcons** for display/headings
- Maintain consistent hierarchy: no more than 3-4 font sizes per screen
- Headings use bold (600-700), body uses regular (400)
- Line height: 1.5 for body text, 1.2 for headings
- Use color and opacity for secondary hierarchy, not additional font sizes


---

## 4. Component Stylings

### Navigation (1)

**Navigation** — `html`

### Data Display (2)

**Badge** — `html`

**List** — `html`

### Data Input (2)

**Button** — `html`
- Variants: `-primary`, `-secondary`
- Animation: 

**Input** — `html`
- State: :focus, :placeholder

### Overlay (1)

**Modal** — `html`

### Media (2)

**Image** — `html`

**Icon** — `html`



---

## 5. Layout Principles

- **Base spacing unit:** 4px
- **Spacing scale:** 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24
- **Border radius:** 2px, 3px, 4px, 5px, 6px, 7px, 8px, 12px, 16px, 20px, 22px, 99px, 100%, 999px, inherit, calc(8px*6)
- **Max content width:** 1299.98px

**Spacing as Meaning:**
| Spacing | Use |
|---|---|
| 4-8px | Tight: related items within a group |
| 12-16px | Medium: between groups |
| 24-32px | Wide: between sections |
| 48px+ | Vast: major section breaks |


---

## 6. Depth & Elevation

### Flat — subtle depth hints

- `inset 0 0 1px #666`
- `inset 0 0 1px #888`
- `0px 2px 2px rgba(0,0,0,0.2)`

### Raised — cards, buttons, interactive elements

- `0 0 0 var(--input-active-shadow-width) var(--input-border-color-active)`
- `0 0 rgba(var(--hotspot-color)/.3)`
- `0 0 0 calc(var(--hotspot-button-size)/4) rgba(var(--hotspot-color)/.3)`

### Floating — dropdowns, popovers, modals

- `0px 4px 16px rgba(0,0,0,0.1)`
- `0px 0px 12.8px 0px rgba(0,0,0,0.15)`
- `4px 0px 20px rgba(0,0,0,0.15)`

### Z-Index Scale

`0, 1, 2, 3, 5, 10, 11, 20, 100, 300, 301, 399, 400, 401, 999, 1041, 1042, 1043, 1045, 1046, 4000, 7000, 8000, 8001, 8002, 10000, 99999999`



---

## 7. Animation & Motion

This project uses **expressive motion**. Animations are an integral part of the experience.

### CSS Animations

- `@keyframes marquee`
- `@keyframes atc-tick-activated`
- `@keyframes galleryViewerSpinner`
- `@keyframes hotspot-pulse`
- `@keyframes clock-pulse`
- `@keyframes circleTimer`
- `@keyframes loadingSpinner`
- `@keyframes reveal`

### Animated Components

- **Button**: 

### Motion Guidelines

- Duration: 150-300ms for micro-interactions, 300-500ms for page transitions
- Easing: `ease-out` for enters, `ease-in` for exits
- Always respect `prefers-reduced-motion`


---

## 8. Do's and Don'ts

### Do's

- Use `#ad0000` for interactive elements (buttons, links, focus rings)
- Use `#020202` as the primary page background
- Pair **JudgemeStar** (body) with **JudgemeIcons** (display) — these are the only allowed fonts
- Follow the **4px** spacing grid for all margins, padding, and gaps
- Use the defined shadow tokens for elevation — see Section 6
- Use border-radius from the scale: 2px, 3px, 4px, 5px, 6px
- Reuse existing components from Section 4 before creating new ones

### Don'ts

- Don't introduce colors outside this palette — extend the design tokens first
- Don't introduce additional font families beyond JudgemeStar and JudgemeIcons
- Don't use arbitrary spacing values — stick to multiples of 4px
- Don't create custom box-shadow values outside the system tokens
- Don't use arbitrary border-radius values — pick from the defined scale
- Don't duplicate component patterns — check Section 4 first
- Don't use backdrop-blur or blur effects

### Anti-Patterns (detected from codebase)

- No blur or backdrop-blur effects
- No zebra striping on tables/lists


---

## 9. Responsive Behavior

| Name | Value | Source |
|---|---|---|
| sm | 36em | css |
| xs | 320px | css |
| xs | 375px | css |
| xs | 400px | css |
| xs | 420px | css |
| xs | 480px | css |
| sm | 500px | css |
| sm | 530px | css |
| sm | 600px | css |
| md | 750px | css |
| md | 767px | css |
| md | 767.98px | css |
| md | 768px | css |
| lg | 769px | css |
| lg | 800px | css |
| lg | 959px | css |
| lg | 960px | css |
| lg | 991px | css |
| lg | 992px | css |
| lg | 999.98px | css |
| lg | 1000px | css |
| lg | 1024px | css |
| xl | 1040px | css |
| xl | 1041px | css |
| xl | 1100px | css |
| xl | 1160px | css |
| xl | 1200px | css |
| xl | 1280px | css |
| 2xl | 1299.98px | css |
| 2xl | 1300px | css |
| 2xl | 1450px | css |

**Approach:** Use `@media (min-width: ...)` queries matching the breakpoints above.


---

## 10. Agent Prompt Guide

Use these as starting points when building new UI:

### Build a Card

```
Background: #333333
Border: 1px solid #4c4c4c
Radius: 16px
Padding: 16px
Font: JudgemeStar
Use shadow tokens from Section 6.
```

### Build a Button

```
Primary: bg #ad0000, text white
Ghost: bg transparent, border #4c4c4c
Padding: 8px 16px
Radius: 16px
Hover: opacity 0.9 or lighter shade
Focus: ring with #ad0000
```

### Build a Page Layout

```
Background: #020202
Max-width: 1299.98px, centered
Grid: 4px base
Responsive: mobile-first, breakpoints from Section 9
```

### Build a Stats Card

```
Surface: #333333
Label: #bbbbbb (muted, 12px, uppercase)
Value: #ffffff (primary, 24-32px, bold)
Status: use success/warning/danger from Section 2
```

### Build a Form

```
Input bg: #020202
Input border: 1px solid #4c4c4c
Focus: border-color #ad0000
Label: #bbbbbb 12px
Spacing: 16px between fields
Radius: 16px
```

### General Component

```
1. Read DESIGN.md Sections 2-6 for tokens
2. Colors: only from palette
3. Font: JudgemeStar, type scale from Section 3
4. Spacing: 4px grid
5. Components: match patterns from Section 4
6. Elevation: shadow tokens
```

## Bundled Fonts (fonts/)

The following font files are bundled in the `fonts/` directory:

- `fonts/GildaDisplay-Regular.ttf`
- `fonts/Muli-500.woff`
- `fonts/Muli-500.woff2`
- `fonts/Muli-600.woff`
- `fonts/Muli-600.woff2`
- `fonts/Muli-700.woff`
- `fonts/Muli-700.woff2`
- `fonts/Muli-Regular.woff`
- `fonts/Muli-Regular.woff2`

Use these local font files in `@font-face` declarations instead of fetching from Google Fonts.

