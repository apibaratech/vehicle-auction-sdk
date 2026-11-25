import test from "node:test";
import assert from "node:assert/strict";
import { ApibaraVehicleAuctionClient } from "../src/index.js";

test("requires an API key", () => {
  assert.throws(() => new ApibaraVehicleAuctionClient(""), /key is required/);
});

test("sends API key and preserves repeated query parameters", async (t) => {
  const previous = globalThis.fetch;
  let request;
  globalThis.fetch = async (url, options) => {
    request = { url: new URL(url), options };
    return { ok: true, json: async () => ({ data: [] }) };
  };
  t.after(() => { globalThis.fetch = previous; });
  const api = new ApibaraVehicleAuctionClient("test-secret");
  await api.search({ platform: ["copart", "iaai"], page: 2, empty: null });
  assert.deepEqual(request.url.searchParams.getAll("platform"), ["copart", "iaai"]);
  assert.equal(request.url.searchParams.get("page"), "2");
  assert.equal(request.url.searchParams.has("empty"), false);
  assert.equal(request.options.headers["X-API-Key"], "test-secret");
});

test("escapes VIN identifiers and exposes shipping", async (t) => {
  const previous = globalThis.fetch;
  let pathname;
  globalThis.fetch = async (url) => {
    pathname = new URL(url).pathname;
    return { ok: true, json: async () => ({}) };
  };
  t.after(() => { globalThis.fetch = previous; });
  const api = new ApibaraVehicleAuctionClient("test-secret");
  await api.shipping("A/B");
  assert.equal(pathname, "/api/v1/vehicle-auction/vehicles/A%2FB/shipping");
});

test("reports HTTP failures", async (t) => {
  const previous = globalThis.fetch;
  globalThis.fetch = async () => ({ ok: false, status: 429, json: async () => ({ message: "Quota exceeded" }) });
  t.after(() => { globalThis.fetch = previous; });
  await assert.rejects(new ApibaraVehicleAuctionClient("test-secret").usage(), /Quota exceeded/);
});
