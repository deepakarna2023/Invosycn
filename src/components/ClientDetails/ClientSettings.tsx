import React, { useState, useEffect } from "react";
import { Chip } from "primereact/chip";
import { Calendar } from "primereact/calendar";
import { Button } from "primereact/button";
import { Slider } from "primereact/slider";
import "../../assets/styles/ClientSetting.scss";
import { SelectButton } from "primereact/selectbutton";
import AutomationSetting from "../../models/AutomationSetting";
import ContactsModel from "../../models/ContactsModel";
import { MultiSelect } from "primereact/multiselect";

interface SettingsProps {
  invoiceSetting?: AutomationSetting | null;
  setSelectedOptions: React.Dispatch<React.SetStateAction<any>>;
  selectedContacts: ContactsModel[] | null;
  setSelectedContacts: React.Dispatch<React.SetStateAction<ContactsModel[]>>;
  setAutomationSetting: React.Dispatch<
    React.SetStateAction<AutomationSetting | null>
  >;
  contactInfo?: ContactsModel[] | [];
  date: Date | null;
  setDate: React.Dispatch<React.SetStateAction<Date | null>>;
  isEditable: boolean;
  isSent?: boolean;
}

const ClientSettings: React.FC<SettingsProps> = ({
  invoiceSetting,
  setSelectedOptions,
  selectedContacts,
  setSelectedContacts,
  setAutomationSetting,
  date,
  setDate,
  isEditable,
  contactInfo,
  isSent
}) => {
  const [billingPeriodStartDate, setPeriodStartDate] = useState<Date | null>(
    new Date()
  );
  const [billingPeriodDay, setBillingPeriodDay] = useState<number>(0);
  const [automatedProcess, setAutomatedProcess] = useState<number>(0);

  const billingOptions = [
    "Daily",
    "Weekly",
    "BiWeekly",
    "Monthly",
    "Semi-Monthly",
    "Annually",
  ];
  const automaticallyOptions = [
    {
      title: "No Automation",
      description: "Nothing about your invoices will be automated.",
    },
    {
      title: "Some Automation",
      description:
        "We will create an invoice for this client but we won't add items to it.",
    },
    {
      title: "More Automation",
      description:
        "We will create an invoice for this client and add items from your system of record.",
    },
    {
      title: "Full Automation",
      description:
        "We will create this invoice, add items, and email it to your client. If we notice a validation error, we will alert you before sending the invoice.",
    },
  ];

  useEffect(() => {
    if (invoiceSetting) {
      setAutomatedProcess(
        invoiceSetting.isCreateInvoice
          ? 1
          : invoiceSetting.isBuildInvoice
          ? 2
          : invoiceSetting.isSendInvoice
          ? 3
          : 0
      );
      const startDate = invoiceSetting.billingStartDate
        ? new Date(invoiceSetting.billingStartDate)
        : new Date();
      setPeriodStartDate(startDate);
      setSelectedContacts(invoiceSetting?.sendTo || []);
  
      const billingPeriod = invoiceSetting?.billingPeriod;
      const billingPeriodIndex = billingOptions.indexOf(billingPeriod || "");
  
      if (billingPeriodIndex !== -1) {
        setBillingPeriodDay(billingPeriodIndex);
      } else {
        setBillingPeriodDay(0);
      }
    }
  }, [invoiceSetting]); // Run only once when the component mounts
  

  const handleBillingPeriodChange = (value: number) => {
    debugger;
    setBillingPeriodDay(value);

    const { nextDate, period } = calculateNextDate(value);

    if (nextDate) {
      handleUpdateSetting({
        billingStartDate: date,
        billingEndDate: nextDate,
        billingPeriod: period,
      });

      setDate(nextDate); // For example, updating the date after the period change
    }
  };

  const handleAutomationChange = (value: number) => {
    setAutomatedProcess(value);

    let updatedSetting = {
      isCreateInvoice: false,
      isBuildInvoice: false,
      isSendInvoice: false,
    };

    if (value === 1) {
      updatedSetting.isCreateInvoice = true;
    } else if (value === 2) {
      updatedSetting.isBuildInvoice = true;
    } else if (value === 3) {
      updatedSetting.isSendInvoice = true;
    }

    handleUpdateSetting(updatedSetting);

    setSelectedOptions({
      IsCreateInvoice: updatedSetting.isCreateInvoice,
      IsBuildInvoice: updatedSetting.isBuildInvoice,
      IsSendInvoice: updatedSetting.isSendInvoice,
    });
  };

  const handleContactsChange = (value: ContactsModel[]) => {
    setSelectedContacts(value);
    handleUpdateSetting({ sendTo: value });
  };

  const calculateNextDate = (
    periodIndex: number
  ): { nextDate: Date | null; period: string } => {
    if (!billingPeriodStartDate || !(billingPeriodStartDate instanceof Date) || isNaN(billingPeriodStartDate.getTime())) {
      return { nextDate: null, period: "" };
    }

    const nextDate = new Date(billingPeriodStartDate); 

    const periodMapping: Record<number, string> = {
      0: "Daily",
      1: "Weekly",
      2: "BiWeekly",
      3: "Monthly",
      4: "Semi-Monthly",
      5: "Annually",
    };

    const period = periodMapping[periodIndex];

    switch (period) {
      case "Daily":
        nextDate.setDate(nextDate.getDate() + 1);
        break;
      case "Weekly":
        nextDate.setDate(nextDate.getDate() + 7);
        break;
      case "BiWeekly":
        nextDate.setDate(nextDate.getDate() + 14);
        break;
      case "Monthly":
        nextDate.setMonth(nextDate.getMonth() + 1);
        break;
      case "Semi-Monthly":
        nextDate.setDate(nextDate.getDate() + 15);
        break;
      case "Annually":
        nextDate.setFullYear(nextDate.getFullYear() + 1);
        break;
      default:
        break;
    }

    return { nextDate, period };
  };

  const handleUpdateSetting = (changes: Partial<AutomationSetting>) => {
    setAutomationSetting((prevSetting: any) => ({
      ...prevSetting,
      ...changes,
    }));
  };

  const handleSelectButtonChange = (e: { value: number }) => {
    debugger;
    if (e.value !== undefined && e.value !== null) {
      setAutomatedProcess(e.value);

      let updatedSetting = {
        isCreateInvoice: false,
        isBuildInvoice: false,
        isSendInvoice: false,
      };

      if (e.value === 1) {
        updatedSetting.isCreateInvoice = true;
      } else if (e.value === 2) {
        updatedSetting.isBuildInvoice = true;
      } else if (e.value === 3) {
        updatedSetting.isSendInvoice = true;
      }

      handleUpdateSetting(updatedSetting);

      const updatedOptionSetting = {
        IsCreateInvoice: updatedSetting.isCreateInvoice,
        IsBuildInvoice: updatedSetting.isBuildInvoice,
        IsSendInvoice: updatedSetting.isSendInvoice,
      };

      setSelectedOptions(updatedOptionSetting);
    }
  };
  const handleRemoveContact = (contact: ContactsModel) => {
    const updatedContacts = selectedContacts?.filter(c => c.email !== contact.email);
    
    setSelectedContacts(updatedContacts || []);
    
    handleUpdateSetting({ sendTo: updatedContacts });
  };

  return (
    <div>
      <div className="flex flex-row gap-2 mb-2">
        <i className="pi pi-cog text-primary-500 text-xl"></i>
        <span className="text-600 mb-2">Automation Setting</span>
      </div>
      <div className="flex flex-column w-auto">
        <Slider
          value={automatedProcess}
          onChange={(e) => handleAutomationChange(e.value as number)}
          max={3}
          disabled={isEditable || isSent}
          className="mx-8 mt-2"
        />
        <SelectButton
          value={automatedProcess}
          onChange={(e) => handleSelectButtonChange(e)}
          disabled={isEditable || isSent}
          options={automaticallyOptions.map((option, index) => ({
            label: option.title,
            value: index,
          }))}
          className="mt-3 flex"
        />
        <p className="text-gray-700 text-center text-md mb-4">
          {automaticallyOptions[automatedProcess]?.description}
        </p>
      </div>
      <label className="ml-2">Send Invoice To</label>
      <div>
        <div className="email-input-container p-4 align-items-center font-semibold">
          <label>Email Addresses</label>
          <div className="w-auto">
            <MultiSelect
              value={selectedContacts}
              onChange={(e) => handleContactsChange(e.value)}
              options={contactInfo}
              optionLabel="email"
              disabled={isEditable || isSent}
              display="chip"
              placeholder="Select Contact..."
              maxSelectedLabels={2}
              className="w-full md:w-22rem"
              style={{ wordBreak: "break-word" }}
              removeIcon={!isEditable}
            />
          </div>
        </div>
      </div>
      <div className="selected-contacts-row my-3 flex flex-wrap">
        {selectedContacts?.map((contact, index) => (
          <div key={index} className="flex mb-3 mr-2 items-center" style={{ wordBreak: "break-word" }}>
            <Chip label={contact.email} />
            <Button
              icon="pi pi-times"
              rounded
              className="p-button-danger p-button-rounded p-button-text"
              onClick={() => handleRemoveContact(contact)}
              disabled={isEditable || isSent}
            />
          </div>
        ))}
      </div>

      <label className="ml-2">Billing Date </label>
      <div className="flex p-4 gap-7 align-items-center font-semibold">
        <label>Start Date</label>
        <Calendar
          value={billingPeriodStartDate}
          onChange={(e) => setDate(e.value ?? null)}
          showIcon
          disabled={isEditable || isSent}
          placeholder="Select Start Date"
        />
      </div>

      <label className="ml-2">Billing Period</label>
      <div className="p-4">
        <Slider
          value={billingPeriodDay}
          onChange={(e) => handleBillingPeriodChange(e.value as number)}
          max={5}
          disabled={!date || isEditable || isSent}
          className="mx-6"
        />
        <SelectButton
          value={billingPeriodDay}
          onChange={(e) => handleBillingPeriodChange(e.value as number)}
          disabled={isEditable || isSent}
          options={billingOptions.map((option, index) => ({
            label: (
              <div className="text-center">
                <span className="font-semibold text-xs">{option}</span>
              </div>
            ),
            value: index,
          }))}
          className="my-3 flex"
        />
        <div className="flex justify-content-around">
          {billingOptions.map((label, index) => (
            <div key={index} className="text-center">
              <span className="font-semibold text-sm">
                {calculateNextDate(index)?.nextDate?.toLocaleDateString() ||
                  "Invalid Date"}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ClientSettings;
