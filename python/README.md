# apibara-vehicle-auction

Python 3.10+ client for the [Apibara.tech Vehicle Auction Data API](https://apibara.tech/en/products/vehicle-auction-data-api/docs). Standard library only at runtime.

**Release status:** source package prepared; PyPI publishing is pending Trusted Publisher setup. Once published, install with:

```bash
pip install apibara-vehicle-auction
```

```python
import os
from apibara_vehicle_auction import ApibaraVehicleAuctionClient

api = ApibaraVehicleAuctionClient(os.environ["APIBARA_API_KEY"])
vehicles = api.search(platform="iaai", year_from=2018)
print(vehicles)
```

Methods: `search`, `vehicle`, `history`, `related`, `reserve`, `filters`, `locations`, `shipping`, `shipping_to_port`, `url_to_details`, `sold_prices`, `sale_documents`, `changes`, `live_session`, `usage`. `live_session` creates a short-lived session for eligible accounts; it does not open the WebSocket. Full response shapes: [OpenAPI](https://apibara.tech/openapi/v1.json).

Keep production API keys on the backend. Data/media licensing is separate from this SDK software license.
