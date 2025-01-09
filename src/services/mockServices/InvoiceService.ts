import { v4 as guid } from "uuid";
import InvoiceModel from "../../models/InvoiceModel";

export const InvoiceService = {
  getInvoiceHistoryData(): InvoiceModel[] {
    return [
      {
        id: guid(),
        invoiceNumber: "INV-001",
        createdDate: new Date("2024-01-15"),
        dueDate: new Date("2024-02-15"),
        isReminder: true,
        totalAmount: 300.0,
        subtotalAmount: 275.0,
        taxAmount: 25.0,
        invoiceStatus: "Sent",
        invoicePaymentStatus: "Paid",
        clientId: guid(),
        billingPeriodStart: new Date("2024-01-01"),
        billingPeriodEnd: new Date("2024-01-31"),
        invoiceItemList: [
          {
            id: guid(),
            itemModel: {
              id: guid(),
              name: "Item A",
              number: 101,
              price: 50.0,
            },
            quantity: 3,
            createdDate: new Date("2024-01-10"),
          },
          {
            id: guid(),
            itemModel: {
              id: guid(),
              name: "Item B",
              number: 102,
              price: 75.0,
            },
            quantity: 2,
            createdDate: new Date("2024-01-10"),
          },
        ],
      },
      {
        id: guid(),
        invoiceNumber: "INV-002",
        createdDate: new Date("2024-02-10"),
        dueDate: new Date("2024-03-10"),
        isReminder: false,
        totalAmount: 450.0,
        subtotalAmount: 400.0,
        taxAmount: 50.0,
        invoiceStatus: "Created",
        invoicePaymentStatus: "Unpaid",
        clientId: guid(),
        billingPeriodStart: new Date("2024-02-01"),
        billingPeriodEnd: new Date("2024-02-28"),
        invoiceItemList: [
          {
            id: guid(),
            itemModel: {
              id: guid(),
              name: "Item C",
              number: 103,
              price: 60.0,
            },
            quantity: 4,
            createdDate: new Date("2024-02-05"),
          },
          {
            id: guid(),
            itemModel: {
              id: guid(),
              name: "Item D",
              number: 104,
              price: 100.0,
            },
            quantity: 1,
            createdDate: new Date("2024-02-05"),
          },
        ],
      },
      {
        id: guid(),
        invoiceNumber: "INV-003",
        createdDate: new Date("2024-03-01"),
        dueDate: new Date("2024-04-01"),
        isReminder: true,
        totalAmount: 600.0,
        subtotalAmount: 550.0,
        taxAmount: 50.0,
        invoiceStatus: "Sent",
        invoicePaymentStatus: "Paid",
        clientId: guid(),
        billingPeriodStart: new Date("2024-03-01"),
        billingPeriodEnd: new Date("2024-03-31"),
        invoiceItemList: [
          {
            id: guid(),
            itemModel: {
              id: guid(),
              name: "Item E",
              number: 105,
              price: 120.0,
            },
            quantity: 4,
            createdDate: new Date("2024-03-10"),
          },
          {
            id: guid(),
            itemModel: {
              id: guid(),
              name: "Item F",
              number: 106,
              price: 80.0,
            },
            quantity: 2,
            createdDate: new Date("2024-03-10"),
          },
        ],
      },
      {
        id: guid(),
        invoiceNumber: "INV-004",
        createdDate: new Date("2024-04-01"),
        dueDate: new Date("2024-05-01"),
        isReminder: false,
        totalAmount: 800.0,
        subtotalAmount: 750.0,
        taxAmount: 50.0,
        invoiceStatus: "Created",
        invoicePaymentStatus: "Unpaid",
        clientId: guid(),
        billingPeriodStart: new Date("2024-04-01"),
        billingPeriodEnd: new Date("2024-04-30"),
        invoiceItemList: [
          {
            id: guid(),
            itemModel: {
              id: guid(),
              name: "Item G",
              number: 107,
              price: 100.0,
            },
            quantity: 5,
            createdDate: new Date("2024-04-10"),
          },
          {
            id: guid(),
            itemModel: {
              id: guid(),
              name: "Item H",
              number: 108,
              price: 50.0,
            },
            quantity: 2,
            createdDate: new Date("2024-04-10"),
          },
        ],
      },
    ];
  },

  getInvoices(): Promise<InvoiceModel[]> {
    return Promise.resolve(this.getInvoiceHistoryData());
  },
};
