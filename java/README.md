# Apibara Java SDK

Maven coordinates: `tech.apibara:vehicle-auction-api:0.1.0` (publication pending). Java 11+.

```java
Client api = new Client(System.getenv("APIBARA_API_KEY"));
String data = api.vehicles(Map.of("platform", "copart"));
```
