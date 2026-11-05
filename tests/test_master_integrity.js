// Offline master invariants: no assumptions about actual venue opening.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const db = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data', 'venues.json'), 'utf8'));
const days = ['ma', 'di', 'wo', 'do', 'vr', 'za', 'zo'];
const regions = new Set(db.regions.map(r => r.id));
const ids = new Set();
assert.equal(regions.size, db.regions.length, 'Duplicate region IDs');
assert.ok(db.places.length > 0);
for (const p of db.places) {
  assert.ok(typeof p.id === 'string' && p.id.length, 'Missing venue ID');
  assert.ok(!ids.has(p.id), 'Duplicate ID ' + p.id);
  ids.add(p.id);
  assert.ok(regions.has(p.region), 'Unknown region ' + p.id);
  assert.ok(typeof p.name === 'string' && p.name.trim(), 'Missing name ' + p.id);
  assert.ok(typeof p.address === 'string' && p.address.trim(), 'Missing address ' + p.id);
  if (p.website) {
    assert.ok(/^https?:\/\/[^\s/]+\.[^\s/]+/.test(p.website), 'Invalid website URL ' + p.id);
  }
  for (const key of ['opening', 'closing']) {
    if (p[key] == null) continue;
    for (const day of days) {
      const value = p[key][day];
      assert.equal(typeof value, 'string', 'Missing ' + key + '.' + day + ' ' + p.id);
      if (/^\d{2}:\d{2}$/.test(value)) {
        const [h, m] = value.split(':').map(Number);
        assert.ok(h <= 23 && m <= 59, 'Invalid time ' + p.id + ' ' + key + '.' + day);
      }
    }
  }
  if (p.geo && (p.geo.lat != null || p.geo.lon != null)) {
    assert.ok(Number.isFinite(p.geo.lat) && Number.isFinite(p.geo.lon), 'Partial coordinates ' + p.id);
    assert.ok(p.geo.lat >= -90 && p.geo.lat <= 90 && p.geo.lon >= -180 && p.geo.lon <= 180,
      'Invalid coordinates ' + p.id);
    // Broad mainland/island Netherlands sanity bounds, not an address or BAG verification.
    assert.ok(p.geo.lat >= 50.7 && p.geo.lat <= 53.7 && p.geo.lon >= 3.1 && p.geo.lon <= 7.4,
      'Coordinates outside Netherlands sanity bounds ' + p.id);
  }
}
console.log('Master integrity OK:', ids.size, 'venues,', regions.size, 'regions');
