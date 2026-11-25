# Pileus Ops website

The website for Pileus Ops, served at [pileusops.com](https://pileusops.com) by GitHub Pages.

Plain HTML, CSS and JavaScript with no build step. Each page has its own address:

| Address | File |
| --- | --- |
| `/` | `index.html` |
| `/how-it-works/` | `how-it-works/index.html` |
| `/case-studies/` | `case-studies/index.html` |
| `/assessment/` | `assessment/index.html` |
| `/about/` | `about/index.html` |

Styles live in `site.css` and the scripts in `brand.js`, `hero.js` and `app.js`.

To preview, run `python3 -m http.server` in this folder and open http://localhost:8000. Push to `main` and the live site updates.

See `CLAUDE.md` for how the pages fit together, plus the brand and copy rules.
