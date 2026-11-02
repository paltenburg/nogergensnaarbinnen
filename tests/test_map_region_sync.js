// Node-only regression for region selection: no browser or network required.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
const match = html.match(/<script>\s*([\s\S]*?)<\/script>/);
assert.ok(match, 'inline application script exists');
new vm.Script(match[1], {filename:'index-inline.js'}); // parse the entire application
const source = match[1];
const from = source.indexOf('function mapContentPadding(){');
const to = source.indexOf('function syncRegionFromMap(){', from);
assert.ok(from >= 0 && to > from, 'map centre and region helpers exist');
const helpers = source.slice(from, to);

function check(center, selectedRegion) {
  const db = {
    regions: [{id:'utrecht'}, {id:'friesland'}],
    places: [
      {region:'utrecht', geo:{lat:52.0907, lon:5.1214}},
      {region:'friesland', geo:{lat:53.0337, lon:5.6651}},
      {region:'friesland', geo:null}, // never infer missing coordinates
      {region:'friesland', geo:{lat:null, lon:5.7}}, // null is not latitude zero
      {region:'friesland', geo:{lat:0, lon:5.7}, duplicate_of:'old'}, // aliases are not sites
    ],
  };
  const map = {
    getCenter: () => ({lat:center[0], lng:center[1]}),
    distance: (a,b) => Math.hypot((a.lat-b.lat)*111000,(a.lng-b.lng)*68000),
  };
  const L = {latLng:(lat,lng) => ({lat,lng})};
  const state = {region:selectedRegion};
  return vm.runInNewContext(helpers+'; ({region:regionAtMapCenter(), padding:mapContentPadding()})',
    {map,db,L,state});
}

assert.equal(check([52.0907,5.1214], 'utrecht').region, 'utrecht');
assert.equal(check([53.0337,5.6651], 'utrecht').region, 'friesland',
  'panning from Utrecht to Sneek must switch region on mobile and desktop');
assert.equal(check([52.0907,5.1214], 'friesland').region, 'utrecht',
  'panning back must switch to Utrecht');
assert.equal(check([50.0,4.0], 'utrecht').region, null,
  'unknown distant areas must not be assigned to a region');
assert.equal(check([0,5.7], 'utrecht').region, null,
  'missing latitudes and duplicate aliases must not create phantom map regions');
assert.equal(JSON.stringify(check([53.0337,5.6651], 'utrecht').padding),
  JSON.stringify({left:18,right:18,top:18,bottom:18}),
  'no viewport-relative header or card offsets: map itself is unobstructed');
assert.ok(helpers.includes('map.getCenter()'), 'use true Leaflet map centre');
assert.ok(!helpers.includes('containerPointToLatLng('), 'avoid viewport offset drift');
console.log('Map region regressions: 7 assertions passed (synthetic map, not live mobile UI).');
