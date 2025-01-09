import { BaseInvoiceService } from "../services/baseServices/BaseInvoiceService";
import { BaseClientService } from "../services/baseServices/BaseClientService";
import AddCustomItemComponent from "../components/Item/AddCustomItemComponent";
import { InvoiceService } from "../services/mockServices/InvoiceService";
import SystemItemsFlyIn from "../components/Item/SytemItemsFlyIn";
import Settings from "../components/ClientDetails/ClientSettings";
import { Accordion, AccordionTab } from "primereact/accordion";
import { useLocation, useNavigate } from "react-router-dom";
import React, { useState, useRef, useEffect } from "react";
import InvoiceItemModel from "../models/InvoiceItemModel";
import "../assets/styles/CreateInvoicePage.scss";
import { DataTable } from "primereact/datatable";
import ClientModel from "../models/ClientModel";
import { Dropdown } from "primereact/dropdown";
import { Sidebar } from "primereact/sidebar";
import { Avatar } from "primereact/avatar";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { Column } from "primereact/column";
import { Toast } from "primereact/toast";
import { Menu } from "primereact/menu";
import "../assets/styles/base.scss";
import InvoiceModel from "../models/InvoiceModel";
import AutomationSetting from "../models/AutomationSetting";

const CreateInvoicePage: React.FC = () => {
  const navigate = useNavigate();
  const invoiceService = new BaseInvoiceService();
  const clientService = new BaseClientService();
  const [selectedCustomer, setSelectedCustomer] =
    useState<ClientModel | null>();
  const [InvoiceItems, setInvoiceItems] = useState<InvoiceItemModel[]>([]);
  const [automationSetting, setAutomationSetting] =
    useState<AutomationSetting | null>(null);

  const [isCustomDialogOpen, setIsCustomDialogOpen] = useState(false);
  const processedClientIds = useRef<Set<string>>(new Set());
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [clients, setClients] = useState<ClientModel[]>([]);
  const [invoiceDetail, setInvoiceDetail] = useState<InvoiceModel | null>(null);
  const [isSent, setSent] = useState<boolean>(false);

  const [loader, setLoader] = useState(false);

  const [selectedOptions, setSelectedOptions] = useState<any>({
    IsAutomaticallyCreateInvoice: false,
    IsAutomaticallyBuildInvoice: false,
    IsAutomaticallySendInvoice: false,
  });
  const location = useLocation();
  const [selectedEmails, setSelectedEmails] = useState<any>([]);
  const [date, setDate] = useState<Date | null>(null);
  const toast = useRef<Toast>(null);
  const [processedRows, setProcessedRows] = useState<string[]>([]);
  const queryParams = new URLSearchParams(location.search);
  const clientId = queryParams.get("clientId");
  const invoiceId = queryParams.get("invoiceId");

  const menu = React.useRef<any>(null);

  useEffect(() => {
    if (clientId) {
      getClientDetailById(clientId, invoiceId!);
    }

    getclients();
  }, []);

  const getclients = () => {
    clientService.getAllClients().then((data) => {
      setClients(data);
    });
  };

  const getClientDetailById = async (clientId: string, invoiceId: string) => {
    try {
      if (processedClientIds.current.has(clientId)) {
        return; // Skip processing if already processed
      }
      processedClientIds.current.add(clientId);
  
      setLoader(true);
      const clientDetail = await clientService.getClientById(clientId);
  
      if (clientDetail) {
        setSelectedCustomer(clientDetail);
      } else {
        toast.current?.show({
          severity: "warn",
          summary: "Warning",
          detail: "Client not found.",
        });
      }
  
      const invoice = clientDetail?.invoices!.find(
        (invoice): invoice is InvoiceModel => invoice.id === invoiceId
      );
  
      if (invoice) {
        setInvoiceDetail(invoice);
        setAutomationSetting(invoice?.invoiceSetting || null);
        setInvoiceItems(invoice.invoiceItemList);
        setSent(invoice?.invoiceStatus === "Sent");
  
        if (invoice.clientId && !processedClientIds.current.has(invoice.clientId)) {
          await getClientDetailById(invoice.clientId, invoiceId);
        }
      } else {
        toast.current?.show({
          severity: "warn",
          summary: "Warning",
          detail: "Invoice not found.",
        });
      }
    } catch (error) {
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: "Failed to fetch client details.",
      });
    } finally {
      setLoader(false);
    }
  };

  const handleSelectCustomer = (e: any) => {
    debugger;
    const clientdetails = e.value;
    setSelectedCustomer(clientdetails);
    setAutomationSetting(clientdetails.automationSetting);
  };

  const handleSaveInvoice = async (action: string) => {
    setLoader(true);
    try {
      const clientDetail = await clientService.getClientById(clientId!);
      const existingInvoice = invoiceId
        ? clientDetail?.invoices!.find((invoice): invoice is InvoiceModel => invoice.id === invoiceId)
        : null;

      if (existingInvoice) {
        existingInvoice.invoiceSetting = automationSetting;
        await updateInvoice(existingInvoice, action);
        toast.current?.show({
          severity: "success",
          summary: "Success",
          detail: "Invoice updated successfully!",
        });
      } else {
        const newInvoice = await generateInvoice(
          selectedCustomer!,
          InvoiceItems,
          total,
          subtotal,
          tax,
          action === "save" ? "Unpaid" : "Unpaid"
        );
        await addInvoiceToClient(newInvoice);
        toast.current?.show({
          severity: "success",
          summary: "Success",
          detail: "Invoice created successfully!",
        });
      }
      navigate("/Invoices");
    } catch (error) {
      console.error(error);
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: "Failed to save the invoice.",
      });
    } finally {
      setLoader(false);
    }
  };
  const addInvoiceToClient = async (invoice: InvoiceModel) => {
    const clientDetail = await clientService.getOnlyClientInvoice(
      invoice.clientId
    );

    if (clientDetail) {
      const updatedClient = {
        ...clientDetail,
        invoices: [...(clientDetail.invoices || []), invoice],
      };
      await clientService.updateClient(updatedClient);
      // for updating invoice json (for now)
      //await invoiceService.createInvoice(invoice);
    } else {
      toast.current?.show({
        severity: "warn",
        summary: "Warning",
        detail: "Client not found.",
      });
    }
  };

  const updateInvoice = async (
    existingInvoice: InvoiceModel,
    action: string
  ) => {
    const updatedInvoice = {
      ...existingInvoice,
      invoiceItemList: InvoiceItems,
      invoiceStatus: action === "save" ? "Created" : "Sent",
      totalAmount: total,
      subtotalAmount: subtotal,
      taxAmount: tax,
      modifiedDate: new Date(),
    };

   // await invoiceService.updateInvoice(updatedInvoice);
    const clientDetail = await clientService.getOnlyClientInvoice(
      updatedInvoice.clientId
    );

    if (clientDetail) {
      const updatedClient = {
        ...clientDetail,
        invoices: clientDetail.invoices
          ? clientDetail.invoices.map((invoice) =>
              invoice.id === updatedInvoice.id ? updatedInvoice : invoice
            )
          : [updatedInvoice],
      };
      await clientService.updateClient(updatedClient);
    }
  };

  const generateInvoice = async (
    selectedCustomer: ClientModel,
    clientInvoiceItems: InvoiceItemModel[],
    total: number,
    subtotal: number,
    tax: number,
    status: string
  ): Promise<InvoiceModel> => {
    const guid = crypto.randomUUID();
    return {
      id: guid,
      invoiceNumber: `INV-${Date.now()}`,
      createdDate: new Date(),
      dueDate: new Date(new Date().setDate(new Date().getDate() + 30)),
      isReminder: false,
      totalAmount: total,
      subtotalAmount: subtotal,
      taxAmount: tax,
      invoiceStatus: "Created",
      invoicePaymentStatus: status,
      clientId: selectedCustomer.id,
      companyName: selectedCustomer.companyName,
      billingPeriodStart: new Date(),
      billingPeriodEnd: new Date(new Date().setDate(new Date().getDate() + 30)),
      invoiceItemList: clientInvoiceItems,
      invoiceSetting: automationSetting,
    };
  };

  const handleAddItemClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    menu.current?.toggle(event);
  };

  const handleAddCustomItem = () => {
    setIsCustomDialogOpen(true);
  };

  const handleAddItemFromSystem = () => {
    debugger;
    console.log(invoiceDetail);
    setIsSidebarOpen(true);
  };

  const handleAddInvoiceItem = (newItem: InvoiceItemModel) => {
    setInvoiceItems([...InvoiceItems, newItem]);
    toast.current?.show({
      severity: "success",
      summary: "Success",
      detail: "Item added successfully",
    });
  };

  const handleAddAllInvoiceItems = (newItems?: InvoiceItemModel[]) => {
    setLoader(true);
    if (newItems && newItems.length > 0) {
      setInvoiceItems((prevItems) => [...prevItems, ...newItems]);
      setTimeout(() => {
        setIsSidebarOpen(false);
        toast.current?.show({
          severity: "success",
          summary: "Success",
          detail: "All Items added successfully",
        });
        setLoader(false);
      }, 1000);
    }
  };

  const addItem = (newItem: InvoiceItemModel) => {
    setInvoiceItems([...InvoiceItems, newItem]);
    toast.current?.show({
      severity: "success",
      summary: "Success",
      detail: "Item added successfully",
    });
  };

  const removeItem = (indexToRemove: number) => {
    setInvoiceItems(InvoiceItems.filter((_, index) => index !== indexToRemove));
    toast.current?.show({
      severity: "success",
      summary: "Success",
      detail: "Item removed successfully",
    });
  };

  const calculateSubtotal = () =>
    InvoiceItems.reduce(
      (total, item) => total + item.itemModel.price * item.quantity,
      0
    );
  const subtotal = calculateSubtotal();
  const tax = subtotal * 0.17;
  const total = subtotal + tax;

  const itemTemplate = (option: ClientModel) => (
    <div className="customer-card flex align-items-center gap-2">
      <Avatar
        label={`${option.companyName[0]}`}
        shape="circle"
        style={{ backgroundColor: "#1c92d2", color: "#fff" }}
      />
      <div className="customer-info">
        <span>
          {`${option.companyName}`} - {option.streetAddress}, {option.city},{" "}
          {option.zip}, {option.country}
        </span>
      </div>
    </div>
  );

  const valueTemplate = (option: ClientModel | null) => {
    if (!option) return <span>Select Client</span>;
    return (
      <div className="selected-customer flex gap-2 align-items-center">
        <Avatar
          label={`${option.companyName[0]}`}
          shape="circle"
          style={{ backgroundColor: "#1c92d2", color: "#fff" }}
        />
        <div className="customer-info">
          <span>
            {`${option.companyName}`} - {option.streetAddress}, {option.city},{" "}
            {option.zip}, {option.country}
          </span>
        </div>
      </div>
    );
  };

  const handleSaveSettings = () => {
    toast.current?.show({
      severity: "success",
      summary: "Success",
      detail: "Cliens setting saved",
    });
  };

  const handleBackToDashboard = () => {
    if (clientId) {
      navigate(`/Client?clientId=${clientId}`);
    } else {
      navigate("/dashboard");
    }
  };

  const addItemToSystem = (rowData: InvoiceItemModel) => {
    setTimeout(() => {
      setProcessedRows((prevProcessedRows) => [
        ...prevProcessedRows,
        rowData.id,
      ]);
      toast.current?.show({
        severity: "success",
        summary: "Item Synced",
        detail: `Item ${rowData.itemModel.name} added to system successfully!`,
      });
    }, 1000);
  };
  const rowClassName = (rowData: InvoiceItemModel) => {
    if (processedRows.includes(rowData.id)) {
      return "";
    }
    return { "row-red": rowData.id === "1005" };
  };

  return (
    <div className="surface-0 p-4 shadow-2 border-round">
      <Toast ref={toast} />
      <div className="text-4xl sm:text-3xl text-600 mb-3 flex align-items-center">
        <i
          className="pi pi-angle-left text-blue-500"
          style={{ fontSize: "2.2rem" }}
          onClick={handleBackToDashboard}
        ></i>
        Invoice
      </div>

      <div className="flex flex-column sm:flex-row gap-6">
        {/* Bill To Dropdown Section */}
        <div className="mb-3 w-full sm:w-6 lg:w-8 shadow-2 border-round p-4 h-auto sm:h-12rem">
          <div className="flex flex-row gap-2 mb-2">
            <i className="pi pi-calendar text-blue-500 text-xl"></i>
            <span className="text-xl sm:text-lg font-semibold mb-2 text-600">
              Bill To:
            </span>
          </div>
          <Dropdown
            value={selectedCustomer}
            onChange={handleSelectCustomer}
            options={clients}
            optionLabel="firstName"
            placeholder="Select Client"
            filter
            disabled={invoiceId != null || clientId != null}
            className="full-width-dropdown"
            itemTemplate={itemTemplate}
            valueTemplate={() => valueTemplate(selectedCustomer!)}
            style={{ width: "100%", marginBottom: "1rem" }}
          />
        </div>

        {/* Invoice Details Section */}
        <div className="mb-3 w-full sm:w-6 lg:w-4 shadow-2 border-round p-4 h-auto gap-2 sm:h-12rem">
          <div className="flex flex-column">
            <div className="flex flex-row gap-2 mb-2">
              <span className="text-xl sm:text-lg font-semibold mb-2 text-600">
                Invoice Details:
              </span>
            </div>
            <div className="flex flex-row mb-2 gap-5 sm:gap-3">
              <span className="font-normal text-500 text-sm sm:text-base">
                Invoice Number:
              </span>
              <span className="font-semibold text-sm sm:text-base">
                {invoiceDetail
                  ? invoiceDetail.invoiceNumber
                  : "No Invoice Available"}
              </span>
            </div>
            <div className="flex flex-row mb-2 gap-5 sm:gap-3">
              <span className="font-normal text-500 text-sm sm:text-base">
                Invoice Date:
              </span>
              <span className="font-semibold text-sm sm:text-base">
                {invoiceDetail
                  ? new Date(invoiceDetail.createdDate).toLocaleDateString()
                  : "No Date Available"}
              </span>
            </div>

            <div className="flex flex-row mb-2 gap-3 sm:gap-3">
              <span className="font-normal text-500 text-sm sm:text-base">
                Due Date:
              </span>
              <span className="font-semibold text-sm sm:text-base">
                {invoiceDetail
                  ? new Date(invoiceDetail.dueDate).toLocaleDateString()
                  : "No Date Available"}
              </span>
            </div>

            <div className="flex flex-row gap-3 sm:gap-3">
              <span className="font-normal text-500 text-sm sm:text-base">
                Billing Period:
              </span>
              <span className="font-semibold text-sm sm:text-base">
                {`${
                  invoiceDetail
                    ? new Date(
                        invoiceDetail.billingPeriodStart
                      ).toLocaleDateString()
                    : "No Date"
                } - ${
                  invoiceDetail
                    ? new Date(
                        invoiceDetail.billingPeriodEnd
                      ).toLocaleDateString()
                    : "No Date"
                }`}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-column shadow-2 border-round p-4 mb-3">
        <div className="item-list flex justify-content-between align-items-center mb-2">
          <div className="flex flex-row gap-2">
            <i className="pi pi-objects-column text-blue-500 text-xl"></i>
            <span className="text-xl sm:text-lg font-semibold mb-2 text-600">
              Items
            </span>
          </div>
          <Button
            label="Add Item"
            icon="pi pi-plus"
            onClick={handleAddItemClick}
            className="p-button-primary gap-2"
            disabled={!selectedCustomer || isSent}
          />
          <Menu
            model={[
              {
                label: "Add Custom Item",
                icon: "pi pi-pencil",
                command: handleAddCustomItem,
                className: "gap-3",
              },
              {
                label: "Add Item From System",
                icon: "pi pi-database",
                command: handleAddItemFromSystem,
                className: "gap-3",
              },
            ]}
            popup
            ref={menu}
          />
        </div>
        <div className="item-list justify-content-between align-items-center mb-2">
          <DataTable
            value={InvoiceItems}
            responsiveLayout="scroll"
            rowClassName={rowClassName}
          >
            <Column header="#" body={(rowData, { rowIndex }) => rowIndex + 1} />
            <Column
              field="itemModel.name"
              header="Item Name"
              className="font-bold border-round"
            />
            <Column
              field="itemModel.price"
              header="Price"
              body={(rowData) => `$${rowData.itemModel.price.toFixed(2)}`}
            />
            <Column field="quantity" header="Quantity" />
            <Column
              header="Actions"
              body={(rowData, { rowIndex }) => (
                <div className="flex gap-2">
                  <Button
                    icon="pi pi-trash"
                    className="p-button-danger p-button-text"
                    onClick={() => removeItem(rowIndex)}
                    tooltip="Remove Item"
                    disabled={isSent}
                    tooltipOptions={{ position: "top" }}
                  />
                  <Button
                    icon="pi pi-sync"
                    className="p-button-primary p-button-text"
                    onClick={() => addItemToSystem(rowData)}
                    tooltip="Add Item To System"
                    tooltipOptions={{ position: "top" }}
                    disabled={rowIndex !== 0 || isSent}
                  />
                </div>
              )}
            />
          </DataTable>
        </div>
      </div>

      <div className="items-list flex flex-column sm:flex-row justify-content-between gap-3">
        {/* Invoice Settings Section */}
        <div className="items-list w-full sm:w-8 lg:w-6 flex-row border-round shadow-2 p-4">
          <div className="flex flex-row gap-2 mb-2">
            <i className="pi pi-cog text-blue-500 text-xl"></i>
            <span className="text-xl sm:text-lg font-semibold mb-2 text-600">
              Invoice Setting
            </span>
          </div>
          <div className="flex gap-6">
            <section className="w-full">
              <Accordion activeIndex={0}>
                <AccordionTab header="Settings">
                  <Toast ref={toast} />
                  <Settings
                    isSent={isSent}
                    setSelectedOptions={setSelectedOptions}
                    selectedContacts={selectedEmails}
                    setSelectedContacts={setSelectedEmails}
                    date={date}
                    setDate={setDate}
                    isEditable={false}
                    invoiceSetting={automationSetting}
                    contactInfo={selectedCustomer?.contacts!}
                    setAutomationSetting={setAutomationSetting}
                  />
                </AccordionTab>
              </Accordion>
            </section>
          </div>
        </div>

        {/* Invoice Summary Section */}
        <div className="border-round w-full sm:w-4 h-auto sm:h-full px-2">
          <div className="p-3 flex flex-column bg-blue-100 border-round shadow-2 justify-content-end mb-3">
            <div className="p-1 flex flex-row justify-content-between">
              <span className="font-bold text-600 text-lg">Subtotal</span>
              <span className="font-normal text-500 mb-1 text-lg">
                $ {subtotal.toFixed(2)}
              </span>
            </div>
            <div className="p-1 flex flex-row justify-content-between">
              <span className="font-bold text-600 mb-1 text-lg">TAX:</span>
              <span className="font-normal text-500 mb-1 text-lg">
                $ {tax.toFixed(2)}
              </span>
            </div>
            <div className="px-1 py-3 flex flex-row border-round justify-content-between">
              <span className="font-bold mb-1 text-lg">
                Invoice total (incl. Tax)
              </span>
              <span className="font-bold text-500 mb-1 text-lg">
                $ {total.toFixed(2)}
              </span>
            </div>
          </div>
          <div className="py-2 flex flex-row justify-content-end gap-2">
            {!isSent && (
              <>
                <Button
                  label="Save"
                  className="p-button-primary"
                  onClick={() => handleSaveInvoice("save")}
                  disabled={!selectedCustomer || InvoiceItems.length === 0}
                />
                <Button
                  label="Save & Send"
                  className="p-button-success"
                  onClick={() => handleSaveInvoice("send")}
                  disabled={!selectedCustomer || InvoiceItems.length === 0}
                />
              </>
            )}
          </div>
        </div>
      </div>

      {/* Dialogs */}
      <Dialog
        header="Add Custom Item"
        visible={isCustomDialogOpen}
        style={{ width: "50vw" }}
        onHide={() => setIsCustomDialogOpen(false)}
      >
        <AddCustomItemComponent onAddItem={addItem} />
      </Dialog>

      <Sidebar
        header="Add Item From System"
        visible={isSidebarOpen}
        onHide={() => setIsSidebarOpen(false)}
        position="right"
        style={{ width: "50vw" }}
      >
        <SystemItemsFlyIn
          itemsDataInput={InvoiceItems.map((x) => x.itemModel)}
          billingPeriod={invoiceDetail?.billingPeriodEnd}
          onAddInvoiceItem={handleAddInvoiceItem}
          onAddAllInvoiceItems={handleAddAllInvoiceItems}
          invoiceDetailInput={invoiceDetail!}
        />
      </Sidebar>
    </div>
  );
};

export default CreateInvoicePage;
