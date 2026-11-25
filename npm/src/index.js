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
  history(identifier) {
    return this.get(`/vehicles/${encodeURIComponent(identifier)}/history`);
  }
  related(identifier, query = {}) {
    return this.get(`/vehicles/${encodeURIComponent(identifier)}/related`, query);
  }
  filters(query = {}) { return this.get("/vehicles/filters", query); }
  locations(query = {}) { return this.get("/locations", query); }
  shipping(identifier, query = {}) {
    return this.get(`/vehicles/${encodeURIComponent(identifier)}/shipping`, query);
  }
  usage() { return this.get("/usage"); }

  async get(path, query = {}) {
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
