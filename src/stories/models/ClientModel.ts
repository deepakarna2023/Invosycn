import InvoiceModel from "../../stories/models/InvoiceModel";

interface ClientModel {
  id: string;
  firstName: string;
  lastName: string;
  address: string;
  image: any;
  email: string;
  invoices: InvoiceModel[]
}

export default ClientModel;
