import React, { useState, useEffect, useRef } from "react";
import ClientModel from "../../models/ClientModel";
import Settings from "../../components/ClientDetails/ClientSettings";
import InvoiceList from "../../components/Invoice/InvoiceList";
import { Toast } from "primereact/toast";
import { useLocation, useNavigate } from "react-router-dom";
import { BaseClientService } from "../../services/baseServices/BaseClientService";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { FloatLabel } from "primereact/floatlabel";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Dialog } from "primereact/dialog";
import ContactsModel from "../../models/ContactsModel";
import { debounce } from "@mui/material";
import { InputMask, InputMaskChangeEvent } from "primereact/inputmask";
import InvoiceHistoryPage from "../InvoiceHistorypage";
import { InputNumber } from "primereact/inputnumber";
import AutomationSetting from "../../models/AutomationSetting";

export default function ClientDetailPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const clientService = new BaseClientService();
  const [client, setClient] = useState<ClientModel | null>();
  const [selectedOptions, setSelectedOptions] = useState<any>({
    IsCreateInvoice: false,
    IsBuildInvoice: false,
    IsSendInvoice: false,
  });
  const [saveButtonDisabled, setSaveDisabled] = useState<boolean>(true);
  const [automationSetting, setAutomationSetting] =
    useState<AutomationSetting | null>(null);
  const [selectedEmails, setSelectedEmails] = useState<any>([]);
  const [date, setDate] = useState<Date | null>(new Date());
  const [checked, setChecked] = useState<string>("");
  const [loader, setLoader] = useState(false);
  const [isEditable, setEditable] = useState(true);
  const toast = useRef<Toast>(null);
  const queryParams = new URLSearchParams(location.search);
  const clientId = queryParams.get("clientId");
  const [visible, setVisible] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [emailExists, setEmailExists] = useState(false);

  const [profileValidation, setProfileValidation] = useState({
    companyName: true,
    streetAddress: true,
    city: true,
    state: true,
    zip: true,
    country: true,
  });
  const [emailValidation, setEmailValidation] = useState(true);

  const guid = crypto.randomUUID();

  const [currentContact, setCurrentContact] = useState<ContactsModel>({
    id: "",
    clientId: client?.id || "",
    email: "",
    firstName: "",
    lastName: "",
    phoneNumber: null,
  });

  const defaultClient: ClientModel = {
    id: guid,
    companyName: "",
    image: null,
    phoneNumber: null,
    streetAddress: null,
    city: null,
    zip: null,
    state: null,
    country: null,
    contacts: [],
    invoices: [],
    automationSetting: null,
  };

  useEffect(() => {
    if (clientId) {
      getClientDetailById(clientId);
    } else {
      setClient(defaultClient);
      setEditable(false);
      setEditMode(false);
    }
  }, [clientId]);

  const getClientDetailById = async (id: string) => {
    try {
      setLoader(true);
      const clientDetail = await clientService.getClientById(id);
      if (clientDetail) {
        setClient(clientDetail);
        setAutomationSetting(clientDetail?.automationSetting!);
      } else {
        toast.current?.show({
          severity: "warn",
          summary: "Warning",
          detail: "Client not found.",
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

  const handleSaveSettings = () => {
    console.log("Settings saved:", {
      selectedOptions,
      selectedEmails,
      checked,
      date,
    });
    toast.current?.show({
      severity: "success",
      summary: "Success",
      detail: "Cliens setting saved",
    });
    setSaveDisabled(false);
    setEditable(!isEditable);
  };

  const validateClient = (client: ClientModel): boolean => {
    const validation = {
      companyName: !!client.companyName?.trim(),
      streetAddress: !!client.streetAddress?.trim(),
      city: !!client.city?.trim(),
      state: !!client.state?.trim(),
      zip: !!client.zip?.trim(),
      country: !!client.country?.trim(),
    };

    setProfileValidation(validation);
    return Object.values(validation).every((isValid) => isValid);
  };

  const validateEmail = (email: string): boolean => {
    const isValid =
      !!email?.trim() && /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email);
    setEmailValidation(isValid);
    return isValid;
  };
  const handleSaveClient = async () => {
    if (!client) return;
    if (!validateClient(client)) {
      toast.current?.show({
        severity: "error",
        summary: "Validation Error",
        detail: "Please fill out all required fields.",
      });
      return;
    }

    try {
      if (clientId) {
        client.automationSetting = automationSetting;
        if (client.invoices) {
          client.invoices = client.invoices.map((invoice) => ({
            ...invoice,
            invoiceSetting: automationSetting,
          }));
        }
        await clientService.updateClient(client);
        toast.current?.show({
          severity: "success",
          summary: "Success",
          detail: "Client updated successfully.",
        });
      } else {
        client.automationSetting = automationSetting;
        if (client.invoices) {
          client.invoices = client.invoices.map((invoice) => ({
            ...invoice,
            invoiceSetting: automationSetting,
          }));
        }
        await clientService.createClient(client);
        toast.current?.show({
          severity: "success",
          summary: "Success",
          detail: "Client added successfully.",
        });
        setTimeout(() => {
          navigate("/clients");
        }, 1000);
      }
      setEditable(!isEditable);
    } catch (error) {
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: "Failed to save client.",
      });
    }
  };
  const handleFieldChange = (field: string, value: string | number | null) => {
    if (client) {
      setClient({
        ...client,
        [field]: value,
      });
    }
  };

  const handleNewContactFieldChange = (
    field: keyof ContactsModel,
    value: string | number | null
  ) => {
    setCurrentContact((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleAddContact = () => {
    setCurrentContact({
      id: "",
      clientId: client?.id || "",
      email: "",
      firstName: "",
      lastName: "",
      phoneNumber: null,
    });
    setEditMode(false);
    setVisible(true);
    setEmailValidation(true);
  };
  const handleEditContact = (contact: ContactsModel) => {
    setCurrentContact({ ...contact });
    setEditMode(true);
    setVisible(true);
  };

  const handleSaveContact = () => {
    if (!currentContact) return;

    if (!validateEmail(currentContact!.email!)) {
      return;
    }
    const emailExists = client!.contacts!.some(
      (contact) => contact.email === currentContact.email
    );
    setEmailExists(emailExists);
    if (emailExists) {
      toast.current?.show({
        severity: "warn",
        summary: "Email",
        detail: "This email is already in use!",
      });
      return;
    }

    setClient((prevClient) => {
      if (!prevClient) return prevClient;

      let updatedContacts = prevClient.contacts || [];
      if (editMode) {
        // Update contact
        updatedContacts = updatedContacts.map((c) =>
          c.id === currentContact.id ? currentContact : c
        );
      } else {
        updatedContacts = [
          ...updatedContacts,
          { ...currentContact, id: guid, clientId: currentContact?.id },
        ];
      }

      return { ...prevClient, contacts: updatedContacts };
    });

    toast.current?.show({
      severity: "success",
      summary: editMode ? "Contact Updated" : "Contact Added",
      detail: `Contact ${editMode ? "updated" : "added"} successfully.`,
    });

    setVisible(false);
  };
  const isValidEmail = (email: string) => {
    return email !== "" || /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email);
  };

  const handleDeleteContact = (contactId: string) => {
    setClient((prevClient) => {
      if (!prevClient) return prevClient;

      const updatedContacts = (prevClient.contacts || []).filter(
        (c) => c.id !== contactId
      );
      const updatedAutomationSetting = prevClient.automationSetting
        ? {
            ...prevClient.automationSetting,
            sendTo: (prevClient.automationSetting.sendTo || []).filter(
              (contact) => contact.id !== contactId
            ),
          }
        : null;

        const updatedInvoices = (prevClient.invoices || []).map((invoice) => {
          if (invoice.invoiceSetting) {
            return {
              ...invoice,
              invoiceSetting: {
                ...invoice.invoiceSetting,
                sendTo: (invoice.invoiceSetting.sendTo || []).filter(
                  (contact) => contact.id !== contactId
                ),
              },
            };
          }
          return invoice;
        });
      setSelectedEmails(updatedContacts);
      setAutomationSetting(updatedAutomationSetting);
      return {
        ...prevClient,
        contacts: updatedContacts,
        automationSetting: updatedAutomationSetting,
        invoices: updatedInvoices,
      };
    });

    toast.current?.show({
      severity: "warn",
      summary: "Contact Deleted",
      detail: "Contact removed successfully.",
    });
  };
  const footerContent = (
    <div>
      <Button
        label="Cancel"
        onClick={() => setVisible(false)}
        className="p-button-text"
      />
      <Button label="Save" onClick={() => handleSaveContact()} autoFocus />
    </div>
  );
  if (!client) return <div>Loading...</div>;

  return (
    <div className="surface-0 p-4 shadow-2 border-round">
      <Toast ref={toast} />
      <div className="text-4xl font-normal text-600 mb-3  flex justify-content-between align-items-center">
        Client details
        <div className="">
          {isEditable && (
            <Button
              label="Edit"
              icon="pi pi-pencil"
              className="p-button-primary mr-2"
              
              onClick={() => {
                setEditable(!isEditable);
              }}
            />
          )}
          {!isEditable && (
            <>
              {/* {clientId && (
                <Button
                  label="New Invoice"
                  icon="pi pi-edit"
                  className="p-button-primary mr-2"
                  onClick={handleNewInvoice}
                />
              )} */}
              <Button
                label="Save"
                icon="pi pi-save"
                className="p-button-primary"
                onClick={handleSaveClient}
              />
            </>
          )}
        </div>
      </div>
      <div>
        <div className="flex flex-column gap-3">
          <div className="p-3 flex flex-column gap-2 border-round justify-content-start shadow-2 mb-2">
            <div className=" flex flex-row gap-2 mb-2">
              <i className="pi pi-user text-primary-500 text-xl"></i>
              <span className="text-600 mb-2">Profile</span>
            </div>
            <div className="flex-row flex gap-2 my-2">
              <FloatLabel>
                <InputText
                  id="companyName"
                  className={`w-full ${
                    !profileValidation.companyName ? "p-invalid" : ""
                  }`}
                  value={client.companyName}
                  disabled={isEditable}
                  onChange={(e) =>
                    handleFieldChange("companyName", e.target.value)
                  }
                />
                <label htmlFor="companyName">Company Name</label>
                {!profileValidation.companyName && (
                  <small className="p-error">Company Name is required.</small>
                )}
              </FloatLabel>
              <FloatLabel>
                <InputText
                  id="streetAddress"
                  className={`w-full ${
                    !profileValidation.streetAddress ? "p-invalid" : ""
                  }`}
                  value={client.streetAddress}
                  disabled={isEditable}
                  onChange={(e) =>
                    handleFieldChange("streetAddress", e.target.value)
                  }
                />
                <label htmlFor="streetAddress">Street Address</label>
                {!profileValidation.streetAddress && (
                  <small className="p-error">Street Address is required.</small>
                )}
              </FloatLabel>
              <FloatLabel>
                <InputText
                  id="city"
                  className={`w-full ${
                    !profileValidation.city ? "p-invalid" : ""
                  }`}
                  value={client.city}
                  disabled={isEditable}
                  onChange={(e) => handleFieldChange("city", e.target.value)}
                />
                <label htmlFor="city">City</label>
                {!profileValidation.city && (
                  <small className="p-error">City is required.</small>
                )}
              </FloatLabel>
              <FloatLabel>
                <InputText
                  id="state"
                  className={`w-full ${
                    !profileValidation.state ? "p-invalid" : ""
                  }`}
                  value={client.state}
                  disabled={isEditable}
                  onChange={(e) => handleFieldChange("state", e.target.value)}
                />
                <label htmlFor="state">State</label>
                {!profileValidation.state && (
                  <small className="p-error">State is required.</small>
                )}
              </FloatLabel>
              <FloatLabel>
                <InputText
                  id="zipCode"
                  className={`w-full ${
                    !profileValidation.zip ? "p-invalid" : ""
                  }`}
                  value={client.zip}
                  disabled={isEditable}
                  onChange={(e) => handleFieldChange("zip", e.target.value)}
                />
                <label htmlFor="zipCode">ZIP Code</label>
                {!profileValidation.zip && (
                  <small className="p-error">ZIP Code is required.</small>
                )}
              </FloatLabel>
              <FloatLabel>
                <InputText
                  id="country"
                  className={`w-full ${
                    !profileValidation.country ? "p-invalid" : ""
                  }`}
                  value={client.country}
                  disabled={isEditable}
                  onChange={(e) => handleFieldChange("country", e.target.value)}
                />
                <label htmlFor="country">Country</label>
                {!profileValidation.country && (
                  <small className="p-error">Country is required.</small>
                )}
              </FloatLabel>
              <FloatLabel>
                <label htmlFor="phoneNumber" className="block text-sm">
                  Phone number
                </label>
                <InputMask
                  id="phoneNumber"
                  placeholder="Enter phone number"
                  value={client?.phoneNumber?.toString() || ""}
                  disabled={isEditable}
                  onChange={(e) =>
                    handleFieldChange("phoneNumber", e.target.value || null)
                  }
                  className="w-full"
                  mask="(999) 999-9999"
                />
              </FloatLabel>
            </div>
          </div>
        </div>
        <div className="flex flex-column gap-3">
          <div className="p-3 flex flex-column gap-2 border-round justify-content-start shadow-2 mb-2">
            <div className=" flex flex-row justify-content-between align-items-center">
              <div className=" flex flex-row gap-2 mb-2">
                <i className="pi pi-address-book text-primary-500 text-xl"></i>
                <span className="text-600">Contact Info</span>
              </div>
              <Button
                icon="pi pi-plus"
                className="p-button-primary mr-2"
                label="New"
                disabled={isEditable}
                onClick={() => handleAddContact()}
              />
            </div>
            <div className="flex-row flex gap-2 my-2">
              <DataTable
                value={client.contacts || undefined}
                tableStyle={{ minWidth: "50rem" }}
              >
                <Column field="email" header="Email"></Column>
                <Column field="firstName" header="First name"></Column>
                <Column field="lastName" header="Last name"></Column>
                <Column field="phoneNumber" header="Phone number"></Column>
                <Column
                  header="Actions"
                  body={(rowData: ContactsModel) => (
                    <div className="flex gap-2">
                      <Button
                        icon="pi pi-pencil"
                        text
                        disabled={isEditable}
                        className="p-button-rounded p-button-info"
                        onClick={() => handleEditContact(rowData)}
                      />
                      <Button
                        icon="pi pi-trash"
                        text
                        disabled={isEditable}
                        className="p-button-rounded p-button-danger"
                        onClick={() => handleDeleteContact(rowData.id)}
                      />
                    </div>
                  )}
                ></Column>
              </DataTable>
            </div>
          </div>
        </div>
        <div className="grid">
          <div className="col-12">
            {/* <div className="p-3 border-round-sm  shadow-2">
              <div className="flex flex-row gap-2 mb-2 p-3 border-round-sm">
                <i className="pi pi-receipt text-primary-500 text-xl"></i>
                <span className="text-600 mb-2">Invoices</span>
              </div>
             
            </div> */}
            <InvoiceHistoryPage clientId={client?.id} isEditable={isEditable} />
          </div>
          <div className="col-12">
            <div className="p-3 border-round  shadow-2">
              {!loader ? (
                <Settings
                  setSelectedOptions={setSelectedOptions}
                  selectedContacts={selectedEmails}
                  setSelectedContacts={setSelectedEmails}
                  date={date}
                  setDate={setDate}
                  isEditable={isEditable}
                  contactInfo={client.contacts || []}
                  invoiceSetting={automationSetting}
                  setAutomationSetting={setAutomationSetting}
                />
              ) : (
                <div>Loading...</div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Dialog
        header="Contact Info"
        visible={visible}
        style={{ width: "50vw" }}
        onHide={() => {
          if (!visible) return;
          setVisible(false);
        }}
        footer={footerContent}
      >
        <div className="flex flex-row gap-2 mt-4 justify-content-center">
          <FloatLabel>
            <InputText
              id="contactfirstname"
              className="w-full md:w-20rem"
              value={currentContact.firstName}
              onChange={(e) =>
                handleNewContactFieldChange("firstName", e.target.value)
              }
            />
            <label htmlFor="contactfirstname">First Name</label>
          </FloatLabel>
          <FloatLabel>
            <InputText
              id="contactlastname"
              className="w-full md:w-20rem"
              value={currentContact.lastName}
              onChange={(e) =>
                handleNewContactFieldChange("lastName", e.target.value)
              }
            />
            <label htmlFor="contactlastname">Last Name</label>
          </FloatLabel>
        </div>
        <div className="flex-row flex gap-2 mt-4 justify-content-center">
          <FloatLabel className="flex flex-column">
            <InputText
              id="email"
              className={`w-full md:w-20rem ${
                !emailValidation ? "p-invalid" : ""
              }`}
              value={currentContact.email}
              onChange={(e) =>
                handleNewContactFieldChange("email", e.target.value)
              }
            />
            <label htmlFor="email">Email</label>
            {!emailValidation && (
              <small className="p-error mt-1">Enter a valid email.</small>
            )}
          </FloatLabel>

          <FloatLabel>
            <InputMask
              id="phoneNumber"
              placeholder="Enter phone number"
              value={currentContact?.phoneNumber?.toString() || ""}
              disabled={isEditable}
              onChange={(e) =>
                handleNewContactFieldChange(
                  "phoneNumber",
                  e.target.value || null
                )
              }
              className="w-full md:w-20rem"
              mask="(999) 999-9999"
            />
            <label htmlFor="phonenumber">Phone Number</label>
          </FloatLabel>
        </div>
      </Dialog>
    </div>
  );
}
