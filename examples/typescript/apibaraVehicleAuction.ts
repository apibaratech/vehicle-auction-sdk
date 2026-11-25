export type QueryValue = string | number | boolean | null | undefined;
export type Query = Record<string, QueryValue | QueryValue[]>;

export class ApibaraVehicleAuctionClient {
  constructor(
    private readonly apiKey: string,
    private readonly baseUrl = "https://apibara.tech/api/v1/vehicle-auction",
  ) {}

  search(query: Query = {}) { return this.get("/vehicles", query); }
  vehicle(slugVin: string) { return this.get(`/vehicles/${encodeURIComponent(slugVin)}`); }
  history(slugVin: string) { return this.get(`/vehicles/${encodeURIComponent(slugVin)}/history`); }
  related(slugVin: string, query: Query = {}) { return this.get(`/vehicles/${encodeURIComponent(slugVin)}/related`, query); }
  filters(query: Query = {}) { return this.get("/vehicles/filters", query); }
  locations(query: Query = {}) { return this.get("/locations", query); }
  shipping(slugVin: string, query: Query = {}) { return this.get(`/vehicles/${encodeURIComponent(slugVin)}/shipping`, query); }
  usage() { return this.get("/usage"); }

  private async get(path: string, query: Query = {}): Promise<unknown> {
    const url = new URL(this.baseUrl.replace(/\/$/, "") + path);
    for (const [key, rawValue] of Object.entries(query)) {
      const values = Array.isArray(rawValue) ? rawValue : [rawValue];
      for (const value of values) {
        if (value !== null && value !== undefined) url.searchParams.append(key, String(value));
      }
    }

    const response = await fetch(url, {
      headers: { Accept: "application/json", "X-API-Key": this.apiKey },
    });

    const payload = await response.json().catch(() => null);
    if (!response.ok) {
      const message = payload && typeof payload === "object" && "message" in payload
        ? String((payload as { message: unknown }).message)
        : `HTTP ${response.status}`;
      throw new Error(`Apibara ${message}`);
    }

    return payload;
  }
}
