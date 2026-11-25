"""Dependency-free starter client for the Apibara Vehicle Auction Data API."""

from __future__ import annotations

import json
from urllib.parse import urlencode, quote
from urllib.request import Request, urlopen
from urllib.error import HTTPError


class ApibaraVehicleAuctionClient:
    def __init__(self, api_key: str, base_url: str = "https://apibara.tech/api/v1/vehicle-auction"):
        self.api_key = api_key
        self.base_url = base_url.rstrip("/")

    def search(self, **query):
        return self._get("/vehicles", query)

    def vehicle(self, slug_vin: str):
        return self._get(f"/vehicles/{quote(slug_vin, safe='')}")

    def history(self, slug_vin: str):
        return self._get(f"/vehicles/{quote(slug_vin, safe='')}/history")

    def related(self, slug_vin: str, **query):
        return self._get(f"/vehicles/{quote(slug_vin, safe='')}/related", query)

    def filters(self, **query):
        return self._get("/vehicles/filters", query)

    def locations(self, **query):
        return self._get("/locations", query)

    def shipping(self, slug_vin: str, **query):
        return self._get(f"/vehicles/{quote(slug_vin, safe='')}/shipping", query)

    def usage(self):
        return self._get("/usage")

    def _get(self, path: str, query: dict | None = None):
        query = {k: v for k, v in (query or {}).items() if v is not None}
        url = self.base_url + path
        if query:
            url += "?" + urlencode(query, doseq=True)

        request = Request(
            url,
            headers={"Accept": "application/json", "X-API-Key": self.api_key},
            method="GET",
        )

        try:
            with urlopen(request, timeout=30) as response:
                return json.loads(response.read().decode("utf-8"))
        except HTTPError as exc:
            body = exc.read().decode("utf-8", errors="replace")
            try:
                payload = json.loads(body)
            except json.JSONDecodeError:
                payload = {"message": body}
            raise RuntimeError(f"Apibara HTTP {exc.code}: {payload.get('message', payload)}") from exc

__all__ = ["ApibaraVehicleAuctionClient"]
