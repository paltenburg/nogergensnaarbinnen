"""Regression guards for the sole authoritative venue database.

These checks intentionally do not infer opening hours, public access or BAG
coordinates from incomplete evidence.
"""
import json
import unittest
from pathlib import Path

MASTER = Path(__file__).resolve().parents[1] / "data" / "venues.json"


class MasterIntegrityTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.db = json.loads(MASTER.read_text(encoding="utf-8"))
        cls.places = cls.db["places"]
        cls.regions = {r["id"] for r in cls.db["regions"]}

    def test_ids_are_unique_and_nonempty(self):
        ids = [p.get("id") for p in self.places]
        self.assertTrue(all(isinstance(i, str) and i.strip() for i in ids))
        self.assertEqual(len(ids), len(set(ids)))

    def test_every_place_has_a_declared_region(self):
        for place in self.places:
            with self.subTest(id=place["id"]):
                self.assertIn(place.get("region"), self.regions)

    def test_no_legacy_hours_shadow_canonical_hours(self):
        for place in self.places:
            with self.subTest(id=place["id"]):
                self.assertNotIn("open", place)
                self.assertNotIn("close", place)
                self.assertIsInstance(place.get("opening"), dict)
                self.assertIsInstance(place.get("closing"), dict)
                for key in ("opening", "closing"):
                    self.assertEqual(
                        set(place[key]), {"ma", "di", "wo", "do", "vr", "za", "zo"}
                    )

    def test_blocked_geocodes_have_no_marker(self):
        for place in self.places:
            if place.get("geocode_blocked"):
                with self.subTest(id=place["id"]):
                    self.assertFalse(
                        place.get("geo"),
                        "Ambiguous BAG unit must not be displayed as an exact marker",
                    )


if __name__ == "__main__":
    unittest.main()
