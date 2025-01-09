import ClientDetailPage from '../../../pages/client/ClientDetailPage';
import { MemoryRouter } from 'react-router-dom';
import { StoryFn } from '@storybook/react/*';

export default {
    title: 'Pages/Clients/Client',
    component: ClientDetailPage,
    decorators: [
        (Story: StoryFn) => (
          <MemoryRouter>
            <Story />
          </MemoryRouter>
        ),
      ],
};

const Template = (args : any) => <ClientDetailPage {...args} />;

export const Default = Template.bind({});