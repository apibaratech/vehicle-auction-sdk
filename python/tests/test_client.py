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

    @patch("apibara_vehicle_auction.urlopen", return_value=MockResponse())
    def test_latest_endpoints_and_filters(self, open_mock):
        client = ApibaraVehicleAuctionClient("test-secret")
        client.reserve("A/B", include_events=1, limit=10)
        request = open_mock.call_args.args[0]
        self.assertIn("/vehicles/A%2FB/reserve", request.full_url)
        self.assertIn("include_events=1", request.full_url)
        client.changes(after="cursor-1", include_record=True)
        request = open_mock.call_args.args[0]
        self.assertIn("after=cursor-1", request.full_url)
        client.sale_documents(platform="copart")
        self.assertIn("platform=copart", open_mock.call_args.args[0].full_url)
        client.sold_prices(make="BMW")
        self.assertIn("make=BMW", open_mock.call_args.args[0].full_url)
        client.shipping_to_port(lot_number="123")
        self.assertIn("lot_number=123", open_mock.call_args.args[0].full_url)
        client.live_session()
        self.assertEqual(open_mock.call_args.args[0].get_method(), "POST")


if __name__ == "__main__":
    unittest.main()
