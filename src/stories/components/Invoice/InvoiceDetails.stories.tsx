import React from 'react';
import InvoiceDetails from '../../../components/Invoice/InvoiceDetails';

export default {
    title: 'Components/Invoice/InvoiceDetails',
    component: InvoiceDetails,
};

const Template = (args : any) => <InvoiceDetails {...args} />;

export const Default = Template.bind({});