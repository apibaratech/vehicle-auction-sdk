#!/usr/bin/env sh
set -eu

: "${APIBARA_API_KEY:?Set APIBARA_API_KEY first}"

BASE_URL="https://apibara.tech/api/v1/vehicle-auction"

curl --fail-with-body --silent --show-error --get \
  "$BASE_URL/vehicles" \
  --header "Accept: application/json" \
  --header "X-API-Key: $APIBARA_API_KEY" \
  --data-urlencode "platform=copart" \
  --data-urlencode "lot_sub_status=Open" \
  --data-urlencode "updated_within_minutes=15" \
  --data-urlencode "per_page=20"
