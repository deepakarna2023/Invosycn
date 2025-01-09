import SettingPage from "../../pages/SettingPage";
import { StoryFn } from "@storybook/react";
import { Provider } from "react-redux";
import store from "../../redux/store";

export default {
    title: "Pages/Settings",
    component: SettingPage,
    decorators: [
        (Story: StoryFn) => (
            <Provider store={store}>
                <Story />
            </Provider>
        ),
    ],
};

const Template = (args: any) => <SettingPage {...args} />;

export const Default = Template.bind({});