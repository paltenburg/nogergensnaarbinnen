#!/usr/bin/env python3
"""Offline regression tests for the read-only PDOK address audit."""
import io
import json
import sys
import unittest
from pathlib import Path
from unittest.mock import patch
from urllib.error import URLError

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "scripts"))
import audit_pdok_single_addresses as audit


def document(**overrides):
    d = {
        "type": "adres", "woonplaatsnaam": "Grou",
        "gemeentenaam": "Leeuwarden", "straatnaam": "Halbertsmaplein",
        "huisnummer": 14, "huisletter": "", "huisnummertoevoeging": "",
        "centroide_ll": "POINT(5.837 53.094)",
        "nummeraanduiding_id": "test-id", "weergavenaam": "Halbertsmaplein 14",
    }
    d.update(overrides)
    return d


PLACE = {"address": "Halbertsmaplein 14", "city": "Grou (Leeuwarden)"}


class FakeResponse:
    def __init__(self, payload):
        self.stream = io.BytesIO(json.dumps(payload).encode())

    def __enter__(self):
        return self.stream

    def __exit__(self, *args):
        return False


class PdokAuditTests(unittest.TestCase):
    def test_valid_unique_candidate_not_entrance_verified(self):
        with patch.object(audit, "fetch_candidates", return_value=([document()], 1)):
            result = audit.inspect(PLACE)
        self.assertEqual(result["status"], "bag-address-candidate-not-entrance-verified")
        self.assertEqual(len(result["exact_candidates"]), 1)

    def test_network_failure_not_empty_result(self):
        with patch.object(audit, "fetch_candidates", side_effect=URLError("offline")):
            self.assertEqual(audit.inspect(PLACE)["status"], "pdok-request-failed")

    def test_truncation_not_unique(self):
        with patch.object(audit, "fetch_candidates", return_value=([document()], 101)):
            self.assertEqual(audit.inspect(PLACE)["status"], "pdok-results-truncated")

    def test_wrong_municipality_rejected(self):
        with patch.object(audit, "fetch_candidates", return_value=([document(gemeentenaam="Andere")], 1)):
            self.assertEqual(audit.inspect(PLACE)["status"], "unresolved")

    def test_wrong_house_letter_rejected(self):
        with patch.object(audit, "fetch_candidates", return_value=([document(huisletter="A")], 1)):
            self.assertEqual(audit.inspect(PLACE)["status"], "unresolved")

    def test_house_number_range_rejected_without_request(self):
        with patch.object(audit, "fetch_candidates") as request:
            self.assertEqual(audit.inspect({"address": "Straat 14-16", "city": "Grou"})["status"], "unparseable-address")
            request.assert_not_called()

    def test_fetch_candidates_uses_total_hits(self):
        with patch.object(audit, "urlopen", return_value=FakeResponse({
            "response": {"docs": [document()], "numFound": 101}
        })):
            docs, total = audit.fetch_candidates("Halbertsmaplein 14 Grou")
        self.assertEqual((len(docs), total), (1, 101))

    def test_invalid_response_rejected(self):
        with patch.object(audit, "urlopen", return_value=FakeResponse({
            "response": {"docs": [], "numFound": -1}
        })):
            with self.assertRaises(ValueError):
                audit.fetch_candidates("test")


if __name__ == "__main__":
    unittest.main()
