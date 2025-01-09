/** @type { import('@storybook/react').Preview } */
import 'primereact/resources/themes/lara-light-blue/theme.css';
import { PrimeReactProvider } from 'primereact/api';
import 'primereact/resources/primereact.css';
import { Provider } from "react-redux";
import store from "../src/redux/store";
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';
import React from 'react';

const preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
  decorators: [
    (Story) => (
      <Provider store={store}>
        <PrimeReactProvider>
          <Story />
        </PrimeReactProvider>
      </Provider>
    ),
  ],
};

export default preview;
