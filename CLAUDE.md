# Pileus Ops website

The marketing site for Pileus Ops, an AI operations consultancy. Live at https://pileusops.com through GitHub Pages.

## How the site is built

Plain HTML, CSS and JavaScript. No build step, no dependencies, nothing to install or compile.

GitHub Pages serves the `main` branch as is, so every push updates the live site within a minute or two.

| File | What it is |
| --- | --- |
| `index.html` | Home |
| `how-it-works/index.html` | How it works |
| `assessment/index.html` | Assessment |
| `about/index.html` | About |
| `404.html` | Shown for any address that does not exist |
| `site.css` | Every style on the site |
| `brand.js` | Team colours, icons and two helpers. Loaded by every page |
| `hero.js` | The home page hero animation. Loaded by home only |
| `app.js` | Everything else interactive. Loaded by every page |
| `og.png` | The image shown when a link to the site is shared |
| `favicon.svg` | The browser tab icon |
| `sitemap.xml`, `robots.txt` | For search engines. Add any new page to the sitemap |
| `CNAME`, `.nojekyll` | Domain and Pages settings. Leave both alone |

The four pages share the same `<head>` block, header and footer. They are copied into each file rather than generated, so a change to the navigation or footer means editing all four (and `404.html`).

## How the pages work

Each page is a real address: `/`, `/how-it-works/`, `/assessment/`, `/about/`. Links between them use those paths, and the current page carries `aria-current="page"` in the header and footer navigation.

`app.js` runs on all four pages, so each interactive block is guarded by the element it needs:

- `if (el('qs'))` wraps the home "ask your company" comparison.
- `if (el('ftabs'))` wraps the function demo and the approval example.
- `if (el('assess'))` wraps the assessment and its calculator.

Add a new page by copying an existing one, changing the head and body, adding it to the navigation in all five HTML files, and adding it to `sitemap.xml`.

The site used to be one file with `#hash` addresses. `app.js` still redirects those old links to the right page.

## To preview a change

Run `python3 -m http.server` in this folder and visit http://localhost:8000. Opening a file directly also works, but the `/` links will not.

Check desktop and a phone width (390px) before pushing.

## Brand rules

- Name: Pileus Ops. Wordmark is lowercase "pileus ops", with "pileus" bold and "ops" lighter.
- Label: "Operations for the AI era". Do not use "IT" to describe the company.
- The mushroom mark has a dark cap with three white dots and five colored stripes. Do not redraw it.
- Logo colors: purple `#8F2BFF`, blue `#0A3BFF`, yellow `#FFC400`, green `#00B050`, red `#FF2B2B`. Ink is `#0B1220`, page background `#F7F7F4`.
- Keep it calm. The founder's most common feedback is "too busy" or "hard to read". One thing moves at a time. Prefer grey shapes with a single blue accent over many colors.

## Copy rules

- No em-dashes anywhere.
- Short paragraphs. Confident, benefit-led marketing copy without stacked caveats.
- Never say which tools a client keeps and which get replaced. The line is: we can work with existing tools, or replace any of them with a custom solution.
- Staying on after launch is optional. Do not imply the client must keep us.
- Examples must show the insight and the action taken, not the insight alone.
- We do not do hardware. The client's existing provider keeps that.

## Known gaps

- The assessment email form posts to Web3Forms, which forwards each submission to the team inbox. It needs an access key in `FORM_KEY` near the end of `app.js`. While `FORM_KEY` is empty the form shows a "coming soon" note and sends nothing.
- The form delivers the lead and their answers to the team. It does not email the visitor a report automatically. Someone has to send it.
- The four advisor cards on About have no names, and their descriptions are placeholders.
- Demo data on How it works and the example answers on Home are invented for illustration.

## Sources for the statistics on Home

- 118 apps in the average company: BetterCloud, State of SaaS 2026.
- 36% of paid licenses unused: Zylo, 2026 SaaS Management Index.
- 45 handoffs between 10 apps is arithmetic: every app paired with every other.
