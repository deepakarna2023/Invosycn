import DashboardPage from '../../pages/DashboardPage';
import { MemoryRouter } from "react-router-dom";
import { StoryFn } from "@storybook/react/*";

export default {
  title: 'Pages/Dashboard',
  component: DashboardPage,
  decorators: [
    (Story: StoryFn) => (
      <MemoryRouter>
        <Story />
      </MemoryRouter>
    ),
  ],
};

const Template = (args: any) => <DashboardPage {...args} />;

export const Default = Template.bind({});