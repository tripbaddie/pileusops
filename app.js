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
  // FORM_URL is the address of our own sending script (backend/forms.gs, running in the company Google account).
  // It is safe in public code. With it set, the note and the call request go straight to the inbox, and the
  // assessment emails each visitor a link to their own report.
  // CONTACT_EMAIL is the public address. With no FORM_URL, the note and the call request open the visitor's own
  // email with everything filled in, addressed to it, and the assessment closes on the call button instead.
  // Never leave both empty: no page may tell a visitor that something on our side is not set up.
  const FORM_URL = '';
  const CONTACT_EMAIL = 'contact@pileusops.com';
  const REPORT = !!FORM_URL;
  // kind is 'report', 'note' or 'call'. Returns 'sent' when the script has it, 'mail' when the visitor's own email took over
  async function post(kind, subject, email, fields, code){
    if (!FORM_URL){
      const body = Object.entries(Object.assign({ email }, fields)).filter(([, v]) => v !== '' && v != null).map(([k, v]) => `${k.replace(/_/g, ' ')}: ${v}`).join('\n');
      location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      return 'mail';
    }
    // sent as plain text on purpose: it keeps the browser from asking the script's permission first, which the script cannot answer
    const r = await fetch(FORM_URL, { method: 'POST', body: JSON.stringify({ kind, email, fields, code: code || '' }) });
    const j = await r.json().catch(() => ({}));
    if (!r.ok || !j.ok) throw new Error('send failed');
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
    // a visitor's answers as a short code, so their report can be reopened from a link. Each app is three characters made
    // from its name, so adding or reordering apps never breaks an old link. Renaming an app drops it from old links
    const KEYS = APPS.map(([name]) => { let h = 0; for (const c of name) h = (h * 31 + c.charCodeAt(0)) >>> 0; return (h % 46656).toString(36).padStart(3, '0'); });
    const whole = (id, max, by) => Math.min(max, Math.max(0, Math.round((+el(id).value || 0) * (by || 1))));
    const code = () => ['1', sells, size, problem, [...picked].sort((a, b) => a - b).map(i => KEYS[i]).join(''),
      whole('cPeople', 99999), whole('cHours', 9999, 10), whole('cRate', 99999), whole('cTools', 9999999)].join('-');
    let report = false;   // true when the page was opened from a report link
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
    // four paths work takes through a company. Each is [tab, map title, what follows the last stage, stages],
    // and a stage is [name, the apps that belong to it, the step that has to happen next]. Customers always shows; the rest show when the visitor runs them
    const PATHS = svc => [
      ['Customers', 'How a customer moves through your company', ['Renewal', 'The loop starts again'], [
        ['Leads', ['Email and marketing automation', 'Website or CMS', 'Landing pages and forms', 'Ad platforms', 'Webinar and event platform', 'Lead and intent data'], 'lead'],
        ['Deals', ['CRM', 'Sales engagement and outbound', 'Proposals and quoting'], 'sign'],
        ['Contract', ['E-signature'], 'setup'],
        [svc ? 'Delivery' : 'Onboarding', ['Customer onboarding', 'Project management', 'Time tracking', 'Resource scheduling', 'Product analytics'], 'bill'],
        ['Billing', ['Billing and invoicing', 'Payments and subscriptions', 'Accounting', 'Expense management'], 'support'],
        ['Support', ['Help desk', 'Customer success platform', 'Surveys and NPS']]]],
      ['Money', 'How money moves through your company', ['Month end', 'The books get closed'], [
        ['Quote', ['Proposals and quoting', 'CRM'], 'sign'],
        ['Contract', ['E-signature'], 'bill'],
        ['Invoice', ['Billing and invoicing', 'Payments and subscriptions'].concat(svc ? ['Time tracking'] : []), 'books'],
        ['Books', ['Accounting', 'Expense management', 'Payroll']]]],
      ['Product', 'How an idea becomes a release', ['Feedback', 'The loop starts again'], [
        ['Feedback', ['Help desk', 'Surveys and NPS'], 'road'],
        ['Roadmap', ['Feedback and roadmap'], 'work'],
        ['Build', ['Issue and sprint tracker', 'Code repository'], 'ship'],
        ['Launch', ['Email and marketing automation', 'Website or CMS', 'Knowledge base or wiki'], 'usage'],
        ['Usage', ['Product analytics']]]],
      ['Team', 'How your team runs', ['Next hire', 'The cycle starts again'], [
        ['Hire', ['HR system'], 'hire'],
        ['Onboard', ['Knowledge base or wiki', 'Team chat'], 'staff'],
        ['Work', ['Project management', 'Resource scheduling', 'Time tracking'], 'payroll'],
        ['Pay', ['Payroll', 'Expense management']]]]
    ];
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
      const under = own(UNDER), low = t => t.charAt(0).toLowerCase() + t.slice(1);

      // every step between stages, in an owner's words: [what has to happen, looks covered?, why it is worth a look]
      const leads = ['Email and marketing automation', 'Website or CMS', 'Landing pages and forms', 'Ad platforms', 'Webinar and event platform', 'Lead and intent data'].some(H);
      const bills = H('Billing and invoicing') || H('Accounting') || (svc && H('Payments and subscriptions'));
      const S = {
        lead: ['A new lead reaches sales', leads && H('CRM'), leads ? 'No CRM for leads to land in.' : 'Nothing you picked brings in leads.'],
        sign: ['The deal goes out to be signed', H('CRM') && H('E-signature'), H('E-signature') ? 'No CRM to carry the deal.' : 'Nothing you picked gets the contract signed.'],
        setup: svc ? ['The new project gets set up', false, H('Project management') ? 'Project setup is often done by hand.' : 'Nothing you picked sets up the project.']
          : ['The new customer gets set up', H('Customer onboarding'), 'Nothing you picked starts onboarding.'],
        bill: svc ? ['The work gets billed', H('Time tracking') && H('Billing and invoicing'), bills ? 'Hours and invoices often get matched by hand.' : 'Nothing you picked sends the bill.']
          : ['The customer gets billed', H('Payments and subscriptions'), bills ? 'Invoices are often raised by hand.' : 'Nothing you picked sends the bill.'],
        support: ['Support sees what the customer bought', H('Customer success platform'), H('Help desk') ? 'A help desk alone rarely shows what a customer pays or uses.' : 'Nothing you picked looks after customers.'],
        books: ['The payment lands in your books', H('Accounting') && H('Payments and subscriptions'), H('Accounting') ? 'Payments often get entered by hand.' : 'Nothing you picked keeps the books.'],
        road: ['Feedback reaches the roadmap', H('Feedback and roadmap'), 'Nothing you picked turns feedback into a roadmap.'],
        work: ['The roadmap becomes work for the team', H('Feedback and roadmap') && H('Issue and sprint tracker'), H('Issue and sprint tracker') ? 'The plan often gets copied into the tracker by hand.' : 'Nothing you picked tracks the build.'],
        ship: ['Customers hear what shipped', false, ['Email and marketing automation', 'Website or CMS', 'Knowledge base or wiki'].some(H) ? 'Release notes are usually written by hand.' : 'Nothing you picked tells customers what shipped.'],
        usage: ['You see whether anyone uses it', H('Product analytics'), 'Nothing you picked measures usage.'],
        hire: ['A new hire gets set up', false, H('HR system') ? 'Accounts are usually created one tool at a time.' : 'Nothing you picked tracks your people.'],
        staff: ['Work goes to whoever has room', H('Resource scheduling') && H('Project management'), H('Project management') ? 'Staffing often comes down to memory.' : 'Nothing you picked plans the work.'],
        payroll: ['Hours and changes reach payroll', H('Payroll') && H('HR system'), H('Payroll') ? 'Hours and changes often get keyed in by hand.' : 'Nothing you picked runs payroll.'],
        report: ['Everything gets pulled into a report', problem !== 0 && H('BI and dashboards'), problem === 0 ? 'You told us someone builds that report by hand.' : 'Nothing you picked reports across every stage.']
      };
      // the customer path always shows; another path shows when they run apps at two or more of its stages
      const paths = PATHS(svc).filter((p, i) => !i || p[3].filter(st => st[1].some(H)).length > 1);
      const keys = [...new Set(paths.flatMap(p => p[3].map(st => st[2]).filter(Boolean))), 'report'];
      const byHand = keys.filter(key => !S[key][1]), k = byHand.length, T = keys.length;

      // the three apps we would build, the first one answering the problem they picked
      const rep = new Set();
      const also = (xs, phrase) => { const a = own(xs); a.forEach(x => rep.add(x)); return a.length ? [phrase + ' ' + list(a)] : []; };
      const swap = xs => { const a = own(xs); a.forEach(x => rep.add(x)); return a; };
      const reads = (xs, max) => { const a = own(xs, max); return a.length > 1 ? 'your ' + list(a) : 'every app on your map'; };
      const signed = H('E-signature') ? 'E-signature completes' : H('CRM') ? 'a deal closes in your CRM' : 'a contract is signed';
      // every build: what it is, what it does with their own tools, and what it could replace
      const BUILD = {
        dash: () => ['A company dashboard', `Reads ${reads(['CRM', svc ? 'Project management' : 'Product analytics', 'Payments and subscriptions', 'Billing and invoicing', 'Accounting', 'Help desk'], 4)}. Every Monday it explains what moved and what to do about it.`,
          [...swap(['BI and dashboards']), ...also(['Spreadsheets'], 'the reports built in')]],
        onboard: () => svc
          ? ['A project setup app', `Builds the plan, staffs it from who has capacity and raises the first invoice the moment ${signed}.`,
              [...swap(['Resource scheduling', 'Time tracking']), ...(H('Resource scheduling') ? [] : also(['Spreadsheets'], 'the staffing plan kept in'))]]
          : ['A customer onboarding app', `Opens the moment ${signed}. Every step is owned, timed and visible to your team and your customer.`,
              [...swap(['Customer onboarding']), ...(H('Customer onboarding') ? [] : also(['Spreadsheets'], 'the onboarding run in'))]],
        health: () => svc
          ? ['A client health app', 'Scores every project on budget, schedule and client sentiment, and drafts the check-in the moment one slips.', swap(['Customer success platform', 'Surveys and NPS'])]
          : ['An account health app', 'Scores every account on usage, tickets and payments, and drafts the outreach the moment one slips.', swap(['Customer success platform', 'Surveys and NPS'])],
        intake: () => ['A single intake app', `Takes each new customer once and writes it into ${reads(['CRM', 'Billing and invoicing', 'Payments and subscriptions', 'Accounting', 'Project management', 'Help desk'], 3)}, so nobody types the same details twice.`,
          swap(['Landing pages and forms', 'Proposals and quoting'])],
        handoff: () => [svc ? 'A new project tracker' : 'A new customer tracker', `Follows every deal from signed to ${svc ? 'delivered' : 'live'}. Each step is owned, timed and visible, so nothing waits on one person remembering.`,
          [...swap(['Customer onboarding']), ...also(['Spreadsheets', 'Knowledge base or wiki'], 'the checklists kept in')]],
        invoice: () => ['An invoicing app', svc ? `Turns the hours in ${H('Time tracking') ? 'Time tracking' : 'your projects'} into invoices, sends them and chases them until they are paid.`
          : `Raises the invoice the moment ${signed}, sends it and chases it until it is paid.`, swap(['Billing and invoicing'])],
        books: () => ['A payment matching app', `Matches every payment to its invoice, posts it to ${H('Accounting') ? 'Accounting' : 'your books'} and flags the ones that do not match.`, []],
        feedback: () => ['A product feedback app', `Collects every request from ${reads(['Help desk', 'Surveys and NPS', 'CRM'], 3)}, groups them by theme and turns the top ones into work for the team.`, swap(['Feedback and roadmap'])],
        release: () => ['A release notes app', `Drafts the notes from what shipped in ${H('Issue and sprint tracker') ? 'your Issue and sprint tracker' : 'each release'}, and sends them to the customers who asked for it.`, []],
        hire: () => ['A new hire setup app', 'Creates the accounts, sends the paperwork and plans the first week the moment an offer is accepted.', []],
        staff: () => ['A staffing app', 'Shows who has room and gives new work to them, so nobody staffs a project from memory.',
          [...swap(['Resource scheduling']), ...(H('Resource scheduling') ? [] : also(['Spreadsheets'], 'the staffing plan kept in'))]],
        payroll: () => ['A payroll prep app', `Gathers hours, new starters and changes each pay period, and hands ${H('Payroll') ? 'Payroll' : 'your payroll'} a file that is ready to run.`, []]
      };
      // what we need from them to build each one. Shown on the report, not on the first result
      const NEEDS = {
        dash: 'Read access to the apps it reports from, and the numbers you look at first every Monday.',
        onboard: svc ? 'A recent project plan to model it on, your roles and rates, and access to where deals get signed.'
          : 'Your onboarding steps as they run today, who owns each one, and access to where deals get signed.',
        health: svc ? 'Access to your project and billing data, and what a client in trouble looks like to you.'
          : 'Access to usage, tickets and payments, and what an account in trouble looks like to you.',
        intake: 'The details you take from a new customer today, and access to each app they get typed into.',
        handoff: `The steps from signed to ${svc ? 'delivered' : 'live'} as they really happen, and who owns each one.`,
        invoice: `Your ${svc ? 'rates' : 'price list'}, your invoice template and your payment terms.`,
        books: 'Read access to your payments and your books, and how you sort income today.',
        feedback: 'Access to where requests arrive today, and the person who decides what gets built.',
        release: 'Access to where the work is tracked, and a release note you were happy with.',
        hire: 'The accounts every new hire gets, your paperwork, and a first week that went well.',
        staff: 'Who does what, the hours each person has, and the work already booked.',
        payroll: 'Your pay calendar, and access to where hours and changes are recorded.'
      };
      // which steps each build fixes, and the path it belongs to
      const FIXES = { dash: ['report'], onboard: svc ? ['setup', 'bill'] : ['setup'], health: ['support'], intake: ['lead', 'sign'], handoff: ['setup'], invoice: ['bill'], books: ['books'],
        feedback: ['road', 'work'], release: ['ship'], hire: ['hire'], staff: ['staff'], payroll: ['payroll'] };
      const HOME = { onboard: 'c', health: 'c', intake: 'c', handoff: 'c', invoice: 'm', books: 'm', feedback: 'p', release: 'p', hire: 't', staff: 't', payroll: 't' };
      // the first build answers the problem they picked. The next two go where their steps are done by hand, on the paths they run,
      // spread across paths before doubling up on one. If nothing else is by hand, fall back to the usual three for that problem
      const picks = [FIRST[problem][0]], done = new Set(FIXES[picks[0]]), run = new Set(paths.map(p => p[0][0].toLowerCase()));
      const gain = id => FIXES[id].filter(key => byHand.includes(key) && !done.has(key)).length;
      while (picks.length < 3){
        const pool = ['onboard', 'health', 'dash', 'invoice', 'feedback', 'hire', 'intake', 'books', 'release', 'staff', 'payroll'].filter(id => !picks.includes(id) && gain(id) > 0);
        const homes = new Set(picks.map(id => HOME[id]).filter(Boolean));
        const rank = id => (homes.has(HOME[id]) ? 2 : 0) + (HOME[id] && !run.has(HOME[id]) ? 1 : 0);   // a path not used yet first, and a path they run before one they do not
        pool.sort((x, y) => rank(x) - rank(y) || gain(y) - gain(x));
        const next = pool[0] || FIRST[problem].find(id => !picks.includes(id));
        picks.push(next); FIXES[next].forEach(key => done.add(key));
      }
      const builds = picks.map(id => [...BUILD[id](), FIXES[id]]);

      // one system, not three apps: what each build takes from the others. LINK is keyed 'from>to' and written for the card of the build that receives.
      // A build nothing feeds says what it feeds instead, and the dashboard reads whatever else was picked. See CLAUDE.md before adding a build
      const the = id => 'the ' + low(builds[picks.indexOf(id)][0].replace(/^An? /, ''));
      const unit = svc ? 'project' : 'customer';
      const acct = svc ? 'client' : 'account';
      const LINK = {
        'intake>onboard': f => `Starts from the customer record ${f} creates, so nothing is typed twice.`,
        'intake>handoff': f => `Starts from the customer record ${f} creates, so nothing is typed twice.`,
        'intake>invoice': f => `Bills from the customer record ${f} creates.`,
        'intake>health': f => `Starts scoring from the record ${f} creates.`,
        'intake>feedback': f => `Ties each request to the customer record ${f} creates, so you know who asked.`,
        'intake>release': f => `Sends the notes to the contacts in the record ${f} creates.`,
        'onboard>health': f => `Picks up each ${unit} from ${f}, so a slow start shows up as risk.`,
        'handoff>health': f => `Picks up each ${unit} from ${f}, so a slow start shows up as risk.`,
        'onboard>invoice': f => svc ? `Takes over after the first invoice ${f} raises.` : `Raises each invoice from what ${f} set up.`,
        'onboard>feedback': f => `Collects what comes up during ${svc ? 'delivery' : 'onboarding'} in ${f}.`,
        'handoff>feedback': f => `Collects what comes up while a ${unit} is going live in ${f}.`,
        'onboard>release': f => `Sends the notes to every ${unit} ${f} has taken live.`,
        'onboard>staff': f => svc ? `Staffs each new project the moment ${f} opens it.` : '',
        'handoff>staff': f => `Assigns each new ${unit} the moment ${f} opens it.`,
        'invoice>books': f => `Matches payments against the invoices ${f} sends.`,
        'intake>books': f => `Matches each payment to the customer in the record ${f} creates.`,
        'invoice>health': f => `Counts a late payment in ${f} as a sign of risk.`,
        'books>invoice': f => `Stops chasing an invoice the moment ${f} matches its payment.`,
        'books>health': f => `Counts a missed payment in ${f} as a sign of risk.`,
        'health>feedback': f => `Weighs each request by the health of the ${acct} that asked, from ${f}.`,
        'health>release': f => `Sends the news first to the ${acct}s ${f} marks at risk.`,
        'feedback>health': f => `Counts requests left unanswered in ${f} as a sign of risk.`,
        'feedback>release': f => `Tells the customers who asked, using the requests ${f} collected.`,
        'hire>staff': f => `Shows each new hire as available the day ${f} finishes.`,
        'hire>payroll': f => `Adds each new starter from ${f} to the next pay run.`,
        'hire>onboard': f => svc ? `Counts each new hire from ${f} as capacity for the next project.` : `Makes each new hire from ${f} an owner of onboarding steps from their first day.`,
        'hire>handoff': f => `Makes each new hire from ${f} an owner of steps from their first day.`,
        'handoff>release': f => `Sends the notes to every ${unit} ${f} has taken live.`,
        'handoff>invoice': f => `Bills every ${unit} ${f} is tracking, so none is missed.`,
        'staff>onboard': f => svc ? `Asks ${f} who has room before it staffs a project.` : '',
        'staff>health': f => svc ? `Marks a project at risk when ${f} shows its team is stretched.` : '',
        'staff>payroll': f => `Takes who worked on what from ${f}.`
      };
      // what each build tells the rest of the system, for a build that nothing among the three feeds
      const TELLS = { intake: 'who each new customer is', onboard: svc ? 'the plan and team for each project' : 'where each customer is in onboarding', handoff: `where each new ${unit} stands`,
        health: `which ${acct}s are at risk`, invoice: 'who has paid and who is late', books: 'which payments have landed', feedback: 'what customers are asking for',
        release: 'what shipped and who was told', hire: 'who is joining and when', staff: 'who has room', payroll: 'what each pay period costs' };
      const link = (f, t) => LINK[f + '>' + t] ? LINK[f + '>' + t](the(f)) : '';
      const joins = picks.map(to => {
        const others = picks.filter(id => id !== to);
        if (to === 'dash') return `Reads ${list(others.map(the))} as well, so one report covers all three.`;
        const from = others.map(f => link(f, to)).filter(Boolean).slice(0, 2);
        if (from.length) return from.join(' ');
        const feeds = others.filter(t => t === 'dash' || link(to, t));
        return feeds.length ? `Tells ${list(feeds.map(the))} ${TELLS[to]}.` : '';
      });
      // the record the three share, named from the paths they sit on
      const HELD = { c: svc ? 'Clients and projects' : 'Customers', m: 'Invoices and payments', p: 'Requests and releases', t: 'People and hours' };
      const held = ['c', 'm', 'p', 't'].filter(h => picks.some(id => HOME[id] === h)).map(h => HELD[h]);
      const record = held.length ? held : [HELD.c];

      // headline, and their own answers played back
      el('rHead').textContent = `${n} apps. ${k === 0 ? `On paper, all ${T} steps between them look covered.` : k === T ? `All ${T} steps between them may still be done by hand.` : `${k} of the ${T} steps between them may still be done by hand.`}`;
      el('rTold').innerHTML = `<em>What you told us</em><span>B2B ${kind}</span><span>${SIZES[size]} people</span><span class="p">${PROBLEMS[problem][0]}</span>`;

      // the map: one tab per path they run, each stage with its apps and the step that follows it
      const app = x => `<li style="--c:${C[team[x]]}"><span>${x}</span></li>`;
      const draw = v => { const [, title, [after, then], stages] = paths[v];
        [...el('rTabs').children].forEach((b, i) => b.setAttribute('aria-selected', i === v));
        el('rMapT').textContent = title;
        el('rStages').innerHTML = stages.map(([name, apps, key], i) => { const a = own(apps), st = key && S[key];
          const next = st ? `<div class="rho ${st[1] ? 'ok' : 'look'}"><small>Next</small><b>${st[0]}</b>${st[1] ? 'Looks covered' : '<i>Worth a look.</i> ' + st[2]}</div>`
            : `<div class="rho last"><small>Next</small><b>${after}</b>${then}</div>`;
          return `<div class="rst"><div><span class="n">0${i + 1}</span><b class="t">${name}</b></div><ul class="rapps">${a.length ? a.map(app).join('') : '<li class="none">No tool picked</li>'}</ul>${next}</div>`; }).join(''); };
      el('rTabs').hidden = paths.length < 2;
      el('rTabs').innerHTML = paths.map(([name]) => `<button type="button" role="tab">${name}</button>`).join('');
      [...el('rTabs').children].forEach((b, i) => b.addEventListener('click', () => draw(i)));
      draw(0);
      el('rUnder').innerHTML = `<div><small>Underneath all of it</small><b>Reporting</b></div><p>${under.length ? list(under) + (under.length > 1 ? ' sit' : ' sits') + ' underneath every stage.' : 'Nothing you picked sits underneath the stages.'} ${S.report[1] ? '' : S.report[2]}</p><span class="rp ${S.report[1] ? 'ok' : 'look'}">${S.report[1] ? 'Looks covered' : 'Worth a look'}</span>`;
      const placed = new Set(paths.flatMap(p => p[3].flatMap(st => st[1])).concat(UNDER)), loose = names.filter(x => !placed.has(x));
      el('rAlso').hidden = !loose.length; el('rAlso').textContent = loose.length ? `Also in your stack: ${list(loose)}.` : '';

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
      el('rBuilds').innerHTML = builds.map(([title, does, reps, closes], i) => { const c = closes.filter(key => byHand.includes(key));
        const tags = (i ? [] : ['Answers the problem you picked', 'First build live in 2 to 3 weeks']).concat(c.map(key => 'Covers: ' + low(S[key][0])));
        return `<div class="rb${i ? '' : ' top'}"><b>${i + 1}</b><div class="w"><h4>${title}</h4><p>${does}</p>${joins[i] ? `<p class="lk"><small>Connects</small>${joins[i]}</p>` : ''}${report ? `<p class="lk"><small>Needs from you</small>${NEEDS[picks[i]]}</p>` : ''}</div><div class="x"><div class="rr"><small>${reps.length ? 'Could replace' : 'Fills a gap'}</small>${reps.length ? cap(list(reps)) : 'Nothing you picked does this today.'}</div><div class="tags">${tags.map(t => `<span class="rp t">${t}</span>`).join('')}</div></div></div>`; }).join('');
      el('rSys').innerHTML = `<p class="lab">How the three fit together</p><div class="rsys3">${builds.map(([title], i) => `<span><b>${i + 1}</b>${title.replace(/^An? /, '').replace(/^./, c => c.toUpperCase())}</span>`).join('')}</div>`
        + `<div class="rsysl" aria-hidden="true"><i></i><i></i><i></i></div><div class="rsysb"><small>What all three read and write</small><b>One shared record of your company</b><ul class="cslist">${record.map(r => `<li>${r}</li>`).join('')}</ul></div>`
        + `<p class="rsysn">Each one reads and writes the same record, so the three work as one system. Whatever we build next joins it.</p>`;
      const open = names.filter(x => !rep.has(x));
      el('rMore').hidden = !open.length;
      el('rMore').innerHTML = open.length ? `<p class="lab">${open.length} more app${open.length > 1 ? 's' : ''} to go through together</p><div class="rchips">${open.map(x => `<span>${x}</span>`).join('')}</div>` : '';

      // the cost of today, starting from the problem they picked
      const [cHead, cDoing, cWhat, cHrs, cPpl] = COSTS[problem];
      el('cHead').textContent = cHead; el('cDoing').textContent = cDoing;
      el('cPeople').value = cPpl[size]; el('cHours').value = cHrs; el('cRate').value = 50; el('cTools').value = 0;
      el('cNote').textContent = report ? 'These are the numbers you gave us. Change any of them and the total updates.'
        : `These are our starting guesses for a ${kind} company of ${SIZES[size].toLowerCase()} people. Change any number to match yours.`;
      costWhat = cWhat; costDoing = cDoing; cost();

      // the close: the report by email when there is a form key, the call when there is not
      const start = byHand.length ? `we start where ${low(S[byHand[0]][0])}` : 'we walk through your map';
      const mail = REPORT && !report;   // someone reading their report already has it
      el('rCloseA').hidden = el('rCloseB').hidden = !mail; el('rCloseC').hidden = mail;
      el('rShare').hidden = !report;
      el('rCall').innerHTML = `Or <a href="/call/">book 15 minutes</a> and ${start} with you.`;
      el('rCallOnly').textContent = `Fifteen minutes. ${cap(start)} and tell you what we would build first.`;

      shown = { sells: SELLS[sells], apps: names.join(', '), app_count: n, team_size: SIZES[size], problem: PROBLEMS[problem][0],
        paths_shown: paths.map(p => p[0]).join(', '), steps_worth_a_look: byHand.map(key => S[key][0]).join(' | ') || 'none', questions: qs.map(x => x.q).join(' | '),
        builds: builds.map(([t, , r], i) => `${i + 1}. ${t}${r.length ? ' (could replace ' + list(r) + ')' : ''}`).join(' | '), how_they_connect: joins.filter(Boolean).join(' | ') || 'none', shared_record: record.join(', '), still_open: open.join(', ') };
      box.classList.add('done'); el('sent').hidden = true;
      if (!report) box.scrollIntoView({ behavior: calm ? 'auto' : 'smooth', block: 'start' });
    });
    // what today costs, from the visitor's own numbers: hours by hand, plus any tools they want to stop paying for
    const money = n => '$' + Math.round(n).toLocaleString('en-US');
    let costWhat = '', costDoing = '';
    function cost(){ const v = id => Math.max(0, +el(id).value || 0), p = v('cPeople'), h = v('cHours'), r = v('cRate'), t = v('cTools') * 12, hrs = p * h * r * 50;
      el('cOut').textContent = money(hrs + t);
      el('cOutL').textContent = t ? 'a year in hours by hand and tools you rent' : 'a year spent ' + costWhat;
      el('cHow').textContent = `${p} people x ${h} hours x ${money(r)} x 50 working weeks.` + (t ? ` Plus ${money(t)} a year in tools.` : '');
      // the report spells out what the number rests on, so finance can check it
      el('cAsm').hidden = !report;
      if (report) el('cAsm').innerHTML = '<p class="lab">The assumptions behind this number</p><ul>' + [
        `${p} people each spend ${h} hours a week ${costDoing}.`,
        `An hour of their time costs you ${money(r)}. Use what an hour really costs you, pay and overheads together.`,
        'A year is 50 working weeks.',
        t ? `Tools you would like to drop cost ${money(t / 12)} a month, which is ${money(t)} a year.` : 'No tool costs are in it. Add what you would like to stop paying for and the total updates.',
        'It counts time only. Mistakes, delays and lost deals are not in it.'].map(x => `<li>${x}</li>`).join('') + '</ul>'; }
    ['cPeople', 'cHours', 'cRate', 'cTools'].forEach(id => el(id).addEventListener('input', () => { cost(); if (report) history.replaceState(null, '', '?r=' + code()); }));
    const say = t => { const n = el('sent'); n.textContent = t; n.hidden = false; };
    el('send').addEventListener('submit', async e => {
      e.preventDefault();
      if (el('botcheck').checked) return;
      const btn = el('sendBtn'), label = btn.textContent;
      btn.disabled = true; btn.textContent = 'Sending';
      try {
        const how = await post('report', 'New assessment from pileusops.com', el('email').value.trim(), Object.assign({}, shown, { yearly_cost: el('cOut').textContent,
          cost_inputs: `${el('cPeople').value} people, ${el('cHours').value} hours a week, $${el('cRate').value} an hour, $${el('cTools').value} a month on tools` }), code());
        if (how === 'mail') say('Press send in the email that just opened and we will send your report.');
        else { say('Thanks. Your report is on its way to your inbox.'); el('send').reset(); }
      } catch (err) { say('That did not send. Please try again in a moment.'); }
      btn.disabled = false; btn.textContent = label;
    });
    el('again').addEventListener('click', () => { if (report){ location.href = '/assessment/'; return; }
      box.classList.remove('done'); box.scrollIntoView({ behavior: calm ? 'auto' : 'smooth', block: 'start' }); });
    el('rCopy').addEventListener('click', async () => { const b = el('rCopy');
      try { await navigator.clipboard.writeText(location.href); b.textContent = 'Link copied'; } catch (err){ b.textContent = 'Copy it from the address bar'; } });

    // a report link: put the answers back, show the result, and add what the emailed report promises
    const link = /[?&]r=(1-[0-2]-[0-3]-[0-4]-(?:[0-9a-z]{3}){3,31}-\d{1,5}-\d{1,4}-\d{1,5}-\d{1,7})(?:&|$)/.exec(location.search);
    if (link){
      const [, s, z, p, apps, cp, ch, cr, ct] = link[1].split('-');
      const press = (host, i) => { const b = el(host).querySelectorAll('.opt')[i]; if (b) b.click(); };
      apps.match(/.{3}/g).forEach(key => { const i = KEYS.indexOf(key); if (i >= 0 && !picked.has(i)) press('optApps', i); });
      press('optSells', +s); press('optSize', +z); press('optStuck', +p);
      if (!go.disabled){
        report = true; go.click();
        el('cPeople').value = +cp; el('cHours').value = +ch / 10; el('cRate').value = +cr; el('cTools').value = +ct; cost();
        el('aHead').textContent = 'Your company map.';
        el('aSub').textContent = 'Built from the answers you gave us. Everything here is yours to share with your team.';
        el('aAlt').hidden = true;
        if (el('aDef')) el('aDef').hidden = true;
        document.title = 'Your company map | Pileus Ops';
        const m = document.createElement('meta'); m.name = 'robots'; m.content = 'noindex'; document.head.appendChild(m);
      }
    }
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
        const how = await post('call', 'New call request from pileusops.com', el('bkEmail').value.trim(), {
          name: el('bkName').value.trim(), company: el('bkCo').value.trim(),
          requested_time_your_clock: ours, requested_time_their_clock: `${dayName(slot)} at ${timeName(slot)} (${zone})`,
          starts_utc: slot.toISOString(), length_minutes: CAL.minutes, to_cover: el('bkNote').value.trim() });
        el('bkOk').textContent = `Asked for ${dayName(slot)} at ${timeName(slot)}.`;
        el('bkOkSub').textContent = how === 'mail'
          ? `Press send in the email that just opened and we will confirm within one business day. No email app? Write to ${CONTACT_EMAIL}.`
          : 'We confirm by email within one business day. Nothing is on your calendar until then, so add a hold if you want to keep the time free.';
        el('bkIcs').href = hold(slot);
        form.hidden = true; done.hidden = false;
        done.scrollIntoView({ behavior: calm ? 'auto' : 'smooth', block: 'center' });
      } catch (err){ el('bkHint').textContent = 'That did not send. Please try again in a moment.'; }
      btn.disabled = false; btn.textContent = label;
    });

    drawMonth(); drawTimes();
    if (keys.length) { day = keys[0]; drawMonth(); drawTimes(); }
  }

  // ---- contact: one note, same inbox
  if (el('cxform')){
    const note = t => { const n = el('cxSent'); n.textContent = t; n.hidden = false; };
    el('cxform').addEventListener('submit', async e => {
      e.preventDefault();
      if (el('cxBot').checked) return;
      const btn = el('cxSend'), label = btn.textContent;
      btn.disabled = true; btn.textContent = 'Sending';
      try {
        const how = await post('note', 'New note from pileusops.com', el('cxEmail').value.trim(), { name: el('cxName').value.trim(),
          company: el('cxCo').value.trim(), team_size: el('cxSize').value.trim(), message: el('cxNote').value.trim() });
        if (how === 'mail') note(`Press send in the email that just opened and we will come back within one business day. No email app? Write to ${CONTACT_EMAIL}.`);
        else { note('Thanks. We will come back within one business day.'); el('cxform').reset(); }
      } catch (err){ note('That did not send. Please try again in a moment.'); }
      btn.disabled = false; btn.textContent = label;
    });
  }

  // ---- pricing: two choices add up to a first year. Starting prices only, the quote sets the real one
  if (el('est')){
    // a first build needs no Blueprint. A function build does, and the Blueprint fee comes off it
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

  // ---- the example Blueprint map, in full on /blueprint/ and as a short preview on /pricing/. Six teams of apps, every handoff between them, and the
  // stuck ones numbered in the order we would fix them. An illustration, not anyone's real company.
  // The numbers match the first pieces listed under the map in blueprint/index.html: change one, change the other
  if (el('bpdraw')){
    // lanes left to right, apps top to bottom. Short names: the full ones do not fit a node
    const LANES = [
      ['Marketing', ['Ad platforms', 'Website', 'Forms', 'Marketing automation', 'Webinars']],
      ['Sales', ['Intent data', 'Outbound', 'CRM', 'Quoting', 'E-signature']],
      ['Delivery', ['Projects', 'Time tracking', 'Scheduling', 'Spreadsheets', 'Wiki', 'Team chat', 'HR system']],
      ['Finance', ['Invoicing', 'Payments', 'Accounting', 'Expenses', 'Payroll', 'Dashboards']],
      ['Customer', ['Onboarding', 'Customer success', 'Help desk', 'Surveys']],
      ['Product', ['Roadmap', 'Sprint tracker', 'Code repository', 'Product analytics']]
    ];
    // every handoff: from, to, and how it moves. a = on its own, h = by hand, 1 to 5 = stuck, in fix order
    const HAND = [
      ['Ad platforms', 'Website', 'a'], ['Website', 'Forms', 'a'], ['Forms', 'Marketing automation', 'a'], ['Webinars', 'Marketing automation', 'h'],
      ['Marketing automation', 'CRM', 'a'], ['Forms', 'CRM', 1], ['Webinars', 'Outbound', 'h'], ['Ad platforms', 'Intent data', 'h'],
      ['Intent data', 'Outbound', 'a'], ['Outbound', 'CRM', 'a'], ['CRM', 'Quoting', 'h'], ['Quoting', 'E-signature', 'a'],
      ['E-signature', 'Projects', 2], ['E-signature', 'Invoicing', 'h'], ['CRM', 'Spreadsheets', 'h'], ['Quoting', 'Scheduling', 'h'],
      ['Projects', 'Time tracking', 'a'], ['Time tracking', 'Scheduling', 'h'], ['Scheduling', 'Spreadsheets', 'h'], ['Wiki', 'Team chat', 'a'],
      ['Time tracking', 'Invoicing', 3], ['Spreadsheets', 'Dashboards', 'h'], ['HR system', 'Payroll', 'a'], ['Team chat', 'Help desk', 'h'],
      ['Projects', 'Onboarding', 'a'], ['Invoicing', 'Payments', 'a'], ['Payments', 'Accounting', 4], ['Expenses', 'Accounting', 'a'],
      ['Payroll', 'Accounting', 'h'], ['Accounting', 'Dashboards', 'h'], ['Payments', 'Customer success', 'h'], ['Invoicing', 'Onboarding', 'h'],
      ['Onboarding', 'Customer success', 'h'], ['Customer success', 'Help desk', 'a'], ['Help desk', 'Surveys', 'a'], ['Help desk', 'Sprint tracker', 5],
      ['Surveys', 'Roadmap', 'h'], ['Roadmap', 'Sprint tracker', 'a'], ['Sprint tracker', 'Code repository', 'a'], ['Product analytics', 'Customer success', 'h'],
      ['Product analytics', 'Dashboards', 'h'], ['CRM', 'Dashboards', 'h']
    ];
    const W = 1200, H = 524, NW = 148, NH = 30, TOP = 74, GAP = 66, LW = W / LANES.length;
    const at = {};
    LANES.forEach(([, apps], i) => {
      const y0 = TOP + (7 - apps.length) * GAP / 2;   // shorter lanes sit centred against the longest
      apps.forEach((a, j) => { at[a] = { x: LW * i + LW / 2, y: y0 + j * GAP, lane: i, row: j }; });
    });
    let lines = '', pins = '';
    HAND.forEach(([f, t, k]) => {
      const a = at[f], b = at[t], stuck = typeof k === 'number';
      let d, mx, my;
      if (a.lane === b.lane && Math.abs(a.row - b.row) === 1){          // neighbours: straight down or up
        const dir = b.y > a.y ? 1 : -1;
        d = `M${a.x} ${a.y + dir * NH / 2}V${b.y - dir * NH / 2}`; mx = a.x; my = (a.y + b.y) / 2;
      } else if (a.lane === b.lane){                                    // same lane, apart: loop round the side
        const x = a.x + NW / 2, out = 34;
        d = `M${x} ${a.y}C${x + out} ${a.y} ${x + out} ${b.y} ${x} ${b.y}`; mx = x + out * .75; my = (a.y + b.y) / 2;
      } else {                                                          // across lanes: side to side
        const dir = b.x > a.x ? 1 : -1, x1 = a.x + dir * NW / 2, x2 = b.x - dir * NW / 2, m = (x1 + x2) / 2;
        d = `M${x1} ${a.y}C${m} ${a.y} ${m} ${b.y} ${x2} ${b.y}`; mx = m; my = (a.y + b.y) / 2;
      }
      lines += `<path class="${stuck ? 's' : k}" d="${d}"/>`;
      if (stuck) pins += `<g transform="translate(${mx} ${my})"><circle r="12"/><text y="4.5">${k}</text></g>`;
    });
    const heads = LANES.map(([n, apps], i) => `<text class="lh" x="${LW * i + LW / 2}" y="34">${n}<tspan class="ln" dx="8">${apps.length}</tspan></text>`).join('');
    const rules = LANES.slice(1).map((_, i) => `<path class="rule" d="M${LW * (i + 1)} 60V${H - 14}"/>`).join('');
    const nodes = Object.entries(at).map(([n, p]) => `<g transform="translate(${p.x - NW / 2} ${p.y - NH / 2})"><rect width="${NW}" height="${NH}" rx="9"/><text x="${NW / 2}" y="19.5">${n}</text></g>`).join('');
    el('bpdraw').innerHTML = `<svg viewBox="0 0 ${W} ${H}" aria-hidden="true"><defs><pattern id="bpdots" width="20" height="20" patternUnits="userSpaceOnUse"><circle cx="10" cy="10" r="1"/></pattern></defs>`
      + `<rect class="dots" y="50" width="${W}" height="${H - 50}" fill="url(#bpdots)"/>${rules}${heads}<g class="hand">${lines}</g><g class="node">${nodes}</g><g class="pin">${pins}</g></svg>`;
    el('bpstat').textContent = `${Object.keys(at).length} apps, ${HAND.length} handoffs`;
  }

})();
