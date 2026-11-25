package apibara

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"net/url"
	"strings"
	"time"
)

const defaultBaseURL = "https://apibara.tech/api/v1/vehicle-auction"

type Client struct {
	APIKey  string
	BaseURL string
	HTTP    *http.Client
}

func New(apiKey string) *Client {
	return &Client{
		APIKey:  apiKey,
		BaseURL: defaultBaseURL,
		HTTP:    &http.Client{Timeout: 30 * time.Second},
	}
}

func (c *Client) Search(ctx context.Context, query url.Values) (map[string]any, error) {
	return c.get(ctx, "/vehicles", query)
}
func (c *Client) Vehicle(ctx context.Context, identifier string) (map[string]any, error) {
	return c.get(ctx, "/vehicles/"+url.PathEscape(identifier), nil)
}

func (c *Client) History(ctx context.Context, identifier string) (map[string]any, error) {
	return c.get(ctx, "/vehicles/"+url.PathEscape(identifier)+"/history", nil)
}

func (c *Client) Filters(ctx context.Context, query url.Values) (map[string]any, error) {
	return c.get(ctx, "/vehicles/filters", query)
}

func (c *Client) Locations(ctx context.Context, query url.Values) (map[string]any, error) {
	return c.get(ctx, "/locations", query)
}

func (c *Client) Usage(ctx context.Context) (map[string]any, error) {
	return c.get(ctx, "/usage", nil)
}

func (c *Client) get(ctx context.Context, path string, query url.Values) (map[string]any, error) {
	if strings.TrimSpace(c.APIKey) == "" {
		return nil, fmt.Errorf("Apibara API key is required")
	}

	base := strings.TrimRight(c.BaseURL, "/")
	u, err := url.Parse(base + path)
	if err != nil {
		return nil, err
	}
	if query != nil {
		u.RawQuery = query.Encode()
	}

	req, err := http.NewRequestWithContext(ctx, http.MethodGet, u.String(), nil)
	if err != nil {
		return nil, err
	}
	req.Header.Set("Accept", "application/json")
	req.Header.Set("X-API-Key", c.APIKey)

	httpClient := c.HTTP
	if httpClient == nil {
		httpClient = &http.Client{Timeout: 30 * time.Second}
	}

	resp, err := httpClient.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	var payload map[string]any
	if err := json.NewDecoder(resp.Body).Decode(&payload); err != nil {
		return nil, fmt.Errorf("decode Apibara response: %w", err)
	}
	if resp.StatusCode < 200 || resp.StatusCode >= 300 {
		return nil, fmt.Errorf("Apibara HTTP %d: %v", resp.StatusCode, payload)
	}
	return payload, nil
}
