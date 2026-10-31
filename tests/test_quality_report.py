"""Pure quality report checks; no network or database mutation."""
import unittest
from scripts.build_quality_report import build_report


class QualityReportTests(unittest.TestCase):
    def test_counts_and_new_regions_are_data_driven(self):
        dataset = {"regions": [{"id": "friesland", "name": "Friesland"},
                               {"id": "utrecht", "name": "Utrecht"}], "places": [
            {"id": "a", "region": "friesland", "city": "Sneek", "address": "Markt 1",
             "website": "https://example.org", "checked_on": "2026-10-31", "selection": "Voorlopig",
             "closing": {"vr": "02:00"}, "last_entry": {"vr": "01:30"},
             "geo": {"lat": 53.0, "lon": 5.7}},
            {"id": "b", "region": "friesland", "city": "Sneek", "address": "Markt 1",
             "selection": "Nog te controleren", "closing": {"vr": "?"}},
            {"id": "c", "region": "new-region", "city": "Example", "address": "Main 2",
             "selection": "Voorlopig", "closing": {"vr": "Varieert"}},
        ]}
        report = build_report(dataset, "2026-10-31")
        self.assertEqual(report["total"], 3)
        self.assertEqual([r["id"] for r in report["regions"]], ["friesland", "new-region"])
        f = report["regions"][0]
        self.assertEqual(f["with_official_website"], 1)
        self.assertEqual(f["with_recorded_review_date"], 1)
        self.assertEqual(f["with_coordinates"], 1)
        self.assertEqual(f["with_any_exact_closing"], 1)
        self.assertEqual(f["with_any_explicit_last_entry"], 1)
        self.assertEqual(f["shared_address_group_count"], 1)
        self.assertEqual(f["shared_address_candidates"][0]["venue_ids"], ["a", "b"])

    def test_unknown_or_nonexact_times_not_counted(self):
        dataset = {"regions": [], "places": [{"id": "x", "region": "r", "city": "A",
                    "address": "B 1", "closing": {"vr": "24:00"},
                    "last_entry": {"vr": "Event"}}]}
        r = build_report(dataset, "2026-10-31")["regions"][0]
        self.assertEqual(r["with_any_exact_closing"], 0)
        self.assertEqual(r["with_any_explicit_last_entry"], 0)
        self.assertEqual(r["shared_address_group_count"], 0)

    def test_shared_address_normalization_not_false_duplicate_deletion(self):
        dataset = {"places": [
            {"id": "a", "region": "r", "city": "Leeuwarden", "address": "Kerkstraat 1-A"},
            {"id": "b", "region": "r", "city": "Leeuwarden", "address": "Kerkstraat 1A"},
        ]}
        r = build_report(dataset, "2026-10-31")["regions"][0]
        self.assertEqual(r["total"], 2)
        self.assertEqual(r["shared_address_group_count"], 0)


if __name__ == "__main__":
    unittest.main()
