import React, { useEffect, useState } from "react";
import "../assets/styles/DashboardPage.scss";
import InvoiceHistoryPage from "./InvoiceHistorypage";
import { Button } from "primereact/button";
import { useNavigate } from "react-router-dom";
import ClientsListPage from "./client/ClientsListPage";
import ClientModel from "../models/ClientModel";
import { BaseInvoiceService } from "../services/baseServices/BaseInvoiceService";
import InvoiceModel from "../models/InvoiceModel";
import { BaseClientService } from "../services/baseServices/BaseClientService";

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const invoiceService = new BaseInvoiceService();
  const clientService = new BaseClientService();
  const [loader, setLoader] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [clients, setClients] = useState<ClientModel[]>([]);

  const [paymentDetails, setPaymentDetails] = useState({
    Paid: { count: 0, totalAmount: 0 },
    Unpaid: { count: 0, totalAmount: 0 },
    Pending: { count: 0, totalAmount: 0 },
    Overdue: { count: 0, totalAmount: 0 },
  });

  useEffect(() => {
    getclients();
    const timer = setTimeout(() => {
      setLoader(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);
  const handleCreateInvoice = () => {
    navigate("/Invoice");
  };
  const getclients = async () => {
    const clientsData = await clientService.getAllClients();
    const invoices: InvoiceModel[] = clientsData
    .flatMap((client) => client.invoices || []) 
    .filter((invoice): invoice is InvoiceModel => invoice !== null); 

    const invoiceSummary = calculateInvoiceSummary(invoices);
    setPaymentDetails(invoiceSummary);
  };
  
  const calculateInvoiceSummary = (invoices: InvoiceModel[]) => {
    const summary = {
      Paid: { count: 0, totalAmount: 0 },
      Unpaid: { count: 0, totalAmount: 0 },
      Pending: { count: 0, totalAmount: 0 },
      Overdue: { count: 0, totalAmount: 0 },
    };

    const validStatuses = Object.keys(summary);

    invoices.forEach((invoice) => {
        const status = invoice.invoicePaymentStatus;
        if (validStatuses.includes(status)) {
          const key = status as keyof typeof summary;
          summary[key].count += 1;
          summary[key].totalAmount += invoice.totalAmount;
        }
    });

    return summary;
  };

  return (
    <div className="surface-0 p-4 shadow-2 border-round">
      <div className="text-4xl font-semibold text-600 mb-3">Overview</div>
      <div className="grid">
        <div className="col-12 md:col-6 lg:col-3">
          <div className="surface-0 shadow-2 p-3 border-1 border-50 border-round">
            <div className="flex justify-content-between mb-3">
              <div>
                <span className="block text-500 font-medium mb-3">PAID</span>
                <div className="text-900 font-medium text-xl">
                  {new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "USD",
                    maximumFractionDigits: 0,
                  }).format(paymentDetails?.Paid?.totalAmount!)}
                </div>
              </div>
              <div
                className="flex align-items-center justify-content-center bg-blue-100 border-round"
                style={{ width: "2.5rem", height: "2.5rem" }}
              >
                <i className="pi pi-dollar text-blue-500 text-xl"></i>
              </div>
            </div>
            <span className="text-green-500 font-medium">
              {paymentDetails.Paid.count}{" "}
            </span>
            <span className="text-500">Invoices</span>
          </div>
        </div>
        <div className="col-12 md:col-6 lg:col-3">
          <div className="surface-0 shadow-2 p-3 border-1 border-50 border-round">
            <div className="flex justify-content-between mb-3">
              <div>
                <span className="block text-500 font-medium mb-3">UNPAID</span>
                <div className="text-900 font-medium text-xl">
                  {new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "USD",
                    maximumFractionDigits: 0,
                  }).format(paymentDetails?.Unpaid?.totalAmount!)}
                </div>
              </div>
              <div
                className="flex align-items-center justify-content-center bg-orange-100 border-round"
                style={{ width: "2.5rem", height: "2.5rem" }}
              >
                <i className="pi pi-receipt text-orange-500 text-xl"></i>
              </div>
            </div>
            <span className="text-yellow-500 font-medium"> {paymentDetails.Unpaid.count}{" "} </span>
            <span className="text-500">Invoices</span>
          </div>
        </div>
        <div className="col-12 md:col-6 lg:col-3">
          <div className="surface-0 shadow-2 p-3 border-1 border-50 border-round">
            <div className="flex justify-content-between mb-3">
              <div>
                <span className="block text-500 font-medium mb-3">PENDING</span>
                <div className="text-900 font-medium text-xl"> {new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "USD",
                    maximumFractionDigits: 0,
                  }).format(paymentDetails?.Pending?.totalAmount!)}</div>
              </div>
              <div
                className="flex align-items-center justify-content-center bg-cyan-100 border-round"
                style={{ width: "2.5rem", height: "2.5rem" }}
              >
                <i className="pi pi-clock text-cyan-500 text-xl"></i>
              </div>
            </div>
            <span className="text-orange-500 font-medium"> {paymentDetails.Pending.count}{" "}  </span>
            <span className="text-500">Invoices</span>
          </div>
        </div>
        <div className="col-12 md:col-6 lg:col-3">
          <div className="surface-0 shadow-2 p-3 border-1 border-50 border-round">
            <div className="flex justify-content-between mb-3">
              <div>
                <span className="block text-500 font-medium mb-3">OVERDUE</span>
                <div className="text-900 font-medium text-xl">{new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "USD",
                    maximumFractionDigits: 0,
                  }).format(paymentDetails?.Overdue?.totalAmount!)}</div>
              </div>
              <div
                className="flex align-items-center justify-content-center bg-orange-100 border-round"
                style={{ width: "2.5rem", height: "2.5rem" }}
              >
                <i className="pi pi-receipt text-orange-500 text-xl"></i>
              </div>
            </div>
            <span className="text-red-500 font-medium">{paymentDetails.Overdue.count}{" "}  </span>
            <span className="text-500">Invoices</span>
          </div>
        </div>
      </div>
      <div>
        <div className="text-4xl font-semibold text-600 mb-3 mt-5 flex justify-content-between align-items-center">
          Clients
        </div>
        <div>
          <ClientsListPage isDashboardView={true} />
        </div>
      </div>
      <div>
        <div className="text-4xl font-semibold text-600 mb-3 mt-5 flex justify-content-between align-items-center">
          Invoices
          <Button
            label="New Invoice"
            icon="pi pi-plus"
            className="p-button-primary gap-2"
            onClick={handleCreateInvoice}
          />
        </div>
        <div>
          <InvoiceHistoryPage isDashboardView={true} />
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
