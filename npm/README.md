# @apibara.tech/vehicle-auction-api

JavaScript / TypeScript client for the [Apibara.tech Vehicle Auction Data API](https://apibara.tech/en/products/vehicle-auction-data-api/docs).

## Install

```bash
npm install @apibara.tech/vehicle-auction-api
```

## Usage (Node.js 18+)

```js
import { ApibaraVehicleAuctionClient } from "@apibara.tech/vehicle-auction-api";

const api = new ApibaraVehicleAuctionClient(process.env.APIBARA_API_KEY);
const listings = await api.search({ platform: "copart", year_from: 2020 });
console.log(listings);
```

Methods: `search`, `vehicle`, `history`, `related`, `filters`, `locations`, `shipping`, `usage`. All return the JSON body as returned by the API; response schemas are documented in [OpenAPI](https://apibara.tech/openapi/v1.json).

Keep API keys on the server. Auction photos and data are subject to their own applicable rights and conditions.
