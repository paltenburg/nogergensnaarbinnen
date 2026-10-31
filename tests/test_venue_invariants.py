"""Regression checks for the single JSON master; no network or mutations."""
import json
import re
import unittest
from pathlib import Path

MASTER = Path(__file__).resolve().parents[1] / "data" / "venues.json"
DAYS = {"ma", "di", "wo", "do", "vr", "za", "zo"}
TIME = re.compile(r"^(?:[01][0-9]|2[0-3]):[0-5][0-9]$")


class VenueInvariantsTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.places = json.loads(MASTER.read_text(encoding="utf-8"))["places"]

    def test_stable_ids_unique_and_regions_present(self):
        ids = [p["id"] for p in self.places]
        self.assertEqual(len(ids), len(set(ids)))
        self.assertTrue(all(p.get("region") for p in self.places))

    def test_known_closed_days_are_consistent(self):
        """An explicit closed opening day cannot have an unknown closing label."""
        for place in self.places:
            opening = place.get("opening") or {}
            closing = place.get("closing") or {}
            for day in DAYS:
                if opening.get(day) == "—":
                    with self.subTest(venue=place["id"], day=day):
                        self.assertEqual(closing.get(day), "—")

    def test_weekly_fields_are_complete_and_well_formed(self):
        for place in self.places:
            for field in ("opening", "closing", "last_entry"):
                if field not in place:
                    continue
                values = place[field]
                with self.subTest(venue=place["id"], field=field):
                    self.assertEqual(set(values), DAYS)
                for day, value in values.items():
                    with self.subTest(venue=place["id"], field=field, day=day):
                        self.assertTrue(
                            value in ("?", "—", "Event", "Varieert")
                            or bool(TIME.fullmatch(str(value))),
                            f"Invalid {field} time {value!r}",
                        )


if __name__ == "__main__":
    unittest.main()
