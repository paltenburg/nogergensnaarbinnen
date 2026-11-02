// Dataset-level regression: a private event closes the public eetcafé,
// even when the adjacent snackbar still serves food. No network needed.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const {isClosed, weekday, field, scheduleFor} = require('../scripts/date_closures.js');
const db = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data', 'venues.json'), 'utf8'));
const venue = db.places.find(p => p.id === 'eetcafe-de-buorren-uitwellingerga-20261030');
assert.ok(venue, 'Eetcafé de Buorren retains its stable venue ID');
const documented = ['2026-10-31', '2026-11-01', '2026-11-06', '2026-11-20', '2026-12-12'];
for (const date of documented) {
  assert.equal(isClosed(venue, date), true, 'Private-event closure must exclude '+date);
  const item = venue.date_closures.find(x => x.start === date && x.end === date);
  assert.ok(item?.source?.startsWith('https://eetcafedebuorren.nl/'), 'Primary source for '+date);
  assert.equal(item.checked_on, '2026-11-01');
}
for (const date of ['2026-10-30', '2026-11-02', '2026-11-07', '2026-11-21', '2026-12-13']) {
  assert.equal(isClosed(venue, date), false, 'No invented date closure for '+date);
}
assert.equal(weekday('2026-11-01'), 'zo');
assert.equal(venue.closing.zo, '22:00', 'Dated exception must not erase ordinary schedule');
console.log('Five sourced public-access closures and five non-closure boundaries verified.');


// Real 2026 holiday exception: special opening is announced, but its hours are unknown.
const skeve = db.places.find(p => p.id === 'de-skeve-toren-leeuwarden-20261102');
assert.ok(skeve, 'Skeve Toren stable venue ID');
for (const date of ['2026-12-25', '2026-12-26', '2026-12-31', '2027-01-01']) {
  assert.equal(isClosed(skeve, date), true, 'Official holiday closure ' + date);
  const item = skeve.date_closures.find(x => x.start === date && x.end === date);
  assert.equal(item?.source, 'https://deskevetoren.nl/contact/');
  assert.equal(item?.checked_on, '2026-11-02');
}
for (const date of ['2026-12-24', '2026-12-27', '2026-12-28', '2026-12-29', '2026-12-30', '2027-01-02']) {
  assert.equal(isClosed(skeve, date), false, 'No invented holiday closure ' + date);
}
for (const [date, day] of [['2026-12-28', 'ma'], ['2026-12-29', 'di']]) {
  assert.equal(weekday(date), day);
  assert.ok(scheduleFor(skeve, date), 'Announced special opening must override closed weekday');
  assert.equal(field(skeve, 'opening', day, date), '?', 'Do not invent holiday opening time');
  assert.equal(field(skeve, 'closing', day, date), '?', 'Do not inherit regular closed status');
}
assert.equal(field(skeve, 'closing', 'wo', '2026-12-30'), '22:00',
  'Ordinary Wednesday closing remains outside the holiday exception');
console.log('Four official Skeve Toren holiday closures and two unknown-hour openings verified.');


// WestCord hotel has separate public bars sharing a BAG complex address.
const praethuys = db.places.find(p => p.id === 'eetcafe-t-praethuys-vlieland-20261030');
const zeevaert = db.places.find(p => p.id === 'zeevaert-bar-rotisserie-vlieland-a8283d7');
assert.ok(praethuys && zeevaert && praethuys.id !== zeevaert.id);
assert.equal(praethuys.address, zeevaert.address, 'Two concepts share WestCord hotel address');
for (const [date, day, expected] of [
  ['2026-10-01', 'do', '21:00'], ['2026-11-06', 'vr', '22:00'],
  ['2027-01-03', 'zo', '21:00'], ['2027-04-30', 'vr', '22:00']
]) {
  assert.equal(field(praethuys, 'closing', day, date), expected,
    'Official 2026-27 low-season closing for ' + date);
  assert.equal(field(praethuys, 'opening', day, date), '10:00');
}
assert.equal(field(praethuys, 'closing', 'wo', '2026-09-30'), '?');
assert.equal(field(praethuys, 'closing', 'za', '2027-05-01'), '?',
  'Expired winter schedule must not imply summer 2027 closing');
assert.equal(field(praethuys, 'last_entry', 'vr', '2026-11-06'), '?',
  'Seasonal bar hours do not prove last entry');
console.log('WestCord Vlieland distinct venues and winter date boundaries verified.');
