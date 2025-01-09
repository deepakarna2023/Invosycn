import ClientModel from './ClientModel';
import InvoiceItemModel from './InvoiceItemModel';
import AutomationSetting from './AutomationSetting';

interface InvoiceModel {
  id: string;
  invoiceNumber: string;
  createdDate: Date;
  dueDate: Date;
  isReminder: boolean;
  totalAmount: number;
  subtotalAmount: number;
  taxAmount: number;
  invoiceStatus: string;
  invoicePaymentStatus: string;
  clientId: string;
  companyName?: string;
  billingPeriodStart: Date;
  billingPeriodEnd: Date;
  client?: ClientModel
  invoiceItemList: InvoiceItemModel[];
  invoiceSetting?: AutomationSetting | null;
}

export default InvoiceModel;
