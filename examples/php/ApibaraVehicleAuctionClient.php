<?php

declare(strict_types=1);

final class ApibaraVehicleAuctionClient
{
    public function __construct(
        private readonly string $apiKey,
        private readonly string $baseUrl = 'https://apibara.tech/api/v1/vehicle-auction',
    ) {}

    public function search(array $query = []): array
    {
        return $this->request('GET', '/vehicles', $query);
    }

    public function vehicle(string $slugVin): array
    {
        return $this->request('GET', '/vehicles/' . rawurlencode($slugVin));
    }

    public function history(string $slugVin): array
    {
        return $this->request('GET', '/vehicles/' . rawurlencode($slugVin) . '/history');
    }

    public function related(string $slugVin, array $query = []): array
    {
        return $this->request('GET', '/vehicles/' . rawurlencode($slugVin) . '/related', $query);
    }

    public function filters(array $query = []): array
    {
        return $this->request('GET', '/vehicles/filters', $query);
    }

    public function locations(array $query = []): array
    {
        return $this->request('GET', '/locations', $query);
    }

    public function shipping(string $slugVin, array $query = []): array
    {
        return $this->request('GET', '/vehicles/' . rawurlencode($slugVin) . '/shipping', $query);
    }

    public function usage(): array
    {
        return $this->request('GET', '/usage');
    }

    private function request(string $method, string $path, array $query = []): array
    {
        $url = rtrim($this->baseUrl, '/') . $path;
        if ($query !== []) {
            $url .= '?' . http_build_query($query, '', '&', PHP_QUERY_RFC3986);
        }

        $ch = curl_init($url);
        curl_setopt_array($ch, [
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_CUSTOMREQUEST => $method,
            CURLOPT_HTTPHEADER => [
                'Accept: application/json',
                'X-API-Key: ' . $this->apiKey,
            ],
            CURLOPT_TIMEOUT => 30,
        ]);

        $body = curl_exec($ch);
        $status = (int) curl_getinfo($ch, CURLINFO_RESPONSE_CODE);
        $error = curl_error($ch);
        curl_close($ch);

        if ($body === false) {
            throw new RuntimeException('Apibara request failed: ' . $error);
        }

        $decoded = json_decode($body, true);
        if (!is_array($decoded)) {
            throw new RuntimeException("Apibara returned a non-JSON response (HTTP {$status}).");
        }

        if ($status < 200 || $status >= 300) {
            $message = $decoded['message'] ?? $decoded['error'] ?? 'API request failed';
            throw new RuntimeException("Apibara HTTP {$status}: " . (is_string($message) ? $message : json_encode($message)));
        }

        return $decoded;
    }
}
