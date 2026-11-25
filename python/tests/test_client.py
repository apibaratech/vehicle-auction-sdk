import json
import unittest
from unittest.mock import patch
from apibara_vehicle_auction import ApibaraVehicleAuctionClient


class MockResponse:
    def __enter__(self):
        return self

    def __exit__(self, *args):
        pass

    def read(self):
        return json.dumps({"data": []}).encode()


class ClientTests(unittest.TestCase):
    @patch("apibara_vehicle_auction.urlopen", return_value=MockResponse())
    def test_query_and_auth(self, open_mock):
        client = ApibaraVehicleAuctionClient("test-secret")
        client.search(platform=["copart", "iaai"], year_from=2018)
        request = open_mock.call_args.args[0]
        self.assertIn("platform=copart", request.full_url)
        self.assertIn("platform=iaai", request.full_url)
        self.assertIn("year_from=2018", request.full_url)
        self.assertEqual(request.get_header("X-api-key"), "test-secret")

    @patch("apibara_vehicle_auction.urlopen", return_value=MockResponse())
    def test_vin_escape_and_history(self, open_mock):
        ApibaraVehicleAuctionClient("test-secret").history("A/B")
        request = open_mock.call_args.args[0]
        self.assertIn("/vehicles/A%2FB/history", request.full_url)


if __name__ == "__main__":
    unittest.main()
