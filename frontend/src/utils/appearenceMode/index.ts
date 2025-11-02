import { createTheme } from '@mui/material/styles';

export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    // Optional: customize colors
    primary: {
      main: '#90caf9', // Example primary color for dark mode
    },
    secondary: {
      main: '#f48fb1', // Example secondary color for dark mode
    },
  },
});