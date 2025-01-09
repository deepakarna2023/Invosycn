import ContactsModel from './ContactsModel';
import InvoiceModel from './InvoiceModel';
import AutomationSetting from './AutomationSetting';

interface ClientModel {
  id: string;
  companyName: string;
  phoneNumber?: number | null;
  image: any;
  streetAddress: string | null;
  city: string | null;
  zip: string | null;
  state: string | null;
  country: string | null;
  contacts?: ContactsModel[] | null;
  invoices: InvoiceModel[] | null;
  automationSetting?: AutomationSetting | null;
}

export default ClientModel;
