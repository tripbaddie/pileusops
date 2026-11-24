// shared vocabulary: the five team colours, their icons, and the little helpers every page uses
const C = { mkt: '#8F2BFF', sales: '#0A3BFF', ops: '#FFC400', fin: '#00B050', cs: '#FF2B2B' };
const TINT = { mkt: '#EBDDFF', sales: '#E1E8FF', ops: '#FFF1BF', fin: '#D3F5E2', cs: '#FFE0E0' };
const GLY = { mkt: '#fff', sales: '#fff', ops: '#0B1220', fin: '#fff', cs: '#fff' };
const TEAMS = ['mkt', 'sales', 'ops', 'fin', 'cs'];
const NAMES = { mkt: 'Marketing', sales: 'Sales', ops: 'Operations', fin: 'Finance', cs: 'Customer success' };
const GLYPH = {
  mkt: '<path d="M4 8.6v2.8a1 1 0 001 1h2l5.5 3.4V4.2L7 7.6H5a1 1 0 00-1 1z"/><path d="M15.4 8.2a2.6 2.6 0 010 3.6"/>',
  sales: '<path d="M3 15l5-5 3.5 3.5L17 7"/><path d="M12.5 7H17v4.5"/>',
  ops: '<rect x="3" y="3" width="6" height="6" rx="1.2"/><rect x="11" y="3" width="6" height="6" rx="1.2"/><rect x="3" y="11" width="6" height="6" rx="1.2"/><path d="M11 14h6M14 11v6"/>',
  fin: '<path d="M4 16V9M10 16V4M16 16v-5"/>',
  cs: '<path d="M4 5.5A1.5 1.5 0 015.5 4h9A1.5 1.5 0 0116 5.5v6a1.5 1.5 0 01-1.5 1.5H9l-4 3v-3.2A1.5 1.5 0 014 11.5z"/>'
};
const $ = id => document.getElementById(id);
const glyph = (g, c) => `<span class="ic"${c ? ` style="background:${c}"` : ''}><svg viewBox="0 0 20 20" fill="none" stroke="${GLY[g]}" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">${GLYPH[g]}</svg></span>`;
