import { IBaseInvoiceService } from "../interfaces/IBaseInvoiceService";
import InvoiceModel from "../../models/InvoiceModel";
import axiosInstance from "../axiosConfiguration";

export class BaseInvoiceService implements IBaseInvoiceService {


  async getAllInvoices(): Promise<InvoiceModel[]> {
    try {
      const response = await axiosInstance.get<InvoiceModel[]>("/getAllInvoices");
      return response.data;
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


  async getInvoicesByClientId(clientId: string): Promise<InvoiceModel[]> {
    try {
      const response = await axiosInstance.get<InvoiceModel[]>(`/getAllInvoices?clientId=${clientId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async getInvoiceById(invoiceId: string): Promise<InvoiceModel | null> {
    try {
      const response = await axiosInstance.get<InvoiceModel[]>(`/getAllInvoices?id=${invoiceId}`);
      return response.data.length > 0 ? response.data[0] : null;
    } catch (error) {
      throw error;
    }
  }

  async getLastInvoice(): Promise<InvoiceModel | null> {
    try {
      const response = await axiosInstance.get<InvoiceModel[]>("/getAllInvoices");
      const invoices = response.data;

      if (invoices.length === 0) {
        return null;
      }
      const sortedInvoices = invoices.sort((a, b) => Number(a.id) - Number(b.id));
      return sortedInvoices[sortedInvoices.length - 1];
    } catch (error) {
      throw error;
    }
  }

  async updateInvoice(invoice: InvoiceModel): Promise<void> {
    ;
    try {
      await axiosInstance.put(`getAllInvoices/${invoice.id}`, invoice);
    } catch (error) {
      throw error;
    }
  }
  // async updateInvoiceStatus(invoiceId: string, newStatus: string): Promise<InvoiceModel> {
  //   debugger;
  //   try {
  //     const response = await axiosInstance.get<InvoiceModel>(`/getAllInvoices?id=${invoiceId}&invoiceStatus=${encodeURIComponent(newStatus)}`);
  //     return response.data;
  //   } catch (error) {
  //     console.error("Error updating invoice status:", error);
  //     throw error;
  //   }
  // }
};
