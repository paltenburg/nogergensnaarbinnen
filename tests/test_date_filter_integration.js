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
].join('\n');
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

// Event-only and winter-closure regression: the real master must not show
// uncertain weekly events as a guaranteed open venue on arbitrary dates.
state.after = '';
state.date = '2026-11-14'; state.day = 'za';
assert.equal(eligible(byId('paradiso-bar-kollum-20261030')), true,
  'confirmed ticket event on 14 November is visible');
state.date = '2026-11-07'; state.day = 'za';
assert.equal(eligible(byId('paradiso-bar-kollum-20261030')), false,
  'an advertised event without verified full hours is not a fixed schedule');
assert.equal(eligible(byId('de-vijfpoort-formerum-fa6312a')), false,
  'almost every Saturday does not prove a particular Saturday');
assert.equal(eligible(byId('tdf-berltsum-20261030')), false,
  'event venue with no current dated event remains hidden');
assert.equal(eligible(byId('club-24-lemmer-20261031')), false,
  'Club 24 must not be presented as regularly open without a sourced future party');
state.uncertain = true;
assert.equal(eligible(byId('club-24-lemmer-20261031')), false,
  'uncertain toggle must not bypass Club 24 date verification');
state.uncertain = false;
state.date = '2026-11-06'; state.day = 'vr';
assert.equal(eligible(byId('eetcafe-de-winze-wyns-20261030')), true,
  'verified winter Friday is visible');
state.date = '2026-11-03'; state.day = 'di';
assert.equal(eligible(byId('eetcafe-de-winze-wyns-20261030')), false,
  'winter Tuesday is closed');
state.date = '2026-12-19'; state.day = 'za';
assert.equal(eligible(byId('eetcafe-de-winze-wyns-20261030')), false,
  'Christmas period is not assumed open');
state.date = ''; state.day = 'vr';
for (const id of ['paradiso-bar-kollum-20261030',
  'de-vijfpoort-formerum-fa6312a', 'tdf-berltsum-20261030',
  'club-24-lemmer-20261031', 'eetcafe-de-winze-wyns-20261030']) {
  assert.equal(eligible(byId(id)), false, id + ' hidden without exact date');
}
state.sameDayMorning = false;
state.date = '2026-11-14'; state.day = 'za'; state.after = '20:30';
assert.equal(timedEligible(byId('paradiso-bar-kollum-20261030')), true,
  'ticket event begins at 20:30');
state.after = '01:30';
assert.equal(timedEligible(byId('paradiso-bar-kollum-20261030')), true,
  'ticket event runs through 01:30 on Sunday morning');
state.after = '02:00';
assert.equal(timedEligible(byId('paradiso-bar-kollum-20261030')), false,
  'ticket event ends at 02:00');
state.date = '2026-11-06'; state.day = 'vr'; state.after = '22:30';
assert.equal(timedEligible(byId('eetcafe-de-winze-wyns-20261030')), true,
  'winter Friday 22:30 is before closing');
state.after = '23:00';
assert.equal(timedEligible(byId('eetcafe-de-winze-wyns-20261030')), false,
  'winter Friday 23:00 is closing, not arrival');
state.after = '';

// De Branding: published kitchen cutoff is not the venue closing time.
state.after = ''; state.date = '2026-11-05'; state.day = 'do';
assert.equal(eligible(byId('strandpaviljoen-de-branding-midsland-aan-zee-20261101')), true,
  'Thursday winter opening is dated and confirmed');
state.date = '2026-11-02'; state.day = 'ma';
assert.equal(eligible(byId('strandpaviljoen-de-branding-midsland-aan-zee-20261101')), false,
  'Monday winter closure is respected');
state.date = '2026-12-19'; state.day = 'za';
assert.equal(eligible(byId('strandpaviljoen-de-branding-midsland-aan-zee-20261101')), false,
  'Christmas opening not inferred from ordinary winter schedule');
state.date = '2026-11-05'; state.day = 'do'; state.after = '17:00';
assert.equal(timedEligible(byId('strandpaviljoen-de-branding-midsland-aan-zee-20261101')), true,
  '17:00 kitchen stop is not bar closing');
state.after = '17:30';
assert.equal(timedEligible(byId('strandpaviljoen-de-branding-midsland-aan-zee-20261101')), false,
  '17:30 is venue closing');
state.after = '10:00';
assert.equal(timedEligible(byId('strandpaviljoen-de-branding-midsland-aan-zee-20261101')), false,
  '10:00 precedes 10:30 opening');
state.after = '';

state.date = '2026-11-01'; state.day = 'zo'; state.after = '17:30';
assert.equal(timedEligible(byId('strandpaviljoen-de-branding-midsland-aan-zee-20261101')), true,
  'Berenloop Sunday is open until 18:00');
state.after = '18:00';
assert.equal(timedEligible(byId('strandpaviljoen-de-branding-midsland-aan-zee-20261101')), false,
  'Berenloop Sunday closes exactly at 18:00');
state.after = '';

// A business active in October must not be advertised as open in November
// solely because its own site still shows an October-only timetable.
state.date = '2026-11-01'; state.day = 'zo'; state.after = '';
assert.equal(eligible(byId('beachclub-sneek-offingawier-20261101')), false,
  'Beachclub Sneek has no verified November schedule');
state.date = ''; state.day = 'vr';
assert.equal(eligible(byId('beachclub-sneek-offingawier-20261101')), false,
  'October-only hours must not be treated as year-round hours');

// Every event/season venue without a sourced date range must stay hidden,
// including when the user opts into showing unverified candidates.
state.region = 'friesland'; state.after = ''; state.uncertain = true;
for (const venue of master.places.filter(p => p.requires_date_schedule &&
    (!Array.isArray(p.date_schedules) || p.date_schedules.length === 0))) {
  for (const date of ['2026-11-06', '2026-11-14', '']) {
    state.date = date; state.day = 'vr';
    assert.equal(eligible(venue), false,
      venue.id + ' has no verified date schedule: ' + (date || 'no date'));
  }
}
state.uncertain = false; state.date = '';

// Seasonal venues must not reappear after the published season or when the
// user opts into uncertain venues. These cases use the actual master records.
state.region = 'friesland'; state.category = ''; state.q = '';
state.after = ''; state.uncertain = false;
state.date = '2026-11-01'; state.day = 'zo';
assert.equal(eligible(byId('strandpaviljoen-de-potvis-stavoren-20261031')), true,
  'De Potvis is open on the sourced final-season Sunday');
state.date = '2026-11-03'; state.day = 'di';
assert.equal(eligible(byId('strandpaviljoen-de-potvis-stavoren-20261031')), false,
  'De Potvis summer-only Tuesday does not carry into November');
state.date = '2026-11-18'; state.day = 'wo';
assert.equal(eligible(byId('strandpaviljoen-de-potvis-stavoren-20261031')), false,
  'De Potvis must not appear after November 15');
state.date = '2027-04-07'; state.day = 'wo';
assert.equal(eligible(byId('strandpaviljoen-de-potvis-stavoren-20261031')), false,
  'next season cannot be inferred from a previous-year schedule');
state.date = ''; state.day = 'zo';
assert.equal(eligible(byId('strandpaviljoen-de-potvis-stavoren-20261031')), false,
  'weekday-only filter cannot advertise a seasonal venue year-round');
state.uncertain = true;
for (const id of [
  'paviljoen-paal-3-schiermonnikoog-20261030',
  'de-hege-gerzen-oudemirdum-20261031',
  'restaurant-it-posthus-burdaard-20261031'
]) {
  for (const date of ['2026-11-01', '2027-05-15', '']) {
    state.date = date; state.day = 'zo';
    assert.equal(eligible(byId(id)), false,
      id + ' has no verified future public-opening interval: ' + date);
  }
}
state.uncertain = false; state.date = ''; state.day = 'vr';

// De Pôlle has a split winter day on Monday/Friday. The single-window UI
// conservatively represents only its verified evening session, never the
// closed 14:00–17:00 interval.
state.region = 'friesland'; state.uncertain = false; state.category = '';
state.q = ''; state.after = '';
state.date = '2026-11-06'; state.day = 'vr';
assert.equal(eligible(byId('de-polle-de-veenhoop-20261030')), true,
  'verified winter Friday evening appears');
state.date = '2026-11-04'; state.day = 'wo';
assert.equal(eligible(byId('de-polle-de-veenhoop-20261030')), false,
  'winter Wednesday is closed');
state.date = '2027-01-08'; state.day = 'vr';
assert.equal(eligible(byId('de-polle-de-veenhoop-20261030')), false,
  'unverified 2027 schedule is not extrapolated');
state.date = '2026-11-06'; state.day = 'vr'; state.after = '16:30';
assert.equal(timedEligible(byId('de-polle-de-veenhoop-20261030')), false,
  '16:30 falls in the unpublished afternoon gap');
state.after = '17:30';
assert.equal(timedEligible(byId('de-polle-de-veenhoop-20261030')), true,
  '17:30 is inside the verified evening session');
state.after = '20:00';
assert.equal(timedEligible(byId('de-polle-de-veenhoop-20261030')), false,
  '20:00 is closing, not an arrival time');
state.after = ''; state.date = ''; state.day = 'vr';

// Dokkum winter Sundays: the operator explicitly closes every Sunday
// November–March except two named exceptions. Neither exception proves hours.
state.region = 'friesland'; state.uncertain = false; state.after = '';
state.date = '2026-11-01'; state.day = 'zo';
assert.equal(eligible(byId('grandcafe-hotel-van-der-meer-dokkum-20261031')), false,
  'winter Sunday November 1 is closed');
state.date = '2026-11-29';
assert.equal(eligible(byId('grandcafe-hotel-van-der-meer-dokkum-20261031')), true,
  'named November exception must not be incorrectly marked closed');
state.date = '2026-12-27';
assert.equal(eligible(byId('grandcafe-hotel-van-der-meer-dokkum-20261031')), true,
  'named December exception must not be incorrectly marked closed');
state.date = '2027-01-03';
assert.equal(eligible(byId('grandcafe-hotel-van-der-meer-dokkum-20261031')), false,
  'winter Sunday in January is closed');
state.date = '2027-03-28';
assert.equal(eligible(byId('grandcafe-hotel-van-der-meer-dokkum-20261031')), false,
  'final winter Sunday remains closed');
assert.equal(byId('grandcafe-hotel-van-der-meer-dokkum-20261031').opening.wo, '?',
  'contradictory Wednesday opening must remain unknown');
state.date = ''; state.day = 'vr';

// Newly discovered Friesland venues: a verified public café and a bistro
// whose wine/beer service does not prove walk-in drinks without a meal.
state.region = 'friesland'; state.uncertain = false; state.after = '';
state.date = '2026-11-06'; state.day = 'vr';
assert.equal(eligible(byId('weids-bolsward-20261101')), true,
  'Weids public café is available in its published Friday hours');
assert.equal(eligible(byId('bistro-duinkerken-leeuwarden-20261101')), false,
  'Duinkerken stays hidden pending confirmation of standalone bar access');
state.after = '21:30';
assert.equal(timedEligible(byId('weids-bolsward-20261101')), true,
  'Weids published 22:00 business closing allows 21:30 arrival');
state.after = '22:00';
assert.equal(timedEligible(byId('weids-bolsward-20261101')), false,
  'Weids published closing is not a valid arrival time');
state.after = ''; state.date = ''; state.day = 'vr';

// The arrival-time dropdown must not take its earliest closure from a
// seasonal venue outside its verified interval or a one-day closed venue.
const optionsSource = inlineRange('function arrivalOptionClosings(){',
  'function fillArrivalOptions(){');
const optionState = {region:'friesland',day:'vr',date:'2026-11-06',uncertain:false};
const optionDb = {places:[
  {region:'friesland',selection:'Voorlopig',requires_date_schedule:true,
   opening:{vr:'10:00'},closing:{vr:'18:00'},date_schedules:[
     {start:'2026-11-01',end:'2026-11-30',
      opening:{vr:'11:00'},closing:{vr:'20:00'}}]},
  {region:'friesland',selection:'Voorlopig',
   opening:{vr:'17:00'},closing:{vr:'22:00'}},
  {region:'friesland',selection:'Voorlopig',
   opening:{vr:'10:00'},closing:{vr:'15:00'},
   date_closures:[{start:'2026-11-06',end:'2026-11-06'}]},
  {region:'friesland',selection:'Voorlopig',
   opening:{vr:'—'},closing:{vr:'12:00'}},
  {region:'utrecht',selection:'Voorlopig',
   opening:{vr:'10:00'},closing:{vr:'14:00'}},
  {region:'friesland',selection:'Nog te controleren',
   opening:{vr:'12:00'},closing:{vr:'16:00'}}
]};
const optionTimeVal = s => /^\d\d:\d\d$/.test(String(s))
  ? Number(s.slice(0,2))*60+Number(s.slice(3))+
    (Number(s.slice(0,2))<12?1440:0) : null;
const optionValues = vm.runInNewContext(optionsSource+'; arrivalOptionClosings', {
  db:optionDb,state:optionState,NGNBDateClosures,
  timeVal:optionTimeVal,closingWindow:()=>null
});
assert.equal(JSON.stringify(optionValues()),JSON.stringify([1200,1320]),
  'only the sourced winter 20:00 and ordinary 22:00 closings apply');
optionState.date='2026-12-04';
assert.equal(JSON.stringify(optionValues()),JSON.stringify([1320,900]),
  'expired seasonal 18:00 must not influence December; regular 15:00 returns');
optionState.date='';
assert.equal(JSON.stringify(optionValues()),JSON.stringify([1320,900]),
  'seasonal venues without a selected date remain excluded');
optionState.date='2026-11-06';optionState.uncertain=true;
assert.equal(JSON.stringify(optionValues()),JSON.stringify([1200,1320,960]),
  'uncertain venues are considered only when the user enables them');

// A separately verified speakeasy shares Spinoza's address, but its own
// operator-published closing times control admission to the cocktailbar.
state.region='friesland';state.category='';state.q='';state.uncertain=false;
state.sameDayMorning=false;state.date='2026-11-04';state.day='wo';
state.after='20:30';
assert.equal(timedEligible(byId('cocktailbar-dr-watson-leeuwarden-20261101')),true,
  'Dr Watson Wednesday 20:30 precedes its own 01:00 closing');
state.after='01:00';
assert.equal(timedEligible(byId('cocktailbar-dr-watson-leeuwarden-20261101')),false,
  'Dr Watson Wednesday 01:00 is closing, not arrival');
state.date='2026-11-06';state.day='vr';state.after='01:30';
assert.equal(timedEligible(byId('cocktailbar-dr-watson-leeuwarden-20261101')),true,
  'Dr Watson Friday 01:30 is within the published 02:00 closing');
state.after='02:00';
assert.equal(timedEligible(byId('cocktailbar-dr-watson-leeuwarden-20261101')),false,
  'Dr Watson Friday 02:00 is not a valid arrival');
state.after='';state.date='';state.day='vr';

console.log('Frontend dated-closure integration tests passed');
