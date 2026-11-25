using System.Net.Http.Headers;
using System.Text.Json;
namespace Apibara.VehicleAuction;
public sealed class Client : IDisposable {
    private readonly HttpClient http;
    private readonly bool own;
    public Client(string apiKey, HttpClient? client = null, string baseUrl = "https://apibara.tech/api/v1/vehicle-auction") {
        if (string.IsNullOrWhiteSpace(apiKey)) throw new ArgumentException("API key required");
        own = client is null; http = client ?? new HttpClient {Timeout=TimeSpan.FromSeconds(30)};
        BaseUrl = baseUrl.TrimEnd('/'); ApiKey=apiKey;
    }
    public string ApiKey {get;}
    public string BaseUrl {get;}
    public async Task<JsonDocument> GetAsync(string path, IDictionary<string,string?>? query=null, CancellationToken cancellationToken=default) {
        if (!path.StartsWith('/') || path.StartsWith("//")) throw new ArgumentException("Invalid path");
        var parameters = query?.Where(x=>x.Value is not null).Select(x=>Uri.EscapeDataString(x.Key)+"="+Uri.EscapeDataString(x.Value!));
        var url = BaseUrl + path + (parameters is not null && parameters.Any() ? "?"+string.Join("&",parameters) : "");
        using var request = new HttpRequestMessage(HttpMethod.Get,url);
        request.Headers.Add("X-API-Key",ApiKey);
        request.Headers.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
        using var response = await http.SendAsync(request,cancellationToken);
        var text = await response.Content.ReadAsStringAsync(cancellationToken);
        if (!response.IsSuccessStatusCode) throw new HttpRequestException($"Apibara HTTP {(int)response.StatusCode}: {text}");
        return JsonDocument.Parse(text);
    }
    public Task<JsonDocument> VehiclesAsync(IDictionary<string,string?>? query=null,CancellationToken ct=default)=>GetAsync("/vehicles",query,ct);
    public Task<JsonDocument> VehicleAsync(string id,CancellationToken ct=default)=>GetAsync("/vehicles/"+Uri.EscapeDataString(id),null,ct);
    public Task<JsonDocument> HistoryAsync(string id,CancellationToken ct=default)=>GetAsync("/vehicles/"+Uri.EscapeDataString(id)+"/history",null,ct);
    public Task<JsonDocument> ReserveAsync(string id,CancellationToken ct=default)=>GetAsync("/vehicles/"+Uri.EscapeDataString(id)+"/reserve",null,ct);
    public Task<JsonDocument> ChangesAsync(IDictionary<string,string?>? query=null,CancellationToken ct=default)=>GetAsync("/changes",query,ct);
    public void Dispose(){if(own)http.Dispose();}
}
