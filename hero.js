// the home page hero: app sprawl becomes one system, then one new order moves through it
// one app per team stays and connects, top to bottom, and the four that get rebuilt inside the system
const KEEP = [['Email marketing', 'mkt'], ['CRM', 'sales'], ['Project tracker', 'ops'], ['Billing', 'fin'], ['Help desk', 'cs']];
const BUILT = [['Forms', 'mkt'], ['Proposals', 'sales'], ['Scheduling', 'ops'], ['Reporting', 'fin']];
const SPRAWL = [[600, 130, -11], [330, 300, 8], [700, 330, -6], [110, 420, 12], [430, 470, -9], [650, 610, 7], [240, 660, -12], [140, 150, 9], [470, 770, 10]];
const IDLE = { mkt: 'Campaigns and leads', sales: 'Pipeline and quotes', ops: 'Scheduling and delivery', fin: 'Invoices and payments', cs: 'Onboarding and support' };
// what one new order sets off, team by team
const ORDER = { mkt: 'Source traced to the March webinar', sales: 'Contract read. 1 unusual term flagged', ops: 'Kickoff staffed by who has capacity', fin: 'Invoice drafted from the contract', cs: 'Onboarding plan written for their goals' };
const ASK = { sales: 1, fin: 1 };   // the steps that wait for a person
const BUYERS = ['Acme Co.', 'Northwind Supply', 'Harbor & Pine', 'Juniper Labs'];
const stage = $('stage'), under = $('under'), tilesEl = $('tiles'), lanesEl = $('lanes'), chipsEl = $('chips'), pill = $('pill'), panel = $('panel');
const still = matchMedia('(prefers-reduced-motion: reduce)').matches;
const phone = matchMedia('(max-width: 860px)');

// the system: one lane per team, and a shelf for what was rebuilt
const laneEls = {};
TEAMS.forEach(g => {
  const el = document.createElement('div'); el.className = 'lane'; el.dataset.g = g; el.style.cssText = `--c:${C[g]};--t:${TINT[g]}`;
  el.style.setProperty('--ct', GLY[g]);
  el.innerHTML = `<div class="r"><b><span class="dot"></span>${NAMES[g]}</b><span class="chip${ASK[g] ? ' ask' : ''}">${ASK[g] ? 'You approve' : '<svg viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M2.5 6.4l2.3 2.3 4.7-5"/></svg>Done'}</span></div><p>${IDLE[g]}</p>`;
  lanesEl.appendChild(el); laneEls[g] = el;
});
const thread = document.createElement('div'); thread.className = 'thread'; lanesEl.appendChild(thread);
const chipEls = BUILT.map(([name, g], i) => { const c = document.createElement('div'); c.className = 'bchip'; c.style.setProperty('--d', (1.25 + i * 0.13).toFixed(2) + 's');
  c.innerHTML = glyph(g, C[g]) + name; chipsEl.appendChild(c); return c; });

// apps
const ALL = [...KEEP.map(a => [...a, 'keep']), ...BUILT.map(a => [...a, 'built'])];
const tileEls = ALL.map(([name, g, kind], i) => {
  const d = document.createElement('div'); d.className = 'tile ' + kind; d.dataset.g = g;
  d.style.setProperty('--team', C[g]); d.innerHTML = glyph(g) + name; tilesEl.appendChild(d); return d;
});
const PX = 424, PY = 86, KY = i => 215 + i * 100;
function place(){
  ALL.forEach(([name, g, kind], i) => { const d = tileEls[i], s = SPRAWL[i]; let x, y, delay;
    if (kind === 'keep'){ x = 150; y = KY(i); delay = i * 0.06; }
    else { const c = chipEls[i - KEEP.length]; x = PX + c.offsetLeft + c.offsetWidth / 2; y = PY + c.offsetTop + c.offsetHeight / 2; delay = 0.55 + (i - KEEP.length) * 0.13; }
    d.style.setProperty('--x', x + 'px'); d.style.setProperty('--y', y + 'px'); d.style.setProperty('--sx', (s[0] - x) + 'px'); d.style.setProperty('--sy', (s[1] - y) + 'px');
    d.style.setProperty('--sr', s[2] + 'deg'); d.style.setProperty('--d', delay.toFixed(2) + 's'); });
  // one clean line from each remaining app to its team's lane; they never cross
  const seen = {}; let svg = '', sp = '';
  KEEP.forEach(([name, g], i) => { const y = KY(i), lane = laneEls[g]; seen[g] = (seen[g] || 0) + 1;
    const ey = PY + lanesEl.offsetTop + lane.offsetTop + lane.offsetHeight / 2 + (seen[g] - 1.5) * 12 + (KEEP.filter(k => k[1] === g).length === 1 ? 6 : 0);
    const d = `M150,${y} C300,${y} 300,${ey} ${PX},${ey}`;
    svg += `<path class="thr" data-i="${i}" d="${d}" stroke="${C[g]}" style="--d:${(0.45 + i * 0.07).toFixed(2)}s"/><circle class="end" data-i="${i}" cx="${PX}" cy="${ey}" r="7" fill="${C[g]}" style="--d:${(1.2 + i * 0.07).toFixed(2)}s"/>`;
    sp += `<path class="spark" data-i="${i}" d="${d}"/>`; });
  under.innerHTML = svg + sp;
  thr = [...under.querySelectorAll('.thr')]; ends = [...under.querySelectorAll('.end')]; spark = [...under.querySelectorAll('.spark')];
  spark.forEach(p => { const L = len(p) || 400; p.style.cssText = `--L:${L}px;stroke-dasharray:34 ${L + 60}`; });
  dotY = TEAMS.map(g => { const d = laneEls[g].querySelector('.dot'); return d.offsetTop + d.offsetHeight / 2; });
}
let thr = [], ends = [], spark = [], dotY = [];
const len = p => { try { return p.getTotalLength(); } catch (e) { return 0; } };
function hide(){ thr.forEach(p => { const L = len(p) || 900; p.style.transition = 'none'; p.style.strokeDasharray = L; p.style.strokeDashoffset = L; });
  void stage.offsetWidth; thr.forEach(p => { p.style.transition = ''; }); }

// the transformation
let timers = [], connected = false;
const later = (fn, ms) => timers.push(setTimeout(fn, still ? 0 : ms));
function connect(){
  timers.forEach(clearTimeout); timers = [];
  stage.classList.add('sys');                                              // the system arrives
  later(() => stage.classList.remove('sprawl'), 250);                      // five apps line up; four fly into the system and are rebuilt there
  later(() => { thr.forEach(p => p.style.strokeDashoffset = 0); stage.classList.add('wired'); }, 300);
  later(() => { pill.textContent = '5 apps · 1 system'; document.body.classList.add('on'); }, 1900);
  later(() => { connected = true; stage.classList.add('live'); after(order, 1300); }, 2300);
}
function replay(){
  timers.forEach(clearTimeout); timers = []; connected = false; focus(null); resetStory();
  stage.classList.remove('sys', 'live', 'wired'); document.body.classList.remove('on'); stage.classList.add('sprawl');
  pill.textContent = '9 apps'; hide(); later(connect, 1000);
}
$('replay').addEventListener('click', replay);

// one order, the whole company: the order bar starts it, a thread runs down the teams, and each team's step is done in turn
const evt = $('evt'), evtT = $('evtT'), clock = $('clock');
let story = [], raf = 0, buyer = 0;
const after = (fn, ms) => story.push(setTimeout(fn, still ? 0 : ms));
function resetStory(){
  story.forEach(clearTimeout); story = []; cancelAnimationFrame(raf);
  evt.classList.remove('run', 'done'); evtT.textContent = 'Sign a new customer';
  TEAMS.forEach(g => { const el = laneEls[g]; el.classList.remove('fire', 'flash'); el.querySelector('p').textContent = IDLE[g]; });
  tileEls.forEach(t => t.classList.remove('bump'));
  thread.style.transition = 'none'; thread.style.height = '0px'; void thread.offsetWidth; thread.style.transition = '';
}
function fire(g, i){
  const el = laneEls[g]; el.querySelector('p').textContent = ORDER[g]; el.classList.add('fire', 'flash');
  setTimeout(() => el.classList.remove('flash'), 900);
  const k = KEEP.findIndex(a => a[1] === g);                                // the step lands in that team's app too
  if (k >= 0 && spark[k] && !still){ const sp = spark[k], tile = tileEls[k]; sp.classList.remove('go'); void sp.getBoundingClientRect(); sp.classList.add('go');
    setTimeout(() => tile.classList.add('bump'), 520); setTimeout(() => tile.classList.remove('bump'), 1150); }
}
function order(){
  if (!connected || evt.classList.contains('run')) return;
  resetStory(); evt.classList.add('run'); evtT.textContent = 'New customer · ' + BUYERS[buyer++ % BUYERS.length];
  const t0 = performance.now(), END = 4000;
  const tick = () => { const s = Math.min((performance.now() - t0) / 1000, END / 1000); clock.textContent = s.toFixed(1) + 's'; if (s < END / 1000) raf = requestAnimationFrame(tick); };
  if (!still) tick();
  TEAMS.forEach((g, i) => { const t = 450 + i * 800;
    after(() => { thread.style.height = (dotY[i] + 14) + 'px'; }, t - 450);
    after(() => fire(g, i), t); });
  after(() => { cancelAnimationFrame(raf); evt.classList.replace('run', 'done'); evtT.textContent = 'Done · 5 teams updated'; clock.textContent = '4.0s';
    if (!still) after(() => { resetStory(); after(order, 2400); }, 4800); }, END);
}
evt.addEventListener('click', order);

// hover an app or a lane: its line and its lane light up together
function focus(match){
  stage.classList.toggle('dim', !!match);
  KEEP.forEach((k, i) => { const on = !!match && match(i); tileEls[i].classList.toggle('hot', on); if (thr[i]){ thr[i].classList.toggle('hot', on); ends[i].classList.toggle('hot', on); spark[i].classList.toggle('hot', on); } });
  TEAMS.forEach(g => laneEls[g].classList.toggle('hot', !!match && KEEP.some((k, i) => k[1] === g && match(i))));
}
KEEP.forEach((k, i) => { tileEls[i].addEventListener('pointerenter', () => connected && focus(j => j === i)); tileEls[i].addEventListener('pointerleave', () => focus(null)); });
TEAMS.forEach(g => { laneEls[g].addEventListener('pointerenter', () => connected && focus(j => KEEP[j][1] === g)); laneEls[g].addEventListener('pointerleave', () => focus(null)); });

// fit the diagram to its column, and let the cursor tilt it a little
const viz = $('viz'), tilt = $('tilt');
function fit(){ stage.style.transform = phone.matches ? '' : `scale(${viz.clientWidth / 844})`; place();
  if (stage.classList.contains('wired')) thr.forEach(p => { p.style.strokeDasharray = 'none'; }); else hide(); }
addEventListener('resize', fit);
(document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve()).then(() => { fit(); later(connect, 1000); });
if (!still && matchMedia('(hover: hover)').matches){
  viz.addEventListener('pointermove', e => { const r = viz.getBoundingClientRect();
    tilt.style.setProperty('--ry', ((e.clientX - r.left) / r.width - 0.5) * 7 + 'deg');
    tilt.style.setProperty('--rx', -((e.clientY - r.top) / r.height - 0.5) * 5 + 'deg'); });
  viz.addEventListener('pointerleave', () => { tilt.style.setProperty('--ry', '0deg'); tilt.style.setProperty('--rx', '0deg'); });
}
