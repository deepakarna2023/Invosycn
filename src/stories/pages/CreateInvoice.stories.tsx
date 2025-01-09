import { BaseClientService } from '../../services/baseServices/BaseClientService';
import CreateInvoicePage from '../../pages/CreateInvoicePage';
import { MemoryRouter } from "react-router-dom";
import { StoryFn } from "@storybook/react";

export default {
  title: 'Pages/CreateInvoice',
  component: CreateInvoicePage,
  argTypes: {
    clientService: { control: false },
  },
  decorators: [
    (Story: StoryFn) => (
      <MemoryRouter>
        <Story />
      </MemoryRouter>
    ),
  ],
};

const Template = (args: any) => <CreateInvoicePage {...args} />;

export const Default = Template.bind({});

