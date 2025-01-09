import React from 'react';
import ClientsListPage from '../../../pages/client/ClientsListPage';
import { StoryFn } from '@storybook/react/*';
import { MemoryRouter } from 'react-router-dom';

export default {
    title: 'Pages/Clients/ClientsListPage',
    component: ClientsListPage,
    decorators: [
        (Story: StoryFn) => (
            <MemoryRouter>
                <Story />
            </MemoryRouter>
        ),
    ],
};

const Template = (args: any) => <ClientsListPage {...args} />;

export const Default = Template.bind({});
