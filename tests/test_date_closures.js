const assert = require('node:assert/strict');
const { parseDate, weekday, isClosed, scheduleFor, hasScheduleConflict, field } = require('../scripts/date_closures.js');

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
assert.equal(hasScheduleConflict(overlapping, '2026-11-20'), true);
assert.equal(hasScheduleConflict(overlapping, '2026-11-05'), false);
assert.equal(hasScheduleConflict(overlapping, '2026-12-16'), false);
overlapping.closing = { vr: '03:00' };
assert.equal(field(overlapping, 'closing', 'vr', '2026-11-20'), '?',
  'conflicting dated schedules must not inherit ordinary closing 03:00');
assert.equal(field(overlapping, 'closing', 'vr', '2026-12-16'), '03:00',
  'outside conflicting intervals the base timetable remains available');
// A verified dated timetable must be authoritative, including absent fields.
const partialSeason = {
  opening:{vr:'18:00',za:'18:00'},
  closing:{vr:'03:00',za:'03:00'},
  last_entry:{vr:'02:00'},
  date_schedules:[{
    start:'2026-11-01',end:'2026-11-30',
    opening:{vr:'22:00'},closing:{vr:'04:00'}
  }]
};
assert.equal(field(partialSeason,'opening','vr','2026-11-06'),'22:00');
assert.equal(field(partialSeason,'closing','vr','2026-11-06'),'04:00');
assert.equal(field(partialSeason,'opening','za','2026-11-07'),'?',
  'missing dated opening must not inherit 18:00');
assert.equal(field(partialSeason,'closing','za','2026-11-07'),'?',
  'missing dated closing must not inherit 03:00');
assert.equal(field(partialSeason,'last_entry','vr','2026-11-06'),'?',
  'old entry cutoff cannot be silently carried into a special event');
assert.equal(field(partialSeason,'closing','vr','2026-12-04'),'03:00',
  'outside the dated interval the base timetable is unchanged');

// Regression against real master records: announced reopenings are not proof of opening.
const fs = require('node:fs');
const path = require('node:path');
const master = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/venues.json'), 'utf8'));
const byId = id => {
  const found = master.places.find(place => place.id === id);
  assert.ok(found, 'missing master venue ' + id);
  return found;
};
const kade = byId('grand-cafe-kade-stavoren-1996c93');
for (const date of ['2026-11-01', '2026-11-15', '2026-11-30']) {
  assert.equal(isClosed(kade, date), true, 'Kade November closure ' + date);
}
assert.equal(isClosed(kade, '2026-12-01'), false,
  'Kade December must not be falsely marked closed (reopening still unverified)');
const brink = byId('brasserie-de-brink-oudemirdum-20261031');
assert.equal(isClosed(brink, '2026-11-01'), true);
assert.equal(isClosed(brink, '2026-11-05'), true);
assert.equal(isClosed(brink, '2026-11-06'), false,
  'Brink announced reopening date is not an established open status');
assert.equal(brink.selection, 'Nog te controleren',
  'announced reopening cannot make an unverified venue visible');

console.log('Date closure boundary tests passed');


// Friesland D0: a seasonal brasserie must not leak winter hours into summer.
// A tasting room's shop hours must never be substituted for bar opening.
const stadstuin = byId('brasserie-de-stadstuin-franeker-20261102');
const usHeit = byId('proeflokaal-us-heit-bolsward-20261102');
const poort = byId('hotel-restaurant-poort-van-franeker-20261102');
assert.equal(stadstuin.requires_date_schedule, true);
assert.ok(scheduleFor(stadstuin, '2026-11-02'));
assert.equal(field(stadstuin, 'opening', 'ma', '2026-11-02'), '—');
assert.equal(field(stadstuin, 'opening', 'di', '2026-11-03'), '10:00');
assert.equal(field(stadstuin, 'closing', 'zo', '2027-03-28'), '17:00');
assert.ok(scheduleFor(stadstuin, '2027-03-31'));
assert.equal(scheduleFor(stadstuin, '2027-04-01'), null,
  'Stadstuin spring hours are not verified as a dated schedule');
assert.equal(usHeit.opening.za, '14:30');
assert.equal(usHeit.closing.za, '18:00');
for (const day of ['ma','di','wo','do','vr','zo']) {
  assert.equal(usHeit.opening[day], '?',
    'Brewery shop hours must not be treated as tasting-room hours');
  assert.equal(usHeit.closing[day], '?');
}
assert.equal(poort.selection, 'Nog te controleren',
  'Poort Franeker remains hidden without evidence of alcohol service');
assert.equal(poort.opening.ma, '?',
  'Missing Monday operator hours do not establish a closure');
console.log('Franeker winter schedule, Bolsward tasting-room hours and alcohol gating verified.');
