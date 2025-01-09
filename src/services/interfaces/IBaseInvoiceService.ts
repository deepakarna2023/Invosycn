import InvoiceModel from "../../models/InvoiceModel";

export interface IBaseInvoiceService {
  getAllInvoices(): Promise<InvoiceModel[]>;
}
