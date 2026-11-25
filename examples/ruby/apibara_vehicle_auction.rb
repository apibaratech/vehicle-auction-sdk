# frozen_string_literal: true

require "json"
require "net/http"
require "uri"

class ApibaraVehicleAuctionClient
  DEFAULT_BASE_URL = "https://apibara.tech/api/v1/vehicle-auction"

  def initialize(api_key:, base_url: DEFAULT_BASE_URL)
    raise ArgumentError, "api_key is required" if api_key.to_s.empty?

    @api_key = api_key
    @base_url = base_url.sub(%r{/$}, "")
  end

  def search(query = {})
    get("/vehicles", query)
  end

  def vehicle(identifier, query = {})
    get("/vehicles/#{escape(identifier)}", query)
  end

  def history(identifier)
    get("/vehicles/#{escape(identifier)}/history")
  end

  def filters(query = {})
    get("/vehicles/filters", query)
  end
  def locations(query = {})
    get("/locations", query)
  end

  def usage
    get("/usage")
  end

  private

  def get(path, query = {})
    uri = URI.parse(@base_url + path)
    pairs = query.flat_map do |key, value|
      Array(value).filter_map { |v| [key.to_s, v.to_s] unless v.nil? || v == "" }
    end
    uri.query = URI.encode_www_form(pairs) unless pairs.empty?

    request = Net::HTTP::Get.new(uri)
    request["Accept"] = "application/json"
    request["X-API-Key"] = @api_key

    response = Net::HTTP.start(uri.host, uri.port, use_ssl: uri.scheme == "https",
                              open_timeout: 10, read_timeout: 30) { |http| http.request(request) }
    payload = JSON.parse(response.body) rescue { "message" => response.body }

    unless response.is_a?(Net::HTTPSuccess)
      raise "Apibara HTTP #{response.code}: #{payload["message"] || payload["error"]}"
    end

    payload
  end

  def escape(value)
    URI.encode_www_form_component(value.to_s)
  end
end
