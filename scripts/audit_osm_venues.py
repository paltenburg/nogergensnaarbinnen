"""Audit OSM horeca against canonical data/venues.json; NEVER modify the master.

Output data/osm-audit-report.json is a *review queue*, not a second database.
© OpenStreetMap contributors, ODbL 1.0. https://www.openstreetmap.org/copyright
Use sparingly: one municipality-sized request per manual invocation.
"""
from __future__ import annotations
import difflib
import json
import re
import sys
import unicodedata
import urllib.parse
import urllib.request
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
MASTER = ROOT / "data" / "venues.json"
OUTPUT = ROOT / "data" / "osm-audit-report.json"
ENDPOINTS = [
    "https://overpass-api.de/api/interpreter",
    "https://overpass.kumi.systems/api/interpreter",
]
QUERY = """
[out:json][timeout:120];
area["name"="Utrecht"]["boundary"="administrative"]["admin_level"="8"]->.ut;
(
  nwr["amenity"~"^(pub|bar|cafe|restaurant|biergarten|nightclub)$"]["name"](area.ut);
);
out center tags;
"""

def norm(value):
    value = unicodedata.normalize("NFKD", str(value).casefold())
    value = value.encode("ascii", "ignore").decode("ascii")
    return re.sub(r"[^a-z0-9]+", "", value)

def comparable_address(address):
    value = str(address or "").strip().lower()
    value = re.sub(r"\b(aan de werf|a/d werf|a\.d\. werf)\b", "", value)
    value = value.replace("straatweg", "straatweg")
    return norm(value)

def request_osm():
    body = urllib.parse.urlencode({"data": QUERY}).encode("utf-8")
    errors = []
    for url in ENDPOINTS:
        try:
            req = urllib.request.Request(
                url, data=body, method="POST",
                headers={
                    "User-Agent": "nogergensnaarbinnen-osm-audit/1.0 (https://github.com/paltenburg/nogergensnaarbinnen)",
                    "Content-Type": "application/x-www-form-urlencoded; charset=utf-8",
                    "Accept": "application/json",
                }
            )
            with urllib.request.urlopen(req, timeout=165) as response:
                content = response.read(25_000_000)
            payload = json.loads(content.decode("utf-8"))
            if not isinstance(payload.get("elements"), list):
                raise ValueError("Missing Overpass elements array")
            return payload, url
        except Exception as exc:
            errors.append(f"{url}: {type(exc).__name__}: {exc}")
    raise RuntimeError("All Overpass endpoints failed. " + " | ".join(errors))

def main():
    known = json.loads(MASTER.read_text(encoding="utf-8"))["places"]
    response, endpoint = request_osm()
    by_name = {}
    by_address = {}
    for venue in known:
        by_name.setdefault(norm(venue.get("name")), []).append(venue)
        address = comparable_address(venue.get("address"))
        if address:
            by_address.setdefault(address, []).append(venue)

    results = []
    matched = []
    for osm in response["elements"]:
        tags = osm.get("tags") or {}
        name = tags.get("name", "").strip()
        if not name:
            continue
        address = " ".join(filter(None, [
            tags.get("addr:street", ""), tags.get("addr:housenumber", "")
        ])).strip()
        name_matches = by_name.get(norm(name), [])
        address_matches = by_address.get(comparable_address(address), []) if address else []
        strong = [p for p in name_matches if not address or not p.get("address")
                  or comparable_address(p.get("address")) == comparable_address(address)]
        if strong:
            matched.append({"osm": f'{osm["type"]}/{osm["id"]}',
                            "venue_id": strong[0]["id"]})
            continue
        possible = []
        if name_matches:
            possible.extend(name_matches)
        if address_matches:
            possible.extend(address_matches)
        if not possible:
            for p in known:
                s = difflib.SequenceMatcher(None, norm(name), norm(p["name"])).ratio()
                if s >= 0.88:
                    possible.append(p)
        candidate = {
            "osm_url": f'https://www.openstreetmap.org/{osm["type"]}/{osm["id"]}',
            "name": name,
            "amenity": tags.get("amenity"),
            "address": address,
            "postcode": tags.get("addr:postcode"),
            "website": tags.get("website") or tags.get("contact:website"),
            "opening_hours_raw": tags.get("opening_hours"),
            "alcohol_raw": tags.get("drink:beer") or tags.get("drink:wine") or tags.get("alcohol"),
            "match_class": "possible_duplicate_or_address_conflict" if possible else "not_matched",
            "possible_matches": list({p["id"]: {"id": p["id"], "name": p["name"],
                "address": p.get("address", "")} for p in possible}.values())[:5],
        }
        results.append(candidate)

    results.sort(key=lambda r: (r["match_class"], r["amenity"] or "", r["name"].casefold()))
    summary = {
        "generated_at_utc": datetime.now(timezone.utc).isoformat(timespec="seconds"),
        "description": "OSM comparison candidates only; manual verification of public entry and alcohol required",
        "master": "data/venues.json",
        "master_place_count": len(known),
        "osm_endpoint": endpoint,
        "query_scope": "Municipality of Utrecht, boundary administrative level 8",
        "openstreetmap_copyright": "© OpenStreetMap contributors; ODbL 1.0",
        "license_url": "https://www.openstreetmap.org/copyright",
        "osm_named_places": len(matched) + len(results),
        "matched_osm_elements": len(matched),
        "unmatched_candidates": sum(x["match_class"] == "not_matched" for x in results),
        "possible_duplicates_or_conflicts": sum(x["match_class"] != "not_matched" for x in results),
        "known_matches_sample": matched[:25],
        "candidates": results,
    }
    OUTPUT.write_text(json.dumps(summary, ensure_ascii=False, indent=2) + "\n",
                      encoding="utf-8")
    print("OSM audit:", {k: summary[k] for k in
          ("master_place_count", "osm_named_places", "matched_osm_elements",
           "unmatched_candidates", "possible_duplicates_or_conflicts")})
    print("Wrote", OUTPUT)

if __name__ == "__main__":
    main()
