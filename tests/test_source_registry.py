"""Date-source provenance must be explicit and never invented."""
import unittest
from scripts.build_source_registry import dated_sources


class DatedSourceTests(unittest.TestCase):
    def test_sources_preserve_role_and_actual_check_date(self):
        venue = {
            "date_closures": [
                {"start": "2026-11-01", "end": "2026-11-01",
                 "source": "https://example.org/closed", "checked_on": "2026-11-01"}],
            "date_schedules": [
                {"start": "2026-11-01", "end": "2027-03-31",
                 "source": "https://example.org/hours", "checked_on": "2026-11-01"}],
            "seasonal_hours_evidence": [
                {"source": "https://example.org/archive"}],
        }
        self.assertEqual(list(dated_sources(venue)), [
            ("https://example.org/closed", "datumsluiting", "2026-11-01"),
            ("https://example.org/hours", "seizoensrooster", "2026-11-01"),
            ("https://example.org/archive", "seizoensbron", None),
        ])

    def test_no_fake_check_date_for_missing_or_invalid_sources(self):
        self.assertEqual(list(dated_sources({})), [])
        self.assertEqual(list(dated_sources({"date_closures": [
            {"source": "not-a-url", "checked_on": "2026-11-01"}, None,
        ]})), [])


if __name__ == "__main__":
    unittest.main()
