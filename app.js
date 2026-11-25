// every page: reveal on scroll, the question boxes, the function demo and the assessment
(() => {
  const calm = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const el = id => document.getElementById(id);
  // links shared before the site had real page addresses still land in the right place
  const OLD = { 'how-it-works': '/how-it-works/', assessment: '/assessment/', about: '/about/' };
  const old = OLD[location.hash.slice(1)];
  if (old && location.pathname === '/'){ location.replace(old); return; }
  // a sixth function for the demo page
  C.prod = '#00A3BF'; GLY.prod = '#fff'; GLYPH.prod = '<path d="M10 3l6 3.4v7.2L10 17l-6-3.4V6.4z"/><path d="M4.2 6.5L10 9.9l5.8-3.4M10 9.9V17"/>';
  const action = ([text, st]) => `<small>Action</small><p>${text}</p><span class="st ${st}">${st === 'ask' ? 'You approve' : 'Done'}</span>`;
  const tag = ([name, g]) => `<span class="src on" style="--c:${C[g]}">${glyph(g, C[g])}${name}</span>`;

  // ---- the forms: the assessment, the call request and the contact note all deliver the same way
  // FORM_KEY is a Web3Forms access key. It is safe to keep in public code. Get a free one at web3forms.com.
  // CONTACT_EMAIL is the fallback: with no key, a form opens the visitor's mail app with everything filled in.
  // Set either one and all three forms work. With neither set they say so instead of pretending to send.
  const FORM_KEY = '';
  const CONTACT_EMAIL = '';
  const LIVE = !!(FORM_KEY || CONTACT_EMAIL);
  // returns 'sent' when the inbox has it, 'mail' when the visitor's mail app took over, 'off' when neither is set
  async function post(subject, fields){
    if (!FORM_KEY){
      if (!CONTACT_EMAIL) return 'off';
      const body = Object.entries(fields).filter(([, v]) => v !== '' && v != null).map(([k, v]) => `${k.replace(/_/g, ' ')}: ${v}`).join('\n');
      location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      return 'mail';
    }
    const r = await fetch('https://api.web3forms.com/submit', { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(Object.assign({ access_key: FORM_KEY, subject, from_name: 'Pileus Ops website' }, fields)) });
    const j = await r.json().catch(() => ({}));
    if (!r.ok || j.success === false) throw new Error(j.message || 'send failed');
    return 'sent';
  }

  // sections ease in as they arrive
  const io = 'IntersectionObserver' in window ? new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting){ e.target.classList.add('seen'); io.unobserve(e.target); } }), { threshold: 0.12 }) : null;
  document.querySelectorAll('.rv').forEach(n => io ? io.observe(n) : n.classList.add('seen'));

  // ---- a question box: the question types itself, the sources light up, then the answer lands
  function askBox(qs, askQ, askS, askA, askX){
    let list = [], btns = [], timers = [];
    function load(items){ timers.forEach(clearTimeout); timers = []; list = items; qs.innerHTML = ''; askQ.textContent = ''; askS.innerHTML = ''; askA.classList.remove('show'); askA.textContent = ''; askX.classList.remove('show'); askX.innerHTML = '';
      btns = items.map((x, i) => { const b = document.createElement('button'); b.type = 'button'; b.textContent = x.q; b.setAttribute('aria-pressed', 'false'); b.addEventListener('click', () => ask(i)); qs.appendChild(b); return b; }); }
    function ask(i){
      timers.forEach(clearTimeout); timers = []; const x = list[i];
      btns.forEach((b, k) => b.setAttribute('aria-pressed', k === i));
      askS.innerHTML = '<em>Reading</em>' + x.src.map(tag).join(''); const chips = [...askS.querySelectorAll('.src')];
      askA.classList.remove('show'); askX.classList.remove('show'); askX.innerHTML = action(x.act);
      if (calm){ askQ.textContent = x.q; askA.textContent = x.a; askA.classList.add('show'); askX.classList.add('show'); return; }
      chips.forEach(c => c.classList.remove('on')); askQ.textContent = '';
      [...x.q].forEach((ch, k) => timers.push(setTimeout(() => { askQ.textContent += ch; }, k * 22)));
      const t = x.q.length * 22 + 250;
      chips.forEach((c, k) => timers.push(setTimeout(() => c.classList.add('on'), t + k * 280)));
      timers.push(setTimeout(() => { askA.textContent = x.a; askA.classList.add('show'); }, t + chips.length * 280 + 220));
      timers.push(setTimeout(() => askX.classList.add('show'), t + chips.length * 280 + 900));
    }
    return { load, ask };
  }

  if (el('qs')){   // home page only
    // ---- home: the same question, asked of each tool's own AI and then of one system
    const VS = [
      { q: 'Which customers are at risk this quarter?', a: 'Three accounts. Usage is down, tickets are up, and each one renews within 60 days.', src: [['Help desk', 'cs'], ['CRM', 'sales'], ['Billing', 'fin']], act: ['A check-in from each account owner is drafted, with the usage numbers attached.', 'ask'],
        parts: [['CRM', 'sales', 'Four accounts have had no activity in 30 days.', 'I can\'t see their tickets or usage.'], ['Help desk', 'cs', 'Nine accounts opened more tickets this month.', 'I can\'t see who is up for renewal.'], ['Billing', 'fin', 'Twelve renewals are due within 60 days.', 'I can\'t see who is unhappy.']] },
      { q: 'Where is my team stretched thin?', a: 'Delivery. Three people are booked past full through March, and two kickoffs have no owner.', src: [['Project tracker', 'ops'], ['Scheduling', 'ops'], ['CRM', 'sales']], act: ['Two kickoffs are moved to next week, and a contractor request is drafted.', 'ask'],
        parts: [['Project tracker', 'ops', 'Delivery has 14 open projects.', 'I can\'t see what sales is about to close.'], ['Scheduling', 'ops', 'Three people are booked past full.', 'I can\'t see which projects are slipping.'], ['CRM', 'sales', 'Six deals should close this month.', 'I can\'t see who is free to deliver them.']] },
      { q: 'What slipped through the cracks this week?', a: 'Two things. A renewal quote was never sent, and a new client has no kickoff date.', src: [['CRM', 'sales'], ['Project tracker', 'ops'], ['Help desk', 'cs']], act: ['The quote is drafted, and the client has three kickoff dates to choose from.', 'ask'],
        parts: [['CRM', 'sales', 'One renewal has no quote attached.', 'I can\'t see whether it went out another way.'], ['Project tracker', 'ops', 'One new client has no kickoff date.', 'I can\'t see when the deal closed.'], ['Help desk', 'cs', 'Two tickets mention a missing quote.', 'I can\'t see which deal they belong to.']] },
      { q: 'Which tools are we paying for and not using?', a: 'Six. Two have had no logins in 90 days, and four overlap with something you already own.', src: [['Billing', 'fin'], ['Reporting', 'fin'], ['Team chat', 'ops']], act: ['Cancellation notices are drafted for the two unused tools, worth $640 a month.', 'ask'],
        parts: [['Billing', 'fin', 'You pay for 34 tools.', 'I can\'t see whether anyone logs in.'], ['Team chat', 'ops', 'Eleven tools post updates here.', 'I can\'t see what each one costs.'], ['Reporting', 'fin', 'Six tools feed no report.', 'I can\'t see their contracts.']] },
      { q: 'What are customers asking for most?', a: 'Faster onboarding. It comes up in a third of tickets and half of your lost deals.', src: [['Help desk', 'cs'], ['Surveys', 'cs'], ['CRM', 'sales']], act: ['A summary went to the product team, and those customers are tagged for the next release note.', 'done'],
        parts: [['Help desk', 'cs', 'Onboarding is the top ticket topic.', 'I can\'t see which deals were lost over it.'], ['Surveys', 'cs', 'Speed is the most common complaint.', 'I can\'t see which accounts said it.'], ['CRM', 'sales', 'Half of lost deals cite a slow start.', 'I can\'t see the support tickets.']] }
    ];
    const vq = el('qs'), vQ = el('askQ'), vP = el('askP'), vA = el('askA'), vS = el('askS'); let vT = [];
    const vBtns = VS.map((x, i) => { const b = document.createElement('button'); b.type = 'button'; b.textContent = x.q; b.setAttribute('aria-pressed', 'false'); b.addEventListener('click', () => versus(i)); vq.appendChild(b); return b; });
    function versus(i){
      vT.forEach(clearTimeout); vT = []; const x = VS[i];
      vBtns.forEach((b, k) => b.setAttribute('aria-pressed', k === i));
      vP.innerHTML = x.parts.map(([n, g, sees, cant]) => `<div class="part" style="--c:${C[g]}"><b>${glyph(g, C[g])}${n} assistant</b><p>${sees} <em>${cant}</em></p></div>`).join('');
      vS.innerHTML = '<em>Reads</em>' + x.src.map(tag).join(''); vA.textContent = x.a; el('askX').innerHTML = action(x.act);
      const parts = [...vP.children], whole = vA.closest('.whole');
      if (calm){ vQ.textContent = x.q; parts.forEach(p => p.classList.add('on')); whole.classList.add('on'); return; }
      whole.classList.remove('on'); vQ.textContent = '';
      [...x.q].forEach((ch, k) => vT.push(setTimeout(() => { vQ.textContent += ch; }, k * 20)));
      const t = x.q.length * 20 + 250;
      parts.forEach((p, k) => vT.push(setTimeout(() => p.classList.add('on'), t + k * 520)));
      vT.push(setTimeout(() => whole.classList.add('on'), t + parts.length * 520 + 350));
    }
    if (io){ const once = new IntersectionObserver(es => { if (es[0].isIntersecting){ versus(0); once.disconnect(); } }, { threshold: 0.35 }); once.observe(vQ.closest('.answer')); } else versus(0);
  }

  if (el('ftabs')){   // how it works page only
    // ---- how it works: approving is one click, and it lands in the log
    const wait = el('wait'), log = el('log');
    const settle = (label, head, text, line) => { wait.classList.add('done'); wait.querySelector('small').textContent = label; el('waitH').textContent = head; el('waitP').textContent = text; el('waitB').hidden = true; wait.parentNode.querySelector('.note').textContent = 'Example.';
      const li = document.createElement('li'); li.className = 'new'; li.style.setProperty('--c', 'var(--ink)'); li.innerHTML = `<time>9:16</time><span>${line}</span><em>You</em>`; log.appendChild(li); };
    el('approve').addEventListener('click', () => settle('Approved', 'Invoice sent to Acme Co.', 'Nothing else is waiting for you.', 'Invoice approved and sent'));
    el('editFirst').addEventListener('click', () => settle('Held', 'Invoice held for your edits', 'Nothing is sent until you approve it.', 'Invoice held for edits'));

    // ---- how it works: pick a function, see its reports, its daily report and what you can ask it (all example data)
    const FUNCS = [
      { g: 'mkt', name: 'Marketing',
        reports: [
          { t: 'Leads by source', act: 'A routing workflow that sends each new lead to the right rep by source.', k: '312', c: 'leads this month', bars: [['Email', 100, '118'], ['Webinar', 78, '92'], ['Search', 55, '65'], ['Social', 31, '37']] },
          { t: 'Funnel', act: 'A follow-up workflow that chases any lead still sitting after 3 days.', k: '4.2%', c: 'visitor to lead', bars: [['Visitors', 100, '7,430'], ['Leads', 42, '312'], ['Qualified', 24, '96'], ['Customers', 11, '21']] },
          { t: 'Cost per lead', act: 'A spend alert that tells you the day cost per lead rises 15%.', k: '$61', c: 'down $8 this month', line: [82, 78, 80, 74, 70, 71, 66, 61] }
        ],
        daily: { head: '14 new leads, and paid search needs a look.', nums: [['14', 'New leads', '+3', 1], ['4.2%', 'Conversion', '+0.4 pt', 1], ['$61', 'Cost per lead', '-$8', 1]],
          what: ['Most new leads came from the March webinar replay.', 'Paid search spend rose 12% with no change in leads.', 'Eleven leads were scored and routed to sales overnight.'],
          need: 'Two ad groups have had no leads in 14 days. Pause them?', health: 'All forms and tracking are working.' },
        qa: [
          { q: 'What is our conversion rate this month?', a: '4.2% from visitor to lead, up from 3.8% last month. The webinar replay page converts best, at 9.1%.', src: [['Website', 'mkt'], ['Forms', 'mkt']], act: ['A test using that page layout is set up on your two weakest pages.', 'ask'] },
          { q: 'Which channel deserves more budget?', a: 'Email. It costs $22 a lead against $61 overall, and those leads close faster.', src: [['Email marketing', 'mkt'], ['CRM', 'sales']], act: ['A plan moving $1,500 a month from paid search to email is drafted.', 'ask'] },
          { q: 'What content brings in our best customers?', a: 'The pricing guide. Its readers are twice as likely to become customers.', src: [['Website', 'mkt'], ['CRM', 'sales'], ['Billing', 'fin']], act: ['The pricing guide is now part of the follow-up every new lead receives.', 'done'] },
          { q: 'Which campaigns should we stop?', a: 'Two paid search groups. They spent $1,900 in 14 days and produced no leads.', src: [['Ads', 'mkt'], ['Forms', 'mkt']], act: ['Both groups are set to pause as soon as you approve.', 'ask'] }
        ] },
      { g: 'sales', name: 'Sales',
        reports: [
          { t: 'Pipeline by stage', act: 'A stalled-deal workflow that flags each one to its owner every morning.', k: '$1.24M', c: 'open pipeline', bars: [['Discovery', 100, '$480K'], ['Proposal', 71, '$340K'], ['Contract', 58, '$280K'], ['Verbal', 29, '$140K']] },
          { t: 'Follow-ups due', act: 'A follow-up drafter that writes each one and holds it for your send.', k: '17', c: 'due today', rows: [['Northwind Supply', '12 days quiet'], ['Harbor & Pine', '10 days quiet'], ['Juniper Labs', 'Proposal opened']] },
          { t: 'Win rate', act: 'A win-loss tracker that records why each deal went the way it did, without asking reps.', k: '31%', c: 'up 4 points this quarter', line: [24, 26, 25, 27, 29, 28, 30, 31] }
        ],
        daily: { head: 'Two deals moved to contract. One is stuck in legal.', nums: [['6', 'Deals moved', '+2', 1], ['$84K', 'New pipeline', '+$21K', 1], ['17', 'Follow-ups due', '+5', 0]],
          what: ['Two deals moved to contract.', 'One deal has sat in legal review for 9 days.', 'Three inbound leads were qualified and assigned overnight.'],
          need: 'The Northwind proposal has one unusual payment term. Approve it?', health: 'CRM is in sync. No record is missing an owner.' },
        qa: [
          { q: 'Who in my CRM requires a follow-up?', a: 'Seventeen contacts. Six have gone 10 or more days without a reply.', src: [['CRM', 'sales'], ['Email', 'sales']], act: ['All 17 follow-ups are drafted in each rep\'s own voice.', 'ask'] },
          { q: 'Which deals are at risk this quarter?', a: 'Four deals worth $210K. None has had any activity in two weeks.', src: [['CRM', 'sales'], ['Calendar', 'sales']], act: ['Each owner got the last conversation and a suggested next step.', 'done'] },
          { q: 'What is our win rate by source?', a: 'Referrals win 48% of the time. Paid search wins 12%.', src: [['CRM', 'sales'], ['Forms', 'mkt']], act: ['Referral leads now go to the top of every rep\'s queue.', 'done'] },
          { q: 'How long is our sales cycle?', a: '41 days on average, down from 47. Proposals are where deals wait longest.', src: [['CRM', 'sales'], ['Proposals', 'sales']], act: ['Proposal reminders now go out on day 3 instead of day 7.', 'done'] }
        ] },
      { g: 'prod', name: 'Product',
        reports: [
          { t: 'Where users drop off', act: 'A drop-off workflow that sends a help guide to anyone who stalls.', k: '37%', c: 'leave at "Connect your data"', bars: [['Sign up', 100, '100%'], ['Set up', 81, '81%'], ['Connect data', 51, '51%'], ['First report', 44, '44%']] },
          { t: 'Feature use', act: 'A usage monitor that flags unused features for a tip or for removal.', k: '6%', c: 'opened custom reports', bars: [['Dashboards', 100, '92%'], ['Exports', 63, '58%'], ['Alerts', 37, '34%'], ['Custom reports', 7, '6%']] },
          { t: 'Top requests', act: 'A request grouper that bundles them by theme and sends product one brief a week.', k: '22', c: 'asks for bulk editing', rows: [['Bulk editing', '22 requests'], ['Faster onboarding', '17 requests'], ['Slack alerts', '9 requests']] }
        ],
        daily: { head: 'Onboarding completion fell after Tuesday\'s release.', nums: [['1,284', 'Active users', '+2%', 1], ['63%', 'Onboarding done', '-4 pt', 0], ['9', 'New feedback', '+3', 1]],
          what: ['Drop-off rose at "Connect your data" after Tuesday\'s release.', 'Exports were used by 40% more accounts.', 'Nine pieces of feedback were tagged and grouped.'],
          need: 'Review Tuesday\'s change to the "Connect your data" step.', health: 'No errors above normal.' },
        qa: [
          { q: 'Where are users getting stuck in my platform?', a: 'At "Connect your data." 37% leave there, up from 29% before Tuesday\'s release.', src: [['Product analytics', 'prod'], ['Help desk', 'cs']], act: ['A ticket with the drop-off data is filed for product, and the users who stalled got a help guide.', 'done'] },
          { q: 'Which features go unused?', a: 'Custom reports. Only 6% of accounts opened them in the last 30 days.', src: [['Product analytics', 'prod']], act: ['An in-app tip introducing custom reports is drafted.', 'ask'] },
          { q: 'What are users asking for most?', a: 'Bulk editing. It appears in 22 requests this quarter, mostly from your largest accounts.', src: [['Help desk', 'cs'], ['Surveys', 'cs'], ['CRM', 'sales']], act: ['All 22 requests are grouped into one brief, with the accounts attached.', 'done'] },
          { q: 'Did the last release help or hurt?', a: 'Mixed. Exports are up 40%, but onboarding completion fell 4 points.', src: [['Product analytics', 'prod'], ['Release notes', 'prod']], act: ['A note recommending a rollback of the onboarding change is drafted for your team.', 'ask'] }
        ] },
      { g: 'ops', name: 'Operations',
        reports: [
          { t: 'Team capacity', act: 'A capacity workflow that routes new work to whoever has room.', k: '91%', c: 'of hours booked', bars: [['Delivery', 100, '112%'], ['Support', 76, '85%'], ['Design', 70, '78%'], ['Onboarding', 58, '65%']] },
          { t: 'Projects on track', act: 'A slippage workflow that drafts the client update the day a project runs late.', k: '18 of 22', c: 'on schedule', donut: [82, 'on schedule'] },
          { t: 'Handoffs waiting', act: 'A handoff tracker that reminds the owner on day 2.', k: '3', c: 'none older than 2 days', rows: [['Acme Co.', 'Client files'], ['Northwind Supply', 'Kickoff date'], ['Juniper Labs', 'Signed scope']] }
        ],
        daily: { head: 'Delivery is booked past full through March.', nums: [['18 of 22', 'Projects on track', '-1', 0], ['91%', 'Hours booked', '+3 pt', 1], ['3', 'Handoffs waiting', '0', 1]],
          what: ['Two kickoffs were staffed by who has capacity.', 'The Acme project slipped two days waiting on client files.', 'This week\'s status report was written and sent.'],
          need: 'Delivery is over capacity through March. Approve a contractor?', health: 'Every handoff is logged. None is older than 2 days.' },
        qa: [
          { q: 'Where is my team stretched thin?', a: 'Delivery. Three people are booked past full through March, and two kickoffs have no owner.', src: [['Project tracker', 'ops'], ['Scheduling', 'ops']], act: ['Two kickoffs are moved to next week, and a contractor request is drafted.', 'ask'] },
          { q: 'Which projects are behind?', a: 'Four. Three are waiting on the client, and one is waiting on us.', src: [['Project tracker', 'ops'], ['Email', 'sales']], act: ['Reminders went to the three clients, and the fourth is on tomorrow\'s standup list.', 'done'] },
          { q: 'What slipped through the cracks this week?', a: 'Two things. A renewal quote was never sent, and a new client has no kickoff date.', src: [['CRM', 'sales'], ['Project tracker', 'ops']], act: ['The quote is drafted, and the client has three kickoff dates to choose from.', 'ask'] },
          { q: 'Which steps take us the longest?', a: 'Client onboarding. It averages 11 days, and 6 of them are spent waiting for files.', src: [['Project tracker', 'ops'], ['Help desk', 'cs']], act: ['New clients now get the file checklist on the day they sign.', 'done'] }
        ] },
      { g: 'fin', name: 'Finance',
        reports: [
          { t: 'Money owed to you', act: 'A collections workflow that sends reminders at 7, 14 and 30 days.', k: '$86K', c: 'outstanding', bars: [['Not yet due', 100, '$52K'], ['1 to 30 days', 31, '$16K'], ['31 to 60 days', 23, '$12K'], ['Over 60 days', 12, '$6K']] },
          { t: 'Cash collected', act: 'A payment recovery workflow that retries a failed charge, then flags it.', k: '$212K', c: 'this month', line: [140, 152, 149, 168, 181, 176, 198, 212] },
          { t: 'Software spend', act: 'A license monitor that lists unused tools for cancellation each month.', k: '$14.2K', c: 'a month across 34 tools', bars: [['Sales', 100, '$4.6K'], ['Marketing', 74, '$3.4K'], ['Operations', 70, '$3.2K'], ['Other', 65, '$3.0K']] }
        ],
        daily: { head: 'Two invoices are waiting for your approval.', nums: [['$42K', 'Invoiced', '+$9K', 1], ['$31K', 'Collected', '+$4K', 1], ['$18K', 'Overdue', '+$6K', 0]],
          what: ['Four invoices were drafted from signed contracts.', 'One payment failed and was retried successfully.', 'Three payment reminders went out.'],
          need: 'Two invoices worth $18,400 need your approval.', health: 'Books match the bank through yesterday.' },
        qa: [
          { q: 'What tools am I paying for, and where can I cut costs?', a: '34 tools at $14,200 a month. Six are unused or overlap with another, worth $2,100 a month.', src: [['Billing', 'fin'], ['Bank feed', 'fin']], act: ['Cancellation notices are drafted for the two unused tools, worth $640 a month.', 'ask'] },
          { q: 'Who owes us money?', a: 'Three customers owe $18K. The oldest invoice is 41 days late.', src: [['Billing', 'fin'], ['CRM', 'sales']], act: ['Reminders are drafted for all three, oldest first.', 'ask'] },
          { q: 'What will cash look like next month?', a: 'About $212K collected, if open invoices pay on their usual schedule.', src: [['Billing', 'fin'], ['Bank feed', 'fin']], act: ['You will get an alert if collections fall more than 10% behind that pace.', 'done'] },
          { q: 'Which customers are least profitable?', a: 'Two accounts. Their support and delivery hours cost more than they pay.', src: [['Billing', 'fin'], ['Project tracker', 'ops'], ['Help desk', 'cs']], act: ['A pricing review for both accounts is on your list, with the hours attached.', 'done'] }
        ] },
      { g: 'cs', name: 'Customer success',
        reports: [
          { t: 'Account health', act: 'A risk workflow that drafts a check-in the moment an account slips.', k: '9', c: 'accounts at risk', donut: [88, 'healthy'] },
          { t: 'Tickets by topic', act: 'A help-article workflow that turns repeat topics into published answers.', k: '23', c: 'opened yesterday', bars: [['Onboarding', 100, '9'], ['Billing', 56, '5'], ['Reports', 56, '5'], ['Other', 44, '4']] },
          { t: 'Renewals in 90 days', act: 'A renewal workflow that starts the plan 90 days out.', k: '$310K', c: 'across 14 accounts', rows: [['Harbor & Pine', 'No login in 30 days'], ['Acme Co.', 'Usage down 40%'], ['Juniper Labs', 'Healthy']] }
        ],
        daily: { head: 'Usage dropped at two accounts that renew next month.', nums: [['23', 'Tickets opened', '-4', 1], ['12 min', 'First reply', '-3 min', 1], ['9', 'Accounts at risk', '+2', 0]],
          what: ['Nineteen tickets were answered with account history.', 'Usage dropped at two accounts renewing next month.', 'Three onboarding plans were written for new customers.'],
          need: 'Two at-risk accounts need a personal note. Drafts are ready.', health: 'No ticket is older than 24 hours.' },
        qa: [
          { q: 'Which customers are at risk this quarter?', a: 'Nine accounts. Usage is down, tickets are up, and three renew within 60 days.', src: [['Help desk', 'cs'], ['Product analytics', 'prod'], ['Billing', 'fin']], act: ['A check-in from each account owner is drafted, with the usage numbers attached.', 'ask'] },
          { q: 'Which renewals need attention?', a: 'Five, worth $120K. Two have had no login in 30 days.', src: [['Billing', 'fin'], ['Product analytics', 'prod']], act: ['Renewal plans are drafted for all five, starting with the two that went quiet.', 'ask'] },
          { q: 'What are customers asking about most?', a: 'Onboarding. It is 39% of tickets, and most are about connecting data.', src: [['Help desk', 'cs']], act: ['A setup guide for connecting data is drafted for your help center.', 'ask'] },
          { q: 'Who is ready to buy more?', a: 'Six accounts. Each is at its seat limit and uses every feature in its plan.', src: [['Product analytics', 'prod'], ['Billing', 'fin'], ['CRM', 'sales']], act: ['An expansion note is added to all six accounts for their owners.', 'done'] }
        ] }
    ];
    const spark = (v, c) => { const lo = Math.min(...v), hi = Math.max(...v), W = 240, H = 64, pts = v.map((y, i) => [i * W / (v.length - 1), H - 6 - (y - lo) / (hi - lo || 1) * (H - 14)]);
      const d = pts.map((p, i) => (i ? 'L' : 'M') + p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join(''), last = pts[pts.length - 1];
      return `<svg class="viz-line" viewBox="0 0 ${W} ${H}" preserveAspectRatio="none" aria-hidden="true"><path d="${d}L${W} ${H}L0 ${H}z" fill="${c}" opacity=".12"/><path d="${d}" fill="none" stroke="${c}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" vector-effect="non-scaling-stroke"/></svg>`; };
    const donut = (pct, label, c) => `<div class="viz-donut"><svg viewBox="0 0 64 64" aria-hidden="true"><circle cx="32" cy="32" r="25" fill="none" stroke="#E7E9E4" stroke-width="9"/><circle cx="32" cy="32" r="25" fill="none" stroke="${c}" stroke-width="9" stroke-linecap="round" stroke-dasharray="${(pct / 100 * 157).toFixed(1)} 157" transform="rotate(-90 32 32)"/></svg><span>${pct}% ${label}</span></div>`;
    const report = (r, c) => `<div class="card rep" style="--c:${c}"><small>${r.t}</small><b>${r.k}</b><span class="cap">${r.c}</span>` +
      (r.bars ? `<ul class="viz-bars">${r.bars.map(([l, w, v]) => `<li><span>${l}</span><i><u style="width:${w}%"></u></i><em>${v}</em></li>`).join('')}</ul>` : '') +
      (r.rows ? `<ul class="viz-rows">${r.rows.map(([a, b]) => `<li><span>${a}</span><em>${b}</em></li>`).join('')}</ul>` : '') +
      (r.line ? spark(r.line, c) : '') + (r.donut ? donut(r.donut[0], r.donut[1], c) : '') + `<p class="do"><small>What we build</small>${r.act}</p></div>`;
    const today = new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
    const daily = f => { const d = f.daily, c = C[f.g];
      return `<div class="dr" style="--c:${c}"><div class="drh">${glyph(f.g, c)}<b>${f.name} daily report</b><span>${today} · covers yesterday</span></div><h3>${d.head}</h3>` +
        `<div class="drn">${d.nums.map(([n, l, ch, good]) => `<div><b>${n}</b><span>${l}</span><em class="${good ? 'good' : 'bad'}">${ch}</em></div>`).join('')}</div>` +
        `<div class="drc"><div><small>What happened</small><ul>${d.what.map(w => `<li>${w}</li>`).join('')}</ul></div><div><small>Needs you</small><p class="need">${d.need}</p><small>Health</small><p class="ok">${d.health}</p></div></div>` +
        `<p class="note">Example. It arrives by email every morning, and as a page you can open.</p></div>`; };
    const tabs = el('ftabs'), dReports = el('dReports'), dDaily = el('dDaily'), dName = el('dName');
    const demoAsk = askBox(el('dQs'), el('dAskQ'), el('dAskS'), el('dAskA'), el('dAskX'));
    const tabBtns = FUNCS.map((f, i) => { const b = document.createElement('button'); b.type = 'button'; b.setAttribute('role', 'tab'); b.style.setProperty('--c', C[f.g]); b.innerHTML = `<i></i>${f.name}`; b.addEventListener('click', () => pick(i, true)); tabs.appendChild(b); return b; });
    function pick(i, run){ const f = FUNCS[i];
      tabBtns.forEach((b, k) => b.setAttribute('aria-selected', k === i));
      dReports.innerHTML = f.reports.map(r => report(r, C[f.g])).join(''); dDaily.innerHTML = daily(f); dName.textContent = f.name.toLowerCase();
      [dReports, dDaily].forEach(n => { n.classList.remove('in'); void n.offsetWidth; n.classList.add('in'); });
      demoAsk.load(f.qa); if (run) demoAsk.ask(0);
    }
    pick(0, false); demoAsk.ask(0);
  }

  if (el('assess')){   // assessment page only
    // ---- the assessment: four answers in, the visitor's own map out
    // the apps a B2B software or services company actually runs, grouped the way they were bought: team by team
    const GROUPS = [
      ['Marketing', 'mkt', ['Email and marketing automation', 'Website or CMS', 'Landing pages and forms', 'Ad platforms', 'Webinar and event platform']],
      ['Sales', 'sales', ['CRM', 'Sales engagement and outbound', 'Proposals and quoting', 'E-signature', 'Lead and intent data']],
      ['Product', 'prod', ['Issue and sprint tracker', 'Product analytics', 'Code repository', 'Feedback and roadmap']],
      ['Delivery and internal', 'ops', ['Project management', 'Time tracking', 'Resource scheduling', 'Knowledge base or wiki', 'Spreadsheets', 'Team chat', 'HR system']],
      ['Finance', 'fin', ['Accounting', 'Billing and invoicing', 'Payments and subscriptions', 'Expense management', 'Payroll', 'BI and dashboards']],
      ['Customer', 'cs', ['Help desk', 'Customer success platform', 'Customer onboarding', 'Surveys and NPS']]
    ];
    const APPS = GROUPS.flatMap(([, g, names]) => names.map(n => [n, g]));
    const SELLS = ['Software', 'Services', 'Both'];
    const SIZES = ['1 to 10', '11 to 50', '51 to 200', 'Over 200'];
    // the problem an owner would actually name, and what we would build first: software, then services
    const PROBLEMS = [
      ['We cannot see how the business is doing without someone building the report',
        'A company dashboard fed by your product, CRM and billing data, plus the weekly summary that explains what moved and what to do about it.',
        'A company dashboard fed by your projects, pipeline and invoices, plus the weekly summary that explains what moved and what to do about it.'],
      ['Growing means hiring more people, so the work costs more than it should',
        'An onboarding workflow that provisions each new account, tracks where it stalls and nudges the customer, so the next hundred accounts do not need the next five hires.',
        'A project setup workflow that builds the plan, staffs it from who has capacity and raises the invoices, so more clients stop meaning more admin.'],
      ['Work slips when someone is busy, on holiday or leaves',
        'A handoff workflow from signed deal to live account, every step owned, timed and visible, so nothing waits on one person remembering.',
        'A handoff workflow from signed deal to delivered project, every step owned, timed and visible, so nothing waits on one person remembering.'],
      ['We hear about problems after they have already cost us',
        'An early warning tool that scores every account on usage, tickets and invoices, and drafts the outreach the moment one slips.',
        'An early warning tool that scores every project on budget, schedule and client sentiment, and drafts the check-in the moment one slips.'],
      ['We pay for a lot of tools and still do a lot by hand',
        'A single intake that writes into your CRM, your product and your billing at once, starting with the handoff that costs you the most hours.',
        'A single intake that writes into your CRM, your project tracker and your billing at once, starting with the handoff that costs you the most hours.']
    ];
    const picked = new Set(); let sells = -1, size = -1, problem = -1;
    const box = el('assess'), go = el('showMap'), hint = el('hint');
    const mk = (host, label, on) => { const b = document.createElement('button'); b.type = 'button'; b.className = 'opt'; b.textContent = label; b.setAttribute('aria-pressed', 'false'); b.addEventListener('click', () => on(b)); host.appendChild(b); return b; };
    const ready = () => { const ok = picked.size >= 3 && sells >= 0 && size >= 0 && problem >= 0; go.disabled = !ok;
      hint.textContent = ok ? `${picked.size} apps selected.` : picked.size < 3 ? 'Pick at least 3 apps to see your map.' : 'Answer all four to see your map.'; };
    // one row per team, so the picker looks the way the sprawl happened
    let n = 0;
    GROUPS.forEach(([label, g, names]) => {
      const wrap = document.createElement('div'); wrap.className = 'optg'; wrap.style.setProperty('--c', C[g]);
      const h = document.createElement('p'); h.className = 'optgl'; h.textContent = label; wrap.appendChild(h);
      const row = document.createElement('div'); row.className = 'opts'; wrap.appendChild(row);
      names.forEach(() => { const i = n++; mk(row, APPS[i][0], b => { picked.has(i) ? picked.delete(i) : picked.add(i); b.setAttribute('aria-pressed', picked.has(i)); ready(); }); });
      el('optApps').appendChild(wrap);
    });
    const one = (host, labels, set) => { const bs = labels.map((l, i) => mk(host, l, () => { set(i); bs.forEach((x, k) => x.setAttribute('aria-pressed', k === i)); ready(); })); return bs; };
    one(el('optSells'), SELLS, i => { sells = i; }); one(el('optSize'), SIZES, i => { size = i; }); one(el('optStuck'), PROBLEMS.map(p => p[0]), i => { problem = i; });
    // ---- the result: the visitor's own map, what it cannot answer, what it costs and what we would build
    // every app sits at one stage of the path a customer takes, or underneath all of them
    const STAGES = svc => [
      ['Leads', ['Email and marketing automation', 'Website or CMS', 'Landing pages and forms', 'Ad platforms', 'Webinar and event platform', 'Lead and intent data']],
      ['Deals', ['CRM', 'Sales engagement and outbound', 'Proposals and quoting']],
      ['Contract', ['E-signature']],
      [svc ? 'Delivery' : 'Onboarding', ['Customer onboarding', 'Project management', 'Time tracking', 'Resource scheduling', 'Issue and sprint tracker', 'Product analytics', 'Code repository', 'Feedback and roadmap']],
      ['Billing', ['Billing and invoicing', 'Payments and subscriptions', 'Accounting', 'Expense management']],
      ['Support', ['Help desk', 'Customer success platform', 'Surveys and NPS']]
    ];
    // what has to happen after each stage, said the way an owner would say it. The sixth is the report underneath them all
    const STEPS = svc => ['A new lead reaches sales', 'The deal goes out to be signed', svc ? 'The new project gets set up' : 'The new customer gets set up',
      svc ? 'The work gets billed' : 'The customer gets billed', 'Support sees what the customer bought', 'Everything gets pulled into a report'];
    const UNDER = ['BI and dashboards', 'Spreadsheets', 'Team chat', 'Knowledge base or wiki', 'HR system', 'Payroll'];
    // a question no single app can answer: [the question, [[what one app holds, the apps that could hold it]...], closing line]
    const QUESTIONS = (svc, n) => ({
      biz: ['How is the business doing this week?', [['the pipeline is in', ['CRM']], ['revenue is in', ['Payments and subscriptions', 'Billing and invoicing', 'Accounting']],
        svc ? ['delivery is in', ['Project management', 'Time tracking']] : ['usage is in', ['Product analytics']], ['support is in', ['Help desk', 'Customer success platform']]]],
      risk: svc ? ['Which clients are at risk?', [['budget and hours are in', ['Time tracking', 'Project management']], ['complaints are in', ['Help desk', 'Surveys and NPS']], ['invoices are in', ['Billing and invoicing', 'Accounting', 'Payments and subscriptions']]]]
        : ['Which customers are at risk?', [['usage is in', ['Product analytics']], ['complaints are in', ['Help desk', 'Surveys and NPS']], ['renewals are in', ['Payments and subscriptions', 'Billing and invoicing', 'CRM']]]],
      channel: ['Which channel brings customers who stay?', [['spend is in', ['Ad platforms', 'Email and marketing automation', 'Webinar and event platform']], ['the deal is in', ['CRM']], ['whether they stayed is in', ['Payments and subscriptions', 'Billing and invoicing', 'Accounting']]]],
      capacity: [svc ? 'Can we take on the next ten clients without hiring?' : 'Can we take on the next hundred customers without hiring?',
        [['what is coming is in', ['CRM']], ['the workload is in', ['Customer onboarding', 'Project management', 'Resource scheduling', 'Help desk']], ['your people are in', ['HR system', 'Payroll', 'Time tracking']]]],
      profit: [svc ? 'Which clients make us money?' : 'Which customers make us money?', [['revenue is in', ['Billing and invoicing', 'Payments and subscriptions', 'Accounting']], ['the hours spent are in', ['Time tracking', 'Project management', 'Help desk']]]],
      slip: ['What is waiting on someone right now?', [['deals are in', ['CRM']], ['delivery work is in', ['Project management', 'Customer onboarding', 'Issue and sprint tracker']], ['tickets are in', ['Help desk']], ['the reminders are in', ['Team chat']]], 'Nobody sees one list of what is stuck.'],
      tools: ['Which tools do we pay for and barely use?', [['the bills are in', ['Accounting', 'Expense management']], ['your people are in', ['HR system', 'Payroll']]], `Who logs in is locked inside each of your ${n} apps.`]
    });
    const ASKS = ['biz', 'capacity', 'slip', 'risk', 'tools'];                 // the question behind each problem
    const FIRST = [['dash', 'onboard', 'health'], ['onboard', 'dash', 'health'], ['handoff', 'dash', 'health'], ['health', 'dash', 'onboard'], ['intake', 'dash', 'onboard']];
    // the cost sentences start from the problem they picked: [heading, what those people spend the hours doing, what the year was spent on, hours a week, people by team size]
    const COSTS = [
      ['Building the report by hand.', 'building or chasing reports', 'building reports by hand', 4, [1, 3, 8, 20]],
      ['Work that grows with every customer.', 'on work a workflow could do', 'on work a workflow could do', 5, [2, 6, 20, 50]],
      ['Chasing what is waiting on someone.', 'chasing work that is waiting on someone', 'chasing work that is waiting on someone', 3, [2, 5, 15, 40]],
      ['Finding problems late.', 'finding and fixing problems after the fact', 'finding and fixing problems late', 4, [2, 5, 12, 30]],
      ['Moving information by hand.', 'moving information between tools', 'moving information between tools by hand', 3, [4, 12, 40, 100]]
    ];
    const list = a => a.length < 2 ? (a[0] || '') : a.slice(0, -1).join(', ') + ' and ' + a[a.length - 1];
    const cap = t => t.charAt(0).toUpperCase() + t.slice(1);
    const WORD = ['', 'One', 'Two', 'Three'], ALL = ['', '', 'both', 'all three', 'all four'];
    let shown = {};   // what this visitor was shown, sent along with their email

    go.addEventListener('click', () => {
      const mine = [...picked].sort((a, b) => a - b).map(i => APPS[i]), n = mine.length;
      const names = mine.map(a => a[0]), has = new Set(names), team = Object.fromEntries(mine);
      const H = x => has.has(x), own = (xs, max) => xs.filter(H).slice(0, max || 9);
      const svc = sells === 1, kind = ['software', 'services', 'software and services'][sells];
      const stages = STAGES(svc), steps = STEPS(svc), under = own(UNDER), low = t => t.charAt(0).toLowerCase() + t.slice(1);

      // the six steps between stages: [probably automatic?, why it probably is not]
      const leads = stages[0][1].some(H), bills = H('Billing and invoicing') || H('Accounting') || (svc && H('Payments and subscriptions'));
      const HO = [
        [leads && H('CRM'), leads ? 'No CRM for leads to land in.' : 'Nothing you picked brings in leads.'],
        [H('CRM') && H('E-signature'), H('E-signature') ? 'No CRM to carry the deal.' : 'Nothing you picked gets the contract signed.'],
        svc ? [false, H('Project management') ? 'Someone sets up each project.' : 'Nothing you picked sets up the project.'] : [H('Customer onboarding'), 'Nothing you picked starts onboarding.'],
        svc ? [H('Time tracking') && H('Billing and invoicing'), bills ? 'Hours and invoices are matched by hand.' : 'Nothing you picked sends the bill.']
            : [H('Payments and subscriptions'), bills ? 'Someone raises each invoice.' : 'Nothing you picked sends the bill.'],
        [H('Customer success platform'), H('Help desk') ? 'Support cannot see what a customer pays or uses.' : 'Nothing you picked looks after customers.'],
        problem === 0 ? [false, 'You told us someone builds that report by hand.'] : [H('BI and dashboards'), 'Nothing you picked reports across all six stages.']
      ];
      const byHand = HO.map((h, i) => h[0] ? 0 : i + 1).filter(Boolean), k = byHand.length;

      // the three apps we would build, the first one answering the problem they picked
      const rep = new Set();
      const also = (xs, phrase) => { const a = own(xs); a.forEach(x => rep.add(x)); return a.length ? [phrase + ' ' + list(a)] : []; };
      const swap = xs => { const a = own(xs); a.forEach(x => rep.add(x)); return a; };
      const reads = (xs, max) => { const a = own(xs, max); return a.length > 1 ? 'your ' + list(a) : 'every app you keep'; };
      const signed = H('E-signature') ? 'E-signature completes' : H('CRM') ? 'a deal closes in your CRM' : 'a contract is signed';
      const BUILD = {
        dash: () => ['A company dashboard', `Reads ${reads(['CRM', svc ? 'Project management' : 'Product analytics', 'Payments and subscriptions', 'Billing and invoicing', 'Accounting', 'Help desk'], 4)}. Every Monday it explains what moved and what to do about it.`,
          [...swap(['BI and dashboards']), ...also(['Spreadsheets'], 'the reports built in')], [6]],
        onboard: () => svc
          ? ['A project setup app', `Builds the plan, staffs it from who has capacity and raises the first invoice the moment ${signed}.`,
              [...swap(['Resource scheduling', 'Time tracking']), ...(H('Resource scheduling') ? [] : also(['Spreadsheets'], 'the staffing plan kept in'))], [3, 4]]
          : ['A customer onboarding app', `Opens the moment ${signed}. Every step is owned, timed and visible to your team and your customer.`,
              [...swap(['Customer onboarding']), ...(H('Customer onboarding') ? [] : also(['Spreadsheets'], 'the onboarding run in'))], [3]],
        health: () => svc
          ? ['A client health app', 'Scores every project on budget, schedule and client sentiment, and drafts the check-in the moment one slips.', swap(['Customer success platform', 'Surveys and NPS']), [5]]
          : ['An account health app', 'Scores every account on usage, tickets and payments, and drafts the outreach the moment one slips.', swap(['Customer success platform', 'Surveys and NPS']), [5]],
        intake: () => ['A single intake app', `Takes each new customer once and writes it into ${reads(['CRM', 'Billing and invoicing', 'Payments and subscriptions', 'Accounting', 'Project management', 'Help desk'], 3)}, so nobody types the same details twice.`,
          swap(['Landing pages and forms', 'Proposals and quoting']), [1, 2]],
        handoff: () => [svc ? 'A new project tracker' : 'A new customer tracker', `Follows every deal from signed to ${svc ? 'delivered' : 'live'}. Each step is owned, timed and visible, so nothing waits on one person remembering.`,
          [...swap(['Customer onboarding']), ...also(['Spreadsheets', 'Knowledge base or wiki'], 'the checklists kept in')], [3]]
      };
      const builds = FIRST[problem].map(id => BUILD[id]());

      // headline, and their own answers played back
      el('rHead').textContent = `${n} apps. ${k === 0 ? 'On paper, all 6 steps between them run on their own.' : k === 6 ? 'All 6 steps between them are probably done by hand.' : k + ' of the 6 steps between them ' + (k === 1 ? 'is' : 'are') + ' probably done by hand.'}`;
      el('rTold').innerHTML = `<em>What you told us</em><span>B2B ${kind}</span><span>${SIZES[size]} people</span><span class="p">${PROBLEMS[problem][0]}</span>`;

      // the map
      const app = x => `<li style="--c:${C[team[x]]}"><span>${x}</span></li>`;
      el('rStages').innerHTML = stages.map(([name, apps], i) => { const a = own(apps), ok = i < 5 && HO[i][0];
        const ho = i === 5 ? '<div class="rho last"><small>Next</small><b>Renewal</b>The loop starts again</div>'
          : `<div class="rho ${ok ? 'ok' : 'hand'}"><small>Next</small><b>${steps[i]}</b>${ok ? 'Probably automatic' : 'Probably done by hand. ' + HO[i][1]}</div>`;
        return `<div class="rst"><div><span class="n">0${i + 1}</span><b class="t">${name}</b></div><ul class="rapps">${a.length ? a.map(app).join('') : '<li class="none">No tool picked</li>'}</ul>${ho}</div>`; }).join('');
      el('rUnder').innerHTML = `<div><small>Underneath all of it</small><b>Reporting</b></div><p>${under.length ? list(under) + (under.length > 1 ? ' sit' : ' sits') + ' underneath all six stages.' : 'Nothing you picked sits underneath the six stages.'} ${HO[5][0] ? '' : HO[5][1]}</p><span class="rp ${HO[5][0] ? 'ok' : 'hand'}">${HO[5][0] ? 'Probably automatic' : 'Done by hand today'}</span>`;

      // up to three questions their apps cannot answer, the one behind their problem first
      const Q = QUESTIONS(svc, n);
      const answer = id => { const [q, slots, end] = Q[id], taken = new Set(), parts = [];
        slots.forEach(([says, xs]) => { const x = xs.find(y => H(y) && !taken.has(y)); if (x){ taken.add(x); parts.push(says + ' ' + x); } });
        return { q, count: parts.length, text: parts.length > 1 ? cap(list(parts)) + '. ' + (end || `No one app sees ${ALL[parts.length]}.`) : '' }; };
      const mainQ = Object.assign(answer(ASKS[problem]), { top: true });
      if (!mainQ.text) mainQ.text = 'None of the apps you picked answers this on its own. Today the answer lives in someone\'s head.';
      else if (problem === 0 && H('Spreadsheets')) mainQ.text = mainQ.text.replace(/ No one app sees.*$/, ' Someone stitches it together in Spreadsheets.');
      const rest = ['biz', 'risk', 'channel', 'capacity', 'profit', 'slip', 'tools'].filter(id => id !== ASKS[problem] && !(id === 'risk' && H('Customer success platform'))).map(answer).filter(x => x.count > 1);
      const qs = [mainQ, ...rest].slice(0, 3);
      el('rQHead').textContent = `${WORD[qs.length]} question${qs.length > 1 ? 's' : ''} your apps cannot answer today.`;
      el('rQs').innerHTML = qs.map(x => `<div class="rq${x.top ? ' top' : ''}"><span class="rp">${x.top ? 'The problem you picked' : 'Split across ' + x.count + ' apps'}</span><h4>${x.q}</h4><p>${x.text}</p></div>`).join('');

      // what we would build, and what each could replace
      el('rBuilds').innerHTML = builds.map(([title, does, reps, closes], i) => { const c = closes.filter(h => byHand.includes(h));
        const tags = (i ? [] : ['Answers the problem you picked', 'First workflow live in 2 to 3 weeks']).concat(c.map(h => 'Fixes: ' + low(steps[h - 1])));
        return `<div class="rb${i ? '' : ' top'}"><b>${i + 1}</b><div class="w"><h4>${title}</h4><p>${does}</p></div><div class="x"><div class="rr"><small>${reps.length ? 'Could replace' : 'Fills a gap'}</small>${reps.length ? cap(list(reps)) : 'Nothing you picked does this today.'}</div><div class="tags">${tags.map(t => `<span class="rp t">${t}</span>`).join('')}</div></div></div>`; }).join('');
      const open = names.filter(x => !rep.has(x));
      el('rMore').hidden = !open.length;
      el('rMore').innerHTML = open.length ? `<p class="lab">${open.length} more app${open.length > 1 ? 's' : ''} to go through together</p><div class="rchips">${open.map(x => `<span>${x}</span>`).join('')}</div>` : '';

      // the cost of today, starting from the problem they picked
      const [cHead, cDoing, cWhat, cHrs, cPpl] = COSTS[problem];
      el('cHead').textContent = cHead; el('cDoing').textContent = cDoing;
      el('cPeople').value = cPpl[size]; el('cHours').value = cHrs; el('cRate').value = 50; el('cTools').value = 0;
      el('cNote').textContent = `These are our starting guesses for a ${kind} company of ${SIZES[size].toLowerCase()} people. Change any number to match yours.`;
      costWhat = cWhat; cost();

      // the close: the report by email when forms are on, the call when they are not
      const start = byHand.length ? `we start where ${low(steps[byHand[0] - 1])}` : 'we walk through your map';
      el('rCloseA').hidden = el('rCloseB').hidden = !LIVE; el('rCloseC').hidden = LIVE;
      el('rCall').innerHTML = `Or <a href="/call/">book 15 minutes</a> and ${start} with you.`;
      el('rCallOnly').textContent = `Fifteen minutes. ${cap(start)} and tell you what we would build first.`;

      shown = { sells: SELLS[sells], apps: names.join(', '), app_count: n, team_size: SIZES[size], problem: PROBLEMS[problem][0],
        steps_probably_done_by_hand: byHand.map(h => steps[h - 1]).join(' | ') || 'none', questions: qs.map(x => x.q).join(' | '),
        builds: builds.map(([t, , r], i) => `${i + 1}. ${t}${r.length ? ' (could replace ' + list(r) + ')' : ''}`).join(' | '), still_open: open.join(', ') };
      box.classList.add('done'); el('sent').hidden = true;
      box.scrollIntoView({ behavior: calm ? 'auto' : 'smooth', block: 'start' });
    });
    // what today costs, from the visitor's own numbers: hours by hand, plus any tools they want to stop paying for
    const money = n => '$' + Math.round(n).toLocaleString('en-US');
    let costWhat = '';
    function cost(){ const v = id => Math.max(0, +el(id).value || 0), p = v('cPeople'), h = v('cHours'), r = v('cRate'), t = v('cTools') * 12, hrs = p * h * r * 50;
      el('cOut').textContent = money(hrs + t);
      el('cOutL').textContent = t ? 'a year in hours by hand and tools you rent' : 'a year spent ' + costWhat;
      el('cHow').textContent = `${p} people x ${h} hours x ${money(r)} x 50 working weeks.` + (t ? ` Plus ${money(t)} a year in tools.` : ''); }
    ['cPeople', 'cHours', 'cRate', 'cTools'].forEach(id => el(id).addEventListener('input', cost));
    const say = t => { const n = el('sent'); n.textContent = t; n.hidden = false; };
    el('send').addEventListener('submit', async e => {
      e.preventDefault();
      if (el('botcheck').checked) return;
      const btn = el('sendBtn'), label = btn.textContent;
      btn.disabled = true; btn.textContent = 'Sending';
      try {
        const how = await post('New assessment from pileusops.com', Object.assign({ email: el('email').value.trim() }, shown, { yearly_cost: el('cOut').textContent,
          cost_inputs: `${el('cPeople').value} people, ${el('cHours').value} hours a week, $${el('cRate').value} an hour, $${el('cTools').value} a month on tools` }));
        if (how === 'off') say('Thanks. Emailed reports are coming soon. Your full result is on this page.');
        else { say('Thanks. We have your results and will email your report shortly.'); el('send').reset(); }
      } catch (err) { say('That did not send. Please try again in a moment.'); }
      btn.disabled = false; btn.textContent = label;
    });
    el('again').addEventListener('click', () => { box.classList.remove('done'); box.scrollIntoView({ behavior: calm ? 'auto' : 'smooth', block: 'start' }); });
  }

  // ---- book a call: free times come from the hours below, shown in the visitor's own timezone
  if (el('book')){
    // Your availability. Change it here and the page follows.
    const CAL = {
      minutes: 15,            // how long the call runs, and the step between times
      tz: 'America/Detroit',  // the timezone the hours below are written in
      hours: {                // 0 Sunday to 6 Saturday. 24 hour clock, in the timezone above
        1: [['09:00', '12:00'], ['13:00', '16:00']],
        2: [['09:00', '12:00'], ['13:00', '16:00']],
        3: [['09:00', '12:00'], ['13:00', '16:00']],
        4: [['09:00', '12:00'], ['13:00', '16:00']],
        5: [['09:00', '12:00']]
      },
      lead: 18,               // hours of notice before the earliest time anyone can pick
      horizon: 35,            // how far ahead anyone can book, in days
      // Nothing here reads your calendar, so block anything you are not free for.
      // A whole day: '2026-12-25'. One time: '2026-12-02 10:00', in the timezone above.
      off: ['2026-11-26', '2026-11-27', '2026-12-24', '2026-12-25', '2026-12-31', '2027-01-01']
    };

    const pad = n => String(n).padStart(2, '0');
    const mins = s => { const [h, m] = s.split(':').map(Number); return h * 60 + m; };
    // the parts of an instant as a clock in that timezone reads them
    const partsIn = (tz, d) => { const o = {};
      new Intl.DateTimeFormat('en-US', { timeZone: tz, hour12: false, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' })
        .formatToParts(d).forEach(p => { if (p.type !== 'literal') o[p.type] = p.value; }); return o; };
    // minutes that timezone is ahead of UTC at that instant, so daylight saving takes care of itself
    const offset = (tz, d) => { const p = partsIn(tz, d), h = p.hour === '24' ? 0 : +p.hour;
      return (Date.UTC(+p.year, +p.month - 1, +p.day, h, +p.minute, +p.second) - Math.floor(d.getTime() / 1000) * 1000) / 60000; };
    // the instant at which a clock in that timezone reads this wall time
    const instant = (tz, y, m, d, hh, mm) => { let t = Date.UTC(y, m - 1, d, hh, mm);
      for (let i = 0; i < 2; i++) t = Date.UTC(y, m - 1, d, hh, mm) - offset(tz, new Date(t)) * 60000;
      return new Date(t); };

    // every free time between now plus the notice period and the far edge of the window
    const earliest = Date.now() + CAL.lead * 36e5, latest = Date.now() + CAL.horizon * 864e5, seen = new Set(), slots = [];
    for (let i = 0; i <= CAL.horizon + 1; i++){
      const p = partsIn(CAL.tz, new Date(Date.now() + i * 864e5)), day = `${p.year}-${p.month}-${p.day}`;
      if (seen.has(day)) continue;
      seen.add(day);
      if (CAL.off.includes(day)) continue;
      const y = +p.year, mo = +p.month, da = +p.day, dow = new Date(Date.UTC(y, mo - 1, da)).getUTCDay();
      (CAL.hours[dow] || []).forEach(([from, to]) => {
        for (let t = mins(from); t + CAL.minutes <= mins(to); t += CAL.minutes){
          const hh = Math.floor(t / 60), mm = t % 60;
          if (CAL.off.includes(`${day} ${pad(hh)}:${pad(mm)}`)) continue;
          const at = instant(CAL.tz, y, mo, da, hh, mm);
          if (at.getTime() < earliest || at.getTime() > latest) continue;
          slots.push(at);
        }
      });
    }

    // grouped by the visitor's own date, so the grid matches the clock they are reading
    const byDay = new Map();
    slots.forEach(d => { const k = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
      if (!byDay.has(k)) byDay.set(k, []); byDay.get(k).push(d); });
    const keys = [...byDay.keys()].sort();
    const monthOf = k => +k.slice(0, 4) * 12 + (+k.slice(5, 7) - 1);
    const lo = keys.length ? monthOf(keys[0]) : 0, hi = keys.length ? monthOf(keys[keys.length - 1]) : 0;

    const card = el('book'), form = el('bkForm'), done = el('bkDone');
    const dayName = d => d.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' });
    const timeName = d => d.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' });
    let view = lo, day = null, slot = null;

    const zone = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
    const short = new Intl.DateTimeFormat(undefined, { timeZoneName: 'short' }).formatToParts(new Date()).find(p => p.type === 'timeZoneName');
    el('bkTz').textContent = zone ? `All times in ${zone.split('/').pop().replace(/_/g, ' ')}${short ? ' (' + short.value + ')' : ''}` : '';

    function drawMonth(){
      const y = Math.floor(view / 12), m = view % 12, one = new Date(y, m, 1);
      el('bkMonth').textContent = one.toLocaleDateString(undefined, { month: 'long', year: 'numeric' });
      el('bkPrev').disabled = view <= lo;
      el('bkNext').disabled = view >= hi;
      let html = '';
      for (let i = 0, start = (one.getDay() + 6) % 7; i < start; i++) html += '<span class="bkday pad"></span>';
      for (let d = 1; d <= new Date(y, m + 1, 0).getDate(); d++){
        const k = `${y}-${pad(m + 1)}-${pad(d)}`, free = byDay.get(k);
        html += free
          ? `<button type="button" class="bkday" data-k="${k}" aria-pressed="${k === day}" aria-label="${dayName(free[0])}, ${free.length} ${free.length === 1 ? 'time' : 'times'} free">${d}</button>`
          : `<button type="button" class="bkday" disabled>${d}</button>`;
      }
      el('bkDays').innerHTML = html;
    }

    function drawTimes(){
      const list = day ? byDay.get(day) : null;
      if (!list){
        el('bkDayLabel').textContent = 'Pick a day';
        el('bkTimes').innerHTML = `<p class="bknone">${keys.length ? 'The days you can press are the days we are free.' : 'There is nothing free in the next few weeks. Send a note instead and we will find a time.'}</p>`;
        return;
      }
      el('bkDayLabel').textContent = dayName(list[0]);
      el('bkTimes').innerHTML = list.map((d, i) => `<button type="button" class="bktime" data-i="${i}"><span>${timeName(d)}</span><em>${CAL.minutes} min</em></button>`).join('');
    }

    el('bkDays').addEventListener('click', e => {
      const b = e.target.closest('.bkday[data-k]');
      if (!b) return;
      day = b.dataset.k; drawMonth(); drawTimes();
      if (innerWidth <= 860) el('bkDayLabel').scrollIntoView({ behavior: calm ? 'auto' : 'smooth', block: 'center' });
    });

    el('bkTimes').addEventListener('click', e => {
      const b = e.target.closest('.bktime');
      if (!b) return;
      slot = byDay.get(day)[+b.dataset.i];
      el('bkPicked').textContent = `${dayName(slot)} at ${timeName(slot)}`;
      card.classList.add('chosen'); form.hidden = false; done.hidden = true;
      if (!LIVE){ el('bkSend').disabled = true; el('bkHint').textContent = 'Our inbox is not connected to this page yet, so this cannot be sent. Email us and we will hold the time.'; }
      card.scrollIntoView({ behavior: calm ? 'auto' : 'smooth', block: 'start' });
      el('bkName').focus({ preventScroll: true });
    });

    el('bkPrev').addEventListener('click', () => { if (view > lo){ view--; drawMonth(); } });
    el('bkNext').addEventListener('click', () => { if (view < hi){ view++; drawMonth(); } });
    el('bkBack').addEventListener('click', () => { card.classList.remove('chosen'); form.hidden = true; slot = null; });
    el('bkReset').addEventListener('click', () => {
      card.classList.remove('chosen'); done.hidden = true; form.reset(); day = null; slot = null;
      drawMonth(); drawTimes();
    });

    // a tentative hold, so the visitor can keep the time free while we confirm
    function hold(start){
      const stamp = d => d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
      const lines = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Pileus Ops//Booking//EN', 'BEGIN:VEVENT',
        `UID:${start.getTime()}@pileusops.com`, `DTSTAMP:${stamp(new Date())}`, `DTSTART:${stamp(start)}`,
        `DTEND:${stamp(new Date(start.getTime() + CAL.minutes * 60000))}`,
        'SUMMARY:Hold: intro call with Pileus Ops', 'STATUS:TENTATIVE',
        'DESCRIPTION:A hold for the time you asked for at pileusops.com. We confirm by email and send the invite.',
        'END:VEVENT', 'END:VCALENDAR'];
      return URL.createObjectURL(new Blob([lines.join('\r\n')], { type: 'text/calendar' }));
    }

    form.addEventListener('submit', async e => {
      e.preventDefault();
      if (el('bkBot').checked || !slot) return;
      const btn = el('bkSend'), label = btn.textContent;
      btn.disabled = true; btn.textContent = 'Sending';
      const ours = slot.toLocaleString('en-US', { timeZone: CAL.tz, weekday: 'long', month: 'long', day: 'numeric', hour: 'numeric', minute: '2-digit', timeZoneName: 'short' });
      try {
        const how = await post('New call request from pileusops.com', {
          email: el('bkEmail').value.trim(), name: el('bkName').value.trim(), company: el('bkCo').value.trim(),
          requested_time_your_clock: ours, requested_time_their_clock: `${dayName(slot)} at ${timeName(slot)} (${zone})`,
          starts_utc: slot.toISOString(), length_minutes: CAL.minutes, to_cover: el('bkNote').value.trim() });
        if (how === 'off'){ el('bkHint').textContent = 'Our inbox is not connected to this page yet, so nothing was sent.'; }
        else {
          el('bkOk').textContent = `Asked for ${dayName(slot)} at ${timeName(slot)}.`;
          el('bkOkSub').textContent = how === 'mail'
            ? 'Send the message your mail app just opened and we will confirm within one business day.'
            : 'We confirm by email within one business day. Nothing is on your calendar until then, so add a hold if you want to keep the time free.';
          el('bkIcs').href = hold(slot);
          form.hidden = true; done.hidden = false;
          done.scrollIntoView({ behavior: calm ? 'auto' : 'smooth', block: 'center' });
        }
      } catch (err){ el('bkHint').textContent = 'That did not send. Please try again in a moment.'; }
      btn.disabled = false; btn.textContent = label;
    });

    drawMonth(); drawTimes();
    if (keys.length) { day = keys[0]; drawMonth(); drawTimes(); }
  }

  // ---- contact: one note, same inbox
  if (el('cxform')){
    const note = t => { const n = el('cxSent'); n.textContent = t; n.hidden = false; };
    if (!LIVE){ el('cxSend').disabled = true; note('This form is not connected to an inbox yet. Book a call instead and we will pick it up there.'); }
    el('cxform').addEventListener('submit', async e => {
      e.preventDefault();
      if (el('cxBot').checked) return;
      const btn = el('cxSend'), label = btn.textContent;
      btn.disabled = true; btn.textContent = 'Sending';
      try {
        const how = await post('New note from pileusops.com', { email: el('cxEmail').value.trim(), name: el('cxName').value.trim(),
          company: el('cxCo').value.trim(), team_size: el('cxSize').value.trim(), message: el('cxNote').value.trim() });
        if (how === 'off') note('This form is not connected to an inbox yet.');
        else if (how === 'mail') note('Send the message your mail app just opened and we will come back within one business day.');
        else { note('Thanks. We will come back within one business day.'); el('cxform').reset(); }
      } catch (err){ note('That did not send. Please try again in a moment.'); }
      btn.disabled = false; btn.textContent = label;
    });
  }

  // ---- pricing: two choices add up to a first year. Starting prices only, the quote sets the real one
  if (el('est')){
    // a first workflow needs no Blueprint. A function build does, and the Blueprint fee comes off it
    const BLUEPRINT = 5000, BUILD = { wf: 10000, fn: 25000 };
    // running it is a fifth of the build a year with a floor of $1,000 a month; building on is $4,000 a month
    const AFTER = { self: () => 0, run: b => Math.max(12000, b * 0.2), grow: () => 48000 };
    const usd = n => '$' + Math.round(n).toLocaleString('en-US');
    const pick = { build: 'wf', after: 'run' };
    const draw = () => {
      const b = BUILD[pick.build], a = AFTER[pick.after](b), bp = pick.build === 'fn';
      el('estBp').textContent = bp ? usd(BLUEPRINT) : 'Not needed';
      el('estBuildL').textContent = bp ? 'Build, after the Blueprint credit' : 'Build';
      el('estBuild').textContent = usd(bp ? b - BLUEPRINT : b);
      el('estAfter').textContent = usd(a);
      el('estFrom').hidden = !a;
      el('estTotal').textContent = usd(b + a);
    };
    el('est').querySelectorAll('.seg button').forEach(btn => btn.addEventListener('click', () => {
      const k = btn.dataset.build ? 'build' : 'after';
      pick[k] = btn.dataset[k];
      btn.parentNode.querySelectorAll('button').forEach(o => o.setAttribute('aria-pressed', o === btn));
      draw();
    }));
    draw();
  }

})();
