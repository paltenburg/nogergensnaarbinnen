// Dataset-level regression: a private event closes the public eetcafé,
// even when the adjacent snackbar still serves food. No network needed.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const {isClosed, weekday} = require('../scripts/date_closures.js');
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
