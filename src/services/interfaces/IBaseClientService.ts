import ClientModel from "../../models/ClientModel";

export interface IBaseClientService {
  getAllClients(): Promise<ClientModel[]>;
}
