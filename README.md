# 1Putt — website build

A static, self-contained site. No build step, no framework — plain HTML/CSS/JS,
so it deploys straight to GitHub Pages (or any static host) with zero config.

## File structure

```
index.html          the whole page
css/styles.css       all styling
js/script.js         cart, accordion, and email-capture behavior
assets/              product photography
README.md            this file
```

## 1. Deploy to GitHub Pages

1. Create a new repository (e.g. `1putt-site`) and push these files to the
   `main` branch, with `index.html` at the repo root.
2. In the repo, go to **Settings → Pages**.
3. Under **Build and deployment**, set **Source** to `Deploy from a branch`,
   branch `main`, folder `/ (root)`.
4. Save. GitHub gives you a URL like `https://yourname.github.io/1putt-site/`
   within a minute or two.
5. To use your own domain (e.g. `1puttgolf.com`), add a `CNAME` file at the
   repo root containing just your domain name, and point your domain's DNS
   at GitHub Pages per
   [GitHub's custom domain docs](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site).

That's it for hosting. The harder part is checkout, below.

## 2. Connect real checkout

The cart in `js/script.js` is fully functional as a *cart* — add/remove/quantity,
persisted in the browser, live subtotal, free-shipping threshold — but a static
site has no server to actually charge a card. The `checkoutBtn` click handler
near the bottom of `script.js` is the one place you need to wire up. Three
paths, easiest first:

**Option A — Stripe Payment Links (fastest to launch)**
Create a Payment Link per SKU in the Stripe Dashboard (no code), then in
`script.js` replace the `alert(...)` in the checkout handler with:
```js
window.location.href = "https://buy.stripe.com/your-link-here";
```
Limitation: one flat link per product, so a cart with mixed items needs
Stripe's [adjustable-quantity Checkout Sessions](https://docs.stripe.com/payments/checkout)
instead, which requires a small serverless function (Stripe has a free
Cloudflare Worker / Vercel function template for this).

**Option B — Shopify Buy Button**
If you're already running (or willing to run) a Shopify backend for
inventory, taxes, and shipping — likely the right call once you're past a
few hundred orders a month — embed the Shopify Buy Button SDK and swap the
`data-add-to-cart` buttons to call Shopify's `client.checkout.create()` /
`addLineItems()` instead of the local `addToCart()` function. Shopify then
hosts the actual payment page.

**Option C — Snipcart**
Purpose-built for exactly this situation (static HTML site, real cart and
checkout, no backend to run). Snipcart reads `data-item-*` attributes on
your buttons. It's the smallest lift if you want to keep this exact design
and just swap the plumbing underneath.

Whichever you pick, the visual cart drawer, quantity steppers, and
free-shipping messaging in this build can stay as-is — you're only replacing
what happens when `checkoutBtn` is clicked.

## 3. Before launch, swap in the real content

- [ ] Confirm final pricing in `index.html` (`data-price` attributes in the
      `.price-card` elements, plus the visible `$` amounts) — currently
      $34.99 / $59.99 / $19.99.
- [ ] Replace the announcement bar copy for Black Friday / Cyber Monday /
      Christmas cutoff dates as those windows approach.
- [ ] Swap `assets/product-hero.png` and `assets/product-kit.png` for final
      studio photography if/when it's available — current images are the
      marketing stills already in circulation.
- [ ] Wire the email form in `js/script.js` (`emailForm` submit handler) to
      your actual ESP (Klaviyo, Mailchimp, etc.) instead of the local
      "You're on the list" placeholder.
- [ ] Add real analytics (GA4 or Plausible) before running any paid traffic —
      there's currently none installed.
- [ ] Add a privacy policy / terms page and link them in the footer before
      running paid ads (Meta and Google both require this).

## Design notes

- Palette, type, and layout choices are documented at the top of
  `css/styles.css` — built around a "precision instrument" concept (machined
  aluminum tool, spec-sheet data strip, sparing use of the product's own
  red racing-stripe as an accent) rather than a generic soft-lifestyle golf
  look.
- Fonts are loaded from Google Fonts (Archivo Expanded, IBM Plex Sans, IBM
  Plex Mono) via the `<link>` tags in `index.html`. If you'd rather
  self-host fonts for performance, download the `.woff2` files and swap the
  Google Fonts `<link>` for local `@font-face` rules.
- Cart state uses `localStorage`, so it's per-browser only — this is
  expected and fine; it's not meant to be a source of truth once real
  checkout is wired in.
