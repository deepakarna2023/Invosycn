import React from 'react';
import RegistrationPage from '../../pages/auth/RegistrationPage';

export default {
    title: 'Pages/Auth/Registration',
    component: RegistrationPage,
};

const Template = (args : any) => <RegistrationPage {...args} />;

export const Default = Template.bind({});