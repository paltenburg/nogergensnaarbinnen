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
console.log('Frontend dated-closure integration tests passed');
