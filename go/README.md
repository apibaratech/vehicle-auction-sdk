# Apibara Go SDK

Go module: `github.com/apibaratech/vehicle-auction-sdk/go`.

```go
client := apibara.New(os.Getenv("APIBARA_API_KEY"))
response, err := client.Vehicles(context.Background(), url.Values{"platform": {"copart"}})
```

Returns raw JSON to preserve API fields as the schema evolves. Versioned Go module tags need the `go/` prefix.
