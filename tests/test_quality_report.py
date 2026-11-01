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
        self.assertEqual(f["with_website_url"], 1)
        self.assertEqual(f["without_website_url"], 1)
        self.assertEqual(f["with_recorded_review_date"], 1)
        self.assertEqual(f["without_recorded_review_date"], 1)
        self.assertEqual(f["with_opening_source_url"], 0)
        self.assertEqual(f["with_closing_source_url"], 0)
        self.assertEqual(f["with_coordinates"], 1)
        self.assertEqual(f["without_coordinates"], 1)
        self.assertEqual(f["with_geocode_blocked"], 0)
        self.assertEqual(f["with_any_exact_opening"], 0)
        self.assertEqual(f["with_any_exact_closing"], 1)
        self.assertEqual(f["without_any_exact_closing"], 1)
        self.assertEqual(f["with_any_explicit_last_entry"], 1)
        self.assertEqual(f["without_explicit_last_entry"], 1)
        self.assertEqual(f["shared_address_group_count"], 1)
        self.assertEqual(f["shared_address_candidates"][0]["venue_ids"], ["a", "b"])

    def test_duplicate_alias_and_date_closure_counts(self):
        dataset = {"regions": [], "places": [
            {"id": "old", "region": "friesland", "city": "Hoorn", "address": "Badweg 1",
             "selection": "Voorlopig",
             "date_closures": [{"start": "2026-11-01", "end": "2026-11-01",
                                "source": "https://example.org", "checked_on": "2026-11-01"}],
             "requires_date_schedule": True,
             "date_schedules": [{"start": "2026-11-01", "end": "2026-11-30",
                                 "source": "https://example.org", "checked_on": "2026-11-01"}]},
            {"id": "new", "region": "friesland", "city": "Hoorn (Terschelling)",
             "address": "Badweg 1", "selection": "Nee", "duplicate_of": "old"},
        ]}
        report = build_report(dataset, "2026-11-01")
        self.assertEqual(report["total"], 2)
        self.assertEqual(report["distinct_recorded_venues"], 1)
        self.assertEqual(report["duplicate_alias_count"], 1)
        self.assertEqual(report["date_closure_venue_count"], 1)
        self.assertEqual(report["date_schedule_venue_count"], 1)
        self.assertEqual(report["requires_date_schedule_count"], 1)
        region = report["regions"][0]
        self.assertEqual(region["distinct_recorded_venues"], 1)
        self.assertEqual(region["duplicate_alias_count"], 1)
        self.assertEqual(region["date_schedule_venue_count"], 1)
        self.assertEqual(region["requires_date_schedule_count"], 1)
        self.assertEqual(region["duplicate_aliases"], [{"id": "new", "duplicate_of": "old"}])
        self.assertEqual(region["settlement_count"], 1)
        self.assertEqual(region["settlement_coverage"][0]["total"], 1)
        self.assertEqual(region["shared_address_group_count"], 0)

    def test_undated_event_schedule_backlog_per_region_and_town(self):
        dataset = {"places": [
            {"id": "event", "region": "friesland", "city": "Formerum",
             "requires_date_schedule": True},
            {"id": "winter", "region": "friesland", "city": "Wyns",
             "requires_date_schedule": True,
             "date_schedules": [{"start": "2026-11-01", "end": "2026-12-18"}]},
            {"id": "ordinary", "region": "utrecht", "city": "Utrecht"},
        ]}
        report = build_report(dataset, "2026-11-01")
        self.assertEqual(report["undated_schedule_required_count"], 1)
        fr = next(r for r in report["regions"] if r["id"] == "friesland")
        self.assertEqual(fr["requires_date_schedule_count"], 2)
        self.assertEqual(fr["date_schedule_venue_count"], 1)
        self.assertEqual(fr["undated_schedule_required_count"], 1)
        by_city = {x["city"]: x for x in fr["settlement_coverage"]}
        self.assertEqual(by_city["Formerum"]["undated_schedule_required_count"], 1)
        self.assertEqual(by_city["Wyns"]["undated_schedule_required_count"], 0)
        self.assertEqual(next(r for r in report["regions"] if r["id"] == "utrecht")["undated_schedule_required_count"], 0)

    def test_gap_metrics_do_not_treat_unverified_data_as_complete(self):
        dataset = {"regions": [], "places": [
            {"id": "a", "region": "r", "city": "X", "address": "Street 1",
             "opening": {"vr": "17:00"}, "closing": {"vr": "?"},
             "geocode_blocked": True, "opening_source": "https://example.org/hours"},
            {"id": "b", "region": "r", "city": "X", "address": "Street 2",
             "closing": {"vr": "01:00"}, "closing_source": "https://example.org/close",
             "geo": {"lat": 53.0, "lon": 6.0}},
        ]}
        r = build_report(dataset, "2026-10-31")["regions"][0]
        self.assertEqual(r["with_any_exact_opening"], 1)
        self.assertEqual(r["with_opening_source_url"], 1)
        self.assertEqual(r["with_closing_source_url"], 1)
        self.assertEqual(r["with_geocode_blocked"], 1)
        self.assertEqual(r["without_coordinates"], 1)
        self.assertEqual(r["without_any_exact_closing"], 1)
        self.assertEqual(r["without_explicit_last_entry"], 2)
        self.assertEqual(r["without_website_url"], 2)
        self.assertEqual(r["without_recorded_review_date"], 2)

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


    def test_settlement_coverage_is_data_driven_and_not_municipal_completeness(self):
        dataset = {"regions": [{"id": "friesland", "name": "Friesland"}], "places": [
            {"id": "a", "region": "friesland", "city": "Sneek", "address": "Markt 1",
             "website": "https://example.org", "website_checked_on": "2026-10-31",
             "closing": {"vr": "02:00"}, "geo": {"lat": 53.0, "lon": 5.7},
             "selection": "Voorlopig"},
            {"id": "b", "region": "friesland", "city": "SNEEK", "address": "Markt 2",
             "selection": "Nog te controleren", "closing": {"vr": "?"}},
            {"id": "c", "region": "friesland", "city": "Dokkum", "address": "Diepswal 5",
             "selection": "Nee", "closing": {"vr": "?"}},
        ]}
        r = build_report(dataset, "2026-10-31")["regions"][0]
        self.assertEqual(r["settlement_count"], 2)
        self.assertEqual([c["city"] for c in r["settlement_coverage"]], ["Dokkum", "Sneek"])
        sneek = r["settlement_coverage"][1]
        self.assertEqual(sneek["total"], 2)
        self.assertEqual(sneek["without_website_url"], 1)
        self.assertEqual(sneek["without_recorded_website_check_date"], 1)
        self.assertEqual(sneek["without_coordinates"], 1)
        self.assertEqual(sneek["needs_selection_review"], 1)
        self.assertEqual(sneek["without_any_exact_closing"], 1)
        self.assertEqual(sneek["without_explicit_last_entry"], 2)
        self.assertEqual(r["settlement_coverage"][0]["needs_selection_review"], 0)


if __name__ == "__main__":
    unittest.main()
