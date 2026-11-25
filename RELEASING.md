# Releasing the Apibara SDKs

The npm package `@apibara.tech/vehicle-auction-api` is owned by the npm organization `apibara.tech`. Its first release `0.1.0` was published manually, and release `0.1.1` was staged successfully via GitHub Actions with OIDC on 2026-11-25.

## npm: staged publishing (currently enabled)

1. Bump `npm/package.json` to a new version.
2. Run the **Publish npm** workflow manually in GitHub Actions, entering `stage-npm` as the confirmation.
3. GitHub Actions tests and stages the new package through npm Trusted Publishing without a token.
4. A package maintainer signs in to [npmjs.com](https://www.npmjs.com/) and chooses **Staged Packages** -> review -> **Approve**. This requires 2FA. Alternatively, on a locally authenticated npm CLI 11.15+, use `npm stage list @apibara.tech/vehicle-auction-api` and `npm stage approve <stage-id>`.

The staged `0.1.1` release ID is `8d9d0f4f-d992-48c4-ba68-a8933da04632`, awaiting approval as of 2026-11-25. Don't re-stage the same version or bump it until you approve or reject the pending stage.

The existing npm Trusted Publisher **permits stage publishing but did not permit direct `npm publish`** (GitHub run 45603022702 returned `E403 OIDC permission denied for this action`). To enable automatic publication, the npm package owner must configure the Trusted Publisher for GitHub repository `apibaratech/vehicle-auction-sdk` and workflow `publish-npm.yml` with **Allow npm publish** permission, replacing the existing connection if npm requires it. Do not change the repository or workflow name without updating npm's trusted publisher configuration. After that, update the workflow command to `npm publish --access public`.

## PyPI: first release pending

1. Create or use a verified PyPI account and check availability of `apibara-vehicle-auction`.
2. In PyPI, configure a Pending Trusted Publisher: owner `apibaratech`, repository `vehicle-auction-sdk`, workflow `publish-pypi.yml`, and environment `pypi-release`.
3. Ensure the matching GitHub environment and approval rules are set up; then run the workflow after reviewing the package version.

## Security

Never commit npm/PyPI access tokens or API keys. GitHub-hosted workflows use OIDC `id-token: write`. Keep releases manually triggered and review staged builds before approving. The SDK MIT license does not sublicense auction source data, images, or trademarks.
