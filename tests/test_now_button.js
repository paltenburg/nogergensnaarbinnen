// Synthetic regression of the real "Nu" handler; not a mobile browser test.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const NGNBDateClosures = require('../scripts/date_closures.js');

const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
const inline = html.match(/<script>\s*([\s\S]*?)<\/script>/);
assert.ok(inline, 'application inline script exists');
const start = inline[1].indexOf('function useCurrentDutchTime(){');
const end = inline[1].indexOf('function mapContentPadding(){', start);
assert.ok(start >= 0 && end > start, 'Nu handler boundaries exist');
const handler = inline[1].slice(start, end);
new vm.Script(handler + '; useCurrentDutchTime');

function check(instant, expectedDate, expectedDay, expectedTime, expectedMorning) {
  const state = {date:'', day:'', after:'', sameDayMorning:false};
  const elements = {visitDate:{value:''},day:{value:''}};
  const calls = [];
  const FixedDate = class extends Date {
    constructor(...args) { super(...(args.length ? args : [instant])); }
  };
  const context = {
    Date: FixedDate, Intl, NGNBDateClosures, state,
    days:['ma','di','wo','do','vr','za','zo'],
    el: id => elements[id],
    fillArrivalOptions: () => calls.push('fill'),
    selectArrival: (time, label) => {
      state.after = time;
      calls.push('select:' + label);
    },
    change: () => calls.push('change')
  };
  vm.runInNewContext(handler + '; useCurrentDutchTime()', context);
  assert.equal(state.date, expectedDate, instant + ' nightlife date');
  assert.equal(state.day, expectedDay, instant + ' weekday');
  assert.equal(elements.visitDate.value, expectedDate, instant + ' visible date');
  assert.equal(elements.day.value, expectedDay, instant + ' visible weekday');
  assert.equal(state.after, expectedTime, instant + ' exact arrival time');
  assert.equal(state.sameDayMorning, expectedMorning, instant + ' morning mode');
  assert.equal(calls.length, 3, instant + ' refresh callbacks');
}

// All instants UTC; the handler must use Europe/Amsterdam, not browser locale.
check('2026-11-01T04:59:00Z', '2026-10-31', 'za', '05:59', false);
check('2026-11-01T05:00:00Z', '2026-11-01', 'zo', '06:00', true);
check('2026-11-02T00:30:00Z', '2026-11-01', 'zo', '01:30', false);
check('2026-11-02T06:00:00Z', '2026-11-02', 'ma', '07:00', true);
// Dutch daylight-saving transition: clocks go back on 25 October 2026.
check('2026-10-25T00:30:00Z', '2026-10-24', 'za', '02:30', false);
check('2026-10-25T01:30:00Z', '2026-10-24', 'za', '02:30', false);
check('2026-10-25T05:00:00Z', '2026-10-25', 'zo', '06:00', true);

console.log('Nu handler: 7 instants, 49 synthetic assertions passed.');
