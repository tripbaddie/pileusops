# Pileus Ops website

The marketing site for Pileus Ops, an AI operations consultancy. Live at https://pileusops.com through GitHub Pages.

## How the site is built

- The whole site is one file: `index.html`. Styles and scripts are inline. There is no build step and no dependencies to install.
- GitHub Pages serves the `main` branch as is. Every push to `main` updates the live site within a minute or two.
- `CNAME` holds the domain. `.nojekyll` tells GitHub Pages to serve files untouched. Leave both alone.
- Fonts load from Google Fonts: Funnel Display (headings), Funnel Sans (body), Geist Mono (labels).

## Pages

Four pages live in the one file as views, switched by the URL hash:

| Hash | View id | What it is |
| --- | --- | --- |
| `#home` (default) | `v-home` | Hero animation, the problem, "ask your company", four steps, questions |
| `#how-it-works` | `v-how-it-works` | Function demo, alternatives, approvals, "then it is yours", questions |
| `#assessment` | `v-assessment` | Two-minute app assessment with a cost calculator |
| `#about` | `v-about` | Why the company exists, what Pileus means, the team |

`route()` in the second script block shows the right view and scrolls to the top. Add a new page by adding a view `div`, its name in `VIEWS`, and a nav link.

## To preview a change

Open `index.html` in a browser, or run `python3 -m http.server` in this folder and visit http://localhost:8000. Check desktop and a phone width (390px) before pushing.

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

- The assessment email form posts to Web3Forms, which forwards each submission to the team inbox. It needs an access key in `FORM_KEY` (second script block). While `FORM_KEY` is empty the form shows a "coming soon" note and sends nothing.
- The form delivers the lead and their answers to the team. It does not email the visitor a report automatically. Someone has to send it.
- The four advisor cards on About have no names, and their descriptions are placeholders.
- Demo data on How it works and the example answers on Home are invented for illustration.

## Sources for the statistics on Home

- 118 apps in the average company: BetterCloud, State of SaaS 2026.
- 36% of paid licenses unused: Zylo, 2026 SaaS Management Index.
- 45 handoffs between 10 apps is arithmetic: every app paired with every other.

## Link preview

`og.png` (1200 by 630) is the image shown when the site is shared. Regenerate it if the headline or logo changes.
