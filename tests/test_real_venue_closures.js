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
  assert.equal(deDames.opening[day], '12:00', 'Operator website 2026-11-02: 12:00 start, not obsolete 11:00');
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
  // The master may gain an exact PDOK marker in a later maintenance run.
  // Never require a permanently missing marker or accept a guessed one.
  if(p.geo) {
    assert.equal(p.geo.method, 'PDOK BAG-adres');
    assert.ok(Number.isFinite(p.geo.lat) && Number.isFinite(p.geo.lon));
  }
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


// Sneek discovery: keep restaurant-only and outdated alcohol evidence hidden.
// October-May season hours cannot be applied to summer Sundays or guessed closing.
const brulee = db.places.find(p => p.id === 'bistro-brulee-sneek-20261102');
const provence = db.places.find(p => p.id === 'le-provence-sneek-20261102');
assert.ok(brulee && provence, 'Two distinct Sneek candidate venues are tracked');
assert.equal(brulee.selection, 'Nog te controleren', 'No proven standalone wine-bar entry');
assert.equal(provence.selection, 'Nog te controleren', '2022 alcohol menu does not prove 2026 standalone bar entry');
assert.equal(brulee.address, 'Muntstraat 2');
assert.equal(provence.address, 'Schaapmarktplein 1');
for (const day of ['wo','do','vr','za']) {
  assert.equal(brulee.opening[day], '17:30', 'Official winter bistro start ' + day);
}
for (const day of ['ma','di','zo']) {
  assert.equal(brulee.opening[day], '?', 'Unlisted winter day is not necessarily permanently closed ' + day);
}
for (const day of ['ma','di','wo','do','vr','za','zo']) {
  assert.equal(brulee.closing[day], '?', 'Guide closing must not replace unknown operator end ' + day);
  assert.equal(provence.opening[day], '10:00', 'Operator-published lunchcafe start ' + day);
  assert.equal(provence.closing[day], '18:00', 'Operator-published lunchcafe end ' + day);
}
assert.equal(brulee.website, 'https://bistrobrulee.nl/');
assert.equal(provence.website, 'https://www.leprovence.nl/');
console.log('Sneek seasonal bistro and historic alcohol menu uncertainty verified.');


// Friesland D0 02-11-2026: operator-confirmed drinks and hours, without
// converting unrelated one-off events or takeaway times into weekly closures.
const barista = db.places.find(p => p.id === 'barista-cafe-drachten-20261102');
const odl = db.places.find(p => p.id === 'cafe-odl-luinjeberd-20261102');
const marktSneek = db.places.find(p => p.id === 'markt23-sneek-20261031');
const marktDrachten = db.places.find(p => p.id === 'markt23-drachten-20261031');
assert.ok([barista, odl, marktSneek, marktDrachten].every(Boolean));
assert.notEqual(barista.id, odl.id);
assert.equal(barista.website, 'https://www.baristacafe.nl/vestiging/drachten/');
assert.ok(barista.other_sources.includes('https://www.cavesco.nl/docs/baristacafe/menukaart_drachten.pdf'));
for (const [day, open, close] of [
  ['ma','12:00','18:00'], ['di','09:30','18:00'], ['wo','09:30','18:00'],
  ['do','09:30','18:00'], ['vr','09:30','18:00'], ['za','09:00','18:00'],
  ['zo','12:00','17:00']
]) {
  assert.equal(barista.opening[day], open, 'Barista operator opening '+day);
  assert.equal(barista.closing[day], close, 'Barista operator closing '+day);
}
assert.equal(odl.website, 'https://cafeodl.nl/');
assert.equal(odl.address, 'Aengwirderweg 149');
for (const day of ['wo','do','vr','za','zo']) {
  assert.equal(odl.opening[day], '16:00', 'ODL pub starts at 16:00 '+day);
}
for (const day of ['ma','di']) {
  assert.equal(odl.opening[day], '?', 'ODL unlisted weekday is not confirmed closed '+day);
}
for (const day of ['ma','di','wo','do','vr','za','zo']) {
  assert.equal(odl.closing[day], '?', 'Takeaway 20:00 is not a pub closing '+day);
  assert.equal(marktSneek.closing[day], '?', 'Club Tropicana end 01:00 is not weekly closing '+day);
  assert.equal(marktDrachten.closing[day], '?', 'Pubquiz start 20:00 is not weekly closing '+day);
}
assert.equal(db.places.filter(p => p.region === 'friesland' &&
  p.city === 'Luinjeberd' && p.address === 'Aengwirderweg 149').length, 1,
  'Historic Onder de Linden and current ODL must not be duplicated');
for (const p of [barista, odl]) {
  assert.equal(p.checked_on, '2026-11-02');
  if (p.geo) {
    assert.equal(p.geo.method, 'PDOK BAG-adres');
    assert.ok(Number.isFinite(p.geo.lat) && Number.isFinite(p.geo.lon));
  }
}
console.log('Barista Drachten and ODL Luinjeberd official hours, aliases and event limits verified.');


// 02-11-2026 operator corrections: minimum open-until is not a closing time.
const utherne = db.places.find(p => p.id === 'eetcafe-de-utherne-ijlst-20261030');
const witteHuis = db.places.find(p => p.id === 'hotel-restaurant-het-witte-huis-olterterp-20261102');
const cheung = db.places.find(p => p.id === 'cheung-kwong-franeker-20261102');
assert.ok(utherne && witteHuis && cheung);
for (const day of ['ma','di','wo','do','vr','zo']) {
  assert.equal(utherne.opening[day], '11:00', 'Current operator HTML starts at 11:00, not obsolete 10:00: ' + day);
}
assert.equal(utherne.opening.za, '08:30');
for (const day of ['ma','di','wo','do','vr','za','zo']) {
  assert.equal(utherne.closing[day], '?', 'At-least-open-until is not an exact closing time: ' + day);
  assert.equal(witteHuis.opening[day], '10:00');
  assert.equal(witteHuis.closing[day], '22:00');
}
assert.equal(witteHuis.opening_checked_on, '2026-11-02');
assert.equal(witteHuis.closing_source, 'https://wittehuisolterterp.nl/');
assert.equal(cheung.selection, 'Nog te controleren', 'Takeaway beer/wine does not prove public lounge alcohol entry');
assert.equal(cheung.opening.ma, '—');
assert.equal(cheung.closing.ma, '—');
for (const day of ['di','wo','do','vr','za','zo']) {
  assert.equal(cheung.opening[day], '16:30', 'Main operator site restaurant start, not 16:00 takeaway hours');
  assert.equal(cheung.closing[day], '?', 'Kitchen closing 22:00 is not restaurant closing');
}
assert.equal(cheung.opening_source, 'https://cheungkwong.nl/');
console.log('IJlst corrected starts and minimum hours; Olterterp and Franeker restaurant-versus-takeaway limits verified.');


// 02-11-2026: current Neushoorn Café public inloop and 2026 alcohol evidence.
// An expired partner deal supports beer/wine service in 2026, not a guaranteed current menu.
const neus = db.places.find(p => p.id === 'neushoorn-cafe-leeuwarden-20261102');
assert.ok(neus, 'Neushoorn Café retains its stable venue ID');
assert.equal(neus.selection, 'Voorlopig', '2026 partner beer/wine evidence plus ongoing operator drinks concept supports provisional listing');
assert.ok(neus.alcohol.includes('13-06-2026'), 'Expired partner offer must be date-qualified');
assert.ok(neus.alcohol.includes('huidige'), 'Do not imply a live verified drinks menu');
for (const day of ['do', 'vr']) {
  assert.equal(neus.opening[day], '17:00');
  assert.equal(neus.closing[day], '00:00');
}
assert.equal(neus.opening.za, '17:00');
assert.equal(neus.closing.za, '22:00', 'Saturday 22:00 is the public cafe-to-ticketed-club transition, not guaranteed venue closure');
for (const day of ['ma','di','wo','zo']) {
  assert.equal(neus.opening[day], '—');
  assert.equal(neus.closing[day], '—');
}
assert.ok(neus.closing_notes.includes('Bunker Bar'), 'Same-address Bunker Bar is not duplicated as Neushoorn Café');
console.log('Neushoorn Cafe verified public drinking, provisional alcohol evidence and club transition tested.');


// Newly discovered Grand Café Kreas is not yet a verified walk-in bar:
// supplier opening announcement and guest beer check-ins do not prove weekly
// public admission, closing times or last entry.
const kreas = db.places.find(p => p.id === 'grand-cafe-kreas-drachten-20261102');
const pietje = db.places.find(p => p.id === 'cafe-pietje-bel-drachten-5eb1428');
assert.ok(kreas && pietje, 'Both Drachten venue IDs remain stable');
assert.equal(kreas.address, 'Noordkade 3');
assert.equal(kreas.website, 'https://grandcafekreas.nl/');
assert.equal(kreas.selection, 'Nog te controleren');
assert.equal(kreas.checked_on, '2026-11-02');
assert.ok(kreas.other_sources.includes('https://www.thusdrachten.nl/grand-cafe-kreas/'));
assert.equal(db.places.filter(p => p.city === 'Drachten' && p.address === 'Noordkade 3').length, 1,
  'Kreas / Thús successor is one venue, not duplicate concepts');
for (const day of ['ma','di','wo','do','vr','za','zo']) {
  assert.equal(kreas.opening[day], '?', 'No third-party planned hours accepted for Kreas '+day);
  assert.equal(kreas.closing[day], '?', 'No third-party planned closing accepted for Kreas '+day);
  assert.equal(pietje.closing[day], '?', 'Inactive historic registration is not a verified timetable '+day);
}
assert.equal(pietje.selection, 'Nog te controleren',
  'Inactive KvK records do not prove a closure or current reopening');
assert.ok(pietje.other_sources.some(u => u.includes('/cafe-pietje-bel')),
  'Inactive registration is sourced');
assert.equal(db.places.filter(p => p.city === 'Drachten' && p.address === 'Zuidkade 18').length, 1,
  'Historic Koperen Bel name must not create a second active venue');
console.log('Kreas new opening and Pietje Bel inactive registration safely unverified.');


// A 2026 public festival bar confirms Tigh Barra's bar function, but
// conflicting commercial directories do not establish a weekly timetable.
const tighBarra = db.places.find(p => p.id === 'tigh-barra-joure-20261031');
assert.ok(tighBarra);
assert.equal(tighBarra.selection, 'Voorlopig');
assert.equal(tighBarra.website, '', 'Unreadable/uncorroborated domain is not an official site');
assert.ok(tighBarra.other_sources.includes(
  'https://rtvspannenburg.nl/2026/04/27/koningsdag-in-de-fryske-marren-markten-muziek-en-feesten/'));
for (const day of ['ma','di','wo','do','vr','za','zo']) {
  assert.equal(tighBarra.opening[day], '?', 'Conflicting Cylex/Guru opening is not official '+day);
  assert.equal(tighBarra.closing[day], '?', 'Conflicting Cylex/Guru closing is not official '+day);
}
console.log('Tigh Barra 2026 bar evidence without fabricated weekly hours verified.');


// TOON is a daytime coffee/vinyl venue with isolated alcohol events.
// Article 35 exemptions and a July VrijMiBo do not prove regular bar hours.
const toon = db.places.find(p => p.id === 'toon-luisterbar-leeuwarden-20261102');
assert.ok(toon);
assert.equal(toon.address, 'Kleine Kerkstraat 11');
assert.equal(toon.selection, 'Nog te controleren');
assert.equal(toon.website, 'https://deepgrooves.eu/toon-luisterbar-leeuwarden/');
assert.ok(toon.other_sources.includes('https://zoek.officielebekendmakingen.nl/gmb-2026-140356.html'));
for (const day of ['ma','di','wo','do','vr','za','zo']) {
  assert.equal(toon.opening[day], '?', 'Coffee opening does not prove daily bar admission '+day);
  assert.equal(toon.closing[day], '?', 'July one-off event does not prove bar closing '+day);
}
assert.equal(db.places.filter(p => p.city === 'Leeuwarden' &&
  p.address === 'Kleine Kerkstraat 11').length, 1);
console.log('TOON special-event alcohol and ordinary coffee hours kept distinct.');


// 03-11-2026: Westersail's own site confirms a winter shutdown.
// An April 2027 return announcement is NOT an exact reopening date.
// Third-party all-week hours must not make it appear open this November.
const westersail = db.places.find(p => p.id === 'brasserie-westersail-earnewald-20261103');
assert.ok(westersail, 'Westersail has a stable separate venue record');
assert.equal(westersail.address, 'Wiidswei 1A');
assert.equal(westersail.website, 'https://westersail.nl/');
assert.equal(westersail.selection, 'Nog te controleren');
assert.equal(westersail.date_closures.length, 1);
assert.equal(westersail.date_closures[0].start, '2026-09-28');
assert.equal(westersail.date_closures[0].end, '2027-03-31');
assert.equal(westersail.date_closures[0].checked_on, '2026-11-03');
for (const date of ['2026-09-28','2026-11-03','2026-12-25','2027-03-31']) {
  assert.equal(isClosed(westersail,date),true,'Official winter shutdown covers '+date);
}
for (const date of ['2026-09-27','2027-04-01']) {
  assert.equal(isClosed(westersail,date),false,
    'Do not infer a closure beyond the explicitly established interval '+date);
}
for (const day of ['ma','di','wo','do','vr','za','zo']) {
  assert.equal(westersail.opening[day], '?', 'No guessed post-winter opening '+day);
  assert.equal(westersail.closing[day], '?', 'No copied directory hours '+day);
}
assert.equal(db.places.filter(p => p.region === 'friesland' &&
  p.city === 'Earnewâld' && p.address === 'Wiidswei 1A').length, 1,
  'Westersail has one record; do not duplicate the terrace and brasserie');
assert.ok(pietje.other_sources.includes('https://dartsgids.nl/locaties/cafe-pietje-bell/'),
  '2026 darts-directory record is a source, not opening confirmation');
console.log('Westersail seasonal closure boundaries and Pietje Bell source uncertainty verified.');


// 03-11-2026: actual operator website, not a stale tourist guide,
// determines Yn'e Haven's public drinks hours and the current address.
const ynHaven = db.places.find(p => p.id === 'grand-cafe-yn-e-haven-earnewald-20261103');
const meerpaal = db.places.find(p => p.id === 'eetcafe-de-meerpaal-earnewald-20261103');
assert.ok(ynHaven && meerpaal);
assert.equal(ynHaven.selection, 'Voorlopig');
assert.equal(ynHaven.address, 'Kruspaed 6', 'Operator address, not older guide Kruspaed 4');
assert.equal(ynHaven.closing_source, 'https://ynehaven.nl/reserveren/');
assert.ok(ynHaven.alcohol.includes('cocktails'));
for (const day of ['ma','di','wo','do']) {
  assert.equal(ynHaven.opening[day], '?', 'Conflicting operator pages: unknown '+day);
  assert.equal(ynHaven.closing[day], '?', 'Do not silently prefer closed over daily lunch claim '+day);
}
for (const day of ['vr','za','zo']) {
  assert.equal(ynHaven.opening[day], '12:00', 'Weekend opening '+day);
  assert.equal(ynHaven.closing[day], '21:00', 'Weekend closing '+day);
}
assert.equal(meerpaal.selection, 'Nog te controleren',
  'Camping restaurant may not have unrestricted public admission');
assert.equal(meerpaal.address, 'Koaidyk 10');
assert.ok(meerpaal.alcohol.includes('speciaalbier'));
for (const day of ['ma','di','wo','do','vr','za','zo']) {
  assert.equal(meerpaal.opening[day], '?', 'Camping restaurant hours unknown '+day);
  assert.equal(meerpaal.closing[day], '?', 'Do not copy campground or snack bar hours '+day);
}
for (const p of [ynHaven,meerpaal,westersail]) {
  assert.equal(db.places.filter(x => x.region === 'friesland' &&
    x.city === p.city && x.address === p.address).length, 1,
    'Distinct Earnewald venues have no duplicate addresses: '+p.id);
}
console.log('Earnewald Yn e Haven operator weekend hours and Meerpaal admission uncertainty verified.');

assert.equal(meerpaal.website, 'https://www.demeerpaal.frl/');
assert.ok(meerpaal.access.includes('niet alleen'), 'Owner interview explicitly welcomes non-campers');
assert.equal(meerpaal.date_closures.length, 1);
assert.equal(meerpaal.date_closures[0].source,
  'https://www.demeerpaal.frl/openingstijden-eetcafe/');
for (const date of ['2026-11-03','2026-12-31','2027-03-31']) {
  assert.equal(isClosed(meerpaal,date),true,'Owner confirmed winter closure '+date);
}
for (const date of ['2026-11-02','2027-04-01']) {
  assert.equal(isClosed(meerpaal,date),false,'Do not invent a date beyond evidence '+date);
}
console.log('Meerpaal non-camper admission and winter closure from live owner site verified.');

// 03-11-2026: Princenhof's public hotel bar is not its restaurant's kitchen timetable.
// The operator's 2026 drinks menu verifies alcohol, but no exact bar closing/entry hours.
const princenhof = db.places.find(p => p.id === 'hotel-restaurant-princenhof-earnewald-20261103');
assert.ok(princenhof, 'Princenhof has a unique stable venue ID');
assert.equal(princenhof.address, 'Piet Miedemaweg 15');
assert.equal(princenhof.region, 'friesland');
assert.equal(princenhof.website, 'https://princenhof.nl/');
assert.equal(princenhof.selection, 'Voorlopig');
assert.ok(princenhof.alcohol.includes('tapbier'));
for (const day of ['ma','di','wo','do','vr','za','zo']) {
  assert.equal(princenhof.opening[day], '?', 'Restaurant meal periods do not prove bar opening '+day);
  assert.equal(princenhof.closing[day], '?', 'Dinner service ending at 20:00 is not bar closure '+day);
}
assert.equal(db.places.filter(p => p.region === 'friesland' &&
  p.city === 'Earnewâld' && p.address === 'Piet Miedemaweg 15').length, 1,
  'One Princenhof location, not separate hotel/terrace/bar duplicates');
console.log('Princenhof 2026 drinks evidence and unknown bar-hour boundaries verified.');

// 03-11-2026: operator house rules specify last entry, explicitly NOT closure.
const bascule2026 = db.places.find(p => p.id === 'bar-bascule-leeuwarden-20261102');
assert.ok(bascule2026, 'Bascule stable venue ID');
assert.equal(bascule2026.last_entry_source, 'https://www.barbascule.nl/deurbeleid');
assert.equal(bascule2026.last_entry_checked_on, '2026-11-03');
for (const day of ['ma','di','wo','do','vr','za','zo']) {
  assert.equal(bascule2026.last_entry[day], '03:00', 'Operator 03:00 admission cutoff '+day);
  assert.equal(bascule2026.closing[day], '?', 'No invented 03:00 or 05:00 closure '+day);
}
assert.ok(bascule2026.access.includes('18+'), '18+ door policy must be disclosed');
assert.equal(field(bascule2026, 'last_entry', 'vr', '2026-11-06'), '03:00');
console.log('Bascule last-entry cutoff is not a fixed closing time.');
