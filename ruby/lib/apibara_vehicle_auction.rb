require 'net/http'
require 'json'
require 'uri'
module ApibaraVehicleAuction
  class Client
    def initialize(api_key, base_url: 'https://apibara.tech/api/v1/vehicle-auction')
      raise ArgumentError, 'API key required' if api_key.to_s.empty?
      @api_key, @base_url = api_key, base_url.sub(%r{/$}, '')
    end
    def get(path, query = {})
      raise ArgumentError, 'Invalid path' unless path.start_with?('/') && !path.start_with?('//')
      uri = URI(@base_url + path)
      uri.query = URI.encode_www_form(query) unless query.empty?
      request = Net::HTTP::Get.new(uri)
      request['X-API-Key'] = @api_key
      request['Accept'] = 'application/json'
      response = Net::HTTP.start(uri.host, uri.port, use_ssl: uri.scheme == 'https', open_timeout: 10, read_timeout: 30) { |http| http.request(request) }
      raise "Apibara HTTP #{response.code}: #{response.body}" unless response.is_a?(Net::HTTPSuccess)
      JSON.parse(response.body)
    end
    def vehicles(query = {}); get('/vehicles', query); end
    def vehicle(id); get('/vehicles/' + URI.encode_www_form_component(id)); end
    def history(id); get('/vehicles/' + URI.encode_www_form_component(id) + '/history'); end
    def reserve(id); get('/vehicles/' + URI.encode_www_form_component(id) + '/reserve'); end
    def changes(query = {}); get('/changes', query); end
    def sale_documents(query = {}); get('/sale-documents', query); end
    def usage; get('/usage'); end
  end
end
