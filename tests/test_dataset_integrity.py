"""Regression checks for the sole master database (no network requests)."""
import json
import re
import unittest
from pathlib import Path

from scripts import geocode

DATA = Path(__file__).resolve().parents[1] / "data" / "venues.json"
DAYS = ("ma", "di", "wo", "do", "vr", "za", "zo")
SPECIAL = {"?", "—", "Event", "Varieert"}
TIME = re.compile(r"^(?:[01][0-9]|2[0-3]):[0-5][0-9]$")
RANGE = re.compile(r"\d+\s*[-–]\s*\d+\b")


class MasterDatasetIntegrityTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.dataset = json.loads(DATA.read_text(encoding="utf-8"))
        cls.places = cls.dataset["places"]

    def test_unique_stable_ids_and_defined_regions(self):
        ids = [p["id"] for p in self.places]
        self.assertEqual(len(ids), len(set(ids)), "Duplicate venue IDs")
        region_ids = {r["id"] for r in self.dataset["regions"]}
        self.assertEqual(len(region_ids), len(self.dataset["regions"]))
        for p in self.places:
            with self.subTest(venue=p["id"]):
                self.assertTrue(p["id"])
                self.assertIn(p["region"], region_ids)
                self.assertTrue(p["name"].strip())

    def test_weekday_fields_are_complete_and_well_formed(self):
        for p in self.places:
            with self.subTest(venue=p["id"]):
                for field in ("closing", "opening"):
                    if field == "opening" and field not in p:
                        continue  # Older records do not all have opening times.
                    self.assertEqual(set(p[field]), set(DAYS), f"{p['id']}: {field}")
                    for day, value in p[field].items():
                        self.assertTrue(
                            value in SPECIAL or bool(TIME.fullmatch(str(value))),
                            f"{p['id']}: {field}.{day} = {value!r}",
                        )

    def test_disputed_addresses_never_have_a_marker(self):
        for p in self.places:
            if p.get("geocode_blocked"):
                with self.subTest(venue=p["id"]):
                    self.assertFalse(p.get("geo"), "Disputed venue entrance has a marker")

    def test_pdok_markers_match_exact_house_number_and_suffix(self):
        # A BAG result like Wed 1-1 is NOT an exact match for venue Wed 1.
        # Exclude GPS/manual beach locations; only compare PDOK BAG addresses.
        for p in self.places:
            geo = p.get("geo") or {}
            if geo.get("method") != "PDOK BAG-adres":
                continue
            if p.get("geo_entrance_verified"):
                continue  # Individually verified entrance may have a different BAG label.
            expected = geocode.addr_parts(p.get("address"))
            if expected is None:
                continue
            actual = geocode.addr_parts(geo.get("matched_address", ""))
            with self.subTest(venue=p["id"]):
                self.assertIsNotNone(actual, "PDOK address contains unverified addition/range")
                self.assertEqual(expected[1:], actual[1:], "PDOK house number/suffix differs")

    def test_geocodes_are_coordinates_not_assumptions_about_ranges(self):
        for p in self.places:
            geo = p.get("geo")
            if not geo:
                continue
            with self.subTest(venue=p["id"]):
                self.assertIsInstance(geo, dict)
                self.assertTrue(50 < geo["lat"] < 54)
                self.assertTrue(3 < geo["lon"] < 8)
                if RANGE.search(p.get("address", "")):
                    self.assertTrue(
                        p.get("geo_entrance_verified") is True,
                        f"{p['id']}: a number range needs a separately verified entrance",
                    )


if __name__ == "__main__":
    unittest.main()
