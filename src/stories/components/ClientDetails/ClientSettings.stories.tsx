import React from 'react';
import { StoryFn } from '@storybook/react';
import ClientSettings from '../../../components/ClientDetails/ClientSettings';
import ContactsModel from '../../../models/ContactsModel';
import AutomationSetting from '../../../models/AutomationSetting';

export default {
    title: 'Components/ClientDetails/ClientSettings',
    component: ClientSettings,
};

// Dummy data for testing
const dummyEmails = [
    {
        "id": "1a2b3c4d",
        "clientId": "client-001",
        "email": "john.doe@example.com",
        "firstName": "John",
        "lastName": "Doe",
        "phoneNumber": 1234567890
      },
      {
        "id": "5e6f7g8h",
        "clientId": "client-002",
        "email": "jane.smith@example.com",
        "firstName": "Jane",
        "lastName": "Smith",
        "phoneNumber": 9876543210
      }
];

const dummyProfile = { HasSystemIntegration: true };

// Dummy handler functions
const handleSave = () => {
    console.log("Save button clicked");
};

const Template: StoryFn<{
    profile: typeof dummyProfile;
    selectedOptions: any;
    setSelectedOptions: React.Dispatch<React.SetStateAction<any>>;
    selectedContacts: ContactsModel[] | null;
    setSelectedContacts: React.Dispatch<React.SetStateAction<ContactsModel[]>>;
    checked: string;
    setChecked: React.Dispatch<React.SetStateAction<string>>;
    date: Date | null;
    setDate: React.Dispatch<React.SetStateAction<Date | null>>;
    onSave: () => void;
    saveButtonDisabled: boolean;
    isEditable: boolean | false
    setBillingPeriod: React.Dispatch<React.SetStateAction<Date | null>>;
    setAutomationSetting: React.Dispatch<React.SetStateAction<AutomationSetting | null>>
}> = (args) => <ClientSettings {...args} />;

export const Default = Template.bind({});
Default.args = {
    profile: dummyProfile,
    selectedOptions: { IsCreateInvoice: false, IsBuildInvoice: false, IsSendInvoice: false },
    selectedContacts: dummyEmails,
    setSelectedContacts: (value) => console.log("Checked: ", value),
    checked: "checked",
    setChecked: (value) => console.log("Checked: ", value),
    date: new Date(),
    setDate: (date) => console.log("Date: ", date),
    onSave: handleSave,
    saveButtonDisabled: false,
};
