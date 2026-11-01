const assert = require('node:assert/strict');
const { parseDate, weekday, isClosed, scheduleFor, field } = require('../scripts/date_closures.js');

assert.equal(weekday('2026-11-01'), 'zo');
assert.equal(weekday('2026-11-02'), 'ma');
assert.equal(weekday('2027-01-10'), 'zo');
assert.equal(weekday('2027-02-16'), 'di');
assert.equal(parseDate('2026-02-29'), null);
assert.equal(parseDate('2026-11-1'), null);
assert.equal(parseDate('2026-13-01'), null);
assert.equal(parseDate('not-a-date'), null);
const venue = { date_closures: [
  { start: '2026-11-02', end: '2026-11-12' },
  { start: '2027-01-10', end: '2027-02-15' }
] };
for (const day of ['2026-11-02', '2026-11-12', '2027-01-10', '2027-02-15']) {
  assert.equal(isClosed(venue, day), true, day);
}
for (const day of ['2026-11-01', '2026-11-13', '2027-01-09', '2027-02-16']) {
  assert.equal(isClosed(venue, day), false, day);
}
assert.equal(isClosed(venue, ''), false);
assert.equal(isClosed({}, '2026-11-03'), false);
assert.equal(isClosed({ date_closures: [{ start: '2026-11-12', end: '2026-11-02' }] }, '2026-11-05'), false);
const seasonal = { opening:{ vr:'?' }, closing:{ vr:'?' }, date_schedules:[
  {start:'2026-11-01',end:'2027-03-31',
   opening:{vr:'10:30',za:'10:30',zo:'10:30'},
   closing:{vr:'17:30',za:'17:30',zo:'17:30'}}
] };
assert.equal(scheduleFor(seasonal, '2026-10-31'), null);
assert.equal(field(seasonal, 'closing', 'vr', '2026-11-01'), '17:30');
assert.equal(field(seasonal, 'closing', 'vr', '2027-03-31'), '17:30');
assert.equal(field(seasonal, 'closing', 'vr', '2027-04-01'), '?');
assert.equal(scheduleFor(seasonal, '2027-04-01'), null);
const overlapping = { date_schedules:[
  {start:'2026-11-01',end:'2026-11-30'},
  {start:'2026-11-15',end:'2026-12-15'}
] };
assert.equal(scheduleFor(overlapping, '2026-11-20'), null,
  'ambiguous overlapping seasonal schedules must not be chosen');
console.log('Date closure boundary tests passed');
