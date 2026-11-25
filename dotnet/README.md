# Apibara .NET SDK

NuGet ID: `Apibara.VehicleAuction` (not yet registered). Build with `dotnet pack -c Release`.

```csharp
using var client = new Apibara.VehicleAuction.Client(Environment.GetEnvironmentVariable("APIBARA_API_KEY")!);
using var lots = await client.VehiclesAsync();
```
