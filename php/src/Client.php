<?php
declare(strict_types=1);
namespace Apibara\VehicleAuction;
final class Client {
    private string $key;
    private string $base;
    public function __construct(string $apiKey, string $baseUrl = 'https://apibara.tech/api/v1/vehicle-auction') {
        if ($apiKey === '') throw new \InvalidArgumentException('API key is required');
        $this->key = $apiKey;
        $this->base = rtrim($baseUrl, '/');
    }
    public function get(string $path, array $query = []): array { return $this->request("GET", $path, $query); }
    public function request(string $method, string $path, array $query = []): array {
        if (!str_starts_with($path, '/') || str_starts_with($path, '//')) throw new \InvalidArgumentException('Path must start with a single slash');
        $url = $this->base . $path;
        if ($query) $url .= '?' . http_build_query($query, '', '&', PHP_QUERY_RFC3986);
        $ch = curl_init($url);
        curl_setopt_array($ch, [CURLOPT_RETURNTRANSFER => true, CURLOPT_CUSTOMREQUEST => $method, CURLOPT_HTTPHEADER => ['Accept: application/json', 'X-API-Key: ' . $this->key], CURLOPT_TIMEOUT => 30]);
        $body = curl_exec($ch);
        $status = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        $error = curl_error($ch);
        curl_close($ch);
        if ($body === false) throw new \RuntimeException('Apibara network error: ' . $error);
        $data = json_decode($body, true);
        if ($status < 200 || $status >= 300) throw new \RuntimeException('Apibara HTTP ' . $status . ': ' . ($data['message'] ?? $data['error'] ?? $body), $status);
        if (!is_array($data)) throw new \RuntimeException('Invalid JSON response');
        return $data;
    }
    private function lot(string $lot): string { return rawurlencode($lot); }
    public function vehicles(array $q = []): array { return $this->get('/vehicles', $q); }
    public function vehicle(string $id, array $q = []): array { return $this->get('/vehicles/'.$this->lot($id), $q); }
    public function history(string $id, array $q = []): array { return $this->get('/vehicles/'.$this->lot($id).'/history', $q); }
    public function related(string $id, array $q = []): array { return $this->get('/vehicles/'.$this->lot($id).'/related', $q); }
    public function reserve(string $id, array $q = []): array { return $this->get('/vehicles/'.$this->lot($id).'/reserve', $q); }
    public function filters(array $q = []): array { return $this->get('/vehicles/filters', $q); }
    public function locations(array $q = []): array { return $this->get('/locations', $q); }
    public function changes(array $q = []): array { return $this->get('/changes', $q); }
    public function saleDocuments(array $q = []): array { return $this->get('/sale-documents', $q); }
    public function soldPrices(array $q = []): array { return $this->get('/market/sold-prices', $q); }
    public function usage(): array { return $this->get('/usage'); }
    public function shippingToPort(array $q = []): array { return $this->get('/shipping/auction-to-port', $q); }
    public function urlToDetails(array $q = []): array { return $this->get('/vehicles/urltodetails', $q); }
    public function liveSession(): array { return $this->request("POST", "/live/v1/session"); }
}
