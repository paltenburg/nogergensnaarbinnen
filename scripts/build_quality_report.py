#!/usr/bin/env python3
"""Derived quality snapshot of data/venues.json; never changes the master.

Counts are evidence-coverage indicators, not claims of real-world completeness.
"""
import json
import re
import unicodedata
from collections import Counter, defaultdict
from datetime import date
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "data" / "venues.json"
TARGET = ROOT / "data" / "quality-report.json"
DAYS = ("ma", "di", "wo", "do", "vr", "za", "zo")
TIME = re.compile(r"^(?:[01]\d|2[0-3]):[0-5]\d$")


def normalized(value):
    value = unicodedata.normalize("NFKD", str(value or ""))
    return re.sub(r"[^a-z0-9]+", " ", value.encode("ascii", "ignore").decode().lower()).strip()


def has_exact_time(place, field):
    values = place.get(field) or {}
    return any(TIME.fullmatch(str(values.get(day, ""))) for day in DAYS)


def build_report(dataset, snapshot_date):
    """Pure report builder: no network, no inference of unverified business status."""
    places = dataset["places"]
    region_names = {r["id"]: r.get("name", r["id"]) for r in dataset.get("regions", [])}
    groups = defaultdict(list)
    for place in places:
        groups[place.get("region", "")].append(place)
    regions = []
    for region_id in sorted(groups):
        venues = groups[region_id]
        selections = Counter(p.get("selection", "Onbekend") for p in venues)
        address_groups = defaultdict(list)
        for p in venues:
            if p.get("city") and p.get("address"):
                address_groups[(normalized(p["city"]), normalized(p["address"]))].append(p)
        shared = [
            {"city": items[0]["city"], "address": items[0]["address"],
             "venue_ids": sorted(p["id"] for p in items)}
            for items in address_groups.values() if len(items) > 1
        ]
        shared.sort(key=lambda x: (normalized(x["city"]), normalized(x["address"])))
        regions.append({
            "id": region_id,
            "name": region_names.get(region_id, region_id),
            "total": len(venues),
            "selection_counts": dict(sorted(selections.items())),
            "with_website_url": sum(bool(p.get("website")) for p in venues),
            "with_recorded_review_date": sum(bool(p.get("checked_on")) for p in venues),
            "with_coordinates": sum(isinstance(p.get("geo"), dict) and
                                    isinstance(p["geo"].get("lat"), (int, float)) and
                                    isinstance(p["geo"].get("lon"), (int, float)) for p in venues),
            "with_any_exact_closing": sum(has_exact_time(p, "closing") for p in venues),
            "with_any_explicit_last_entry": sum(has_exact_time(p, "last_entry") for p in venues),
            "shared_address_candidates": shared,
            "shared_address_group_count": len(shared),
        })
    return {
        "snapshot_date": snapshot_date,
        "source": "data/venues.json",
        "interpretation": "Recorded data coverage only. Shared addresses are investigation signals, not duplicate venue proof. A recorded review date does not certify present operation.",
        "total": len(places),
        "regions": regions,
    }


def main():
    dataset = json.loads(SOURCE.read_text(encoding="utf-8"))
    report = build_report(dataset, date.today().isoformat())
    TARGET.write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"Quality report: {report['total']} venues across {len(report['regions'])} active regions")


if __name__ == "__main__":
    main()
