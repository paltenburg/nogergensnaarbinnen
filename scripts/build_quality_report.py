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


def has_dated_exact_time(place, field):
    """A sourced date range contains an exact time, not necessarily today."""
    return any(
        isinstance(schedule, dict) and
        any(TIME.fullmatch(str((schedule.get(field) or {}).get(day, ""))) for day in DAYS)
        for schedule in (place.get("date_schedules") or [])
    )


def has_any_exact_time_including_dated(place, field):
    return has_exact_time(place, field) or has_dated_exact_time(place, field)


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
        aliases = sorted((p for p in venues if p.get("duplicate_of")), key=lambda p: p["id"])
        address_groups = defaultdict(list)
        for p in venues:
            if p.get("duplicate_of"):
                continue
            if p.get("city") and p.get("address"):
                address_groups[(normalized(p["city"]), normalized(p["address"]))].append(p)
        shared = [
            {"city": items[0]["city"], "address": items[0]["address"],
             "venue_ids": sorted(p["id"] for p in items)}
            for items in address_groups.values() if len(items) > 1
        ]
        shared.sort(key=lambda x: (normalized(x["city"]), normalized(x["address"])))
        # Group by named settlement, not municipality. This is a discovery queue,
        # NOT a completeness assessment: towns with zero recorded venues are absent.
        city_groups = defaultdict(list)
        for place in venues:
            if place.get("duplicate_of"):
                continue
            city_groups[normalized(place.get("city")) or "(onbekend)"].append(place)
        city_coverage = []
        for city_key in sorted(city_groups):
            city_venues = city_groups[city_key]
            city_coverage.append({
                "city": next((p["city"] for p in city_venues if p.get("city")), "(onbekend)"),
                "total": len(city_venues),
                "without_website_url": sum(not p.get("website") for p in city_venues),
                "without_recorded_website_check_date": sum(not p.get("website_checked_on") for p in city_venues),
                "without_coordinates": sum(not (isinstance(p.get("geo"), dict) and
                                           isinstance(p["geo"].get("lat"), (int, float)) and
                                           isinstance(p["geo"].get("lon"), (int, float))) for p in city_venues),
                "needs_selection_review": sum(p.get("selection") == "Nog te controleren" for p in city_venues),
                "without_any_exact_closing": sum(not has_exact_time(p, "closing") for p in city_venues),
                "with_dated_exact_closing": sum(has_dated_exact_time(p, "closing") for p in city_venues),
                "without_any_exact_closing_including_dated": sum(
                    not has_any_exact_time_including_dated(p, "closing") for p in city_venues),
                "without_explicit_last_entry": sum(not has_exact_time(p, "last_entry") for p in city_venues),
                "undated_schedule_required_count": sum(bool(p.get("requires_date_schedule")) and not p.get("date_schedules") for p in city_venues),
            })
        regions.append({
            "id": region_id,
            "name": region_names.get(region_id, region_id),
            "total": len(venues),
            "distinct_recorded_venues": len(venues) - len(aliases),
            "duplicate_alias_count": len(aliases),
            "duplicate_aliases": [{"id": p["id"], "duplicate_of": p["duplicate_of"]} for p in aliases],
            "date_closure_venue_count": sum(bool(p.get("date_closures")) for p in venues),
            "date_schedule_venue_count": sum(bool(p.get("date_schedules")) for p in venues),
            "requires_date_schedule_count": sum(bool(p.get("requires_date_schedule")) for p in venues),
            "undated_schedule_required_count": sum(bool(p.get("requires_date_schedule")) and not p.get("date_schedules") for p in venues),
            "settlement_count": len(city_coverage),
            "settlement_coverage": city_coverage,
            "selection_counts": dict(sorted(selections.items())),
            "with_website_url": sum(bool(p.get("website")) for p in venues),
            "without_website_url": sum(not p.get("website") for p in venues),
            "with_recorded_review_date": sum(bool(p.get("checked_on")) for p in venues),
            "without_recorded_review_date": sum(not p.get("checked_on") for p in venues),
            "with_opening_source_url": sum(bool(p.get("opening_source")) for p in venues),
            "with_closing_source_url": sum(bool(p.get("closing_source")) for p in venues),
            "with_coordinates": sum(isinstance(p.get("geo"), dict) and
                                    isinstance(p["geo"].get("lat"), (int, float)) and
                                    isinstance(p["geo"].get("lon"), (int, float)) for p in venues),
            "without_coordinates": sum(not (isinstance(p.get("geo"), dict) and
                                       isinstance(p["geo"].get("lat"), (int, float)) and
                                       isinstance(p["geo"].get("lon"), (int, float))) for p in venues),
            "with_geocode_blocked": sum(bool(p.get("geocode_blocked")) for p in venues),
            "with_any_exact_opening": sum(has_exact_time(p, "opening") for p in venues),
            "with_any_exact_closing": sum(has_exact_time(p, "closing") for p in venues),
            "without_any_exact_closing": sum(not has_exact_time(p, "closing") for p in venues),
            "with_dated_exact_closing": sum(has_dated_exact_time(p, "closing") for p in venues),
            "with_any_exact_closing_including_dated": sum(
                has_any_exact_time_including_dated(p, "closing") for p in venues),
            "without_any_exact_closing_including_dated": sum(
                not has_any_exact_time_including_dated(p, "closing") for p in venues),
            "with_any_explicit_last_entry": sum(has_exact_time(p, "last_entry") for p in venues),
            "without_explicit_last_entry": sum(not has_exact_time(p, "last_entry") for p in venues),
            "shared_address_candidates": shared,
            "shared_address_group_count": len(shared),
        })
    return {
        "snapshot_date": snapshot_date,
        "source": "data/venues.json",
        "interpretation": "Recorded data coverage only. Shared addresses are investigation signals, not duplicate venue proof. Duplicate aliases retain their IDs but are excluded from distinct_recorded_venues; the other coverage counts still include master records. A recorded review date does not certify present operation. The undated schedule count identifies venues intentionally hidden until a specific verified date is available. Base closing counts exclude dated schedules for backward compatibility; dated and combined counts include sourced schedule intervals but do not prove that a venue is open on the snapshot date. Settlement coverage excludes duplicate aliases and includes only places already in the database; it cannot establish municipal or geographic completeness.",
        "total": len(places),
        "distinct_recorded_venues": sum(not p.get("duplicate_of") for p in places),
        "duplicate_alias_count": sum(bool(p.get("duplicate_of")) for p in places),
        "date_closure_venue_count": sum(bool(p.get("date_closures")) for p in places),
        "date_schedule_venue_count": sum(bool(p.get("date_schedules")) for p in places),
        "requires_date_schedule_count": sum(bool(p.get("requires_date_schedule")) for p in places),
        "undated_schedule_required_count": sum(bool(p.get("requires_date_schedule")) and not p.get("date_schedules") for p in places),
        "regions": regions,
    }


def main():
    dataset = json.loads(SOURCE.read_text(encoding="utf-8"))
    report = build_report(dataset, date.today().isoformat())
    TARGET.write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"Quality report: {report['total']} venues across {len(report['regions'])} active regions")


if __name__ == "__main__":
    main()
