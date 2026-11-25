export type QueryValue = string | number | boolean | null | undefined;
export type Query = Record<string, QueryValue | QueryValue[]>;
export class ApibaraVehicleAuctionClient {
  constructor(apiKey: string, baseUrl?: string);
  readonly apiKey: string;
  readonly baseUrl: string;
  search(query?: Query): Promise<unknown>;
  vehicle(identifier: string, query?: Query): Promise<unknown>;
  history(identifier: string): Promise<unknown>;
  related(identifier: string, query?: Query): Promise<unknown>;
  filters(query?: Query): Promise<unknown>;
  locations(query?: Query): Promise<unknown>;
  shipping(identifier: string, query?: Query): Promise<unknown>;
  usage(): Promise<unknown>;
  get(path: string, query?: Query): Promise<unknown>;
}
export default ApibaraVehicleAuctionClient;
