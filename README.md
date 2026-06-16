# H.P. Industries — Website

Marketing + catalogue site for H.P. Industries (premium aluminium pressure
cookers). Built with **Astro + Tailwind 4** as a **static site**: all content is
**baked into the HTML at build time** from JSON, and **one detail page is
generated per product**. CSS does the work — **JavaScript is used only for
animation and the 360° viewer** (plus a few bytes to remember the theme).

## Quick start

```bash
npm install
npm run dev        # dev server at http://localhost:5173
npm run build      # static build → dist/
npm run preview    # serve the production build
```

## Architecture at a glance

```
src/
├── pages/                      # routes → static HTML
│   ├── index.astro             # Home
│   ├── contact.astro           # Contact (native mailto form, no JS)
│   └── products/
│       ├── index.astro         # Product listing + CSS-only category filter
│       └── [slug].astro        # ← one page generated PER product (getStaticPaths)
├── layouts/Base.astro          # <head>, theme CSS, nav/drawer/footer, global scripts
├── components/                 # Nav, Drawer, Footer, ProductCard, ThemeSelect
├── data/
│   ├── products.json           # the catalogue — single source of truth
│   ├── site.json               # brand, nav, footer, contact, gallery, stats
│   └── themes.json             # the 10 colour themes (default: blue-light)
├── styles/global.css           # Tailwind 4 + @theme tokens + all CSS mechanisms
└── scripts/                    # animation / interaction only (see below)
public/                         # static assets served at site root (/images, /assets)
```

### One HTML page per product (the key bit)

`src/pages/products/[slug].astro` exports `getStaticPaths()`:

```js
export function getStaticPaths() {
  return data.products.map((p) => ({ params: { slug: p.slug }, props: { product: p } }));
}
```

At build, Astro renders that template once per product in `products.json`, writing
`dist/products/contura.html`, `standard.html`, `matka.html`, … with **all content
already in the markup**. Add a product to `products.json` → on the next build it
gets its own page, a card on the listing + home, and related/style links — no HTML
to write.

### CSS does the work — JS only animates

Everything structural is plain HTML/CSS. Pure-CSS interactions (no JS):

| Interaction | Technique |
|---|---|
| Mobile drawer | hidden checkbox + `:checked ~ .drawer` |
| Product category filter + active tab | radio group + sibling selectors |
| Gallery thumbnails | radio group + stacked images, `:checked` swaps opacity |
| Size / add-on selectors | radio / checkbox + `:checked + label` |
| Anatomy auto-loop, hovers | `@keyframes` / `:hover` |
| Theme switch | `html[data-theme="…"]` rules generated from `themes.json` |

JavaScript (in `src/scripts/`, all animation/interaction only, inlined per page):

- `reveal.js` — scroll-reveal + count-up + safety-badge pulse
- `viewer360.js` — drag-to-spin 360° viewer (product pages only)
- `nav.js` — solidify the transparent home nav on scroll
- `theme.js` — persist the theme choice in `localStorage` (the visual switch is CSS)

A no-JS visitor still gets the full site, just without those flourishes.

### Theming

Themes are runtime CSS variables (`--hp-*`). `Base.astro` generates one
`html[data-theme="…"]` block per theme from `themes.json`; Tailwind 4 `@theme`
tokens (`bg-accent`, `text-ink`, …) map onto those variables, so flipping the
`data-theme` attribute repaints the whole site. The choice persists across pages
via the small `theme.js`. Default: **Electric Blue · Light**.

## Original design

The original single-file design components are preserved in `design-source/` for
reference and are not part of the build.
