import React, { useState, useEffect, useRef } from "react";
import { DataView } from "primereact/dataview";
import { Tag } from "primereact/tag";
import { classNames } from "primereact/utils";
import ClientModel from "../../models/ClientModel";
import { Avatar } from "primereact/avatar";
import { BaseClientService } from "../../services/baseServices/BaseClientService";
import { useNavigate } from "react-router-dom";
import { Ripple } from "primereact/ripple";
import { Button } from "primereact/button";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import { InputText } from "primereact/inputtext";
import {
  DataTable,
  DataTableFilterMeta,
  DataTableRowClickEvent,
} from "primereact/datatable";
import { FilterMatchMode } from "primereact/api";
import { Column } from "primereact/column";
import "../../assets/styles/ClientsListPage.scss";
import { Toast } from "primereact/toast";
import { Menu } from "primereact/menu";

interface ClientsListPage {
  isDashboardView?: boolean;
}

const ClientsListPage: React.FC<ClientsListPage> = ({ isDashboardView }) => {
  const navigate = useNavigate();
  const clientService = new BaseClientService();
  const menuLeft = useRef<any>(null);
  const toast = useRef<Toast>(null);
  const [clients, setClients] = useState<ClientModel[]>([]);
  const [globalFilterValue, setGlobalFilterValue] = useState<string>("");
  const [filters, setFilters] = useState<DataTableFilterMeta>({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  });

  useEffect(() => {
    getclients();
  }, []);

  const getclients = () => {
    clientService.getAllClients().then((data) => {
      setClients(data);
    });
  };
 
  // Function to calculate the counts for Paid, Unpaid, and total invoices
  const calculateInvoiceCounts = (client: ClientModel) => {
    const paidCount = client.invoices!.filter(
      (invoice) => invoice.invoicePaymentStatus === "Paid"
    ).length;
    const unpaidCount = client.invoices!.filter(
      (invoice) => invoice.invoicePaymentStatus === "Unpaid"
    ).length;
    const totalCount = client.invoices!.length;

    return { paidCount, unpaidCount, totalCount };
  };

  const itemTemplate = (clients: ClientModel, index: number) => {
    const { paidCount, unpaidCount, totalCount } =
      calculateInvoiceCounts(clients);

    const handleClientDetail = (client: ClientModel) => {
      navigate(`/Client?clientId=${client.id}`);
    };

    return (
      <div className="col-12" key={clients.id}>
        <div
          className={classNames(
            "  hover:bg-blue-100 cursor-pointer p-ripple  flex flex-column xl:flex-row xl:align-items-center p-3 gap-4 border-round",
            { "border-top-1 surface-border": index !== 0 }
          )}
          onClick={() => handleClientDetail(clients)}
        >
          <Avatar
            label={`${clients.companyName[0]}`}
            size="large"
            style={{ backgroundColor: "#2196F3", color: "#ffffff" }}
            shape="circle"
          />

          <div className="flex flex-column sm:flex-row justify-content-between align-items-center xl:align-items-start flex-1 gap-4">
            <div className="flex flex-column align-items-center sm:align-items-start">
              <div className="text-2xl text-500 mb-2">
                {clients.companyName}
              </div>
              <div className="text-1xl font-normal text-500">
              {clients?.city}, {clients?.zip}, {clients?.country}
              </div>
            </div>
            <div className="flex sm:flex-raw align-items-center sm:align-items-end gap-3 sm:gap-2">
              <span className="text-1xl font-semibold">Invoices</span>
              <div className="flex align-items-center gap-3">
                <span className="flex align-items-center gap-2">
                  <Tag
                    value={`Paid ${paidCount}`}
                    severity="success"
                    rounded
                  ></Tag>
                  <Tag
                    value={`Unpaid ${unpaidCount}`}
                    severity="warning"
                    rounded
                  ></Tag>
                  <Tag
                    value={`All ${totalCount}`}
                    severity="info"
                    rounded
                  ></Tag>
                </span>
              </div>
            </div>
          </div>
          <Ripple />
        </div>
      </div>
    );
  };

  const renderHeader = () => (
    <div className="flex justify-content-end">
      <IconField iconPosition="left">
        <InputIcon className="pi pi-search"> </InputIcon>
        <InputText
          placeholder="Search"
          variant="filled"
          onChange={onGlobalFilterChange}
        />
      </IconField>
    </div>
  );
  const onGlobalFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
     const value = e.target.value;
     setFilters((prevFilters) => ({
       ...prevFilters,
       global: { ...prevFilters.global, value },
     }));
     setGlobalFilterValue(value.toLowerCase());
   };

  const filteredClients = clients.filter((client) => {
    const searchTerm = globalFilterValue.toLowerCase();
    const companyName = client.companyName?.toLowerCase();
    if (
      searchTerm &&
      !(
        companyName.includes(searchTerm) || client.streetAddress?.toLowerCase().includes(searchTerm) ||
        client.state?.toLowerCase().includes(searchTerm) || client.country?.toLowerCase().includes(searchTerm) || client.zip?.toLowerCase().includes(searchTerm)
      )
    ) {
      return false;
    }
    return true;
  });

  const handleRowClick = (event: DataTableRowClickEvent) => {
    const rowData = event.data as ClientModel;
    const clientId = rowData.id;
    navigate(`/Client?clientId=${clientId}`);
  };
  const handleAddClient = () => {
    navigate(`/Client`);
  };
  const invoicesBodyTemplate = (rowData: ClientModel) => {
    const { paidCount, unpaidCount, totalCount } =
      calculateInvoiceCounts(rowData);
    return (
      <div className="flex align-items-center gap-3">
        <span className="flex align-items-center gap-2">
          <Tag value={`All ${totalCount}`} severity="info" ></Tag>
          <Tag value={`Paid ${paidCount}`} severity="success" ></Tag>
          <Tag value={`Unpaid ${unpaidCount}`} severity="warning" ></Tag>
        </span>
      </div>
    );
  };

  const actionTemplate = (rowData: ClientModel) => {
    const items = [
      {
        label: "View",
        icon: "pi pi-eye",
        command: () => {
          navigate(`/Client?clientId=${rowData.id}`);
        },
      },
    ];
    return (
      <>
        <Menu
          model={items}
          popup
          ref={menuLeft}
          id="popup_menu_right"
          popupAlignment="right"
        />
        <Button
          icon="pi pi-ellipsis-h"
          className="mr-2 align-items-center"
          onClick={(event) => menuLeft.current.toggle(event)}
          aria-controls="popup_menu_right"
          aria-haspopup
          rounded
          text
        />
      </>
    );
  };
  return (
    <div className="client-list surface-0 px-4 shadow-2 border-round">
      {!isDashboardView && (
        <div className="text-4xl font-semibold text-600 pt-3 mb-2 flex justify-content-between align-items-center">
          Clients
          <Button
            label="New"
            icon="pi pi-plus"
            className="p-button-primary"
            onClick={handleAddClient}
          />
        </div>
      )}
        <DataTable
          value={filteredClients}
          paginator
          rows={5}
          rowsPerPageOptions={[5, 10, 25, 50]}
          dataKey="id"
          filters={filters}
          selectionMode="single"
          globalFilterFields={["companyName", "streetAddress", "city", "zip", "country"]}
          header={renderHeader()}
          onRowClick={handleRowClick}
          emptyMessage={<span style={{ fontSize: "20px", fontStyle: "italic" }}>No Clients found.</span>}
        >
          <Column
            header="Company Name"
            body={(rowData) => rowData.companyName}
          />
          <Column
            header="Address"
            body={(rowData) =>
              `${rowData.streetAddress}, ${rowData.city}, ${rowData.zip}, ${rowData.country}`
            }
          />
          <Column header="Invoices" body={invoicesBodyTemplate} />
          <Column  body={actionTemplate} />
        </DataTable>
    </div>
  );
};

export default ClientsListPage;
