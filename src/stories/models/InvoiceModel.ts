import  InvoiceItemModel  from './InvoiceItemModel';

// Define the interface for InvoiceModel
interface InvoiceModel {
  id: string;
  invoiceNumber: string;
  createdDate: Date;
  dueDate: Date;
  isReminder: boolean;
  totalAmount: number;
  subtotalAmount: number;
  taxAmount: number;
  invoicePaymentStatus: string;
  clientId: string;
  billingPeriodStart: Date; 
  billingPeriodEnd: Date;
  invoiceItemList: InvoiceItemModel[];
}

export default InvoiceModel;
