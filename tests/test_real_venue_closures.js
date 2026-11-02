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


// Utrecht shared-address corrections checked against primary operator websites on 2026-11-02.
const danel = db.places.find(p => p.id === 'kitchen-bar-danel-4c5a5ea');
const manners = db.places.find(p => p.id === 'manners-cocktail-lounge-1a48ee6');
const papi = db.places.find(p => p.id === 'papis-comfort-kitchen-bf4bc0e');
const vino = db.places.find(p => p.id === 'wijnbar-vino-ae6ef03');
const winkel = db.places.find(p => p.id === 'winkel-van-sinkel-27c2af5');
const royal = db.places.find(p => p.id === 'beatrix-theater-royal-bar-6a50c76');
const queens = db.places.find(p => p.id === 'restaurant-queens-4d55fcd');
assert.ok([danel, manners, papi, vino, winkel, royal, queens].every(Boolean));
for (const date of ['2026-12-24','2026-12-25','2026-12-26','2026-12-31','2027-01-01']) {
  assert.equal(isClosed(danel, date), true, 'Danel official holiday closure ' + date);
  const closure = danel.date_closures.find(x => x.start === date && x.end === date);
  assert.equal(closure?.source, 'https://danel-utrecht.nl/contact/');
  assert.equal(closure?.checked_on, '2026-11-02');
}
for (const date of ['2026-12-23','2026-12-27','2026-12-30','2027-01-02']) {
  assert.equal(isClosed(danel, date), false, 'Do not invent adjacent Danel closure ' + date);
}
assert.equal(field(danel, 'closing', 'wo', '2026-12-23'), '22:00');
assert.equal(field(danel, 'closing', 'za', '2027-01-02'), '00:00');
assert.equal(manners.address, papi.address, 'Separate speakeasy shares Papi address');
assert.notEqual(manners.id, papi.id);
assert.equal(manners.website, 'https://www.papiscomfortkitchen.com/cocktails');
for (const day of ['ma','di','wo','zo']) {
  assert.equal(manners.closing[day], '—', 'Manners closed weekday ' + day);
}
for (const day of ['do','vr','za']) {
  assert.equal(manners.opening[day], '18:30');
  assert.equal(manners.closing[day], '01:00');
}
assert.equal(vino.address, winkel.address, 'Separate VINO winebar shares Winkel van Sinkel address');
for (const day of ['ma','di']) assert.equal(vino.closing[day], '—');
for (const day of ['wo','do','vr','za','zo']) {
  assert.equal(vino.opening[day], '15:00');
  assert.equal(vino.closing[day], '?', 'Do not invent VINO closing hours from general building schedule');
}
assert.equal(royal.selection, 'Nog te controleren', 'Private Royal Bar is not public walk-in');
assert.notEqual(royal.id, queens.id, 'Royal Bar and Queens remain separate concepts');
console.log('Utrecht Danel holidays, Manners/VINO hours, Royal Bar access and shared-address IDs verified.');


// It Holt announces an eight-day Christmas/New Year shutdown; no adjacent dates inferred.
const itHolt = db.places.find(p => p.id === 'it-holt-deinum-20261102');
const deDames = db.places.find(p => p.id === 'eetcafe-de-dames-balk-20261030');
assert.ok(itHolt && deDames);
for (const date of ['2026-12-25','2026-12-26','2026-12-27','2026-12-28','2026-12-29','2026-12-30','2026-12-31','2027-01-01']) {
  assert.equal(isClosed(itHolt, date), true, 'It Holt official Christmas shutdown '+date);
}
for (const date of ['2026-12-24','2027-01-02']) {
  assert.equal(isClosed(itHolt, date), false, 'Do not extend It Holt shutdown '+date);
}
assert.ok(itHolt.date_closures.some(x => x.start === '2026-12-25' &&
  x.end === '2027-01-01' && x.source === 'https://itholt.nl/' &&
  x.checked_on === '2026-11-02'));
for (const day of ['wo','do','vr','za','zo']) {
  assert.equal(deDames.opening[day], '11:00', 'Operator start hour on 2026-11-02');
}
assert.equal(deDames.selection, 'Nog te controleren', 'Do not infer reopening from expired banner');
console.log('It Holt Christmas closure and De Dames operator start hours verified.');


// Friesland D0: one confirmed weekly café schedule; an older name is not a second venue.
const wap = db.places.find(p => p.id === 'cafe-t-wap-leeuwarden-20261102');
const peer = db.places.find(p => p.id === 'cafe-de-peer-gorredijk-20261102');
assert.ok(wap && peer, 'New Friesland D0 venues retain their stable IDs');
assert.equal(wap.website, 'https://www.cafetwap.nl/');
assert.equal(wap.opening_checked_on, '2026-11-02');
assert.equal(wap.closing_checked_on, '2026-11-02');
for (const [day, opening, closing] of [
  ['ma','14:00','22:00'],['di','13:00','01:00'],['wo','13:00','01:00'],
  ['do','13:00','01:00'],['vr','13:00','01:00'],['za','11:00','01:00'],
  ['zo','13:00','23:00']
]) {
  assert.equal(wap.opening[day], opening, 'Operator opening on '+day);
  assert.equal(wap.closing[day], closing, 'Operator closing on '+day);
}
assert.equal(peer.address, 'Hoofdstraat 70');
assert.equal(peer.selection, 'Voorlopig');
assert.equal(peer.geocode_blocked, true, 'Conflicting 70/71 address cannot be geocoded automatically');
assert.ok(!peer.geo, 'No invented BAG coordinates for Café De Peer');
for (const day of ['ma','di','wo','do','vr','za','zo']) {
  assert.equal(peer.opening[day], '?', 'Do not reuse obsolete Compagnon hours '+day);
  assert.equal(peer.closing[day], '?', 'Do not reuse obsolete Compagnon closing '+day);
}
assert.equal(db.places.filter(p => p.city === 'Gorredijk' &&
  /companon|compagnon/i.test(p.name)).length, 0, 'Old De Compagnon is not a second active café');
console.log('Friesland WAP official week schedule and De Peer predecessor/uncertain hours verified.');


// Ticketed 2026 music events at Spaltenbrêge do not establish regular opening hours.
const spalten = db.places.find(p => p.id === 'cafe-spaltenbrege-terwispel-20261102');
assert.ok(spalten, 'Spaltenbrêge stable venue ID');
assert.equal(spalten.address, 'De Streek 79');
assert.equal(spalten.city, 'Terwispel');
assert.equal(spalten.selection, 'Voorlopig');
assert.equal(spalten.website, '', 'No unverified official site assigned');
for (const day of ['ma','di','wo','do','vr','za','zo']) {
  assert.equal(spalten.opening[day], '?', 'Event start 15:00 is not weekly opening '+day);
  assert.equal(spalten.closing[day], '?', 'Event end 21:00 is not weekly closing '+day);
}
assert.ok(spalten.other_sources.includes('https://www.oudega-swf.nl/agenda/2026/2/15/goldies-50-cafe-123403'));
console.log('Spaltenbrêge 2026 event hours are not reused as ordinary café hours.');


// D0 Drachten/Heerenveen: verified public borrel, but no invented closing hours.
const gusto = db.places.find(p => p.id === 'gusto-y-mucho-mas-heerenveen-20261102');
const bourg = db.places.find(p => p.id === 'het-bourgondische-gevoel-drachten-20261102');
const zusje = db.places.find(p => p.id === 'grootcafe-mn-zusje-drachten-20261102');
assert.ok(gusto && bourg && zusje, 'Three distinct operator-backed new venues');
for (const p of [gusto, bourg, zusje]) {
  assert.equal(p.selection, 'Voorlopig');
  assert.equal(p.checked_on, '2026-11-02');
  assert.ok(p.website.startsWith('https://'));
  assert.ok(!p.geo, 'No invented coordinates before PDOK');
}
for (const day of ['wo','do','vr','za','zo']) {
  assert.equal(gusto.opening[day], '17:00');
  assert.equal(gusto.closing[day], '?', 'Conflicting 22:00/01:00 cannot be an exact close');
}
for (const day of ['di','wo','do','vr','za']) {
  assert.equal(bourg.opening[day], '09:30');
  assert.equal(bourg.closing[day], '18:00');
}
assert.equal(bourg.opening.zo, '?', 'Koopzondag is not every Sunday');
assert.equal(bourg.closing.zo, '?');
for (const date of ['2026-12-31','2027-01-01']) {
  assert.equal(isClosed(bourg, date), true, 'Operator holiday closure '+date);
}
for (const date of ['2026-12-30','2027-01-02']) {
  assert.equal(isClosed(bourg, date), false, 'No extrapolated holiday closure '+date);
}
for (const day of ['ma','di','wo','do','vr','za','zo']) {
  assert.equal(zusje.opening[day], '?', 'Old Wix and third-party hours conflict '+day);
  assert.equal(zusje.closing[day], '?', 'No current official end time '+day);
}
assert.equal(db.places.filter(p => p.region === 'friesland' &&
  ['Vleesmarkt 9','Zuiderbuurt 37','Oosterstraat 20A'].includes(p.address)).length, 3,
  'Each address is a separate venue without a duplicate');
console.log('Gusto, Bourgondische Gevoel and M\'n Zusje: evidence limits and holidays verified.');

const sahara = db.places.find(p => p.id === 'sahara-food-vibes-drachten-20261102');
assert.ok(sahara, 'Sahara Drachten candidate is tracked');
assert.equal(sahara.selection, 'Nog te controleren', 'Sale listing does not prove live bar operation');
assert.equal(sahara.geocode_blocked, true, 'Conflicting business addresses block automatic marker');
assert.ok(!sahara.geo);
assert.equal(sahara.website, '', 'Metalworking shop is not the bar website');
for (const day of ['ma','di','wo','do','vr','za','zo']) {
  assert.equal(sahara.opening[day], '?', 'Broker listing is not a weekly opening schedule '+day);
  assert.equal(sahara.closing[day], '?', 'Nightlife licence is not a closing hour '+day);
}
console.log('Sahara Drachten kept hidden pending actual public-opening verification.');
