package apibara
import (
    "context"
    "encoding/json"
    "fmt"
    "io"
    "net/http"
    "net/url"
    "strings"
    "time"
)
type Client struct { APIKey string; BaseURL string; HTTPClient *http.Client }
func New(apiKey string) *Client { return &Client{APIKey:apiKey, BaseURL:"https://apibara.tech/api/v1/vehicle-auction", HTTPClient:&http.Client{Timeout:30*time.Second}} }
func (c *Client) Get(ctx context.Context, path string, query url.Values) (json.RawMessage,error) {
    if c.APIKey=="" { return nil,fmt.Errorf("API key required") }
    if !strings.HasPrefix(path,"/") || strings.HasPrefix(path,"//") {return nil,fmt.Errorf("invalid path")}
    u,e:=url.Parse(strings.TrimRight(c.BaseURL,"/")+path); if e!=nil{return nil,e}
    if query!=nil{u.RawQuery=query.Encode()}
    req,e:=http.NewRequestWithContext(ctx,"GET",u.String(),nil); if e!=nil{return nil,e}
    req.Header.Set("Accept","application/json");req.Header.Set("X-API-Key",c.APIKey)
    h:=c.HTTPClient;if h==nil{h=http.DefaultClient}
    resp,e:=h.Do(req);if e!=nil{return nil,e};defer resp.Body.Close()
    b,e:=io.ReadAll(io.LimitReader(resp.Body,32<<20));if e!=nil{return nil,e}
    if resp.StatusCode<200 || resp.StatusCode>=300{return nil,fmt.Errorf("Apibara HTTP %d: %s",resp.StatusCode,string(b))}
    if !json.Valid(b){return nil,fmt.Errorf("invalid JSON response")}
    return json.RawMessage(b),nil
}
func (c *Client) Vehicles(ctx context.Context,q url.Values)(json.RawMessage,error){return c.Get(ctx,"/vehicles",q)}
func (c *Client) Vehicle(ctx context.Context,id string)(json.RawMessage,error){return c.Get(ctx,"/vehicles/"+url.PathEscape(id),nil)}
func (c *Client) History(ctx context.Context,id string)(json.RawMessage,error){return c.Get(ctx,"/vehicles/"+url.PathEscape(id)+"/history",nil)}
func (c *Client) Reserve(ctx context.Context,id string)(json.RawMessage,error){return c.Get(ctx,"/vehicles/"+url.PathEscape(id)+"/reserve",nil)}
func (c *Client) Changes(ctx context.Context,q url.Values)(json.RawMessage,error){return c.Get(ctx,"/changes",q)}
func (c *Client) SaleDocuments(ctx context.Context,q url.Values)(json.RawMessage,error){return c.Get(ctx,"/sale-documents",q)}
func (c *Client) Usage(ctx context.Context)(json.RawMessage,error){return c.Get(ctx,"/usage",nil)}
