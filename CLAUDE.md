# 1Putt Site — Project Notes

Static marketing site for the 1Putt golf alignment tool. Plain HTML/CSS/JS,
no build step, no framework — deploys straight to GitHub Pages.

## Status

Treated by the user as a work-in-progress / inspiration reference, not an
active client deliverable (contrast with the Kathleen & Company project in
the sibling folder, which is live client work). Checkout, email capture,
analytics, and legal pages are intentionally stubbed — see `README.md` in
this repo for the full punch list of what's left before it could take real
orders.

## Infrastructure

- **Live working copy**: `/Volumes/MOVESPEED/Projects/1putt-site` — a real
  git clone of `github.com/MindStimulated/1putt-site`, `main` branch.
  Moved here from Master4T on 2026-09-17. MOVESPEED is ExFAT, so this repo
  has `core.fileMode false` set locally (ExFAT can't preserve Unix
  permission bits, which was making every tracked file show as spuriously
  modified) and `._*` AppleDouble sidecar files are excluded via
  `.git/info/exclude`; both are local-only, not committed.
- **Hosting**: GitHub Pages, `main` branch, `/ (root)`. Live at
  `https://mindstimulated.github.io/1putt-site/`. No custom domain yet —
  README documents how to add one (`CNAME` file) if that changes.
- **Backup location on Master4T**: `/Volumes/Master4T/Projects/1putt-site`
  — superseded duplicate, left in place on purpose after the move above.
  Not touched or kept in sync since. Has its own `SUPERSEDED-BACKUP.md`
  marker at its root; see that file before deleting it.

## Design system (for future edits)

- Concept: "precision instrument catalog" — machined aluminum tool,
  spec-sheet data, alternating graphite/paper sections, sparing red accent
  pulled from the product's own racing-stripe marking.
- Tokens live at the top of `css/styles.css`: a consolidated ink/steel
  color scale (`--ink`, `--ink-2`, `--ink-3`, `--cream`, `--steel`,
  `--steel-2`) plus a `--shadow-sm/md/lg` elevation system — reuse these
  rather than introducing new one-off hex values or shadows.
- Three font families only: `--font-display` (Archivo Expanded, headlines
  + large numerals), `--font-body` (IBM Plex Sans, running text),
  `--font-mono` (IBM Plex Mono, reserved for small structural/spec-sheet
  labels — kickers, step indices — not headline numerals).
- Header, footer, and nav colors are explicitly signed off by the user as
  final — don't restyle them without being asked.
