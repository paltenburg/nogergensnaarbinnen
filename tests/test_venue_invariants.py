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

    def test_no_duplicate_visible_venue_and_aliases_are_hidden(self):
        """One physical venue must not appear twice under different city spellings."""
        def normalize(value):
            return re.sub(r"[^a-z0-9]", "", str(value or "").casefold())

        by_id = {place["id"]: place for place in self.places}
        active_keys = {}
        for place in self.places:
            canonical_id = place.get("duplicate_of")
            if canonical_id:
                with self.subTest(alias=place["id"]):
                    self.assertIn(canonical_id, by_id)
                    self.assertNotEqual(canonical_id, place["id"])
                    self.assertEqual(place.get("selection"), "Nee")
                    canonical = by_id[canonical_id]
                    self.assertEqual(place.get("region"), canonical.get("region"))
                    self.assertEqual(normalize(place.get("address")), normalize(canonical.get("address")))
                continue
            if place.get("selection") in ("Nee", "Nog te controleren"):
                continue
            # Name + street address is deliberately used instead of city:
            # "Hoorn" and "Hoorn (Terschelling)" refer to the same place.
            key = (place.get("region"), normalize(place.get("name")), normalize(place.get("address")))
            with self.subTest(venue=place["id"]):
                self.assertNotIn(key, active_keys, f"Also listed as {active_keys.get(key)}")
            active_keys[key] = place["id"]

    def test_date_closures_are_sourced_and_valid(self):
        """Date exceptions exclude only explicitly documented inclusive ranges."""
        from datetime import date

        for place in self.places:
            ranges = place.get("date_closures", [])
            if not ranges:
                continue
            self.assertIsInstance(ranges, list)
            for item in ranges:
                with self.subTest(venue=place["id"], interval=item):
                    start = date.fromisoformat(item["start"])
                    end = date.fromisoformat(item["end"])
                    self.assertLessEqual(start, end)
                    self.assertTrue(item.get("source", "").startswith("https://"))
                    date.fromisoformat(item["checked_on"])

    def test_seasonal_schedules_have_unambiguous_sourced_days(self):
        from datetime import date

        for place in self.places:
            intervals = []
            for item in place.get("date_schedules", []):
                with self.subTest(venue=place["id"], schedule=item):
                    start = date.fromisoformat(item["start"])
                    end = date.fromisoformat(item["end"])
                    self.assertLessEqual(start, end)
                    self.assertTrue(item.get("source", "").startswith("https://"))
                    date.fromisoformat(item["checked_on"])
                    for field in ("opening", "closing"):
                        values = item[field]
                        self.assertEqual(set(values), DAYS)
                        for value in values.values():
                            self.assertTrue(
                                value in ("?", "—", "Event", "Varieert")
                                or bool(TIME.fullmatch(str(value)))
                            )
                    intervals.append((start, end))
            intervals.sort()
            for earlier, later in zip(intervals, intervals[1:]):
                self.assertLess(earlier[1], later[0], place["id"])
            if place.get("requires_date_schedule"):
                self.assertTrue(intervals, place["id"])

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
