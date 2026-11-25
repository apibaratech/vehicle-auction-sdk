# Releasing the SDKs

Versions are managed separately in `npm/package.json` and `python/pyproject.toml`; bump both and add changelog notes before a new release.

## npm — required first release

1. Confirm ownership of npm organization `apibara.tech` and scope `@apibara.tech`.
2. From a trusted local machine, run `cd npm && npm login && npm publish --access public` once. The owner must complete npm two-factor authentication / passkey requirements. **Do not send npm tokens or passwords in chat.** npm packages do not yet exist until this initial publication succeeds.
3. Then open the npm package's settings > Trusted Publisher and register the GitHub Actions publisher: GitHub owner `apibaratech`, repository `vehicle-auction-sdk`, workflow file `publish-npm.yml`. Explicitly permit publishing, not just staging, if the UI asks for allowed actions.
4. Run the GitHub Actions release workflow only after the trust relationship is confirmed. Avoid duplicate release for the same version.

## PyPI

1. Create or use a verified PyPI account and check that `apibara-vehicle-auction` is available.
2. Under PyPI trusted publishers (pending publisher is supported for a new project), configure owner `apibaratech`, repository `vehicle-auction-sdk`, workflow `publish-pypi.yml`.
3. Run the publish workflow manually with explicit confirmation.

`publish-npm.yml` and `publish-pypi.yml` require the GitHub Actions `id-token: write` permission and use OIDC (no permanent registry token).

Do not publish directly from the production API server or add npm/PyPI credentials to the repository.
