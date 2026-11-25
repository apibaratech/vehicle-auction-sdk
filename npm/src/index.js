export class ApibaraVehicleAuctionClient {
  constructor(apiKey, baseUrl = "https://apibara.tech/api/v1/vehicle-auction") {
    if (!apiKey) throw new Error("APIBARA API key is required");
    this.apiKey = apiKey;
    this.baseUrl = baseUrl.replace(/\/$/, "");
  }

  search(query = {}) { return this.get("/vehicles", query); }
  vehicle(identifier, query = {}) {
    return this.get(`/vehicles/${encodeURIComponent(identifier)}`, query);
  }
  history(identifier, query = {}) {
    return this.get(`/vehicles/${encodeURIComponent(identifier)}/history`, query);
  }
  related(identifier, query = {}) {
    return this.get(`/vehicles/${encodeURIComponent(identifier)}/related`, query);
  }
  filters(query = {}) { return this.get("/vehicles/filters", query); }
  locations(query = {}) { return this.get("/locations", query); }
  shipping(identifier, query = {}) {
    return this.get(`/vehicles/${encodeURIComponent(identifier)}/shipping`, query);
  }
  reserve(identifier, query = {}) {
    return this.get(`/vehicles/${encodeURIComponent(identifier)}/reserve`, query);
  }
  changes(query = {}) { return this.get("/changes", query); }
  saleDocuments(query = {}) { return this.get("/sale-documents", query); }
  soldPrices(query = {}) { return this.get("/market/sold-prices", query); }
  shippingToPort(query = {}) { return this.get("/shipping/auction-to-port", query); }
  urlToDetails(query = {}) { return this.get("/vehicles/urltodetails", query); }
  liveSession() { return this.request("POST", "/live/v1/session"); }
  usage() { return this.get("/usage"); }

  get(path, query = {}) { return this.request("GET", path, query); }

  async request(method, path, query = {}) {
    if (!path.startsWith("/") || path.startsWith("//")) throw new Error("Invalid API path");
    const url = new URL(this.baseUrl + path);
    for (const [key, raw] of Object.entries(query)) {
      const values = Array.isArray(raw) ? raw : [raw];
      for (const value of values) {
        if (value !== null && value !== undefined && value !== "") {
          url.searchParams.append(key, String(value));
        }
      }
    }

    const response = await fetch(url, {
      method,
      headers: {
        Accept: "application/json",
        "X-API-Key": this.apiKey,
      },
    });

    const payload = await response.json().catch(() => null);
    if (!response.ok) {
      const message = payload?.message ?? payload?.error ?? `HTTP ${response.status}`;
      throw new Error(`Apibara: ${message}`);
    }
    return payload;
  }
}

export default ApibaraVehicleAuctionClient;
