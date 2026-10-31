"""Regression tests: PDOK geocodes must match the complete BAG house number."""
import unittest
from unittest.mock import patch

from scripts import geocode


def candidate(number, letter="", addition="", street="Kleinzand"):
    return {
        "type": "adres",
        "woonplaatsnaam": "Sneek",
        "straatnaam": street,
        "huisnummer": number,
        "huisletter": letter,
        "huisnummertoevoeging": addition,
        "centroide_ll": "POINT(5.662485 53.0325694)",
        "weergavenaam": f"{street} {number}{letter}, 8601BE Sneek",
    }


class ExactBagAddressTests(unittest.TestCase):
    def locate(self, address, candidates):
        with patch.object(geocode, "request", return_value=candidates):
            return geocode.geo({"address": address, "city": "Sneek"})

    def test_unverified_venue_address_never_queries_pdok(self):
        with patch.object(geocode, "request") as req:
            location, reason = geocode.geo({
                "name": "Unverified café", "address": "Kleinzand 1",
                "city": "Sneek", "geocode_blocked": True,
            })
        self.assertIsNone(location)
        self.assertEqual(reason, "address-unverified")
        req.assert_not_called()

    def test_range_is_not_silently_mapped_to_first_number(self):
        self.assertIsNone(geocode.addr_parts("Harinxmastrjitte 69-73"))
        self.assertIsNone(geocode.addr_parts("Greate Buorren 4–8"))
        location, reason = self.locate("Kleinzand 1-3", [candidate(1)])
        self.assertIsNone(location)
        self.assertEqual(reason, "no-number-or-unparseable-address")

    def test_numeric_addition_is_not_silently_discarded(self):
        self.assertIsNone(geocode.addr_parts("Kleinzand 1-001"))

    def test_simple_number_and_letter_still_parse(self):
        self.assertEqual(geocode.addr_parts("Kleinzand 4B"), ("Kleinzand", 4, "b"))
        self.assertEqual(geocode.addr_parts("Kleinzand 1"), ("Kleinzand", 1, ""))

    def test_plain_number_skips_a_and_uses_exact_number(self):
        location, reason = self.locate("Kleinzand 1", [
            candidate(1, "A"), candidate(1, ""), candidate(1, "B"),
        ])
        self.assertEqual(reason, "ok")
        self.assertEqual(location["matched_address"], "Kleinzand 1, 8601BE Sneek")

    def test_plain_number_never_accepts_a(self):
        location, reason = self.locate("Kleinzand 1", [candidate(1, "A")])
        self.assertIsNone(location)
        self.assertEqual(reason, "no-exact-PDOK-match")

    def test_plain_number_never_accepts_numeric_addition(self):
        location, reason = self.locate("Kleinzand 1", [candidate(1, addition="001")])
        self.assertIsNone(location)
        self.assertEqual(reason, "no-exact-PDOK-match")

    def test_letter_must_match_exactly(self):
        location, reason = self.locate("Kleinzand 4B", [candidate(4, "a"), candidate(4, "B")])
        self.assertEqual(reason, "ok")
        self.assertEqual(location["matched_address"], "Kleinzand 4B, 8601BE Sneek")

    def test_letter_cannot_be_substituted(self):
        location, reason = self.locate("Kleinzand 4B", [candidate(4, "a")])
        self.assertIsNone(location)
        self.assertEqual(reason, "no-exact-PDOK-match")

    def test_disambiguated_hoorn_requires_correct_municipality(self):
        # Hoorn in Terschelling and Hoorn in Noord-Holland must never mix.
        address = "Dorpsstraat 81"
        place = {"address": address, "city": "Hoorn (Terschelling)"}
        wrong = {
            "type": "adres", "woonplaatsnaam": "Hoorn",
            "gemeentenaam": "Hoorn", "straatnaam": "Dorpsstraat",
            "huisnummer": 81, "huisletter": "", "huisnummertoevoeging": "",
            "centroide_ll": "POINT(5.662485 53.0325694)",
            "weergavenaam": "Dorpsstraat 81, Hoorn",
        }
        correct = dict(wrong, gemeentenaam="Terschelling",
                       weergavenaam="Dorpsstraat 81, Hoorn (Terschelling)")
        with patch.object(geocode, "request", return_value=[wrong, correct]) as req:
            location, reason = geocode.geo(place)
        self.assertEqual(reason, "ok")
        self.assertEqual(location["matched_address"], correct["weergavenaam"])
        self.assertIn("Terschelling", req.call_args.args[0])

    def test_disambiguated_hoorn_does_not_accept_other_municipality(self):
        wrong = {
            "type": "adres", "woonplaatsnaam": "Hoorn",
            "gemeentenaam": "Hoorn", "straatnaam": "Dorpsstraat",
            "huisnummer": 81, "huisletter": "", "huisnummertoevoeging": "",
            "centroide_ll": "POINT(5.662485 53.0325694)",
        }
        with patch.object(geocode, "request", return_value=[wrong]):
            location, reason = geocode.geo({
                "address": "Dorpsstraat 81", "city": "Hoorn (Terschelling)"
            })
        self.assertIsNone(location)
        self.assertEqual(reason, "no-exact-PDOK-match")

    def test_qualified_village_rejects_missing_municipality(self):
        missing = {
            "type": "adres", "woonplaatsnaam": "Hoorn",
            "straatnaam": "Dorpsstraat", "huisnummer": 81,
            "huisletter": "", "huisnummertoevoeging": "",
            "centroide_ll": "POINT(5.662485 53.0325694)",
        }
        with patch.object(geocode, "request", return_value=[missing]):
            location, reason = geocode.geo({
                "address": "Dorpsstraat 81", "city": "Hoorn (Terschelling)"
            })
        self.assertIsNone(location)
        self.assertEqual(reason, "no-exact-PDOK-match")


if __name__ == "__main__":
    unittest.main()
