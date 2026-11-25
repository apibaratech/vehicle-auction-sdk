package tech.apibara.vehicleauction;
import java.net.URI;
import java.net.URLEncoder;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.util.Map;
import java.util.stream.Collectors;
public final class Client {
  private final String apiKey;
  private final String base;
  private final HttpClient http = HttpClient.newBuilder().connectTimeout(Duration.ofSeconds(10)).build();
  public Client(String apiKey) {
    if(apiKey==null || apiKey.isEmpty()) throw new IllegalArgumentException("API key required");
    this.apiKey=apiKey;this.base="https://apibara.tech/api/v1/vehicle-auction";
  }
  private static String enc(String value){return URLEncoder.encode(value,StandardCharsets.UTF_8).replace("+","%20");}
  public String get(String path, Map<String,String> query) throws Exception {
    if(!path.startsWith("/")||path.startsWith("//")) throw new IllegalArgumentException("invalid path");
    String qs=query.entrySet().stream().filter(e->e.getValue()!=null).map(e->enc(e.getKey())+"="+enc(e.getValue())).collect(Collectors.joining("&"));
    String url=base+path+(qs.isEmpty()?"":"?"+qs);
    HttpRequest r=HttpRequest.newBuilder(URI.create(url)).timeout(Duration.ofSeconds(30)).header("X-API-Key",apiKey).header("Accept","application/json").GET().build();
    HttpResponse<String> response=http.send(r,HttpResponse.BodyHandlers.ofString());
    if(response.statusCode()<200 || response.statusCode()>=300)throw new IllegalStateException("Apibara HTTP "+response.statusCode()+": "+response.body());
    return response.body();
  }
  public String vehicles(Map<String,String> query)throws Exception{return get("/vehicles",query);}
  public String changes(Map<String,String> query)throws Exception{return get("/changes",query);}
  public String reserve(String id)throws Exception{return get("/vehicles/"+enc(id)+"/reserve",Map.of());}
  public String usage()throws Exception{return get("/usage",Map.of());}
}
