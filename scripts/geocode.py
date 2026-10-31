#!/usr/bin/env python3
"""Geocode Dutch venue addresses using the PDOK Locatieserver.

Only confirmed BAG street, house-number and city matches are accepted.
Unmatched records remain without geo; no guessed map positions are created.
"""
import difflib
import json
import re
import time
import unicodedata
from pathlib import Path
from urllib.error import HTTPError, URLError
from urllib.parse import urlencode
from urllib.request import Request, urlopen

ROOT = Path(__file__).resolve().parents[1]
DATA = ROOT / "data" / "venues.json"
REPORT = ROOT / "data" / "geocode-report.json"
API = "https://api.pdok.nl/bzk/locatieserver/search/v3_1/free"


def norm(value):
    value = unicodedata.normalize("NFKD", str(value or ""))
    value = value.encode("ascii", "ignore").decode("ascii").lower()
    return re.sub(r"[^a-z0-9]+", " ", value).strip()


def addr_parts(address):
    text = str(address or "").split(",", 1)[0].strip()
    # A house-number range is not one exact BAG address.
    # Never silently map a range to its first house number.
    match = re.fullmatch(r"(.+?)\s+(\d+)\s*([a-zA-Z]?)", text)
    if not match:
        return None
    street, house_number, letter = match.groups()
    return street, int(house_number), letter.lower()


def extract_point(wkt):
    match = re.fullmatch(
        r"POINT\s*\(\s*([-+\d.]+)\s+([-+\d.]+)\s*\)",
        str(wkt or ""), flags=re.IGNORECASE,
    )
    if not match:
        return None
    lon, lat = map(float, match.groups())
    if 50.0 < lat < 54.0 and 3.0 < lon < 8.0:
        return round(lat, 7), round(lon, 7)
    return None


def request(query):
    url = API + "?" + urlencode({"q": query, "rows": 8, "fq": "type:adres"})
    for attempt in range(3):
        try:
            req = Request(url, headers={
                "User-Agent": "nogergensnaarbinnen/0.1 (public open-data map)",
                "Accept": "application/json",
            })
            with urlopen(req, timeout=24) as response:
                return json.load(response).get("response", {}).get("docs", [])
        except (HTTPError, URLError, TimeoutError, ValueError) as exc:
            print("PDOK request failed:", str(exc)[:180])
            time.sleep(2 * (attempt + 1))
    return []


def geo(place):
    parts = addr_parts(place.get("address"))
    if not parts:
        return None, "no-number-or-unparseable-address"
    street, number, suffix = parts
    # Dataset display labels can disambiguate homonymous villages, e.g.
    # "Hoorn (Terschelling)". PDOK uses "Hoorn" as the woonplaatsnaam
    # and "Terschelling" as the gemeentenaam. Match BOTH, never discard
    # the qualifier and risk geocoding to a different Hoorn.
    city_label = str(place.get("city") or "").strip()
    qualified = re.fullmatch(r"(.+?)\\s*\\(([^()]+)\\)", city_label)
    city = qualified.group(1).strip() if qualified else city_label
    municipality = qualified.group(2).strip() if qualified else None
    query = f'{street} {number}{suffix} {city}'
    if municipality:
        query += f' {municipality}'
    candidates = request(query)
    for candidate in candidates:
        if norm(candidate.get("woonplaatsnaam")) != norm(city):
            continue
        if municipality and norm(candidate.get("gemeentenaam")) != norm(municipality):
            continue
        if str(candidate.get("type", "")).lower() != "adres":
            continue
        try:
            found_number = int(candidate.get("huisnummer"))
        except (ValueError, TypeError):
            continue
        if found_number != number:
            continue
        found_street, wanted_street = norm(candidate.get("straatnaam")), norm(street)
        if (found_street != wanted_street and
                difflib.SequenceMatcher(None, found_street, wanted_street).ratio() < .93):
            continue
        # BAG sub-addresses are distinct verblijfsobjecten. A query for
        # number 1 must NOT silently accept 1A, 1B or 1-001.
        # This previously misplaced several cafés on residential units.
        found_suffix = norm(candidate.get("huisletter") or "")
        found_addition = norm(candidate.get("huisnummertoevoeging") or "")
        if found_suffix != norm(suffix) or found_addition:
            continue
        point = extract_point(candidate.get("centroide_ll"))
        if point:
            lat, lon = point
            return {
                "lat": lat, "lon": lon, "method": "PDOK BAG-adres",
                "matched_address": candidate.get("weergavenaam", ""),
            }, "ok"
    return None, "no-exact-PDOK-match"


def main():
    dataset = json.loads(DATA.read_text(encoding="utf-8"))
    updated = 0
    failures = []
    for index, place in enumerate(dataset["places"], 1):
        existing = place.get("geo")
        if isinstance(existing, dict) and existing.get("lat") and existing.get("lon"):
            continue
        if not place.get("address"):
            failures.append({"name": place["name"], "address": "", "reason": "missing-address"})
            continue
        location, reason = geo(place)
        if location:
            place["geo"] = location
            updated += 1
        else:
            failures.append({
                "name": place["name"], "address": place["address"],
                "city": place.get("city"), "reason": reason,
            })
        if index % 20 == 0:
            print(f'{index}/{len(dataset["places"])} checked; geocoded {updated}')
        time.sleep(.3)
    DATA.write_text(json.dumps(dataset, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    count = sum(bool(place.get("geo")) for place in dataset["places"])
    REPORT.write_text(json.dumps({
        "total": len(dataset["places"]), "with_coordinates": count,
        "without_coordinates": len(dataset["places"]) - count,
        "added_in_this_run": updated, "unmatched": failures,
    }, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f'Geocoded {count}/{len(dataset["places"])}; {len(failures)} unmatched.')


if __name__ == "__main__":
    main()
