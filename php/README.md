# Apibara PHP SDK

Composer package: `apibara/vehicle-auction-api` (publish to Packagist after tests and ownership verification).

```php
$client = new \Apibara\VehicleAuction\Client(getenv('APIBARA_API_KEY'));
$lots = $client->vehicles(['platform' => 'copart']);
```

Requires PHP 8.1+, cURL. Avoid exposing API keys in browser code.
