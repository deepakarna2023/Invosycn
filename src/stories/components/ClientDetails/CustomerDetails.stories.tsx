import React from 'react';
import { StoryFn } from '@storybook/react';
import CustomerDetails from '../../../components/ClientDetails/CustomerDetails';

export default {
    title: 'Components/ClientDetails/CustomerDetail',
    component: CustomerDetails,
};

// Template to define args for each story variation
const Template: StoryFn<{
    firstName: string;
    lastName: string;
    email: string;
}> = (args) => <CustomerDetails {...args} />;

export const Default = Template.bind({});
Default.args = {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
};

export const AnotherCustomer = Template.bind({});
AnotherCustomer.args = {
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane.smith@example.com',
};
