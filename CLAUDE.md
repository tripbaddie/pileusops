# Pileus Ops website

The marketing site for Pileus Ops, an AI operations consultancy. Live at https://pileusops.com through GitHub Pages.

## What the site sells

Read this before changing any copy. The founder's test for every page (25 Nov 2026): "think about what we are selling here, and does it really convey that".

We do not sell task automation, a pile of agents or a cheaper team. We sell one connected system in place of a stack of tools and hires that never talk to each other:

- every function works from the same picture of the company,
- one person sees and controls all of it,
- and the company owns it.

The value is in the connections. Support can answer a customer because it can see their account, their history and what sales promised. Copy that only says "an agent does X" or "automate Y" is off the mark, on any page. So is anything that presents a build as a standalone tool: every workflow, function or app we build is a piece of the same system, and the copy should say so.

How each page carries it:

- **Home:** the apps you already run become one system you control. A Proof section links to the case studies.
- **How it works:** one system, seen from each team's seat. The demo switches teams, not systems.
- **Case studies:** examples of a company run as one system. See its own section below.
- **Pricing:** every build is a piece of the same system, from the first one.
- **Assessment:** the three builds in the result work as one system: each card says how it connects to the others, and a picture under them shows the one record they share.
- **About:** the story of how companies ended up undesigned, and that we run our own this way first.

## How the site is built

Plain HTML, CSS and JavaScript. No build step, no dependencies, nothing to install or compile.

GitHub Pages serves the `main` branch as is, so every push updates the live site within a minute or two.

| File | What it is |
| --- | --- |
| `index.html` | Home |
| `how-it-works/index.html` | How it works |
| `case-studies/index.html` | Case studies |
| `assessment/index.html` | Assessment |
| `about/index.html` | About |
| `pricing/index.html` | Pricing |
| `blueprint/index.html` | The example Blueprint. Linked from Pricing, not in the navigation |
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
| `backend/forms.gs`, `backend/appsscript.json` | A reference copy of the script that sends the forms. See "Sending the forms" |
| `CNAME`, `.nojekyll` | Domain and Pages settings. Leave both alone |

The nine pages share the same `<head>` block, header and footer. They are copied into each file rather than generated, so a change to the navigation or footer means editing all nine (and `404.html`).

## How the pages work

Each page is a real address: `/`, `/how-it-works/`, `/case-studies/`, `/assessment/`, `/about/`, `/pricing/`, `/blueprint/`, `/call/`, `/contact/`. Links between them use those paths, and the current page carries `aria-current="page"` in the header and footer navigation.

The header navigation holds How it works, Case studies, Pricing, Contact and the assessment button. About is in the footer only: the founder had it taken out of the header (25 Nov 2026), so do not add it back. Book a call sits in the footer, on Contact, on the assessment page and under the closing button on Home.

The footer has three columns: the brand and its line, the page links under "Explore", and "Contact" with the email address and the line "Based in Detroit, MI". The email is styled like the page links beside it, with no underline until hover: the founder found the first version, a bold underlined address over a bare "Detroit, MI", not professional looking. The founder asked for the address and the location to be on the site (25 Nov 2026). The public address is contact@pileusops.com, which she chose over a named one. They also appear in the facts list on the Contact page. If either changes, change it in the footer of all ten HTML files and on Contact. The assessment stays the main route in. The call is the alternative to it, never the replacement.

`app.js` runs on every page, so each interactive block is guarded by the element it needs:

- `if (el('qs'))` wraps the home "ask your company" comparison.
- `if (el('ftabs'))` wraps the function demo and the approval example.
- `if (el('assess'))` wraps the assessment, its result and its calculator.
- `if (el('book'))` wraps the booking calendar on Book a call.
- `if (el('cxform'))` wraps the note form on Contact.
- `if (el('est'))` wraps the first-year sum on Pricing.
- `if (el('bpdraw'))` wraps the example Blueprint map, on its own page and in the preview on Pricing.

Add a new page by copying an existing one, changing the head and body, adding it to the navigation in all ten HTML files, and adding it to `sitemap.xml`.

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
- Never sound new. Nothing on the site may suggest Pileus Ops is just starting out: no founding, launch, introductory or early prices, no "first clients", no count of clients we have or have had, no "prices go up later", no "we are taking on". The founder had the founding prices note removed for this reason (25 Nov 2026).
- Never tell a visitor that something on our side is not working, not connected or not set up yet. The founder had "This form is not connected to an inbox yet" removed (25 Nov 2026): "idk why you would ever tell someone something on our end isnt working or set up on a customer facing site". If a feature is not ready, make it work another way or leave it off the page. No "coming soon", no disabled button with an apology under it.

## Known gaps

- **The three forms are built to send through our own script, and it is not switched on yet.** As of 25 Nov 2026 `FORM_URL` is empty: the script is saved in script.google.com and waits on the founder authorising it. Once the script's address is in `FORM_URL`, delete this sentence. See "Sending the forms" below. If `FORM_URL` in `app.js` is ever emptied, the note and the call request fall back to opening the visitor's own email addressed to contact@pileusops.com, and the assessment closes on the Book a call button with no report offered. Never empty `CONTACT_EMAIL` as well.
- Nothing reads anyone's real calendar. A requested time is a request, not a booking. See the next section.
- The four advisor cards on About have no names, and their descriptions are placeholders.
- Demo data on How it works and the example answers on Home are invented for illustration.

## Sending the forms

The assessment, the call request and the contact note all go through `post()` at the top of `app.js`, which posts to `FORM_URL`: a Google Apps Script web app. Its source is `backend/forms.gs` and `backend/appsscript.json`. The copy in this repository is for reference. The live one is in script.google.com, in the Google account that receives pileusops.com mail, under the name "Pileus Ops website forms".

What it does:

- **Assessment (`report`):** emails the visitor a link to their own report, and emails the team the lead with everything they were shown. The founder chose automatic sending over approving each one (25 Nov 2026).
- **Contact (`note`) and Book a call (`call`):** emails the team, with the visitor's address as the reply-to.

Things to know before touching it:

- It sends as jaclyn@pileusops.com under the name "Pileus Ops" (`FROM` in `forms.gs`), and leads and visitors' replies go to contact@pileusops.com (`TEAM`). The founder chose jaclyn@ "for now" (25 Nov 2026) because contact@ was not yet a "Send mail as" address in that Gmail. To switch, add contact@ there first, then change `FROM`.
- Whatever `FROM` is must stay a "Send mail as" address in that Gmail. If it is ever removed, Gmail quietly sends from the account's main address instead, which must never reach a visitor. Empty `FORM_URL` first.
- Its only permission is to send email. It cannot read the mailbox.
- Nothing a visitor types is ever emailed to another person. The report email is fixed copy plus a link, and the link is built from a code the script checks against a strict pattern. Do not add visitor-written text to that email: it would let anyone send their own words from our address.
- The same pattern for the code is in `forms.gs` (`CODE`) and in `app.js` (the `link` check). Change both together.
- It stops at 400 emails a day, and sends one report per address every ten minutes.
- The report email's copy is in `reportText` and `reportHtml` in `forms.gs`. The copy rules above apply to it.
- To change the live script: edit it in script.google.com, then Deploy, Manage deployments, edit the existing deployment and choose a new version. That keeps the same address. A new deployment gets a new address, and `FORM_URL` has to follow.
- The site sends its request as plain text on purpose. Adding a content type header makes the browser ask the script's permission first, and Apps Script cannot answer.

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

`/contact/` is the note form on the left and, on the right, the Book a call card and a short list of facts that starts with the email address and the location. The list holds three facts: the email address, the location and the one business day reply time. The founder had the "Start with the assessment" card removed from this page, and the fifteen minutes, B2B software and services and no hardware facts removed from the list (25 Nov 2026), so do not add them back. The assessment is still one click away in the header. The form posts through the same `post()` helper.

## Case studies

`/case-studies/` has two examples. Never count them in the copy: the founder rejected "Two companies already run this way" (25 Nov 2026) because it reads as if we have only ever worked with two companies. Headlines, descriptions and links say "companies", "examples" or "the case studies", never "two" or "both". The styles are the `.csh`, `.csmap`, `.csout` and `.cslist` rules at the end of `site.css`.

### What the page has to sell

This page is where "What the site sells" (top of this file) was worked out. The founder had it rethought after a draft that read as a list of tasks agents do. Every part of it argues that one point, and a part that only says "an agent does X" does not belong:

1. **Three numbers:** 1 system (made of N agents), the tools it stands in for, and the hours a week to run it.
2. **Without it:** the separate tools and the separate jobs, as dashed chips. Kinds of tool and job titles only, never product names.
3. **With it:** the map. Three layers, top to bottom: what the person in charge sees (blue outline), the agents as one system (dark box, one tile per function), and the shared picture of the company they all run on. One sentence underneath says what the sharing makes possible. Keep it this calm: words only, one dark box, one blue outline.
4. **What one system makes possible:** seven short stories. Each has a label, a headline that states the surprising thing, two or three plain sentences, and a "Draws on" line naming the parts of the company it connects. The "Draws on" line is the point of the story, so never drop it. Prefer stories that cross functions.

The closing section makes the same three claims in three cards: one picture, one person in control, theirs to keep.

### Rules that still hold

- A reader should finish each example thinking "wow, this is really cool". Lead with what they would not expect a small company to have.
- It is a case study, not an analysis. Say what the system does and what the person in charge no longer has to do, not how it works. No tables, no figure against each role, no per-agent descriptions, no lists of vendors, no day-by-day numbers.
- State every number plainly, with no "about" or "give or take". The one small line under the closing cards says the hours are our estimate. Keep it.
- No results line on either example. The founder had the travel app's taken down. Do not add one back without asking her.
- The sales platform's stories are the founder's own account of her setup, including the vendor story. Change the wording, not the claims, unless she says the setup changed. Never name or describe the agency.
- The travel app's stories come from how its agents run. The founder asked for weekly learnings, competitor tracking and social listening to be among them.

Never name either company. Both are companies the founder runs, so the page opens by saying we built this inside our own companies first. They are described as "AI travel planning app" and "AI sales platform". Do not present them as outside clients. Do not name the companies, their people, their customers, their vendors, or anything narrow enough to identify them, on the page or in this file.

Where the numbers come from:

- Agents: each company's list of scheduled tasks as of 25 Nov 2026, 16 and 18. They appear in the summary card at the top, the first number and the map, and all three must agree.
- Tools: the count of chips in that example's "separate tools" card.
- Hours: an estimate the founder asked for, 5 and 6 a week, from a 10 minute read of the morning report plus the daily review of what the agents prepared. They appear in the third number and on the map.

## Pricing

`/pricing/` is the rate card at the top, one section per stage, the first-year sum, and the pricing questions.

These prices are set for a client of about 25 people. The page used to call them "founding prices" for "our first three clients". The founder had that removed (25 Nov 2026): "we dont want them to think we are brand new". Do not bring it back in any form. See the copy rule on never sounding new.

| Stage | Public price | Notes |
| --- | --- | --- |
| Assessment | Free | The form on `/assessment/` |
| Blueprint | $5,000 fixed | 2 weeks. Credited in full toward a function build or a full rollout |
| First build | from $10,000 | 2 to 3 weeks. No Blueprint needed. Called "First workflow" until 25 Nov 2026; the founder renamed it so the entry stage reads as the first piece of one system, not an automation |
| One function | from $25,000 | 6 to 10 weeks |
| Full rollout | No public price | Quoted in the Blueprint |
| You run it | $0 | Training and handover are part of every build |
| We run it | from $1,000 a month | Priced at about a fifth of the build a year, never under $1,000 a month |
| We keep building | from $4,000 a month | Includes everything in We run it |

The prices appear in three places that must agree: the HTML of `pricing/index.html`, the page's meta description, and the `BLUEPRINT`, `BUILD` and `AFTER` values in `app.js` under `if (el('est'))`. The Blueprint price is also on `/blueprint/`, in the page, its meta description and its sub line. The sum covers a first build or one function. For a function it shows the build with the Blueprint credit already taken off.

The Blueprint section carries a short preview of the example Blueprint: the top of the map fading out, the whole card a link to `/blueprint/`. The founder liked the full figure but found it "too much for this page" (25 Nov 2026), so the full version has its own page. See "The example Blueprint" below. The Blueprint's $5,000 price is also stated on that page.

The Build section ends with the capacity line, "Four builds at a time", and the questions explain it. This is the scarcity the founder wanted from the start: a limit on how much we take on at once, which reads as a firm in demand. It got swapped for "founding prices" in an earlier draft, which read as brand new and was removed. The cap is on builds, not on the Blueprint or the monthly plans, so it stays true however many clients we run month to month. Never show how many places are open unless the founder gives a real number.

Do not put a price on the full rollout. A large number beside the entry offers makes the whole page read as expensive.

Clients hold their own accounts with the model providers and pay usage at cost. We do not mark it up.

## The example Blueprint

`/blueprint/` shows what the first paid step produces, so there is a link to send people. It is not in the header or footer navigation. Pricing links to it from the preview in the Blueprint section and from the "Why is the Blueprint paid?" question. The founder asked for "a complex looking map" (25 Nov 2026). The figure has two halves.

- **Where the company is today.** The map, drawn by `app.js` under `if (el('bpdraw'))` from two lists: `LANES`, six teams of apps, and `HAND`, every handoff between two apps, marked as moving on its own, moved by hand, or stuck. The five stuck ones carry numbered pins. It is meant to look dense, since the point is how much a Blueprint covers, but it keeps the brand's calm: grey lines and one blue. Keep each pin on a handoff between neighbouring lanes or neighbouring apps, so it never lands on a label. The counts in its corner are counted from the lists. On a phone it scrolls sideways rather than shrinking. The same code draws the preview on Pricing.
- **Where we would start.** Written in `blueprint/index.html`. The founder asked for the next step so the figure "isnt just a map of existing infrastructure", then had it checked against the lens at the top of this file and made "more of a starting point". So it does not list five fixes. It opens with the one shared record of every customer, in the blue outline, and says every stuck point is the same gap. Then one piece per pin, each built on that record. Each row names the piece, says what it can do because it sees more than its own two apps, and ends in a "Draws on" line that crosses teams. A row that only joins the two apps either side of its pin reads as an automation and fails the lens. The closing line says the pieces are one system and that the Blueprint comes with a fixed quote for the first.

The pin numbers in `HAND` and the rows in the HTML must agree. Number 1 is the lead routing workflow that Pricing gives as its example of a first build. The top bar labels it "Example Blueprint". There is no caption saying it is an example: the founder had it removed as implied. The company on it is invented.

Under the figure the page repeats the three things a client leaves with and the $5,000 price from Pricing. If either changes there, change it here.

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

1. **The map.** `PATHS` holds four paths work takes through a company, each a row of stages with the apps that belong to them: Customers (Leads, Deals, Contract, Onboarding or Delivery, Billing, Support), Money (Quote, Contract, Invoice, Books), Product (Feedback, Roadmap, Build, Launch, Usage) and Team (Hire, Onboard, Work, Pay). Customers always shows. Another path shows as a tab only when the visitor runs apps at two or more of its stages, so nobody gets a map of mostly empty boxes. The tabs are plain names with no counts: the founder disliked a red number on each tab. `UNDER` holds the apps in the Reporting strip beneath every path, and any app that lands on no visible path is listed in an "Also in your stack" line. `S` in the click handler holds every step between stages in an owner's own words ("A new lead reaches sales"), whether it looks covered, and the reason when it is worth a look. A step can sit on two paths, and the headline counts each one once. Never label these as numbered handoffs or call them "connected": the founder read "Handoff 4 to Billed, usually connected" as meaningless. Builds and the close refer to a step by its sentence, not a number. These are rules of thumb from which tools were picked, so a step either "looks covered" or is "worth a look", and the reason says what is common ("Invoices are often raised by hand"), never what this visitor is doing. The founder found "Probably done by hand" in a red box too in your face and too much of an assumption, so there is no red on the map: a step worth a look gets a thin blue outline. The note under the map sends people to the call to confirm.
2. **Questions their apps cannot answer.** `QUESTIONS` holds each question with the apps that hold a piece of it. A question only shows when the visitor picked at least two of those apps, so every app named is one they chose. The question behind their problem (`ASKS`) always comes first.
3. **What it costs.** The numbers sit inside plain sentences ("About 8 people spend 4 hours a week building or chasing reports"), because boxed inputs with labels read as confusing. `COSTS` sets the heading, the wording and the starting numbers from the problem and the team size. The tools figure starts at zero so the total never includes a number we made up.
4. **Three apps they would own, working as one system.** `BUILD` holds twelve builds across the four paths, each written with the visitor's own tools, and `FIXES` says which steps each one fixes. The first build always answers the problem they picked (`FIRST`). The next two are chosen from where that visitor's steps are probably done by hand, on the paths they run, spread across paths before doubling up on one. If nothing else is by hand, the rest of the `FIRST` list for that problem fills in. So two visitors with the same problem and different apps get different builds. Each build says what it could replace from the apps they picked, or that it fills a gap. "Could replace" appears only here, never on the map above: the map shows what they have, and replacement comes up once we are talking about what we would build.

   The three must read as one system, not three more tools, so each card carries a "Connects" line and a picture sits under all three:

   - `LINK` holds every real connection between two builds, keyed `'from>to'` and written for the card of the build that receives ("Bills from the customer record the single intake app creates."). A card shows up to two of these.
   - A build that nothing among the three feeds says what it tells the others instead, from `TELLS` ("Tells the invoicing app who each new customer is.").
   - The dashboard always says it reads the other two.
   - If a build has no honest connection to the other two, its card shows no line. Do not invent one. In testing about one result in eight has one card like this, usually the new hire app or the payment matching app beside unrelated builds.
   - `HELD` names what the three share, by path (Customers, Invoices and payments, Requests and releases, People and hours). It fills the "One shared record of your company" box under the three, followed by the closing line.
   - The same lines go to the team in the emailed fields `how_they_connect` and `shared_record`.

   A new build needs an entry in `BUILD`, `FIXES`, `HOME` and `TELLS`, a place in the pool list in the click handler, and a `LINK` line for each build it really connects to. After changing any of this, run a spread of answers through the form and read every "Connects" line it produces: the three picks vary with what the visitor sells, the apps they run and the problem they choose.
5. **The rest of the stack is open.** Every other app they picked is listed as still to go through together. Never turn this into a keep list.

The close shows the email form when `FORM_URL` is set, and the call button when it is not.

### The report

Pressing "Email me the report" sends the visitor a link, `/assessment/?r=<code>`. The code holds their four answers and their cost numbers, so the page rebuilds their result with nothing stored anywhere. Opened from that link, the page is the report, and it adds the three things the close promises:

- **A page they can share.** A strip at the top says the page is theirs and copies the link. The heading changes to "Your company map." and the page asks search engines not to list it.
- **What each build needs from them.** `NEEDS` in the click handler holds one line per build, shown as "Needs from you" on each card. A new build needs a line here too.
- **The assumptions behind the number.** A list under the cost, rebuilt whenever a number changes. Changing a number also updates the link in the address bar, so a shared link carries the edited figures.

A report closes on the Book a call button, not the email form: they already have it. "Start over" goes back to a clean assessment.

Each app is three characters in the code, made from its name (`KEYS`). Adding or reordering apps does not break old links. Renaming an app drops it from old links, so avoid renaming. The numbers in the code are whole numbers, with hours stored as tenths. If you add an app to `GROUPS`, also add it to a stage in `PATHS` or to `UNDER`, or it only appears in the "Also in your stack" line.

Question 4 names a business problem an owner would recognise, not a specific broken process. Asking someone to diagnose the bottleneck puts the work on them, and the real problem is usually broader than one handoff. Keep any new option at that level.

The options are written for B2B software and services companies. Keep them that way: no retail, manufacturing or field-service tools.

## Sources for the statistics on Home and Pricing

- 118 apps in the average company: BetterCloud, State of SaaS 2026.
- 46% of paid licenses unused (Home and Pricing): Zylo, 2026 SaaS Management Index, checked against zylo.com on 24 Nov 2026. Home said 36% before that check.
- 45 handoffs between 10 apps is arithmetic: every app paired with every other.
- $9,455 median software spend per employee a year (Pricing): Zylo, 2026 SaaS Management Index, checked against zylo.com on 24 Nov 2026.
