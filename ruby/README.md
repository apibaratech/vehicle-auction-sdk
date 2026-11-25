# Apibara Ruby SDK

Gem: `apibara-vehicle-auction`. Publish to RubyGems after account authorization.

```ruby
require 'apibara_vehicle_auction'
client = ApibaraVehicleAuction::Client.new(ENV.fetch('APIBARA_API_KEY'))
p client.vehicles(platform: 'copart')
```
