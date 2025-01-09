import React from 'react';
import ReportPage from '../../pages/ReportPage';

export default {
    title: 'Pages/Report',
    component: ReportPage,
};

const Template = (args : any) => <ReportPage {...args} />;

export const Default = Template.bind({});