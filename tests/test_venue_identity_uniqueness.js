// Detect duplicate venue identities without conflating different concepts at one address.
// This is a structural check only; it does not establish current operation.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const db = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data', 'venues.json'), 'utf8'));
const normalize = value => String(value ?? '')
  .normalize('NFKD').replace(/[\u0300-\u036f]/g, '')
  .toLowerCase().replace(/['’`]/g, '').replace(/[^a-z0-9]+/g, '');
const identities = new Map();
for (const venue of db.places) {
  const identity = [venue.region, venue.city, venue.address, venue.name].map(normalize).join('|');
  const existing = identities.get(identity);
  assert.equal(existing, undefined,
    `Duplicate normalized venue identity: ${existing} and ${venue.id}`);
  identities.set(identity, venue.id);
}
console.log('Venue identity uniqueness OK:', identities.size, 'records');
