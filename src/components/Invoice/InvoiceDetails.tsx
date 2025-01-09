import React, { useEffect, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import "../../assets/styles/base.scss";
import { Tooltip } from "primereact/tooltip";
import { useLocation, useNavigate } from "react-router-dom";
import { BaseClientService } from "../../services/baseServices/BaseClientService";
import { BaseInvoiceService } from "../../services/baseServices/BaseInvoiceService";
import InvoiceModel from "../../models/InvoiceModel";
import ClientModel from "../../models/ClientModel";
import InvoiceItemModel from "../../models/InvoiceItemModel";

const InvoiceDetails: React.FC = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const invoiceId = queryParams.get("invoiceId");
  const clientId = queryParams.get("clientId");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [invoiceData, setInvoiceData] = useState<InvoiceModel>();
  const [clientData, setClientData] = useState<ClientModel>();
  const [InvoiceItems, setInvoiceItems] = useState<InvoiceItemModel[]>([]);
  const clientService = new BaseClientService();
  const navigate = useNavigate();

  const chunkArray = (array: any[], size: number) => {
    const result = [];
    for (let i = 0; i < array.length; i += size) {
      result.push(array.slice(i, i + size));
    }
    return result;
  };

  useEffect(() => {
    const getInvoicesDetails = async () => {
      try {
        setLoading(true);
        const clientDetail = await clientService.getClientById(clientId!);
        const invoiceDetail = clientDetail?.invoices!.find((invoice): invoice is InvoiceModel => invoice.id === invoiceId); 
        setInvoiceData(invoiceDetail!);
        setInvoiceItems(invoiceDetail!.invoiceItemList);
        setClientData(clientDetail!);
      } catch (err) {
        setError("Error fetching invoices");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    getInvoicesDetails();
  }, []);
  const calculateSubtotal = () =>
    InvoiceItems.reduce(
      (total, item) => total + item.itemModel.price * item.quantity,
      0
    );
  const subtotal = calculateSubtotal();
  const tax = subtotal * 0.17;
  const total = subtotal + tax;
  const handleBackToInvoices = () => {
    navigate("/Invoices");
  };
  return (
    <div className="surface-0 p-4 shadow-2 border-round">
      <div className="text-4xl font-normal text-600 mb-3 justify-content-between align-items-center flex ">
        <div className="">
          <i
            className="pi pi-angle-left text-blue-500"
            style={{ fontSize: "2.2rem" }}
            onClick={handleBackToInvoices}
          ></i>
          Invoice details
        </div>
        <Tooltip target=".buttontag" position="bottom" />
        <div className="flex justify-content-end gap-2">
          <Button
          label="Send"
            className="buttontag"
            type="button"
            icon="pi pi-send"
            data-pr-tooltip="Send"
          />
          <Button
          label="PDF"
            className="buttontag"
            type="button"
            icon="pi pi-file-pdf"
            severity="warning"
            data-pr-tooltip="PDF"
          />
        </div>
      </div>
      <div className="shadow-2 border-round mx-6">
        <div className="grid  border-round p-3 m-3 justify-content-between">
          <div className="p-3  col flex flex-column gap-2 justify-content-start ">
            <span className="w-auto md:w-5 p-2 border-round font-semibold text-xs text-blue-500 bg-blue-100 mb-2">
              Invoice to:
            </span>
            {Array.isArray(invoiceData?.invoiceSetting?.sendTo!) &&
              invoiceData?.invoiceSetting?.sendTo!.length! > 0 && (
                <div className="flex flex-column gap-2 flex-wrap">
                  {chunkArray(invoiceData?.invoiceSetting?.sendTo!, 2).map(
                    (contactPair, rowIndex) => (
                      <div key={rowIndex} className="flex gap-4 white-space-normal">
                        {contactPair.map((contact) => (
                          <div
                            key={contact.id}
                            className="flex-1 border p-2 rounded "
                            style={{ wordBreak: "break-word" }}
                          >
                            <div className="font-bold text-xl">
                              {contact.firstName} {contact.lastName}
                            </div>
                            <div className="font-normal text-sm sm:text-base md:text-lg my-1">
                              {contact.phoneNumber}
                            </div>
                            <div className="font-normal text-xs sm:text-base md:text-lg mb-1 ">
                              {contact.email}
                            </div>
                          </div>
                        ))}
                      </div>
                    )
                  )}
                </div>
              )}
          </div>

          <div className="p-3 col flex flex-column gap-2 align-items-end"> 
            <span className="w-3 p-2 border-round font-semibold text-xs text-blue-500 bg-blue-100 mb-2 ">
              Date:
            </span>
            <span className="font-bold mb-1 text-xl sm:text-lg md:text-xl lg:text-2xl">
              {new Date(invoiceData?.dueDate!).toLocaleDateString()}
            </span>

            <span className="font-normal text-sm sm:text-base md:text-lg align-items-start">
              {clientData?.companyName!}
            </span>
            <span className="font-normal text-sm sm:text-base md:text-lg">
              {clientData?.streetAddress}, {clientData?.city}
            </span>
            <span className="font-normal text-sm sm:text-base md:text-lg">
              {clientData?.zip}, {clientData?.country}
            </span>
          </div>

          <div className="col   p-3 flex flex-column gap-2 align-items-end" >
            <span className="w-auto p-2 border-round font-semibold text-xs text-blue-500 bg-blue-100 mb-2">
              Invoice number:
            </span>
            <span className="font-bold mb-1 text-xl">
              # : {invoiceData?.invoiceNumber}
            </span>
          </div>
        </div>
        <div className="items-list flex border-round p-3 m-3">
          <DataTable value={InvoiceItems}>
            <Column header="#" body={(rowData, { rowIndex }) => rowIndex + 1} />
            <Column
              field="itemModel.name"
              header="Item Name"
              className="font-bold border-round"
            />
            <Column
              field="itemModel.price"
              header="Price"
              body={(rowData) => `$${rowData?.itemModel?.price?.toFixed(2)}`}
            />
            <Column field="quantity" header="Quantity" />
          </DataTable>
        </div>
        <div className="flex border-round p-3  m-3 justify-content-between">
          <div className=" w-4 p-3 flex flex-column gap-2 justify-content-start">
            <span className="font-bold mb-2">Term & Conditions</span>
            <span className="font-normal text-sm text-400 mr-6">
              Payment is due within the specified period. Late payments may
              incur fees. Taxes are as applicable. Report disputes within 7
              days. Ownership remains with Invoicing agency until payment is
              complete.
            </span>
          </div>
          <div className=" w-4 p-3 flex flex-column justify-content-start">
            <div className="p-1 flex flex-row justify-content-between">
              <span className="font-bold text-lg">Subtotal</span>
              <span className="font-normal text-500  mb-1 text-lg">
                $ {subtotal.toFixed(2)}
              </span>
            </div>
            <div className=" p-1 flex flex-row justify-content-between">
              <span className="font-bold mb-1 text-lg">Discount</span>
              <span className="font-normal text-blue-500  mb-1 text-lg">
                $ 0.00
              </span>
            </div>
            <div className=" p-1 flex flex-row justify-content-between">
              <span className="font-bold mb-1 text-lg">TAX:</span>
              <span className="font-normal text-500  mb-1 text-lg">
                $ {tax.toFixed(2)}
              </span>
            </div>
            <div className=" px-1 py-3 flex flex-row bg-blue-100 border-round  justify-content-between">
              <span className="font-bold mb-1 text-lg">
                Invoice total (incl. Tax)
              </span>
              <span className="font-bold text-500  mb-1 text-lg">
                $ {total.toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceDetails;
