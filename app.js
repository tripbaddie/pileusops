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
    // ---- the assessment: pick your apps, answer two questions, see your own map
    // the apps a B2B software or services company actually runs, grouped the way they were bought: team by team
    const GROUPS = [
      ['Marketing', 'mkt', ['Email marketing', 'Website or CMS', 'Forms and landing pages', 'Ads and SEO', 'Webinars and events']],
      ['Sales', 'sales', ['CRM', 'Proposals and quotes', 'E-signature', 'Outbound sequences', 'Lead and intent data']],
      ['Product', 'prod', ['Issue tracker', 'Product analytics', 'Code and releases', 'Customer feedback']],
      ['Delivery and internal', 'ops', ['Project tracker', 'Time tracking', 'Scheduling and resourcing', 'Docs and knowledge base', 'Spreadsheets', 'Team chat', 'HR and hiring']],
      ['Finance', 'fin', ['Invoicing and billing', 'Subscriptions and payments', 'Accounting', 'Expenses', 'Payroll', 'Reporting and dashboards']],
      ['Customer', 'cs', ['Help desk', 'Customer success', 'Onboarding checklists', 'Surveys and feedback']]
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
    go.addEventListener('click', () => {
      const mine = [...picked].sort((a, b) => a - b).map(i => APPS[i]), n = mine.length;
      el('rHead').textContent = `${n} apps today. 1 system.`;
      el('rApps').innerHTML = mine.map(tag).join('');
      el('rBefore').textContent = n * (n - 1) / 2;
      el('rAfter').textContent = '1';
      el('rAfterT').textContent = 'system that connects them all';
      el('rFirst').textContent = PROBLEMS[problem][sells === 1 ? 2 : 1];   // services get their own wording
      el('rFirstL').textContent = `The first thing we would build for a B2B ${['software company', 'services company', 'software and services company'][sells]}`;
      el('cPeople').value = [4, 12, 40, 100][size]; cost();
      box.classList.add('done'); el('sent').hidden = true;
      box.scrollIntoView({ behavior: calm ? 'auto' : 'smooth', block: 'nearest' });
    });
    // what the manual work costs, from the visitor's own numbers
    const money = n => '$' + Math.round(n).toLocaleString('en-US');
    function cost(){ const p = Math.max(0, +el('cPeople').value || 0), h = Math.max(0, +el('cHours').value || 0), r = Math.max(0, +el('cRate').value || 0);
      el('cOut').textContent = money(p * h * r * 50); el('cHow').textContent = `${p} people x ${h} hours x ${money(r)} x 50 working weeks. These are your numbers, so change any of them.`; }
    ['cPeople', 'cHours', 'cRate'].forEach(id => el(id).addEventListener('input', cost));
    // The email form posts to Web3Forms, which forwards each submission to the team inbox.
    // FORM_KEY is a Web3Forms access key. It is safe to keep in public code. Leave it empty to switch the form off.
    const FORM_KEY = '';
    const say = t => { const n = el('sent'); n.textContent = t; n.hidden = false; };
    el('send').addEventListener('submit', async e => {
      e.preventDefault();
      if (el('botcheck').checked) return;
      if (!FORM_KEY){ say('Thanks. Emailed reports are coming soon. Your full result is on this page.'); return; }
      const btn = el('sendBtn'), label = btn.textContent, mine = [...picked].sort((a, b) => a - b).map(i => APPS[i][0]);
      btn.disabled = true; btn.textContent = 'Sending';
      try {
        const r = await fetch('https://api.web3forms.com/submit', { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify({ access_key: FORM_KEY, subject: 'New assessment from pileusops.com', from_name: 'Pileus Ops website', email: el('email').value.trim(),
            sells: SELLS[sells] || '', apps: mine.join(', '), app_count: mine.length, team_size: SIZES[size] || '',
          problem: (PROBLEMS[problem] || [''])[0], first_build: el('rFirst').textContent,
            handoffs_today: el('rBefore').textContent, yearly_cost_of_manual_work: el('cOut').textContent,
            cost_inputs: `${el('cPeople').value} people, ${el('cHours').value} hours a week, $${el('cRate').value} an hour` }) });
        const j = await r.json().catch(() => ({}));
        if (!r.ok || j.success === false) throw new Error(j.message || 'send failed');
        say('Thanks. We have your results and will email your full report shortly.'); el('send').reset();
      } catch (err) { say('That did not send. Please try again in a moment.'); }
      btn.disabled = false; btn.textContent = label;
    });
    el('again').addEventListener('click', () => { box.classList.remove('done'); });
  }

})();
