// Verify the real frontend eligibility function uses dated closures.
// Synthetic Node context only; not a browser/touch interaction test.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const NGNBDateClosures = require('../scripts/date_closures.js');

const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
const inline = html.match(/<script>\s*([\s\S]*?)<\/script>/);
assert.ok(inline, 'inline application script exists');
new vm.Script(inline[1], { filename: 'index-inline.js' });
const start = inline[1].indexOf('function eligible(p){');
const end = inline[1].indexOf('function sortPlaces(', start);
assert.ok(start >= 0 && end > start, 'eligibility function found');
const source = inline[1].slice(start, end);
const state = { region:'friesland', category:'', q:'', after:'', uncertain:false, day:'zo', date:'2026-11-01' };
const closing = p => NGNBDateClosures.field(p, 'closing', state.day, state.date);
const eligible = vm.runInNewContext(source + '; eligible', { state, NGNBDateClosures, closing });
const kaap = { id:'kaap', region:'friesland', selection:'Voorlopig', name:'Kaap Hoorn',
  date_closures:[{ start:'2026-11-01', end:'2026-11-01' }] };
assert.equal(eligible(kaap), false, 'Berenloop closure must exclude Kaap Hoorn on Nov 1');
state.date = '2026-11-02';
assert.equal(eligible(kaap), true, 'a one-day closure must not extend to Nov 2');
state.date = '';
assert.equal(eligible(kaap), true, 'weekday-only view remains unfiltered by dated exceptions');
state.date = '2026-11-01';
assert.equal(eligible({ ...kaap, selection:'Nee', date_closures:[] }), false,
  'duplicate aliases remain excluded even if uncertain toggle is off');
const berkenplas = {id:'berkenplas',region:'friesland',selection:'Voorlopig',
  name:'De Berkenplas',requires_date_schedule:true,
  date_schedules:[{start:'2026-11-01',end:'2027-03-31',
    opening:{ma:'—',vr:'10:30'},closing:{ma:'—',vr:'17:30'}}]};
state.date = '';
assert.equal(eligible(berkenplas), false, 'seasonal venue hidden without an exact date');
state.date = '2026-11-20';
state.day = 'vr';
assert.equal(eligible(berkenplas), true, 'seasonal venue allowed in verified winter range');
state.date = '2026-11-02';
state.day = 'ma';
assert.equal(eligible(berkenplas), false, 'closed Monday excluded even without arrival time');
state.date = '2027-04-01';
assert.equal(eligible(berkenplas), false, 'seasonal venue hidden outside verified range');
assert.ok(html.includes('id="visitDate"'), 'the date selector is exposed');
assert.ok(html.includes("p.set('datum',state.date)"), 'date deep links are retained');
// Source-verified winter schedules: exercise the actual master, not just fixtures.
const master = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data', 'venues.json'), 'utf8'));
const byId = id => {
  const place = master.places.find(p => p.id === id);
  assert.ok(place, 'missing venue: ' + id);
  return place;
};
const datedCases = [
  ['discotheek-de-lichtboei-nes-20261101', '2026-11-06', 'vr', true],
  ['discotheek-de-lichtboei-nes-20261101', '2026-11-05', 'do', false],
  ['discotheek-de-lichtboei-nes-20261101', '2026-12-04', 'vr', false],
  ['brasserie-brandaris-west-terschelling-20261101', '2026-11-06', 'vr', true],
  ['brasserie-brandaris-west-terschelling-20261101', '2027-01-10', 'zo', false],
  ['brasserie-brandaris-west-terschelling-20261101', '2027-02-16', 'di', false],
  ['la-boya-west-terschelling-20261101', '2026-11-01', 'zo', true],
  ['la-boya-west-terschelling-20261101', '2026-11-03', 'di', false],
  ['la-boya-west-terschelling-20261101', '2026-11-13', 'vr', true],
  ['la-boya-west-terschelling-20261101', '2026-12-04', 'vr', false],
  ['beachclub-noderstraun-schiermonnikoog-20261030', '2026-11-02', 'ma', true],
  ['beachclub-noderstraun-schiermonnikoog-20261030', '2026-11-03', 'di', false],
  ['beachclub-noderstraun-schiermonnikoog-20261030', '2026-12-19', 'za', false]
];
for (const [id, date, day, expected] of datedCases) {
  state.date = date;
  state.day = day;
  assert.equal(eligible(byId(id)), expected, id + ' @ ' + date);
}
state.date = '';
state.day = 'vr';
for (const id of [...new Set(datedCases.map(row => row[0]))]) {
  assert.equal(eligible(byId(id)), false, id + ' must not claim year-round opening');
}
assert.equal(NGNBDateClosures.field(byId('la-boya-west-terschelling-20261101'),
  'closing', 'vr', '2026-11-13'), '?', 'VVV end time is not an official closing time');
assert.equal(NGNBDateClosures.field(byId('beachclub-noderstraun-schiermonnikoog-20261030'),
  'closing', 'vr', '2026-11-06'), '?', 'kitchen closing is not bar closing');

// Exercise the actual timed eligibility branch with helpers extracted from the
// same inline frontend. This checks nightlife-day rollover at midnight.
function inlineRange(begin, end) {
  const from = inline[1].indexOf(begin);
  const to = inline[1].indexOf(end, from + begin.length);
  assert.ok(from >= 0 && to > from, begin + ' must exist before ' + end);
  return inline[1].slice(from, to);
}
const timedFunctions = [
  inlineRange('function timeVal(', 'function category('),
  inlineRange('function closingWindow(', 'function displayClosing('),
  inlineRange('function effectiveAdmission(', 'function entryBeforeClosing('),
  inlineRange('function openAtSelectedTime(', 'function eligible('),
  source
].join('\\n');
const timedEligible = vm.runInNewContext(timedFunctions + '; eligible', {
  state, NGNBDateClosures, db: master, closing
});
state.date = '2026-11-06';
state.day = 'vr';
state.sameDayMorning = false;
state.after = '23:30';
assert.equal(timedEligible(byId('discotheek-de-lichtboei-nes-20261101')), true,
  'Friday nightclub must accept 23:30 before 04:00');
state.after = '01:30';
assert.equal(timedEligible(byId('discotheek-de-lichtboei-nes-20261101')), true,
  'Friday nightlife date extends through Saturday 01:30');
state.after = '04:00';
assert.equal(timedEligible(byId('discotheek-de-lichtboei-nes-20261101')), false,
  '04:00 is closing, not an entry time');
state.after = '21:30';
assert.equal(timedEligible(byId('discotheek-de-lichtboei-nes-20261101')), false,
  '21:30 precedes nightclub opening');
state.after = '20:30';
assert.equal(timedEligible(byId('brasserie-brandaris-west-terschelling-20261101')), true,
  '20:30 is before the verified 22:00 closing');
state.after = '22:00';
assert.equal(timedEligible(byId('brasserie-brandaris-west-terschelling-20261101')), false,
  '22:00 is not a valid arrival at a 22:00 closing');
state.after = '20:30';
assert.equal(timedEligible(byId('la-boya-west-terschelling-20261101')), false,
  'unknown bar closing must not be advertised as time-verified');
state.after = '';

console.log('Frontend dated-closure integration tests passed');
