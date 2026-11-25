// Pileus Ops website forms.
// A Google Apps Script web app. It receives the three forms on pileusops.com and sends the email:
//   report  the assessment: emails the visitor a link to their own report, and the team the lead
//   note    the Contact form: emails the team
//   call    the Book a call form: emails the team
// It only ever sends. Nothing a visitor types reaches another visitor: the report email is fixed copy
// plus a link built from a code this script checks first.
// The copy of this file in the website repository is for reference. The live one is in script.google.com.

const FROM = 'contact@pileusops.com';   // must be a "Send mail as" address in the Gmail that runs this
const NAME = 'Pileus Ops';
const SITE = 'https://pileusops.com';
const DAILY_CAP = 400;                   // emails a day, a brake if someone leans on the forms
const EMAIL = /^[A-Za-z0-9._%+-]{1,64}@[A-Za-z0-9.-]{1,180}\.[A-Za-z]{2,24}$/;
const CODE = /^1-[0-2]-[0-3]-[0-4]-(?:[0-9a-z]{3}){3,31}-\d{1,5}-\d{1,4}-\d{1,5}-\d{1,7}$/;
const SUBJECT = { report: 'New assessment from pileusops.com', note: 'New note from pileusops.com', call: 'New call request from pileusops.com' };

function doGet() { return out(true); }

function doPost(e) {
  try {
    const d = JSON.parse(e.postData.contents);
    const kind = String(d.kind), email = String(d.email || '').trim();
    if (!SUBJECT[kind] || !EMAIL.test(email)) return out(false);
    const fields = clean(d.fields);
    if (!fields) return out(false);
    const code = kind === 'report' ? String(d.code || '') : '';
    if (kind === 'report' && !CODE.test(code)) return out(false);
    const link = code ? SITE + '/assessment/?r=' + code : '';

    // one report email per address every ten minutes, however often the button is pressed
    const cache = CacheService.getScriptCache(), seen = 'r:' + email.toLowerCase();
    const again = kind === 'report' && cache.get(seen);
    const toVisitor = kind === 'report' && !again;
    if (!spend(toVisitor ? 2 : 1)) return out(false);

    const lines = ['from: ' + email].concat(Object.keys(fields).map(function (k) { return k.replace(/_/g, ' ') + ': ' + fields[k]; }));
    if (link) lines.push('their report: ' + link);
    send(FROM, SUBJECT[kind], lines.join('\n\n'), '', email);

    if (toVisitor) {
      const apps = code.split('-')[4].length / 3;
      send(email, 'Your company map from Pileus Ops', reportText(link, apps), reportHtml(link, apps), FROM);
      cache.put(seen, '1', 600);
    }
    return out(true);
  } catch (err) {
    console.error(err);
    return out(false);
  }
}

function out(ok) { return ContentService.createTextOutput(JSON.stringify({ ok: ok })).setMimeType(ContentService.MimeType.JSON); }

// what a form sent: a short list of named text answers, and nothing else
function clean(f) {
  if (!f || typeof f !== 'object' || Array.isArray(f)) return null;
  const keys = Object.keys(f);
  if (keys.length > 24) return null;
  const o = {}; let total = 0;
  for (let i = 0; i < keys.length; i++) {
    const k = keys[i];
    if (!/^[a-z_]{1,40}$/.test(k)) return null;
    const v = String(f[k] == null ? '' : f[k]).replace(/[\u0000-\u0009\u000B-\u001F\u007F]/g, ' ').slice(0, 6000);
    if (!v) continue;
    total += v.length; o[k] = v;
  }
  return total > 30000 ? null : o;
}

// counts today's emails and refuses past the cap
function spend(n) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const p = PropertiesService.getScriptProperties();
    const day = Utilities.formatDate(new Date(), 'America/Detroit', 'yyyy-MM-dd');
    const used = p.getProperty('day') === day ? Number(p.getProperty('used')) || 0 : 0;
    if (used + n > DAILY_CAP) return false;
    p.setProperties({ day: day, used: String(used + n) });
    return true;
  } finally { lock.releaseLock(); }
}

function send(to, subject, text, html, replyTo) {
  const b64 = function (s) { return Utilities.base64Encode(s, Utilities.Charset.UTF_8).replace(/(.{76})/g, '$1\r\n'); };
  const head = ['From: ' + NAME + ' <' + FROM + '>', 'To: ' + to, 'Reply-To: ' + replyTo, 'Subject: ' + subject, 'MIME-Version: 1.0'];
  let body;
  if (html) {
    const B = 'pileus' + Utilities.getUuid().replace(/-/g, '');
    head.push('Content-Type: multipart/alternative; boundary="' + B + '"');
    body = ['--' + B, 'Content-Type: text/plain; charset=UTF-8', 'Content-Transfer-Encoding: base64', '', b64(text),
      '--' + B, 'Content-Type: text/html; charset=UTF-8', 'Content-Transfer-Encoding: base64', '', b64(html), '--' + B + '--'].join('\r\n');
  } else {
    head.push('Content-Type: text/plain; charset=UTF-8', 'Content-Transfer-Encoding: base64');
    body = b64(text);
  }
  Gmail.Users.Messages.send({ raw: Utilities.base64EncodeWebSafe(head.join('\r\n') + '\r\n\r\n' + body, Utilities.Charset.UTF_8) }, 'me');
}

const INSIDE = [
  'Your apps along the paths work takes through your company',
  'The questions those apps cannot answer today',
  'What that costs you a year, with the assumptions behind the number',
  'The three apps we would build first, how they work as one system, and what each one needs from you'
];

function reportText(link, apps) {
  return ['Your map is ready.', '',
    'Here is the map you built at pileusops.com, as a page you can open any time and share with your team. It covers the ' + apps + ' apps you picked.', '',
    'Open your map: ' + link, '',
    'What is on the page:'].concat(INSIDE.map(function (x) { return '- ' + x; })).concat(['',
    'Want to walk through it? Book 15 minutes at ' + SITE + '/call/ and we will tell you what we would build first.', '',
    'Pileus Ops', 'Operations for the AI era', 'Based in Detroit, MI', FROM, '',
    'You are getting this because you asked for your report at pileusops.com.']).join('\n');
}

function reportHtml(link, apps) {
  const f = "font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif";
  return '<!doctype html><html><body style="margin:0;padding:0;background:#F7F7F4">'
    + '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#F7F7F4"><tr><td align="center" style="padding:32px 16px">'
    + '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;' + f + ';color:#0B1220">'
    + '<tr><td style="padding:0 4px 20px;font-size:20px;letter-spacing:-.02em"><b>pileus</b> <span style="color:#5B6472">ops</span></td></tr>'
    + '<tr><td style="background:#ffffff;border-radius:20px;padding:36px 32px">'
    + '<h1 style="margin:0 0 14px;font-size:28px;line-height:1.15;letter-spacing:-.02em;font-weight:700">Your map is ready.</h1>'
    + '<p style="margin:0 0 24px;font-size:16px;line-height:1.55;color:#3A4250">Here is the map you built at pileusops.com, as a page you can open any time and share with your team. It covers the ' + apps + ' apps you picked.</p>'
    + '<p style="margin:0 0 30px"><a href="' + link + '" style="display:inline-block;background:#0A3BFF;color:#ffffff;text-decoration:none;font-weight:600;font-size:16px;padding:14px 24px;border-radius:12px">Open your map</a></p>'
    + '<p style="margin:0 0 10px;font-size:12px;letter-spacing:.12em;text-transform:uppercase;color:#5B6472">What is on the page</p>'
    + '<table role="presentation" cellpadding="0" cellspacing="0" style="font-size:16px;line-height:1.5;color:#0B1220">'
    + INSIDE.map(function (x) { return '<tr><td valign="top" style="padding:5px 12px 5px 0;color:#0A3BFF">&bull;</td><td style="padding:5px 0">' + x + '</td></tr>'; }).join('')
    + '</table>'
    + '<p style="margin:28px 0 0;padding-top:22px;border-top:1px solid #E4E6E0;font-size:16px;line-height:1.55;color:#3A4250">Want to walk through it? <a href="' + SITE + '/call/" style="color:#0B1220;font-weight:600">Book 15 minutes</a> and we will tell you what we would build first.</p>'
    + '</td></tr>'
    + '<tr><td style="padding:22px 4px 0;font-size:13px;line-height:1.6;color:#5B6472">Pileus Ops &middot; Operations for the AI era &middot; Based in Detroit, MI<br><a href="mailto:' + FROM + '" style="color:#5B6472">' + FROM + '</a><br>You are getting this because you asked for your report at pileusops.com.</td></tr>'
    + '</table></td></tr></table></body></html>';
}

// Run this once from the editor after setting up: it sends a sample report email to the team address.
function test() {
  const link = SITE + '/assessment/';
  send(FROM, 'Test: your company map from Pileus Ops', reportText(link, 12), reportHtml(link, 12), FROM);
}
