import InvoiceHistoryPage from "../../pages/InvoiceHistorypage";
import { MemoryRouter } from "react-router-dom";
import { StoryFn } from "@storybook/react/*";

export default {
  title: "Pages/InvoiceHistoryPage",
  component: InvoiceHistoryPage,
  decorators: [
    (Story: StoryFn) => (
      <MemoryRouter>
        <Story />
      </MemoryRouter>
    ),
  ],
};

const Template = (args: any) => <InvoiceHistoryPage {...args} />;

export const Default = Template.bind({});