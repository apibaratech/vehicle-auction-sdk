# apibara-vehicle-auction

Python 3.10+ client for the [Apibara.tech Vehicle Auction Data API](https://apibara.tech/en/products/vehicle-auction-data-api/docs). Standard library only at runtime.

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

Methods: `search`, `vehicle`, `history`, `related`, `filters`, `locations`, `shipping`, `usage`. Full response shapes: [OpenAPI](https://apibara.tech/openapi/v1.json).

Keep production API keys on the backend. Data/media licensing is separate from this SDK software license.
