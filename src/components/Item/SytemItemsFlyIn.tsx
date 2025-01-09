import { BaseInvoiceService } from "../../services/baseServices/BaseInvoiceService";
import React, { useEffect, useMemo, useRef, useState } from "react";
import InvoiceItemModel from "../../models/InvoiceItemModel";
import InvoiceModel from "../../models/InvoiceModel";
import "../../assets/styles/SystemItemsFlyIn.scss";
import { DataTable } from "primereact/datatable";
import ItemModel from "../../models/ItemModel";
import { Calendar } from "primereact/calendar";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { Tag } from "primereact/tag";
import { BaseClientService } from "../../services/baseServices/BaseClientService";

interface SystemItemsFlyInProps {
  itemsDataInput: ItemModel[];
  onAddInvoiceItem: (item: InvoiceItemModel) => void;
  onAddAllInvoiceItems: (items?: InvoiceItemModel[]) => void;
  invoiceDetailInput: InvoiceModel;
  billingPeriod?: Date | null;
}

const SystemItemsFlyIn: React.FC<SystemItemsFlyInProps> = ({
  itemsDataInput,
  onAddInvoiceItem,
  onAddAllInvoiceItems,
  invoiceDetailInput,
  billingPeriod,
}) => {
  const invoiceService = new BaseInvoiceService();
  const clientService = new BaseClientService();
  const [invoiceItemsList, setSystemInvoiceItems] = useState<
    (InvoiceItemModel & { billingPeriodStart: Date; billingPeriodEnd: Date })[]
  >([]);
  const [highlightedRows, setHighlightedRows] = useState<string[]>([]);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>();
  const isStorybook = process.env.STORYBOOK === "true";
  const toast = useRef<Toast>(null);

  useEffect(() => {
    getAllInvoices();
    if (invoiceDetailInput?.billingPeriodStart) {
      setStartDate(new Date(invoiceDetailInput.billingPeriodStart));
      if (invoiceDetailInput?.billingPeriodEnd) {
        setEndDate(new Date(invoiceDetailInput.billingPeriodEnd));
      } else {
        const nextDate = new Date();
        nextDate.setDate(nextDate.getDate() + 1);
        setEndDate(nextDate);
      }
    }
  }, [invoiceDetailInput]);

  const getAllInvoices =async () => {
    
    try {
      const clients = await clientService.getAllClients();
  
      const invoices = clients
        .flatMap((client) => client.invoices || []) 
        .filter((invoice) => invoice); 
  
      const flattenedInvoiceItems = invoices
        .flatMap((invoice) =>
          invoice.invoiceItemList.map((item) => ({
            ...item,
            billingPeriodStart: invoice.billingPeriodStart,
            billingPeriodEnd: invoice.billingPeriodEnd,
          }))
        );
  
      setSystemInvoiceItems(
        flattenedInvoiceItems as (InvoiceItemModel & {
          billingPeriodStart: Date;
          billingPeriodEnd: Date;
        })[]
      );
    } catch (error) {
      console.error("Error fetching invoices: ", error);
    }
  };

  const filteredItems = invoiceItemsList?.filter((item) => {
    const billingPeriodStart = new Date(item.billingPeriodStart);
    const billingPeriodEnd = new Date(item.billingPeriodEnd);
    const isAfterStartDate = startDate ? billingPeriodStart >= startDate : true;
    const isBeforeEndDate = endDate ? billingPeriodEnd <= endDate : true;
    return isAfterStartDate && isBeforeEndDate;
  });

  const isItemInBothLists = (itemId: string) => {
    return itemsDataInput?.some((item) => item.id === itemId);
  };

  const itemStatusTemplate = (rowData: InvoiceItemModel) => {
    const isOnInvoice = isStorybook
      ? highlightedRows.includes(rowData.itemModel.id)
      : isItemInBothLists(rowData.itemModel.id);

    return (
      <Tag
        value={isOnInvoice ? "On Invoice" : "Not on Invoice"}
        severity={isOnInvoice ? "success" : "danger"}
      />
    );
  };

  const actionTemplate = (
    rowData: InvoiceItemModel & {
      billingPeriodStart: Date;
      billingPeriodEnd: Date;
    }
  ) => {
    const currentDate = new Date(); // Current date
    const isBillingStartInPast =
      new Date(rowData.billingPeriodStart) < currentDate;

    const isDisabled = isStorybook
      ? highlightedRows.includes(rowData.itemModel.id)
      : isItemInBothLists(rowData.itemModel.id) || isBillingStartInPast; // Add yellow condition

    return (
      <Button
        icon="pi pi-plus"
        className="p-button-rounded p-button-text p-button-primary"
        onClick={() => handleAdd(rowData)}
        tooltip={
          isBillingStartInPast
            ? "Cannot add items with past billing start date"
            : "Add Item"
        }
        tooltipOptions={{ position: "top" }}
      />
    );
  };

  const handleAdd = (rowData: InvoiceItemModel) => {
    const newItem: InvoiceItemModel = {
      id: rowData.id,
      itemModel: rowData.itemModel,
      quantity: rowData.quantity,
      createdDate: rowData.createdDate,
    };
    if (isStorybook) {
      toast.current?.show({
        severity: "success",
        summary: "Success",
        detail: "Item added successfully!",
      });
      setHighlightedRows((prev) => [...prev, rowData.itemModel.id]);
    } else {
      onAddInvoiceItem(newItem);
    }
  };

  const handleAddAll = () => {
    const missingItems = invoiceItemsList?.filter(
      (item) => !isItemInParent(item.itemModel.id)
    );
    if (isStorybook) {
      toast.current?.show({
        severity: "success",
        summary: "Success",
        detail: "All items added successfully!",
      });
      setHighlightedRows((prev) => [
        ...prev,
        ...invoiceItemsList.map((item) => item.itemModel.id),
      ]);
    } else {
      onAddAllInvoiceItems(missingItems);
    }
  };

  const rowClassName = (
    data: InvoiceItemModel & {
      billingPeriodStart: Date;
      billingPeriodEnd: Date;
    }
  ) => {
    const currentDate = new Date(); // Get the current date
    const isBillingStartInPast =
      new Date(data.billingPeriodStart) < currentDate;

    return {
      "row-yellow": isBillingStartInPast, // Highlight yellow if billing start date is in the past
      "row-red": isStorybook
        ? !highlightedRows.includes(data.itemModel.id)
        : !isItemInBothLists(data.itemModel.id),
    };
  };

  const isItemInParent = (itemId: string) => {
    return itemsDataInput?.some((item) => item.id === itemId);
  };

  const isAddAllDisabled = useMemo(() => {
    if (isStorybook) {
      const allHighlighted = invoiceItemsList.every((item) =>
        highlightedRows.includes(item.itemModel.id)
      );
      return allHighlighted;
    } else {
      const hasMissingItems = invoiceItemsList?.some(
        (item) => !isItemInParent(item.itemModel.id)
      );
      return !hasMissingItems;
    }
  }, [invoiceItemsList, itemsDataInput, highlightedRows, isStorybook]);

  return (
    <div className="system-items-flyin">
      <Toast ref={toast} />
      <div className="flex flex-wrap gap-3 p-fluid mb-6">
        <div className="flex-auto">
          <label htmlFor="startDate" className="font-bold block mb-2">
            Start Date
          </label>
          <Calendar
            id="startDate"
            value={startDate}
            onChange={(e) => setStartDate(e.value as Date)}
            showIcon
            style={{ width: "100%" }}
            placeholder="Select Start Date"
          />
        </div>
        <div className="flex-auto">
          <label htmlFor="endDate" className="font-bold block mb-2">
            End Date
          </label>
          <Calendar
            id="endDate"
            value={endDate}
            onChange={(e) => setEndDate(e.value as Date)}
            showIcon
            style={{ width: "100%" }}
            placeholder="Select End Date"
          />
        </div>
      </div>
      <div className="flex justify-content-end">
        <Button
          label="Add All"
          icon="pi pi-plus"
          className="p-button-primary gap-2"
          onClick={handleAddAll}
          disabled={isAddAllDisabled}
        />
      </div>
      <DataTable
        value={filteredItems}
        className="p-datatable-sm p-datatable-gridlines mt-4"
        responsiveLayout="scroll"
        rowClassName={rowClassName}
      >
        <Column field="itemModel.name" header="Item Name" />
        <Column field="itemModel.number" header="Item Number" />
        <Column
          field="itemModel.price"
          header="Price"
          body={(rowData) => `$${rowData.itemModel.price.toFixed(2)}`}
        />
        <Column field="quantity" header="Quantity" />
        <Column header="Status" body={itemStatusTemplate} />
        <Column header="Action" body={actionTemplate} />
      </DataTable>
    </div>
  );
};

export default SystemItemsFlyIn;
