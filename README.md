# Apibara.tech — Vehicle Auction API SDKs

Official client SDK repository for the [Apibara.tech Vehicle Auction Data API](https://apibara.tech/en/products/vehicle-auction-data-api/docs). Read-only Copart and IAAI auction records.

| Language | Folder | Package |
|---|---|---|
| JavaScript / TypeScript | [npm/](npm/) | `@apibara.tech/vehicle-auction-api` |
| Python | [python/](python/) | `apibara-vehicle-auction` |
| PHP, Go, Ruby, cURL, TypeScript starter | [examples/](examples/) | Source examples |

The source-of-truth API contract is [OpenAPI](https://apibara.tech/openapi/v1.json). These are small, dependency-light clients. API keys belong on a private backend (never embed them in a public webpage).

## Development

```bash
cd npm && npm test && npm pack --dry-run
cd ../python && python -m unittest discover -s tests
```

## Publishing

CI tests run on pushes and pull requests. Registry publishing is a separate manual release workflow with OIDC / trusted publishers, configured per registry. **Do not run the release workflow until both registries have authorized the exact GitHub workflow identity.** npm `0.1.0` was published manually; subsequent releases use manual staged publishing with two-factor approval until direct publish permission is enabled.

See [RELEASING.md](RELEASING.md) for first-release setup. No API key is needed to build or test these SDKs.
