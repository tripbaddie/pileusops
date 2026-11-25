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
| `pricing/index.html` | Pricing |
| `call/index.html` | Book a call |
| `contact/index.html` | Contact |
| `404.html` | Shown for any address that does not exist |
| `site.css` | Every style on the site |
| `brand.js` | Team colours, icons and two helpers. Loaded by every page |
| `hero.js` | The home page hero animation. Loaded by home only |
| `app.js` | Everything else interactive. Loaded by every page |
| `og.png` | The image shown when a link to the site is shared |
| `favicon.svg` | The browser tab icon |
| `sitemap.xml`, `robots.txt` | For search engines. Add any new page to the sitemap |
| `CNAME`, `.nojekyll` | Domain and Pages settings. Leave both alone |

The seven pages share the same `<head>` block, header and footer. They are copied into each file rather than generated, so a change to the navigation or footer means editing all seven (and `404.html`).

## How the pages work

Each page is a real address: `/`, `/how-it-works/`, `/assessment/`, `/about/`, `/pricing/`, `/call/`, `/contact/`. Links between them use those paths, and the current page carries `aria-current="page"` in the header and footer navigation.

The header navigation holds How it works, Pricing, About, Contact and the assessment button. Book a call sits in the footer, on Contact, on the assessment page and under the closing button on Home. The assessment stays the main route in. The call is the alternative to it, never the replacement.

`app.js` runs on every page, so each interactive block is guarded by the element it needs:

- `if (el('qs'))` wraps the home "ask your company" comparison.
- `if (el('ftabs'))` wraps the function demo and the approval example.
- `if (el('assess'))` wraps the assessment, its result and its calculator.
- `if (el('book'))` wraps the booking calendar on Book a call.
- `if (el('cxform'))` wraps the note form on Contact.
- `if (el('est'))` wraps the first-year sum on Pricing.

Add a new page by copying an existing one, changing the head and body, adding it to the navigation in all eight HTML files, and adding it to `sitemap.xml`.

The site used to be one file with `#hash` addresses. `app.js` still redirects those old links to the right page.

## After changing a script or a style

Run `./bump`. It stamps `?v=<timestamp>` onto every page's CSS and JS link, so returning
visitors get the new file instead of the copy their browser cached. Skip it and your change
is live but invisible to anyone who has already seen the site.

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
- Never list tools a client would keep. People come to us to offset what their tools cost, and a keep list puts them off. Replacement candidates may be named, always as "could replace", and the rest of the stack stays open: any tool can be connected as it is or rebuilt as an app the client owns, decided with them one tool at a time.
- Staying on after launch is optional. Do not imply the client must keep us.
- Examples must show the insight and the action taken, not the insight alone.
- Name the thing we would build, then say what it does: "A routing workflow that sends each new lead to the right rep by source." A platform, a tool or a workflow, never a bare outcome with no object in it. This holds for the report cards on How it works and the result of the assessment.
- We do not do hardware. The client's existing provider keeps that.

## Known gaps

- **All three forms are switched off until someone fills in one value.** The assessment, the call request and the contact note all go through `post()` at the top of `app.js`. Set `FORM_KEY` to a free Web3Forms access key and every form delivers to that inbox. Or set `CONTACT_EMAIL` and the forms open the visitor's own mail app with every answer filled in. With neither set, the send buttons are disabled and the pages say so. Both values are safe in public code.
- The forms deliver the lead and their answers to the team. They do not email the visitor a report automatically. Someone has to send it.
- Nothing reads anyone's real calendar. A requested time is a request, not a booking. See the next section.
- The four advisor cards on About have no names, and their descriptions are placeholders.
- Demo data on How it works and the example answers on Home are invented for illustration.

## Book a call

`/call/` offers a day, then a free time, then a short form. All of it is in `app.js` under `if (el('book'))`, and the whole thing is driven by the `CAL` object at the top of that block:

- `minutes` is the length of the call, and the step between times. It is 15. The Why fifteen minutes section on that page carries the belief behind the length: time is the one resource a company cannot make more of, and working with intention and focus is how you protect it. The short call is that belief applied to our own first meeting, not a scheduling convenience. Keep it to three short lines, and change the copy if the length changes.
- `tz` is the timezone the hours are written in. Everything else converts from it.
- `hours` is keyed 0 Sunday to 6 Saturday, with ranges on a 24 hour clock.
- `lead` is the hours of notice before the earliest time a visitor can pick.
- `horizon` is how far ahead anyone can book, in days.
- `off` takes a whole day as `'2026-12-25'` or a single time as `'2026-12-02 10:00'`, both in `tz`.

Times are generated in `tz` and then grouped by the **visitor's** own date, so someone in another timezone sees them on the day their own clock says. Daylight saving is handled by reading the real offset for each date, so the hours above never need touching twice a year.

Because nothing reads a real calendar, two people can ask for the same time, and a time that is already booked still shows as free. Keep `off` current, or swap the picker for a booking service that syncs a calendar.

On success the visitor gets a tentative `.ics` hold, not an invite. The copy says the time is confirmed by email, so do not change it to sound like a confirmed booking.

## Contact

`/contact/` is the note form on the left and the two other routes on the right: book a call, and start the assessment. The form posts through the same `post()` helper.

## Pricing

`/pricing/` is the rate card at the top, one section per stage, the first-year sum, and the pricing questions.

These are launch prices, set for a first client of about 25 people. The page calls them founding prices for the first three clients, so raise them once three are signed.

| Stage | Public price | Notes |
| --- | --- | --- |
| Assessment | Free | The form on `/assessment/` |
| Blueprint | $5,000 fixed | 2 weeks. Credited in full toward a function build or a full rollout |
| First workflow | from $10,000 | 2 to 3 weeks. No Blueprint needed |
| One function | from $25,000 | 6 to 10 weeks |
| Full rollout | No public price | Quoted in the Blueprint |
| You run it | $0 | Training and handover are part of every build |
| We run it | from $1,000 a month | Priced at about a fifth of the build a year, never under $1,000 a month |
| We keep building | from $4,000 a month | Includes everything in We run it |

The prices appear in three places that must agree: the HTML of `pricing/index.html`, the page's meta description, and the `BLUEPRINT`, `BUILD` and `AFTER` values in `app.js` under `if (el('est'))`. The sum covers a first workflow or one function. For a function it shows the build with the Blueprint credit already taken off.

Do not put a price on the full rollout. A large number beside the entry offers makes the whole page read as expensive.

Clients hold their own accounts with the model providers and pay usage at cost. We do not mark it up.

## The assessment

Four questions, all in `app.js` under `if (el('assess'))`:

1. What do you sell: `SELLS`. Software, Services or Both.
2. Which apps do you run: `GROUPS`, 31 apps in six teams. Each option is the name of a software category a B2B company would recognise buying, a platform or a tool, not an activity. "Billing and invoicing", not "we send invoices". Each team gets a coloured dot from the brand palette, so the picker looks the way the sprawl happened. `APPS` is the flattened list the rest of the code uses.
3. How many people: `SIZES`, which also sets the headcount the cost calculator starts from.
4. Which of these sounds most like your company: `PROBLEMS`. Each entry starts with the problem in the owner's words. The two build sentences after it are no longer shown; the result now builds its own from `FIRST` and `BUILD`.

Each of those answers names the thing we would build, a platform, a tool or a workflow, then
says what it does. "A company dashboard that...", "An onboarding workflow that...". Not a
description of an outcome with no object in it.

### The result

The result is built in the same block when the visitor presses Show my map. It is not a list of their answers. It has five parts, in this order:

1. **The map.** `STAGES` places every app at one of six stages a customer passes through (Lead, Deal, Signed, Live or Delivered, Billed, Supported), and `UNDER` holds the apps that sit beneath all of them. `HO` in the click handler decides each of the six handoffs: usually connected, or probably by hand with a reason. These are rules of thumb from which tools were picked, so the copy always says "usually" and "probably", and the note under the map sends people to the call to confirm.
2. **Questions their apps cannot answer.** `QUESTIONS` holds each question with the apps that hold a piece of it. A question only shows when the visitor picked at least two of those apps, so every app named is one they chose. The question behind their problem (`ASKS`) always comes first.
3. **What it costs.** `COSTS` sets the heading, the labels and the starting numbers from the problem and the team size. The fourth input, tools they would like to stop renting, starts at zero so the figure never includes a number we made up.
4. **Three apps they would own.** `FIRST` orders the builds by problem and `BUILD` writes each one. Each says what it could replace from the apps they picked, or that it fills a gap. Those apps carry a "Could replace" tag on the map.
5. **The rest of the stack is open.** Every other app they picked is listed as still to go through together. Never turn this into a keep list.

The close shows the email form when the forms are on, and the call button when they are not. If you add an app to `GROUPS`, also add it to `STAGES` or `UNDER`, or it will not appear on the map.

Question 4 names a business problem an owner would recognise, not a specific broken process. Asking someone to diagnose the bottleneck puts the work on them, and the real problem is usually broader than one handoff. Keep any new option at that level.

The options are written for B2B software and services companies. Keep them that way: no retail, manufacturing or field-service tools.

## Sources for the statistics on Home and Pricing

- 118 apps in the average company: BetterCloud, State of SaaS 2026.
- 46% of paid licenses unused (Home and Pricing): Zylo, 2026 SaaS Management Index, checked against zylo.com on 24 Nov 2026. Home said 36% before that check.
- 45 handoffs between 10 apps is arithmetic: every app paired with every other.
- $9,455 median software spend per employee a year (Pricing): Zylo, 2026 SaaS Management Index, checked against zylo.com on 24 Nov 2026.
