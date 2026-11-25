require_relative 'lib/apibara_vehicle_auction'
begin
  ApibaraVehicleAuction::Client.new('')
  abort 'Expected missing API key error'
rescue ArgumentError
end
begin
  ApibaraVehicleAuction::Client.new('test').get('bad')
  abort 'Expected invalid path error'
rescue ArgumentError
end
puts 'Ruby SDK checks passed'
