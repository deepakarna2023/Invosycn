import ContactsModel from "./ContactsModel";

interface AutomationSetting {
  id?: string;  // Make id optional
  sendTo: ContactsModel[] | null;
  billingStartDate: Date | null;
  invoiceId?: string;
  isCreateInvoice: boolean;
  isBuildInvoice: boolean;
  isSendInvoice: boolean;
  billingEndDate?: Date | null;
  billingPeriod?: string;
}
export default AutomationSetting;