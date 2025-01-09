import {
  DataTable,
  DataTableFilterMeta,
  DataTableRowClickEvent,
} from "primereact/datatable";
import React, { useState, useEffect, useRef } from "react";
import "../assets/styles/InvoiceHistoryPage.scss";
import InvoiceModel from "../models/InvoiceModel";
import { FilterMatchMode } from "primereact/api";
import { InputText } from "primereact/inputtext";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import { useNavigate } from "react-router-dom";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { RootState } from "../redux/store";
import { useSelector } from "react-redux";
import { Toast } from "primereact/toast";
import { Tag } from "primereact/tag";
import { Menu } from "primereact/menu";
import { BaseClientService } from "../services/baseServices/BaseClientService";

interface InvoiceHistoryPageProps {
  isDashboardView?: boolean;
  clientId?: string;
  isEditable?: boolean;
}

const InvoiceHistoryPage: React.FC<InvoiceHistoryPageProps> = ({
  isDashboardView,
  clientId,
  isEditable,
}) => {
  const navigate = useNavigate();
  const [invoices, setInvoices] = useState<InvoiceModel[]>([]);
  const [filters, setFilters] = useState<DataTableFilterMeta>({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [globalFilterValue, setGlobalFilterValue] = useState<string>("");
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [error, setError] = useState<string | null>(null);
  const toast = useRef<Toast>(null);
  const clientService = new BaseClientService();
  const [paidCount, setPaidCount] = useState(0);
  const [unpaidCount, setUnpaidCount] = useState(0);
  const [failedCount, setFailedCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const menuRefs = React.useRef<Map<string, Menu>>(new Map());

  useEffect(() => {
    const getAllInvoices = async () => {
      try {
        setLoading(true);
        let data;
        if (clientId) {
          data = await clientService.getClientById(clientId);
          data = data?.invoices ?? [];
        } else {
          data = await clientService.getAllClients();
          data = data.flatMap((client) => client.invoices || [])
          .filter((invoice) => invoice);
        }
        setInvoices(data);
        const { paidCount, unpaidCount, failedCount, totalCount } =
          calculateInvoiceCounts(data);
        setPaidCount(paidCount);
        setUnpaidCount(unpaidCount);
        setFailedCount(failedCount);
        setTotalCount(totalCount);
      } catch (err) {
        setError("Error fetching invoices");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    getAllInvoices();
  }, [clientId]);

  const onGlobalFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    debugger;
    const value = e.target.value;
    setGlobalFilterValue(value.toLowerCase());

    const filtered = invoices.filter((invoice) => {
      debugger;
      const status = invoice.invoicePaymentStatus?.toLowerCase();
      const Invoicestatus = invoice.invoiceStatus?.toLowerCase();
      const searchTerm = value.toLowerCase();
      const totalAmountStr = invoice.totalAmount.toFixed(2);
    
      const dueDateStr = new Date(invoice.dueDate).toLocaleDateString("en-US");
      const billingStartStr = new Date(invoice.billingPeriodStart).toLocaleDateString("en-US");
      const billingEndStr = new Date(invoice.billingPeriodEnd).toLocaleDateString("en-US");
    
      return (
        invoice.invoiceNumber.toLowerCase().includes(searchTerm) ||
        invoice.companyName?.toLowerCase().includes(searchTerm) ||
        invoice.invoicePaymentStatus?.toLowerCase().includes(searchTerm) ||
        dueDateStr.toLowerCase().includes(searchTerm) ||
        billingStartStr.toLowerCase().includes(searchTerm) ||
        billingEndStr.toLowerCase().includes(searchTerm) ||
        status?.includes(searchTerm) ||
        Invoicestatus?.includes(searchTerm) ||
        totalAmountStr?.includes(searchTerm)
      );
    });
    
  };

  const calculateInvoiceCounts = (invoices: InvoiceModel[]) => {
    const paidCount = invoices.filter(
      (invoice) => invoice.invoicePaymentStatus === "Paid"
    ).length;
    const unpaidCount = invoices.filter(
      (invoice) => invoice.invoicePaymentStatus === "Unpaid"
    ).length;
    const failedCount = invoices.filter(
      (invoice) => invoice.invoiceStatus === "Failed"
    ).length;
    const totalCount = invoices.length;

    return { paidCount, unpaidCount, failedCount, totalCount };
  };

  const rowClassName = (data: InvoiceModel) => ({
    "row-red": data.invoiceStatus === "Failed",
  });

  const handleCreateInvoice = () => {
    navigate("/Invoice");
  };

  const handleRowClick = (event: DataTableRowClickEvent) => {
    const rowData = event.data as InvoiceModel;
    navigate(`/InvoiceDetails?invoiceId=${rowData.id}&clientId=${rowData.clientId}`);
  };

  const renderHeader = () => {
    const filteredCount = filteredInvoices.length;
    const allCount = totalCount;

    const filteredPaidCount = filteredInvoices.filter(
      (invoice) => invoice.invoicePaymentStatus === "Paid"
    ).length;

    const filteredUnpaidCount = filteredInvoices.filter(
      (invoice) => invoice.invoicePaymentStatus === "Unpaid"
    ).length;

    const filteredFailedCount = filteredInvoices.filter(
      (invoice) => invoice.invoiceStatus === "Failed"
    ).length;

    return (
      <div className="flex justify-content-between">
        <div
          className="toggle-buttons"
          style={{ display: "flex", gap: "0.5rem" }}
        >
          <Button
            label="All"
            className={`filter-button ${
              activeFilter === "all" ? "active" : ""
            } border-noround`}
            onClick={() => setActiveFilter("all")}
            badge={totalCount.toString()}
            badgeClassName="p-badge-info"
          />
          <Button
            label="Paid"
            className={`filter-button ${
              activeFilter === "paid" ? "active" : ""
            } border-noround`}
            onClick={() => setActiveFilter("paid")}
            badge={paidCount.toString()}
            badgeClassName="p-badge-success"
          />
          <Button
            label="Unpaid"
            className={`filter-button ${
              activeFilter === "unpaid" ? "active" : ""
            } border-noround`}
            onClick={() => setActiveFilter("unpaid")}
            badge={unpaidCount.toString()}
            badgeClassName="p-badge-danger"
          />
          <Button
            label="Action Required"
            className={`filter-button ${
              activeFilter === "failed" ? "active" : ""
            } border-noround`}
            onClick={() => setActiveFilter("failed")}
            badge={failedCount.toString()}
            badgeClassName="p-badge-warning"
          />
        </div>
        <div className="flex align-items-center gap-5">
          <div>
            {[
              {
                filter: "all",
                filteredCount: filteredCount,
                totalCount: allCount,
                color: "green",
              },
              {
                filter: "paid",
                filteredCount: filteredPaidCount,
                totalCount: paidCount,
                color: "green",
              },
              {
                filter: "unpaid",
                filteredCount: filteredUnpaidCount,
                totalCount: unpaidCount,
                color: "green",
              },
              {
                filter: "failed",
                filteredCount: filteredFailedCount,
                totalCount: failedCount,
                color: "green",
              },
            ].map(({ filter, filteredCount, totalCount, color }) =>
              activeFilter === filter ? (
                <>
                  Showing&nbsp;
                  <span style={{ color, fontWeight: "bold" }}>
                    {filteredCount}
                  </span>
                  &nbsp;out of&nbsp;
                  <span style={{ color, fontWeight: "bold" }}>
                    {totalCount}
                  </span>
                </>
              ) : null
            )}
          </div>
          <IconField iconPosition="left">
            <InputIcon className="pi pi-search"> </InputIcon>
            <InputText
              placeholder="Search"
              variant="filled"
              onChange={onGlobalFilterChange}
            />
          </IconField>
        </div>
      </div>
    );
  };

  const paymentStatusBodyTemplate = (rowData: InvoiceModel) => {
    console.log(rowData);
    return (
      <Tag
        value={rowData.invoicePaymentStatus}
        severity={
          rowData.invoicePaymentStatus === "Paid"
            ? "success"
            : rowData.invoicePaymentStatus === "Overdue"
            ? "warning"
            : rowData.invoicePaymentStatus === "Unpaid"
            ? "danger"
            : "info"
        }
      />
    );
  };
  const statusBodyTemplate = (rowData: InvoiceModel) => (
    <Tag
      value={
        rowData.invoiceStatus === "Failed"
          ? "Action Required"
          : rowData.invoiceStatus
      }
      severity={rowData.invoiceStatus === "Failed" ? "danger" : "info"}
    />
  );
  const updateInvoice = async (
    existingInvoice: InvoiceModel,
    action: string
  ) => {
    const updatedInvoice = {
      ...existingInvoice,
      invoiceStatus: action,
    };
    const clientDetail = await clientService.getOnlyClientInvoice(
      updatedInvoice.clientId
    );

    if (clientDetail) {
      const updatedClient = {
        ...clientDetail,
        invoices: clientDetail.invoices
          ? clientDetail.invoices.map((invoice: any) =>
              invoice.id === updatedInvoice.id ? updatedInvoice : invoice
            )
          : [updatedInvoice],
      };
      await clientService.updateClient(updatedClient);
      toast.current?.show({
        severity: "success",
        summary: "Success",
        detail: "Invoice sent successfully",
      });
      setInvoices((prevInvoices) =>
        prevInvoices.map((invoice) =>
          invoice.id === updatedInvoice.id ? updatedInvoice : invoice
        )
      );
    }
  };

  const actionTemplate = (rowData: InvoiceModel) => {
    const isSent = rowData.invoiceStatus === "Sent";
    const items = [
      ...(isSent
        ? []
        : [
            {
              label: "Send",
              icon: "pi pi-send",
              command: () => {
                updateInvoice(rowData!, "Sent");
              },
            },
          ]),
      {
        label: "Edit",
        icon: "pi pi-pencil",
        command: () => {
          navigate(`/Invoice?invoiceId=${rowData.id}&clientId=${rowData.clientId}`);
        },
      },
      {
        label: "Send Reminder",
        icon: "pi pi-bell",
        command: () => {
          toast.current?.show({
            severity: "info",
            summary: "Reminder",
            detail: "Reminder Sent",
          });
        },
      },
    ];

    const handleMenuToggle = (event: React.MouseEvent) => {
      const menu = menuRefs.current.get(rowData.id);
      menu?.toggle(event);
    };

    return (
      <>
        <Menu
          model={items}
          aria-disabled={isEditable}
          popup
          ref={(el) => {
            if (el) menuRefs.current.set(rowData.id, el);
          }}
          id={`popup_menu_${rowData.id}`}
        />
        <Button
          icon="pi pi-ellipsis-h"
          className="mr-2"
          onClick={handleMenuToggle}
          aria-controls={`popup_menu_${rowData.id}`}
          aria-haspopup
          rounded
          disabled={isEditable}
          text
        />
      </>
    );
  };

  const filteredInvoices = invoices.filter((invoice) => {
    const status = invoice.invoicePaymentStatus?.toLowerCase();
    const Invoicestatus = invoice.invoiceStatus?.toLowerCase();
    const searchTerm = globalFilterValue.toLowerCase();
    const totalAmountStr = invoice.totalAmount.toFixed(2);
  
    const isMatch = (
      invoice.invoiceNumber.toLowerCase().includes(searchTerm) ||
      invoice.companyName?.toLowerCase().includes(searchTerm) ||
      status.includes(searchTerm) ||
      Invoicestatus.includes(searchTerm) ||
      totalAmountStr.includes(searchTerm)
    );
  
    if (!isMatch) return false;
  
    if (activeFilter === "paid") return status === "paid";
    if (activeFilter === "unpaid") return status === "unpaid";
    if (activeFilter === "failed") return Invoicestatus === "failed";
    
    return true;
  });

  return (
    <div className="invoice-history surface-0 px-4 shadow-2 border-round">
      <Toast ref={toast} />
      {!isDashboardView && (
        <div className="text-4xl font-semibold text-600 pt-3 mb-2 flex justify-content-between align-items-center">
          Invoices
          <Button
            label="New Invoice"
            icon="pi pi-plus"
            className="p-button-primary gap-2"
            disabled={isEditable}
            onClick={handleCreateInvoice}
          />
        </div>
      )}
      <DataTable
        value={filteredInvoices}
        paginator
        rows={5}
        rowsPerPageOptions={[5, 10, 25, 50]}
        dataKey="id"
        filters={filters}
        loading={loading}
        globalFilterFields={[
          "invoiceNumber",
          "companyName",
          "invoicePaymentStatus",
          "totalAmount",
          "billingPeriodStart",
          "dueDate",
          "Status"

        ]}
        header={renderHeader()}
        emptyMessage={
          <span style={{ fontSize: "20px", fontStyle: "italic" }}>
            No Invoices found.
          </span>
        }
        rowClassName={rowClassName}
        selectionMode="single"
        onRowClick={handleRowClick}
      >
        <Column field="invoiceNumber" header="Invoice Number" />
        <Column field="companyName" header="Client" />
        <Column
          field="billingPeriodStart"
          header="Billing Period"
          body={(rowData) =>
            `${new Date(
              rowData.billingPeriodStart
            ).toLocaleDateString("en-US")} - ${new Date(
              rowData.billingPeriodEnd
            ).toLocaleDateString("en-US")}`
          }
        />
        <Column
          field="dueDate"
          header="Due Date"
          body={(rowData) => new Date(rowData.dueDate).toLocaleDateString("en-US")}
        />
        <Column field="Status" header="Status" body={statusBodyTemplate} />
        <Column
          field="invoicePaymentStatus"
          header="Payment Status"
          body={paymentStatusBodyTemplate}
        />
        <Column
          field="totalAmount"
          header="Total Amount"
          body={(rowData) => `$ ${rowData.totalAmount.toFixed(2)}`}
        />
        <Column body={(rowData) => actionTemplate(rowData)} />
      </DataTable>
    </div>
  );
};

export default InvoiceHistoryPage;
