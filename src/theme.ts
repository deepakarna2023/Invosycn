import { createTheme, Theme } from '@mui/material/styles';

// Create the theme using TypeScript
const theme: Theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2', // blue
    },
    secondary: {
      main: '#FFFFFF', // white
    },
  },
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif',
  },
});

export default theme;
