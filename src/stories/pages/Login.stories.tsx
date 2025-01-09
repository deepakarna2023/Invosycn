import LoginPage from '../../pages/auth/LoginPage';
import { MemoryRouter } from "react-router-dom";
import { StoryFn } from '@storybook/react/*';

export default {
  title: 'Pages/Auth/Login',
  component: LoginPage,
  decorators: [
    (Story: StoryFn) => (
      <MemoryRouter>
        <Story />
      </MemoryRouter>
    ),
  ],
};

const Template = (args: any) => <LoginPage {...args} />;

export const Default = Template.bind({});