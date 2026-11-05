#!/usr/bin/env python3
"""Read-only PDOK BAG triage for venues with single addresses and no coordinates.

Run: python scripts/audit_pdok_single_addresses.py
Never writes data/venues.json; BAG addresses do not prove venue entrances.
"""
import json
import re
import sys
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "scripts"))
from geocode import addr_parts, norm, request, extract_point


def inspect(place):
    parts = addr_parts(place.get("address"))
    if not parts:
        return {"status": "unparseable-address"}
    street, number, suffix = parts
    city = str(place.get("city") or "").strip()
    qualified = re.fullmatch(r"(.+?)\s*\(([^()]+)\)", city)
    town = qualified.group(1).strip() if qualified else city
    municipality = qualified.group(2).strip() if qualified else None
    query = f"{street} {number}{suffix} {town}" + (f" {municipality}" if municipality else "")
    docs = request(query)
    exact = []
    for d in docs:
        if d.get("type") != "adres" or norm(d.get("woonplaatsnaam")) != norm(town):
            continue
        if municipality and norm(d.get("gemeentenaam")) != norm(municipality):
            continue
        if norm(d.get("straatnaam")) != norm(street):
            continue
        try:
            if int(d.get("huisnummer")) != number:
                continue
        except (ValueError, TypeError):
            continue
        if norm(d.get("huisletter")) != norm(suffix) or norm(d.get("huisnummertoevoeging")):
            continue
        point = extract_point(d.get("centroide_ll"))
        if point:
            exact.append({"bag_address": d.get("weergavenaam"),
                          "bag_id": d.get("nummeraanduiding_id"),
                          "lat": point[0], "lon": point[1]})
    # The shared PDOK client also returns [] on network failure.
    return {"status": "bag-address-candidate-not-entrance-verified" if len(exact) == 1 else "unresolved",
            "query": query, "exact_candidates": exact, "returned_documents": len(docs)}


def main():
    data = json.loads((ROOT / "data/venues.json").read_text(encoding="utf-8"))
    report = {"checked_at_utc": datetime.now(timezone.utc).isoformat(),
              "warning": "BAG address is not a verified public venue entrance; empty results can mean network failure.",
              "venues": []}
    for p in data["places"]:
        if p.get("geo") or p.get("geocode_blocked") or p.get("duplicate_of"):
            continue
        if not addr_parts(p.get("address")):
            continue
        result = inspect(p)
        report["venues"].append({"id": p["id"], "name": p["name"],
                                  "address": p.get("address"), "city": p.get("city"), **result})
    target = ROOT / "reports/pdok-single-address-candidates.json"
    target.parent.mkdir(parents=True, exist_ok=True)
    target.write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"Inspected {len(report['venues'])} single-address candidates; report {target}")


if __name__ == "__main__":
    main()
