package apibara
import ("context";"net/http";"net/http/httptest";"net/url";"testing";"strings")
func TestVehicles(t *testing.T){
    server:=httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter,r *http.Request){
        if r.Header.Get("X-API-Key")!="test" {t.Error("missing API key")}
        if !strings.Contains(r.URL.RawQuery,"platform=copart"){t.Error("missing query")}
        w.Header().Set("Content-Type","application/json");w.Write([]byte(`{"data":[]}`))
    }));defer server.Close()
    client:=New("test");client.BaseURL=server.URL
    _,err:=client.Vehicles(context.Background(),url.Values{"platform":{"copart"}})
    if err!=nil{t.Fatal(err)}
}
