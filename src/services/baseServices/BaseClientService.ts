import { IBaseClientService } from '../interfaces/IBaseClientService';
import ClientModel from '../../models/ClientModel';
import axiosInstance from '../axiosConfiguration';
import InvoiceModel from '../../models/InvoiceModel';


export class BaseClientService implements IBaseClientService {

  async getAllClients(): Promise<ClientModel[]> {
    try {
      const response = await axiosInstance.get<ClientModel[]>("/getAllClients");
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async updateClient(client: ClientModel | null): Promise<void> {
    ;
    try {
      await axiosInstance.put(`getAllClients/${client?.id}`, client);
    } catch (error) {
      throw error;
    }
  }

  async getClientById(clientId: string): Promise<ClientModel | null> {
    try {
      const response = await axiosInstance.get<ClientModel[]>(`/getAllClients?id=${clientId}`);
      return response.data.length > 0 ? response.data[0] : null;
    } catch (error) {
      throw error;
    }
  }
  
  async createInvoice(invoice: InvoiceModel): Promise<void> {
    try {
      await axiosInstance.post("/getAllInvoices", invoice);
    } catch (error) {
      throw error;
    }
  }

  async getOnlyClientInvoice(clientId: string): Promise<ClientModel | null> {
    try {
      const response = await axiosInstance.get<ClientModel[]>(`/getAllClients?id=${clientId}&excludeInvoices=true`);
      return response.data.length > 0 ? response.data[0] : null;
    } catch (error) {
      throw error;
    }
  }

  async createClient(client: ClientModel): Promise<void> {
    ;
    try {
      await axiosInstance.post(`getAllClients`, client);
    } catch (error) {
      throw error;
    }
  }

};

