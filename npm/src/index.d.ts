export type QueryValue = string | number | boolean | null | undefined;
export type Query = Record<string, QueryValue | QueryValue[]>;
export class ApibaraVehicleAuctionClient {
  constructor(apiKey: string, baseUrl?: string);
  readonly apiKey: string;
  readonly baseUrl: string;
  search(query?: Query): Promise<unknown>;
  vehicle(identifier: string, query?: Query): Promise<unknown>;
  history(identifier: string, query?: Query): Promise<unknown>;
  related(identifier: string, query?: Query): Promise<unknown>;
  filters(query?: Query): Promise<unknown>;
  locations(query?: Query): Promise<unknown>;
  shipping(identifier: string, query?: Query): Promise<unknown>;
  reserve(identifier: string, query?: Query): Promise<unknown>;
  changes(query?: Query): Promise<unknown>;
  saleDocuments(query?: Query): Promise<unknown>;
  soldPrices(query?: Query): Promise<unknown>;
  shippingToPort(query?: Query): Promise<unknown>;
  urlToDetails(query?: Query): Promise<unknown>;
  liveSession(): Promise<unknown>;
  usage(): Promise<unknown>;
  get(path: string, query?: Query): Promise<unknown>;
  request(method: "GET" | "POST", path: string, query?: Query): Promise<unknown>;
}
export default ApibaraVehicleAuctionClient;
